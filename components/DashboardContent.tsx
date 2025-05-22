"use client";
import { useSearchParams } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";

interface DashboardContentInterface {
  userId: string;
}
export default function DashboardContent({
  userId,
}: DashboardContentInterface) {
  const searchParams = useSearchParams();
  const currentFolder = searchParams.get("parentId") || null;
  return (
    <>
      <div className="md:grid md:grid-cols-12 md:gap-1">
        <div className="md:col-start-1 lg:col-end-4 md:col-end-6">
          <FileUpload
            userId={userId as string}
            currentFolder={currentFolder || ""}
          />
        </div>
        <div className="lg:col-start-4 md:col-start-6 md:col-end-12">
          <div className="flex flex-wrap">
            <FileList userId={userId || ""} currentFolder={currentFolder} />
          </div>
        </div>
      </div>
    </>
  );
}
