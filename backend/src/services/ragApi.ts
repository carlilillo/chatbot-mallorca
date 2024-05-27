import { getQuery, getResponse } from "../RAG/response"

export async function getModelResponse(
    model: string, 
    objective: string, 
    message: string
) {
    const query = getQuery(objective)
    const { values } = await getResponse(message, query, model)
    return values
}