#!/usr/bin/env python3
"""
module config:
Flask configuration file
"""


class Config:
    TESTING = False
    DEBUG = True
    JSONIFY_PRETTYPRINT_REGULAR = True
    HOST = '0.0.0.0'
    PORT = 5001


class TestingConfig(Config):
    TESTING = True


class DevelopmentConfig(Config):
    SECRET_KEY = 'omawi_dev_pwd'
    TEMPLATES_AUTO_RELOAD = True


class ProductionCinfig(Config):
    DEBUG = False
