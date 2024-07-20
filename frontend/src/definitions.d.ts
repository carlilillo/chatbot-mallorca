type message = {
    id?: number,
    input: string
}


type model = {
    value: string,
    htmlText: string
}

type body = {
    input: string, 
    model: string, 
    lastInput?: string
}