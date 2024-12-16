import curlConverter from "@proxymanllc/better-curl-to-json";
import { request } from "http";
import { useEffect, useState } from 'react';

interface CurlViewerProps {
  curl: string | undefined | null;
}

const CurlViewer = ({ curl }: CurlViewerProps) => {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState<string>();
  const [method, setMethod] = useState<string>();
  const [headers, setHeaders] = useState<Record<string, string>>()

  const curlCommand = `curl -X GET 'https://api.npoint.io/c9aa3e8003aceb1b9b52' --header 'content-type: application/json' --header 'x-api-key: SECRET_KEY'`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatCurl = (curl: string) => {
    return curl
      .replace(/ --header /g, '\n  --header ')
      .replace(/-X /, '\n  -X ');
  };

  useEffect(() => {
    if (!curl) {
      return;
    }

    const requestInJson = curlConverter(curl);

    const { url, header, method } = requestInJson;

    setUrl(url);
    setHeaders(header);
    setMethod(method);
  }, [curl])

  return (
    <div className="w-full">
      <div className="bg-gray-900 dark:bg-[#181818] rounded-lg p-4">
        <pre className="text-sm text-gray-100 dark:text-gray-200 font-mono whitespace-pre-wrap break-all">
          {formatCurl(curlCommand)}
        </pre>
      </div>

      <div className="mt-4 space-y-2">
        <div className="bg-gray-100 dark:bg-[#181818] p-3 rounded-lg">
          <div className="font-semibold text-sm mb-1 text-gray-800 dark:text-gray-300">
            Method
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{method}</div>
        </div>

        <div className="bg-gray-100 dark:bg-[#181818] p-3 rounded-lg">
          <div className="font-semibold text-sm mb-1 text-gray-800 dark:text-gray-300">
            URL
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 break-all">
            {url}
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-[#181818] p-3 rounded-lg">
          <div className="font-semibold text-sm mb-1 text-gray-800 dark:text-gray-300">
            Headers
          </div>
          <div className="space-y-1">

            {
              headers && Object.keys(headers).map((key) =>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-blue-600 dark:text-blue-400">{key}:</span> {headers[key]}
                </div>)
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurlViewer;