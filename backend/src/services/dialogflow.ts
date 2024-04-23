import dialogflow from '@google-cloud/dialogflow';

const sessionClient = 
  new dialogflow.SessionsClient(
    {
      apiEndpoint: process.env.API_ENDPOINT 
    }
  )


export default async function getIntent(message: string, sessionId: string) {
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
            languageCode: 'en',
          },
        },
    }

    const response = await sessionClient.detectIntent(request)

    return { response }
}