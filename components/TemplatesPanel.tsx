"use client";

import { Template } from "@/lib/api";
import { Copy, Check, FileText } from "lucide-react";
import { useState } from "react";

interface TemplatesPanelProps {
    templates: Template[];
}

export default function TemplatesPanel({ templates }: TemplatesPanelProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);

    if (!templates || templates.length === 0) return null;

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyAll = () => {
        const allText = templates.map(t => t.template_text).join("\n");
        navigator.clipboard.writeText(allText);
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Generated Patterns
                    <span className="text-sm font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{templates.length}</span>
                </h2>
                <button
                    onClick={handleCopyAll}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                >
                    {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedAll ? "Copied All" : "Copy All Patterns"}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {templates.map((template, idx) => (
                    <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex gap-4 items-start group hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm">
                        <div className="flex-1 min-w-0">
                            <p className="font-mono text-base font-medium text-zinc-900 dark:text-zinc-100 mb-2 break-words text-wrap">
                                {template.template_text}
                            </p>
                            <div className="text-sm text-zinc-500 space-y-1 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                {template.example_1 && <p className="flex gap-2"><span className="text-xs uppercase font-bold text-zinc-400 mt-0.5 select-none w-10 flex-shrink-0">Ex 1</span> <span className="italic">{template.example_1}</span></p>}
                                {template.example_2 && <p className="flex gap-2"><span className="text-xs uppercase font-bold text-zinc-400 mt-0.5 select-none w-10 flex-shrink-0">Ex 2</span> <span className="italic">{template.example_2}</span></p>}
                            </div>
                        </div>

                        <button
                            onClick={() => handleCopy(template.template_text, idx)}
                            className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all flex-shrink-0"
                            title="Copy Pattern Only"
                        >
                            {copiedIndex === idx ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
