import BrandDetailPage from "@/components/BrandDetailPage";
import { getCampaigns, getPersonas } from "@/services/apiCalls";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: brandId } = await params;
  const campaignData = await getCampaigns(brandId);
  const personasData = await getPersonas(brandId);
  return (
    <BrandDetailPage
      brandId={brandId}
      campaignData={campaignData}
      personasData={personasData}
    />
  );
}
