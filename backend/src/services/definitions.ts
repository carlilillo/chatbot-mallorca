export const intentNames = {
  welcome: "Default Welcome Intent",
  laliga: "Laliga",
  laligaNo: "Laliga - no",
  copaDelRey: "Copa del Rey",
  error: "Default Fallback Intent",
}
  
export enum action {
  SendIntentResponse,
  LaLigaRequest,
  CopaDelReyRequest,
  unknown
}