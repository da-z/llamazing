import {useState} from 'react'
import './App.css'
import {Button} from "./rac/Button.tsx";
import ollama from 'ollama'
import {TextArea} from "react-aria-components";
import {TextField} from "./rac/TextField.tsx";
import {ArrowUp} from "lucide-react";


function App() {
    const [prompt, setPrompt] = useState("Why is the sky blue?")
    const [response, setResponse] = useState("")

    const chat = async (message: string) => {
        setResponse("");
        const res = await ollama.chat({
            model: 'dolphin-mistral:2.6-dpo-laser-q6k',
            messages: [{role: 'user', content: message}],
            stream: true
        });
        for await (const part of res) {
            setResponse(prev => prev + part.message.content);
        }
    }


    return (
        <div className="p-20 grid gap-8">
            <h1 className="text-3xl select-none">
                🦙 LLaMazing
            </h1>

            <TextArea className="flex items-center justify-center" name="response" value={response}></TextArea>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-200">
                <div className="flex gap-2 h-12">
                    <TextField className="w-full" value={prompt} onChange={setPrompt}/>
                    <Button className="bg-black hover:cursor-pointer" onPress={() => chat(prompt)}>
                        <ArrowUp className="h-4 w-4 text-white"/>
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default App
