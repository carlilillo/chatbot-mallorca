import useConversation from "./hooks/useConversations"
import useInput from "./hooks/useInput"
import useModel from "./hooks/useModel"

const models: model[] = [
  {
    id: 0,
    value: 'openai',
    htmlText: 'Chat GPT'
  }, 
  {
    id: 1,
    value: 'meta',
    htmlText: 'Llama Chat'
  }
]

function App() {
  const {
    model,
    onclick
  } = useModel(models)

  const {
    userMessages, 
    botMessages, 
    setNewUserMessage } = useConversation(model)

  const { inputRef, onSubmit } = useInput(setNewUserMessage)

  
  return (
    <>
      <header>
        <select
          onClick={onclick}>

            {models.map(model => 
              <option 
                key={model.id} 
                value={model.value}>
                  {model.htmlText}
              </option>
              )
            }

        </select>

        <h1 style={{textAlign: "center", marginTop: "0.3em"}}>
          Usando {model?.htmlText}
        </h1>
      </header>

      <main>
        <article className="chat">

            {
              botMessages.map( (botMessage, index) => {
                  const userMessage = userMessages[index]
                  return (
                    userMessage
                      ? <div key={botMessage.id}>
                            <span>Bot</span>
                            <p>{botMessage.input}</p>
                        
                            <span>Tú</span>
                            <p>{userMessage.input}</p>
                        </div>
                      : <div
                          key={botMessage.id}>
                            <span>Bot</span>
                            <p>{botMessage.input}</p>
                        </div>
                  )
                }
              )
            }

        </article>


        <form onSubmit={onSubmit}>
          <input
            ref={inputRef}
            placeholder="Cuéntame qué hizo el Mallorca..."
          />
          <button>Enviar</button>
        </form>

        <button className="auto-scroll hiding">↓</button>

      </main>
      
    </>
  )
}

export default App
