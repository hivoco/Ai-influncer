// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LandingPage() {
//   const router = useRouter();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     // Check if user is already logged in
//     const loggedIn = localStorage.getItem("isLoggedIn");
//     setIsLoggedIn(!!loggedIn);
//   }, []);

//   const handleExplore = () => {
//     // Check if user is logged in
//     const loggedIn = localStorage.getItem("isLoggedIn");
//     if (loggedIn) {
//       router.push("/dashboard");
//     } else {
//       router.push("/login");
//     }
//   };

//   const features = [
//     {
//       title: "AI-Powered Personas",
//       description:
//         "Create intelligent AI influencer personas with customizable traits like tone, wit, and aspiration levels.",
//       icon: "🎭",
//     },
//     {
//       title: "Team Collaboration",
//       description:
//         "Your team works seamlessly to review, evaluate, and refine AI-generated content.",
//       icon: "👥",
//     },
//     {
//       title: "Iterative Refinement",
//       description:
//         "Continuous improvement loop with LLM regeneration until the perfect post is created.",
//       icon: "♻️",
//     },
//     {
//       title: "Multi-Platform Publishing",
//       description:
//         "Schedule and publish content across 8+ social media platforms from one dashboard.",
//       icon: "🌐",
//     },
//     {
//       title: "Campaign Management",
//       description:
//         "Organize and track multiple campaigns for different brands with clear objectives.",
//       icon: "📊",
//     },
//     {
//       title: "Quality Assurance",
//       description:
//         "Human-in-the-loop evaluation ensures every post meets your brand standards.",
//       icon: "⭐",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-2">
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//               AI Influencer Hub
//             </h1>
//           </div>
//           <button
//             onClick={() => router.push(isLoggedIn ? "/dashboard" : "/login")}
//             className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition duration-300 font-semibold"
//           >
//             {isLoggedIn ? "Dashboard" : "Sign In"}
//           </button>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
//         <div className="inline-block mb-4 px-4 py-2 bg-purple-100 rounded-full">
//           <span className="text-purple-700 font-semibold text-sm">
//             Professional AI Content Generation Platform
//           </span>
//         </div>
//         <h2 className="text-5xl md:text-6xl  font-bold text-gray-900 mb-6">
//           AI-Powered Social Media
//           {/* Content Engine */}
//           <br />
//           <span
//             className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent
//           text-5xl md:text-6xl
//           "
//           >
//             Content Engine
//           </span>
//         </h2>

//         <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
//           Create, evaluate, and schedule scroll-stopping social posts using AI
//           influencer personas across every major platform.
//         </p>
//         <button
//           onClick={handleExplore}
//           className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold inline-flex items-center space-x-2"
//         >
//           <span className="">See It in Action</span>
//           <span>→</span>
//         </button>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">
//           <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
//             <div className="text-4xl font-bold text-purple-600 mb-2">8+</div>
//             <div className="text-gray-600 text-sm">Social Platforms</div>
//           </div>
//           <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
//             <div className="text-4xl font-bold text-pink-600 mb-2">∞</div>
//             <div className="text-gray-600 text-sm">AI Personas</div>
//           </div>
//           <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
//             <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
//             <div className="text-gray-600 text-sm">Quality Assured</div>
//           </div>
//           <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
//             <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
//             <div className="text-gray-600 text-sm">Content Generation</div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="text-center mb-16">
//           <h3 className="text-4xl font-bold text-gray-900 mb-4">
//             Powerful Features
//           </h3>
//           <p className="text-xl text-gray-600">
//             Everything you need to create and manage exceptional social media
//             content
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2"
//             >
//               <div className="text-5xl mb-4">{feature.icon}</div>
//               <h4 className="text-xl font-bold text-gray-900 mb-3">
//                 {feature.title}
//               </h4>
//               <p className="text-gray-600 leading-relaxed">
//                 {feature.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="flex items-center justify-center space-x-2 mb-4">
//             <h1 className="text-2xl font-bold">AI Influencer Hub</h1>
//           </div>
//           <p className="text-gray-400 mb-4">
//             Professional AI-powered social media content generation platform
//           </p>
//           <p className="text-gray-500 text-sm">
//             © 2025 AI Influencer Hub. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// UI 2 ---------------------

// -------------------------------

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LandingPage() {
//   const router = useRouter();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     // Check if user is already logged in
//     const loggedIn = localStorage.getItem("isLoggedIn");
//     setIsLoggedIn(!!loggedIn);
//   }, []);

//   const handleExplore = () => {
//     // Check if user is logged in
//     const loggedIn = localStorage.getItem("isLoggedIn");
//     if (loggedIn) {
//       router.push("/dashboard");
//     } else {
//       router.push("/login");
//     }
//   };

//   const features = [
//     {
//       title: "AI-Powered Personas",
//       description:
//         "Create intelligent AI influencer personas with customizable traits like tone, wit, and aspiration levels.",
//       icon: "🎭",
//     },
//     {
//       title: "Team Collaboration",
//       description:
//         "Your team works seamlessly to review, evaluate, and refine AI-generated content.",
//       icon: "👥",
//     },
//     {
//       title: "Iterative Refinement",
//       description:
//         "Continuous improvement loop with LLM regeneration until the perfect post is created.",
//       icon: "♻️",
//     },
//     {
//       title: "Multi-Platform Publishing",
//       description:
//         "Schedule and publish content across 8+ social media platforms from one dashboard.",
//       icon: "🌐",
//     },
//     {
//       title: "Campaign Management",
//       description:
//         "Organize and track multiple campaigns for different brands with clear objectives.",
//       icon: "📊",
//     },
//     {
//       title: "Quality Assurance",
//       description:
//         "Human-in-the-loop evaluation ensures every post meets your brand standards.",
//       icon: "⭐",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-2">
//             <h1 className="text-2xl font-bold text-black">
//               AI Influencer Hub
//             </h1>
//           </div>
//           <button
//             onClick={() => router.push(isLoggedIn ? "/dashboard" : "/login")}
//             className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300 font-semibold"
//           >
//             {isLoggedIn ? "Dashboard" : "Sign In"}
//           </button>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
//         <div className="inline-block mb-4 px-4 py-2 bg-gray-100 rounded-full">
//           <span className="text-black font-semibold text-sm">
//             Professional AI Content Generation Platform
//           </span>
//         </div>
//         <h2 className="text-5xl md:text-6xl font-bold text-black mb-6">
//           AI-Powered Social Media
//           <br />
//           <span className="text-gray-600 text-5xl md:text-6xl">
//             Content Engine
//           </span>
//         </h2>

//         <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
//           Create, evaluate, and schedule scroll-stopping social posts using AI
//           influencer personas across every major platform.
//         </p>
//         <button
//           onClick={handleExplore}
//           className="px-12 py-4 bg-black text-white text-lg rounded-full hover:bg-gray-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold inline-flex items-center space-x-2"
//         >
//           <span>See It in Action</span>
//           <span>→</span>
//         </button>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">
//           <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
//             <div className="text-4xl font-bold text-black mb-2">8+</div>
//             <div className="text-gray-600 text-sm">Social Platforms</div>
//           </div>
//           <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
//             <div className="text-4xl font-bold text-black mb-2">∞</div>
//             <div className="text-gray-600 text-sm">AI Personas</div>
//           </div>
//           <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
//             <div className="text-4xl font-bold text-black mb-2">100%</div>
//             <div className="text-gray-600 text-sm">Quality Assured</div>
//           </div>
//           <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
//             <div className="text-4xl font-bold text-black mb-2">24/7</div>
//             <div className="text-gray-600 text-sm">Content Generation</div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
//         <div className="text-center mb-16">
//           <h3 className="text-4xl font-bold text-black mb-4">
//             Powerful Features
//           </h3>
//           <p className="text-xl text-gray-600">
//             Everything you need to create and manage exceptional social media
//             content
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition duration-300 hover:-translate-y-2"
//             >
//               <div className="text-5xl mb-4">{feature.icon}</div>
//               <h4 className="text-xl font-bold text-black mb-3">
//                 {feature.title}
//               </h4>
//               <p className="text-gray-600 leading-relaxed">
//                 {feature.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-black text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="flex items-center justify-center space-x-2 mb-4">
//             <h1 className="text-2xl font-bold">AI Influencer Hub</h1>
//           </div>
//           <p className="text-gray-400 mb-4">
//             Professional AI-powered social media content generation platform
//           </p>
//           <p className="text-gray-500 text-sm">
//             © 2025 AI Influencer Hub. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(!!loggedIn);
  }, []);

  const handleExplore = () => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const features = [
    {
      title: "AI-Powered Personas",
      description:
        "Create intelligent AI influencer personas with customizable traits like tone, wit, and aspiration levels.",
      icon: "🎭",
    },
    {
      title: "Team Collaboration",
      description:
        "Your team works seamlessly to review, evaluate, and refine AI-generated content.",
      icon: "👥",
    },
    {
      title: "Iterative Refinement",
      description:
        "Continuous improvement loop with LLM regeneration until the perfect post is created.",
      icon: "♻️",
    },
    {
      title: "Multi-Platform Publishing",
      description:
        "Schedule and publish content across 8+ social media platforms from one dashboard.",
      icon: "🌐",
    },
    {
      title: "Campaign Management",
      description:
        "Organize and track multiple campaigns for different brands with clear objectives.",
      icon: "📊",
    },
    {
      title: "Quality Assurance",
      description:
        "Human-in-the-loop evaluation ensures every post meets your brand standards.",
      icon: "⭐",
    },
  ];

  const stats = [
    { value: "8+", label: "Social Platforms" },
    { value: "∞", label: "AI Personas" },
    { value: "100%", label: "Quality Assured" },
    { value: "24/7", label: "Content Generation" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Influencer Hub</h1>
          <Button
            onClick={() => router.push(isLoggedIn ? "/dashboard" : "/login")}
            className="rounded-full"
          >
            {isLoggedIn ? "Dashboard" : "Sign In"}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          Professional AI Content Generation Platform
        </Badge>

        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          AI-Powered Social Media
          <br />
          <span className="text-muted-foreground">Content Engine</span>
        </h2>

        <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
          Create, evaluate, and schedule scroll-stopping social posts using AI
          influencer personas across every major platform.
        </p>

        <Button
          onClick={handleExplore}
          size="lg"
          className="rounded-full px-10 text-lg font-bold"
        >
          See It in Action
          <span className="ml-2">→</span>
        </Button>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-muted/50">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4">Powerful Features</h3>
          <p className="text-xl text-muted-foreground">
            Everything you need to create and manage exceptional social media
            content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <CardHeader>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">AI Influencer Hub</h1>
          <p className="text-primary-foreground/80 mb-4">
            Professional AI-powered social media content generation platform
          </p>
          <p className="text-primary-foreground/60 text-sm">
            © 2025 AI Influencer Hub. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
