"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Campaign, Persona } from "@/lib/types";
import { addNewCampaign, createPersonas } from "@/services/apiCalls";
import Modal from "@/components/Modal";

type FormType = "campaign" | "persona";

type BrandData = {
  brand_id: string;
  name: string;
  objective: string;
  start_date: string;
  end_date: string;
  status: string;
  is_new: boolean;
  campaign_id: string;
  created_at: string;
  updated_at: string;
};

interface BrandPersona {
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

type Props = {
  brandId: string;
  campaignData: BrandData[];
  personasData: BrandPersona[];
};

export default function BrandDetailPage({
  brandId,
  campaignData,
  personasData,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const brandID = pathname.split("/").filter(Boolean).pop();

  const [activeForm, setActiveForm] = useState<FormType>("campaign");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);

  const [personaForm, setPersonaForm] = useState({
    brand_id: brandID ? brandID : "",
    persona_name: "",
    bio: "",
    tone_formal: 0,
    tone_witty: 0,
    tone_aspirational: 5,
    default_cta: "",
    default_hashtags: [],
    persona_photo_url:
      "https://ai-infl-platform.s3.amazonaws.com/persona/904127b5-af1e-11f0-b03d-0a88edf1954d/photo.png",
    safety_notes: "",
  });

  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  // Loading state for submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Campaign form state
  const [campaignName, setCampaignName] = useState("");
  const [campaignPrompt, setCampaignPrompt] = useState("");
  const [campaignObjective, setCampaignObjective] = useState("");

  // Persona form state
  const [personaName, setPersonaName] = useState("");
  const [personaBio, setPersonaBio] = useState("");
  const [tone, setTone] = useState(5);
  const [witty, setWitty] = useState(5);
  const [aspiration, setAspiration] = useState(5);
  const [cta, setCta] = useState("");
  const [safetyNotes, setSafetyNotes] = useState("");

  useEffect(() => {
    // Load data from localStorage
    const storedCampaigns = localStorage.getItem(`campaigns-${brandId}`);
    const storedPersonas = localStorage.getItem(`personas-${brandId}`);

    if (storedCampaigns) setCampaigns(JSON.parse(storedCampaigns));
    if (storedPersonas) setPersonas(JSON.parse(storedPersonas));
  }, [brandId]);

  const handleCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await addNewCampaign({
        brand_id: brandId,
        name: campaignName,
        objective: campaignObjective,
        start_date: today,
        end_date: today,
      });

      if (res) {
        // Show success modal
        setModalState({
          isOpen: true,
          title: "Campaign Created Successfully!",
          message: `Your campaign "${campaignName}" has been registered successfully. The campaign ID is ${
            res.campaign_id || "generated"
          } and it will start from ${today}.`,
          type: "success",
        });

        // Update local state if needed
        const newCampaign: Campaign = {
          id: res.campaign_id || Date.now().toString(),
          name: campaignName,
          prompt: campaignPrompt,
          objective: campaignObjective,
          createdAt: new Date().toISOString(),
        };

        const updatedCampaigns = [...campaigns, newCampaign];
        setCampaigns(updatedCampaigns);
        localStorage.setItem(
          `campaigns-${brandId}`,
          JSON.stringify(updatedCampaigns)
        );

        // Reset form
        setCampaignName("");
        setCampaignPrompt("");
        setCampaignObjective("");
      } else {
        // Show error modal
        setModalState({
          isOpen: true,
          title: "Campaign Creation Failed",
          message:
            "There was an issue creating your campaign. Please try again later.",
          type: "error",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePersonaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandID) return;
    // Show success modal for persona creation
    setModalState({
      isOpen: true,
      title: "Persona Created Successfully!",
      message: `The persona "${personaForm.persona_name}" has been created with the following characteristics: Tone (${personaForm.tone_formal}/10), Witty (${personaForm.tone_witty}/10), Aspiration (${personaForm.tone_aspirational}/10).`,
      type: "success",
    });
    const data = await createPersonas(personaForm);

    // Reset form
    setPersonaForm({
      brand_id: brandID,
      persona_name: "",
      bio: "",
      tone_formal: 0,
      tone_witty: 0,
      tone_aspirational: 5,
      default_cta: "",
      default_hashtags: [],
      persona_photo_url: "",
      safety_notes: "",
    });
  };

  const deleteCampaign = (id: string) => {
    const campaignToDelete = campaigns.find((c) => c.id === id);
    const updatedCampaigns = campaigns.filter((c) => c.id !== id);
    setCampaigns(updatedCampaigns);
    localStorage.setItem(
      `campaigns-${brandId}`,
      JSON.stringify(updatedCampaigns)
    );

    // Show info modal for deletion
    setModalState({
      isOpen: true,
      title: "Campaign Deleted",
      message: `The campaign "${campaignToDelete?.name}" has been successfully removed.`,
      type: "info",
    });
  };

  const deletePersona = (id: string) => {
    const personaToDelete = personas.find((p) => p.id === id);
    const updatedPersonas = personas.filter((p) => p.id !== id);
    setPersonas(updatedPersonas);
    localStorage.setItem(
      `personas-${brandId}`,
      JSON.stringify(updatedPersonas)
    );

    // Show info modal for deletion
    setModalState({
      isOpen: true,
      title: "Persona Deleted",
      message: `The persona "${personaToDelete?.name}" has been successfully removed.`,
      type: "info",
    });
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal Component */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        autoClose={modalState.type === "success"}
        autoCloseDelay={5000}
      />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push("/dashboard")}
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
            onClick={() => setActiveForm("persona")}
            className={`px-6 py-3  rounded-lg font-semibold transition ${
              activeForm === "persona"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Create Persona
          </button>
          <button
            onClick={() => setActiveForm("campaign")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeForm === "campaign"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Register New Campaign
          </button>
        </div>

        {/* Forms */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {activeForm === "campaign" ? (
            <form onSubmit={handleCampaignSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Register New Campaign
              </h2>

              <div>
                <label
                  htmlFor="campaignName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Campaign Name *
                </label>
                <input
                  type="text"
                  id="campaignName"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="campaignPrompt"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Campaign Prompt (Optional)
                </label>
                <input
                  type="text"
                  id="campaignPrompt"
                  value={campaignPrompt}
                  onChange={(e) => setCampaignPrompt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="campaignObjective"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Campaign Objective *
                </label>
                <textarea
                  id="campaignObjective"
                  value={campaignObjective}
                  onChange={(e) => setCampaignObjective(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                  isSubmitting
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Campaign...
                  </span>
                ) : (
                  "Submit Campaign"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePersonaSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Create Persona
              </h2>

              <div>
                <label
                  htmlFor="personaName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="personaName"
                  value={personaForm.persona_name}
                  onChange={(e) =>
                    setPersonaForm({
                      ...personaForm,
                      persona_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="personaBio"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bio *
                </label>
                <textarea
                  id="personaBio"
                  value={personaForm.bio}
                  onChange={(e) =>
                    setPersonaForm({
                      ...personaForm,
                      bio: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="tone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tone: {personaForm.tone_formal}
                </label>
                <input
                  type="range"
                  id="tone"
                  min="1"
                  max="10"
                  value={personaForm.tone_formal}
                  onChange={(e) =>
                    setPersonaForm({
                      ...personaForm,
                      tone_formal: Number(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="witty"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Witty: {personaForm.tone_witty}
                </label>
                <input
                  type="range"
                  id="witty"
                  min="1"
                  max="10"
                  value={personaForm.tone_witty}
                  onChange={(e) =>
                    setPersonaForm({
                      ...personaForm,
                      tone_witty: Number(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="aspiration"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Aspiration: {personaForm.tone_aspirational}
                </label>
                <input
                  type="range"
                  id="aspiration"
                  min="1"
                  max="10"
                  value={personaForm.tone_aspirational}
                  onChange={(e) =>
                    setPersonaForm({
                      ...personaForm,
                      tone_aspirational: Number(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="cta"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  CTA *
                </label>
                <input
                  type="text"
                  id="cta"
                  value={personaForm.default_cta}
                  onChange={(e) =>
                    setPersonaForm({
                      ...personaForm,
                      default_cta: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="safetyNotes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Safety Notes *
                </label>
                <textarea
                  id="safetyNotes"
                  value={personaForm.safety_notes}
                  onChange={(e) =>
                    setPersonaForm({
                      ...personaForm,
                      safety_notes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
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
            {personasData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No personas created yet
              </p>
            ) : (
              <div className="space-y-4 h-54 p-3 overflow-y-auto scroll-smooth">
                {personasData.map((persona) => (
                  <div
                    key={persona.brand_id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {persona.persona_name}
                      </h4>
                      <button
                        onClick={() => deletePersona(persona.brand_id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{persona.bio}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                      <div>Tone: {persona.tone_formal}/10</div>
                      <div>Witty: {persona.tone_witty}/10</div>
                      <div>Aspiration: {persona.tone_aspirational}/10</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <div className="font-medium">
                        CTA: {persona.default_cta}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campaigns List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Campaigns</h3>
            {campaignData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No campaigns registered yet
              </p>
            ) : (
              <div className="space-y-4 h-54 p-3 overflow-y-auto scroll-smooth">
                {campaignData.map((campaign) => (
                  <div
                    key={campaign.campaign_id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {campaign.name}
                      </h4>
                      <button
                        onClick={() => deleteCampaign(campaign.campaign_id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    {/* {campaign.prompt && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Prompt:</span>{" "}
                        {campaign.prompt}
                      </p>
                    )} */}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Objective:</span>{" "}
                      {campaign.objective}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
