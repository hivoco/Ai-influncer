'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(!!loggedIn)
  }, [])

  const handleExplore = () => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (loggedIn) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  const workflowSteps = [
    {
      step: '01',
      title: 'Brand Registration',
      description: 'Brands are listed on our platform with their unique identity and requirements.',
      icon: '🏢',
      color: 'from-purple-500 to-pink-500',
    },
    {
      step: '02',
      title: 'Campaign Registration',
      description: 'Register campaigns for each brand with specific objectives and goals.',
      icon: '📋',
      color: 'from-pink-500 to-red-500',
    },
    {
      step: '03',
      title: 'AI Content Generation',
      description: 'Our team reviews campaign objectives and uses AI influencer personas to generate engaging posts.',
      icon: '🤖',
      color: 'from-red-500 to-orange-500',
    },
    {
      step: '04',
      title: 'Content Evaluation',
      description: 'Generated posts are carefully evaluated by our team for quality and brand alignment.',
      icon: '✅',
      color: 'from-orange-500 to-yellow-500',
    },
    {
      step: '05',
      title: 'Refinement & Regeneration',
      description: 'If needed, posts are edited or sent back to LLM for regeneration until perfection.',
      icon: '🔄',
      color: 'from-yellow-500 to-green-500',
    },
    {
      step: '06',
      title: 'Multi-Platform Scheduling',
      description: 'The most beautiful posts are scheduled across all social media platforms.',
      icon: '📅',
      color: 'from-green-500 to-blue-500',
    },
  ]

  const platforms = [
    { name: 'Instagram', icon: '📷', color: 'bg-gradient-to-br from-purple-400 to-pink-600' },
    { name: 'Facebook', icon: '👥', color: 'bg-gradient-to-br from-blue-500 to-blue-700' },
    { name: 'Twitter/X', icon: '🐦', color: 'bg-gradient-to-br from-gray-700 to-black' },
    { name: 'LinkedIn', icon: '💼', color: 'bg-gradient-to-br from-blue-600 to-blue-800' },
    { name: 'TikTok', icon: '🎵', color: 'bg-gradient-to-br from-black to-pink-500' },
    { name: 'YouTube Shorts', icon: '▶️', color: 'bg-gradient-to-br from-red-500 to-red-700' },
    { name: 'Reddit', icon: '🤖', color: 'bg-gradient-to-br from-orange-500 to-orange-700' },
    { name: 'Wikipedia', icon: '📚', color: 'bg-gradient-to-br from-gray-600 to-gray-800' },
  ]

  const features = [
    {
      title: 'AI-Powered Personas',
      description: 'Create intelligent AI influencer personas with customizable traits like tone, wit, and aspiration levels.',
      icon: '🎭',
    },
    {
      title: 'Team Collaboration',
      description: 'Your team works seamlessly to review, evaluate, and refine AI-generated content.',
      icon: '👥',
    },
    {
      title: 'Iterative Refinement',
      description: 'Continuous improvement loop with LLM regeneration until the perfect post is created.',
      icon: '♻️',
    },
    {
      title: 'Multi-Platform Publishing',
      description: 'Schedule and publish content across 8+ social media platforms from one dashboard.',
      icon: '🌐',
    },
    {
      title: 'Campaign Management',
      description: 'Organize and track multiple campaigns for different brands with clear objectives.',
      icon: '📊',
    },
    {
      title: 'Quality Assurance',
      description: 'Human-in-the-loop evaluation ensures every post meets your brand standards.',
      icon: '⭐',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🚀</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Influencer Hub
            </h1>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition duration-300 font-semibold"
          >
            {isLoggedIn ? 'Dashboard' : 'Sign In'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-2 bg-purple-100 rounded-full">
          <span className="text-purple-700 font-semibold text-sm">Professional AI Content Generation Platform</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          From Campaign Brief to
          <br />
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Perfect Social Media Posts
          </span>
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Our platform connects brands with AI-powered content creation. Register campaigns, leverage AI influencer personas, 
          and let our team craft, evaluate, and schedule the perfect posts across all major social media platforms.
        </p>
        <button
          onClick={handleExplore}
          className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold inline-flex items-center space-x-2"
        >
          <span>Explore Now</span>
          <span>→</span>
        </button>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-4xl font-bold text-purple-600 mb-2">8+</div>
            <div className="text-gray-600 text-sm">Social Platforms</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-4xl font-bold text-pink-600 mb-2">∞</div>
            <div className="text-gray-600 text-sm">AI Personas</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-600 text-sm">Quality Assured</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600 text-sm">Content Generation</div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Our Workflow Process
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From brand onboarding to multi-platform scheduling, here's how we create exceptional content
          </p>
        </div>

        <div className="space-y-8">
          {workflowSteps.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex items-start space-x-6"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-4xl">{item.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <span className={`text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {item.step}
                  </span>
                  <h4 className="text-2xl font-bold text-gray-900">{item.title}</h4>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platforms Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Publish Everywhere
          </h3>
          <p className="text-xl text-gray-600">
            Schedule your perfect posts across all major social media platforms
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className={`${platform.color} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 text-center text-white hover:scale-105 transform`}
            >
              <div className="text-5xl mb-4">{platform.icon}</div>
              <div className="text-lg font-bold">{platform.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h3>
          <p className="text-xl text-gray-600">
            Everything you need to create and manage exceptional social media content
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How Team Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white">
          <h3 className="text-4xl font-bold mb-8 text-center">
            How Our Team Creates Perfect Posts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-4">👁️</div>
              <h4 className="text-xl font-bold mb-3">Review Objectives</h4>
              <p className="text-white/90">
                Team members carefully analyze campaign objectives and brand requirements.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-4">✨</div>
              <h4 className="text-xl font-bold mb-3">Generate & Evaluate</h4>
              <p className="text-white/90">
                AI creates posts with influencer personas, team evaluates quality and alignment.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-xl font-bold mb-3">Edit or Regenerate</h4>
              <p className="text-white/90">
                Manual edits or LLM regeneration until the post achieves perfection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h3 className="text-4xl font-bold mb-4">
            Ready to Create Amazing Content?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join brands that trust us to create their perfect social media presence
          </p>
          <button
            onClick={handleExplore}
            className="px-12 py-4 bg-white text-purple-600 text-lg rounded-full hover:shadow-2xl hover:scale-105 transition duration-300 font-bold inline-flex items-center space-x-2"
          >
            <span>Start Exploring</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">🚀</span>
            <h1 className="text-2xl font-bold">AI Influencer Hub</h1>
          </div>
          <p className="text-gray-400 mb-4">
            Professional AI-powered social media content generation platform
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 AI Influencer Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}