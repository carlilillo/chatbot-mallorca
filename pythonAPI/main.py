from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Response
from rag_api.models.openai_api.body_structures import OpenAIMessage
from rag_api.models.openai_api.core import (
    rag_message_laliga, 
    rag_message_copadelrey
)

app = FastAPI()

@app.post("/api/openai/copa-del-rey")
async def copa_del_rey_request(res: Response, body: OpenAIMessage):
    try:
        content = rag_message_copadelrey(body.message)
        
        return {"message": content}
    except FileNotFoundError:
        print(FileNotFoundError)
        res.status_code = 500
        return {"error": "error reading RAG file"}

@app.post("/api/openai/la-liga")
async def copa_del_rey_request(res: Response, body: OpenAIMessage):
    try:
        content = rag_message_laliga(body.message)
        return {"message": content}
    except FileNotFoundError:
        print(FileNotFoundError)
        res.status_code = 500
        return {"error": "error reading RAG file"}
    