from sqlalchemy import Integer,String, PrimaryKeyConstraint, Table,Column,MetaData
from config.db import meta


users = Table(
    'users',meta,
    Column("Name",String(255)),
    Column("Password",String(255))
)