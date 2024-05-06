import { useEffect, useState } from "react"
import getData from "../services/dialogflow"

export default function useConversation(model: model) {
    const [userMessages, setuserMessages] = useState<message[]>([])
    const [botMessages, setbotMessages] = useState<message[]>([])

    useEffect(() => {
        // render bot message
    
        if (userMessages.length === 0) { //component is rendering
          setbotMessages([{
            id: 0,
            input: "¡Preguntame algo sobre el RCD Mallorca!"
          }])
          return
        }
    
        const userInput = userMessages[userMessages.length - 1]
        getData(userInput.input, model.value).then( (response: any) => {
          if (response.error) console.log(response.error)

          const botMessagesClone = botMessages.slice()
          botMessagesClone.push({
            id: botMessages.length,
            input: response.response.map((value: any) => value.message).join('')
          })
          setbotMessages(botMessagesClone)
    
        }).catch((error:any) => {
          console.error(error)
        })
    
    }, [userMessages])

    const setNewUserMessage = (input: string) => {
        const userMessageClone = userMessages.slice()
        userMessageClone.push({ input })
        setuserMessages(userMessageClone)
    }

    return { userMessages, botMessages, setNewUserMessage }
}