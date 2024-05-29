import { games } from "../definitions"

export function limitJson(helperText: string, datePeriod?: string) {

    if (!datePeriod) return helperText

    const json = JSON.parse(helperText) as games
    
    const game = json.find(game => game.Temporada === datePeriod)

    return JSON.stringify(game)
}