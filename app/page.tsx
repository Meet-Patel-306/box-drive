import DashboardContent from "@/components/DashboardContent";

import { auth, currentUser } from "@clerk/nextjs/server";
export default async function Home() {
  const { userId } = await auth();
  return <DashboardContent userId={userId || ""} />;
}
