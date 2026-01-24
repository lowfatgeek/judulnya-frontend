"use client";

import { VideoObject } from "@/lib/api";
import { ExternalLink, Eye, Calendar, Clock } from "lucide-react";

interface VideosTableProps {
    title: string;
    videos: VideoObject[];
    className?: string;
    badge?: string;
}

export default function VideosTable({ title, videos, className, badge }: VideosTableProps) {
    if (!videos || videos.length === 0) return null;

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                    {title}
                    {badge && (
                        <span className="text-xs font-normal bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                            {badge}
                        </span>
                    )}
                </h2>
                <span className="text-sm font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">{videos.length} videos</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video, idx) => (
                    <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">

                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 dark:bg-blue-900/50 text-blue-600 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors block">
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="absolute top-0 left-0 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 px-2 py-1 rounded-br-lg">
                            #{video.rank}
                        </div>

                        <div className="mt-4 mb-2 flex-grow">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                <a href={video.video_url} target="_blank" rel="noopener noreferrer">
                                    {video.title}
                                </a>
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium">{video.channel_name}</p>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-zinc-600 dark:text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-400 mb-0.5 flex items-center gap-1"><Eye className="w-3 h-3" /> Views</span>
                                <span className="font-medium truncate" title={video.views_raw}>{video.views_raw}</span>
                            </div>
                            <div className="flex flex-col border-l border-zinc-100 dark:border-zinc-800 pl-3">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-400 mb-0.5 flex items-center gap-1"><Calendar className="w-3 h-3" /> Published</span>
                                <span className="font-medium truncate" title={video.published_raw || ""}>{video.published_raw || "N/A"}</span>
                            </div>
                            <div className="flex flex-col border-l border-zinc-100 dark:border-zinc-800 pl-3">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-400 mb-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> Duration</span>
                                <span className="font-medium truncate" title={video.duration_raw || ""}>{video.duration_raw || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
