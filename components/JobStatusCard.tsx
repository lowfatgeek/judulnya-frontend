"use client";

import { StatusResponse } from "@/lib/api";
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface JobStatusCardProps {
    status: StatusResponse | null;
    loading: boolean;
    jobId: string | null;
    error?: string | null;
}

export default function JobStatusCard({ status, loading, jobId, error }: JobStatusCardProps) {
    if (!jobId && !error) return null;

    const currentStatus = status?.status || (loading ? "queued" : "failed");
    const isFailed = currentStatus === "failed" || !!error;
    const isPartial = currentStatus === "partial";
    const isSuccess = currentStatus === "success";

    let icon = <Loader2 className="w-6 h-6 animate-spin text-blue-500" />;
    let title = "Processing...";
    let colorClass = "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    let textColor = "text-blue-700 dark:text-blue-300";

    if (isFailed) {
        icon = <XCircle className="w-6 h-6 text-red-500" />;
        title = "Analysis Failed";
        colorClass = "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
        textColor = "text-red-700 dark:text-red-300";
    } else if (isSuccess) {
        icon = <CheckCircle2 className="w-6 h-6 text-green-500" />;
        title = "Analysis Complete";
        colorClass = "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
        textColor = "text-green-700 dark:text-green-300";
    } else if (isPartial) {
        icon = <AlertTriangle className="w-6 h-6 text-amber-500" />;
        title = "Analysis Partial";
        colorClass = "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
        textColor = "text-amber-700 dark:text-amber-300";
    }

    const errorMessage = error || status?.error_message;

    return (
        <div className={`w-full max-w-2xl mx-auto mt-6 p-4 rounded-xl border ${colorClass} transition-all`}>
            <div className="flex items-start gap-4">
                <div className="pt-1">{icon}</div>
                <div className="flex-1">
                    <h3 className={`font-semibold text-lg ${textColor}`}>{title}</h3>
                    <div className="flex flex-col gap-1 mt-1">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Job ID: <span className="font-mono text-xs opacity-70">{jobId}</span>
                        </p>
                        {status?.status && (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/50 dark:bg-black/20">
                                    {status.status}
                                </span>
                            </div>
                        )}
                        {errorMessage && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-2 bg-red-100 dark:bg-red-900/30 p-2 rounded border border-red-200 dark:border-red-800">
                                Error: {errorMessage}
                            </p>
                        )}

                        {status?.hl && status?.gl && (
                            <div className="flex gap-2 text-xs text-zinc-500 mt-1">
                                <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">HL: {status.hl}</span>
                                <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">GL: {status.gl}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
