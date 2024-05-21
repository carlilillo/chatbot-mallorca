import fetchModelResponse from './services/dialogflow'
import './style.css'

const models: model[] = [
  {
    value: 'openai',
    htmlText: 'Chat GPT'
  }, 
  {
    value: 'meta',
    htmlText: 'Llama Chat'
  }
]

// añade los modelos al select del header
document.querySelector<HTMLSelectElement>('.models')!.innerHTML = 
  models
    .map(model => 
      `<option value="${model.value}">${model.htmlText}</option>`)
    .join('')


// set scroll button functionality
const scrollElement = document.querySelector<HTMLDivElement>('.scroll-element')!
const scrollButton = document.querySelector<HTMLButtonElement>('.auto-scroll')!

scrollButton.addEventListener('click', () => {
  scrollElement.scrollBy({
    top: scrollElement.scrollHeight!,
    left: 0,
    behavior: 'smooth'
  })
  scrollButton.classList.remove('hiding')
})

// añadir el mensaje del usuario en el chat general
document.querySelector<HTMLFormElement>('.form')!
  .addEventListener('submit', async (event) => {
    event.preventDefault()
    // obtener el input del usuario
    const inputElement = document.querySelector('.input-form') as HTMLInputElement

    const userInput = inputElement.value

    if (!userInput) return

    // obtener el modelo
    const model = document.querySelector<HTMLSelectElement>('.models')!.value
    
    // cargar el input del usuario en el DOM
    const conversation = document.querySelector<HTMLDivElement>('.scroll-element')!
    conversation.innerHTML += `<div><p><span>Tú</span><br />${userInput}</p></div>`


    let currentConversation = conversation.innerHTML
    conversation.innerHTML = 
      `${currentConversation}<div><p><span>Bot</span><br />Cargando la respuesta...</p></div>`

    // reiniciar el input
    inputElement.value = ''
    inputElement.disabled = true

    try {
      const response = await fetchModelResponse(userInput, model)
      // se reinicia el texto anterior por la respuesta
      conversation.innerHTML = `${currentConversation}${response}`

      inputElement.disabled = false

    } catch( error ){
      console.error(error)
      conversation.innerHTML = `${currentConversation}<div><p><span>Bot</span><br />No se ha podido completar la respuesta, vuelva a intentarlo, por favor</p></div>`
      inputElement.disabled = false

    }
  })

document.querySelector<HTMLButtonElement>('.clean-button')?.addEventListener('click', () => {
  const conversation = document.querySelector<HTMLDivElement>('.scroll-element')!
  conversation.innerHTML = "<div><p><span>Bot</span><br />¡Preguntame algo sobre el RCD Mallorca!</p></div>"
})