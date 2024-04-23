import { FormEvent, useRef, useState } from "react"
import getData from "../services/dialogflow"



export default function useModel(models: model[]) {
  const [model, setModel] = useState<model>(models[0])
  const [messages, setMessages] = useState<message[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const onsubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const id = messages.length
    const isUser = true
    const input = inputRef.current!.value
    
    const messageClone = messages.slice()
    messageClone.push({
      id,
      isUser,
      input
    })

    getData(input, model!.value).then( (response) => {
      console.log(response)
    })

    inputRef.current!.value = ''
    setMessages(messageClone)
  }

  const onclick = (event: React.MouseEvent<HTMLSelectElement, MouseEvent>) => {
    const htmlText = models
      .find(model => model.value === event.currentTarget.value)
    setModel(htmlText!)
  }


  return {inputRef, onsubmit, onclick, model, messages}
}