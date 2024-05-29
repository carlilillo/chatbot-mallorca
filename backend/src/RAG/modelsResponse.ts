import OpenAI from "openai"
import { GoogleGenerativeAI } from '@google/generative-ai'

const geminiAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const gemini = geminiAi.getGenerativeModel({ model: "gemini-1.5-flash"});
const openai = new OpenAI()

async function openAiResponse(query: string, message: string) {
    const stream = await openai.chat.completions.create({
        messages: [
            { role: "assistant", content: query},
            { role: "user", content: message }
        ],
        model: "gpt-3.5-turbo"
    });

    const values = stream.choices[0].message.content as string

    return values
}

async function geminiResponse(query: string, message: string) {
    const chat = gemini.startChat({
        history: [
            {
                role: "user",
                parts: [{text: query}]
            }
        ]
    })

    const result = await chat.sendMessage(message)
    const response = result.response
    const text = response.text()
    return text
}

export const models = [
    {
        name: 'openai',
        callback: openAiResponse
    },
    {
        name: 'google',
        callback: geminiResponse
    }
]
