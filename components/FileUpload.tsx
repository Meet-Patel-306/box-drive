"use client";

import CreateFolderForm from "./CreateFolderForm";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface FileUploadInterface {
  userId: string;
  currentFolder: string;
}

export default function FileUpload({
  userId,
  currentFolder,
}: FileUploadInterface) {
  const searchParams = useSearchParams();
  const [createFolderOpen, setCreateFolderOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleDivClick = () => {
    fileInputRef.current?.click();
  };
  // upload file on submit
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const file = fileInputRef.current?.files || null;
    if (file && file.length > 0) {
      console.log(file[0]);
      try {
        const formData = new FormData();
        formData.append("file", file[0]);
        formData.append("userId", userId);
        if (currentFolder) {
          formData.append("parentId", currentFolder);
        }
        const res = await axios.post("/api/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res);
        toast.success("File Save");
      } catch (err: any) {
        toast(err);
      }
    } else {
      toast.error("No file selected.");
    }
  };
  return (
    <>
      <Card className=" mx-2">
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
