from pydantic import BaseModel

class OpenAIMessage(BaseModel):
    message: str
