import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "./rac/Button.tsx";
import ollama from "ollama";
import { TextField } from "./rac/TextField.tsx";
import { Bot, SendHorizonal } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer.tsx";

const system_prompt = `You are a helpful AI assistant trained on a vast
   amount of human knowledge. Answer as concisely as possible.`;

function App() {
  const [prompt, setPrompt] = useState("Why is the sky blue?");
  const [response, setResponse] = useState("");
  const [model, setModel] = useState("dolphin-mistral:2.6-dpo-laser-q6k");
  const [messages, setMessages] = useState([
    { role: "system", content: system_prompt },
  ]);

  useEffect(() => {
    (async () => {
      setModel((await ollama.list()).models[0].name); // todo: use a selector
    })();
  }, []);

  const chat = async (message: string) => {
    const newMessages = [...messages, { role: "user", content: message }];

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

    setMessages([
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: resp },
    ]);
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
    <div className="flex min-h-screen flex-col gap-2 bg-neutral-600 p-10 font-sans text-white">
      <h1 className="mb-4 flex select-none items-center gap-2 text-3xl">
        <Bot size="32" /> LLaMazing
      </h1>

      <div className="flex h-full flex-1 flex-col gap-2 overflow-y-auto pb-16">
        <MarkdownRenderer content={response} />
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
