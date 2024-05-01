import useConversation from "./hooks/useConversations"
import useInput from "./hooks/useInput"
import useModel from "./hooks/useModel"
import useScroll from "./hooks/useScroll"

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

  const { hide, scrollRef, handleScrollClick } = useScroll(userMessages)

  const messages = botMessages.map( (botMessage, index) => {
      const userMessage = userMessages[index]
      return (
        userMessage
          ? <div key={botMessage.id}>
                <p><span>Bot</span><br />
                  {botMessage.input}
                </p>
                <p><span>Tú</span><br />
                  {userMessage.input}
                </p>
            </div>
          : <div
              key={botMessage.id}>
                <p><span>Bot</span><br />
                  {botMessage.input}
                </p>
            </div>
      )
    }
  )

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

        <h1 style={{textAlign: "center", margin: "0.3em 0 0 0"}}>
          Usando {model?.htmlText}
        </h1>
      </header>

      <main>
        <section className="chat">
          <div ref={scrollRef}>
            {messages}
          </div>
        </section>


        <form onSubmit={onSubmit}>
          <input
            ref={inputRef}
            placeholder="Cuéntame qué hizo el Mallorca..."
          />
          <button>Enviar</button>
        </form>

        <button 
          className={`auto-scroll${hide ? " hiding" : ""}`}
          onClick={handleScrollClick}
        >
          ↓
        </button>

      </main>
      
    </>
  )
}

export default App
