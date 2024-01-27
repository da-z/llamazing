import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "./rac/Button.tsx";
import ollama from "ollama";
import { TextField } from "./rac/TextField.tsx";
import { Bot, Globe, SendHorizonal, User } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer.tsx";

const system_prompt = `You are a helpful AI assistant trained on a vast
   amount of human knowledge. Answer as concisely as possible.`;

function App() {
  const [prompt, setPrompt] = useState("Why is the sky blue?");
  const [response, setResponse] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: system_prompt },
  ]);

  useEffect(() => {
    (async () => {
      const availableModels = (await ollama.list()).models.map((m) => m.name);
      setModels(availableModels);
      setModel(availableModels[0]);
    })();
  }, []);

  const chat = async (message: string) => {
    const newMessages = [...messages, { role: "user", content: message }];

    setMessages((prev) => [...prev, { role: "user", content: message }]);

    const res = await ollama.chat({
      model,
      messages: newMessages,
      stream: true,
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
    <div className="relative flex min-h-svh flex-col gap-2 bg-neutral-600 p-10 font-sans text-white">
      <h1 className="flex select-none items-center gap-2 text-3xl">
        <Bot size="32" /> LLaMazing
      </h1>

      <div className="absolute right-4 top-4">
        {/*todo: add selector*/}
        <span className="select-none text-sm text-gray-200/20">{model}</span>
      </div>

      <div className="mt-4 grid h-full grid-cols-[auto_minmax(0,_1fr)] gap-2 overflow-y-auto pb-10">
        {messages.map((m, i) => (
          <>
            {
              {
                system: <Globe size="24" />,
                user: <User size="24" />,
                assistant: <Bot size="24" />,
              }[m.role]
            }
            <div>
              <MarkdownRenderer content={m.content} />
            </div>
          </>
        ))}
        {response ? (
          <>
            <Bot size="24" />
            <div>
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
            autoFocus="true"
          ></TextField>
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
