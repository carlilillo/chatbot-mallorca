import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import setupEndpoints from './endpoints/setupEndpoints';
const cookieParser = require('cookie-parser')

const app = express()

const port = process.env.PORT || 3000
app.use(express.json())
app.use(cookieParser())
app.use(express.static(`${process.cwd()}/dist`));
app.use(cors({
	origin: ['http://localhost:5173', "https://chatmallorca.ltim.uib.es"],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}))

setupEndpoints(app)
app.get("/", (req: Request, res: Response) => {
    res.sendFile(`/index.html`)
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});