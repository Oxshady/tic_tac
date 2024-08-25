from .storage_engine.db_engine import DBEngine

db = DBEngine()
db.create_all()

