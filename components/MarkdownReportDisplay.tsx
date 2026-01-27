import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MarkdownReportDisplayProps {
    content: string;
    title: string;
}

const MarkdownReportDisplay: React.FC<MarkdownReportDisplayProps> = ({ content, title }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                        <p className="text-sm text-slate-500">Analyse par IA OpenAI GPT-4o-mini</p>
                    </div>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">Copié !</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4 text-slate-600" />
                            <span className="text-sm font-medium text-slate-600">Copier</span>
                        </>
                    )}
                </button>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-slate max-w-none">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => (
                            <h1 className="text-2xl font-bold text-slate-800 mb-4 mt-6 first:mt-0">{children}</h1>
                        ),
                        h2: ({ children }) => (
                            <h2 className="text-xl font-bold text-slate-700 mb-3 mt-5">{children}</h2>
                        ),
                        h3: ({ children }) => (
                            <h3 className="text-lg font-semibold text-slate-700 mb-2 mt-4">{children}</h3>
                        ),
                        p: ({ children }) => (
                            <p className="text-slate-600 mb-3 leading-relaxed">{children}</p>
                        ),
                        ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-1 mb-3 text-slate-600">{children}</ul>
                        ),
                        ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-1 mb-3 text-slate-600">{children}</ol>
                        ),
                        li: ({ children }) => (
                            <li className="ml-4">{children}</li>
                        ),
                        strong: ({ children }) => (
                            <strong className="font-semibold text-slate-800">{children}</strong>
                        ),
                        em: ({ children }) => (
                            <em className="italic text-slate-700">{children}</em>
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
};

export default MarkdownReportDisplay;
