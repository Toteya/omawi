#!/usr/bin/env python3
"""
module song: Contains Song implementation
"""
from models.base_model import Base, BaseModel, Column
from models.melody import song_melody_assoc_table
from sqlalchemy import Integer, String
from sqlalchemy.orm import relationship


class Song(BaseModel, Base):
    """
    A song
    """
    __tablename__ = 'songs'

    title = Column('title', String(45), unique=True)
    number = Column('number', Integer, nullable=True)

    verses = relationship('Verse', backref='song', cascade='all, delete-orphan')
    melodies = relationship('Melody', secondary=song_melody_assoc_table,
                            back_populates='songs')
