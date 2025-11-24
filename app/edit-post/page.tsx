"use client";
import { useState } from "react";
import CustomMarkdown from "@/components/generate-posts/CustomMarkdown";
import ImageUploader from "@/components/ImageUploader";
import { useStore } from "@/lib/store";
import { ChevronDown, ChevronRight, Loader2, X, Sparkles, Check, Clock } from "lucide-react";
import Image from "next/image";
import { socialMediaPlatforms } from "@/lib/constant";
import { toISTTimestamp } from "@/utilities/posts.utility";
import { genImage, schedulePost } from "@/services/apiCalls";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  const [selectedPlatform, setSelectedPlatform] = useState<string>("");

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
    setSelectedPlatform("");
    setScheduleError(null);
    setIsScheduleModalOpen(false);
  };

  const notify = (message) => toast(message);

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
    setSelectedPlatform(selectedPlatform === platform ? "" : platform);
  };

  const handleScheduleSubmit = async () => {
    if (scheduleDate && scheduleTime && selectedPlatform) {
      setIsScheduling(true);
      setScheduleError(null);

      try {
        const istTime = toISTTimestamp(scheduleDate, scheduleTime);
        if (!postID) return;
        const res = await schedulePost(postID, istTime, selectedPlatform);
        console.log(res);

        // Check if the API response indicates success
        if (res && res.status === "scheduled") {
          console.log("scheduled successfully 110");
          notify("Post scheduled successfully");

          // setIsScheduled(true);
          // Reset form and close modal
          // setScheduleDate("");
          // setScheduleTime("");
          // setSelectedPlatform("");
          // setIsScheduleModalOpen(false);
        } else {
          notify("Failed to schedule post. Please try again.");
          setScheduleError(
            res?.message || "Failed to schedule post. Please try again."
          );
        }
      } catch (error) {
        notify("Failed to schedule post. Please try again.");
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
    scheduleDate && scheduleTime && selectedPlatform;

  return (
    <div className="bg-background w-full min-h-svh flex">
      <div className="mx-auto container   flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Edit Post</h2>
          <button
            onClick={handleCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <label
            onClick={() => setDisplayPostContent((prev) => !prev)}
            htmlFor="postContent"
            className="text-sm font-medium text-foreground mb-2 flex"
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
              className="w-full h-50 overflow-y-auto px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none resize-none font-mono text-sm"
              placeholder="Write your post content here..."
            />
          )}
          <div className="mt-4 py-4 bg-muted rounded-lg prose prose-sm max-w-none text-foreground">
            <h3
              onClick={() => setDisplayMarkDown(!displayMarkDown)}
              className="text-sm font-semibold text-foreground mb-2 flex cursor-pointer"
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
                  className={`flex-1 bg-card rounded-t-xl max-w-xl mx-auto p-4 overflow-y-auto prose prose-sm  text-card-foreground  select-all`}
                >
                  {<CustomMarkdown text={currentText} />}
                </div>
                {files.length > 0 && (
                  <div className="relative max-w-xl mx-auto bg-card rounded-b-xl">
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
                                ? "bg-primary"
                                : "bg-muted"
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

        <div className="p-3 border-t border-border">
          <button
            onClick={handleScheduleClick}
            disabled={isScheduled}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
              isScheduled
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:shadow-md hover:bg-primary/90"
            }`}
          >
            {isScheduled ? "Post Scheduled" : "Schedule Post"}
          </button>
        </div>
      </div>

      {postID && (
        <aside className="w-1/3 border-l border-border">
          <ImageUploader postID={postID} files={files} setFiles={setFiles} />
          <div className="bg-muted rounded-xl p-4">
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
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none text-sm resize-none"
                  rows={3}
                />

                <button
                  onClick={() => handleGenerateImage(true)}
                  disabled={isGenerating}
                  className="w-full px-3 py-2 bg-primary hover:bg-primary/90 rounded-lg text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                className="w-full px-3 py-2 bg-primary hover:bg-primary/90 rounded-lg text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          <ToastContainer
            position="top-right"
            autoClose={3000}
            className="z-[999999]"
            toastClassName="!bg-black !text-white"
          />

          <div className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-border">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">
                Schedule Post
              </h2>
              <button
                onClick={handleScheduleCancel}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-6 w-6" strokeWidth={2} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Error Message */}
              {scheduleError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-lg">
                  <p className="text-sm text-destructive">{scheduleError}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label htmlFor="scheduleDate" className="block text-sm font-medium text-foreground mb-2">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    id="scheduleDate"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border text-foreground bg-background border-input rounded-lg focus:outline-none"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label
                    htmlFor="scheduleTime"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Select Time *
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <input
                      type="time"
                      id="scheduleTime"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="flex-1 px-4 py-3 border text-foreground bg-background border-input rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                {/* Social Media Platforms */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Select a Platform *
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {socialMediaPlatforms.map((platform) => (
                      <div key={platform.value}>
                        <input
                          type="radio"
                          name="platform"
                          value={platform.value}
                          required
                          checked={selectedPlatform === platform.value}
                          onChange={() => handlePlatformToggle(platform.value)}
                          className="sr-only"
                        />

                        <button
                          type="button"
                          onClick={() => handlePlatformToggle(platform.value)}
                          disabled={isScheduling}
                          aria-label={platform.label}
                          title={platform.label}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedPlatform === platform.value
                              ? "bg-primary text-primary-foreground"
                              : "border border-input bg-background text-foreground hover:bg-muted"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <FontAwesomeIcon
                            icon={platform.icon}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium">
                            {platform.label}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button
                onClick={handleScheduleCancel}
                disabled={isScheduling}
                className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSubmit}
                disabled={!isScheduleValid || isScheduling}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isScheduleValid && !isScheduling
                    ? "bg-primary text-primary-foreground hover:shadow-lg hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
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
