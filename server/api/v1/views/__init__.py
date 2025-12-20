#!/usr/bin/env python3
"""
Flask API blueprint for non-auth routes
"""
from flask import Blueprint

app_views = Blueprint('app_views', __name__, url_prefix='/api/v1')

from api.v1.views.composers import *
from api.v1.views.melodies import *
from api.v1.views.songs import *
from api.v1.views.index import *
from api.v1.views.verses import *
