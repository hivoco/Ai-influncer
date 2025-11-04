"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import { Loader2, Plus, X } from "lucide-react";
import CreatePersonaForm from "@/components/CreatePersonaForm";
import {
  genPost,
  getCampaignById,
  getCampaignPrompts,
  getPersona,
} from "@/services/apiCalls";
import { socialMediaPlatforms } from "@/lib/constant";

interface CampaignPrompt {
  brand_id: string; // UUID format
  persona_id: string; // UUID format
  platform_id: string; // UUID format
  name: string;
  type: string;
  prompt_text: string;
  language: string;
  version: string; // Semantic versioning format (e.g., "v1.0")
  is_golden: boolean;
  notes: string | null;
  prompt_id: string; // UUID format
  created_at: string; // ISO 8601 datetime string
  updated_at: string | null; // ISO 8601 datetime string or null
}

type CampaignPrompts = CampaignPrompt[];

interface Persona {
  brand_id: string;
  persona_name: string;
  bio: string;
  tone_formal: number;
  tone_witty: number;
  tone_aspirational: number;
  default_cta: string;
  default_hashtags: string[];
  persona_photo_url: string;
  safety_notes: string;
  persona_id: string;
  created_at: string;
  updated_at: string;
}

type PersonaData = Persona[];

interface Campaign {
  brand_id: string;
  name: string;
  objective: string;
  persona_id: string;
  start_date: string;
  end_date: string;
  status: string;
  is_new: boolean;
  campaign_id: string;
  created_at: string;
  updated_at: string;
}

export default function GeneratePostsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandId = searchParams.get("brand_id");
  const campaignId = searchParams.get("campaign_id");

  const [campaignName, setCampaignName] = useState("");
  const [campaignPrompt, setCampaignPrompt] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("");
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [showAddPersonas, setShowAddPersonas] = useState(false);

  const [personaName, setPersonaName] = useState("");
  const [personaBio, setPersonaBio] = useState("");
  const [tone, setTone] = useState(5);
  const [witty, setWitty] = useState(5);
  const [aspiration, setAspiration] = useState(5);
  const [cta, setCta] = useState("");
  const [safetyNotes, setSafetyNotes] = useState("");
  const [campaignPrompts, setCampaignPrompts] = useState<CampaignPrompts>([]);
  const [personaData, setPersonaData] = useState<PersonaData>([]);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isGeneratingPosts, setIsGeneratingPosts] = useState(false);

  interface Post {
    campaign_id: string;
    persona_id: string;
    platform_id: string;
    prompt_id: string;
    title: string;
    body: string;
    hashtags: string[];
    media_url: string | null;
    kind: string;
    post_metadata: string | null;
    status: string;
    scheduled_at: string | null;
    published_at: string | null;
    external_url: string | null;
    post_id: string;
    created_at: string;
    updated_at: string;
  }

  const [postsData, setPostsData] = useState<Post[]>([]);
  const handlePersonaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  let markdownText = `🚀 **Exciting News!**
I'm thrilled to share that I've recently [your announcement — e.g., *joined a new company*, *completed a major project*, *launched a product*, or *earned a certification*].

This journey has been filled with learning, collaboration, and growth — and I'm incredibly grateful to everyone who's been part of it. 🙏  

Here are a few key takeaways from this experience:
- 💡 [Insight 1 — something you learned]
- 🤝 [Insight 2 — collaboration or teamwork lesson]
- 🌱 [Insight 3 — personal or professional growth]

I'm looking forward to the next chapter and continuing to [goal — e.g., *build impactful solutions*, *grow in my field*, *contribute to meaningful projects*].

Let's connect and share insights! 👋  
#growth #learning #career #innovation
`;
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const fetchApis = async () => {
      if (brandId) {
        const list = await getCampaignPrompts(brandId);
        setCampaignPrompts(list);
        const personaList = await getPersona(brandId);
        setPersonaData(personaList);
      }

      if (!campaignId) return;
      setCampaign(await getCampaignById(campaignId));
    };

    fetchApis();

    setIsLoading(false);
  }, [brandId, campaignId, router]);

  const handleGeneratePost = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsGeneratingPosts(true);

      if (!campaign || !campaignId) return;
      const postsList = await genPost({
        campaign_id: campaignId,
        persona_id: selectedPersona,
        platform_id: "92df89c7-a9c3-11f0-b03d-0a88edf1954d",
        title: campaign.name,
        user_prompt: campaign.objective,
      });

      setPostsData(postsList.posts);
      setIsShow(true);
    } catch (error) {
      console.error("Error generating posts:", error);
      // You might want to add error handling here
    } finally {
      setIsGeneratingPosts(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Post Generation Form
              </h2>

              <form onSubmit={handleGeneratePost} className="space-y-6">
                {/* Campaign Name - Prefilled */}
                <div>
                  <label
                    htmlFor="campaignName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Campaign Name
                  </label>

                  {campaign && (
                    <input
                      type="text"
                      id="campaignName"
                      value={campaign.name}
                      // onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      readOnly
                    />
                  )}
                </div>

                {/* Campaign Prompt - Prefilled */}
                <div>
                  <label
                    htmlFor="campaignPrompt"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Campaign Prompt
                  </label>
                  {campaign && (
                    <textarea
                      id="campaignPrompt"
                      value={campaign.objective}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                      readOnly
                    />
                  )}
                </div>

                {/* Social Media Platform Dropdown */}
                <div>
                  <label
                    htmlFor="platform"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Social Media Platform *
                  </label>
                  <select
                    id="platform"
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                    disabled={isGeneratingPosts}
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
                  <label
                    htmlFor="persona"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Persona *
                  </label>
                  <select
                    id="persona"
                    value={selectedPersona}
                    onChange={(e) => setSelectedPersona(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                    disabled={isGeneratingPosts}
                  >
                    <option value="">Select a persona</option>
                    {personaData.map((persona: Persona) => (
                      <option key={persona.brand_id} value={persona.persona_id}>
                        {persona.persona_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Generate Button */}
                <button
                  type="submit"
                  disabled={isGeneratingPosts}
                  className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg hover:shadow-lg transition duration-200 font-semibold text-lg
                  ${
                    isGeneratingPosts
                      ? "opacity-60 cursor-not-allowed"
                      : "active:opacity-65"
                  }`}
                >
                  {isGeneratingPosts ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="animate-spin text-white h-5 w-5" />
                      <span>Generating Posts...</span>
                    </div>
                  ) : (
                    "Generate Post 🚀"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Two Sections */}
          <div className="w-96 flex flex-col gap-8 h-screen">
            {/* Top Section - Campaigns/Prompts List */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-6 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Campaign Prompts
                </h3>
                <button
                  onClick={() => setShowAddCampaign(true)}
                  className="size-5 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition"
                  title="Add Campaign"
                >
                  <Plus size={12} />
                </button>
              </div>

              {campaignPrompts &&
                campaignPrompts.map((c: CampaignPrompt) => {
                  return (
                    <div
                      className="bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-md"
                      key={c.brand_id}
                    >
                      <h4 className="text-sm">{c.name}</h4>
                    </div>
                  );
                })}

              <div className="flex-1 ">
                {campaign === null ? (
                  <p className="text-gray-500 text-center py-8">
                    No campaigns available
                  </p>
                ) : (
                  <div className="space-y-3">
                    <div
                      key={campaign.campaign_id}
                      className={`border rounded-lg p-4 hover:shadow-md transition ${
                        campaign.campaign_id === campaignId
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200"
                      }`}
                    >
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {campaign.name}
                      </h4>
                      {/* {c.prompt && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Prompt:</span>{" "}
                            {c.prompt}
                          </p>
                        )} */}
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Objective:</span>{" "}
                        {campaign.objective}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Bottom Section - Personas List */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-6 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Available Personas
                </h3>
                <button
                  onClick={() => setShowAddPersonas(true)}
                  className="size-5 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition"
                  title="Add Campaign"
                >
                  <Plus size={12} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {personaData.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No personas available
                  </p>
                ) : (
                  <div className="space-y-3">
                    {personaData.map((persona: Persona) => (
                      <div
                        key={persona.brand_id}
                        className={`border rounded-lg p-4 hover:shadow-md transition ${
                          persona.brand_id === selectedPersona
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200"
                        }`}
                      >
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {persona.persona_name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {persona.bio}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Add Campaign Modal */}
            {showAddCampaign && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
                <div className="bg-white rounded-2xl no-scrollbar shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      Add New Campaign
                    </h3>
                    <button
                      onClick={() => setShowAddCampaign(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Campaign title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Select type</option>
                        <option value="email">Email</option>
                        <option value="social">Social Media</option>
                        <option value="blog">Blog Post</option>
                        <option value="ad">Advertisement</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prompts
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        placeholder="Enter campaign prompts..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        placeholder="Additional notes..."
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setShowAddCampaign(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          // Handle form submission here
                          setShowAddCampaign(false);
                        }}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        Add Campaign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showAddPersonas && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
                <div className="bg-white rounded-2xl no-scrollbar shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto flex justify-between">
                  <CreatePersonaForm
                    handlePersonaSubmit={handlePersonaSubmit}
                    setPersonaName={setPersonaName}
                    personaName={personaName}
                    personaBio={personaBio}
                    setPersonaBio={setPersonaBio}
                    setTone={setTone}
                    tone={tone}
                    witty={witty}
                    setWitty={setWitty}
                    aspiration={aspiration}
                    setAspiration={setAspiration}
                    setCta={setCta}
                    cta={cta}
                    safetyNotes={safetyNotes}
                    setSafetyNotes={setSafetyNotes}
                  />

                  <button
                    onClick={() => setShowAddPersonas(false)}
                    className="text-gray-400 hover:text-gray-600 self-start"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isGeneratingPosts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />{" "}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Generating Posts
              </h3>
              <p className="text-gray-600 text-center">
                Please wait while we create amazing content for your campaign...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-linear-to-r from-indigo-500 to-purple-500 h-full rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={` w-full p-10 ${
          isShow ? "flex" : "hidden"
        } gap-3 overflow-x-auto`}
      >
        {postsData.length !== 0 &&
          postsData.map((p: Post) => {
            return (
              <div className="" key={p.post_id}>
                <PostCard postID={p.post_id} markdownText={p.body} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
