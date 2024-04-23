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
			res.cookie(
				'sessionId',
				sessionId, 
				{
					sameSite: 'none',
					secure: true
				}
			)
		}


		const { response } = await getIntent(body.input, sessionId)
		const firstResponse = response[0]

		if (
			!firstResponse.queryResult?.allRequiredParamsPresent
			|| firstResponse.queryResult.intent?.displayName === "Default Fallback Intent"
		) {
			res.json({
				parameteresRequired: false,
				fulfillmentText: firstResponse.queryResult?.fulfillmentText,
				allResponse: firstResponse
			})
		} else {
			res.json({
				parameteresRequired: true,
				fulfillmentText: "tu respuesta ha sido correctamente validada",
				allResponse: firstResponse
			})
		}
		

		res.end()
	} catch (error) {
		console.error(error)
		res.statusCode = 500
		res.json('server error')
	}
}