import dialogflow from '@google-cloud/dialogflow';

const sessionClient = 
  new dialogflow.SessionsClient(
    {
      apiEndpoint: process.env.API_ENDPOINT 
    }
  )


export async function getIntent(message: string, sessionId: string) {
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

  const response = await sessionClient.detectIntent(request)

  return { response }
}

export async function deleteContext(sessionId: string, context: string) {

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

  const res = await sessionContext.deleteContext({ name })

  console.log(res)
  
}