import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
const CustomMarkdown = ({ text }: { text: string }) => {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 5);

    return () => clearInterval(interval);
  }, []);

  return (
    <ReactMarkdown
      components={{
        h1: ({ ...typed }) => (
          <h1 className="text-xl font-bold mb-3 text-gray-900" {...typed} />
        ),
        h2: ({ ...typed }) => (
          <h2 className="text-lg font-bold mb-2 text-gray-900" {...typed} />
        ),
        h3: ({ ...typed }) => (
          <h3 className="text-base font-bold mb-2 text-gray-900" {...typed} />
        ),
        p: ({ ...typed }) => <p className="mb-2 text-sm" {...typed} />,
        strong: ({ ...typed }) => (
          <strong className="font-bold text-gray-900" {...typed} />
        ),
        em: ({ ...typed }) => <em className="italic" {...typed} />,
        ul: ({ ...typed }) => (
          <ul className="list-disc list-inside mb-2 text-sm" {...typed} />
        ),
        ol: ({ ...typed }) => (
          <ol className="list-decimal list-inside mb-2 text-sm" {...typed} />
        ),
        li: ({ ...typed }) => <li className="mb-1" {...typed} />,
        a: ({ ...typed }) => (
          <a className="text-indigo-600 hover:underline" {...typed} />
        ),
        blockquote: ({ ...typed }) => (
          <blockquote
            className="border-l-4 border-gray-300 pl-3 italic mb-2 text-sm"
            {...typed}
          />
        ),
        code: ({ ...typed }) => (
          <code
            className="bg-gray-100 px-1 py-0.5 rounded text-xs"
            {...typed}
          />
        ),
      }}
    >
      {typed}
    </ReactMarkdown>
  );
};

export default CustomMarkdown;
