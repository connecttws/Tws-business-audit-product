"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FormBuilder } from "@/components/builder/FormBuilder";
import { AuditFormData } from "@/types/form";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditFormPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [formData, setFormData] = useState<AuditFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/forms/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load audit form");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.form) {
          setFormData(data.form);
        } else {
          setError(data.error || "Form not found");
        }
      })
      .catch((err) => {
        setError(err?.message || "Error loading form");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          <p className="text-xs font-mono text-slate-500">Loading form configuration...</p>
        </div>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200/90 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Form Not Found</h2>
          <p className="text-xs text-slate-500">{error || "The requested audit form could not be located."}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm shadow-sky-600/25"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return <FormBuilder initialData={formData} isEditMode={true} />;
}
