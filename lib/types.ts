export interface Campaign {
  id: string
  name: string
  prompt?: string
  objective: string
  createdAt: string
}

export interface Persona {
  id: string
  name: string
  bio: string
  tone: number
  witty: number
  aspiration: number
  cta: string
  safetyNotes: string
  createdAt: string
}

export interface Brand {
  id: number
  name: string
  image: string
}


export interface CampaignPrompt {
  readonly brand_id: string;
  readonly persona_id: string;
  readonly platform_id: string;
  readonly prompt_id: string;
  name: string;
  type: string;
  prompt_text: string;
  language: string;
  version: string;
  is_golden: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export type CampaignPrompts = CampaignPrompt[];

export interface Persona {
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

export type PersonaData = Persona[];

export interface Campaign {
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

export interface Post {
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

export type PersonaForm = {
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
};

export interface CampaignForm {
  brand_id: string;
  name: string;
  objective: string;
  start_date: string;
  end_date: string;
}



export type FormType = "campaign" | "persona";

export type BrandData = {
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

export interface BrandPersona {
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

export type Props = {
  brandId: string;
  campaignData: BrandData[];
  personasData: BrandPersona[];
};

export interface PromptForm {
  name: string;
  prompt_text: string;
  category: string;
}

export type Platform = {
  id: string;
  value: string;
  label: string;
  icon: string;
};
