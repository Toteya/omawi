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

environ['TEST_USER_NAME'] = 'test_client'
environ['TEST_USER_EMAIL'] = 'admin@test.com'
environ['TEST_USER_HASHED_PWD'] = 'scrypt:32768:8:1$lnXQaPCHReEDoYqF$87825899c37ab5484b0afbe018d978286509b9a66a3420e958efb727ae889d724f466390a444697200178115e9ea4c913dbffc532d35c9e0606278d1262eb76f'
environ['TEST_USER_PWD'] = 'test1234'
environ['TEST_USER_ROLE'] = 'admin'
