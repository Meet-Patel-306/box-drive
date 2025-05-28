"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";

interface FileUploadBtnInterface {
  userId: string;
  currentFolder: string;
}
export default function FileUploadBtn({
  userId,
  currentFolder,
}: FileUploadBtnInterface) {
  const [showUploadForm, setShowUploadForm] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Floating + Button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 flex items-center justify-center shadow-xl"
        onClick={() => setShowUploadForm(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* File Upload Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 w-full max-w-md">
            <FileUpload userId={userId || ""} currentFolder={currentFolder} />
            <div className="flex justify-end mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowUploadForm(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
