"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X, CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface FileUploadProps {
  onUpload: (transactions: any[]) => void;
  source: string;
}

export function FileUpload({ onUpload, source }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const processFile = async (file: File) => {
    const validTypes = [".csv", ".xlsx", ".xls", ".pdf"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    
    if (!validTypes.includes(fileExt)) {
      toast.error("Unsupported file format. Please upload CSV, Excel, or PDF.");
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("source", source);

    try {
      const res = await fetch("/api/imports/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onUpload(data.transactions);
        toast.success(`Parsed ${data.transactions.length} transactions from ${file.name}`);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to parse file");
      }
    } catch (error) {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [source]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center text-center cursor-pointer group ${
          isDragging 
            ? "border-indigo-500 bg-indigo-50/50" 
            : uploadedFile 
              ? "border-emerald-500 bg-emerald-50/10" 
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
        }`}
      >
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleChange}
          accept=".csv,.xlsx,.xls,.pdf"
        />
        
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
          isUploading 
            ? "bg-indigo-100 text-indigo-600 animate-pulse" 
            : uploadedFile 
              ? "bg-emerald-100 text-emerald-600" 
              : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600"
        }`}>
          {isUploading ? (
            <Loader2 size={32} className="animate-spin" />
          ) : uploadedFile ? (
            <CheckCircle2 size={32} />
          ) : (
            <Upload size={32} />
          )}
        </div>

        {uploadedFile ? (
          <div>
            <p className="text-sm font-bold text-slate-900">{uploadedFile.name}</p>
            <p className="text-xs text-slate-500 mt-1">Ready for preview</p>
          </div>
        ) : (
          <div>
            <p className="text-base font-bold text-slate-900">
              {isDragging ? "Drop to upload" : "Click or drag your statement here"}
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Supports CSV, Excel, and PDF Statements
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
