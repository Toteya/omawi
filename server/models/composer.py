#!/usr/bin/env python3
"""
module composer:
Contains composer model implementation
"""
from models.base_model import Base, BaseModel, Column
from sqlalchemy import String
from sqlalchemy.orm import relationship


class Composer(BaseModel, Base):
    """
    A composer of a melody
    """
    __tablename__ = 'composers'

    name = Column('name', String(45), unique=True)

    melodies = relationship('Melody', back_populates='composer')
