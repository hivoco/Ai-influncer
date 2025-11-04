import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface LoadingOverlayProps {
  isOpen: boolean;
  children?: ReactNode;
  title?: string;
  message?: string;
  showProgress?: boolean;
  showSpinner?: boolean;
  spinnerSize?: "sm" | "md" | "lg";
  spinnerColor?: string;
  maxWidth?: string;
  className?: string;
}

const spinnerSizes = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export default function LoadingOverlay({
  isOpen,
  children,
  title,
  message,
  showProgress = false,
  showSpinner = true,
  spinnerSize = "md",
  spinnerColor = "text-indigo-600",
  maxWidth = "max-w-sm",
  className = "",
}: LoadingOverlayProps) {
  if (!isOpen) return null;

  // If custom children provided, render them
  if (children) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          className={`bg-white rounded-2xl shadow-2xl p-8 ${maxWidth} w-full mx-4 ${className}`}
        >
          {children}
        </div>
      </div>
    );
  }

  // Default loading UI
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-2xl shadow-2xl p-8 ${maxWidth} w-full mx-4 ${className}`}
      >
        <div className="flex flex-col items-center">
          {showSpinner && (
            <Loader2
              className={`${spinnerSizes[spinnerSize]} ${spinnerColor} animate-spin mb-4`}
            />
          )}
          {title && (
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {title}
            </h3>
          )}
          {message && <p className="text-gray-600 text-center">{message}</p>}
          {showProgress && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
