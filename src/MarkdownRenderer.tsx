import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import copy from "clipboard-copy";
import { Button } from "./rac/Button.tsx";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import { Clipboard, ClipboardCheck } from "lucide-react";
import rehypeMathjax from "rehype-mathjax";
import { dark, light } from "./assets/prism/themes.ts";

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
    padding: "1.2rem 1rem 1.5rem 1rem",
    overflow: "scroll",
  } as React.CSSProperties;

  return (
    <div className="group relative">
      <Button
        className="absolute right-3 top-3 border-none bg-gray-300 p-1.5 text-white hover:bg-gray-400 dark:bg-neutral-700 hover:dark:bg-neutral-600"
        onPress={handleCopyClick}
      >
        {copied ? (
          <ClipboardCheck className="h-4 w-4" />
        ) : (
          <Clipboard className="h-4 w-4" />
        )}
      </Button>

      <span className="absolute bottom-2 right-2 text-xs text-black/20 dark:text-white/20">
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
}

const Code: React.FC<CodeProps> = ({ className, children, theme }) => {
  const match = /language-(\w+)/.exec(className || "");
  if (!match && !String(children).includes("\n")) {
    return <code style={theme === "dark" ? dark : light}>{children}</code>;
  }
  return (
    <CodeBlock
      language={match ? match[1].toLowerCase() : ""}
      value={String(children).replace(/\n$/, "")}
      theme={theme}
    />
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

export const MemoizedMarkdownRenderer: React.FC<MarkdownRendererProps> = memo(
  MarkdownRenderer,
  (prevProps, nextProps) =>
    prevProps.content === nextProps.content &&
    prevProps.theme === nextProps.theme,
);

export default MemoizedMarkdownRenderer;
