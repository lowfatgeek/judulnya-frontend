"use client";

import { useState, useEffect, useRef } from "react";
import { collectYoutube, checkStatus, StatusResponse } from "@/lib/api";
import KeywordForm from "@/components/KeywordForm";
import JobStatusCard from "@/components/JobStatusCard";
import VideosTable from "@/components/VideosTable";
import TemplatesPanel from "@/components/TemplatesPanel";
import { Download } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const POLLING_INTERVAL = 3000;
  const MAX_POLL_TIME = 300000; // 300s (5 mins) to be safe
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const stopPolling = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  const handleCollect = async (keyword: string, forceRefresh: boolean) => {
    stopPolling();
    setLoading(true);
    setError(null);
    setStatus(null);
    setJobId(null);

    try {
      const res = await collectYoutube(keyword, forceRefresh);
      setJobId(res.job_id);

      if (res.cached) {
        setStatus(res.result);
        setLoading(false);
      } else {
        // Start Polling
        const startTime = Date.now();
        pollTimerRef.current = setInterval(async () => {
          const elapsed = Date.now() - startTime;
          if (elapsed > MAX_POLL_TIME) {
            stopPolling();
            setError("Polling timed out. Please try refreshing.");
            setLoading(false);
            return;
          }

          try {
            const s = await checkStatus(res.job_id);
            // "queued" | "running" | "success" | "partial" | "failed"
            if (s.status === "success" || s.status === "partial" || s.status === "failed") {
              setStatus(s);
              stopPolling();
              setLoading(false);
            } else {
              // Update status for distinct "running" vs "queued" feedback
              setStatus(s);
            }
          } catch (err) {
            console.error("Poll error", err);
          }
        }, POLLING_INTERVAL);
      }
    } catch (err: any) {
      setError(err.message || "Failed to start collection");
      setLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!status) return;
    const allVideos = [
      ...status.search_top,
      ...status.people_also_watched_top,
      ...status.related_fallback_top
    ];

    if (allVideos.length === 0) return;

    const headers = ["Rank", "Title", "Channel", "Views", "Published", "Duration", "Source", "URL", "Video ID"];
    const rows = allVideos.map(v => [
      v.rank,
      `"${v.title.replace(/"/g, '""')}"`,
      `"${v.channel_name.replace(/"/g, '""')}"`,
      v.views_raw,
      v.published_raw,
      v.duration_raw,
      v.source,
      v.video_url,
      v.video_id
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `judulnya_export_${status.job_id}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10 shadow-sm backdrop-blur-md bg-white/80 dark:bg-zinc-900/80">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-blue-500/20 shadow-lg">J</div>
          <h1 className="text-xl font-bold tracking-tight">JUDULNYA <span className="text-zinc-400 font-normal">Detector</span></h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-12 mt-8">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Winning Pattern Detector
          </h2>
          <p className="text-zinc-500 max-w-lg mx-auto text-lg">
            Enter a keyword to analyze top YouTube results and generate winning title patterns instantly.
          </p>
        </div>

        <KeywordForm onSubmit={handleCollect} isLoading={loading} />

        <JobStatusCard status={status} loading={loading} jobId={jobId} error={error} />

        {status && (status.status === "success" || status.status === "partial") && (
          <div className="mt-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="flex justify-end">
              <button onClick={handleExportCSV} className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors bg-white dark:bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow">
                <Download className="w-4 h-4" /> Export Results CSV
              </button>
            </div>

            <TemplatesPanel templates={status.templates} />

            <VideosTable
              title="Top Search Results"
              videos={status.search_top}
              badge={status.gl}
            />

            {status.people_also_watched_top.length > 0 && (
              <VideosTable
                title="People Also Watched"
                videos={status.people_also_watched_top}
                className="pt-8 border-t border-zinc-200 dark:border-zinc-800"
              />
            )}

            {status.related_fallback_top.length > 0 && (
              <VideosTable
                title="Related (Fallback)"
                videos={status.related_fallback_top}
                className="pt-8 border-t border-zinc-200 dark:border-zinc-800"
                badge="Fallback"
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
