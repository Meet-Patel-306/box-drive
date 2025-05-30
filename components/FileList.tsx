"use client";
import { useEffect, useState } from "react";
import FileCard from "./FileCard";
import FileCardList from "@/components/FileCardList";
import axios from "axios";
import { List, X } from "lucide-react";
import { LayoutPanelTop } from "lucide-react";
import { Loader2 } from "lucide-react";
import { FolderX } from "lucide-react";

export interface FileData {
  id: string;
  name: string;
  size: number;
  path: string;
  type: string;
  fileUrl: string;
  thumbnailUrl: string;
  userId: string;
  parentId: string | null;
  isStarred: boolean;
  isTrash: boolean;
  isFolder: boolean;
  createAt: string;
  updateAt: string;
}

export interface FileListInterface {
  userId: string;
  currentFolder: string | null;
  refreshTrigger: number;
  setRefreshTrigger: (prev: any) => any;
}

export default function FileList({
  userId,
  currentFolder,
  refreshTrigger,
  setRefreshTrigger,
}: FileListInterface) {
  const [fileListData, setFileListData] = useState<FileData[] | null>(null);
  const [isListLayout, setIsListLayout] = useState<boolean>(false);
  useEffect(() => {
    const fetchFileList = async () => {
      try {
        let res;
        //console.log(currentFolder);
        if (currentFolder) {
          res = await axios.get(
            `/api/file?userId=${userId}&parentId=${currentFolder}`
          );
        } else {
          res = await axios.get(`/api/file?userId=${userId}`);
        }

        //console.log(res);
        //console.log(typeof res.data);
        setFileListData(res.data);
      } catch (err) {
        //console.log(err);
      }
    };
    fetchFileList();
  }, [currentFolder, userId, refreshTrigger]);

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
            : "sm:grid sm:grid-cols-4 w-full items-center px-4 font-medium border-x-0 rounded-none hidden"
        }`}
      >
        <div className="w-1/4"></div>
        <div className="w-1/4">Type</div>
        <div className="w-1/4">Size</div>
        <div className="w-1/4">Name</div>
      </div>
      {fileListData === null ? (
        <div className="flex flex-col items-center justify-center h-full w-full gap-3 rounded-xl">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : fileListData.length === 0 ? (
        <div className="mt-5 flex flex-col items-center justify-center h-full w-full gap-3 rounded-xl r">
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
          } mt-1`}
        >
          {fileListData.map((file) => (
            <div key={file.id}>
              {!file.isTrash && (
                <>
                  <div className={`${!isListLayout ? " block" : "hidden"}`}>
                    <FileCard
                      key={file.id + "block"}
                      userId={userId || ""}
                      file={file}
                      setRefreshTrigger={setRefreshTrigger}
                    />
                  </div>
                  <div className={`${isListLayout ? "block" : "hidden "}`}>
                    <FileCardList
                      key={file.id}
                      userId={userId || ""}
                      file={file}
                      setRefreshTrigger={setRefreshTrigger}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
