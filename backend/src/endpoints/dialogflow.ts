import { Request, Response } from "express";
import { deleteContext, getIntent } from "../services/dialogflow";
import { randomUUID } from "crypto";

export async function dialogFlowGetIntent(req: Request, res: Response) {
	const getCurrentSession = (req: Request, res: Response) => {
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

	const filterIntentFromDialogflow = async (sessionId: string, input: string) => {
		const { response } = await getIntent(input, sessionId)
		const firstResponse = response[0]

		const intentName = firstResponse.queryResult?.intent?.displayName
		if (intentName?.startsWith("Laliga")) {
			// it is laliga dialogflow or derivative

			if (intentName === "Laliga") {
				const laligaParam = firstResponse.queryResult?.parameters?.fields!["La-liga"]["stringValue"]
				if (!laligaParam) {
					res.json({
						parameteresRequired: false,
						fulfillmentText: firstResponse.queryResult?.fulfillmentText,
						allResponse: firstResponse
					})
					return
				}
			}

			await deleteContext(sessionId, 'Laligaglobal-followup')
		}

		res.json({
			parameteresRequired: true,
			fulfillmentText: firstResponse.queryResult?.fulfillmentText,
			allResponse: firstResponse
		})
	}

    try {
		const body = req.body
		const model = body.model
		const input = body.input
		
		const { sessionId } = getCurrentSession(req, res)
		
		await filterIntentFromDialogflow(sessionId, input)

		res.end()
	} catch (error) {
		console.error(error)
		res.statusCode = 500
		res.json('server error')
	}
}