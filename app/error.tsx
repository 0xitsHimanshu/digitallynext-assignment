"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-lg">
        {/* Error icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Something went wrong!
        </h2>

        {/* Error message */}
        <p className="mt-2 text-gray-600">
          An unexpected error has occurred. Don&apos;t worry, you can try again
          or go back to the home page.
        </p>

        {/* Error details (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-4 text-left">
            <p className="text-sm font-medium text-red-800">Error details:</p>
            <p className="mt-1 text-sm text-red-700 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-1 text-xs text-red-500">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={reset} className="gap-2">
            <RotateCcw size={16} />
            Try Again
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/dashboard">
              <Home size={16} />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
