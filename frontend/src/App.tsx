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
  const { inputRef,
          onsubmit,
          onclick,
          model, 
          messages } = useModel(models)

  return (
    <>
      <header>
        <select
          style={{outline: "none"}}
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

        <h1 style={{textAlign: "center"}}>
          Usando {model}
        </h1>
      </header>

      <main>
        <div className="chat">
          <div>

            {messages.map(message => {
                return(
                  <div 
                    key={message.id}>
                      <span>
                        {message.isUser ? 'Tú' : 'Bot'}
                      </span>
                      <p>
                        {message.input}
                      </p>
                  </div>)
                }
              )
            }

          </div>
        </div>

        <form onSubmit={onsubmit}>
          <input
            ref={inputRef}
            placeholder="Cuéntame qué hizo el Mallorca..."
          />
          <button>Enviar</button>
        </form>

      </main>
      
    </>
  )
}

export default App
