import { auth } from "@clerk/nextjs/server";
import TrashPage from "@/components/TrashPage";
import { redirect } from "next/navigation";

export default async function Starrted() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <>
      <TrashPage userId={userId || ""} />
    </>
  );
}
