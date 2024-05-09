import { Response } from 'express';

export const intentNames = {
  welcome: "Default Welcome Intent",
  laliga: "Laliga",
  laligaNo: "Laliga - no",
  copaDelRey: "Copa del Rey",
  copaDelReyNo: "Copa del Rey - no",
  youtubeVideos: "Videos de Youtube",
  error: "Default Fallback Intent",
}
  
export enum action {
  SendIntentResponse,
  LaLigaRequest,
  CopaDelReyRequest,
  youtubeVideos,
  unknown
}

export interface actionParams {
  res: Response,
  intentAction: action,
  text: string,
  model: string,
  query: string
}
