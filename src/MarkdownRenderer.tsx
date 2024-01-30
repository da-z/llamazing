import React, { memo } from "react";
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
import { light } from "./assets/prism/themes/light.ts";
import { dark } from "./assets/prism/themes/dark.ts";

interface CodeBlockProps {
  language: string;
  value: string;
  theme?: "dark" | "light";
  showCopy?: boolean;
}

interface CodeProps {
  className?: string;
  children?: React.ReactNode;
  theme?: "dark" | "light";
  showCopy: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  language,
  value,
  theme,
  showCopy,
}) => {
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
    <div className="group relative">
      {showCopy ? (
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
      ) : null}

      <span className="absolute bottom-2 right-2 text-xs text-black/50 dark:text-white/50">
        {language}
      </span>

      <SyntaxHighlighter
        language={language}
        style={theme === "dark" ? dark : light}
        customStyle={{
          ...customSyntaxHighlighterStyle,
          ...(theme === "light"
            ? {
                border: "2px solid",
                borderColor: "#dedede",
              }
            : {
                border: "2px solid",
                borderColor: "#545454",
              }),
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
  showCopy?: boolean;
}

const Code: React.FC<CodeProps> = ({
  className,
  children,
  theme,
  showCopy,
}) => {
  const match = /language-(\w+)/.exec(className || "");
  return match ? (
    <CodeBlock
      language={match[1].toLowerCase()}
      value={String(children).replace(/\n$/, "")}
      theme={theme}
      showCopy={showCopy}
    />
  ) : (
    <code className={className} style={theme === "dark" ? dark : light}>
      {children}
    </code>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  theme,
  showCopy,
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeMathjax]}
      children={content}
      components={{
        code: (props) => (
          <Code {...props} theme={theme} showCopy={showCopy ?? true} />
        ),
      }}
    />
  );
};

export const MemoizedMarkdownRenderer: React.FC<MarkdownRendererProps> = memo(
  MarkdownRenderer,
  (prevProps, nextProps) =>
    prevProps.content === nextProps.content &&
    prevProps.theme === nextProps.theme,
);

export default MemoizedMarkdownRenderer;
