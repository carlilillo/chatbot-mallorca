import { concatenateDatePeriods, getRange } from "../utils/datePeriod"
import { deleteContext, requestIntent } from "./dialogflow"


export async function getDatePeriodToCopa(queryToModel: string) {
    const { intentResponse } = await requestIntent(queryToModel, "0")
    await deleteContext("0", "CopadelRey-followup")
    const paramsFields = intentResponse.queryResult?.parameters?.fields!
    const date = paramsFields['date-period']

    if (date.structValue) {
      const datePeriodToString = concatenateDatePeriods(date)

      const { datePeriod } = getRange(datePeriodToString)
      return { datePeriod }
    }

    return { datePeriod: undefined}
}