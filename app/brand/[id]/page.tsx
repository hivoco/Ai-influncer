'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Campaign, Persona } from '@/lib/types'

type FormType = 'campaign' | 'persona'

export default function BrandDetailPage() {
  const router = useRouter()
  const params = useParams()
  const brandId = params.id as string

  const [activeForm, setActiveForm] = useState<FormType>('campaign')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [personas, setPersonas] = useState<Persona[]>([])

  // Campaign form state
  const [campaignName, setCampaignName] = useState('')
  const [campaignPrompt, setCampaignPrompt] = useState('')
  const [campaignObjective, setCampaignObjective] = useState('')

  // Persona form state
  const [personaName, setPersonaName] = useState('')
  const [personaBio, setPersonaBio] = useState('')
  const [tone, setTone] = useState(5)
  const [witty, setWitty] = useState(5)
  const [aspiration, setAspiration] = useState(5)
  const [cta, setCta] = useState('')
  const [safetyNotes, setSafetyNotes] = useState('')

  useEffect(() => {
    // Load data from localStorage
    const storedCampaigns = localStorage.getItem(`campaigns-${brandId}`)
    const storedPersonas = localStorage.getItem(`personas-${brandId}`)

    if (storedCampaigns) setCampaigns(JSON.parse(storedCampaigns))
    if (storedPersonas) setPersonas(JSON.parse(storedPersonas))
  }, [brandId])

  const handleCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: campaignName,
      prompt: campaignPrompt,
      objective: campaignObjective,
      createdAt: new Date().toISOString(),
    }

    const updatedCampaigns = [...campaigns, newCampaign]
    setCampaigns(updatedCampaigns)
    localStorage.setItem(`campaigns-${brandId}`, JSON.stringify(updatedCampaigns))

    // Reset form
    setCampaignName('')
    setCampaignPrompt('')
    setCampaignObjective('')
  }

  const handlePersonaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPersona: Persona = {
      id: Date.now().toString(),
      name: personaName,
      bio: personaBio,
      tone,
      witty,
      aspiration,
      cta,
      safetyNotes,
      createdAt: new Date().toISOString(),
    }

    const updatedPersonas = [...personas, newPersona]
    setPersonas(updatedPersonas)
    localStorage.setItem(`personas-${brandId}`, JSON.stringify(updatedPersonas))

    // Reset form
    setPersonaName('')
    setPersonaBio('')
    setTone(5)
    setWitty(5)
    setAspiration(5)
    setCta('')
    setSafetyNotes('')
  }

  const deleteCampaign = (id: string) => {
    const updatedCampaigns = campaigns.filter(c => c.id !== id)
    setCampaigns(updatedCampaigns)
    localStorage.setItem(`campaigns-${brandId}`, JSON.stringify(updatedCampaigns))
  }

  const deletePersona = (id: string) => {
    const updatedPersonas = personas.filter(p => p.id !== id)
    setPersonas(updatedPersonas)
    localStorage.setItem(`personas-${brandId}`, JSON.stringify(updatedPersonas))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Brand Details</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Buttons */}
        <div className="flex justify-end gap-4 mb-8">
          <button
            onClick={() => setActiveForm('persona')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeForm === 'persona'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Create Persona
          </button>
          <button
            onClick={() => setActiveForm('campaign')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeForm === 'campaign'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Register New Campaign
          </button>
        </div>

        {/* Forms */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {activeForm === 'campaign' ? (
            <form onSubmit={handleCampaignSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Register New Campaign</h2>

              <div>
                <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  id="campaignName"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="campaignPrompt" className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Prompt (Optional)
                </label>
                <input
                  type="text"
                  id="campaignPrompt"
                  value={campaignPrompt}
                  onChange={(e) => setCampaignPrompt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="campaignObjective" className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Objective *
                </label>
                <textarea
                  id="campaignObjective"
                  value={campaignObjective}
                  onChange={(e) => setCampaignObjective(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
              >
                Submit Campaign
              </button>
            </form>
          ) : (
            <form onSubmit={handlePersonaSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Persona</h2>

              <div>
                <label htmlFor="personaName" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="personaName"
                  value={personaName}
                  onChange={(e) => setPersonaName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="personaBio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio *
                </label>
                <textarea
                  id="personaBio"
                  value={personaBio}
                  onChange={(e) => setPersonaBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
                  Tone: {tone}
                </label>
                <input
                  type="range"
                  id="tone"
                  min="1"
                  max="10"
                  value={tone}
                  onChange={(e) => setTone(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label htmlFor="witty" className="block text-sm font-medium text-gray-700 mb-2">
                  Witty: {witty}
                </label>
                <input
                  type="range"
                  id="witty"
                  min="1"
                  max="10"
                  value={witty}
                  onChange={(e) => setWitty(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label htmlFor="aspiration" className="block text-sm font-medium text-gray-700 mb-2">
                  Aspiration: {aspiration}
                </label>
                <input
                  type="range"
                  id="aspiration"
                  min="1"
                  max="10"
                  value={aspiration}
                  onChange={(e) => setAspiration(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label htmlFor="cta" className="block text-sm font-medium text-gray-700 mb-2">
                  CTA *
                </label>
                <input
                  type="text"
                  id="cta"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="safetyNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Safety Notes *
                </label>
                <textarea
                  id="safetyNotes"
                  value={safetyNotes}
                  onChange={(e) => setSafetyNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
              >
                Create Persona
              </button>
            </form>
          )}
        </div>

        {/* Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personas List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Personas</h3>
            {personas.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No personas created yet</p>
            ) : (
              <div className="space-y-4">
                {personas.map((persona) => (
                  <div key={persona.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{persona.name}</h4>
                      <button
                        onClick={() => deletePersona(persona.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{persona.bio}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                      <div>Tone: {persona.tone}/10</div>
                      <div>Witty: {persona.witty}/10</div>
                      <div>Aspiration: {persona.aspiration}/10</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <div className="font-medium">CTA: {persona.cta}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campaigns List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Campaigns</h3>
            {campaigns.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No campaigns registered yet</p>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{campaign.name}</h4>
                      <button
                        onClick={() => deleteCampaign(campaign.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    {campaign.prompt && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Prompt:</span> {campaign.prompt}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Objective:</span> {campaign.objective}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}