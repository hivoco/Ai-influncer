import GeneratePostsContent from "@/components/generate-posts/GeneratePostsContent";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function GeneratePostsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      }
    >
      <GeneratePostsContent />
    </Suspense>
  );
}
