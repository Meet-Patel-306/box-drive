"use client";
import { useEffect, useState } from "react";
import FileCard from "./FileCard";
import axios from "axios";

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

interface FileListInterface {
  userId: string;
  currentFolder: string | null;
}

export default function FileList({ userId, currentFolder }: FileListInterface) {
  const [fileListData, setFileListData] = useState<FileData[] | null>(null);
  useEffect(() => {
    const fetchFileList = async () => {
      try {
        let res;
        console.log(currentFolder);
        if (currentFolder) {
          res = await axios.get(
            `/api/file?userId=${userId}&parentId=${currentFolder}`
          );
        } else {
          res = await axios.get(`/api/file?userId=${userId}`);
        }

        console.log(res);
        console.log(typeof res.data);
        setFileListData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFileList();
  }, [currentFolder, userId]);

  return (
    <>
      <div className="flex flex-wrap">
        {fileListData === null ? (
          <p>Loading files...</p>
        ) : fileListData.length === 0 ? (
          <p>No files found in this folder.</p>
        ) : (
          fileListData.map((file) => (
            <FileCard key={file.id} userId={userId || ""} file={file} />
          ))
        )}
      </div>
    </>
  );
}
