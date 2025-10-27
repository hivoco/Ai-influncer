'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Campaign, Persona } from '@/lib/types'
import PostCard from '@/components/PostCard'

export default function GeneratePostsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const brandId = searchParams.get('brand_id')
    const campaignId = searchParams.get('campaign_id')

    const [campaignName, setCampaignName] = useState('')
    const [campaignPrompt, setCampaignPrompt] = useState('')
    const [selectedPlatform, setSelectedPlatform] = useState('')
    const [selectedPersona, setSelectedPersona] = useState('')
    const [personas, setPersonas] = useState<Persona[]>([])
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isShow, setIsShow] = useState(false)

    const socialMediaPlatforms = [
        { value: 'instagram', label: 'Instagram', icon: '📷' },
        { value: 'facebook', label: 'Facebook', icon: '👥' },
        { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
        { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
        { value: 'tiktok', label: 'TikTok', icon: '🎵' },
        { value: 'youtube', label: 'YouTube Shorts', icon: '▶️' },
        { value: 'reddit', label: 'Reddit', icon: '🤖' },
        { value: 'wikipedia', label: 'Wikipedia', icon: '📚' },
    ]

    let markdownText = `🚀 **Exciting News!**
I’m thrilled to share that I’ve recently [your announcement — e.g., *joined a new company*, *completed a major project*, *launched a product*, or *earned a certification*].

This journey has been filled with learning, collaboration, and growth — and I’m incredibly grateful to everyone who’s been part of it. 🙏  

Here are a few key takeaways from this experience:
- 💡 [Insight 1 — something you learned]
- 🤝 [Insight 2 — collaboration or teamwork lesson]
- 🌱 [Insight 3 — personal or professional growth]

I’m looking forward to the next chapter and continuing to [goal — e.g., *build impactful solutions*, *grow in my field*, *contribute to meaningful projects*].

Let’s connect and share insights! 👋  
#growth #learning #career #innovation
`
    useEffect(() => {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn')
        if (!isLoggedIn) {
            router.push('/login')
            return
        }

        // if (!brandId || !campaignId) {
        //   router.push('/dashboard')
        //   return
        // }

        // Load data from localStorage
        const storedCampaigns = localStorage.getItem(`campaigns-${brandId}`)
        const storedPersonas = localStorage.getItem(`personas-${brandId}`)

        if (storedCampaigns) {
            const parsedCampaigns = JSON.parse(storedCampaigns)
            setCampaigns(parsedCampaigns)

            // Find and prefill the specific campaign
            const campaign = parsedCampaigns.find((c: Campaign) => c.id === campaignId)
            if (campaign) {
                setCampaignName(campaign.name)
                setCampaignPrompt(campaign.prompt || '')
            }
        }

        if (storedPersonas) {
            setPersonas(JSON.parse(storedPersonas))
        }

        setIsLoading(false)
    }, [brandId, campaignId, router])

    const handleGeneratePost = (e: React.FormEvent) => {
        e.preventDefault()

        // Here you would typically send this to your backend API
        console.log('Generating post with:', {
            brandId,
            campaignId,
            campaignName,
            campaignPrompt,
            platform: selectedPlatform,
            persona: selectedPersona,
        })

        alert(`Generating post for ${selectedPlatform} using persona: ${selectedPersona}`)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <button
                        onClick={() => router.push(`/brand/${brandId}`)}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                        ← Back to Brand
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Generate Post</h1>
                    <div className="w-32"></div> {/* Spacer for alignment */}
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Left Side - Form */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Post Generation Form</h2>

                            <form onSubmit={handleGeneratePost} className="space-y-6">
                                {/* Campaign Name - Prefilled */}
                                <div>
                                    <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Campaign Name
                                    </label>
                                    <input
                                        type="text"
                                        id="campaignName"
                                        value={campaignName}
                                        onChange={(e) => setCampaignName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        readOnly
                                    />
                                </div>

                                {/* Campaign Prompt - Prefilled */}
                                <div>
                                    <label htmlFor="campaignPrompt" className="block text-sm font-medium text-gray-700 mb-2">
                                        Campaign Prompt
                                    </label>
                                    <textarea
                                        id="campaignPrompt"
                                        value={campaignPrompt}
                                        onChange={(e) => setCampaignPrompt(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                                        readOnly
                                    />
                                </div>

                                {/* Social Media Platform Dropdown */}
                                <div>
                                    <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
                                        Social Media Platform *
                                    </label>
                                    <select
                                        id="platform"
                                        value={selectedPlatform}
                                        onChange={(e) => setSelectedPlatform(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="">Select a platform</option>
                                        {socialMediaPlatforms.map((platform) => (
                                            <option key={platform.value} value={platform.value}>
                                                {platform.icon} {platform.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Persona Selection */}
                                <div>
                                    <label htmlFor="persona" className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Persona *
                                    </label>
                                    <select
                                        id="persona"
                                        value={selectedPersona}
                                        onChange={(e) => setSelectedPersona(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="">Select a persona</option>
                                        {personas.map((persona) => (
                                            <option key={persona.id} value={persona.id}>
                                                {persona.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Generate Button */}
                                <button
                                onClick={()=> setIsShow(true)}
                                    // type="submit"
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg hover:shadow-lg transition duration-200 font-semibold text-lg"
                                >
                                    Generate Post 🚀
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Side - Two Sections */}
                    <div className="w-96 flex flex-col gap-8 h-screen">
                        {/* Top Section - Campaigns/Prompts List */}
                        <div className="flex-1 bg-white rounded-xl shadow-lg p-6 overflow-hidden flex flex-col">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Campaign Prompts</h3>
                            <div className="flex-1 overflow-y-auto">
                                {campaigns.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No campaigns available</p>
                                ) : (
                                    <div className="space-y-3">
                                        {campaigns.map((campaign) => (
                                            <div
                                                key={campaign.id}
                                                className={`border rounded-lg p-4 hover:shadow-md transition ${campaign.id === campaignId
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-gray-200'
                                                    }`}
                                            >
                                                <h4 className="font-semibold text-gray-800 mb-2">{campaign.name}</h4>
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

                        {/* Bottom Section - Personas List */}
                        <div className="flex-1 bg-white rounded-xl shadow-lg p-6 overflow-hidden flex flex-col">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Available Personas</h3>
                            <div className="flex-1 overflow-y-auto">
                                {personas.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No personas available</p>
                                ) : (
                                    <div className="space-y-3">
                                        {personas.map((persona) => (
                                            <div
                                                key={persona.id}
                                                className={`border rounded-lg p-4 hover:shadow-md transition ${persona.id === selectedPersona
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-gray-200'
                                                    }`}
                                            >
                                                <h4 className="font-semibold text-gray-800 mb-2">{persona.name}</h4>
                                                <p className="text-sm text-gray-600 mb-3">{persona.bio}</p>
                                                <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                                                    <div className="bg-gray-100 rounded px-2 py-1 text-center">
                                                        Tone: {persona.tone}/10
                                                    </div>
                                                    <div className="bg-gray-100 rounded px-2 py-1 text-center">
                                                        Witty: {persona.witty}/10
                                                    </div>
                                                    <div className="bg-gray-100 rounded px-2 py-1 text-center">
                                                        Aspiration: {persona.aspiration}/10
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500">
                                                    <span className="font-medium">CTA:</span> {persona.cta}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div className={` w-full p-10 ${isShow?'flex':'hidden'} gap-3 overflow-x-auto`}>

<PostCard markdownText={markdownText}/>
<PostCard markdownText={markdownText}/>
<PostCard markdownText={markdownText}/>
<PostCard markdownText={markdownText}/>
<PostCard markdownText={markdownText}/>
<PostCard markdownText={markdownText}/>

            </div>
        </div>
    )
}



