'use client'
import Editor from '@monaco-editor/react';
import { useState, useCallback } from 'react';
import { Copy, Download, Maximize2, Minimize2, Settings, Code } from 'lucide-react';

type Props = {
    language: string;
    value: string;
    onChange?: (value: string | undefined) => void;
    height?: string;
    title?: string;
}

function CodeEditor({ language, value, onChange, height = '60vh', title }: Props) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [theme, setTheme] = useState<'vs-dark' | 'light' | 'vs'>('vs-dark');
    const [showSettings, setShowSettings] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleChange = useCallback((value: string | undefined) => {
        if (onChange) {
            onChange(value);
        }
    }, [onChange]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const downloadCode = () => {
        const extension = getFileExtension(language);
        const blob = new Blob([value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `code.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getFileExtension = (lang: string): string => {
        const extensions: { [key: string]: string } = {
            javascript: 'js',
            typescript: 'ts',
            python: 'py',
            java: 'java',
            cpp: 'cpp',
            c: 'c',
            html: 'html',
            css: 'css',
            json: 'json',
            xml: 'xml',
            sql: 'sql',
            go: 'go',
            rust: 'rs',
            php: 'php',
            ruby: 'rb',
            swift: 'swift',
            kotlin: 'kt'
        };
        return extensions[lang.toLowerCase()] || 'txt';
    };

    const getLanguageIcon = (lang: string) => {
        return <Code className="w-4 h-4" />;
    };

    return (
        <div className={`relative bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 ${isFullscreen ? 'fixed inset-0 z-50' : ''
            }`}>
            <div className="flex items-center justify-between bg-slate-800/80 backdrop-blur-sm px-4 py-3 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                        {getLanguageIcon(language)}
                        <span className="text-sm font-medium capitalize">
                            {title || `${language} Editor`}
                        </span>
                        <div className="px-2 py-1 bg-slate-700/50 rounded text-xs font-mono">
                            {language.toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">

                    <button
                        onClick={downloadCode}
                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors group"
                        title="Download code"
                    >
                        <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </button>

                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors group"
                        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? (
                            <Minimize2 className="w-4 h-4 text-slate-400 group-hover:text-white" />
                        ) : (
                            <Maximize2 className="w-4 h-4 text-slate-400 group-hover:text-white" />
                        )}
                    </button>
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
                <Editor
                    theme={theme}
                    height={isFullscreen ? 'calc(100vh - 60px)' : height}
                    width="100%"
                    defaultLanguage={language}
                    value={value}
                    language={language}
                    onChange={handleChange}
                    options={{
                        fontSize: 14,
                        fontFamily: 'JetBrains Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        minimap: { enabled: true },
                        automaticLayout: true,
                        wordWrap: 'on',
                        formatOnPaste: true,
                        formatOnType: true,
                        renderWhitespace: 'selection',
                        smoothScrolling: true,
                        cursorBlinking: 'smooth',
                        renderLineHighlight: 'all',
                        bracketPairColorization: { enabled: true },
                        guides: {
                            bracketPairs: true,
                            indentation: true
                        }
                    }}
                />
            </div>

            <div className="flex items-center justify-between bg-slate-800/60 backdrop-blur-sm px-4 py-2 border-t border-slate-700/50 text-xs text-slate-400">
                <div className="flex items-center gap-4">
                    <span>Lines: {value.split('\n').length}</span>
                    <span>Characters: {value.length}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Ready</span>
                </div>
            </div>

            {showSettings && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowSettings(false)}
                ></div>
            )}
        </div>
    );
}

export default CodeEditor;