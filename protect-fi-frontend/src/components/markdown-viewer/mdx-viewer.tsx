import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const MDXViewer = ({ url }: { url: string }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!url) {
      return;
    }

    const fetchContent = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const text = await response.text();
        setContent(text);
        setError('');
      } catch (err) {
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [url]);

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mb-6 border-b pb-2">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold mb-4">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-medium mb-3">{line.slice(4)}</h3>;
      }

      // Code blocks
      if (line.startsWith('```')) {
        return (
          <pre key={index} className="bg-gray-800 text-white p-4 rounded-lg my-4 overflow-x-auto">
            <code className="text-sm">{line.slice(3)}</code>
          </pre>
        );
      }

      // Lists
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 list-disc">{line.slice(2)}</li>;
      }

      // Regular paragraphs
      return line.trim() ? (
        <p key={index} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">{line}</p>
      ) : (
        <div key={index} className="h-4" />
      );
    });
  };

  return (
    <div className="mdx-viewer">
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">Failed to load content. Please try again later.</div>
      ) : (
        <div className="prose dark:prose-invert max-w-none">{renderMarkdown(content)}</div>
      )}
    </div>
  );
};

export default MDXViewer;