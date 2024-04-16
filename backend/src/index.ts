import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import getIntent from './services/dialogflow';

const app = express();

app.use(express.json());
app.use(cors({
	origin: 'http://localhost:5173',
}))


app.post('/api/dialogflow', (req: Request, res: Response) => {
	try {
		const body = req.body
		const model = body.model

		getIntent(body.input)

		res.json('send')
	} catch (error) {
		console.error(error)
		res.statusCode = 500
		res.json('server error')
	}
})

app.listen(3000, () => {
    console.log('server connected');
});