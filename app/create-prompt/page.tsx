"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPrompt } from "@/services/apiCalls";
import { PromptForm } from "@/lib/types";
import {
  Loader2,
  Sparkles,
  FileText,
  Tag,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constant";


export default function CreatePromptPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [promptForm, setPromptForm] = useState<PromptForm>({
    name: "",
    prompt_text: "",
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createPrompt(promptForm);
      setShowSuccess(true);

      setTimeout(() => {
        setPromptForm({
          name: "",
          prompt_text: "",
          category: "",
        });
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create prompt. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof PromptForm, value: string) => {
    setPromptForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
      <header
        className="bg-white shadow-sm border-b border-gray-200"
        role="banner"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
            aria-label="Navigate back to dashboard"
          >
            &larr; Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-600" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Prompt
            </h1>
          </div>
          <div className="w-32" aria-hidden="true"></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Generate Creative Prompts
            </h2>
            <p className="text-gray-600">
              Create compelling prompts for your campaigns across different
              content types
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            aria-label="Create prompt form"
          >
            <div>
              <label
                htmlFor="name"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
              >
                <FileText
                  className="h-4 w-4 text-indigo-600"
                  aria-hidden="true"
                />
                Prompt Name *
              </label>
              <input
                type="text"
                id="name"
                value={promptForm.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="e.g., Zoom Shorts Holiday Campaign"
                disabled={isSubmitting}
                required
                minLength={3}
                autoComplete="off"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
              >
                <Tag className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                Category *
              </label>
              <select
                id="category"
                value={promptForm.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                disabled={isSubmitting}
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="prompt_text"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
              >
                <Sparkles
                  className="h-4 w-4 text-indigo-600"
                  aria-hidden="true"
                />
                Prompt Text *
              </label>
              <textarea
                id="prompt_text"
                value={promptForm.prompt_text}
                onChange={(e) =>
                  handleInputChange("prompt_text", e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                placeholder="e.g., Create a short, high-energy video prompt for Zoom's festive ad highlighting teamwork and holiday joy.
                           #Tips for Great Prompts:
                            Be specific about the tone and style you want
                            Include key themes or messages to convey
                            Mention the target audience if relevant
                            Specify any constraints (length, format, etc.)
"
                disabled={isSubmitting}
                required
                minLength={10}
              />
              <p className="mt-2 text-sm text-gray-500">
                Character count: {promptForm.prompt_text.length}
              </p>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                disabled={isSubmitting}
                aria-label="Cancel and return to dashboard"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold ${
                  isSubmitting
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:from-indigo-700 hover:to-purple-700"
                }`}
                aria-label={
                  isSubmitting
                    ? "Creating prompt, please wait"
                    : "Create prompt"
                }
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2
                      className="animate-spin h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Creating Prompt...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                    <span>Create Prompt</span>
                  </div>
                )}
              </button>
            </div>
          </form>
          {showSuccess && (
            <div
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
              role="alert"
              aria-live="polite"
            >
              <CheckCircle2
                className="h-5 w-5 text-green-600 shrink-0"
                aria-hidden="true"
              />
              <p className="text-green-800 font-medium">
                Prompt created successfully!
              </p>
            </div>
          )}

          {error && (
            <div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
              role="alert"
              aria-live="assertive"
            >
              <XCircle
                className="h-5 w-5 text-red-600 shrink-0"
                aria-hidden="true"
              />
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
