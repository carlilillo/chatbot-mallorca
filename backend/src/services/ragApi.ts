import { retrievalResponse } from "./definitions"

export default async function getModelRetrieval(
    model: string, 
    objective: string, 
    message: string
) {
    const res = await fetch(`http://localhost:8000/api/${model}/${objective}`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    })

    const result = await res.json() as retrievalResponse
    return result.message
}