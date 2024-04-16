import dialogflow from '@google-cloud/dialogflow';
import { randomUUID } from 'crypto';

const sessionClient = new dialogflow.SessionsClient({ apiEndpoint: process.env.API_ENDPOINT });
const sessionId = randomUUID();


export default async function getIntent(message: string) {
    const sessionPath = sessionClient.projectLocationAgentSessionPath(
        process.env.DIALOG_FLOW_PROJECTID!,
        process.env.API_LOCATION!,
        sessionId
    );

    const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode: 'en',
          },
        },
    };

    const response = await sessionClient.detectIntent(request);

    console.log('parameters: ')
    console.log(response[0].queryResult?.parameters);
    console.log('fulfillment text')
    console.log(response[0].queryResult?.fulfillmentText);
    console.log('outputContexts')
    console.log(response[0].queryResult?.outputContexts);
    console.log('intent')
    console.log(response[0].queryResult?.intent);

}