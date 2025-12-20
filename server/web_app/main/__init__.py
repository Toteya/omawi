#!/usr/bin/env python3
"""
Blueprint for main flask web app
"""
from flask import Blueprint

app_main = Blueprint('app_main', __name__)

from web_app.main.main import *
