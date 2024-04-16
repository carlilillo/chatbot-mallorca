import { FormEvent, useRef, useState } from "react"



export default function useModel(models: model[]) {
  const [model, setModel] = useState(models[0].htmlText)
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

    inputRef.current!.value = ''
    setMessages(messageClone)
  }

  const onclick = (event: React.MouseEvent<HTMLSelectElement, MouseEvent>) => {
    const htmlText = models.find(model => model.value === event.currentTarget.value)
    setModel(htmlText?.htmlText || '')
  }


  return {inputRef, onsubmit, onclick, model, messages}
}