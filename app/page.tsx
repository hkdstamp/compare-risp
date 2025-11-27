'use client'

import { useState } from 'react'
import SimulationConfig from '@/components/SimulationConfig'
import SimulationResults from '@/components/SimulationResults'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ResourceSelector from '@/components/ResourceSelector'
import { SimulationResult, ResourceConfig } from '@/lib/types'
import { defaultResources } from '@/lib/pricing-catalog'

export default function Home() {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resources, setResources] = useState<ResourceConfig[]>(defaultResources)

  const handleSimulate = async (params: any) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...params,
          resources // Include selected resources in simulation
        })
      })

      if (!response.ok) {
        throw new Error('Simulation failed')
      }

      const data = await response.json()
      setSimulationResult(data)
    } catch (error) {
      console.error('Error:', error)
      alert('シミュレーションエラーが発生しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600">
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <main className="space-y-6">
          <ResourceSelector resources={resources} onChange={setResources} />
          
          <SimulationConfig onSimulate={handleSimulate} isLoading={isLoading} />
          
          {isLoading && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="text-gray-600">計算中...</p>
              </div>
            </div>
          )}
          
          {simulationResult && !isLoading && (
            <SimulationResults result={simulationResult} />
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  )
}
