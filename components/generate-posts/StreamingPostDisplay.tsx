"use client";

import { useEffect, useRef, useState } from "react";
import PostCard from "./PostCard";
import CustomMarkdown from "./CustomMarkdown";
import { Loader2 } from "lucide-react";

interface Post {
  postNumber: number;
  id: string;
  text: string;
  imageUrl: string;
  isComplete: boolean;
  textStreamingFinished: boolean;
}

interface StreamingPostDisplayProps {
  apiUrl: string;
  campaignId: string;
  personaId: string;
  platformId: string;
  title: string;
  userPrompt: string;
  count: number;
  setIsGeneratingPosts: (value: boolean) => void;
}

export default function StreamingPostDisplay({
  apiUrl,
  campaignId,
  personaId,
  platformId,
  title,
  userPrompt,
  count,
  setIsGeneratingPosts,
}: StreamingPostDisplayProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPostIndex, setCurrentPostIndex] = useState<number | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new MutationObserver(() => {
      el.scrollIntoView({ behavior: "smooth", block: "end" });
    });

    obs.observe(el, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let abortController: AbortController | null = null;

    const startStreaming = async () => {
      setIsStreaming(true);
      setError(null);
      abortController = new AbortController();

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaign_id: campaignId,
            persona_id: personaId,
            platform_id: platformId,
            title: title,
            user_prompt: userPrompt,
            count: count,
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let currentEvent = "";
        let currentData: string | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith("event:")) {
              // Process previous event if we have both event and data
              if (currentEvent && currentData !== null) {
                processEvent(currentEvent, currentData);
              }
              currentEvent = trimmedLine.substring(6).trim();
              currentData = null;
            } else if (trimmedLine.startsWith("data:")) {
              // SSE format is "data: value" or "data:value"
              // Extract everything after "data:" and remove leading space if present
              const dataStart = line.indexOf("data:") + 5;
              let data = line.substring(dataStart);

              // Remove single leading space (SSE standard format is "data: value")
              if (data.startsWith(" ")) {
                data = data.substring(1);
              }

              currentData = data;
            } else if (trimmedLine === "") {
              // Empty line - process the event if we have both
              if (currentEvent && currentData !== null) {
                processEvent(currentEvent, currentData);
                currentEvent = "";
                currentData = null;
              }
            }
          }
        }

        // Process any remaining event in buffer after stream ends
        if (currentEvent && currentData !== null) {
          processEvent(currentEvent, currentData);
        }

        setIsStreaming(false);
        setIsGeneratingPosts(false);
        setCurrentPostIndex(null);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to generate posts");
        }
        setIsStreaming(false);
      }
    };

    const processEvent = (eventType: string, data: string) => {
      // Trim data for comparison in status events
      const trimmedData = data.trim();

      // Handle status events
      if (eventType === "status") {
        if (trimmedData.startsWith("starting_post_")) {
          const postNum = parseInt(trimmedData.split("_")[2]);
          setCurrentPostIndex(postNum);

          setPosts((prev) => {
            const existingIndex = prev.findIndex(
              (p) => p.postNumber === postNum
            );
            if (existingIndex === -1) {
              return [
                ...prev,
                {
                  postNumber: postNum,
                  id: `post_${postNum}_temp`,
                  text: "",
                  imageUrl: "",
                  isComplete: false,
                  textStreamingFinished: false,
                },
              ];
            }
            return prev;
          });
        } else if (trimmedData.startsWith("streaming_finished_")) {
          const postNum = parseInt(trimmedData.split("_")[2]);
          setPosts((prev) => {
            return prev.map((post) => {
              if (post.postNumber === postNum) {
                return {
                  ...post,
                  textStreamingFinished: true,
                };
              }
              return post;
            });
          });
        } else if (trimmedData === "all_posts_completed") {
          setIsStreaming(false);
          setCurrentPostIndex(null);
        }
      }

      // Handle token streaming (token_1, token_2, etc.)
      else if (eventType.startsWith("token_")) {
        const postNum = parseInt(eventType.split("_")[1]);
        const decodedData = data.replace(/\\n/g, "\n");

        setPosts((prev) => {
          return prev.map((post) => {
            if (post.postNumber === postNum && !post.isComplete) {
              return {
                ...post,
                text: post.text + decodedData,
              };
            }
            return post;
          });
        });
      }

      // Handle post completion (post_complete_1, post_complete_2, etc.)
      else if (eventType.startsWith("post_complete_")) {
        const postNum = parseInt(eventType.split("_")[2]);

        try {
          let postData;

          // Try parsing as JSON first
          try {
            postData = JSON.parse(data);
          } catch (jsonErr) {
            // If that fails, convert Python dict to JSON
            const jsonStr = data
              .replace(/'/g, '"') // Replace single quotes with double
              .replace(/True/g, "true") // Python True -> JSON true
              .replace(/False/g, "false") // Python False -> JSON false
              .replace(/None/g, "null"); // Python None -> JSON null
            postData = JSON.parse(jsonStr);
          }

          setPosts((prev) => {
            return prev.map((post) => {
              if (post.postNumber === postNum) {
                return {
                  ...post,
                  id: postData.post_id,
                  // Preserve streamed text if it exists; only use completion text if no streamed content
                  text: post.text || postData.text,
                  imageUrl: postData.image_url,
                  isComplete: true,
                };
              }
              return post;
            });
          });
        } catch {
          // Fallback: just mark as complete with existing text
          setPosts((prev) => {
            return prev.map((post) => {
              if (post.postNumber === postNum) {
                return {
                  ...post,
                  isComplete: true,
                };
              }
              return post;
            });
          });
        }
      }

      // Handle done event
      else if (eventType === "done") {
        setIsStreaming(false);
        setCurrentPostIndex(null);
      }
    };

    startStreaming();

    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [
    apiUrl,
    campaignId,
    personaId,
    platformId,
    title,
    userPrompt,
    count,
    setIsGeneratingPosts,
  ]);

  // Sort posts by postNumber
  const sortedPosts = [...posts].sort((a, b) => a.postNumber - b.postNumber);

  return (
    <div ref={ref} className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Generated Posts
        </h1>
        {isStreaming && (
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">
              Generating posts... ({posts.filter((p) => p.isComplete).length} of{" "}
              {count} completed)
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">Error:</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {sortedPosts.length > 0 && (
        <div className="w-full px-2 flex gap-20 ">
          {sortedPosts.map((post) => (
            <div
              key={post.id}
              className={`max-w-1/2 w-full transition-all duration-300 ${
                currentPostIndex === post.postNumber ? " rounded-lg" : ""
              }`}
            >
              {/* Show text while streaming or after text finishes */}
              {!post.isComplete && post.text && (
                <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-sm font-semibold text-primary">
                      {post.textStreamingFinished
                        ? `Generating Image for Post #${post.postNumber}...`
                        : `Streaming Post #${post.postNumber}...`}
                    </span>
                  </div>

                  <div className="min-h-[350px] prose prose-sm max-w-none text-gray-700 relative ">
                    <CustomMarkdown text={post.text} />

                    {post.textStreamingFinished && !post.isComplete && (
                      <div className="relative w-full h-[300px] rounded-lg shadow-sm mx-auto overflow-hidden bg-black/20 animate-pulse mt-4 ">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full animate-[shine_2s_ease-in-out_infinite]"
                          style={{
                            animation: "shine 2s ease-in-out infinite",
                            transform: "translateX(-100%) skewX(-20deg)",
                            width: "50%",
                          }}
                        />
                        <style jsx>{`
                          @keyframes shine {
                            0% {
                              transform: translateX(-100%) skewX(-20deg);
                            }
                            100% {
                              transform: translateX(300%) skewX(-20deg);
                            }
                          }
                        `}</style>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Show final PostCard when complete */}
              {post.isComplete && (
                <PostCard
                  imageUrl={post.imageUrl || ""}
                  postID={post.id}
                  markdownText={post.text}
                  platform={platformId}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {sortedPosts.length === 0 && isStreaming && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-gray-600">Waiting for posts to generate...</p>
        </div>
      )}
    </div>
  );
}
