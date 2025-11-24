import {
  faInstagram,
  faFacebook,
  faTwitter,
  faLinkedin,
  faTiktok,
  faYoutube,
  faReddit,
  faWikipediaW,
  faXTwitter
} from "@fortawesome/free-brands-svg-icons";

export const socialMediaPlatforms = [
  { id: "92df8d9d-a9c3-11f0-b03d-0a88edf1954d", value: "instagram", label: "Instagram", icon: faInstagram },
  { id: "eb685d58-be09-11f0-b03d-0a88edf1954d", value: "facebook", label: "Facebook", icon: faFacebook },
  { id: "twitter", value: "twitter", label: "Twitter/X", icon: faXTwitter },
  { id: "92df89c7-a9c3-11f0-b03d-0a88edf1954d", value: "linkedin", label: "LinkedIn", icon: faLinkedin },
  { id: "92df8e2c-a9c3-11f0-b03d-0a88edf1954d", value: "youtube", label: "YT Shorts", icon: faYoutube },
  { id: "92df8ca5-a9c3-11f0-b03d-0a88edf1954d", value: "reddit", label: "Reddit", icon: faReddit },
  { id: "Wikipedia", value: "wikipedia", label: "Wikipedia", icon: faWikipediaW },
  { id: "tiktok", value: "tiktok", label: "TikTok", icon: faTiktok },
];


export const CATEGORIES = [
  { value: "video", label: "Video" },
  { value: "image", label: "Image" },
  { value: "text", label: "Text" },
];

export const EMAIL = "admin@hivoco.com"
export const PASSWORD = "admin@123"