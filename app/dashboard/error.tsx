"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Dashboard-specific error boundary.
 * This catches errors within the /dashboard route segment.
 * Because it's nested inside dashboard/layout.tsx, the dashboard
 * header/nav remains visible while only the page content shows the error.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        {/* Error icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        {/* Heading */}
        <h2 className="mt-5 text-xl font-bold text-gray-900">
          Dashboard Error
        </h2>

        {/* Description */}
        <p className="mt-2 text-gray-600 text-sm">
          Something went wrong while loading the dashboard. Your tasks are safe
          &mdash; try refreshing or go back.
        </p>

        {/* Error details (development only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3 text-left">
            <p className="text-xs font-medium text-red-800">Error details:</p>
            <p className="mt-1 text-xs text-red-700 font-mono break-all">
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
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={reset} size="sm" className="gap-2">
            <RotateCcw size={14} />
            Try Again
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft size={14} />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
