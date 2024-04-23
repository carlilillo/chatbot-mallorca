import { Request, Response } from "express";
import getIntent from "../services/dialogflow";
import { randomUUID } from "crypto";


export default async function dialogFlowApi(req: Request, res: Response) {
    try {
		const body = req.body
		const model = body.model
		
		let sessionId = req.cookies.sessionId
		if (!sessionId) {
			sessionId = randomUUID()
			res.cookie('sessionId', sessionId, {
				sameSite: 'none',
				secure: true
			})
		}


		const { response } = await getIntent(body.input, sessionId)
		

		res.json({response: response[0]})
	} catch (error) {
		console.error(error)
		res.statusCode = 500
		res.json('server error')
	}
}