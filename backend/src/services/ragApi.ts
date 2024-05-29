import { getQuery, getResponse } from "../RAG/response"

export async function getModelResponse(
    model: string, 
    objective: string, 
    message: string,
    datePeriod?: string
) {
    const query = getQuery(objective, datePeriod)
    const { values } = await getResponse(message, query, model)
    return values
}