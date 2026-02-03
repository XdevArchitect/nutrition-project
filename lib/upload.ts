import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

// Define upload directory
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "videos");

// Supported video formats
const SUPPORTED_FORMATS = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/avi",
  "video/mov",
  "video/mkv"
];

// Maximum file size (1GB)
const MAX_FILE_SIZE = 1024 * 1024 * 1024;

/**
 * Ensure upload directory exists
 */
export async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    // Directory doesn't exist, create it
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Validate uploaded file
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File size exceeds maximum limit of 1GB"
    };
  }

  // Check file type
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: "Unsupported file format. Please upload MP4, WebM, OGG, AVI, MOV, or MKV files."
    };
  }

  return { valid: true };
}

/**
 * Save uploaded file to disk
 */
export async function saveUploadedFile(file: File): Promise<{ 
  path: string; 
  filename: string; 
  error?: string 
}> {
  try {
    // Ensure upload directory exists
    await ensureUploadDir();

    // Generate unique filename
    const extension = file.name.split(".").pop();
    const filename = `${nanoid(16)}.${extension}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save file to disk
    await fs.writeFile(filePath, buffer);

    // Return relative path for web access
    const relativePath = `/uploads/videos/${filename}`;
    
    return { path: relativePath, filename };
  } catch (error) {
    console.error("Error saving uploaded file:", error);
    return {
      path: "",
      filename: "",
      error: "Failed to save uploaded file"
    };
  }
}