import { google } from "@google-cloud/dialogflow/build/protos/protos"
import { fields } from "../definitions"

export function getRange(date: string) {
    // example: convert "2019-01-01/2020-12-31" to "2019-2020"
    const response = date.split('/').map(datePeriod => datePeriod.slice(0, 4))

    if (response[0] === response[1]) {
        response[1] = `${Number.parseInt(response[1]) + 1}`
    }

    const datePeriod = date 
        ? `${response[0]}-${response[1].slice(-2)}`
        : "2023-24"

    return { datePeriod }
}


export function concatenateDatePeriods(date: google.protobuf.IValue) {
    const fields = date.structValue as fields

    const datePeriodToString = [
      fields.fields.startDate.stringValue,
      fields.fields.endDate.stringValue
    ].join('/')

    return datePeriodToString
}