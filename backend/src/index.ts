import express, { Request, Response } from 'express';
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

const app = express();

app.use(express.json());

app.get('/', (_: Request, res: Response) => {
    res.send('esto es correcto\n');
});

app.post('/webhook', ((req: Request, res: Response) => {
    const agent = new WebhookClient({ request: req, response:res });
    console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
   
    function welcome(agent: any) {
      agent.add(`Welcome to my agent!`);
    }
   
    function fallback(agent: any) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }

    const test = (agent: any) => {
        agent.add('testing approved');
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('Test', test);
    agent.handleRequest(intentMap);
}));

app.listen(3000, () => {
    console.log('server connected');
});