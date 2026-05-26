import { Suspense } from "react";
import { Metadata } from "next";
import { ResumesContent } from "./resumes-content";
import ResumesLoading from "./loading";

export const metadata: Metadata = {
  title: "Resumes | JobOS",
  description: "Upload and manage your master resumes.",
};

export const dynamic = "force-dynamic";

export default function ResumesPage() {
  return (
    <Suspense fallback={<ResumesLoading />}>
      <ResumesContent />
    </Suspense>
  );
}
