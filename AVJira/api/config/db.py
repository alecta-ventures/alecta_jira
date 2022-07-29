import imp
from sqlalchemy import create_engine
from sqlalchemy import MetaData

engine = create_engine("mysql+pymysql://root@localhost:3306/test")
meta = MetaData()

conn = engine.connect()

