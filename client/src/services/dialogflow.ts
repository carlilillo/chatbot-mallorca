

export default async function fetchModelResponse(
    input: string, 
    model: string
) {
    const res = await fetch(`http://localhost:3000/api/dialogflow` ,
    {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        credentials: 'include',

        body: JSON.stringify({ input, model })
    })

    const json = await res.json()

    const result = typeof(json.response) === 'string' 
        ? json.response 
        : json.response.map((text:any) => text.message).join('')

    return result
}