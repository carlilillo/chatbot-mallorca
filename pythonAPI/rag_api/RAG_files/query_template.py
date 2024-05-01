import sys
import os

def get_query(obj: str, message: str):
    path = f'/rag_api/RAG_files/{obj}/{obj}.jsonl'
    json_path = f'{sys.path[0]}{path}'
    
    if not os.path.isfile(json_path):
        raise FileNotFoundError(f'{path} does not exist for {sys.path[0]}')
    
    with open(json_path, 'r') as f:
        helper_text = f.read()

    query = f"""
        Usa el siguiente contenido JSON sobre {obj} para responder
        a la pregunta. Si la respuesta no se puede encontrar, entonces escribe 
        que no sabes la respuesta. Intenta decorar un poco la respuesta para 
        que la respuesta no sea tan corta.
    
        Contenido JSON: 
        \"\"\"
        {helper_text}
        \"\"\"

        Pregunta: {message}
    """
    
    return query
