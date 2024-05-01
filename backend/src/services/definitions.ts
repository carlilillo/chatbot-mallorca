import { Response } from 'express';

export const intentNames = {
  welcome: "Default Welcome Intent",
  laliga: "Laliga",
  laligaNo: "Laliga - no",
  copaDelRey: "Copa del Rey",
  copaDelReyNo: "Copa del Rey - no",
  error: "Default Fallback Intent",
}
  
export enum action {
  SendIntentResponse,
  LaLigaRequest,
  CopaDelReyRequest,
  unknown
}

export interface actionParams {
  res: Response,
  intentAction: action,
  text: string,
  model: string,
  query: string
}

export interface retrievalResponse {
  message: string
}