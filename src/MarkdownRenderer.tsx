import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import copy from "clipboard-copy";
import { Button } from "./rac/Button.tsx";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import { Clipboard, ClipboardCheck } from "lucide-react";
import rehypeMathjax from "rehype-mathjax";
import { Tooltip } from "./rac/Tooltip.tsx";
import { TooltipTrigger } from "react-aria-components";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language: string;
  value: string;
  style?: { [key: string]: React.CSSProperties };
}

interface CodeProps {
  className?: string;
  children?: React.ReactNode;
  style?: { [key: string]: React.CSSProperties };
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value, style }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyClick = async () => {
    await copy(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const customSyntaxHighlighterStyle = {
    borderRadius: "0.4rem",
    fontSize: "0.7rem",
    minHeight: "2.6rem",
  } as React.CSSProperties;

  return (
    <div className="group relative mt-2">
      <TooltipTrigger delay={500} closeDelay={10}>
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
        <Tooltip>Copy</Tooltip>
      </TooltipTrigger>

      <span className="absolute bottom-2 right-2 text-xs text-white/20 opacity-100 group-hover:opacity-0">
        {language}
      </span>

      <SyntaxHighlighter
        language={language}
        style={style}
        customStyle={customSyntaxHighlighterStyle}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

interface MarkdownRendererProps {
  content: string;
  style?: { [key: string]: React.CSSProperties };
}

const Code: React.FC<CodeProps> = ({ className, children, style }) => {
  const match = /language-(\w+)/.exec(className || "");
  return match ? (
    <CodeBlock
      language={match[1]}
      value={String(children).replace(/\n$/, "")}
      style={style}
    />
  ) : (
    <code className={className} style={style}>
      {children}
    </code>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeMathjax]}
      children={content}
      components={{
        code: (props) => <Code {...props} style={dracula} />,
      }}
    />
  );
};

export default MarkdownRenderer;
