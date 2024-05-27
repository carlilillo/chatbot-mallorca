import { Response } from 'express';

export const intentNames = {
  welcome: "Default Welcome Intent",
  laliga: "Laliga",
  laligaNo: "Laliga - no",
  copaDelRey: "Copa del Rey",
  copaDelReyNo: "Copa del Rey - no",
  youtubeVideos: "Videos de Youtube",
  team: "Plantillas",
  error: "Default Fallback Intent",
}
  
export enum action {
  SendIntentResponse,
  LaLigaRequest,
  CopaDelReyRequest,
  youtubeVideos,
  team,
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