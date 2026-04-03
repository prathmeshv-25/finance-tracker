"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { FileUpload } from "@/components/imports/FileUpload";
import { TransactionPreview } from "@/components/imports/TransactionPreview";
import { 
  Banknote, 
  Smartphone, 
  FileText, 
  ArrowLeft,
  ArrowRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

import { ReceiptScanner } from "@/components/imports/ReceiptScanner";

type ImportStep = "selection" | "upload" | "preview" | "sms";

interface Source {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  type?: "file" | "sms" | "ocr";
}

const sources: Source[] = [
  { id: "bank_hdfc", name: "HDFC Bank", description: "CSV & PDF Statements", icon: Banknote, color: "bg-blue-50 text-blue-600", type: "file" },
  { id: "bank_icici", name: "ICICI Bank", description: "Excel & PDF Exports", icon: Banknote, color: "bg-orange-50 text-orange-600", type: "file" },
  { id: "sms_paste", name: "SMS Alerts", description: "Copy-Paste Bank SMS", icon: Smartphone, color: "bg-purple-50 text-purple-600", type: "sms" },
  { id: "ocr_receipt", name: "Receipt Scan", description: "Upload Receipt Image", icon: FileText, color: "bg-rose-50 text-rose-600", type: "ocr" },
  { id: "generic_csv", name: "Generic CSV", description: "Standard Excel/CSV files", icon: FileText, color: "bg-emerald-50 text-emerald-600", type: "file" },
];

export default function ImportsPage() {
  const [step, setStep] = useState<ImportStep>("selection");
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [parsedTransactions, setParsedTransactions] = useState<any[]>([]);
  const [smsText, setSmsText] = useState("");
  const [isProcessingSms, setIsProcessingSms] = useState(false);

  const handleSourceSelect = (source: Source) => {
    setSelectedSource(source);
    if (source.type === "sms") {
        setStep("sms");
    } else {
        setStep("upload");
    }
  };

  const handleUpload = (transactions: any[]) => {
    setParsedTransactions(transactions);
    setStep("preview");
  };

  const handleSmsSubmit = async () => {
    if (!smsText.trim()) return;
    
    setIsProcessingSms(true);
    try {
      const res = await fetch("/api/imports/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            text: smsText, 
            source: selectedSource?.name || "SMS",
            type: "sms" 
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setParsedTransactions(data.transactions);
        setStep("preview");
        toast.success(`Extracted ${data.transactions.length} transactions from SMS`);
      } else {
        toast.error("Failed to parse SMS content");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsProcessingSms(false);
    }
  };

  const reset = () => {
    setStep("selection");
    setSelectedSource(null);
    setParsedTransactions([]);
    setSmsText("");
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4 lg:p-8 max-w-5xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Transaction Aggregation</h1>
            <p className="text-slate-500 mt-1">Unified import from banks, UPI, receipts, and SMS.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
            {["selection", "upload", "preview"].map((s, idx) => (
              <div 
                key={s} 
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  (step === s || (step === "sms" && s === "upload")) ? "bg-white text-indigo-600 shadow-sm shadow-indigo-100" : "text-slate-400"
                }`}
              >
                {idx + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {step === "selection" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {sources.map((source) => (
              <div 
                key={source.id}
                onClick={() => handleSourceSelect(source)}
                className="group p-6 bg-white border border-slate-100 rounded-3xl cursor-pointer hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all flex flex-col gap-4 text-center md:text-left md:flex-row md:items-center md:gap-6"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mx-auto md:mx-0 transition-transform group-hover:scale-110 ${source.color}`}>
                  <source.icon size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{source.name}</h3>
                  <p className="text-sm text-slate-500">{source.description}</p>
                </div>
                <div className="hidden md:flex w-10 h-10 rounded-full border border-slate-100 items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-100 group-hover:bg-indigo-50/50 transition-all">
                  <ArrowRight size={20} />
                </div>
              </div>
            ))}
          </div>
        )}

        {step === "sms" && selectedSource && (
          <Card className="p-10 animate-in zoom-in-95 duration-500">
            <div className="max-w-2xl mx-auto space-y-8">
               <div className="text-center space-y-2">
                <button 
                  onClick={reset}
                  className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors mb-4"
                >
                  <ArrowLeft size={14} className="mr-1" />
                  Change Source
                </button>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${selectedSource.color}`}>
                  <selectedSource.icon size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Paste Bank SMS</h2>
                <p className="text-slate-500 text-sm">Paste the transaction alert SMS from your bank below.</p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  placeholder="Example: Spent Rs.500.00 at AMAZON on 14-03-24. Bal: Rs.5000"
                  className="w-full h-32 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm transition-all"
                />
                <Button 
                    className="w-full rounded-2xl py-6 text-base font-bold" 
                    onClick={handleSmsSubmit}
                    disabled={!smsText.trim() || isProcessingSms}
                >
                    {isProcessingSms ? <Loader2 className="animate-spin mr-2" /> : <Smartphone className="mr-2" />}
                    Extract Transaction Details
                </Button>
              </div>
            </div>
          </Card>
        )}

        {step === "upload" && selectedSource && (
          <Card className="p-10 text-center animate-in zoom-in-95 duration-500">
            <div className="max-w-md mx-auto space-y-8">
              <div className="space-y-2">
                <button 
                  onClick={reset}
                  className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors mb-4"
                >
                  <ArrowLeft size={14} className="mr-1" />
                  Change Source
                </button>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${selectedSource.color}`}>
                  <selectedSource.icon size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                    {selectedSource.type === "ocr" ? "Scan Receipt" : `Upload ${selectedSource.name} Statement`}
                </h2>
                <p className="text-slate-500 text-sm">
                    {selectedSource.type === "ocr" 
                        ? "Capture a clear photo of your receipt to extract data." 
                        : "Please drag and drop your file below to start the aggregation process."}
                </p>
              </div>

              {selectedSource.type === "ocr" ? (
                  <ReceiptScanner source={selectedSource.id} onUpload={handleUpload} />
              ) : (
                  <FileUpload source={selectedSource.id} onUpload={handleUpload} />
              )}
              
              <div className="pt-6">
                 <p className="text-[10px] text-slate-400 px-8 uppercase tracking-widest font-bold">
                    Privacy Note: All processing happens in a secure session. Data is not stored until you confirm.
                 </p>
              </div>
            </div>
          </Card>
        )}

        {step === "preview" && (
          <TransactionPreview 
            transactions={parsedTransactions} 
            onConfirm={reset} 
            onCancel={() => setStep("upload")} 
          />
        )}
      </div>
    </AppLayout>
  );
}
