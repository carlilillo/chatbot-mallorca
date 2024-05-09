import { z } from 'zod';

const responsesType = z.enum(["message", "youtube"])

export const dialogFlowResponse = z.object({
    response: z.string(),
    responseType: responsesType
})

export const youtubeResponseType = z.array(z.object({
    id: z.string(),
    title: z.string(),
    thumbnail: z.string(),
    publishedAt: z.string()
}))