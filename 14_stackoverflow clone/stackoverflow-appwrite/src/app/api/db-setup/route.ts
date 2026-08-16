import { NextResponse } from "next/server";
import getOrCreateDB from "@/models/server/dbSetup";
import getOrCreateStorage from "@/models/server/storageSetup";

export async function GET() {
  try {
    await getOrCreateDB();
    await getOrCreateStorage();
    return NextResponse.json({
      success: true,
      message: "Database, collections, and storage setup completed successfully!",
    });
  } catch (error: any) {
    console.error("Database setup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to initialize Appwrite database/storage",
      },
      { status: 500 }
    );
  }
}
