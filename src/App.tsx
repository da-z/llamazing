import React, { KeyboardEvent, useEffect, useState } from "react";
import "./App.css";
import { Button } from "./rac/Button.tsx";
import ollama, { Message } from "ollama";
import { Bot, Globe, SendHorizonal, User } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer.tsx";
import { TextArea } from "react-aria-components";
import { TextField } from "./rac/TextField.tsx";

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
      { role: "system", content: systemPrompt },
      ...messages,
      { role: "user", content: message },
    ];

    setMessages((prev) => [...prev, { role: "user", content: message }]);

    const res = await ollama.chat({
      model,
      messages: newMessages,
      stream: true,
      options: {
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
    <div className="relative flex min-h-svh flex-col gap-2 bg-neutral-600 px-10 pt-14 font-sans text-white">
      <h1 className="flex select-none items-center gap-2 text-3xl">
        <Bot size="32" /> LLaMazing
      </h1>

      <div className="absolute right-4 top-4">
        {/*todo: add selector*/}
        <span className="select-none text-sm text-gray-200/20">{model}</span>
      </div>

      <div className="mt-4 grid h-full grid-cols-[auto_minmax(0,_1fr)] gap-4 overflow-y-auto pb-20">
        <>
          <Globe
            className="mt-0.5 rounded bg-blue-400 p-[6px] text-white"
            size="30"
          />
          <TextArea
            id="system-prompt"
            aria-label="system-prompt"
            className="rounded-xl border-2 border-gray-400/40 bg-gray-800 p-2 text-gray-200 outline-none"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          />
        </>
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
            <div className="mt-[3px] flex flex-col gap-2">
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
            <div className="mt-[3px] flex flex-col gap-2">
              <MarkdownRenderer content={response} />
            </div>
          </>
        ) : (
          ""
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-neutral-50 p-2">
        <div className="flex h-10 gap-2">
          <TextField
            id="prompt"
            aria-label="prompt"
            className="w-full"
            value={prompt}
            onChange={setPrompt}
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
  );
}

export default App;
