import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import setupEndpoints from './endpoints/setupEndpoints';
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
	origin: 'http://localhost:5173',
    allowedHeaders: ['Content-Type'],
    credentials: true,
}))

setupEndpoints(app)

app.listen(3000, () => {
    console.log('server connected');
});