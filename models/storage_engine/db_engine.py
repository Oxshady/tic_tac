from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy import create_engine
from os import getenv
from models.model import Base

class DBEngine:
	__engine = None
	__session = None

	def __init__(self) -> None:
		name = getenv('HBNB_MYSQL_DB')
		host = getenv('HBNB_MYSQL_HOST')
		user = getenv('HBNB_MYSQL_USER')
		passw = getenv('HBNB_MYSQL_PWD')
		url = f"mysql+mysqldb://{user}:{passw}@{host}:3306/{name}"
		self.__engine = create_engine(
			url=url,
			pool_pre_ping=True
		)
		self.session_factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
		self.__session = scoped_session(session_factory=self.session_factory)

	def get_session(self):
		return self.__session()

	def remove_session(self):
		self.__session.remove()

	def create_all(self):
		Base.metadata.create_all(self.__engine)

	def drop_all(self):
		Base.metadata.drop_all(self.__engine)

	def save(self, obj):
		self.__session.add(obj)
		self.__session.commit()

	def update(self):
		self.__session.commit()

	def all(self, obj):
		return self.__session.query(obj).all()
	def delete(self, obj):
		self.__session.delete(obj)
		self.__session.commit()
