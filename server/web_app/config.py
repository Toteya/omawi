#!/usr/bin/env python3
"""
module config:
Flask configuration file
"""


class Config:
    JSONIFY_PRETTYPRINT_REGULAR = True
    HOST = '0.0.0.0'
    PORT = 5000


class TestingConfig(Config):
    TESTING = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEBUG = True
    SECRET_KEY = 'omawi_dev_pwd'
    TEMPLATES_AUTO_RELOAD = True


class ProductionCinfig(Config):
    pass
