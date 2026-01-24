"use client";

import { useState } from "react";
import { Search, RefreshCw } from "lucide-react";

interface KeywordFormProps {
    onSubmit: (keyword: string, forceRefresh: boolean) => void;
    isLoading: boolean;
}

export default function KeywordForm({ onSubmit, isLoading }: KeywordFormProps) {
    const [keyword, setKeyword] = useState("");
    const [forceRefresh, setForceRefresh] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (keyword.trim()) {
            onSubmit(keyword, forceRefresh);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
            <div className="relative">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Enter keyword (e.g. 'cara membuat kopi')"
                    disabled={isLoading}
                    className="w-full h-14 pl-12 pr-4 text-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400" />
            </div>

            <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-600 dark:text-zinc-400 select-none hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                    <input
                        type="checkbox"
                        checked={forceRefresh}
                        onChange={(e) => setForceRefresh(e.target.checked)}
                        disabled={isLoading}
                        className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                    />
                    <span className="flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> Force Refresh
                    </span>
                </label>

                <button
                    type="submit"
                    disabled={!keyword.trim() || isLoading}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95 transform duration-100"
                >
                    {isLoading ? (
                        <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Analyze Keyword"
                    )}
                </button>
            </div>
        </form>
    );
}
