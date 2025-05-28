"use client";
import { useSearchParams } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import Navbar from "./Navbar";

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
      <Navbar />
      <div className="md:grid md:grid-cols-12 md:gap-1">
        <div className="md:col-start-1 md:col-end-4 ">
          <FileUpload
            userId={userId as string}
            currentFolder={currentFolder || ""}
          />
        </div>
        <div className="md:col-start-4 md:col-end-13 mr-1">
          <FileList userId={userId || ""} currentFolder={currentFolder} />
        </div>
      </div>
    </>
  );
}
