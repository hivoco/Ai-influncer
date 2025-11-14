"use client";
import { schedulePost } from "@/services/apiCalls";
import { toISTTimestamp } from "@/utilities/posts.utility";
import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Loader2,
  Pencil,
  X,
} from "lucide-react";
import { useState } from "react";
import CustomMarkdown from "./CustomMarkdown";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

interface PostCardProps {
  postID: string;
  markdownText: string;
  platform: string;
  onEdit?: (newText: string) => void;
  onSchedule?: (scheduleData: ScheduleData) => void;
}

interface ScheduleData {
  date: string;
  time: string;
  platforms: string[];
}

export default function PostCard({
  postID,
  markdownText,
  // onEdit,
  // onSchedule,
  platform,
}: PostCardProps) {
  const router = useRouter();
  const { data, setData } = useStore();

  console.log(platform)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editedText, setEditedText] = useState(markdownText);
  const [currentText, setCurrentText] = useState(markdownText);
  const [displayMarkDown, setDisplayMarkDown] = useState(false);
  const [displayPostContent, setDisplayPostContent] = useState(true);

  const [ISTTimestamp, setISTTimestamp] = useState<string>("");

  // Scheduled state
  const [isScheduled, setIsScheduled] = useState(false);

  const [scheduledInfo, setScheduledInfo] = useState<{
    date: string;
    time: string;
    platforms: string[];
  } | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  // Schedule form state
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const socialMediaPlatforms = [
    { value: "instagram", label: "Instagram", icon: "📷" },
    { value: "facebook", label: "Facebook", icon: "👥" },
    { value: "twitter", label: "Twitter/X", icon: "🐦" },
    { value: "linkedin", label: "LinkedIn", icon: "💼" },
    { value: "tiktok", label: "TikTok", icon: "🎵" },
    { value: "youtube", label: "YouTube Shorts", icon: "▶️" },
    { value: "reddit", label: "Reddit", icon: "🤖" },
    { value: "wikipedia", label: "Wikipedia", icon: "📚" },
  ];

  const handleEditClick = () => {
    setEditedText(currentText);
    setIsEditModalOpen(true);
    setData({
      currentText: currentText,
      postID: postID,
    });
    router.push("/edit-post");
  };

  const handleSave = () => {
    setCurrentText(editedText);
    // if (onEdit) {
    //   onEdit(editedText);
    // }
    setIsEditModalOpen(false);
  };

  const handleCancel = () => {
    setEditedText(currentText);
    setIsEditModalOpen(false);
  };

  const handleScheduleClick = () => {
    setScheduleError(null);
    setIsScheduleModalOpen(true);
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        return prev.filter((p) => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  const handleScheduleSubmit = async () => {
    if (scheduleDate && scheduleTime && selectedPlatforms.length > 0) {
      setIsScheduling(true);
      setScheduleError(null);

      const scheduleData: ScheduleData = {
        date: scheduleDate,
        time: scheduleTime,
        platforms: selectedPlatforms,
      };

      try {
        console.log(platform);
        const istTime = toISTTimestamp(scheduleDate, scheduleTime);
        const res = await schedulePost(postID, istTime, platform);
        // Check if the API response indicates success
        if (
          res &&
          (res.success ||
            res.status === "success" ||
            res.status === 200 ||
            res.ok)
        ) {
          // Success - update scheduled state
          setIsScheduled(true);
          // setScheduledInfo({
          //   date: scheduleDate,
          //   time: scheduleTime,
          //   platforms: selectedPlatforms,
          // });

          // if (onSchedule) {
          //   onSchedule(scheduleData);
          // }

          // Reset form and close modal
          setScheduleDate("");
          setScheduleTime("");
          setSelectedPlatforms([]);
          setIsScheduleModalOpen(false);
        } else {
          // API returned but with error
          setScheduleError(
            res?.message || "Failed to schedule post. Please try again."
          );
        }
      } catch (error) {
        console.error("Error scheduling post:", error);
        setScheduleError(
          "An error occurred while scheduling. Please try again."
        );
      } finally {
        setIsScheduling(false);
      }
    }
  };

  const handleScheduleCancel = () => {
    setScheduleDate("");
    setScheduleTime("");
    setSelectedPlatforms([]);
    setScheduleError(null);
    setIsScheduleModalOpen(false);
  };

  const handleRemoveSchedule = () => {
    setIsScheduled(false);
    setScheduledInfo(null);
  };

  const formatScheduledDateTime = () => {
    if (!scheduledInfo) return "";
    const date = new Date(`${scheduledInfo.date} ${scheduledInfo.time}`);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isScheduleValid =
    scheduleDate && scheduleTime && selectedPlatforms.length > 0;

  return (
    <>
      <div
        className="min-w-[400px] h-[400px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden border border-gray-200 relative
      "
      >
        {/* Scheduled Badge */}
        {isScheduled && scheduledInfo && (
          <div className="absolute top-2 left-2 right-12 z-10">
            <div className="bg-green-100 border border-green-300 rounded-lg p-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-green-700">
                      Scheduled
                    </span>
                    <span className="text-xs text-green-600">
                      {formatScheduledDateTime()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleRemoveSchedule}
                  className="text-green-600 hover:text-green-800 ml-2"
                  title="Cancel schedule"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {scheduledInfo.platforms.length > 0 && (
                <div className="mt-1 flex gap-1">
                  {scheduledInfo.platforms.map((platform) => {
                    const platformData = socialMediaPlatforms.find(
                      (p) => p.value === platform
                    );
                    return platformData ? (
                      <span
                        key={platform}
                        className="text-xs"
                        title={platformData.label}
                      >
                        {platformData.icon}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header with Edit Icon */}
        <div className="flex justify-end p-3 border-b border-gray-100">
          <button
            onClick={handleEditClick}
            className="text-gray-500 hover:text-indigo-600 transition-colors"
            title="Edit post"
          >
            <Pencil className="h-5 w-5" />
          </button>
        </div>

        {/* Markdown Content */}
        <div
          className={`flex-1 p-4 overflow-y-auto prose prose-sm max-w-none text-gray-700 ${
            isScheduled ? "pt-14" : ""
          }`}
        >
          {<CustomMarkdown text={currentText} />}
        </div>

        {/* Schedule Button */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleScheduleClick}
            disabled={isScheduled}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
              isScheduled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:shadow-md"
            }`}
          >
            {isScheduled ? "Post Scheduled" : "Schedule Post"}
          </button>
        </div>
      </div>
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl  max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <label
                onClick={() => setDisplayPostContent((prev) => !prev)}
                htmlFor="postContent"
                className="text-sm font-medium text-gray-700 mb-2 flex"
              >
                {displayPostContent ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
                Post Content (Markdown Supported)
              </label>
              {displayPostContent && (
                <textarea
                  id="postContent"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full h-50 overflow-y-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-700 resize-none font-mono text-sm"
                  placeholder="Write your post content here..."
                />
              )}
              <div className="mt-4 py-4 bg-gray-50 rounded-lg prose prose-sm max-w-none text-gray-700">
                <h3
                  onClick={() => setDisplayMarkDown(!displayMarkDown)}
                  className="text-sm font-semibold text-gray-700 mb-2 flex cursor-pointer"
                >
                  {displayMarkDown ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                  Preview:
                </h3>
                {displayMarkDown && <CustomMarkdown text={editedText} />}
              </div>
            </div>
            {/* <ImageUploader /> */}

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Schedule Post
              </h2>
              <button
                onClick={handleScheduleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" strokeWidth={2} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Error Message */}
              {scheduleError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-sm text-red-700">{scheduleError}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label
                    htmlFor="scheduleDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Date *
                  </label>
                  <input
                    type="date"
                    id="scheduleDate"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border text-gray-700  border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label
                    htmlFor="scheduleTime"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Time *
                  </label>
                  <input
                    type="time"
                    id="scheduleTime"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Social Media Platforms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Platforms * (Choose one or more)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {socialMediaPlatforms.map((platform) => (
                      <button
                        key={platform.value}
                        type="button"
                        onClick={() => handlePlatformToggle(platform.value)}
                        disabled={isScheduling}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                          selectedPlatforms.includes(platform.value)
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        } ${
                          isScheduling ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <span className="text-2xl">{platform.icon}</span>
                        <span className="font-medium">{platform.label}</span>
                        {selectedPlatforms.includes(platform.value) && (
                          <svg
                            className="ml-auto h-5 w-5 text-indigo-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Platforms Summary */}
                {selectedPlatforms.length > 0 && (
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm font-medium text-indigo-900 mb-2">
                      Selected Platforms ({selectedPlatforms.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlatforms.map((platformValue) => {
                        const platform = socialMediaPlatforms.find(
                          (p) => p.value === platformValue
                        );
                        return platform ? (
                          <span
                            key={platformValue}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm font-medium text-indigo-700"
                          >
                            <span>{platform.icon}</span>
                            <span>{platform.label}</span>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleScheduleCancel}
                disabled={isScheduling}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSubmit}
                disabled={!isScheduleValid || isScheduling}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isScheduleValid && !isScheduling
                    ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isScheduling && (
                  <Loader2 className="h-4 w-4 text-white animate-spin" />
                )}
                {isScheduling ? "Scheduling..." : "Schedule Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
