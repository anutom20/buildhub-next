import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { signOut } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    await signOut();
    return NextResponse.redirect(new URL("/", req.url));
  } catch (err) {
    return NextResponse.json(
      { message: `Error while logging out ${err}` },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
