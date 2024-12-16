import React, { useEffect, useState } from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import json from 'react-syntax-highlighter/dist/cjs/languages/hljs/json'
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'

SyntaxHighlighter.registerLanguage('json', json)

interface JSONPreviewerProps {
    uri: string
    field?: string
    highlightedLines?: number[]
    previewLines?: number
}

const JSONPreviewer: React.FC<JSONPreviewerProps> = ({
    uri,
    field,
    highlightedLines = [],
    previewLines = 5
}) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(true);

    const [displayedLines, setDisplayedLines] = useState<string[]>()
    const [jsonLines, setJsonLines] = useState<string[]>()

    const copyToClipboard = () => {
        if (!jsonLines) {
            return;
        }

        navigator.clipboard.writeText(jsonLines.toString())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(undefined);

                const response = await fetch(uri);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const jsonString = JSON.stringify(field ? data[field] : data, null, 2)
                setJsonLines(jsonString.split('\n'))
            } catch (err) {
                setError(`Error fetching JSON`);
            } finally {
                setLoading(false);
            }
        };

        if (uri) {
            fetchData();
        } else {
            setError('No URI provided');
            setLoading(false);
        }
    }, [uri]);

    useEffect(() => {
        setDisplayedLines(isExpanded ? jsonLines : jsonLines?.slice(0, previewLines))
    }, [isExpanded, jsonLines, previewLines])

    return (
        <div className="relative border rounded-lg shadow-md bg-gray-50 dark:bg-[#181818]">
            <div className="absolute right-2 top-2 flex space-x-2">
                <button
                    onClick={copyToClipboard}
                    className="p-2 text-sm bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
                    aria-label={copied ? "Copied" : "Copy to clipboard"}
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 text-sm bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>
            <SyntaxHighlighter
                language="json"
                style={docco}
                className="!bg-transparent !mt-0 !mb-0 !text-gray-900 dark:!text-gray-100"
                showLineNumbers={true}
                wrapLines={true}
                lineProps={(lineNumber) => {
                    const style: React.CSSProperties = { display: "block" };
                    if (highlightedLines.includes(lineNumber)) {
                        style.backgroundColor = "rgba(255, 255, 0, 0.2)";
                    }
                    return { style };
                }}
            >
                {displayedLines?.join("\n") ?? []}
            </SyntaxHighlighter>
            {/* Show more/Show less buttons */}
            {(jsonLines?.length ?? 0) > previewLines && (
                <div className="text-center py-2 bg-gray-100 dark:bg-gray-800 rounded-b-lg">
                    {isExpanded ? (
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                            Show less
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                            Show more
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default JSONPreviewer

