"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import axios from "axios";

type Props = {
  onCloseClick: (value: boolean) => void;
  closeClick: boolean;
  fileId: string;
};

export default function RenameFileForm({
  onCloseClick,
  closeClick,
  fileId,
}: Props) {
  // create folder on submit
  const renameFileFormSchema = z.object({
    name: z.string().min(2).max(50),
  });
  const form = useForm<z.infer<typeof renameFileFormSchema>>({
    resolver: zodResolver(renameFileFormSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmitRenameFile = (data: z.infer<typeof renameFileFormSchema>) => {
    try {
      const res = axios.put(`/api/file/${fileId}/rename`, { name: data.name });
      // toast.success("Folder Create");
      //console.log(res);
      onCloseClick(false);
    } catch (err) {
      //console.log(err);
    }
  };
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="lg:w-1/5 md:w-1/3 w-10/12 border-2 border-gray-200 p-4 rounded-lg bg-white">
        <div className="flex justify-end pr-2">
          <X onClick={() => onCloseClick(!closeClick)} />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitRenameFile)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File New Name</FormLabel>
                  <FormControl>
                    <Input placeholder="untitle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
