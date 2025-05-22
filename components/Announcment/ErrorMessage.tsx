import React from "react";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({
  message = "Error Occurred...",
}: ErrorMessageProps) {
  return (
    <div className="w-full text-center p-4 text-red-600 bg-red-100 rounded-md">
      {message}
    </div>
  );
}
