from pydantic import BaseModel

class User(BaseModel):
    Name:str
    Password:str

