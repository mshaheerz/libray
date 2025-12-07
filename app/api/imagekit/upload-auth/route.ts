import { NextResponse } from "next/server";
import { getUploadAuthParams } from "@imagekit/next/server";
import config from "@/lib/config";

const {
  env: {
    imagekit: { publicKey, privateKey },
  },
} = config;

export async function GET() {
  try {
    const authParams = getUploadAuthParams({
      publicKey,
      privateKey,
    });

    return NextResponse.json(authParams);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to generate upload authentication";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
