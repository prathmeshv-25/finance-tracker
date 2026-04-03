"use client";

import { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import { Camera, Image as ImageIcon, Loader2, CheckCircle2, Scan } from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface ReceiptScannerProps {
  onUpload: (transactions: any[]) => void;
  source: string;
}

export function ReceiptScanner({ onUpload, source }: ReceiptScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    processOCR(file);
  };

  const processOCR = async (file: File) => {
    setIsScanning(true);
    setProgress(0);

    try {
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // Send to API for intelligent parsing (using existing logic)
      const res = await fetch("/api/imports/upload", {
        method: "POST",
        body: JSON.stringify({ text, source, type: "ocr" }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        onUpload(data.transactions);
        toast.success("Receipt scanned successfully");
      } else {
        toast.error("Failed to parse receipt data");
      }
    } catch (error) {
        console.error("OCR Error:", error);
      toast.error("An error occurred during scanning");
    } finally {
      setIsScanning(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className={`relative border-2 border-dashed rounded-3xl overflow-hidden transition-all h-64 flex flex-col items-center justify-center ${
          preview ? "border-indigo-500" : "border-slate-200 bg-slate-50/50"
        }`}
      >
        {preview ? (
          <img src={preview} alt="Receipt preview" className="w-full h-full object-contain p-4" />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Camera size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Scan Receipt</p>
              <p className="text-xs text-slate-500 mt-1">Capture or upload an image</p>
            </div>
          </div>
        )}

        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept="image/*"
          ref={fileInputRef}
          disabled={isScanning}
        />

        {isScanning && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs font-bold text-slate-600">Extracting data... {progress}%</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button 
          className="flex-1 rounded-2xl" 
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isScanning}
        >
          <ImageIcon className="mr-2 w-4 h-4" />
          Choose Photo
        </Button>
        {preview && !isScanning && (
          <Button 
            className="flex-1 rounded-2xl" 
            onClick={() => preview && processOCR(dataURLtoFile(preview, 'receipt.png'))}
          >
            <Scan className="mr-2 w-4 h-4" />
            Rescan
          </Button>
        )}
      </div>
    </div>
  );
}

// Helper to convert dataURL back to File for rescan logic
function dataURLtoFile(dataurl: string, filename: string) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)![1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
