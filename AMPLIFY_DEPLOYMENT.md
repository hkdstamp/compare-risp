# AWS Amplify Deployment Guide

## Overview

This guide explains how to deploy the Alphaus MSP Revenue Simulator to AWS Amplify Hosting.

## Prerequisites

- AWS Account with Amplify access
- GitHub repository with the project code
- Git configured with proper credentials

## AWS Amplify Features

AWS Amplify Hosting supports:

- ✅ **Full Next.js 15 Support** - App Router, API Routes, Server Components
- ✅ **Node.js Runtime** - Full Node.js runtime for API Routes (no Edge runtime limitations)
- ✅ **Automatic Deployments** - CI/CD from GitHub/GitLab/Bitbucket
- ✅ **Custom Domains** - SSL/TLS certificates included
- ✅ **Global CDN** - Fast content delivery worldwide
- ✅ **Environment Variables** - Secure configuration management
- ✅ **Preview Deployments** - Branch-based preview environments

## Deployment Steps

### 1. Connect Your Repository

1. Go to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Select your Git provider (GitHub, GitLab, Bitbucket, or AWS CodeCommit)
4. Authorize AWS Amplify to access your repository
5. Select the repository: `compare-risp`
6. Select the branch: `main` or `genspark_ai_developer`

### 2. Configure Build Settings

AWS Amplify will automatically detect the Next.js project and generate build settings.

The `amplify.yml` file in the repository root defines the build configuration:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

**Key Configuration:**
- **Node.js Version**: Amplify uses Node.js 18.x by default
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Cache**: node_modules and .next/cache for faster builds

### 3. Configure App Settings (Optional)

#### Environment Variables

If you need to add environment variables:

1. In the Amplify Console, go to **App settings** → **Environment variables**
2. Add key-value pairs (e.g., `NEXT_PUBLIC_API_URL`)
3. Save changes

#### Custom Domain

To add a custom domain:

1. In the Amplify Console, go to **App settings** → **Domain management**
2. Click **"Add domain"**
3. Follow the DNS configuration instructions
4. SSL/TLS certificate is automatically provisioned

### 4. Deploy

1. Review the configuration
2. Click **"Save and deploy"**
3. Amplify will:
   - Clone your repository
   - Install dependencies (`npm ci`)
   - Build the project (`npm run build`)
   - Deploy to the global CDN

**Deployment typically takes 3-5 minutes.**

### 5. Access Your Application

Once deployed, you'll receive:
- **Default Domain**: `https://main.xxxxxxxxxxxxx.amplifyapp.com`
- **Custom Domain**: (if configured)

## Automatic Deployments

AWS Amplify automatically deploys when you push to the connected branch:

1. Push code to GitHub:
   ```bash
   git push origin main
   ```

2. Amplify automatically:
   - Detects the push
   - Starts a new build
   - Deploys if successful
   - Notifies you of the deployment status

## Branch-Based Deployments

You can set up different environments for different branches:

1. In Amplify Console, go to **App settings** → **Branch deployments**
2. Connect additional branches (e.g., `develop`, `staging`)
3. Each branch gets its own URL:
   - `main` → `https://main.xxxxxxxxxxxxx.amplifyapp.com`
   - `develop` → `https://develop.xxxxxxxxxxxxx.amplifyapp.com`

## API Routes on AWS Amplify

AWS Amplify fully supports Next.js API Routes with Node.js runtime:

- **GET /api/pricing** - Returns AWS pricing catalog
- **GET /api/resources** - Returns default resource configuration
- **POST /api/simulate** - Performs simulation calculations

No special configuration needed - API Routes work out of the box!

## Monitoring and Logs

### Build Logs

View build logs in the Amplify Console:

1. Go to your app in Amplify Console
2. Click on a build in the **Deployments** tab
3. View detailed logs for each phase

### Application Logs

To view runtime logs:

1. In Amplify Console, go to **Monitoring**
2. View CloudWatch logs for server-side rendering and API Routes

### Metrics

Monitor application performance:

- **Build Success Rate**
- **Deployment Duration**
- **Traffic and Bandwidth**
- **Error Rates**

## Troubleshooting

### Build Failures

**Issue**: `npm ci` fails
- **Solution**: Ensure `package-lock.json` is committed to the repository

**Issue**: TypeScript errors during build
- **Solution**: Fix TypeScript errors or temporarily disable in `next.config.js`

**Issue**: Out of memory during build
- **Solution**: Contact AWS Support to increase build resources

### Runtime Issues

**Issue**: API Routes return 404
- **Solution**: Ensure API Routes are in `app/api/` directory with proper exports

**Issue**: Environment variables not working
- **Solution**: Verify variables are prefixed with `NEXT_PUBLIC_` for client-side access

## Cost Estimation

AWS Amplify Hosting pricing:

- **Build Minutes**: $0.01 per build minute
- **Hosting**: $0.15 per GB stored + $0.15 per GB served
- **Free Tier**: 1,000 build minutes/month + 15 GB served/month

**Estimated Monthly Cost for This Project:**
- ~5 builds/month × 3 minutes = 15 build minutes = **$0.15**
- ~100 MB storage + 5 GB served = **$0.90**
- **Total**: ~$1.05/month (after free tier)

## Next Steps

After deployment:

1. ✅ Test all functionality (simulation, charts, API Routes)
2. ✅ Set up custom domain (optional)
3. ✅ Configure CI/CD notifications
4. ✅ Monitor application performance
5. ✅ Set up branch-based preview environments

## Support Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Next.js on AWS Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)
- [Amplify Hosting Pricing](https://aws.amazon.com/amplify/pricing/)
- [AWS Amplify Discord Community](https://discord.gg/amplify)

## Migration from Cloudflare Pages

If you were previously using Cloudflare Pages, AWS Amplify offers similar features:

| Feature | Cloudflare Pages | AWS Amplify |
|---------|-----------------|-------------|
| Next.js Support | ✅ Edge Runtime | ✅ Full Node.js Runtime |
| API Routes | ✅ Workers | ✅ Lambda Functions |
| Custom Domains | ✅ | ✅ |
| SSL/TLS | ✅ | ✅ |
| Git Integration | ✅ | ✅ |
| Preview Deployments | ✅ | ✅ |
| Global CDN | ✅ CloudFlare CDN | ✅ CloudFront CDN |

**Key Advantage**: AWS Amplify supports full Node.js runtime, enabling all Next.js features without restrictions.

---

**Ready to Deploy!** 🚀

Follow the steps above to deploy your application to AWS Amplify Hosting.
