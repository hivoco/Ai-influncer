"use client";
import { usePathname, useRouter } from "next/navigation";
import { User, ImageIcon, Loader2, X } from "lucide-react";
import { PersonaForm, CampaignForm, FormType, Props } from "@/lib/types";
import {
  addNewCampaign,
  createPersonas,
  API_BASE,
  deletePersona,
  deleteCampaign,
} from "@/services/apiCalls";
import Modal from "@/components/Modal";
import CreatePersonaForm from "./CreatePersonaForm";
import CreateCampaignForm from "./CreateCampaignForm";
import { useState, ChangeEvent } from "react";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";

export default function BrandDetailPage({ campaignData, personasData }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const brandId = pathname.split("/").filter(Boolean).pop();

  const [activeForm, setActiveForm] = useState<FormType>("campaign");
  const { modalState, showModal, closeModal } = useModal();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [campaignForm, setCampaignForm] = useState<CampaignForm>({
    brand_id: brandId ? brandId : "",
    name: "",
    objective: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });

  const [personaForm, setPersonaForm] = useState<PersonaForm>({
    brand_id: brandId ? brandId : "",
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

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
    e.target.value = "";
  };

  const removeSelectedImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImageFile(null);
    setImagePreview("");
  };

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

        setCampaignForm({
          brand_id: brandId ? brandId : "",
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
    if (!brandId) return;

    try {
      const data = await createPersonas(personaForm);

      // Upload image if one was selected
      if (selectedImageFile) {
        await handleImageUpload(selectedImageFile, data.persona_id);
      }

      showModal(
        "Persona Created Successfully!",
        `The persona "${personaForm.persona_name}" has been created with the following characteristics: Tone (${personaForm.tone_formal}/10), Witty (${personaForm.tone_witty}/10), Aspiration (${personaForm.tone_aspirational}/10).`,
        "success"
      );

      // Reset form and image
      setPersonaForm({
        brand_id: brandId,
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
      removeSelectedImage();
    } catch (error) {
      console.error("Error creating persona:", error);
      showModal(
        "Persona Creation Failed",
        "There was an issue creating your persona. Please try again.",
        "error"
      );
    }
  };

  const handleDeleteCampaign = async (campaign_id: string) => {
    try {
      await deleteCampaign(campaign_id);
      showModal("Campaign Deleted", "success");
      router.refresh();
    } catch (error) {
      console.error("Delete persona error:", error);
      showModal("Delete Failed", "error");
    }
  };

  const handleDeletePersona = async (persona_id: string) => {
    try {
      await deletePersona(persona_id);
      showModal("Persona Deleted", "success");
      router.refresh();
    } catch (error) {
      console.error("Delete persona error:", error);
      showModal("Delete Failed", "error");
    }
  };

  const handleImageUpload = async (file: File, personaId: string) => {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${API_BASE}/personas/${personaId}/upload-photo`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.photo_url || data.url || data.persona_photo_url;

        if (imageUrl) {
          setPersonaForm((prev) => ({
            ...prev,
            persona_photo_url: imageUrl,
          }));
        } else {
          throw new Error("No image URL in response");
        }
      } else {
        throw new Error(`Upload failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      showModal(
        "Upload Failed",
        "Failed to upload image. Please try again.",
        "error"
      );
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        autoClose={modalState.type === "success"}
        autoCloseDelay={5000}
      />

      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-foreground">Brand Details</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end gap-4 mb-8">
          <button
            onClick={() => setActiveForm("persona")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeForm === "persona"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-input hover:bg-muted"
            }`}
          >
            Create Persona
          </button>
          <button
            onClick={() => setActiveForm("campaign")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeForm === "campaign"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-input hover:bg-muted"
            }`}
          >
            Register New Campaign
          </button>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-8 mb-8 border border-border">
          {activeForm === "persona" && (
            <div className="mb-6 border-b border-border pb-6">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-card shadow-lg">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Persona preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <User className="w-12 h-12" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  {/* Loading Overlay - only shows when uploading */}
                  {uploadingImage && (
                    <div className="absolute inset-0 w-32 h-32 rounded-full bg-black bg-opacity-60 flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                    </div>
                  )}

                  {/* Hover Overlay - only shows when not uploading */}
                  {!uploadingImage && (
                    <label
                      htmlFor="persona-photo-upload"
                      className="absolute inset-0 w-32 h-32 rounded-full bg-transparent hover:bg-black hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center cursor-pointer"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-center pointer-events-none">
                        <ImageIcon className="w-10 h-10 mx-auto mb-1" />
                        <p className="text-xs font-medium">
                          {imagePreview ? "Change" : "Upload"}
                        </p>
                      </div>
                    </label>
                  )}

                  {/* Camera Icon Badge */}
                  <label
                    htmlFor="persona-photo-upload"
                    className={`absolute bottom-1 right-1 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 border-4 border-card ${
                      uploadingImage
                        ? "bg-muted cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90 transform hover:scale-110 cursor-pointer"
                    }`}
                  >
                    <ImageIcon className="w-5 h-5 text-primary-foreground" />
                  </label>

                  <input
                    type="file"
                    id="persona-photo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                    disabled={uploadingImage}
                  />
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-foreground">
                    {personaForm.persona_name || "Persona Photo"}
                  </p>

                  {imagePreview && (
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="mt-2 text-xs text-destructive hover:text-destructive/80 font-medium transition inline-flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

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
          <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
            <h3 className="text-xl font-bold text-foreground mb-6">Personas</h3>
            {personasData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No personas created yet
              </p>
            ) : (
              <div className="space-y-4 max-h-96 p-3 overflow-y-auto">
                {personasData.map((persona) => (
                  <div
                    key={persona.persona_id}
                    className="border border-input rounded-lg p-4 hover:shadow-md transition bg-background"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-foreground">
                        {persona.persona_name}
                      </h4>
                      <button
                        onClick={() => handleDeletePersona(persona.persona_id)}
                        className="text-destructive hover:text-destructive/80 text-sm transition"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{persona.bio}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>Tone: {persona.tone_formal}/10</div>
                      <div>Witty: {persona.tone_witty}/10</div>
                      <div>Aspiration: {persona.tone_aspirational}/10</div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <div className="font-medium">
                        CTA: {persona.default_cta}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
            <h3 className="text-xl font-bold text-foreground mb-6">Campaigns</h3>
            {campaignData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No campaigns registered yet
              </p>
            ) : (
              <div className="space-y-4 max-h-96 p-3 overflow-y-auto flex flex-col">
                {campaignData.map((campaign) => (
                  <Link
                    href={`/generate-posts?brand_id=${brandId}&campaign_id=${campaign.campaign_id}`}
                    key={campaign.campaign_id}
                    className="border w-full border-input rounded-lg p-4 hover:shadow-md transition bg-background"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-foreground">
                        {campaign.name}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteCampaign(campaign.campaign_id);
                        }}
                        className="text-destructive hover:text-destructive/80 text-sm transition"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Objective:</span>{" "}
                      {campaign.objective}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
