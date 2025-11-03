import { Check, X } from "lucide-react";

const ScheduleModal = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Schedule Post</h2>
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
                    } ${isScheduling ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="text-2xl">{platform.icon}</span>
                    <span className="font-medium">{platform.label}</span>
                    {selectedPlatforms.includes(platform.value) && (
                      <Check className="ml-auto h-5 w-5 text-indigo-600" />
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
  );
};

export default ScheduleModal;
