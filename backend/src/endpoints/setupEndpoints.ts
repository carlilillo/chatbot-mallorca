import { Express } from 'express';
import dialogFlowApi from './dialogflow';


export default function setupEndpoints(app: Express) {
    app.post('/api/dialogflow', dialogFlowApi)
    //TODO: api para llama chat
    //app.post('/api/meta/dialogflow', dialogFlowApi)
}