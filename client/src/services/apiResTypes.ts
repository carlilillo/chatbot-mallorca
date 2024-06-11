import { z } from 'zod';

const responsesType = z.enum(["message", "youtube", "team"])

export const dialogFlowResponse = z.object({
    response: z.string(),
    responseType: responsesType,
    sendLastInput: z.boolean().optional()
})

export const youtubeResponseType = z.object({
    videos: z.array(z.object({
        id: z.string(),
        title: z.string(),
        thumbnail: z.string(),
        publishedAt: z.string()
    })),
    query: z.string()
})

export const teamResponseType = z.object({
    datePeriod: z.string(),
    trainers: z.array(z.object({
        picture: z.string(),
        games: z.string(),
        name: z.string(),
    })),
    players: z.array(z.object({
        name: z.string(),
        picture: z.string(),
        gamesPlayed: z.string(),
        position: z.string()
    }))
})
