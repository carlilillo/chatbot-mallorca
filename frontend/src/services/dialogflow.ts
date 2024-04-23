

export default async function getData(
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

    return json

}