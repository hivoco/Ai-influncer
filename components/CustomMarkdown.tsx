import ReactMarkdown from "react-markdown";
const CustomMarkdown = ({ text }: { text: string }) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ ...props }) => (
          <h1 className="text-xl font-bold mb-3 text-gray-900" {...props} />
        ),
        h2: ({ ...props }) => (
          <h2 className="text-lg font-bold mb-2 text-gray-900" {...props} />
        ),
        h3: ({ ...props }) => (
          <h3 className="text-base font-bold mb-2 text-gray-900" {...props} />
        ),
        p: ({ ...props }) => <p className="mb-2 text-sm" {...props} />,
        strong: ({ ...props }) => (
          <strong className="font-bold text-gray-900" {...props} />
        ),
        em: ({ ...props }) => <em className="italic" {...props} />,
        ul: ({ ...props }) => (
          <ul className="list-disc list-inside mb-2 text-sm" {...props} />
        ),
        ol: ({ ...props }) => (
          <ol className="list-decimal list-inside mb-2 text-sm" {...props} />
        ),
        li: ({ ...props }) => <li className="mb-1" {...props} />,
        a: ({ ...props }) => (
          <a className="text-indigo-600 hover:underline" {...props} />
        ),
        blockquote: ({ ...props }) => (
          <blockquote
            className="border-l-4 border-gray-300 pl-3 italic mb-2 text-sm"
            {...props}
          />
        ),
        code: ({ ...props }) => (
          <code
            className="bg-gray-100 px-1 py-0.5 rounded text-xs"
            {...props}
          />
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
};

export default CustomMarkdown;
