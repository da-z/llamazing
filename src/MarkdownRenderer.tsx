import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import copy from "clipboard-copy";
import { Button } from "./rac/Button.tsx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { atomDark as style } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Clipboard, ClipboardCheck } from "lucide-react";

interface CodeBlockProps {
  language: string;
  value: string;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyClick = async () => {
    await copy(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const syntaxHighlighterStyle = {
    borderRadius: "0.4rem",
    fontSize: "0.7rem",
    minHeight: "2.6rem",
  } as React.CSSProperties;

  return (
    <div className="group relative">
      <Button
        className="absolute right-2 top-2 bg-gray-800 p-1 text-white opacity-0 group-hover:opacity-100"
        onPress={handleCopyClick}
      >
        {copied ? (
          <ClipboardCheck className="h-4 w-4" />
        ) : (
          <Clipboard className="h-4 w-4" />
        )}
      </Button>
      <SyntaxHighlighter
        language={language}
        style={style}
        customStyle={syntaxHighlighterStyle}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

interface MarkdownRendererProps {
  content: string;
}

const Code: React.FC<CodeProps> = ({ inline, className, children }) => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <CodeBlock
      language={match[1]}
      value={String(children).replace(/\n$/, "")}
    />
  ) : (
    <code className={className}>{children}</code>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      children={content}
      components={{
        code: Code,
      }}
    />
  );
};

export default MarkdownRenderer;
