"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schema/signInSchema";
import { useSignIn } from "@clerk/nextjs";
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
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SignInForm() {
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const { signIn, isLoaded, setActive } = useSignIn();
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitSignIn: SubmitHandler<z.infer<typeof signInSchema>> = async (
    data
  ) => {
    if (!isLoaded) return;
    setSignInError(null);
    setIsSubmitting(true);
    try {
      const res = await signIn?.create({
        identifier: data.identifier,
        password: data.password,
      });
      if (res.status === "complete") {
        await setActive({ session: res?.createdSessionId });
        console.log("ok", res);
      } else {
        console.log("faile");
      }
    } catch (err: any) {
      setSignInError(err.errors?.[0].message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      {isSubmitting ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loader className="mr-2 h-10 w-10 animate-spin" />
        </div>
      ) : (
        <div className="w-full flex justify-center ">
          <div className="w-2/3 space-y-6 border-2 border-gray-100 py-4 px-2 rounded-3xl">
            <h1 className="text-2xl font-bold text-center">
              SignUp Your Account
            </h1>
            {signInError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{signInError}</AlertDescription>
              </Alert>
            )}
            <Form {...signInForm}>
              <form
                onSubmit={signInForm.handleSubmit(onSubmitSignIn)}
                className="space-y-6"
              >
                <FormField
                  control={signInForm.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="xyz@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                          {/* {isView ? (
                            <Eye
                              className="absolute right-4 top-4 z-10 cursor-pointer text-gray-500"
                              onClick={() => {
                                setIsView(!isView), console.log(isView);
                              }}
                            />
                          ) : (
                            <EyeOff
                              className="absolute right-4 top-4 z-10 cursor-pointer text-gray-500"
                              onClick={() => setIsView(!isView)}
                            />
                          )} */}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}
