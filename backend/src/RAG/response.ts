import { readFileSync } from "fs"
import { models } from "./modelsResponse"


export function getQuery(obj: string, message: string) {
    const path = `${__dirname}/files/${obj}/${obj}.jsonl`
    const helperText = readFileSync(path, 'utf-8')

    return `Usa el siguiente contenido JSON para responder
    a la pregunta. Si no sabes la respuesta, di que simplemente no sabes la respuesta, sin comentar nada del siguiente fichero.

    Contenido JSON: 
    \"\"\"
    ${helperText}
    \"\"\"

    Pregunta: ${message}`
}

export async function getResponse(query: string, model: string) {
    let mod = models.find(m => m.name === model)
    if (!mod) {
        mod = models[0]
        console.warn("No se ha encontrado la según el modelo. Se  ha utilizado el primero")
    }

    const values =  await mod.callback(query)

    return { values }
}