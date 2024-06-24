import fetchModelResponse from './services/dialogflow'
import { botIcon, cleanIconSvg, optionIconSvg, userIcon } from './services/icons'
import './style.css'

const models: model[] = [
  {
    value: 'openai',
    htmlText: 'Chat GPT'
  },
  {
    value: 'google',
    htmlText: 'Gemini Chat'
  }
]

const $ = (el:string) => document.querySelector<HTMLElement>(el)!

// añade los modelos al select del header
$('.models').innerHTML = 
  models
    .map(model => 
      `<option value="${model.value}">${model.htmlText}</option>`)
    .join('')


// set scroll button functionality
const scrollElement = $('.scroll-element')

// añadir el mensaje del usuario en el chat general
$('.form')
  .addEventListener('submit', async (event) => {
    event.preventDefault()
    // obtener el input del usuario
    const inputElement = $('.input-form') as HTMLInputElement

    const userInput = inputElement.value

    if (!userInput) return

    // obtener el modelo
    const model = ($('.models') as HTMLSelectElement).value
    
    // cargar el input del usuario en el DOM
    const conversation = $('.scroll-element')
    conversation.innerHTML += `<div class="user-message">${userIcon()}<p><span>Tú</span><br />${userInput}</p></div>`


    let currentConversation = conversation.innerHTML
    conversation.innerHTML = 
      `${currentConversation}<div class="bot-message">${botIcon()}<p><span>Bot</span><br />Cargando la respuesta...</p></div>`
    
    scrollElement.scrollTop = scrollElement.scrollHeight

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
      conversation.innerHTML = `${currentConversation}<div class="bot-message">${botIcon()}<p><span>Bot</span><br />No se ha podido completar la respuesta, vuelva a intentarlo, por favor</p></div>`
      inputElement.disabled = false

    }

    scrollElement.scrollTop = scrollElement.scrollHeight
  })

const cleanButton = $('.clean-button')
cleanButton.innerHTML = `Limpiar Chat${cleanIconSvg()}`

cleanButton.addEventListener('click', () => {
  const conversation = $('.scroll-element')!
  conversation.innerHTML = `<div class="bot-message">${botIcon()}<p><span>Bot</span><br />¡Preguntame algo sobre el RCD Mallorca!</p></div>`
})


const optionIcon = $('.option-icon')
optionIcon.innerHTML = `${optionIconSvg()}`
optionIcon.addEventListener('click', () => {
  const aside = $('aside') as HTMLElement
  aside.classList.remove("not-visible")
  aside.classList.add("visible")
})

$('.close-section button').addEventListener('click', () => {
  const aside = $('aside') as HTMLElement
  aside.classList.add("not-visible")
  aside.classList.remove("visible")
})