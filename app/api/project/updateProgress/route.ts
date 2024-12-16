import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PATCH(request: Request) {
  const { chatName, projectId } = await request.json();

  if (!chatName || !projectId) {
    return NextResponse.json(
      { error: "chatName and projectId are required" },
      { status: 400 }
    );
  }

  try {
    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: { current_phase: chatName },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
