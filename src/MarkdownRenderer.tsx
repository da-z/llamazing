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
import * as themes from "react-syntax-highlighter/dist/esm/styles/prism";
import { github } from "./assets/prism/themes/github.ts";

interface CodeBlockProps {
  language: string;
  value: string;
  theme?: "dark" | "light";
}

interface CodeProps {
  className?: string;
  children?: React.ReactNode;
  theme?: "dark" | "light";
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value, theme }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyClick = async () => {
    await copy(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const customSyntaxHighlighterStyle = {
    borderRadius: "0.5rem",
    fontSize: "0.7rem",
    minHeight: "2.6rem",
    padding: "1.2rem 1rem",
    overflow: "scroll",
  } as React.CSSProperties;

  return (
    <div className="group relative my-2">
      <TooltipTrigger delay={500} closeDelay={10}>
        <Button
          className="absolute right-3 top-3 border-none bg-gray-500 p-1.5 text-white opacity-0 group-hover:opacity-100 "
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

      <span className="absolute bottom-2 right-2 text-xs text-black/50 opacity-100 group-hover:opacity-0 dark:text-white/50">
        {language}
      </span>

      <SyntaxHighlighter
        language={language}
        style={theme === "dark" ? themes.dracula : github}
        customStyle={{
          ...customSyntaxHighlighterStyle,
          ...(theme === "light" ? { backgroundColor: "#fafafa" } : {}),
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

interface MarkdownRendererProps {
  content: string;
  theme?: "dark" | "light";
}

const Code: React.FC<CodeProps> = ({ className, children, theme }) => {
  const match = /language-(\w+)/.exec(className || "");
  return match ? (
    <CodeBlock
      language={match[1]}
      value={String(children).replace(/\n$/, "")}
      theme={theme}
    />
  ) : (
    <code
      className={className}
      style={theme === "dark" ? themes.dracula : github}
    >
      {children}
    </code>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  theme,
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeMathjax]}
      children={content}
      components={{
        code: (props) => <Code {...props} theme={theme} />,
      }}
    />
  );
};

export default MarkdownRenderer;
