import { getQuery, getResponse } from "../RAG/response"

export async function getModelResponse(
    model: string, 
    objective: string, 
    message: string
) {
    const query = getQuery(objective, message)
    const { values } = await getResponse(query, model)
    return values
}