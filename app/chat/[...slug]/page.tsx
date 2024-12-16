// pages/index.js
import { auth } from "@/auth";
import Chat from "@/components/chat/[curProjectId]/Chat";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: { slug: string[] } }) {
  const session = await auth();
  if (!session) return notFound();

  return <Chat params={params} image={session?.user?.image!} />;
}
