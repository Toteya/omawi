#!/usr/bin/python3
"""
module base_model: contains the BaseModel implementation
"""
from datetime import datetime
from sqlalchemy import Column as Col
from sqlalchemy import DateTime, String
from sqlalchemy.orm import DeclarativeBase
from uuid import uuid4


class Base(DeclarativeBase):
    """
    Declarative Base class to be inherited by all mapped classes / models
    """
    pass


def Column(*args, **kwargs):
    """ Adds an argument with a default value 'nullable=False to the
    sqlalchemy Column class
    """
    kwargs.setdefault('nullable', False)
    return Col(*args, **kwargs)


class BaseModel:
    """
    base / parent class upon which all class will be based
    """
    id = Column('id', String(45), primary_key=True)
    created_at = Column('created_at', DateTime, default=datetime.now)
    updated_at = Column('updated_at', DateTime, default=datetime.now)

    def __init__(self, **kwargs):
        self.id = str(uuid4())
        self.created_at = datetime.now()
        self.updated_at = self.created_at

        time_format = "%Y-%m-%dT%H:%M:%S.%f"
        if kwargs:
            for key, value in kwargs.items():
                if key == '__class__':
                    continue
                if key == 'created_at':
                    self.created_at = datetime.strptime(value, time_format)
                    continue
                if key == 'updated_at':
                    self.updated_at = datetime.strptime(value, time_format)
                    continue
                if hasattr(self, key):
                    setattr(self, key, value)
            # password hashing to be handled by session manager

    def update(self):
        """ Updates the updated_at attribute and saves the current DB session
        """
        from models import storage
        self.updated_at = datetime.now()
        storage.save()

    def to_dict(self):
        """ Returns a dictionary representation of the BaseModel instance
        """
        obj_dict = self.__dict__.copy()
        obj_dict['created_at'] = datetime.isoformat(self.created_at)
        obj_dict['updated_at'] = datetime.isoformat(self.updated_at)
        obj_dict['__class__'] = self.__class__.__name__
        if obj_dict.get('_sa_instance_state'):
            del obj_dict['_sa_instance_state']
        for key, value in obj_dict.items():
            if isinstance(value, list):
                if all(isinstance(obj, BaseModel) for obj in value):
                    obj_dict[key] = [obj.to_dict() for obj in value]
        return obj_dict
