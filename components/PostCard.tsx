

// 'use client'

// import React, { useState } from 'react'
// import ReactMarkdown from 'react-markdown'

// interface PostCardProps {
//   markdownText: string
//   onEdit?: (newText: string) => void
//   onSchedule?: () => void
// }

// export default function PostCard({ markdownText, onEdit, onSchedule }: PostCardProps) {
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
//   const [editedText, setEditedText] = useState(markdownText)
//   const [currentText, setCurrentText] = useState(markdownText)

//   const handleEditClick = () => {
//     setEditedText(currentText)
//     setIsEditModalOpen(true)
//   }

//   const handleSave = () => {
//     setCurrentText(editedText)
//     if (onEdit) {
//       onEdit(editedText)
//     }
//     setIsEditModalOpen(false)
//   }

//   const handleCancel = () => {
//     setEditedText(currentText)
//     setIsEditModalOpen(false)
//   }

//   return (
//     <>
//       <div className="min-w-[400px] h-[400px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden border border-gray-200">
//         {/* Header with Edit Icon */}
//         <div className="flex justify-end p-3 border-b border-gray-100">
//           <button
//             onClick={handleEditClick}
//             className="text-gray-500 hover:text-indigo-600 transition-colors"
//             title="Edit post"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//             </svg>
//           </button>
//         </div>

//         {/* Markdown Content */}
//         <div className="flex-1 p-4 overflow-y-auto prose prose-sm max-w-none text-gray-700 leading-relaxed">
//           <ReactMarkdown
//             // className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
//             components={{
//               h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 text-gray-900" {...props} />,
//               h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 text-gray-900" {...props} />,
//               h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-2 text-gray-900" {...props} />,
//               p: ({ node, ...props }) => <p className="mb-2 text-sm" {...props} />,
//               strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
//               em: ({ node, ...props }) => <em className="italic" {...props} />,
//               ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 text-sm" {...props} />,
//               ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 text-sm" {...props} />,
//               li: ({ node, ...props }) => <li className="mb-1" {...props} />,
//               a: ({ node, ...props }) => <a className="text-indigo-600 hover:underline" {...props} />,
//               blockquote: ({ node, ...props }) => (
//                 <blockquote className="border-l-4 border-gray-300 pl-3 italic mb-2 text-sm" {...props} />
//               ),
//               code: ({ node, ...props }) => (
//                 <code className="bg-gray-100 px-1 py-0.5 rounded text-xs" {...props} />
//               ),
//             }}
//           >
//             {currentText}
//           </ReactMarkdown>
//         </div>

//         {/* Schedule Button */}
//         <div className="p-3 border-t border-gray-100">
//           <button
//             onClick={onSchedule}
//             className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-md transition-all duration-200 font-semibold text-sm"
//           >
//             Schedule Post
//           </button>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {isEditModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
//               <button
//                 onClick={handleCancel}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="flex-1 p-6 overflow-y-auto">
//               <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 mb-2">
//                 Post Content (Markdown Supported)
//               </label>
//               <textarea
//                 id="postContent"
//                 value={editedText}
//                 onChange={(e) => setEditedText(e.target.value)}
//                 className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 outline-none resize-none font-mono text-sm"
//                 placeholder="Write your post content here..."
//               />
//               <div className="mt-4 p-4 bg-gray-50 rounded-lg prose prose-sm max-w-none text-gray-700">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-2">Preview:</h3>
//                 <ReactMarkdown
//                 //   className="prose prose-sm max-w-none text-gray-700"
//                   components={{
//                     h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 text-gray-900" {...props} />,
//                     h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 text-gray-900" {...props} />,
//                     h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-2 text-gray-900" {...props} />,
//                     p: ({ node, ...props }) => <p className="mb-2 text-sm" {...props} />,
//                     strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
//                     em: ({ node, ...props }) => <em className="italic" {...props} />,
//                     ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 text-sm" {...props} />,
//                     ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 text-sm" {...props} />,
//                     li: ({ node, ...props }) => <li className="mb-1" {...props} />,
//                   }}
//                 >
//                   {editedText}
//                 </ReactMarkdown>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
//               <button
//                 onClick={handleCancel}
//                 className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }



'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface PostCardProps {
  markdownText: string
  onEdit?: (newText: string) => void
  onSchedule?: (scheduleData: ScheduleData) => void
}

interface ScheduleData {
  date: string
  time: string
  platforms: string[]
}

export default function PostCard({ markdownText, onEdit, onSchedule }: PostCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [editedText, setEditedText] = useState(markdownText)
  const [currentText, setCurrentText] = useState(markdownText)
  
  // Schedule form state
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const socialMediaPlatforms = [
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'facebook', label: 'Facebook', icon: '👥' },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'youtube', label: 'YouTube Shorts', icon: '▶️' },
    { value: 'reddit', label: 'Reddit', icon: '🤖' },
    { value: 'wikipedia', label: 'Wikipedia', icon: '📚' },
  ]

  const handleEditClick = () => {
    setEditedText(currentText)
    setIsEditModalOpen(true)
  }

  const handleSave = () => {
    setCurrentText(editedText)
    if (onEdit) {
      onEdit(editedText)
    }
    setIsEditModalOpen(false)
  }

  const handleCancel = () => {
    setEditedText(currentText)
    setIsEditModalOpen(false)
  }

  const handleScheduleClick = () => {
    setIsScheduleModalOpen(true)
  }

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform)
      } else {
        return [...prev, platform]
      }
    })
  }

  const handleScheduleSubmit = () => {
    if (scheduleDate && scheduleTime && selectedPlatforms.length > 0) {
      const scheduleData: ScheduleData = {
        date: scheduleDate,
        time: scheduleTime,
        platforms: selectedPlatforms,
      }
      
      if (onSchedule) {
        onSchedule(scheduleData)
      }
      
      // Reset form
      setScheduleDate('')
      setScheduleTime('')
      setSelectedPlatforms([])
      setIsScheduleModalOpen(false)
    }
  }

  const handleScheduleCancel = () => {
    setScheduleDate('')
    setScheduleTime('')
    setSelectedPlatforms([])
    setIsScheduleModalOpen(false)
  }

  const isScheduleValid = scheduleDate && scheduleTime && selectedPlatforms.length > 0

  return (
    <>
      <div className="min-w-[400px] h-[400px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden border border-gray-200">
        {/* Header with Edit Icon */}
        <div className="flex justify-end p-3 border-b border-gray-100">
          <button
            onClick={handleEditClick}
            className="text-gray-500 hover:text-indigo-600 transition-colors"
            title="Edit post"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>

        {/* Markdown Content */}
        <div className="flex-1 p-4 overflow-y-auto prose prose-sm max-w-none text-gray-700">
          <ReactMarkdown
            // className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
            components={{
              h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 text-gray-900" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 text-gray-900" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-2 text-gray-900" {...props} />,
              p: ({ node, ...props }) => <p className="mb-2 text-sm" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
              em: ({ node, ...props }) => <em className="italic" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 text-sm" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 text-sm" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              a: ({ node, ...props }) => <a className="text-indigo-600 hover:underline" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-gray-300 pl-3 italic mb-2 text-sm" {...props} />
              ),
              code: ({ node, ...props }) => (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-xs" {...props} />
              ),
            }}
          >
            {currentText}
          </ReactMarkdown>
        </div>

        {/* Schedule Button */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleScheduleClick}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-md transition-all duration-200 font-semibold text-sm"
          >
            Schedule Post
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 mb-2">
                Post Content (Markdown Supported)
              </label>
              <textarea
                id="postContent"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-700 resize-none font-mono text-sm"
                placeholder="Write your post content here..."
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg prose prose-sm max-w-none text-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Preview:</h3>
                <ReactMarkdown
                //   className="prose prose-sm max-w-none text-gray-700"
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 text-gray-900" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 text-gray-900" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-2 text-gray-900" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-2 text-sm" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 text-sm" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 text-sm" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                  }}
                >
                  {editedText}
                </ReactMarkdown>
              </div>
            </div>

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
              <h2 className="text-2xl font-bold text-gray-900">Schedule Post</h2>
              <button
                onClick={handleScheduleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    id="scheduleDate"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border text-gray-700  border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700 mb-2">
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
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                          selectedPlatforms.includes(platform.value)
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
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
                        const platform = socialMediaPlatforms.find(p => p.value === platformValue)
                        return platform ? (
                          <span
                            key={platformValue}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm font-medium text-indigo-700"
                          >
                            <span>{platform.icon}</span>
                            <span>{platform.label}</span>
                          </span>
                        ) : null
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
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSubmit}
                disabled={!isScheduleValid}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isScheduleValid
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}