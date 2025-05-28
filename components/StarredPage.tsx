"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { FileData } from "./FileList"; // file data interface
import { useEffect, useState } from "react";
import { List, X } from "lucide-react";
import { LayoutPanelTop } from "lucide-react";
import { Loader2 } from "lucide-react";
import { FolderX } from "lucide-react";
import FileCard from "./FileCard";
import FileCardList from "@/components/FileCardList";
import FileUploadBtn from "./FileUploadBtn";

interface StarredPageInterface {
  userId: string;
}

export default function StarredPage({ userId }: StarredPageInterface) {
  const [fileListData, setFileListData] = useState<FileData[] | null>(null);
  const [isListLayout, setIsListLayout] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const currentFolder = searchParams.get("parentId") || null;
  useEffect(() => {
    const starredFiles = async () => {
      try {
        const res = await axios.get("api/file/starred-file");
        setFileListData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    starredFiles();
  }, []);
  return (
    <>
      <div className="w-full flex mt-1 justify-end">
        <div
          className={`flex py-3 w-24 justify-center h-5 items-center border-2 border-gray-900 dark:border-gray-200 rounded-2xl`}
        >
          <div
            className={`border-r-2 pr-2 border-gray-900 dark:border-gray-200 mr-2 ${
              isListLayout ? "text-blue-600 font-extrabold" : ""
            }`}
            onClick={() => setIsListLayout(true)}
          >
            <List />
          </div>
          <div
            className={`border-none ${
              !isListLayout ? "text-blue-600 font-extrabold" : ""
            }`}
            onClick={() => setIsListLayout(false)}
          >
            <LayoutPanelTop />
          </div>
        </div>
      </div>
      <div
        className={`${
          !isListLayout
            ? "hidden"
            : "grid grid-cols-4 w-full items-center px-4 font-medium border-x-0 rounded-none"
        }`}
      >
        <div className="w-1/4"></div>
        <div className="w-1/4">Type</div>
        <div className="w-1/4">Size</div>
        <div className="w-1/4">Name</div>
      </div>
      {fileListData === null ? (
        <div className="flex flex-col items-center justify-center h-full w-full gap-3 rounded-xl bg-muted shadow-inner">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : fileListData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full w-full gap-3 rounded-xl bg-muted shadow-inner">
          <FolderX className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">
            No files found in this folder.
          </p>
        </div>
      ) : (
        <div
          className={`${
            !isListLayout
              ? "flex flex-wrap justify-center sm:justify-start"
              : "block"
          }`}
        >
          {fileListData.map((file) => (
            <div key={file.id}>
              <div className={`${!isListLayout ? " block" : "hidden"}`}>
                <FileCard
                  key={file.id + "block"}
                  userId={userId || ""}
                  file={file}
                />
              </div>
              <div className={`${isListLayout ? "block" : "hidden "}`}>
                <FileCardList key={file.id} userId={userId || ""} file={file} />
              </div>
            </div>
          ))}
        </div>
      )}
      <FileUploadBtn
        userId={userId || ""}
        currentFolder={currentFolder || ""}
      />
    </>
  );
}
