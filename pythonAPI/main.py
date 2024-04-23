from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from rag_api.models.openai_api.body_structures import OpenAIMessage


openai_app = FastAPI()

@openai_app.post("/api/openai/copa-del-rey")
async def copa_del_rey_request(message: OpenAIMessage):
    # response = copa_del_rey(message=message.message)
    return {"message": "response"}
