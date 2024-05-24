import { youtube } from '@googleapis/youtube'

const youtubeApi = youtube('v3')


export default async function getYoutubeVideos(query: string = "") {
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

    const result = searchedRes.data.items!.map(item => {
        return {
            id: item.id?.videoId,
            title: item.snippet?.title,
            thumbnail: item.snippet?.thumbnails?.medium?.url,
            publishedAt: item.snippet?.publishedAt
        }
    })

    return result
}
