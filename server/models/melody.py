#!/usr/bin/env python3
"""
module melody:
Contains song melody implementation
"""
from models.base_model import Base, BaseModel, Column
from sqlalchemy import Column as Col
from sqlalchemy import ForeignKey, String, Table
from sqlalchemy.orm import relationship


song_melody_assoc_table = Table(
    'song_melody_assoc_table',
    Base.metadata,
    Col('song_id', String(45), ForeignKey('songs.id'), primary_key=True),
    Col('melody_id', String(45), ForeignKey('melodies.id'), primary_key=True)
)


class Melody(BaseModel, Base):
    """
    The melody of a song
    """
    __tablename__ = 'melodies'

    filepath = Column('filepath', String(256), unique=True)
    composer_id = Column('composer_id', String(45), ForeignKey('composers.id'),
                         nullable=True)

    songs = relationship('Song', secondary='song_melody_assoc_table',
                         back_populates='melodies')
    composer = relationship('Composer', back_populates='melodies')
