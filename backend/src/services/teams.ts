import { existsSync, readFileSync } from "fs"
import { team } from "./definitions"

function getPath(date: string) {
    // example: convert "2019-01-01/2020-12-31" to "2019-20"
    const response = date.split('/').map(datePeriod => datePeriod.slice(0, 4))

    const datePeriod = date 
        ? `${response[0]}-${response[1].slice(-2)}`
        : "2023-24"

    const path = `${__dirname}/plantillas/plantilla${datePeriod}.jsonl`
    return { path }
}

export default function getTeam(date: string) {
    const { path } = getPath(date)

    if (!existsSync(path)) {
        return {
            response: "No se pueden obtener el fichero de ese año en específicio.",
            responseType: "message"
        }
    }
    
    const fileContent = readFileSync(path, 'utf-8')
    const jsonContent = JSON.parse(fileContent) as team
    const trainers = jsonContent.Entrenadores.map(trainer => {
        return {
            name: trainer.Nombre,
            games: trainer.Jornadas ? `Jornadas: ${trainer.Jornadas}` : "",
            picture: trainer.Foto ? trainer.Foto : "https://s.hs-data.com/bilder/spieler/gross/517809.jpg?fallback=png"
        }
    })

    const players = jsonContent.Jugadores.map(player => {
        return {
            name: player.Nombre,
            picture: player.Foto ? player.Foto : "https://s.hs-data.com/bilder/spieler/gross/517809.jpg?fallback=png",
            gamesPlayed: player['Partidos Jugados'] ? `${player['Partidos Jugados']} partidos` : "",
            position: player['Posición'] ? `(${player['Posición']})` : "",
        }
    })

    const result = {
        response: JSON.stringify({ trainers, players }),
        responseType: "team"
    }
    
    return result
}