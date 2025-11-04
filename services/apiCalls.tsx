export const API_BASE = "https://backend.thefirstimpression.ai";

// "http://192.168.1.11:8000";
// "http://localhost:8000";
export const getCampaignPrompts = async (id: string) => {
  const data = await fetch(API_BASE + `/prompts/?brand_id=${id}`, {
    cache: "no-store",
  });
  const res = await data.json();
  return res;
};

export const getPersona = async (id: string) => {
  const data = await fetch(API_BASE + `/personas/?brand_id=${id}`, {
    cache: "no-store",
  });
  const res = await data.json();
  return res;
};

export const generatePost = async () => {
  const data = await fetch(API_BASE + `/campaigns/generate-posts`, {
    cache: "no-store",
  });
  const res = await data.json();
  return res;
};

export const getCampaignById = async (id: string) => {
  const data = await fetch(API_BASE + `/campaigns/${id}`, {
    cache: "no-store",
  });
  const res = await data.json();
  return res;
};

export const genPost = async ({
  campaign_id,
  persona_id,
  platform_id,
  title,
  user_prompt,
}: {
  campaign_id: string;
  persona_id: string;
  platform_id: string;
  title: string;
  user_prompt: string;
}) => {
  const data = await fetch(API_BASE + `/generator/generate-posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      campaign_id,
      persona_id,
      platform_id,
      title,
      user_prompt,
    }),
    cache: "no-store",
  });
  const res = await data.json();
  return res;
};

export async function schedulePost(post_id: string, scheduled_time: string) {
  const res = await fetch(API_BASE + "/linkdin/schedule/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ post_id, scheduled_time }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to schedule post");
  return await res.json();
}

export async function addNewCampaign({
  brand_id,
  name,
  objective,
  start_date,
  end_date,
}: {
  brand_id: string;
  name: string;
  objective: string;
  start_date: string;
  end_date: string;
}) {
  const res = await fetch(`${API_BASE}/campaigns/`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      brand_id,
      name,
      objective,
      start_date,
      end_date,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(
      `Failed to create campaign: ${res.status} ${res.statusText}${
        text ? " — " + text : ""
      }`
    );
  }

  const data = await res.json();
  return data;
}

export async function getBrands() {
  try {
    const res = await fetch(`${API_BASE}/brands/`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch brands");
    return res.json();
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error; // Re-throw if you want calling code to handle it
    // Or return a default value like: return [];
  }
}

export async function getLatestCampaigns() {
  const res = await fetch(`${API_BASE}/campaigns/latest`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch brands");
  return res.json();
}

export async function getCampaigns(brandId: string) {
  const res = await fetch(`${API_BASE}/campaigns?brand_id=${brandId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return res.json();
}

export async function getPersonas(brandId: string) {
  const res = await fetch(`${API_BASE}/personas?brand_id=${brandId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch personas");
  return res.json();
}

export async function genImage(postID: string, payload: any) {
  const res = await fetch(`${API_BASE}/generator/${postID}/generate-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to generate image");
  return res.json();
}

export async function createPersonas({
  brand_id,
  persona_name,
  bio,
  tone_formal,
  tone_witty,
  tone_aspirational,
  default_cta,
  default_hashtags,
  persona_photo_url,
  safety_notes,
}: {
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
}) {
  const res = await fetch(`${API_BASE}/personas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      brand_id,
      persona_name,
      bio,
      tone_formal,
      tone_witty,
      tone_aspirational,
      default_cta,
      default_hashtags,
      persona_photo_url,
      safety_notes,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to generate image");
  return res.json();
}
