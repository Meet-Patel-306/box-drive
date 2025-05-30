"use client";
import RenameForm from "@/components/RenameForm";
import { Card } from "@/components/ui/card";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { downloadFolder } from "@/lib/utils/downloadFolder";
import { downloadFile } from "@/lib/utils/downloadFile";
import { toast } from "react-hot-toast";
interface FileData {
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

interface FileCardListProps {
  file: FileData;
  userId: string;
  setRefreshTrigger: (prev: any) => any;
}
export default function FileCardList({
  file,
  userId,
  setRefreshTrigger,
}: FileCardListProps) {
  const [renameFormOpen, setRenameFormOpen] = useState<boolean>(false);
  const router = useRouter();
  const makeStarred = async () => {
    const id = file.id;
    const fileIsStar = file.isStarred;
    toast
      .promise(axios.put(`/api/file/${id}/starred`), {
        loading: `${fileIsStar ? "Removing Star..." : "Starring file..."}`,
        success: `${
          fileIsStar ? "File starred remove!" : "File starred successfully!"
        }`,
        error: "Failed to processing file.",
      })
      .then((res) => {
        console.log(res);
        router.push("/");
        setRefreshTrigger((prev: number) => prev + 1);
      });
  };
  const makeTrash = async () => {
    const id = file.id;
    const flieInTrash = file.isTrash;
    toast
      .promise(axios.put(`/api/file/${id}/trash`), {
        loading: `${
          flieInTrash ? "Restoring file..." : " Moving file to trash..."
        }`,
        success: `${
          flieInTrash
            ? "Restoring file successfully!"
            : " Moving file to trash successfully!"
        }`,
        error: `${
          flieInTrash ? "Failed to restore file." : "Failed to trash file."
        }`,
      })
      .then((res) => {
        console.log(res);
        setRefreshTrigger((prev: number) => prev + 1);
        router.push("/");
      });
  };

  const handelDownload = async () => {
    try {
      toast.loading("Preparing download...");
      if (file.isFolder) {
        const res = await axios.get(
          `/api/folder/download?folderId=${file.id}&userId=${file.userId}`
        );
        console.log(res.data);
        await downloadFolder(res.data);
      } else {
        await downloadFile(file.fileUrl, file.name);
      }
      toast.success("Download started.");
    } catch (err) {
      console.log(err);
      toast.error("Download failed.");
    } finally {
      toast.dismiss(); // closes the loading toast
    }
  };

  const handelDelete = async () => {
    toast
      .promise(axios.delete(`/api/file/${file.id}/delete`), {
        loading: "Deleting file...",
        success: "File deleted!",
        error: "Failed to delete file.",
      })
      .then((res) => {
        console.log(res);
        setRefreshTrigger((prev: number) => prev + 1);
      });
  };
  const onClickFolderOpen = () => {
    if (file.isFolder) {
      router.push(`/?userId=${userId}&parentId=${file.id}`);
    }
  };
  return (
    <div className="">
      {/* File Rows */}
      <Card
        className="rounded-none border-y-2 md:block hidden"
        onClick={onClickFolderOpen}
      >
        <div className="grid grid-cols-4 w-full items-center px-4 font-medium border-x-0 rounded-none">
          <div className="aspect-square w-1/4">
            {file.thumbnailUrl ? (
              <img
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/800px-WhatsApp.svg.png"
                }
                className="w-12 h-12"
                loading="lazy"
              />
            ) : (
              <FileIcon className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <div className="w-1/4">
            <h1>{file?.type}</h1>
          </div>
          <div className="w-1/4">
            <h1 className="text-[14px]">
              {(file?.size / (1024 * 1024)).toFixed(2)} MB
            </h1>
          </div>
          <div className="w-full flex items-center justify-between">
            <h1 className="text-[14px]">{file?.name}</h1>
            <Popover>
              <PopoverTrigger asChild>
                {/* This div intercepts the click to prevent triggering the card's onClick */}
                <div
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                  }}
                >
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    file.isTrash ? "hidden" : ""
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    onClickFolderOpen();
                  }}
                >
                  Open
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    file.isTrash ? "hidden" : ""
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    makeStarred();
                  }}
                >
                  Starrted
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    file.isTrash ? "hidden" : ""
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setRenameFormOpen(true);
                  }}
                >
                  Rename
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    file.isTrash ? "hidden" : ""
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handelDownload();
                  }}
                >
                  Download
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    file.isTrash ? "" : "hidden"
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    makeTrash();
                  }}
                >
                  Restore
                </Button>

                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    file.isTrash ? "hidden" : "text-red-600"
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    makeTrash();
                  }}
                >
                  Trash
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-red-600 ${
                    file.isTrash ? "" : "hidden"
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handelDelete();
                  }}
                >
                  Delete
                </Button>
              </PopoverContent>
            </Popover>
            {file.isStarred && (
              <span className="flex justify-end mr-2 text-amber-300">
                <Star className="fill-amber-300" />
              </span>
            )}
          </div>
        </div>
      </Card>
      <Card className="flex rounded-none px-4 py-3 hover:bg-gray-200 sm:hidden">
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-3" onClick={onClickFolderOpen}>
            {file.thumbnailUrl ? (
              <img
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/800px-WhatsApp.svg.png"
                }
                className="w-12 h-12"
                loading="lazy"
              />
            ) : (
              <FileIcon className="w-10 h-10 text-muted-foreground" />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900 text-[12px]">
                {file?.name}
              </div>
              <div className="text-xs text-gray-500">
                {(file?.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <Popover>
              <PopoverTrigger asChild>
                {/* This div intercepts the click to prevent triggering the card's onClick */}
                <div
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                  }}
                >
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    file.isTrash ? "hidden" : ""
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    onClickFolderOpen();
                  }}
                >
                  Open
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    file.isTrash ? "hidden" : ""
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    makeStarred();
                  }}
                >
                  Starrted
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    file.isTrash ? "hidden" : ""
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setRenameFormOpen(true);
                  }}
                >
                  Rename
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    file.isTrash ? "hidden" : ""
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handelDownload();
                  }}
                >
                  Download
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    file.isTrash ? "" : "hidden"
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    makeTrash();
                  }}
                >
                  Restore
                </Button>

                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    file.isTrash ? "hidden" : "text-red-600"
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    makeTrash();
                  }}
                >
                  Trash
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-red-600 ${
                    file.isTrash ? "" : "hidden"
                  }`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handelDelete();
                  }}
                >
                  Delete
                </Button>
              </PopoverContent>
            </Popover>
            {file.isStarred && (
              <span className="flex justify-end mr-2 text-amber-300">
                <Star className="fill-amber-300" />
              </span>
            )}
          </div>
        </div>
      </Card>
      {renameFormOpen && (
        <div className="fixed inset-0 z-50 flex w-full h-full items-center justify-center bg-black/50">
          <RenameForm
            fileId={file.id || ""}
            closeClick={renameFormOpen}
            onCloseClick={setRenameFormOpen}
          />
        </div>
      )}
    </div>
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
