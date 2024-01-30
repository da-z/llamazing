import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import "./App.css";
import { Button } from "./rac/Button.tsx";
import ollama, { ChatResponse, Message } from "ollama";
import {
  Bot,
  CircleUserRound,
  Globe,
  MoonIcon,
  SendHorizonal,
  StopCircleIcon,
  SunIcon,
  SunMoonIcon,
  Trash2Icon,
} from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer.tsx";
import { Label } from "./rac/Field.tsx";
import { Tooltip } from "./rac/Tooltip.tsx";
import { TextArea, TooltipTrigger } from "react-aria-components";
import { Select } from "./rac/Select.tsx";
import { ListBoxItem } from "./rac/ListBox.tsx";
import { ToggleButton } from "./rac/ToggleButton.tsx";
import useLocalStorageState from "./hooks.ts";

function App() {
  const [prompt, setPrompt] = useState(``);
  const [systemPrompt, setSystemPrompt] = useState(
    `You are a helpful AI assistant trained on a vast amount of human knowledge. Answer as concisely as possible.`,
  );
  const [response, setResponse] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useLocalStorageState("mode", "");
  const [messages, setMessages] = useState<
    (Message & { context?: Partial<ChatResponse> })[]
  >([]);
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">();
  const [themePreference, setThemePreference] = useLocalStorageState<
    "dark" | "light" | "system"
  >("theme", "system");
  const [autoScroll, setAutoScroll] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const stopGeneratingRef = useRef<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      setModels((await ollama.list()).models.map((m) => m.name));
    })();
  }, []);

  function getSystemThemePreference() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
  }

  useEffect(() => {
    if (currentTheme) {
      document.body.classList.remove("dark", "light");
      document.body.classList.add(currentTheme);
    }
  }, [currentTheme]);

  useEffect(() => {
    if (themePreference === "system") {
      setCurrentTheme(getSystemThemePreference());
    } else {
      setCurrentTheme(themePreference);
    }
  }, [themePreference]);

  function toggleThemePreference() {
    if (themePreference === "system") {
      setThemePreference("light");
    } else if (themePreference === "light") {
      setThemePreference("dark");
    } else if (themePreference === "dark") {
      setThemePreference("system");
    }
  }

  useEffect(() => {
    if (autoScroll) {
      const intervalId = setInterval(
        () => ref.current?.scrollBy({ top: 250, behavior: "smooth" }),
        50,
      );
      return () => clearInterval(intervalId);
    }
  }, [autoScroll]);

  const onWheel = (e: React.WheelEvent<HTMLElement>) => {
    const { current } = ref;

    if (current) {
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;

      if (isScrollingUp || e.deltaX !== 0) {
        setAutoScroll(false);
      } else if (
        isScrollingDown &&
        current.scrollHeight > current.clientHeight
      ) {
        const isNearBottom =
          current.scrollTop + current.clientHeight >=
          current.scrollHeight - 300;

        if (isNearBottom) {
          setAutoScroll(true);
        }
      }
    }
  };

  const chat = async (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);

    stopGeneratingRef.current = false;
    setIsGenerating(true);

    setResponse(" ");

    setAutoScroll(true);

    const res = await ollama.chat({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
        { role: "user", content: message },
      ],
      stream: true,
      options: {
        // temperature: 0.5,
        // num_ctx: 2048,
      },
    });

    let resp = "";

    let part;

    for await (part of res) {
      if (stopGeneratingRef.current) {
        setIsGenerating(false);
        break;
      }

      resp += part.message.content;
      setResponse(resp);
    }

    let context: Partial<ChatResponse> = {};
    context = Object.assign({}, part);
    delete context.message;

    setResponse("");

    if (resp.trim()) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: resp, context },
      ]);
    }

    setIsGenerating(false);
  };

  const submit = async () => {
    if (prompt) {
      setPrompt("");
      await chat(prompt.trim());
    }
  };

  const handleKeyDownOnPrompt = async (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit()) {
        await submit();
      } else {
        alert("Please pick a model first");
      }
    }
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Delete") {
        stopGenerating();
        setTimeout(() => clearMessages(), 50);
      }
    }

    document.addEventListener("keydown", handleKeyDown as never);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown as never);
    };
  }, []);

  function canSubmit() {
    return !isGenerating && prompt && model;
  }

  function clearMessages() {
    setMessages([]);
  }

  function showStopButton() {
    return isGenerating;
  }

  function stopGenerating() {
    stopGeneratingRef.current = true;
  }

  return (
    <div className={currentTheme}>
      <div className="relative flex h-screen bg-white font-sans text-gray-700 dark:bg-neutral-700 dark:text-white">
        <div className="absolute right-4 top-4 print:hidden">
          <TooltipTrigger delay={400} closeDelay={50}>
            <ToggleButton
              onChange={toggleThemePreference}
              className="rounded-full border-none bg-neutral-200 p-1 text-neutral-600 transition hover:bg-purple-600 hover:text-white dark:bg-neutral-600 dark:text-white dark:hover:bg-yellow-300 dark:hover:text-neutral-800"
            >
              {themePreference === "system" ? (
                <SunMoonIcon size={18} />
              ) : themePreference === "light" ? (
                <SunIcon size={18} />
              ) : (
                <MoonIcon size={18} />
              )}
            </ToggleButton>
            <Tooltip>
              {themePreference === "system"
                ? "System"
                : themePreference === "light"
                  ? "Light"
                  : "Dark"}
            </Tooltip>
          </TooltipTrigger>
        </div>

        <aside className="relative hidden h-screen min-h-[400px] w-0 flex-col bg-neutral-200 p-6 py-2 drop-shadow-xl dark:bg-neutral-800 md:w-[350px] lg:flex  ">
          <h1 className="mx-auto mb-6 mt-6 flex select-none gap-2 text-3xl">
            <Bot size="34" /> LLaMazing
          </h1>

          <Select
            label="Model"
            selectedKey={model}
            aria-label="select-model"
            onSelectionChange={(s) => setModel(String(s))}
          >
            {models.map((m, i) => (
              <ListBoxItem id={m} key={"model" + i}>
                {m}
              </ListBoxItem>
            ))}
          </Select>

          <div className="mt-4 flex select-none items-center">
            <Globe
              className="m-1 rounded text-blue-500 dark:text-blue-400"
              size="20"
            />
            <Label className="text-neutral-700">System Prompt:</Label>
          </div>
          <TextArea
            id="system-prompt"
            aria-label="system-prompt"
            className="mt-2 h-32 rounded-xl border-2 border-neutral-300 p-4 text-[0.9rem] outline-none focus:border-neutral-400 dark:border-neutral-400/40 dark:bg-neutral-800 dark:text-neutral-200 dark:focus:border-neutral-500"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          />

          <div className="absolute bottom-0 left-0 w-full p-4">
            <div className="mt-4">
              <Button
                variant="secondary"
                className={`w-full gap-2`}
                onPressEnd={clearMessages}
                isDisabled={isGenerating || messages.length == 0}
              >
                <div className="inline-flex gap-2">
                  <Trash2Icon className="m-auto" size="16" />
                  Clear conversation
                </div>
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-h-[400px] flex-1 pt-14 sm:px-6">
          <div className="relative m-auto flex h-full flex-col px-8 pb-36">
            <div
              className="grid grid-cols-[auto_minmax(0,_1fr)] gap-x-6 gap-y-4 overflow-y-auto"
              ref={ref}
              onWheel={onWheel}
            >
              <Bot
                className="rounded bg-purple-400 p-[4px] text-white dark:bg-yellow-400 dark:text-yellow-900"
                size="38"
              />
              <div className="mt-[7px] flex flex-col gap-2 pr-8">
                How may I help you?
              </div>
              {messages.map((m, i) => (
                <>
                  {
                    {
                      user: (
                        <CircleUserRound
                          className="rounded bg-blue-400 p-[6px] text-white dark:bg-orange-400 dark:text-orange-900"
                          size="38"
                          key={"icn" + i}
                        />
                      ),
                      assistant: (
                        <Bot
                          className="rounded bg-purple-400 p-[4px] text-white dark:bg-yellow-400 dark:text-yellow-900"
                          size="38"
                          key={"icn" + i}
                        />
                      ),
                    }[m.role]
                  }
                  <div className="prose flex flex-col gap-2 pr-8">
                    <MarkdownRenderer
                      theme={currentTheme}
                      content={m.content}
                      key={"md" + i}
                    />
                  </div>
                </>
              ))}
              {response ? (
                <>
                  <Bot
                    className="rounded bg-purple-400 p-[4px] text-white dark:bg-yellow-400 dark:text-yellow-900"
                    size="38"
                  />
                  <div className="prose flex flex-col gap-2 pr-8">
                    <MarkdownRenderer
                      theme={currentTheme}
                      content={response + "▌"}
                      showCopy={false}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 print:hidden">
              <div className="flex rounded-xl border-2 border-neutral-500/50 p-2 has-[:focus]:border-neutral-500">
                <TextArea
                  id="prompt"
                  aria-label="prompt"
                  className="mr-2 w-full resize-none bg-transparent p-2 text-[0.95rem] text-neutral-600 outline-none dark:text-white"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDownOnPrompt}
                  autoFocus
                  placeholder="Your message here..."
                />

                {showStopButton() ? (
                  <TooltipTrigger delay={750} closeDelay={10}>
                    <Button
                      className="bg-black"
                      onPress={() => stopGenerating()}
                    >
                      <StopCircleIcon className="p-0" size="28" />
                    </Button>
                    <Tooltip>Stop</Tooltip>
                  </TooltipTrigger>
                ) : (
                  <TooltipTrigger delay={750} closeDelay={10}>
                    <Button
                      isDisabled={!canSubmit()}
                      className={`${canSubmit() ? "bg-black" : "bg-neutral-500 hover:bg-neutral-500 dark:bg-neutral-700"}`}
                      onPress={submit}
                    >
                      <SendHorizonal
                        size="28"
                        className={`-rotate-90 font-bold ${canSubmit() ? "text-white" : "text-neutral-400 dark:text-neutral-600"}`}
                      />
                    </Button>
                    <Tooltip>Send</Tooltip>
                  </TooltipTrigger>
                )}
              </div>

              <div className="mt-2 flex flex-col gap-2 print:hidden">
                <div className="inline-flex w-full justify-center text-xs text-neutral-400 dark:text-neutral-500">
                  LLMs can make mistakes. Consider checking important
                  information.
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
