import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
const CustomMarkdown = ({ text }: { text: string }) => {
  const [typed, setTyped] = useState(text);

  useEffect(() => {
    setTyped(text);
  }, [text]);

  return (
    <ReactMarkdown
      components={{
        h1: ({ ...typed }) => (
          <h1 className=" leading-6 text-xl  font-bold mb-3 text-gray-900" {...typed} />
        ),
        h2: ({ ...typed }) => (
          <h2 className=" leading-6 text-lg font-bold mb-2 text-gray-900" {...typed} />
        ),
        h3: ({ ...typed }) => (
          <h3 className=" leading-6 text-base font-bold mb-2 text-gray-900" {...typed} />
        ),
        p: ({ ...typed }) => <p className=" leading-6 mb-2 text-sm" {...typed} />,
        strong: ({ ...typed }) => (
          <strong className=" leading-6 font-bold text-gray-900" {...typed} />
        ),
        em: ({ ...typed }) => <em className=" leading-6 italic" {...typed} />,
        ul: ({ ...typed }) => (
          <ul className=" leading-6 list-disc list-inside mb-2 text-sm" {...typed} />
        ),
        ol: ({ ...typed }) => (
          <ol className=" leading-6 list-decimal list-inside mb-2 text-sm" {...typed} />
        ),
        li: ({ ...typed }) => <li className=" leading-6 mb-1" {...typed} />,
        a: ({ ...typed }) => (
          <a className=" leading-6 text-primary hover:underline" {...typed} />
        ),
        blockquote: ({ ...typed }) => (
          <blockquote
            className=" leading-6 border-l-4 border-gray-300 pl-3 italic mb-2 text-sm"
            {...typed}
          />
        ),
        code: ({ ...typed }) => (
          <code
            className=" leading-6 bg-gray-100 px-1 py-0.5 rounded text-xs"
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
