#!/usr/bin/env python3
"""
Initialises the models package
"""
from models.engine.db_storage import DBStorage

storage = DBStorage()
storage.load()
