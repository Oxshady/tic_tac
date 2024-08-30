from sqlalchemy import String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship, declarative_base
from flask_login import UserMixin
from uuid import uuid4
from datetime import datetime
from werkzeug.security import generate_password_hash

Base = declarative_base()

class User(UserMixin, Base):
    __tablename__ = 'users'
    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(40), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(128), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.utcnow())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.utcnow(), onupdate=datetime.utcnow)
    ranks: Mapped['Ranks'] = relationship("Ranks", back_populates="user", uselist=False)

    def __init__(self, *args, **kwargs):
        if kwargs:
            for key, value in kwargs.items():
                if key == 'password':
                    value = self.hash_password(value)
                setattr(self, key, value)

    def hash_password(self, password: str) -> str:
        return generate_password_hash(password, method='pbkdf2:sha256')

    def __str__(self) -> str:
        return f"user {self.username} {self.id}"

    def __repr__(self) -> str:
        return f"user {self.username} {self.id}"

    def to_dict(self):
        return {col.name: getattr(self, col.name) for col in self.__table__.columns}


class Ranks(Base):
    __tablename__ = 'ranks'
    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    win: Mapped[int] = mapped_column(Integer)
    loss: Mapped[int] = mapped_column(Integer)
    draw: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.utcnow())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.utcnow(), onupdate=datetime.utcnow)
    user_id: Mapped[str] = mapped_column(String(32), ForeignKey('users.id'), unique=True)
    user: Mapped['User'] = relationship("User", back_populates="ranks", uselist=False)

    def __init__(self, *args, **kwargs):
        if kwargs:
            for key, value in kwargs.items():
                setattr(self, key, value)

    def to_dict(self):
        return {col.name: getattr(self, col.name) for col in self.__table__.columns}
