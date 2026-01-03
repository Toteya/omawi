#!/usr/bin/env python3
"""
module config:
Flask configuration file
"""
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AUDIO_ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, '../../', 'media', 'audio'))

class Config:
    TESTING = False
    JSONIFY_PRETTYPRINT_REGULAR = True
    HOST = '0.0.0.0'
    PORT = 5001
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True


class TestingConfig(Config):
    TESTING = True


class DevelopmentConfig(Config):
    DEBUG = True
    SECRET_KEY = 'omawi_dev_pwd'
    TEMPLATES_AUTO_RELOAD = True


class ProductionCinfig(Config):
    DEBUG = False
