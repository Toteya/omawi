#!/usr/bin/env python3
"""
Initialises the test_models package
"""
from os import environ

environ['OMAWI_MYSQL_USER'] = 'omawi_test'
environ['OMAWI_MYSQL_PWD'] = 'omawi_test_pwd'
environ['OMAWI_MYSQL_HOST'] = 'localhost'
environ['OMAWI_MYSQL_DB'] = 'omawi_test_db'
environ['OMAWI_ENV'] = 'test'
