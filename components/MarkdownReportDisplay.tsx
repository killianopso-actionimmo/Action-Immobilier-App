import React, { useState, useMemo } from 'react';
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

    // Déterminer la couleur de bordure selon le type de rapport
    const getBorderColor = useMemo(() => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('quartier') || lowerTitle.includes('street')) {
            return 'border-cyan-400/50 shadow-[0_0_20px_rgba(0,255,255,0.2)]'; // Cyan pour quartier
        } else if (lowerTitle.includes('technique') || lowerTitle.includes('technical')) {
            return 'border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.2)]'; // Jaune pour technique
        } else if (lowerTitle.includes('chauffage') || lowerTitle.includes('heating')) {
            return 'border-orange-400/50 shadow-[0_0_20px_rgba(251,146,60,0.2)]'; // Orange pour chauffage
        } else if (lowerTitle.includes('travaux') || lowerTitle.includes('renovation')) {
            return 'border-purple-400/50 shadow-[0_0_20px_rgba(192,132,252,0.2)]'; // Violet pour travaux
        } else {
            return 'border-blue-400/50 shadow-[0_0_20px_rgba(96,165,250,0.2)]'; // Bleu par défaut
        }
    }, [title]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-8 border-2 ${getBorderColor}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                        <p className="text-sm text-gray-400">Analyse par IA OpenAI GPT-4o-mini</p>
                    </div>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-green-400">Copié !</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4 text-gray-300" />
                            <span className="text-sm font-medium text-gray-300">Copier</span>
                        </>
                    )}
                </button>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => (
                            <h1 className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0">{children}</h1>
                        ),
                        h2: ({ children }) => (
                            <h2 className="text-xl font-bold text-cyan-400 mb-3 mt-5 flex items-center gap-2">{children}</h2>
                        ),
                        h3: ({ children }) => (
                            <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">{children}</h3>
                        ),
                        p: ({ children }) => (
                            <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>
                        ),
                        ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">{children}</ul>
                        ),
                        ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-300">{children}</ol>
                        ),
                        li: ({ children }) => (
                            <li className="ml-4 leading-relaxed">{children}</li>
                        ),
                        strong: ({ children }) => (
                            <strong className="font-semibold text-white">{children}</strong>
                        ),
                        em: ({ children }) => (
                            <em className="italic text-cyan-300">{children}</em>
                        ),
                        code: ({ children }) => (
                            <code className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-cyan-400 text-sm">{children}</code>
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
