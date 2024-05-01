from openai import OpenAI
from ...RAG_files.query_template import get_query

client = OpenAI()

def fetchResponse(query: str):
    response = client.chat.completions.create(
        messages=[
            {'role': 'user', 'content': query},
        ],
        model='gpt-3.5-turbo'
    )
    return response.choices[0].message.content

def rag_message_copadelrey(message: str):
    query = get_query(obj='copa-del-rey', message=message)
    return fetchResponse(query)

def rag_message_laliga(message: str):
    query = get_query(obj='laliga', message=message)
    return fetchResponse(query)
