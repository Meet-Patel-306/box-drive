"use client";
import RenameForm from "@/components/RenameForm";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { Star } from "lucide-react";
import axios from "axios";
import { useState } from "react";
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

interface FileCardProps {
  file: FileData;
  userId: string;
  setRefreshTrigger: (prev: any) => any;
}
export default function FileCard({
  file,
  userId,
  setRefreshTrigger,
}: FileCardProps) {
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
        //console.log(res);
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
        //console.log(res);
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
        //console.log(res.data);
        await downloadFolder(res.data);
      } else {
        await downloadFile(file.fileUrl, file.name);
      }
      toast.success("Download started.");
    } catch (err) {
      //console.log(err);
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
        //console.log(res);
        setRefreshTrigger((prev: number) => prev + 1);
      });
  };
  const onClickFolderOpen = () => {
    if (file.isFolder) {
      router.push(`/?userId=${userId}&parentId=${file.id}`);
    }
  };
  return (
    <>
      <Card
        className="w-[320px] h-[180px] p-6 grid gap-6 m-2"
        onClick={onClickFolderOpen}
      >
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-12">
            {file.thumbnailUrl ? (
              <img src={file.thumbnailUrl} className="w-6 h-6" loading="lazy" />
            ) : (
              <FileIcon className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <div className="grid gap-1">
            <div className="font-semibold">{file?.name}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileTypeIcon className="w-4 h-4" />
              <span>{file?.type.split("/").pop()}</span>
              <Separator orientation="vertical" className="h-4" />
              <FileIcon className="w-4 h-4" />
              <span>{(file?.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
          </div>
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
        </div>
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              handelDownload();
            }}
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Download</span>
          </Button>
          {file.isStarred && (
            <span className="flex justify-end mr-2 text-amber-300">
              <Star className="fill-amber-300" />
            </span>
          )}
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
    </>
  );
}

function DownloadIcon(props: any) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
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

function FileTypeIcon(props: any) {
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
      <path d="M9 13v-1h6v1" />
      <path d="M12 12v6" />
      <path d="M11 18h2" />
    </svg>
  );
}
