"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { Input } from "./Input";
import { Card } from "./Card";

interface DatePickerProps {
  value?: string; // ISO format YYYY-MM-DD
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const DatePicker = ({
  value,
  onChange,
  label,
  error,
  placeholder = "Select date",
  className = "",
  required,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Parse initial value
  const selectedDate = value ? new Date(value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = format(date, "yyyy-MM-dd");
      onChange?.(formatted);
      setIsOpen(false);
    }
  };

  const displayValue = selectedDate ? format(selectedDate, "dd/MM/yyyy") : "";

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <div className="space-y-1.5">
        {label && <label className="label">{label}</label>}
        <div className="relative">
          <Input
            readOnly
            value={displayValue}
            placeholder={placeholder}
            onClick={() => setIsOpen(!isOpen)}
            icon={<CalendarIcon size={18} />}
            className={`cursor-pointer caret-transparent ${error ? "border-expense" : ""}`}
            required={required}
          />
        </div>
        {error && <p className="text-expense text-xs mt-1">{error}</p>}
      </div>

      {isOpen && (
        <Card className="absolute z-[100] mt-2 p-3 shadow-2xl border bg-white animate-slide-up origin-top-left scale-100">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus={isOpen}
            styles={{
              caption: { color: "#4f46e5" },
              head_cell: { color: "#94a3b8", fontWeight: "600" },
              day_selected: { backgroundColor: "#4f46e5", color: "white" },
              day_today: { color: "#4f46e5", fontWeight: "bold", border: "1px solid #4f46e5" },
            }}
          />
        </Card>
      )}
    </div>
  );
};
