import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import { Button } from "./rac/Button.tsx";
import { ChatResponse, Message, Ollama } from "./ollama";
import {
  Bot,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleUserRound,
  Clipboard,
  CommandIcon,
  CopyIcon,
  DeleteIcon,
  FileQuestionIcon,
  Globe,
  MoonIcon,
  PlusIcon,
  RefreshCwIcon,
  SendHorizonal,
  Settings2Icon,
  StopCircleIcon,
  SunIcon,
  SunMoonIcon,
  Trash2Icon,
} from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer.tsx";
import { Label } from "./rac/Field.tsx";
import { Tooltip } from "./rac/Tooltip.tsx";
import {
  DialogTrigger,
  Heading,
  TextArea,
  TooltipTrigger,
  useDragAndDrop,
} from "react-aria-components";
import { Select } from "./rac/Select.tsx";
import { ListBoxItem } from "./rac/ListBox.tsx";
import { ToggleButton } from "./rac/ToggleButton.tsx";
import useLocalStorageState from "./hooks.ts";
import { Checkbox } from "./rac/Checkbox.tsx";
import copy from "clipboard-copy";
import { isFileDropItem } from "react-aria";
import { ImageGridList, ImageGridListItem } from "./rac/ImageGridList.tsx";
import { Modal } from "./rac/Modal.tsx";
import { Dialog } from "./rac/Dialog.tsx";
import { TextField } from "./rac/TextField.tsx";

const DEFAULT_PROMPT = `You are a helpful AI assistant trained on a vast amount of human knowledge. Answer as concisely as possible.`;
const DEFAULT_HOST = "http://localhost:11434";
const DEFAULT_ADD_CONTEXT = false;
const DEFAULT_SHOW_SIDE_PANEL = true;

interface ImageItem {
  id: number;
  url: string;
  name: string;
  blob?: Blob;
}

type Capability = "vision" | "text";

interface Model {
  id: string;
  name: string;
  capabilities: Capability[];
}

type Settings = {
  ollamaHost: string;
  addContextEnabled: boolean;
};

function App() {
  const [prompt, setPrompt] = useState(``);
  const [systemPrompt, setSystemPrompt] = useLocalStorageState(
    "systemPrompt",
    DEFAULT_PROMPT,
  );
  const [systemPromptEnabled, setSystemPromptEnabled] = useLocalStorageState(
    "systemPromptEnabled",
    false,
  );
  const [response, setResponse] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [model, setModel] = useLocalStorageState("model", "");

  const [messages, setMessages] = useLocalStorageState<
    (Message & { context?: Partial<ChatResponse & { images?: ImageItem[] }> })[]
  >("messages", []);

  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">();
  const [themePreference, setThemePreference] = useLocalStorageState<
    "dark" | "light" | "system"
  >("theme", "system");
  const [autoScroll, setAutoScroll] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSidePanel, setShowSidePanel] = useLocalStorageState(
    "showSidePanel",
    DEFAULT_SHOW_SIDE_PANEL,
  );

  const [ollamaHost, setOllamaHost] = useLocalStorageState(
    "ollamaHost",
    DEFAULT_HOST,
  );
  const [addContextEnabled, setAddContextEnabled] = useLocalStorageState(
    "addContext",
    DEFAULT_ADD_CONTEXT,
  );

  let settings: Settings = initSettings();

  const [images, setImages] = useState<ImageItem[]>([]);

  const [imageCache] = useState<Map<string, ImageItem>>(new Map());

  const stopGeneratingRef = useRef<boolean>(false);

  const chatAreaRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const ollama = useRef<Ollama>(new Ollama());

  const reloadModels = useCallback(async () => {
    setModels([]);
    setModels(
      (await ollama.current.list()).models.map(
        (m) =>
          ({
            id: m.digest,
            name: m.name,
            capabilities: m.details.families?.includes("clip")
              ? ["text", "vision"]
              : ["text"],
          }) as Model,
      ),
    );
  }, [ollama]);

  useEffect(() => {
    stopGenerating();
    ollama.current = new Ollama({ host: ollamaHost ?? DEFAULT_HOST });
    (async () => await reloadModels())();
  }, [ollamaHost, reloadModels]);

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

  useEffect(() => {
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    const light = window.matchMedia("(prefers-color-scheme: dark)");

    const onThemeChange = () => {
      if (themePreference === "system") {
        setCurrentTheme(getSystemThemePreference());
      }
    };

    dark.addEventListener("change", onThemeChange);
    light.addEventListener("change", onThemeChange);

    return function cleanup() {
      dark.removeEventListener("change", onThemeChange);
      light.removeEventListener("change", onThemeChange);
    };
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
      const intervalId = setInterval(() => {
        if (isGenerating) {
          chatAreaRef.current?.scrollBy({
            top: 250,
            behavior: (window as any)["__TAURI__"] ? "auto" : "smooth",
          });
        }
      }, 50);
      return () => clearInterval(intervalId);
    }
  }, [autoScroll, isGenerating]);

  const onWheel = (e: React.WheelEvent<HTMLElement>) => {
    const { current } = chatAreaRef;

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
          current.scrollHeight - 250;

        if (isNearBottom) {
          setAutoScroll(true);
        }
      }
    }
  };

  async function fetchBlob(url: string) {
    return await (await fetch(url)).blob();
  }

  async function updateImageCache(images: ImageItem[]) {
    for (const img of images) {
      // image already cached
      if (imageCache.has(img.url)) {
        continue;
      }

      // clone image blob, so it stays in cache even if original is removed
      const imgCopy = (await fetchBlob(img.url)).slice();
      imageCache.set(img.url, {
        ...img,
        blob: imgCopy,
        url: URL.createObjectURL(imgCopy),
      });
    }
  }

  function preProcess(model: string, prompt: string) {
    if (!addContextEnabled) {
      return prompt;
    }

    const now = new Date();

    const utcDateFormatter = new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: "utc",
    });

    const localDateFormatter = new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "long",
    });

    if (!hasCapability(model, "vision")) {
      prompt =
        `
        Global date and time: ${utcDateFormatter.format(now)}
        Local date and time: ${localDateFormatter.format(now)}
        Location: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
        ` + prompt;
    }

    return prompt;
  }

  const chat = async (message: string) => {
    if (hasCapability(model, "vision")) {
      // cache whatever is in images array when a message is sent
      await updateImageCache(images);

      setMessages((prev) => [
        ...prev,
        { role: "user", content: message, context: { images } },
      ]);
    } else {
      setMessages((prev) => [...prev, { role: "user", content: message }]);
    }

    stopGeneratingRef.current = false;
    setIsGenerating(true);
    setResponse(" ");
    setAutoScroll(true);

    const res = await ollama.current.chat({
      model,
      messages: [
        {
          role: "system",
          content: preProcess(
            model,
            systemPromptEnabled ? systemPrompt : "",
          ).trim(),
        },
        ...messages,
        hasCapability(model, "vision")
          ? { role: "user", content: message, images: images.map((i) => i.url) }
          : { role: "user", content: message },
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
        if (!model) {
          alert("Please pick a model first");
        }
      }
    }
  };

  const toggleSidePanel = useCallback(() => {
    setShowSidePanel(!showSidePanel);
  }, [showSidePanel, setShowSidePanel]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey && ["Delete", "Backspace"].includes(e.key)) {
        stopGenerating();
        setTimeout(() => clearMessages(), 50);
      } else if (e.altKey && e.key === "Tab") {
        toggleSidePanel();
        promptRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown as never);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown as never);
    };
  }, [showSidePanel, toggleSidePanel]);

  function canSubmit() {
    return !isGenerating && prompt && model && models.length;
  }

  function clearMessages() {
    setMessages([]);
    promptRef.current?.focus();
  }

  function showStopButton() {
    return isGenerating;
  }

  function stopGenerating() {
    stopGeneratingRef.current = true;
  }

  function hasCapability(model: string, c: Capability) {
    return models.find((m) => m.name === model)?.capabilities.includes(c);
  }

  async function copyMessageToClipboard(
    m: Message & { context?: Partial<ChatResponse> },
  ) {
    await copy(m.content);
  }

  async function copyAllMessagesToClipboard() {
    await copy(
      messages
        .map(
          (m) =>
            "##### " + m.role.toUpperCase() + ":\n\n" + m.content + "\n\n---",
        )
        .join("\n\n"),
    );
  }

  const { dragAndDropHooks } = useDragAndDrop({
    acceptedDragTypes: ["image/jpeg", "image/png"],
    async onRootDrop(e) {
      const images = await Promise.all(
        e.items.filter(isFileDropItem).map(async (item) => ({
          id: Math.random(),
          url: URL.createObjectURL(await item.getFile()),
          name: item.name,
        })),
      );
      setImages(images);
    },
  });

  function removeImage(image: ImageItem) {
    setImages((prev) => prev.filter((i) => i.id != image.id));
  }

  function save(settings: Settings) {
    setOllamaHost(settings.ollamaHost ?? DEFAULT_HOST);
    setAddContextEnabled(settings.addContextEnabled ?? DEFAULT_ADD_CONTEXT);
  }

  function initSettings() {
    return {
      ollamaHost,
      addContextEnabled,
    } as Settings;
  }

  return (
    <div className={currentTheme}>
      <div className="relative flex h-screen cursor-default bg-white font-sans text-gray-700 dark:bg-neutral-700 dark:text-white">
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2 print:hidden">
          <DialogTrigger>
            <TooltipTrigger delay={400} closeDelay={50}>
              <Button
                className="rounded-full border-none bg-neutral-100 p-1.5 text-neutral-500 transition-none hover:bg-blue-600
                         hover:text-white dark:bg-neutral-600 dark:text-white dark:hover:bg-blue-300
                         dark:hover:text-neutral-800"
              >
                <Settings2Icon size="18"></Settings2Icon>
              </Button>
              <Tooltip>Settings</Tooltip>
            </TooltipTrigger>
            <Modal isDismissable>
              <Dialog>
                {({ close }) => (
                  <>
                    <Heading slot="title" className="select-none text-xl">
                      Settings
                    </Heading>

                    <div className="mt-6 flex flex-col gap-3">
                      <TextField
                        label="Ollama URL"
                        defaultValue={settings.ollamaHost}
                        onChange={(v) => (settings.ollamaHost = v)}
                        placeholder={DEFAULT_HOST}
                      />
                      <Checkbox
                        defaultSelected={settings.addContextEnabled}
                        onChange={(v) => (settings.addContextEnabled = v)}
                      >
                        Send Context (Time, Timezone)
                      </Checkbox>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onPress={() => {
                          settings = initSettings();
                          close();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        onPress={() => {
                          save(settings);
                          close();
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </>
                )}
              </Dialog>
            </Modal>
          </DialogTrigger>

          <TooltipTrigger delay={400} closeDelay={50}>
            <ToggleButton
              onChange={toggleThemePreference}
              className="rounded-full border-none bg-neutral-100 p-1.5 text-neutral-500 transition-none hover:bg-purple-600
                         hover:text-white dark:bg-neutral-600 dark:text-white dark:hover:bg-yellow-300
                         dark:hover:text-neutral-800"
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

        <ToggleButton
          onPressEnd={toggleSidePanel}
          className="fixed left-4 top-4 z-10 rounded-full border-none bg-neutral-100 p-0.5 text-neutral-300
                     transition-none hover:bg-neutral-100 hover:text-neutral-400 dark:bg-neutral-800
                     dark:text-neutral-600 hover:dark:bg-neutral-600 hover:dark:text-neutral-400"
        >
          {showSidePanel ? (
            <ChevronLeftIcon size="24" strokeWidth="3"></ChevronLeftIcon>
          ) : (
            <ChevronRightIcon size="24" strokeWidth="3"></ChevronRightIcon>
          )}
        </ToggleButton>

        <div
          className={`fixed w-full transform transition-transform duration-0 sm:duration-300 ${showSidePanel ? "translate-x-0" : "-translate-x-full"}`}
        >
          <aside className="relative flex h-screen min-h-[100vh] w-[100vw] flex-col bg-neutral-200 p-6 py-2 dark:bg-neutral-800 sm:w-[320px]">
            <h1 className="mx-auto mb-6 mt-6 flex select-none items-center gap-2 text-3xl">
              <span className="shrink-0 overflow-hidden">
                <img
                  className="object-fil h-20 w-20"
                  alt="logo"
                  src="/app-icon.png"
                />
              </span>
              <span className="font-prose">LLaMazing</span>
            </h1>

            <div className="flex items-center gap-3">
              <TooltipTrigger>
                <Select
                  selectedKey={model}
                  aria-label="select-model"
                  className="max-w-[calc(100%-30px)] flex-1"
                  onSelectionChange={(s) => setModel("" + s)}
                >
                  {models.map((m) => (
                    <ListBoxItem id={m.name} key={"model_" + m.id}>
                      {m.name}
                    </ListBoxItem>
                  ))}
                </Select>
                <Tooltip className={models.length ? "block" : "hidden"}>
                  {model}
                </Tooltip>
              </TooltipTrigger>
              <RefreshCwIcon
                size="16"
                className="shrink-0 cursor-pointer hover:text-neutral-500 active:text-neutral-700"
                onClick={reloadModels}
              ></RefreshCwIcon>
            </div>

            <div className="relative mt-4 flex select-none items-center">
              <Globe
                className="m-1 rounded text-blue-500 dark:text-blue-400"
                size="20"
              />
              <Label className="text-neutral-700">System Prompt:</Label>
              {systemPromptEnabled && systemPrompt != DEFAULT_PROMPT && (
                <span
                  aria-label="Reset system prompt"
                  className="absolute right-1 top-1 cursor-pointer rounded bg-neutral-400 p-0.5 px-2
                             text-xs text-white hover:bg-neutral-500 dark:bg-neutral-700 hover:dark:bg-neutral-600"
                  onClick={() => setSystemPrompt(DEFAULT_PROMPT)}
                >
                  reset
                </span>
              )}
            </div>
            <div className="relative w-full select-none">
              <TextArea
                id="system-prompt"
                aria-label="system-prompt"
                disabled={!systemPromptEnabled}
                className="mt-2 h-32 w-full select-none rounded-xl border border-neutral-300 p-4 pr-8
                           text-[0.85rem] outline-none focus:border-neutral-400 disabled:resize-none
                           disabled:text-neutral-300 dark:border-neutral-400/40 dark:bg-neutral-800 dark:text-neutral-300
                           dark:focus:border-neutral-500 disabled:dark:border-neutral-700/50 disabled:dark:text-neutral-500"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              />
              <Checkbox
                isSelected={systemPromptEnabled}
                onChange={setSystemPromptEnabled}
                className="absolute bottom-3 right-3 cursor-pointer"
              ></Checkbox>
            </div>

            {hasCapability(model, "vision") && (
              <div className="mt-4">
                <ImageGridList
                  aria-label="Image drop list"
                  items={images}
                  dragAndDropHooks={dragAndDropHooks}
                  renderEmptyState={() =>
                    "This model supports vision. You can drop images here and ask questions about them."
                  }
                  className="max-h-[300px] select-none overflow-y-scroll rounded-xl border border-neutral-300 p-4 text-sm text-neutral-500"
                >
                  {(item) => (
                    <ImageGridListItem
                      id={item.url}
                      key={item.id}
                      textValue={item.name}
                    >
                      <div className="relative">
                        <img
                          className="h-[105px] w-[105px] rounded object-cover"
                          src={item.url}
                          alt={item.name}
                        />
                        <Trash2Icon
                          size="18"
                          className="absolute right-1 top-1 z-10 cursor-pointer rounded bg-black/30 p-0.5 text-white hover:bg-black/70"
                          onClick={() => removeImage(item)}
                        />
                      </div>
                    </ImageGridListItem>
                  )}
                </ImageGridList>
              </div>
            )}

            <div className="flex-1"></div>

            <div className="mb-4 w-full select-none">
              <div className="mt-4">
                <Button
                  variant="secondary"
                  className="w-full gap-2 pt-3"
                  onPressEnd={clearMessages}
                  isDisabled={isGenerating || messages.length == 0}
                >
                  <div className="inline-flex items-center justify-center gap-2">
                    <Trash2Icon className="m-auto" size="16" />
                    Clear conversation
                    <span className="inline-flex items-center justify-center">
                      (
                      <CommandIcon size="14" />
                      <PlusIcon size="14" />
                      <DeleteIcon size="18" />)
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          </aside>
        </div>

        <main
          className={`min-h-[100vh] transform pt-16 font-prose transition-transform duration-0 sm:duration-300
                      ${
                        showSidePanel
                          ? "hidden w-[calc(100%-100vw)] translate-x-[100vw] sm:block sm:w-[calc(100%-320px)] sm:translate-x-[320px]"
                          : "w-full translate-x-0"
                      }
          `}
        >
          <div className="relative m-auto flex h-full flex-col">
            <div
              className="grid select-none grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-4 overflow-y-auto px-8"
              ref={chatAreaRef}
              onWheel={onWheel}
            >
              <div className="group relative h-10 w-10 select-none">
                <Bot
                  className="absolute rounded bg-purple-400 p-[4px] text-white dark:bg-yellow-400 dark:text-yellow-900"
                  size="38"
                />
                {!!messages.length && (
                  <CopyIcon
                    className="absolute hidden cursor-pointer rounded bg-purple-400 p-[4px] text-white active:text-purple-700 group-hover:block dark:bg-yellow-400 dark:text-yellow-900 active:dark:text-black"
                    size="38"
                    onClick={() => copyAllMessagesToClipboard()}
                  />
                )}
              </div>
              <div className="mt-[7px] flex select-none flex-col gap-2 pr-8 font-prose">
                How may I help you?
              </div>
              {messages.map((m, i) => (
                <>
                  {
                    {
                      user: (
                        <div className="group relative h-10 w-10 select-none">
                          <Clipboard
                            className="absolute cursor-pointer rounded bg-blue-400 p-[6px] text-white active:text-blue-700 dark:bg-orange-400 dark:text-orange-900 active:dark:text-black"
                            size="38"
                            key={"icn_clip_" + i}
                            onClick={() => copyMessageToClipboard(m)}
                          />
                          <CircleUserRound
                            className="absolute rounded bg-blue-400 p-[6px] text-white group-hover:hidden dark:bg-orange-400 dark:text-orange-900"
                            size="38"
                            key={"icn_" + i}
                          />
                        </div>
                      ),
                      assistant: (
                        <div className="group relative h-10 w-10 select-none">
                          <Clipboard
                            className="absolute cursor-pointer rounded bg-purple-400 p-[4px] text-white active:text-purple-700 dark:bg-yellow-400 dark:text-yellow-900 active:dark:text-black"
                            size="38"
                            key={"icn_clip" + i}
                            onClick={() => copyMessageToClipboard(m)}
                          />
                          <Bot
                            className="absolute rounded bg-purple-400 p-[4px] text-white group-hover:hidden dark:bg-yellow-400 dark:text-yellow-900"
                            size="38"
                            key={"icn" + i}
                          />
                        </div>
                      ),
                    }[m.role]
                  }
                  <div
                    className={`prose flex select-text flex-col gap-2 pr-8
                               ${m.role === "user" ? "-ml-3 mr-4 rounded-[0.4rem] bg-neutral-100 pl-3 dark:bg-neutral-600" : ""}`}
                  >
                    <MarkdownRenderer
                      theme={currentTheme}
                      content={m.content}
                      key={"md" + i}
                    />
                    {!!m.context?.images?.length && (
                      <div className="grid w-full grid-cols-2 gap-6 px-4 pb-6">
                        {m.role === "user" &&
                          m.context.images.map((img) =>
                            imageCache.get(img.url) ? (
                              <div className="col-span-1">
                                <img
                                  className="h-auto rounded object-cover"
                                  key={"img_" + img.id}
                                  alt={img.name}
                                  src={imageCache.get(img.url)?.url}
                                />
                              </div>
                            ) : (
                              <div className="col-span-1 flex h-14 w-14 items-center justify-center rounded border-2 border-gray-200">
                                <FileQuestionIcon
                                  size="24"
                                  className="text-gray-200"
                                ></FileQuestionIcon>
                              </div>
                            ),
                          )}
                      </div>
                    )}
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
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>

            <div className="flex-1"></div>

            <div className="px-[4vw] pb-3 pt-8 print:hidden">
              <div
                className="flex rounded-xl border-2 border-neutral-500/50 bg-white p-2
                              has-[:focus]:border-neutral-500 dark:bg-neutral-700"
              >
                <TextArea
                  id="prompt"
                  aria-label="prompt"
                  className="w-full select-none resize-none bg-transparent p-2 font-sans text-[0.95rem]
                            text-neutral-600 outline-none placeholder:text-neutral-400 dark:text-white"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDownOnPrompt}
                  autoFocus
                  ref={promptRef}
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
                      className="group bg-black disabled:bg-neutral-500 disabled:hover:bg-neutral-500
                                 disabled:dark:bg-neutral-700"
                      onPress={submit}
                    >
                      <SendHorizonal
                        size="28"
                        className="-rotate-90 font-bold text-white group-disabled:text-neutral-400
                                   group-disabled:dark:text-neutral-600"
                      />
                    </Button>
                    <Tooltip>Send</Tooltip>
                  </TooltipTrigger>
                )}
              </div>

              <div className="mt-3 flex flex-col gap-2 print:hidden">
                <div className="inline-flex w-full select-none justify-center text-xs text-neutral-400 dark:text-neutral-500">
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
