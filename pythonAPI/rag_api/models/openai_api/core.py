from openai import OpenAI
import os

client = OpenAI()

def create_message(message: str, thread_id: str):
    message = client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=message
    )
    
    return message

def run_config(assistant_id: str | None, thread_id: str):
    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread_id,
        assistant_id=assistant_id,
        instructions='Si en los documentos no aparece, responde que desconoces la información'
    )
    
    return run


def copa_del_rey(message: str):
    
    thread = client.beta.threads.create()
    
    message = create_message(message, thread.id)
    
    run = run_config(
        os.getenv('COPA_DEL_REY_ASSISTANT'), 
        thread.id
    )
    
    if run.status == 'completed':
        messages = client.beta.threads.messages.list(
            thread_id=thread.id
        )
        return messages
    

    return run.status