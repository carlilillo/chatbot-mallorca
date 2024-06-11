import dialogflow from '@google-cloud/dialogflow';
import { intentNames, action, actionParams, fields } from '../definitions';
import { getModelResponse } from './ragApi';
import getYoutubeVideos from './youtube';
import getTeam from './teams';
import { getRange } from '../utils/datePeriod';
import { getDatePeriodToCopa } from './getTimeFromCopaDelRey';

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

export async function deleteContext(sessionId: string, context: string) {

  const sessionContext = new dialogflow.ContextsClient(
    {
      apiEndpoint: process.env.API_ENDPOINT
    }
  )

  const name = sessionContext.projectLocationAgentEnvironmentUserSessionContextPath(
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
): Promise<{intentAction: action, sendLastResponse?: boolean}>  {


  const ragIntentsFilter = 
  async (
    param: string, 
    context: string, 
    intentNameToFilter: string, 
    negativeIntentName: string, 
    requestAction:action
    ) => {

    if (intentName === intentNameToFilter) {
      const hadParam = paramsFields[param]["stringValue"]
      if (!hadParam) {
        return {
          intentAction: action.SendIntentResponse,
          sendLastResponse: true
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
    const { intentAction, sendLastResponse } = await ragIntentsFilter(
      "La-liga", 
      "Laligaglobal-followup", 
      intentNames.laliga, 
      intentNames.laligaNo, 
      action.LaLigaRequest
    )

    return { intentAction, sendLastResponse }

  } else if (intentName?.startsWith(intentNames.copaDelRey)) {
    // it is copa del rey dialogflow or derivative intent
    const { intentAction, sendLastResponse } = await ragIntentsFilter(
      "Copa-del-Rey", 
      "CopadelRey-followup", 
      intentNames.copaDelRey, 
      intentNames.copaDelReyNo, 
      action.CopaDelReyRequest
    )

    return { intentAction, sendLastResponse }

  } else if (intentName === intentNames.youtubeVideos) {
    // it is youtube videos fetch intent

    return { intentAction: action.youtubeVideos }

  } else if (intentName === intentNames.team) {

    return { intentAction: action.team }
    
  } else if (intentName === intentNames.games) {

    return { intentAction: action.games }

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
    queryToModel,
    sendLastResponse }: actionParams) {

  if (intentAction === action.SendIntentResponse) {

    res.json({
      response: text,
      responseType: "message",
      sendLastInput: sendLastResponse ?? false
    })

  } else if (intentAction === action.LaLigaRequest) {

    const values = await getModelResponse(model, 'laliga', queryToModel)
    res.json({
      response: values, 
      responseType: "message"
    })

  } else if (intentAction === action.CopaDelReyRequest) {
    const { datePeriod } = await getDatePeriodToCopa(queryToModel)
    const objective = datePeriod
      ? 'copa-del-rey-completo'
      : 'copa-del-rey'
    
    const values = await getModelResponse(model, objective, queryToModel, datePeriod)
    res.json({
      response: values,
      responseType: "message"
    })

  } else if (intentAction === action.youtubeVideos) {
    const values = await getYoutubeVideos(queryToModel)
    res.json({
      response: JSON.stringify(values),
      responseType: "youtube"
    })

  } else if (intentAction === action.team) {
    const result = getTeam(text)
    res.json(result)

  } else if (intentAction === action.games) {

    const { datePeriod } = getRange(text)
    const values = await getModelResponse(model, 'partidos', queryToModel, datePeriod)
    res.json({
      response: values,
      responseType: "message"
    })

  } else if (intentAction === action.unknown) {

    res.json({
      responseType: "message",
      response: "Ha habido un error y no he podido entenderte. Vuelve a escribir una nueva frase, por favor"
    })

  }
}