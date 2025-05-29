"use client";
import { useSearchParams } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import FileUploadBtn from "@/components/FileUploadBtn";
import { useState } from "react";

interface DashboardContentInterface {
  userId: string;
}
export default function DashboardContent({
  userId,
}: DashboardContentInterface) {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const searchParams = useSearchParams();
  const currentFolder = searchParams.get("parentId") || null;
  return (
    <>
      <div className="md:grid md:grid-cols-12 md:gap-1">
        <div className="md:col-start-1 md:col-end-4 hidden sm:block ">
          <FileUpload
            userId={userId as string}
            currentFolder={currentFolder || ""}
            setRefreshTrigger={setRefreshTrigger}
          />
        </div>
        <div className="md:col-start-4 md:col-end-13 mr-1">
          <FileList
            userId={userId || ""}
            currentFolder={currentFolder}
            refreshTrigger={refreshTrigger}
            setRefreshTrigger={setRefreshTrigger}
          />
        </div>
      </div>
      <div className="block sm:hidden">
        <FileUploadBtn
          userId={userId || ""}
          currentFolder={currentFolder || ""}
          setRefreshTrigger={setRefreshTrigger}
        />
      </div>
    </>
  );
}
