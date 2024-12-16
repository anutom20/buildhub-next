import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Main from "@/components/Main";

const Dashboard = async () => {
  const session = await auth();
  if (!session) return notFound();

  return <Main user={session?.user!} />;
};

export default Dashboard;
