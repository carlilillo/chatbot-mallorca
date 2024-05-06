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

// inicializa el primer modelo como el predeterminado
document.querySelector<HTMLHeadingElement>('.model')!.innerHTML = 
  `Usando ${models[0].htmlText}`

// completa la funcionalidad de cambiar de modelo
document.querySelector<HTMLSelectElement>('.models')!
  .addEventListener('change', (event) => {
    const target = event.target as HTMLSelectElement
    const chosenModel = models.find(model => model.value === target.value)
    document.querySelector<HTMLHeadingElement>('.model')!.innerHTML = 
      `Usando ${chosenModel?.htmlText}`
  })


// set scroll button functionality
const scrollElement = document.querySelector<HTMLDivElement>('.scroll-element')!
const scrollButton = document.querySelector<HTMLButtonElement>('.auto-scroll')!

const handleScrollButton = () => {
  const offsetHeight = scrollElement.offsetHeight!
  const scrollTop = scrollElement.scrollTop!
  const scrollHeight = scrollElement.scrollHeight!

  if (scrollHeight<= offsetHeight + scrollTop) {
    scrollButton.classList.add('hiding')
  } else {
    scrollButton.classList.remove('hiding')
  }
}

// verifica que al scrollear se pueda ir hacia abajo
scrollElement.addEventListener('scrollend', handleScrollButton)

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
  .addEventListener('submit', (event) => {
    event.preventDefault()
    // obtener el input del usuario
    const inputElement = document.querySelector('.input-form') as HTMLInputElement

    const userInput = inputElement.value

    if (!userInput) return
    
    // cargar el input del usuario en el DOM
    document.querySelector<HTMLDivElement>('.scroll-element')!.innerHTML += `<div>
    <p><span>Tú</span><br />${userInput}</p></div>`

    // reiniciar el input
    inputElement.value = ''

    handleScrollButton()
  })