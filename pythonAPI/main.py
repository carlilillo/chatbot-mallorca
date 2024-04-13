from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from rag.models.openai_api.core import *
from rag.models.openai_api.body_structures import OpenAIMessage

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/api/openai/copa-del-rey")
async def copa_del_rey_request(message: OpenAIMessage):
    response = copa_del_rey(message=message.message)
    return {"message": response}