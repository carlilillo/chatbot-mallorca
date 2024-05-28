import { existsSync, readFileSync } from "fs"
import { team } from "./definitions"
import { getRange } from "./datePeriod"

function getPath(datePeriod: string) {
    const path = `${__dirname}/plantillas/plantilla${datePeriod}.jsonl`
    return { path }
}

export default function getTeam(date: string) {
    const { datePeriod } = getRange(date)
    const { path } = getPath(datePeriod)

    if (!existsSync(path)) {
        return {
            response: "No se pueden obtener el fichero de ese año en específicio.",
            responseType: "message"
        }
    }
    
    const fileContent = readFileSync(path, 'utf-8')
    const jsonContent = JSON.parse(fileContent) as team
    const trainers = jsonContent.Entrenadores.map(trainer => {
        const games = trainer.Jornadas ? `Jornadas: ${trainer.Jornadas}` : ""
        const picture = trainer.Foto 
            ? trainer.Foto 
            : "https://s.hs-data.com/bilder/spieler/gross/517809.jpg?fallback=png"

        return {
            name: trainer.Nombre,
            games: games,
            picture: picture
        }
    })

    const players = jsonContent.Jugadores.map(player => {
        const picture = player.Foto 
            ? player.Foto 
            : "https://s.hs-data.com/bilder/spieler/gross/517809.jpg?fallback=png"

        const gamesPlayed = player['Partidos Jugados'] 
            ? `${player['Partidos Jugados']} partidos` 
            : ""

        const position = player['Posición'] ? `(${player['Posición']})` : ""

        return {
            name: player.Nombre,
            picture: picture,
            gamesPlayed: gamesPlayed,
            position: position,
        }
    })

    const result = {
        response: JSON.stringify({ datePeriod, trainers, players }),
        responseType: "team"
    }
    
    return result
}