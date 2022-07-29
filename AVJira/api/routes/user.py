import email
import imp
from tokenize import Name
from fastapi import APIRouter
from config.db import conn
from models.index import users
from schemas.index import User
user = APIRouter()

@user.get("/")
async def read_data():
    return conn.execute(users.select()).fetchall()


@user.get("/{Name}")
async def read_data(Name:str):
    return conn.execute(users.select().where(users.c.Name == Name)).fetchall()


@user.post("/")
async def write_data(user: User):
    conn.execute(users.insert().values(
        name = user.name,
        password = user.password
        ))
    return conn.execute(users.select()).fetchall()


@user.put("/{Name}")
async def update_data(Name:int,user:User):
    conn.engine(users.update().values(
        name = user.name,
        password = user.password
    ).where(users.c.Name == Name))
    return conn.execute(users.select()).fetchall()


@user.delete("/")
async def delete_data():
    conn.execute(users.delete().where(users.c.Name== Name))
    return conn.execute(users.select()).fetchall()