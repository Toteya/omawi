#!/usr/bin/env python3
"""
module verse:
Contains song verses implementation
"""
from models.base_model import Base, BaseModel, Column
from sqlalchemy import ForeignKey, Integer, String


class Verse(BaseModel, Base):
    """
    A verse of a song
    """
    __tablename__ = 'verses'

    song_id = Column('song_id', String(45), ForeignKey('songs.id',
                                                       ondelete='CASCADE'))
    number = Column('number', Integer)
    lyrics = Column('lyrics', String(1028))

    __mapper_args__ = {'confirm_deleted_rows': False}
