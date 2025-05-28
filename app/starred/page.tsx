import { auth } from "@clerk/nextjs/server";
import StarrtedPage from "@/components/StarredPage";
import { redirect } from "next/navigation";

export default async function Starrted() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <>
      <StarrtedPage userId={userId || ""} />
    </>
  );
}
