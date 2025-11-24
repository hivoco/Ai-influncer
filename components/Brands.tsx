// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// type Brand = {
//   brand_id: string;
//   brand_name: string;
//   logo_url: string;
//   timezone: string;
//   notes: string;
//   created_at: string;
//   updated_at: string;
// };

// interface Campaign {
//   brand_id: string;
//   name: string;
//   objective: string;
//   start_date: string;
//   end_date: string;
//   status: string;
//   is_new: boolean;
//   campaign_id: string;
//   created_at: string;
//   updated_at: string;
// }

// type BrandsProps = {
//   brands: Brand[];
//   latestCampaigns: Campaign[];
// };

// export default function Brands({ brands, latestCampaigns }: BrandsProps) {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is logged in
//     const isLoggedIn = localStorage.getItem("isLoggedIn");
//     if (!isLoggedIn) {
//       router.push("/");
//     } else {
//       setIsLoading(false);
//     }
//   }, [router]);

//   const handleBrandClick = (brandId: string) => {
//     router.push(`/brand/${brandId}`);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("isLoggedIn");
//     router.push("/");
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-xl">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-900">
//             Brand Campaign Manager
//           </h1>

//           <div className="flex items-center gap-4">
//             <Link
//               className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//               href={"/create-prompt"}
//             >
//               Add Prompt
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="flex">
//         {/* Main Content */}
//         <main className="flex-1 p-8">
//           <h2 className="text-3xl font-bold text-gray-800 mb-8">
//             Select a Brand
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {brands.length === 0 ? (
//               <div>no brands present</div>
//             ) : (
//               brands.map((brand) => (
//                 <div
//                   key={brand.brand_id}
//                   onClick={() => handleBrandClick(brand.brand_id)}
//                   className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
//                 >
//                   <div className="relative h-48 bg-linear-to-br from-indigo-100 to-purple-100">
//                     <img
//                       src={brand.logo_url}
//                       alt={brand.brand_name}
//                       className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
//                     />
//                   </div>
//                   <div className="p-6">
//                     <h3 className="text-xl font-semibold text-gray-800 text-center">
//                       {brand.brand_name}
//                     </h3>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </main>

//         {/* Right Sidebar */}
//         {/* /generate-posts */}
//         <aside className={`w-80 min-h-svh bg-white shadow-lg p-6 `}>
//           <h3 className="text-xl font-bold text-gray-800 mb-6">
//             New Added Campaign
//           </h3>
//           <div className="space-y-4">
//             {latestCampaigns.length === 0 ? (
//               <div>No campaigns present</div>
//             ) : (
//               latestCampaigns.map((c) => {
//                 return (
//                   <Link
//                     href={`/generate-posts?brand_id=${c.brand_id}&campaign_id=${c.campaign_id}`}
//                     key={c.campaign_id}
//                     className="p-4 cursor-pointer hover:bg-gray-100 bg-gray-50 rounded-lg flex items-start space-x-3"
//                   >
//                     <span className="relative flex h-3 w-3 mt-1">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-100"></span>
//                       <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
//                     </span>
//                     <p className="text-gray-600 flex-1">{c.name}</p>
//                   </Link>
//                 );
//               })
//             )}
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  // console.log(brands, latestCampaigns);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Brand List</h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-all duration-200  transform "
            >
              <Menu className="w-6 h-6 text-black  transition-transform duration-200" />
            </button>
            <Link
              className="px-4 py-2 bg-black text-white rounded-lg  transition-all duration-200 hover:shadow-xl  transform "
              href="/create-prompt"
            >
              Add Prompt
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-black text-white rounded-lg  transition-all duration-200 hover:shadow-xl  transform "
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="relative flex">
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            {brands.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                No brands present
              </div>
            ) : (
              <Table className="hover:scale-100!">
                <TableHeader className="hover:scale-100!">
                  <TableRow className="hover:scale-100!">
                    <TableHead>Logo</TableHead>
                    <TableHead>Brand Name</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {brands.map((brand) => (
                    <TableRow
                      key={brand.brand_id}
                      onClick={() => handleBrandClick(brand.brand_id)}
                      className="cursor-pointer hover:bg-gray-200! group "
                    >
                      <TableCell className="py-">
                        <Image
                          src={brand.logo_url}
                          alt={brand.brand_name}
                          width={48}
                          height={48}
                          className="size-8 object-contain rounded transition-all duration-200 "
                        />
                      </TableCell>
                      <TableCell className="font-medium transition-all duration-200">
                        {brand.brand_name}
                      </TableCell>
                      <TableCell>
                        {new Date(brand.created_at).toISOString().split("T")[0]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </main>

        {/* Overlay */}
        {isSidebarOpen && (
          <div className=" z-40" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Right Sidebar */}
        <aside
          className={`  w-80 min-h-svh bg-white shadow-lg border-l border-gray-200 z-50 transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-normal text-gray-600">
                New Added Campaign
              </h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-lg transition-all duration-200 hover:scale-125 transform hover:ring-2 hover:ring-gray-300"
              >
                <X className="w-5 h-5 text-black hover:scale-150 transition-transform duration-200" />
              </button>
            </div>
            <div className="space-y-4 [&>*:nth-child(odd)]:bg-gray-100 [&>*:nth-child(even)]:bg-white">
              {latestCampaigns.length === 0 ? (
                <div className="text-gray-600">No campaigns present</div>
              ) : (
                latestCampaigns.map((c) => (
                  <Link
                    href={`/generate-posts?brand_id=${c.brand_id}&campaign_id=${c.campaign_id}`}
                    key={c.campaign_id}
                    className="p-4 cursor-pointer hover:bg-gray-100  shadow-md  bg-white border border-gray-200 rounded-lg flex items-start space-x-3 transition-all duration-200  transform "
                  >
                    <span className="relative flex h-3 w-3 mt-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-100"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-300  transition-transform duration-200"></span>
                    </span>
                    <p className="text-gray-800 flex-1 font-medium  transition-all duration-200">
                      {c.name}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
