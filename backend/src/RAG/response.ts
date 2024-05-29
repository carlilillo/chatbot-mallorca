import { readFileSync } from "fs"
import { models } from "./modelsResponse"
import { limitJson } from "../utils/findSeason"


export function getQuery(obj: string, datePeriod?: string) {
    const path = `${__dirname}/files/${obj}/${obj}.jsonl`
    const helperText = readFileSync(path, 'utf-8')

    const query = limitJson(helperText, datePeriod)

    return `Usa el siguiente contenido JSON para responder a la pregunta. Si no sabes la respuesta, comenta exactamente: "No tengo la información suficiente para responder a tu pregunta". Intenta responder con mayor detalle posible.

    Contenido JSON: 
    \"\"\"
    ${query}
    \"\"\"`
}

export async function getResponse(message: string, query: string, model: string) {
    let mod = models.find(m => m.name === model)
    if (!mod) {
        mod = models[0]
        console.warn("No se ha encontrado la según el modelo. Se  ha utilizado el primero")
    }

    const values =  await mod.callback(query, message)

    return { values }
}