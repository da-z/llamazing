import React, { KeyboardEvent, useEffect, useState } from "react";
import "./App.css";
import { Button } from "./rac/Button.tsx";
import ollama, { Message } from "ollama";
import { Bot, Globe, SendHorizonal, User } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer.tsx";
import { TextArea } from "react-aria-components";
import { Input, Label } from "./rac/Field.tsx";

const super_prompt =
  "Always format your responses in Markdown format, unless requested otherwise";

function App() {
  const [prompt, setPrompt] = useState(``);
  const [systemPrompt, setSystemPrompt] = useState(
    `You are a helpful AI assistant trained on a vast amount of human knowledge. Answer as concisely as possible.`,
  );
  const [response, setResponse] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    (async () => {
      const availableModels = (await ollama.list()).models.map((m) => m.name);
      setModels(availableModels);
      setModel(availableModels[0]);
    })();
  }, []);

  const chat = async (message: string) => {
    const newMessages = [
      { role: "system", content: systemPrompt + "\n\n" + super_prompt },
      ...messages,
      { role: "user", content: message },
    ];

    setMessages((prev) => [...prev, { role: "user", content: message }]);

    const res = await ollama.chat({
      model,
      messages: newMessages,
      stream: true,
      options: {
        stop: ["<|im_start|>", "<|im_end|>", "<s>", "</s>"],
        // temperature: 0.5,
        // num_ctx: 2048,
      },
    });

    let resp = "";
    for await (const part of res) {
      resp += part.message.content;
      setResponse(resp);
    }
    setResponse("");

    setMessages((prev) => [...prev, { role: "assistant", content: resp }]);
  };

  const submit = async () => {
    if (prompt) {
      setPrompt("");
      await chat(prompt);
    }
  };

  const handleKeyUp = async (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await submit();
    }
  };

  return (
    <div className="flex h-screen bg-neutral-800 font-sans text-white">
      <aside className="relative hidden h-screen w-0 flex-col p-4 py-2 md:flex md:w-[300px]">
        <h1 className="mx-auto mt-4 flex gap-2 text-3xl">
          <Bot size="32" /> LLaMazing
        </h1>

        <div className="mb-2 mt-8 flex select-none items-center gap-2">
          <Globe
            className="mt-0.5 rounded bg-blue-400 p-[6px] text-white"
            size="30"
          />
          <Label className="">System Prompt:</Label>
        </div>
        <TextArea
          id="system-prompt"
          aria-label="system-prompt"
          className="mt-2 h-32 rounded-xl border-2 border-gray-400/40 bg-neutral-800 p-4 text-sm text-neutral-200 outline-none focus:border-gray-400"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />

        <div className="absolute bottom-0 left-0">
          {/*todo: add selector*/}
          <div className="inline-flex w-full select-none p-4 text-sm text-gray-200/20">
            {model}
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <div className="relative m-auto flex h-full flex-col gap-2 bg-neutral-700 px-10 pb-32 pt-20">
          <div className="mt-4 grid grid-cols-[auto_minmax(0,_1fr)] gap-4 overflow-y-auto">
            {messages.map((m) => (
              <>
                {
                  {
                    user: (
                      <User
                        className="rounded bg-orange-400 p-[6px] text-white"
                        size="30"
                        strokeWidth="2pt"
                      />
                    ),
                    assistant: (
                      <Bot
                        className="rounded bg-yellow-400 p-[4px] text-white"
                        size="30"
                      />
                    ),
                  }[m.role]
                }
                <div className="prose mt-[3px] flex flex-col gap-2 pr-8">
                  <MarkdownRenderer content={m.content} />
                </div>
              </>
            ))}
            {response ? (
              <>
                <Bot
                  className="rounded bg-yellow-400 p-[4px] text-white"
                  size="30"
                />
                <div className="prose mt-[3px] flex flex-col gap-2 pr-8">
                  <MarkdownRenderer content={response} />
                </div>
              </>
            ) : (
              ""
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-14 py-8">
            <div className="flex rounded-xl border-2 border-neutral-500/50 p-2 has-[:focus]:border-neutral-200">
              <Input
                id="prompt"
                aria-label="prompt"
                className="w-full bg-transparent text-white"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyUp={handleKeyUp}
                autoFocus
                placeholder="Your message here..."
              />
              <Button
                isDisabled={!prompt}
                className={`px-3 ${prompt ? "bg-black hover:cursor-pointer hover:bg-gray-700" : "bg-gray-500 hover:bg-gray-500"}`}
                onPress={submit}
              >
                <SendHorizonal
                  className={`h-4 w-4 -rotate-90 font-bold  ${prompt ? "text-white" : "text-gray-400"}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
