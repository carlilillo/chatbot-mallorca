import dialogflow from '@google-cloud/dialogflow';
import { intentNames, action, actionParams } from './definitions';
import { getModelResponse } from './ragApi';

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


  const ragIntentsFilter = 
  async (param: string, 
    context: string, 
    intentNameToFilter: string, 
    negativeIntentName: string, 
    requestAction:action) => {

    if (intentName === intentNameToFilter) {
      const hadParam = paramsFields[param]["stringValue"]
      if (!hadParam) {
        return {
          intentAction: action.SendIntentResponse,
        }
      }
      await deleteContext(sessionId, context)
    }

    if (intentName === negativeIntentName) {
      return {
        intentAction: action.SendIntentResponse,
      }
    }

    return {
      intentAction: requestAction
    }
  }

  if (intentName?.startsWith(intentNames.laliga)) {
    // it is laliga dialogflow or derivative intent
    const { intentAction } = await ragIntentsFilter(
      "La-liga", 
      "Laligaglobal-followup", 
      intentNames.laliga, 
      intentNames.laligaNo, 
      action.LaLigaRequest
    )

    return { intentAction }

  } else if (intentName?.startsWith(intentNames.copaDelRey)) {
    // it is copa del rey dialogflow or derivative intent
    const { intentAction } = await ragIntentsFilter(
      "Copa-del-Rey", 
      "CopadelRey-followup", 
      intentNames.copaDelRey, 
      intentNames.copaDelReyNo, 
      action.CopaDelReyRequest
    )

    return { intentAction }

  } else if (intentName === intentNames.welcome
      || intentName === intentNames.error) {
    return {
      // dialogflow default intents
      intentAction: action.SendIntentResponse
    }
  }

  return { intentAction: action.unknown }
}

export async function setAction(
  { res, 
    intentAction, 
    text, 
    model, 
    query }: actionParams) {

  if (intentAction === action.SendIntentResponse) {

    res.json({response: [text]})

  } else if (intentAction === action.LaLigaRequest) {

    const values = await getModelResponse(model, 'laliga', query)
    res.json({response: values})

  } else if (intentAction === action.CopaDelReyRequest) {

    const values = await getModelResponse(model, 'copa-del-rey', query)
    res.json({response: values})

  } else if (intentAction === action.unknown) {

    res.json({
      error: "intent not matched",
      response: ["Vuelve a escribir una nueva frase"]
    })

  }
}