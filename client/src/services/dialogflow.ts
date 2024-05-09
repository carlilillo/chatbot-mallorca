import { dialogFlowResponse, youtubeResponseType } from "./apiResTypes"

const responseHandlers = {
    "message": responseIntoHtml,
    "youtube": youtubeIntoHtml
}

function youtubeIntoHtml(response: any) {
    const youtubeResponse = youtubeResponseType.parse(JSON.parse(response))

    const youtubeHtml = youtubeResponse.map(resp => 
        `<a href="https://youtube.com/watch?v=${resp.id}" target="_blank">
            <div>
                <img src="${resp.thumbnail}" alt="Imagen del Mallorca">
                <strong>${resp.title} - (${new Date(resp.publishedAt).toLocaleDateString()})</strong>
            </div>
        </a>`
    ).join('\n')

    const htmlResponse = 
        `<div>
            <p><span>Bot</span><br />
                Aquí tienes los ${youtubeResponse.length} primeros videos obtenidos:
            </p>
        </div>${youtubeHtml}`

    return htmlResponse
}

function responseIntoHtml(response: any) {
    return `<div><p><span>Bot</span><br />${response}</p></div>`
}

export default async function fetchModelResponse(
    input: string, 
    model: string
) {
    const res = await fetch(`http://localhost:3000/api/dialogflow` ,
    {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        credentials: 'include',

        body: JSON.stringify({ input, model })
    })

    const json = dialogFlowResponse.parse(await res.json())

    const response = responseHandlers[json.responseType](json.response)

    return response
}