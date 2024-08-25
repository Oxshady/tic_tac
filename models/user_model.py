from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, sessionmaker, scoped_session, declarative_base
from flask_login import UserMixin
from uuid import uuid4
from datetime import datetime
from werkzeug.security import generate_password_hash
Base = declarative_base()
class User(UserMixin, Base):
    __tablename__ = 'users'
    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(40), nullable=False)
    password: Mapped[str] = mapped_column(String(128), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.utcnow())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.utcnow(),  onupdate=datetime.utcnow)
    def __init__(self, *args, **kwargs):
        if kwargs:
            for key, value in kwargs.items():
                if key == 'password':
                    value = generate_password_hash(value, method='pbkdf2:sha256')
                setattr(self, key, value)
    def __str__(self) -> str:
        return f"user {self.username} {self.id}"
    def __repr__(self) -> str:
        return f"user {self.username} {self.id}"
    def to_dict(self):
        return self.__dict__
