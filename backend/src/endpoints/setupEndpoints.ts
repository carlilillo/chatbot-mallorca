import { Express } from 'express';
import { dialogFlowGetIntent } from './dialogflow';


export default function setupEndpoints(app: Express) {
    app.post('/api/dialogflow', dialogFlowGetIntent)
}