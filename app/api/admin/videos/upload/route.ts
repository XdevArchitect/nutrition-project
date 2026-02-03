import { NextRequest, NextResponse } from "next/server";
import { saveUploadedFile, validateFile } from "@/lib/upload";
import { assertAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const unauthorized = await assertAdmin();
    if (unauthorized) return unauthorized;

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Save uploaded file
    const result = await saveUploadedFile(file);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Return success response with file path
    return NextResponse.json({
      success: true,
      path: result.path,
      filename: result.filename
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

// Configure max file size (this is Next.js specific)
export const config = {
  api: {
    bodyParser: false,
  },
};