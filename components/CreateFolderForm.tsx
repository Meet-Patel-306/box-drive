"use client";

import { Card, CardContent, CardFooter } from "./ui/card";
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

type Props = {
  onCloseClick: () => void;
};

export default function CreateFolderForm({ onCloseClick }: Props) {
  const createFolderFormSchema = z.object({
    name: z.string().min(2).max(50),
  });
  const form = useForm<z.infer<typeof createFolderFormSchema>>({
    resolver: zodResolver(createFolderFormSchema),
    defaultValues: {
      name: "",
    },
  });
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="w-1/5 border-2 border-gray-200 p-4 rounded-lg bg-white">
        <div className="flex justify-end pr-2">
          <X />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => console.log(data))}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
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
