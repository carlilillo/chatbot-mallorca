import { Response } from 'express';

export const intentNames = {
  welcome: "Default Welcome Intent",
  laliga: "Laliga",
  laligaNo: "Laliga - no",
  copaDelRey: "Copa del Rey",
  copaDelReyNo: "Copa del Rey - no",
  youtubeVideos: "Videos de Youtube",
  team: "Plantillas",
  games: "Partidos",
  error: "Default Fallback Intent",
}
  
export enum action {
  SendIntentResponse,
  LaLigaRequest,
  CopaDelReyRequest,
  youtubeVideos,
  team,
  games,
  unknown
}

export interface actionParams {
  res: Response,
  intentAction: action,
  text: string,
  model: string,
  queryToModel: string,
  sendLastResponse: boolean | undefined
}

type trainerInterface = {
  Nombre: string
  Jornadas: string
  Foto: string
}
type playerInterface = {
  Nombre: string
  Foto: string
  "Partidos Jugados": string
  "Posición": string
}

export type team = {
  Entrenadores: trainerInterface[], 
  Jugadores: playerInterface[]
}

export type games =  {
  "Temporada": string,
  "Equipo": string,
  "Partidos": {
      "Ronda/Jornada":string,
      "Equipo Local":string,
      "Equipo Visitante":string,
      "Goles Locales":string,
      "Goles Visitante":string,
      "Resultado":string,
      "Campo":string,
      "Fecha":string,
      "Árbitro":string,
      "Detalles Goles Locales":string,
      "Detalles Goles Visitante":string,
      "Division":string,
      "Competicion":string,
      "Información adicional"?: string
  }[]
}[]

export type fields = {
  fields: {
    endDate: {
      stringValue: string
      kind: string
    },
    startDate: {
      stringValue: string
      kind: string
    }
  }
}