"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
type Brand = {
  brand_id: string;
  brand_name: string;
  logo_url: string;
  timezone: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

interface Campaign {
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
}

type BrandsProps = {
  brands: Brand[];
  latestCampaigns: Campaign[];
};

export default function Brands({ brands, latestCampaigns }: BrandsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleBrandClick = (brandId: string) => {
    router.push(`/brand/${brandId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
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
          <h1 className="text-2xl font-bold text-gray-900">
            Brand Campaign Manager
          </h1>

          <div className="flex items-center gap-4">
            <Link
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              href={"/create-prompt"}
            >
              Add Prompt
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Select a Brand
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brands.length === 0 ? (
              <div>no brands present</div>
            ) : (
              brands.map((brand) => (
                <div
                  key={brand.brand_id}
                  onClick={() => handleBrandClick(brand.brand_id)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                >
                  <div className="relative h-48 bg-linear-to-br from-indigo-100 to-purple-100">
                    <img
                      src={brand.logo_url}
                      alt={brand.brand_name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 text-center">
                      {brand.brand_name}
                    </h3>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        {/* /generate-posts */}
        <aside className={`w-80 min-h-svh bg-white shadow-lg p-6 `}>
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            New Added Campaign
          </h3>
          <div className="space-y-4">
            {latestCampaigns.length === 0 ? (
              <div>No campaigns present</div>
            ) : (
              latestCampaigns.map((c) => {
                return (
                  <Link
                    href={`/generate-posts?brand_id=${c.brand_id}&campaign_id=${c.campaign_id}`}
                    key={c.campaign_id}
                    className="p-4 cursor-pointer hover:bg-gray-100 bg-gray-50 rounded-lg flex items-start space-x-3"
                  >
                    <span className="relative flex h-3 w-3 mt-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-100"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <p className="text-gray-600 flex-1">{c.name}</p>
                  </Link>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
