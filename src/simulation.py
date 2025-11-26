#!/usr/bin/env python3
"""Cost optimization simulator for MSPs using Standard RI/SP and Insurance RI/SP models."""

from __future__ import annotations

import argparse
import json
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple

Currency = float


@dataclass
class ResourceConfig:
    service: str
    instance: str
    quantity: int
    usage: float = 1.0  # utilisation ratio (0-1)
    coverage: float = 1.0  # portion of quantity covered by selected commitment (0-1)


@dataclass
class PlanResult:
    name: str
    monthly_cost: Currency
    monthly_savings: Currency
    monthly_cash_savings: Currency
    initial_cost: Currency
    premium: Currency
    break_even_months: Optional[int]


class PricingCatalog:
    def __init__(self, data: Dict):
        self._data = data

    @property
    def hours_per_month(self) -> int:
        return int(self._data["metadata"].get("hours_per_month", 730))

    @property
    def insurance_plans(self) -> Dict[str, Dict]:
        return self._data["insurance_plans"]

    def on_demand_rate(self, service: str, instance: str) -> Currency:
        try:
            return self._data["resources"][service][instance]["on_demand_hourly_usd"]
        except KeyError as exc:
            raise KeyError(f"Missing on-demand rate for {service}:{instance}") from exc

    def standard_plan(self, service: str, instance: str, term: str, option: str) -> Dict[str, Currency]:
        try:
            return self._data["resources"][service][instance]["standard_ri"][term][option]
        except KeyError as exc:
            raise KeyError(
                f"Standard RI/SP pricing for {service}:{instance} does not support term '{term}' with option '{option}'."
            ) from exc


@dataclass
class ResourceMetrics:
    baseline_cost: Currency
    reserved_monthly_cost: Currency
    reserved_cash_monthly: Currency
    upfront_cost: Currency
    premium: Currency


def _clamp_ratio(value: float, name: str) -> float:
    if not (0.0 <= value <= 1.0):
        raise ValueError(f"{name} must be between 0 and 1 inclusive (got {value}).")
    return value


def load_pricing(path: Path) -> PricingCatalog:
    with path.open(encoding="utf-8") as fh:
        data = json.load(fh)
    return PricingCatalog(data)


def load_resources(path: Path) -> List[ResourceConfig]:
    with path.open(encoding="utf-8") as fh:
        items = json.load(fh)
    resources: List[ResourceConfig] = []
    for item in items:
        resources.append(
            ResourceConfig(
                service=item["service"],
                instance=item["instance"],
                quantity=int(item["quantity"]),
                usage=_clamp_ratio(float(item.get("usage", 1.0)), "usage"),
                coverage=_clamp_ratio(float(item.get("coverage", 1.0)), "coverage"),
            )
        )
    return resources


def compute_standard_plan(
    catalog: PricingCatalog,
    resources: List[ResourceConfig],
    term: str,
    option: str,
    hours_per_month: Optional[int] = None,
) -> Tuple[PlanResult, Dict[str, ResourceMetrics]]:
    hours = hours_per_month or catalog.hours_per_month
    total_baseline = 0.0
    total_monthly_effective = 0.0
    total_monthly_cash_savings = 0.0
    total_initial_cost = 0.0
    per_resource: Dict[str, ResourceMetrics] = {}

    for res in resources:
        on_demand_rate = catalog.on_demand_rate(res.service, res.instance)
        plan = catalog.standard_plan(res.service, res.instance, term, option)

        reserved_rate = plan["hourly_usd"]
        upfront = plan["upfront_usd"]
        term_months = 12 if term == "1yr" else 36

        coverage_qty = res.quantity * res.coverage
        remaining_qty = max(res.quantity - coverage_qty, 0)

        baseline = on_demand_rate * hours * res.quantity * res.usage

        reserved_monthly_recurring = reserved_rate * hours * coverage_qty
        reserved_monthly_amortized = (upfront * coverage_qty) / term_months
        reserved_monthly_effective = reserved_monthly_recurring + reserved_monthly_amortized

        remaining_monthly_cost = on_demand_rate * hours * remaining_qty * res.usage

        monthly_effective = reserved_monthly_effective + remaining_monthly_cost
        monthly_cash = baseline - (reserved_monthly_recurring + remaining_monthly_cost)

        per_resource_key = f"{res.service}:{res.instance}"
        per_resource[per_resource_key] = ResourceMetrics(
            baseline_cost=baseline,
            reserved_monthly_cost=monthly_effective,
            reserved_cash_monthly=monthly_cash,
            upfront_cost=upfront * coverage_qty,
            premium=0.0,
        )

        total_baseline += baseline
        total_monthly_effective += monthly_effective
        total_monthly_cash_savings += monthly_cash
        total_initial_cost += upfront * coverage_qty

    monthly_savings = total_baseline - total_monthly_effective
    break_even = None
    if total_initial_cost > 0 and total_monthly_cash_savings > 0:
        break_even = math.ceil(total_initial_cost / total_monthly_cash_savings)

    result = PlanResult(
        name=f"Standard RI/SP {term} {option}",
        monthly_cost=total_monthly_effective,
        monthly_savings=monthly_savings,
        monthly_cash_savings=total_monthly_cash_savings,
        initial_cost=total_initial_cost,
        premium=0.0,
        break_even_months=break_even,
    )
    return result, per_resource


def compute_insurance_plan(
    catalog: PricingCatalog,
    resources: List[ResourceConfig],
    insurance_key: str,
    hours_per_month: Optional[int] = None,
) -> Tuple[PlanResult, Dict[str, ResourceMetrics]]:
    hours = hours_per_month or catalog.hours_per_month
    plan = catalog.insurance_plans[insurance_key]
    discount = plan["discount_rate"]
    premium_rate = plan["premium_rate"]
    term_months = plan["term_months"]

    total_baseline = 0.0
    total_monthly_cost = 0.0
    total_premium = 0.0
    per_resource: Dict[str, ResourceMetrics] = {}

    for res in resources:
        on_demand_rate = catalog.on_demand_rate(res.service, res.instance)
        coverage_qty = res.quantity * res.coverage
        remaining_qty = max(res.quantity - coverage_qty, 0)

        baseline = on_demand_rate * hours * res.quantity * res.usage

        discounted_usage_cost = on_demand_rate * hours * coverage_qty * res.usage * (1.0 - discount)
        premium_base = on_demand_rate * hours * coverage_qty * discount
        premium = premium_base * premium_rate
        remaining_cost = on_demand_rate * hours * remaining_qty * res.usage

        monthly_cost = discounted_usage_cost + premium + remaining_cost

        per_resource_key = f"{res.service}:{res.instance}"
        per_resource[per_resource_key] = ResourceMetrics(
            baseline_cost=baseline,
            reserved_monthly_cost=monthly_cost,
            reserved_cash_monthly=baseline - (discounted_usage_cost + remaining_cost),
            upfront_cost=0.0,
            premium=premium,
        )

        total_baseline += baseline
        total_monthly_cost += monthly_cost
        total_premium += premium

    monthly_savings = total_baseline - total_monthly_cost
    # No upfront cost in insurance model
    break_even = 1 if monthly_savings > 0 else None

    result = PlanResult(
        name=f"Insurance RI/SP {plan['name']}",
        monthly_cost=total_monthly_cost,
        monthly_savings=monthly_savings,
        monthly_cash_savings=monthly_savings,  # cash savings equals effective savings (no upfront)
        initial_cost=0.0,
        premium=total_premium,
        break_even_months=break_even,
    )
    return result, per_resource


def currency(value: Currency) -> str:
    return f"${value:,.2f}"


def percentage(value: float) -> str:
    return f"{value * 100:.1f}%"


def render_summary(
    baseline_cost: Currency,
    insurance_result: PlanResult,
    standard_result: PlanResult,
) -> str:
    lines = []
    lines.append("==== 月次コスト比較 (東京リージョン / USD) ====")
    lines.append(f"通常価格 (On-Demand): {currency(baseline_cost)} / 月")
    lines.append("")
    header = (
        "プラン",
        "月次コスト",
        "月次削減額",
        "初期コスト",
        "保険料",
        "損益分岐月",
    )
    rows = []
    for plan in (insurance_result, standard_result):
        break_even = plan.break_even_months if plan.break_even_months is not None else "-"
        rows.append(
            (
                plan.name,
                currency(plan.monthly_cost),
                currency(plan.monthly_savings),
                currency(plan.initial_cost),
                currency(plan.premium),
                break_even,
            )
        )

    col_widths = [max(len(str(row[idx])) for row in ([header] + rows)) for idx in range(len(header))]
    lines.append(
        "  ".join(str(header[idx]).ljust(col_widths[idx]) for idx in range(len(header)))
    )
    lines.append("  ".join("-" * col_widths[idx] for idx in range(len(header))))
    for row in rows:
        lines.append("  ".join(str(row[idx]).ljust(col_widths[idx]) for idx in range(len(header))))

    lines.append("")
    lines.append("※ 月次削減額は通常価格との差額 (保険料/アップフロント費用の償却を含む) を示します。")
    lines.append("※ MSP想定粗利 = 月次削減額。")
    return "\n".join(lines)


def parse_standard_choice(choice: str) -> Tuple[str, str]:
    parts = choice.split(":")
    if len(parts) != 2:
        raise argparse.ArgumentTypeError(
            "--standard は '1yr:NoUpfront' のように <期間>:<支払いオプション> 形式で指定してください。"
        )
    term, option = parts[0].strip(), parts[1].strip()
    if term not in {"1yr", "3yr"}:
        raise argparse.ArgumentTypeError("期間は 1yr または 3yr を指定してください。")
    valid_options = {"NoUpfront", "PartialUpfront", "AllUpfront"}
    if option not in valid_options:
        raise argparse.ArgumentTypeError(f"支払いオプションは {', '.join(sorted(valid_options))} から選択してください。")
    return term, option


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="MSP向け RI/SP + 保険 シミュレーションツール",
    )
    parser.add_argument(
        "--pricing",
        type=Path,
        default=Path("data/pricing.json"),
        help="PricingカタログJSONファイルへのパス",
    )
    parser.add_argument(
        "--resources",
        type=Path,
        default=Path("data/resources.json"),
        help="シミュレーション対象リソース定義JSONファイルへのパス",
    )
    parser.add_argument(
        "--insurance",
        choices=["30d", "1y"],
        default="1y",
        help="利用する保険RI/SPプラン (default: 1y)",
    )
    parser.add_argument(
        "--standard",
        type=parse_standard_choice,
        default="1yr:NoUpfront",
        help="比較対象となる標準RI/SP (例: 1yr:NoUpfront)",
    )
    parser.add_argument(
        "--usage",
        type=float,
        default=None,
        help="全リソース共通の利用率 (0-1)。指定しない場合は設定ファイル値を使用",
    )
    parser.add_argument(
        "--coverage",
        type=float,
        default=None,
        help="全リソース共通のカバレッジ率 (0-1)。指定しない場合は設定ファイル値を使用",
    )
    parser.add_argument(
        "--hours",
        type=int,
        default=None,
        help="月間時間数 (デフォルトはpricing.jsonのmetadata.hours_per_month)",
    )
    parser.add_argument(
        "--detail",
        action="store_true",
        help="リソース単位の詳細内訳を表示",
    )
    return parser


def main(argv: Optional[List[str]] = None) -> int:
    parser = build_arg_parser()
    args = parser.parse_args(argv)

    if isinstance(args.standard, str):
        args.standard = parse_standard_choice(args.standard)

    catalog = load_pricing(args.pricing)
    resources = load_resources(args.resources)

    if args.usage is not None:
        usage = _clamp_ratio(args.usage, "usage")
        for res in resources:
            res.usage = usage
    if args.coverage is not None:
        coverage = _clamp_ratio(args.coverage, "coverage")
        for res in resources:
            res.coverage = coverage

    hours = args.hours or catalog.hours_per_month

    insurance_result, insurance_detail = compute_insurance_plan(
        catalog, resources, args.insurance, hours_per_month=hours
    )
    term, option = args.standard
    standard_result, standard_detail = compute_standard_plan(
        catalog, resources, term, option, hours_per_month=hours
    )

    baseline_cost = sum(
        catalog.on_demand_rate(res.service, res.instance)
        * hours
        * res.quantity
        * res.usage
        for res in resources
    )

    print(
        render_summary(
            baseline_cost=baseline_cost,
            insurance_result=insurance_result,
            standard_result=standard_result,
        )
    )

    if args.detail:
        print("\n---- 詳細内訳 ----")
        for key, metrics in sorted(insurance_detail.items()):
            std_metrics = standard_detail.get(key)
            insurance_savings = metrics.baseline_cost - metrics.reserved_monthly_cost
            print(
                f"{key}\n"
                f"  通常価格: {currency(metrics.baseline_cost)} / 月\n"
                f"  保険プラン: {currency(metrics.reserved_monthly_cost)} / 月 (保険料 {currency(metrics.premium)})\n"
                f"    → 削減: {currency(insurance_savings)} / 月"
            )
            if std_metrics:
                std_savings = std_metrics.baseline_cost - std_metrics.reserved_monthly_cost
                break_even = "-"
                if std_metrics.upfront_cost > 0 and std_metrics.reserved_cash_monthly > 0:
                    break_even = math.ceil(std_metrics.upfront_cost / std_metrics.reserved_cash_monthly)
                print(
                    f"  標準RI/SP: {currency(std_metrics.reserved_monthly_cost)} / 月 (初期 {currency(std_metrics.upfront_cost)})\n"
                    f"    → 削減: {currency(std_savings)} / 月, 損益分岐: {break_even} ヶ月"
                )
            print("")

    # Provide MSP-focused summary line
    print(
        "MSP想定粗利(保険プラン): " + currency(insurance_result.monthly_savings)
        + " / 月, "
        + "MSP想定粗利(標準RI/SP): " + currency(standard_result.monthly_savings) + " / 月"
    )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
