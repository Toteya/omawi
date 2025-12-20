#!/usr/bin/env python3
"""
module composers:
Contains API endpoints related to composer objects
"""
from flask import abort, jsonify, request
from sqlalchemy.exc import IntegrityError
from api.v1.views import app_views
from models import storage
from models.composer import Composer


@app_views.route('/composers', methods=['GET'], strict_slashes=False)
def get_composers():
    """ Returns all the composers in the database
    """
    composers = storage.all(Composer).values()
    composers_list = [composer.to_dict() for composer in composers]
    return jsonify(composers_list)

@app_views.route('/composers/<composer_id>', methods=['GET'],
                 strict_slashes=False)
def get_composer(composer_id):
    """ Returns the composer matching the given ID
    """
    composer = storage.get(Composer, composer_id)
    if not composer:
        abort(404)
    return jsonify(composer.to_dict())

@app_views.route('/composers', methods=['POST'], strict_slashes=False)
def post_composer():
    """ Creates and saves a new composer object
    """
    name = request.form.get('name')
    if not name:
        abort(400, description="Composer's name is missing")
    
    composer = Composer(name=name)
    storage.new(composer)
    try:
        storage.save()
    except IntegrityError:
        storage.close()
        abort(400, description="Composer's name already exists.")
    storage.close()

    return jsonify(composer.to_dict()), 201
