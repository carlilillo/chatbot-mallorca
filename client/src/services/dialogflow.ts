import { dialogFlowResponse, teamResponseType, youtubeResponseType } from "./apiResTypes"
import { botIcon } from "./icons"

let setInput = {
    sendLastInput: false,
    input: ""
}

function youtubeIntoHtml(response: any) {
    const youtubeResponse = youtubeResponseType.parse(JSON.parse(response))

    if (youtubeResponse.videos.length === 0) {
        return `
        <div class="bot-message">${botIcon()}
            <p><span>Bot</span><br />No se han podido encontrar videos de Youtube del Mallorca según tu búsqueda.</p>
        </div>`
    }

    const youtubeHtml = youtubeResponse.videos.map(resp => 
        `<a href="https://youtube.com/watch?v=${resp.id}" target="_blank">
            <div>
                <img src="${resp.thumbnail}" alt="Imagen del Mallorca">
                <strong>${resp.title} - (${new Date(resp.publishedAt).toLocaleDateString()})</strong>
            </div>
        </a>`
    ).join('\n')

    const lengthMessage = youtubeResponse.videos.length == 1
        ? "un video de Youtube obtenido"
        : `los primeros ${youtubeResponse.videos.length} videos de Youtube obtenidos`

    const isFromQueryText = youtubeResponse.query
        ? `sobre "${youtubeResponse.query}"`
        : ""

    const htmlResponse = 
        `<div class="bot-message">${botIcon()}
            <p><span>Bot</span><br />
                Aquí tienes ${lengthMessage} ${isFromQueryText}:
            </p>
        </div>${youtubeHtml}`

    return htmlResponse
}

function responseIntoHtml(response: any) {
    return `<div class="bot-message">${botIcon()}<p><span>Bot</span><br />${response}</p></div>`
}

function teamIntoHtml(response: any) {
    const teamResponse = teamResponseType.parse(JSON.parse(response))
    const htmlTrainers = teamResponse.trainers.map(trainer => 
        `<div class="trainer">
            <img class="trainer-image" src="${trainer.picture}" alt="Imágen de ${trainer.name}"/>
            <p><strong>${trainer.name}</strong> ${trainer.games}</p>
        </div>`
    ).join('')

    const htmlPlayers = teamResponse.players.map(player => 
        `<div class="trainer">
            <img class="trainer-image" src="${player.picture}" alt="Imágen de ${player.name}"/>
            <p><strong>${player.name}</strong> ${player.position} ${player.gamesPlayed}</p>
        </div>`
    ).join('')

    return `<div class="bot-message">${botIcon()}
                <div><p><span>Bot</span><br />
                La plantilla de la temporada ${teamResponse.datePeriod} es la siguiente:<br /><br />
                <strong class="plantilla-title">- Entrenadores:</strong> <div class="trainers">${htmlTrainers}</div> 
                <strong class="plantilla-title">- Jugadores:</strong> <div class="players">${htmlPlayers}</div>
                </p></div>
            </div>`
}

const responseHandlers = {
    "message": responseIntoHtml,
    "youtube": youtubeIntoHtml,
    "team": teamIntoHtml
}

export default async function fetchModelResponse(
    input: string, 
    model: string
) {

    const body: body = { input, model }
    if (setInput.sendLastInput) {
        body.lastInput = setInput.input
        setInput.sendLastInput = false
    }

    const url = import.meta.env.VITE_BACKEND_ENDPOINT_PRE!

    const res = await fetch(`${url}/api/dialogflow` ,
    {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        credentials: 'include',

        body: JSON.stringify(body)
    })

    const json = dialogFlowResponse.parse(await res.json())

    if (json.sendLastInput) {
        setInput = {
            sendLastInput: true,
            input
        }
    }

    const response = responseHandlers[json.responseType](json.response)

    return response
}