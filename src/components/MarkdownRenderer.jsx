import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const MarkdownRenderer = ({ content, isStreaming }) => {
    // Helper to auto-wrap raw SQL queries if the AI forgets to use code blocks
    const preprocessContent = (text) => {
        if (!text) return '';

        // If the AI already used code blocks, assume it handled formatting correctly
        if (text.includes('```')) return text;

        // Regex to find SQL-like patterns at the start of a line (or the whole text)
        // Modified to be EAGER: matches if it ends with ; OR if it's the end of the string ($).
        // This allows the "streaming" effect to show the code block immediately while typing.
        return text.replace(/(^|\n)((?:SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|WITH)\s+[\s\S]+?)(?:;|$)/gi, (match, prefix, query) => {
            return `${prefix}\`\`\`sql\n${query}\n\`\`\``;
        });
    };

    const processedContent = preprocessContent(content);

    return (
        <div className={isStreaming ? "streaming-result" : ""}>
            <ReactMarkdown
                children={processedContent}
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeContent = String(children).replace(/\n$/, '');

                        // Force block rendering if NOT inline, even if no language match
                        return match ? (
                            <div className="rounded-md overflow-hidden my-4 shadow-sm syntax-box">
                                {/* Optional: Header for code block could go here */}
                                <SyntaxHighlighter
                                    {...props}
                                    children={codeContent}
                                    style={atomDark}
                                    // If match found, use it. If not, check if it looks like SQL, otherwise default to text
                                    language={match ? match[1] : (codeContent.trim().toUpperCase().startsWith('SELECT') ? 'sql' : 'text')}
                                    PreTag="div"
                                    customStyle={{
                                        margin: 0,
                                        borderRadius: 0,
                                        whiteSpace: 'pre-wrap',       // Force wrapping on container
                                        wordBreak: 'break-word',      // Break long words
                                        overflowWrap: 'break-word',   // Standard break
                                        overflow: 'visible'           // Disable scroll
                                    }}
                                    codeTagProps={{
                                        style: {
                                            whiteSpace: 'pre-wrap',   // Force wrapping on inner code tag
                                            wordBreak: 'break-word'
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <code {...props} className={`${className} bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded text-sm text-pink-600 dark:text-pink-400`}>
                                {children}
                            </code>
                        );
                    },
                    // Basic styling for other elements to ensure they look good without @tailwindcss/typography
                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-3 mt-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2 mt-3" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 mt-2" {...props} />,
                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 italic text-zinc-500 dark:text-zinc-400 my-2" {...props} />,
                    a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                    table: ({ node, ...props }) => <div className="overflow-x-auto my-2"><table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700 border border-zinc-200 dark:border-zinc-700" {...props} /></div>,
                    th: ({ node, ...props }) => <th className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 font-semibold text-left border-b border-zinc-200 dark:border-zinc-700" {...props} />,
                    td: ({ node, ...props }) => <td className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800" {...props} />,
                }}
            />
        </div>
    );
};

export default MarkdownRenderer;
