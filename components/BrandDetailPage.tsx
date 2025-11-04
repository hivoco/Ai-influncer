"use client";
import { usePathname, useRouter } from "next/navigation";
import { PersonaForm, CampaignForm, FormType, Props } from "@/lib/types";
import { addNewCampaign, createPersonas } from "@/services/apiCalls";
import Modal from "@/components/Modal";
import CreatePersonaForm from "./CreatePersonaForm";
import CreateCampaignForm from "./CreateCampaignForm";
import { useState } from "react";
import { useModal } from "@/hooks/useModal";

export default function BrandDetailPage({ campaignData, personasData }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const brandID = pathname.split("/").filter(Boolean).pop();

  const [activeForm, setActiveForm] = useState<FormType>("campaign");
  const { modalState, showModal, closeModal } = useModal();

  const [campaignForm, setCampaignForm] = useState<CampaignForm>({
    brand_id: brandID ? brandID : "",
    name: "",
    objective: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });

  const [personaForm, setPersonaForm] = useState<PersonaForm>({
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

  const handleCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addNewCampaign(campaignForm);

      if (res) {
        showModal(
          "Campaign Created Successfully!",
          `Your campaign "${
            campaignForm.name
          }" has been registered successfully. The campaign ID is ${
            res.campaign_id || "generated"
          } and it will start from ${campaignForm.start_date}.`,
          "success"
        );

        // Reset form
        setCampaignForm({
          brand_id: brandID ? brandID : "",
          name: "",
          objective: "",
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date().toISOString().split("T")[0],
        });
      } else {
        showModal(
          "Campaign Creation Failed",
          "There was an issue creating your campaign. Please try again later.",
          "error"
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  const handlePersonaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandID) return;

    showModal(
      "Persona Created Successfully!",
      `The persona "${personaForm.persona_name}" has been created with the following characteristics: Tone (${personaForm.tone_formal}/10), Witty (${personaForm.tone_witty}/10), Aspiration (${personaForm.tone_aspirational}/10).`,
      "success"
    );

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
    const campaignToDelete = campaignData.find((c) => c.campaign_id === id);
    showModal(
      "Campaign Deleted",
      `The campaign "${campaignToDelete?.name}" has been successfully removed.`,
      "info"
    );
  };

  const deletePersona = (id: string) => {
    const personaToDelete = personasData.find((p) => p.persona_id === id);
    showModal(
      "Persona Deleted",
      `The persona "${personaToDelete?.persona_name}" has been successfully removed.`,
      "info"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        autoClose={modalState.type === "success"}
        autoCloseDelay={5000}
      />

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
        <div className="flex justify-end gap-4 mb-8">
          <button
            onClick={() => setActiveForm("persona")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
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

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {activeForm === "campaign" ? (
            <CreateCampaignForm
              handleCampaignSubmit={handleCampaignSubmit}
              campaignForm={campaignForm}
              setCampaignForm={setCampaignForm}
            />
          ) : (
            <CreatePersonaForm
              handlePersonaSubmit={handlePersonaSubmit}
              personaForm={personaForm}
              setPersonaForm={setPersonaForm}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    key={persona.persona_id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {persona.persona_name}
                      </h4>
                      <button
                        onClick={() => deletePersona(persona.persona_id)}
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
