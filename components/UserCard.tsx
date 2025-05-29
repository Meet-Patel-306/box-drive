import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UserCardProps {
  email: string;
  avatarUrl?: string;
}

export default function UserCard({ email, avatarUrl }: UserCardProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="ml-1">
          <AvatarFallback>{email.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="bg-transparent border-none shadow-none">
        <Card className="mx-auto rounded-2xl ">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarFallback>{email.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </CardHeader>
          <Button className="mx-2">Sign Out </Button>
        </Card>
      </PopoverContent>{" "}
    </Popover>
  );
}
