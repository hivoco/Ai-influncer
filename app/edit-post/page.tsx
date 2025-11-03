"use client";
import { useState } from "react";
import CustomMarkdown from "@/components/CustomMarkdown";
import ImageUploader from "@/components/ImageUploader";
import { useStore } from "@/lib/store";
import { ChevronDown, ChevronRight, Loader2, X, Sparkles } from "lucide-react";
import Image from "next/image";
import { socialMediaPlatforms } from "@/lib/constant";
import { toISTTimestamp } from "@/utilities/posts.utility";
import { genImage, schedulePost } from "@/services/apiCalls";

interface ScheduleData {
  date: string;
  time: string;
  platforms: string[];
}
const Page = () => {
  const [files, setFiles] = useState<File[]>([]);
  const text = useStore((state) => state.data?.currentText);
  const postID = useStore((state) => state.data?.postID);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [displayPostContent, setDisplayPostContent] = useState(true);
  const [displayMarkDown, setDisplayMarkDown] = useState(false);
  const [currentText, setCurrentText] = useState(text);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const [generatedImageData, setGeneratedImageData] = useState<{
    image_url: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const [imageFeedback, setImageFeedback] = useState("");

  const handleCancel = () => {
    setEditedText(currentText);
    setIsEditModalOpen(false);
  };

  const handleScheduleCancel = () => {
    setScheduleDate("");
    setScheduleTime("");
    setSelectedPlatforms([]);
    setScheduleError(null);
    setIsScheduleModalOpen(false);
  };

  const handleSave = () => {
    // setCurrentText(editedText);
    // if (onEdit) {
    //   onEdit(editedText);
    // }
    setIsEditModalOpen(false);
  };

  const handleScheduleClick = () => {
    // setScheduleError(null);
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
        const istTime = toISTTimestamp(scheduleDate, scheduleTime);
        if (!postID) return;
        const res = await schedulePost(postID, istTime);
        console.log(res);

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

  const handleGenerateImage = async (regenerate = false) => {
    if (!postID) return;

    setIsGenerating(true);
    try {
      const data = await genImage(postID, {
        regenerate,
        edit_feedback: imageFeedback,
        provider: "google",
      });

      setGeneratedImageData(data);
      if (regenerate) setImageFeedback("");
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isScheduleValid =
    scheduleDate && scheduleTime && selectedPlatforms.length > 0;

  return (
    <div className="bg-white w-full min-h-svh flex">
      <div className="mx-auto container   flex flex-col">
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
              value={editedText ? editedText : ""}
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

            {displayMarkDown && currentText && (
              <div className="">
                <div
                  className={`flex-1 bg-gray-100 rounded-t-xl max-w-xl mx-auto p-4 overflow-y-auto prose prose-sm  text-gray-700  select-all`}
                >
                  {<CustomMarkdown text={currentText} />}
                </div>
                {files.length > 0 && (
                  <div className="relative max-w-xl mx-auto bg-gray-100 rounded-b-xl">
                    {files.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentIndex(
                              (i) => (i - 1 + files.length) % files.length
                            )
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                        >
                          ←
                        </button>
                        <button
                          onClick={() =>
                            setCurrentIndex((i) => (i + 1) % files.length)
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                        >
                          →
                        </button>
                      </>
                    )}
                    <Image
                      width={200}
                      height={128}
                      src={URL.createObjectURL(files[currentIndex || 0])}
                      alt={`Image ${(currentIndex || 0) + 1}`}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    {files.length > 1 && (
                      <div className="flex justify-center gap-2 mt-3">
                        {files.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-2 h-2 rounded-full transition ${
                              i === (currentIndex || 0)
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        {/* <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
          >
            Save Changes
          </button>
        </div> */}

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

      {postID && (
        <aside className="w-1/3 border-l border-gray-300">
          <ImageUploader postID={postID} files={files} setFiles={setFiles} />

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4">
            {generatedImageData?.image_url ? (
              <div className="space-y-3">
                <>
                  <div
                    className="relative rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => setShowOverlay(true)}
                  >
                    <Image
                      src={generatedImageData.image_url}
                      alt="Generated image"
                      width={400}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>

                  {showOverlay && (
                    <div
                      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 "
                      onClick={() => setShowOverlay(false)}
                    >
                      <Image
                        src={generatedImageData.image_url}
                        alt="Generated image"
                        width={1200}
                        height={1200}
                        className="max-w-full max-h-full object-contain "
                      />
                    </div>
                  )}
                </>

                <textarea
                  value={imageFeedback}
                  onChange={(e) => setImageFeedback(e.target.value)}
                  placeholder="Describe changes you'd like to make..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm resize-none"
                  rows={3}
                />

                <button
                  onClick={() => handleGenerateImage(true)}
                  disabled={isGenerating}
                  className="w-full px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Regenerate Image
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleGenerateImage(false)}
                disabled={isGenerating}
                className="w-full px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate an Image
                  </>
                )}
              </button>
            )}
          </div>
        </aside>
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
    </div>
  );
};

export default Page;
