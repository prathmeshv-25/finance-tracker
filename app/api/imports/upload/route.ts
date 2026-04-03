import { NextResponse } from "next/server";
import { getAuthUser } from "@/services/authService";
import { ImportService } from "@/services/importService";

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      const { text, source, type } = await request.json();
      let transactions = [];
      
      if (type === "ocr") {
        transactions = await ImportService.parseOCRText(text, source);
      } else {
        transactions = await ImportService.parseSMS(text, source);
      }
      
      if (transactions.length === 0) {
        return NextResponse.json({ error: "No valid transactions found. Please check the format and ensure required fields are present." }, { status: 400 });
      }
      return NextResponse.json({ transactions });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const source = formData.get("source") as string || "file-import";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    
    let transactions = [];

    if (fileName.endsWith(".csv")) {
      transactions = await ImportService.parseCSV(buffer, source);
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      transactions = await ImportService.parseExcel(buffer, source);
    } else if (fileName.endsWith(".pdf")) {
      transactions = await ImportService.parsePDF(buffer, source);
    } else {
      return NextResponse.json({ error: "Unsupported file format" }, { status: 400 });
    }

    if (transactions.length === 0) {
      return NextResponse.json({ error: "No valid transactions found. Please check the format and ensure required fields are present." }, { status: 400 });
    }

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("[POST /api/imports/upload]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
