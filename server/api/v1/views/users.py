#!/usr/bin/env python3
"""
module songs:
Contains API admin endpoints related to user account objects
"""
from flask import abort, jsonify, request
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
from api.v1 import admin_required
from api.v1.views import app_views
from models.user import User
from models import storage


@app_views.route('/users', methods=['GET'], strict_slashes=False)
@admin_required
def get_users():
    """ Returns all the songs
    """
    users = storage.all(User).values()
    users_list = [user.to_dict() for user in users]
    users_list = sorted(users_list, key=lambda k: k['name'])
    return jsonify(users_list)


@app_views.route('/users/<user_id>', methods=['GET'], strict_slashes=False)
@admin_required
def get_user(user_id):
    """ Returns the user matching the given id
    """
    user = storage.get(User, user_id)
    if not user:
        abort(404)
    return (user.to_dict())


@app_views.route('/users', methods=['POST'], strict_slashes=False)
@admin_required
def post_user():
    """ Validates, creates and adds a new user account to the database
    """
    data = request.get_json(silent=True) or {}

    email = data.get('email')
    name = data.get('name')
    password = data.get('password')
    if not email or not name or not password:
        abort(400, description="Email, name, and password are required.")
    # if not validators.email(email):
    #     abort(400, description="Invalid email format.")

    user = storage.get_by_filter(User, email=email)

    if user:
        abort(409, description="User already exists.")

    new_user = User(email=email, name=name,
                    password=generate_password_hash(password, method='scrypt'))
    storage.new(new_user)
    storage.save()

    return jsonify({
        "message": "New user created successfully.",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "role": new_user.role
        }
    }), 201

@app_views.route('/users/<user_id>', methods=['DELETE'],
                 strict_slashes=False)
@admin_required
def delete_user(user_id):
    """ Deletes the user that matches the given ID
    """
    user = storage.get(User, user_id)
    if not user:
        abort(404)

    storage.delete(user)
    return jsonify({'Success': 'User deleted'})