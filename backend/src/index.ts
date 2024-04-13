import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import dialogflow from '@google-cloud/dialogflow';
import { randomUUID } from 'crypto';

dotenv.config();

const sessionClient = new dialogflow.SessionsClient({ apiEndpoint: process.env.API_ENDPOINT });
const sessionId = randomUUID();

const app = express();

app.use(express.json());

app.get('/', (_: Request, res: Response) => {
    res.send('esto es correcto\n');
});

app.get('/example', async (req: Request, res: Response) => {

	try {
		const sessionPath = sessionClient.projectLocationAgentSessionPath(
			process.env.DIALOG_FLOW_PROJECTID!,
			process.env.API_LOCATION!,
			sessionId
		);

		const request = {
			session: sessionPath,
			queryInput: {
			  text: {
				text: 'username',
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

		res.send('aceptado');
	}catch (error) {
		res.statusCode = 500;
		console.error(error);
		res.send('lasdjkflasdjf')
	}
});

app.listen(3000, () => {
    console.log('server connected');
});