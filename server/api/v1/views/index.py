#!/usr/bin/env python3
"""
API index endpoints
"""
from api.v1 import admin_required
from api.v1.views import app_views
from flask import jsonify
from models import storage


@app_views.route('/status', strict_slashes=False)
def status():
    """ Returns the current status of the API
    """
    return jsonify({"Status": "OK"})


@app_views.route('/stats', strict_slashes=False)
@admin_required
def stats():
    """ Returns statistics about all the existing objects in the daatabase
    """
    objs = storage.all()
    objs_stats = {}
    for key in objs.keys():
        clss = key.split('.')[0]
        # Pluralise classs name e.g. User -> Users, Melody -> Melodies
        if clss[-1] == 'y':
            clss = clss[:-1] + 'ies'
        else:
            clss += 's'
        # Store object count
        if clss not in objs_stats:
            objs_stats[clss] = 1
        else:
            objs_stats[clss] += 1

    return jsonify(objs_stats)
