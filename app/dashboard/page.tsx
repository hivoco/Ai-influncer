import Brands from "@/components/Brands";
import { getBrands, getLatestCampaigns } from "@/services/apiCalls";
// app/brands/page.tsx
import React from "react";

export default async function BrandsPage() {
  const brands = await getBrands();
  const latestCampaigns = await getLatestCampaigns();
  return <Brands brands={brands} latestCampaigns={latestCampaigns} />;
}
