import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { routeActionFromIntent, requestIntent, setAction } from "../services/dialogflow";

function getCurrentSession(req: Request, res: Response) {
	let sessionId = req.cookies.sessionId as string
	if (!sessionId) {
		sessionId = randomUUID()
		// set a cookie to persist user
		res.cookie(
			'sessionId',
			sessionId, 
			{
				sameSite: 'none',
				secure: true
			}
		)
	}

	return { sessionId }
}

export async function dialogFlowGetIntent(req: Request, res: Response) {
    try {
		const body = req.body
		const model = body.model
		const input = body.input
		const lastInput = body.lastInput

		const { sessionId } = getCurrentSession(req, res)
		
		
		const { intentResponse } = await requestIntent(input, sessionId)

		const intentName = intentResponse.queryResult?.intent?.displayName!
  		const paramsFields = intentResponse.queryResult?.parameters?.fields!
  		const text = intentResponse.queryResult?.fulfillmentText!
		const query = intentResponse.queryResult?.queryText!
		
		const { intentAction, sendLastResponse } = await routeActionFromIntent(
			intentName,  paramsFields, sessionId
		)

		const queryToModel = lastInput ?? query
		await setAction({ res, intentAction, text, model, queryToModel, sendLastResponse })
		res.end()
	} catch (error) {
		console.error(error)
		res.statusCode = 500
		res.json('server error')
	}
}