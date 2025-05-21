import { auth } from "@clerk/nextjs/server";
import SignInForm from "@/components/SignInForm";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <>
      <h1>hello</h1>
      <h2>Meet</h2>
    </>
  );
}
