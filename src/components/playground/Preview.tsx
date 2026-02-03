import { useEffect, useRef } from 'react';

interface PreviewProps {
  html: string;
}

export const Preview = ({ html }: PreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      className="preview-frame rounded-lg"
      title="Preview"
      sandbox="allow-scripts allow-same-origin"
    />
  );
};
