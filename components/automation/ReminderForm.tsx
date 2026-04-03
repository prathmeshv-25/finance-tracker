"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DatePicker } from "@/components/ui/DatePicker";
import toast from "react-hot-toast";

const reminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

interface ReminderFormProps {
  onSuccess?: () => void;
}

export function ReminderForm({ onSuccess }: ReminderFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      dueDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: ReminderFormValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create reminder");

      toast.success("Reminder created successfully!");
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create reminder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-slate-800">Add New Reminder</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g. Rent Payment"
          {...register("title")}
          error={errors.title?.message}
        />

        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Due Date"
              value={field.value}
              onChange={field.onChange}
              error={errors.dueDate?.message}
            />
          )}
        />

        <Input
          label="Description (Optional)"
          placeholder="Additional details..."
          {...register("description")}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Reminder"}
        </Button>
      </form>
    </Card>
  );
}
