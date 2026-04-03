import { prisma } from "./db";
import Papa from "papaparse";
import ExcelJS from "exceljs";
const pdf = require("pdf-parse");

import { AIService } from "./aiService";

export interface NormalizedTransaction {
  date: Date;
  amount: number;
  type: "income" | "expense";
  description: string;
  source: string;
  externalId?: string;
  category?: string;
}

export class ImportService {
  static async parseCSV(buffer: Buffer, source: string): Promise<NormalizedTransaction[]> {
    const text = buffer.toString("utf-8");
    const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });

    if (parsed.errors.length > 0 && parsed.data.length === 0) {
      throw new Error(`CSV parse error: ${parsed.errors[0].message}`);
    }

    const results: NormalizedTransaction[] = [];
    for (const data of parsed.data) {
      const dateStr = data.Date || data.date || data["Transaction Date"];
      const amount = parseFloat(data.Amount || data.amount || data["Transaction Amount"]);
      const description = data.Description || data.description || data["Narration"];

      if (dateStr && !isNaN(amount)) {
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
          results.push({
            date: parsedDate,
            amount: Math.abs(amount),
            type: amount > 0 ? "income" : "expense",
            description: description || "Imported transaction",
            source,
            externalId: data["Reference Number"] || data["Ref No."] || undefined,
          });
        }
      }
    }
    return results;
  }

  static async parseExcel(buffer: Buffer, source: string): Promise<NormalizedTransaction[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) throw new Error("No worksheet found in Excel file");

    const headers: string[] = [];
    const results: NormalizedTransaction[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        // First row is headers
        row.eachCell((cell, colNumber) => {
          headers[colNumber] = String(cell.value || "");
        });
        return;
      }

      const rowData: Record<string, string> = {};
      row.eachCell((cell, colNumber) => {
        rowData[headers[colNumber] || `col${colNumber}`] = String(cell.value || "");
      });

      const dateStr = rowData.Date || rowData.date || rowData["Transaction Date"];
      const amount = parseFloat(rowData.Amount || rowData.amount || rowData["Transaction Amount"]);
      const description = rowData.Description || rowData.description || rowData["Narration"];

      if (dateStr && !isNaN(amount)) {
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
          results.push({
            date: parsedDate,
            amount: Math.abs(amount),
            type: (amount > 0 ? "income" : "expense") as "income" | "expense",
            description: description || "Imported transaction",
            source,
            externalId: rowData["Reference Number"] || rowData["Ref No."] || undefined,
          });
        }
      }
    });

    return results;
  }

  static async normalizeTransactionData(rawData: any[], source: string): Promise<NormalizedTransaction[]> {
    return rawData.map((t: any) => {
      const type = (t.type?.toLowerCase() === "income" || t.amount > 0) ? "income" : "expense";
      const description = t.description || t.memo || t.narration || "Bank Transaction";
      
      return {
        date: new Date(t.date),
        amount: Math.abs(parseFloat(t.amount)),
        type: type as "income" | "expense",
        description: description,
        category: AIService.classifyTransaction(description),
        source: source,
        externalId: t.refNo || t.id || `${source}-${t.date}-${t.amount}`
      };
    }).filter(t => !isNaN(t.amount) && t.date.toString() !== "Invalid Date");
  }

  static async parseSMS(text: string, source: string): Promise<NormalizedTransaction[]> {
    const transactions: NormalizedTransaction[] = [];
    
    // Pattern for: "Spent Rs.500.00 at AMAZON on 14-03-24. Bal: Rs.5000"
    // Pattern for: "Debited for Rs.1200.00 via UPI to XYZ on 14/03/24"
    const genericSpentRegex = /(?:spent|debited|paid|for)\s+(?:rs\.?|inr)\s*(\d+(?:\.\d{2})?)/i;
    const genericMerchantRegex = /(?:at|to|on)\s+([A-Z0-9\s&]{3,20})(?:\s+on|\s+via|\.|$)/i;
    const dateRegex = /(\d{2}[-/\.]\d{2}[-/\.]\d{2,4})/;

    const amountMatch = text.match(genericSpentRegex);
    const merchantMatch = text.match(genericMerchantRegex);
    const dateMatch = text.match(dateRegex);

    if (amountMatch) {
      const description = merchantMatch ? `SMS: ${merchantMatch[1].trim()}` : "SMS Transaction";
      transactions.push({
        date: dateMatch ? new Date(dateMatch[1]) : new Date(),
        amount: parseFloat(amountMatch[1]),
        type: "expense",
        description,
        category: AIService.classifyTransaction(description),
        source: `SMS: ${source}`,
      });
    }

    return transactions;
  }

  static async parseOCRText(text: string, source: string): Promise<NormalizedTransaction[]> {
    const transactions: NormalizedTransaction[] = [];
    
    // Look for major amounts (usually largest in receipt)
    const amountRegex = /(?:total|amount|sum|net)\s*(?:[:=]|\s)\s*(?:rs\.?|inr|\$)?\s*(\d+\.\d{2})/i;
    const dateRegex = /(\d{2}[-/\.]\w{3,}[-/\.]\d{2,4})|(\d{2}[-/\.]\d{2}[-/\.]\d{2,4})/;

    const amountMatch = text.match(amountRegex);
    const dateMatch = text.match(dateRegex);
    
    // Extract merchant (usually first few lines of receipt)
    const lines = text.split("\n").filter(l => l.trim().length > 3);
    const merchant = lines[0] || "Unknown Merchant";

    if (amountMatch) {
      const description = `OCR: ${merchant.trim()}`;
      transactions.push({
        date: dateMatch ? new Date(dateMatch[1] || dateMatch[2]) : new Date(),
        amount: parseFloat(amountMatch[1]),
        type: "expense",
        description,
        category: AIService.classifyTransaction(description),
        source: `OCR: ${source}`,
      });
    }

    return transactions;
  }

  static async parsePDF(buffer: Buffer, source: string): Promise<NormalizedTransaction[]> {
    const data = await pdf(buffer);
    const text = data.text;
    const transactions: NormalizedTransaction[] = [];

    // Simple regex-based extraction for common PDF patterns (DD/MM/YYYY text patterns)
    // This is a basic implementation and would need refinement for specific banks
    const lines = text.split("\n");
    const dateRegex = /(\d{2}[\/\-]\d{2}[\/\-]\d{4})/;
    const amountRegex = /(-?\d+\.?\d*)/;

    for (const line of lines) {
      const dateMatch = line.match(dateRegex);
      if (dateMatch) {
        const parts = line.split(/\s+/);
        const amountMatch = parts.find((p: string) => p.match(amountRegex) && !p.includes("/"));
        
        if (amountMatch) {
          const amount = parseFloat(amountMatch.replace(/,/g, ""));
          transactions.push({
            date: new Date(dateMatch[1]),
            amount: Math.abs(amount),
            type: amount > 0 ? "income" : "expense",
            description: line.substring(line.indexOf(dateMatch[1]) + dateMatch[1].length).trim() || "Imported transaction",
            source,
          });
        }
      }
    }
    return transactions;
  }

  static async saveImportedTransactions(userId: string, transactions: NormalizedTransaction[]) {
    return prisma.$transaction(
      transactions.map((t) =>
        prisma.transaction.upsert({
          where: {
            // @ts-ignore
            externalId: t.externalId || `${userId}_${t.date.getTime()}_${t.amount}_${t.description.substring(0, 20)}`,
          },
          update: {}, // Don't update if it already exists
          create: {
            userId,
            amount: t.amount,
            type: t.type,
            description: t.description,
            category: t.category || "Uncategorized",
            transactionDate: t.date,
            // @ts-ignore
            source: t.source,
            // @ts-ignore
            externalId: t.externalId || `${userId}_${t.date.getTime()}_${t.amount}_${t.description.substring(0, 20)}`,
          },
        })
      )
    );
  }
}
