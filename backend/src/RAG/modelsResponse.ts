import OpenAI from "openai"
import { GoogleGenerativeAI } from '@google/generative-ai'

const geminiAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const gemini = geminiAi.getGenerativeModel({ model: "gemini-1.5-flash"});
const openai = new OpenAI()

async function llamaChatResponse(query: string) {
    const llamaUrl = process.env.LLAMACHAT_URL!
    /*const result = await fetch(llamaUrl, {
        method: "POST",
        body: JSON.stringify({
            model: "llama2",
            prompt: query,
            stream: false
        })
    })

    const resultJson = await result.json()
    const values = resultJson.response*/

    return "llama chat"
}


async function openAiResponse(query: string) {
    const stream = await openai.chat.completions.create({
        messages: [{ role: "user", content: query }],
        model: "gpt-3.5-turbo"
    });

    const values = stream.choices[0].message.content as string

    return values
}

async function geminiResponse(query: string) {
    const result = await gemini.generateContent(query)
    const response = result.response
    const text = response.text()
    return text
}

export const models = [
    {
        name: 'openai',
        callback: openAiResponse
    },
    /*{
        name: 'meta',
        callback: llamaChatResponse
    },*/
    {
        name: 'google',
        callback: geminiResponse
    }
]
