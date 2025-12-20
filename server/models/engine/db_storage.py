#!/usr/bin/env python3
"""
module db_storage:
Contains MySQL database storage engine implementation
"""
from models.base_model import Base
from models.composer import Composer
from models.song import Song
from models.melody import Melody
from models.user import User
from models.verse import Verse
from os import environ
from sqlalchemy import and_, create_engine, select
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.exc import InvalidRequestError


class DBStorage:
    """
    MySQL database storage engine
    """
    __engine = None
    __session = None
    __classes = {
        'Composer': Composer,
        'Song': Song,
        'Melody': Melody,
        'User': User,
        'Verse': Verse
    }

    def __init__(self):
        user = environ.get('OMAWI_MYSQL_USER')
        password = environ.get('OMAWI_MYSQL_PWD')
        host = environ.get('OMAWI_MYSQL_HOST')
        database = environ.get('OMAWI_MYSQL_DB')

        db_url = f'mysql+mysqldb://{user}:{password}@{host}/{database}'

        self.__engine = create_engine(db_url)
        if environ.get('OMAWI_ENV') == 'test':
            print("RUNNING IN TESTING MODE...")
            Base.metadata.drop_all(self.__engine)

    def all(self, clss=None):
        """ Returns a dictionary containing all objects of the specified class.
        If no class is given return all object from all classes
        """
        obj_list = []
        if clss is not None:
            obj_list = self.__session.query(clss).all()
        else:
            for _clss in self.__classes.values():
                objs = self.__session.query(_clss).all()
                obj_list.extend(objs)

        obj_dict = {}
        for obj in obj_list:
            key = f'{obj.__class__.__name__}.{obj.id}'
            obj_dict[key] = obj
        return obj_dict

    def get(self, clss=None, id=None):
        """ Returns an object based on the given id and class
        """
        if not all([clss, id]):
            return None
        obj = self.__session.query(clss).filter(clss.id == id).first()
        return obj

    def get_by_filter(self, clss=None, **kwargs):
        """ Returns the first object that matches the given class and arguments
        """
        if clss.__name__ not in self.__classes:
            return None
        obj = self.__session.query(clss).filter_by(**kwargs).first()
        return obj
    
    def get_all_by_filter(self, clss=None, **kwargs):
        """ Returns all the object
        """
        if clss.__name__ not in self.__classes:
            return None
        objs = self.__session.query(clss).filter_by(**kwargs).all()
        return objs


    def get_join(self, clss_from=None, clss_join=None, relationship=None,
                 **filters):
        """ Performs a join query using the given classes and returns a list of
        objects matching the given filter(s)
        """
        stmt = (
            select(clss_from)
            .select_from(clss_from)
            .join(clss_join, relationship)
        )
        for key, value in filters.items():
            stmt = stmt.where(getattr(clss_join, key) == value)

        objs = self.__session.execute(stmt).scalars()
        return objs

    def new(self, obj):
        """ Adds a new object to the current session
        """
        if obj is not None:
            self.__session.add(obj)

    def delete(self, obj=None):
        """ Deletes an object from the current session
        """
        if obj is not None:
            self.__session.delete(obj)
    
    def delete_all(self, clss=None):
        """ Deletes all objects from the given class
        """
        if clss is None:
            return
        objs = self.all(clss).values()
        for obj in objs:
            self.delete(obj)

    def save(self):
        """ Commits all changes from the current session to the database
        """
        self.__session.commit()

    def expire(self, obj=None):
        """ Expires an object to ensure that the next it is accessed the most
        the most up-to-date version is loaded
        """
        try:
            self.__session.expire(obj)
        except InvalidRequestError as e:
            print(f"Error: {e}")

    def load(self):
        """ Loads data from the database and creates a new session
        """
        Base.metadata.create_all(self.__engine)
        session_factory = sessionmaker(bind=self.__engine,
                                       expire_on_commit=False)
        Session = scoped_session(session_factory)
        self.__session = Session

    def close(self):
        """ Closes/Removes the current session
        """
        self.__session.remove()
