import dialogflow from '@google-cloud/dialogflow';
import { Response } from 'express';
import { intentNames, action } from './definitions';

const sessionClient = 
  new dialogflow.SessionsClient(
    {
      apiEndpoint: process.env.API_ENDPOINT 
    }
  )


export async function requestIntent(message: string, sessionId: string) {
  // request intent from dialogflow
  const sessionPath = sessionClient.projectLocationAgentSessionPath(
      process.env.DIALOG_FLOW_PROJECTID!,
      process.env.API_LOCATION!,
      sessionId
  )

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'es',
      },
    },
  }

  const intent = await sessionClient.detectIntent(request)

  const intentResponse = intent[0]

  return { intentResponse }
}

async function deleteContext(sessionId: string, context: string) {

  const sessionContext = new dialogflow.ContextsClient(
    {
      apiEndpoint: process.env.API_ENDPOINT
    }
  )

  const name = sessionContext
    .projectLocationAgentEnvironmentUserSessionContextPath(
      process.env.DIALOG_FLOW_PROJECTID!,
      process.env.API_LOCATION!,
      'draft',
      '-',
      sessionId,
      context
    )

  await sessionContext.deleteContext({ name })
}

export async function routeActionFromIntent(
  intentName: string, 
  paramsFields: any, 
  sessionId: string,
): Promise<{intentAction: action}>  {


  const ragIntentsFilter = async (param: string, context: string) => {
    if (intentName === intentNames.laliga) {
      const hadParam = paramsFields[param]["stringValue"]
      if (!hadParam) {
        return {
          intentAction: action.SendIntentResponse,
        }
      }
      await deleteContext(sessionId, context)
    }

    if (intentName === intentNames.laligaNo) {
      return {
        intentAction: action.SendIntentResponse,
      }
    }

    return {
      intentAction: action.LaLigaRequest
    }
  }

  if (intentName?.startsWith(intentNames.laliga)) {
    // it is laliga dialogflow or derivative
    const { intentAction } = await ragIntentsFilter("La-liga", "Laligaglobal-followup")
    return { intentAction }

  } else if (intentName?.startsWith(intentNames.copaDelRey)) {
    const { intentAction } = await ragIntentsFilter("Copa-del-Rey", "CopadelRey-followup")
    return { intentAction }

  } else if (intentName === intentNames.welcome
      || intentName === intentNames.error) {
    return {
      intentAction: action.SendIntentResponse
    }
  }

  return { intentAction: action.unknown }
}


export function setAction(res: Response, intentAction: action, text: string, model: string) {
  if (intentAction === action.SendIntentResponse) {
    res.json({response: text})
  } else if (intentAction === action.LaLigaRequest) {
    res.json({response: "Esta sentencia es de la liga"})
  } else if (intentAction === action.CopaDelReyRequest) {
    res.json({response: "Esta sentencia es de la copa del rey"})
  } else if (intentAction === action.unknown) {
    res.json({
      error: "intent not matched",
      response: "Vuelve a escribir una nueva frase"
    })
  }
}