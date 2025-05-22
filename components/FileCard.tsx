import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
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
}
export default function FileCard({ file, userId }: FileCardProps) {
  const router = useRouter();

  const onClickFolderOpen = () => {
    if (file.isFolder) {
      router.push(`/?userId=${userId}&parentId=${file.id}`);
    }
  };
  return (
    <Card className="w-[300px] p-6 grid gap-6 m-2" onClick={onClickFolderOpen}>
      <div className="flex items-center gap-4">
        <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-12">
          <FileIcon className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="grid gap-1">
          <div className="font-semibold">{file?.name}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileTypeIcon className="w-4 h-4" />
            <span>{file?.type}</span>
            <Separator orientation="vertical" className="h-4" />
            <FileIcon className="w-4 h-4" />
            <span>{(file?.size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
        </div>
      </div>
      <div>
        <Button variant="ghost" size="sm">
          <DownloadIcon className="w-4 h-4" />
          <span>Download</span>
        </Button>
      </div>
    </Card>
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
