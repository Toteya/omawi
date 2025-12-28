#!/usr/bin/env python3
"""
Blueprint for flask web app auth routes
"""
from flask import Blueprint

app_auth = Blueprint('app_auth', __name__)

from api.v1.auth.session import *
