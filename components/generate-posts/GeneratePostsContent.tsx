"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import PostCard from "@/components/PostCard";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreatePersonaForm from "@/components/CreatePersonaForm";
import {
  addNewCampaign,
  API_BASE,
  createPersonas,
  genPost,
  getCampaignById,
  getCampaignPrompts,
  getPersona,
} from "@/services/apiCalls";
import { socialMediaPlatforms } from "@/lib/constant";
import CommonModal from "./CommanModal";
import LoadingOverlay from "../LoadingOverlay";
import {
  Campaign,
  CampaignForm,
  CampaignPrompt,
  CampaignPrompts,
  Persona,
  PersonaData,
  PersonaForm,
  Platform,
  Post,
} from "@/lib/types";
import CreateCampaignForm from "../CreateCampaignForm";
import { useModal } from "@/hooks/useModal";
import Modal from "../Modal";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import DynamicStreamingPostDisplay from "./StreamingPostDisplay";
import StreamingPostDisplay from "./StreamingPostDisplay";

export default function GeneratePostsContent() {
  const postsDivRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandId = searchParams.get("brand_id");
  const campaignId = searchParams.get("campaign_id");

  const [campaignForm, setCampaignForm] = useState<CampaignForm>({
    brand_id: brandId ? brandId : "",
    name: "",
    objective: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });

  const [formErrors, setFormErrors] = useState<{
    campaignDates?: string;
  }>({});

  const [personaForm, setPersonaForm] = useState<PersonaForm>({
    brand_id: brandId ? brandId : "",
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

  const [selectedPlatform, setSelectedPlatform] = useState<Platform>({
    id: "",
    value: "",
    label: "",
    icon: null,
  });

  const [selectedPersona, setSelectedPersona] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [showAddPersonas, setShowAddPersonas] = useState(false);

  const [campaignPrompts, setCampaignPrompts] = useState<CampaignPrompts>([]);
  const [personaData, setPersonaData] = useState<PersonaData>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isGeneratingPosts, setIsGeneratingPosts] = useState(false);

  console.log(campaign, "campaign", "campaign");

  const [displayStreaming, setDisplayStreaming] = useState(false);

  const memoizedSetIsGeneratingPosts = useCallback((value: boolean) => {
    setIsGeneratingPosts(value);
  }, []);

  const { modalState, showModal, closeModal } = useModal();

  const [postsData, setPostsData] = useState<Post[]>([]);
  const [displayPostMarkdown, setDisplayPostMarkdown] = useState(true);
  const prevPostsLengthRef = useRef(0);

  // Helper function to handle modal display and close forms
  const handleModalResult = (
    closeForm: () => void,
    success: boolean,
    title: string,
    message: string
  ) => {
    closeForm();
    showModal(title, message, success ? "success" : "error");
  };

  // Helper function to validate campaign dates
  const validateCampaignDates = (
    startDate: string,
    endDate: string
  ): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setFormErrors({ campaignDates: "End date must be after start date" });
      return false;
    }

    setFormErrors({});
    return true;
  };

  const handleCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dates before submission
    if (
      !validateCampaignDates(campaignForm.start_date, campaignForm.end_date)
    ) {
      handleModalResult(
        () => {},
        false,
        "Validation Error",
        formErrors.campaignDates || "Invalid date range"
      );
      return;
    }

    try {
      const res = await addNewCampaign(campaignForm);

      if (res) {
        handleModalResult(
          () => setShowAddCampaign(false),
          true,
          "Campaign Created Successfully!",
          `Your campaign "${
            campaignForm.name
          }" has been registered successfully. The campaign ID is ${
            res.campaign_id || "generated"
          } and it will start from ${campaignForm.start_date}.`
        );

        // Reset form
        setCampaignForm({
          brand_id: brandId ? brandId : "",
          name: "",
          objective: "",
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date().toISOString().split("T")[0],
        });
      } else {
        handleModalResult(
          () => setShowAddCampaign(false),
          false,
          "Campaign Creation Failed",
          "There was an issue creating your campaign. Please try again later."
        );
      }
    } catch (error) {
      handleModalResult(
        () => setShowAddCampaign(false),
        false,
        "Error",
        "An unexpected error occurred while creating the campaign."
      );
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  const handlePersonaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId) {
      handleModalResult(
        () => {},
        false,
        "Error",
        "Brand ID is required to create a persona."
      );
      return;
    }

    try {
      const data = await createPersonas(personaForm);

      handleModalResult(
        () => setShowAddPersonas(false),
        true,
        "Persona Created Successfully!",
        `The persona "${personaForm.persona_name}" has been created with the following characteristics: Tone (${personaForm.tone_formal}/10), Witty (${personaForm.tone_witty}/10), Aspiration (${personaForm.tone_aspirational}/10).`
      );

      // Reset form
      setPersonaForm({
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
    } catch (error) {
      handleModalResult(
        () => setShowAddPersonas(false),
        false,
        "Error",
        "Failed to create persona. Please try again."
      );
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  // Only scroll when posts are added, not removed or modified
  useEffect(() => {
    if (postsData.length > prevPostsLengthRef.current && postsDivRef.current) {
      postsDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    prevPostsLengthRef.current = postsData.length;
  }, [postsData.length]);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const fetchApis = async () => {
      if (brandId) {
        // const campaignList = await getCampaignPrompts(brandId);
        // setCampaignPrompts(campaignList);
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
    setIsGeneratingPosts(true);
    setDisplayStreaming(true);
    console.log("fxn called");

    return;

    // try {
    //   if (!campaign || !campaignId) return;
    //   const postsList = await genPost({
    //     campaign_id: campaignId,
    //     persona_id: selectedPersona,
    //     platform_id: selectedPlatform.id,
    //     title: campaign.name,
    //     user_prompt: campaign.objective,
    //   });

    //   setPostsData(postsList.posts);
    //   setIsShow(true);
    // } catch (error) {
    //   console.error("Error generating posts:", error);
    //   showModal(
    //     "Error",
    //     "Failed to generate posts. Please try again.",
    //     "error"
    //   );
    // } finally {
    //   setIsGeneratingPosts(false);
    // }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-xl text-gray-700 font-semibold">
            Loading Campaign Data...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we fetch your campaign details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.push(`/brand/${brandId}`)}
            aria-label="Navigate back to brand page"
          >
            ← Back to Brand
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Generate Post</h1>
          <div className="w-32" aria-hidden="true"></div>{" "}
          {/* Spacer for alignment */}
        </div>
      </header>
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        autoClose={modalState.type === "success"}
        autoCloseDelay={5000}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Side - Form */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Post Generation Form
              </h2>

              <form
                onSubmit={handleGeneratePost}
                className="space-y-6"
                aria-label="Post generation form"
              >
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                      readOnly
                      aria-readonly="true"
                      aria-label="Campaign name (read-only)"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 outline-none resize-none"
                      readOnly
                      aria-readonly="true"
                      aria-label="Campaign objective (read-only)"
                    />
                  )}
                </div>

                {/* Persona Selection */}
                <div>
                  <label
                    htmlFor="options"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Persona *
                  </label>

                  <input
                    type="text"
                    name="persona"
                    value={selectedPersona}
                    onChange={() => {}}
                    required
                    className="sr-only"
                  />

                  <Select
                    value={selectedPersona}
                    onValueChange={setSelectedPersona}
                    disabled={isGeneratingPosts}
                  >
                    <SelectTrigger
                      aria-required="true"
                      aria-label="Select persona for post generation"
                      aria-disabled={isGeneratingPosts}
                    >
                      <SelectValue placeholder="Select a persona" />
                    </SelectTrigger>
                    <SelectContent>
                      {personaData.map((persona: Persona) => (
                        <SelectItem
                          key={persona.persona_id}
                          value={persona.persona_id}
                        >
                          {persona.persona_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Social Media Platform Dropdown */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select a Platform *
                  </label>

                  <input
                    type="text"
                    name="persona"
                    value={selectedPersona}
                    onChange={() => {}}
                    required
                    className="sr-only"
                  />

                  <div className="flex items-center gap-3 flex-wrap">
                    {socialMediaPlatforms.map((platform) => (
                      <div key={platform.value}>
                        <input
                          type="radio"
                          name="platform"
                          value={platform.value}
                          required
                          checked={selectedPlatform?.value === platform.value}
                          onChange={() => setSelectedPlatform(platform)}
                          className="sr-only"
                        />

                        <Button
                          type="button"
                          onClick={() => setSelectedPlatform(platform)}
                          aria-label={platform.label}
                          title={platform.label}
                          variant={
                            platform.label === selectedPlatform.label
                              ? "default"
                              : "outline"
                          }
                          className="flex items-center gap-2"
                        >
                          <FontAwesomeIcon
                            icon={platform.icon}
                            className="w-5 h-5"
                          />
                          <span className="text-sm font-medium">
                            {platform.label}
                          </span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  type="submit"
                  disabled={isGeneratingPosts}
                  aria-label={
                    isGeneratingPosts
                      ? "Generating posts, please wait"
                      : "Generate post"
                  }
                  aria-busy={isGeneratingPosts}
                  size="lg"
                >
                  {isGeneratingPosts ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2
                        className="animate-spin h-5 w-5"
                        aria-hidden="true"
                      />
                      <span>Generating Posts...</span>
                    </div>
                  ) : (
                    "Generate Posts"
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Side - Two Sections */}
          <div className="w-96 flex flex-col gap-8 h-screen">
            <div
              className="flex-1 bg-white rounded-xl shadow-lg p-6 overflow-hidden flex flex-col"
              role="region"
              aria-label="Available personas"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Available Personas
                </h3>
                <Button
                  onClick={() => setShowAddPersonas(true)}
                  size="sm"
                  title="Add Persona"
                  aria-label="Add new persona"
                  className="h-8 w-8 p-0"
                >
                  <Plus size={16} aria-hidden="true" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {personaData.length === 0 ? (
                  <p className="text-gray-500 text-center py-8" role="status">
                    No personas available
                  </p>
                ) : (
                  <div
                    className="space-y-3"
                    role="list"
                    aria-label="List of available personas"
                  >
                    {personaData.map((persona: Persona) => (
                      <div
                        onClick={() => setSelectedPersona(persona.persona_id)}
                        key={persona.persona_id}
                        className={`border rounded-lg p-4 hover:shadow-md transition ${
                          persona.persona_id === selectedPersona
                            ? "border-primary bg-primary/5"
                            : "border-gray-200"
                        }`}
                        role="listitem"
                        aria-current={
                          persona.persona_id === selectedPersona
                            ? "true"
                            : "false"
                        }
                      >
                        <input
                          id="zoom"
                          type="checkbox"
                          className="peer hidden"
                        />
                        <label
                          htmlFor="zoom"
                          className="flex items-center gap-4 mb-2"
                        >
                          <Image
                            width={60}
                            height={60}
                            className="rounded-full"
                            src={persona.persona_photo_url}
                            alt="persona image"
                          />
                          <h4 className="font-semibold text-gray-800 mb-2">
                            {persona.persona_name}
                          </h4>
                        </label>

                        {/* <div
                         className="fixed inset-0 bg-black/70 hidden peer-checked:flex items-center justify-center"
                         > */}
                        <label
                          className="fixed inset-0 bg-black/70 hidden peer-checked:flex items-center justify-center"
                          htmlFor="zoom"
                        >
                          <Image
                            width={300}
                            height={300}
                            className="rounded-full"
                            src={persona.persona_photo_url}
                            alt="persona image"
                          />
                        </label>
                        {/* </div> */}

                        <p className="text-sm text-gray-600 mb-3">
                          {persona.bio}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <CommonModal
              isOpen={showAddCampaign}
              onClose={() => setShowAddCampaign(false)}
              title=""
              className=""
            >
              <CreateCampaignForm
                handleCampaignSubmit={handleCampaignSubmit}
                campaignForm={campaignForm}
                setCampaignForm={setCampaignForm}
              />
            </CommonModal>

            <CommonModal
              className=""
              isOpen={showAddPersonas}
              onClose={() => setShowAddPersonas(false)}
              title="Add New Persona"
            >
              <CreatePersonaForm
                handlePersonaSubmit={handlePersonaSubmit}
                personaForm={personaForm}
                setPersonaForm={setPersonaForm}
              />
            </CommonModal>
          </div>
        </div>
      </div>

      {/* <LoadingOverlay
        isOpen={isGeneratingPosts}
        title="Generating Posts"
        message="Please wait while we create amazing content for your campaign..."
        showProgress={true}
      /> */}

      {/* {postsData.length > 0 && (
        <div
          ref={postsDivRef}
          className={` w-full  p-10 ${
            isShow ? "grid grid-cols-2" : "hidden"
          } gap-3 overflow-x-auto`}
          role="region"
          aria-label="Generated posts"
        >
          {postsData.length !== 0 &&
            postsData.map((p: Post) => {
              return (
                <div className="" key={p.post_id}>
                  <PostCard
                    postID={p.post_id}
                    markdownText={p.body}
                    platform={selectedPlatform.value}
                  />
                </div>
              );
            })}
        </div>
      )} */}

      {displayStreaming && (
        <StreamingPostDisplay
          apiUrl={API_BASE + "/generator/generate-posts-stream-test"}
          // campaignId="0941f2c9-1131-42d1-b35e-0ad7d73662b1"
          campaignId={campaignId || ""}
          // personaId="1bb95a62-e0c2-4839-ba3d-88952b1a00ca"
          personaId={selectedPersona}
          // platformId="eb685d58-be09-11f0-b03d-0a88edf1954d"
          platformId={selectedPlatform.id}
          // title="AI Creators Launch Campaign"s
          title={campaign ? campaign.name : ""}
          userPrompt={campaign ? campaign.objective : ""}
          count={2}
          setIsGeneratingPosts={memoizedSetIsGeneratingPosts}
        />
      )}
    </div>
  );
}
