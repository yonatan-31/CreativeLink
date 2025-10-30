"use client";

import React from "react";

type LoaderProps = {
  message?: string;
  /** Tailwind classes for the spinner size, e.g. 'h-24 w-24' */
  sizeClass?: string;
  /** Extra wrapper classes if needed */
  className?: string;
};

export default function Loader({
  message = "Loading...",
  sizeClass = "h-32 w-32",
  className = "",
}: LoaderProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div
          className={`animate-spin rounded-full ${sizeClass} border-b-2 border-indigo-600 mx-auto`}
          aria-hidden="true"
        />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}
