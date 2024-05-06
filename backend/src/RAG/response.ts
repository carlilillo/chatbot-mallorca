import { readFileSync } from "fs"
import OpenAI from "openai"

const openai = new OpenAI()


export function getQuery(obj: string, message: string) {
    const path = `${__dirname}/files/${obj}/${obj}.jsonl`
    const helperText = readFileSync(path, 'utf-8')

    return `Usa el siguiente contenido JSON para responder
    a la pregunta. Si la respuesta no se puede encontrar, entonces escribe 
    que no sabes la respuesta. Intenta decorar un poco la respuesta para 
    que la respuesta no sea tan corta.

    Contenido JSON: 
    \"\"\"
    ${helperText}
    \"\"\"

    Pregunta: ${message}`
}

export async function getResponse(query: string) {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: query }],
        model: "gpt-3.5-turbo"
      });
    
      return completion.choices[0].message.content
}