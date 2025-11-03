"use client";

import { useState, ChangeEvent } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Trash2,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import useEscapeToggle from "@/hooks/useEscapeToggle";
import { API_BASE } from "@/services/apiCalls";

interface ImageUploaderProps {
  postID: string;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function ImageUploader({
  postID,
  files,
  setFiles,
}: ImageUploaderProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [minimiseUploader, setMinimiseUploader] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(
    null
  );
  const [uploadedPostId, setUploadedPostId] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  useEscapeToggle(() => setSelectedImage(null));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles([...files, ...selected]);
    setUploadStatus(null);
    setUploadedPostId(null);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setSelectedImage(null);
  };

  const clearAll = () => {
    setFiles([]);
    setUploadStatus(null);
    setUploadedPostId(null);
    setUploadedImages([]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    console.log(files);

    setLoading(true);
    setUploadStatus(null);
    setUploadedPostId(null);

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const response = await fetch(`${API_BASE}/media/upload/${postID}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.post_id) {
        setUploadStatus("success");
        setUploadedPostId(data.post_id);
        setUploadedImages([...uploadedImages, URL.createObjectURL(files[0])]);
        console.log("Upload successful:", data);

        setTimeout(() => {
          setFiles([]);
          setUploadStatus(null);
          setUploadedPostId(null);
        }, 3000);
      } else {
        setUploadStatus("error");
        console.error("Upload failed:", data.detail);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-2">
      <div className="rounded-2xl p-2 w-full max-w-3xl bg-gray-50">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
          id="img"
        />

        <label htmlFor="img" className="block cursor-pointer">
          <div className="rounded-lg text-center hover:border-indigo-500 transition-all">
            <div className="flex gap-2 w-full">
              <Upload className="size-4 text-gray-400 mb-3" />
              <p className="text-gray-900 font-semibold text-sm">
                Click to upload images
              </p>
            </div>
          </div>
        </label>

        <p
          onClick={() => setMinimiseUploader((prev) => !prev)}
          className="text-sm text-gray-500 flex items-center cursor-pointer"
        >
          {!minimiseUploader ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
          {files?.length > 0
            ? `${files?.length} file${files?.length > 1 ? "s" : ""} selected`
            : uploadedImages.length > 0
            ? `${uploadedImages.length} image${
                uploadedImages.length > 1 ? "s" : ""
              } uploaded`
            : "Select image"}
        </p>

        {uploadStatus && (
          <div
            className={`mt-3 p-3 rounded-lg flex flex-col gap-1 ${
              uploadStatus === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {uploadStatus === "success" ? (
              <>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Upload successful!</span>
                </div>
                {uploadedPostId && (
                  <span className="text-sm text-green-600 ml-7">
                    Post ID: {uploadedPostId}
                  </span>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">
                  Upload failed. Please try again.
                </span>
              </div>
            )}
          </div>
        )}

        {uploadedImages.length > 0 && !minimiseUploader && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Uploaded Images
            </p>
            <div className="grid grid-cols-3 gap-4">
              {uploadedImages.map((imgUrl, i) => (
                <div
                  key={`uploaded-${i}`}
                  className="relative group rounded-lg overflow-hidden w-full"
                >
                  <Image
                    src={imgUrl}
                    alt={`Uploaded ${i + 1}`}
                    width={200}
                    height={128}
                    className="w-full h-32 object-cover"
                    unoptimized
                  />
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1.5">
                    <CheckCircle2
                      className="w-4 h-4 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white text-xs font-medium">Uploaded</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {files?.length > 0 && !minimiseUploader && (
          <>
            {uploadedImages.length > 0 && (
              <p className="text-sm font-semibold text-gray-700 mb-3 mt-6">
                Pending Upload
              </p>
            )}
            <div className="grid grid-cols-3 gap-4 mt-3">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="relative group rounded-lg overflow-hidden cursor-pointer w-full"
                  onClick={() => setSelectedImage(i)}
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={200}
                    height={128}
                    className="w-full h-32 object-cover"
                    unoptimized
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                  >
                    <X className="w-4 h-4 text-gray-700" strokeWidth={2} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 w-full bg-linear-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs font-medium ">
                      {file.name.slice(0,5)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpload}
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg"
                }`}
              >
                {loading
                  ? "Uploading..."
                  : `Upload ${files?.length} Image${
                      files?.length > 1 ? "s" : ""
                    }`}
              </button>
              <button
                onClick={clearAll}
                disabled={loading}
                className="py-3 px-6 rounded-lg font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All
              </button>
            </div>
          </>
        )}
      </div>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={URL.createObjectURL(files[selectedImage])}
              alt={files[selectedImage].name}
              width={1200}
              height={800}
              className="max-h-[80vh] w-auto object-contain"
              unoptimized
            />

            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => removeFile(selectedImage)}
                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="bg-white text-gray-700 rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white font-medium">
                {files[selectedImage].name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
