import { youtube } from '@googleapis/youtube'
import { getResponse } from '../RAG/response'

const youtubeApi = youtube('v3')

const youtubeQuery = "Dime exactamente y nada más que el texto que debo poner en Youtube para encontrar los videos que dice el usuario. SI NO ENCUENTRAR NINGÚN TEXTO DE BÚSQUEDA, DEJA LA RESPUESTA EN BLANCO PARA PODER BUSCAR TODOS LOS VIDEOS. REPITO, SI NO ENCUENTRAS NINGÚN TEXTO DE BÚSQUEDA EN EL TEXTO DEL USUARIO, RESPONDE EN BLANCO Y ASÍ SE VEN TODOS LOS VIDEOS."

export default async function getYoutubeVideos(message: string = "") {

    const { values } = await getResponse(message, youtubeQuery, "google")
    const query = values.trim()
    console.log(`query: ${query}`)

    const apiKey = process.env.YOUTUBE_API_KEY!
    const youtubeUser = process.env.MALLORCA_YOUTUBE_USER!

    const channel = await youtubeApi.channels.list({
        key: apiKey,
        part: ["snippet", "contentDetails", "statistics"],
        forUsername: youtubeUser
    })

    const youtubeId = channel.data.items![0].id as string

    const searchedRes = await youtubeApi.search.list({
        key: apiKey,
        part: ["snippet"],
        channelId: youtubeId,
        maxResults: 5,
        order: "date",
        q: query,
        regionCode: "ES",
        type: ["video"]
    })

    const result = {
        videos: searchedRes.data.items!.map(item => {
            return {
                id: item.id?.videoId,
                title: item.snippet?.title,
                thumbnail: item.snippet?.thumbnails?.medium?.url,
                publishedAt: item.snippet?.publishedAt
            }
        }),
        query: query
    }

    return result
}