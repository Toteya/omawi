#!/usr/bin/env python3
"""
module user: Contains user account implementation
"""
from models.base_model import Base, BaseModel, Column
from sqlalchemy import String
from flask_login import UserMixin


class User(BaseModel, UserMixin, Base):
    """
    A user account
    """
    __tablename__ = 'users'

    name = Column('name', String(60))
    email = Column('email', String(60), unique=True)
    password = Column('password', String(255))
    role = Column('role', String(20), default='user')
