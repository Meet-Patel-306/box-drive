"use client";

import CreateFolderForm from "./CreateFolderForm";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Plus } from "lucide-react";

interface FileUploadInterface {
  userId: string;
  currentFolder: string;
  setRefreshTrigger: (prev: any) => any;
}

export default function FileUpload({
  userId,
  currentFolder,
  setRefreshTrigger,
}: FileUploadInterface) {
  const [createFolderOpen, setCreateFolderOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if (currentFolder) {
      formData.append("parentId", currentFolder);
    }

    toast
      .promise(
        axios.post("/api/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          loading: "Uploading file...",
          success: "File saved successfully!",
          error: "File upload failed",
        }
      )
      .then((res) => {
        setRefreshTrigger((prev: number) => prev + 1);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      });
  };

  // upload file on submit
  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const files = fileInputRef.current?.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      uploadFile(file);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <Card className="mt-1 mx-2">
        <CardContent className="p-6 space-y-4">
          {/* folder create */}
          <div
            className="mx-1 rounded-lg border-2 border-dashed border-gray-200 flex items-center p-2"
            onClick={() => setCreateFolderOpen((prev) => !prev)}
          >
            <Plus className="w-8 h-8 mr-4" />
            Create folder
          </div>
          {/* file upload */}
          <div
            className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center"
            onClick={handleDivClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <FileIcon className="w-12 h-12" />
            <span className="text-sm font-medium text-gray-500">
              Drag and drop a file or click to browse
            </span>
            <span className="text-xs text-gray-500">PDF or image</span>
          </div>
          <div className="space-y-2 text-sm">
            <Label htmlFor="file" className="text-sm font-medium">
              File
            </Label>
            <Input
              ref={fileInputRef}
              id="file"
              type="file"
              placeholder="File"
              accept="image/*,application/pdf,"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" onClick={onSubmit}>
            Upload
          </Button>
        </CardFooter>
      </Card>
      {/* folder create form */}
      {createFolderOpen && (
        <div className="fixed inset-0 z-50 flex w-full h-full items-center justify-center bg-black/50">
          <CreateFolderForm
            onCloseClick={setCreateFolderOpen}
            closeClick={createFolderOpen}
            userId={userId || ""}
            currentFolder={currentFolder || ""}
            setRefreshTrigger={setRefreshTrigger}
          />
        </div>
      )}
    </>
  );
}

function FileIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
