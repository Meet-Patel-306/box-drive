import DashboardContent from "@/components/DashboardContent";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
export default async function Home() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  console.log(userId);
  return <DashboardContent userId={userId || ""} />;
}
