#!/usr/bin/env python3
"""
module session:
Handles and renders user authentication related routes and templates
respectively
"""
from api.v1.auth import app_auth
from flask import abort, jsonify, request
from flask_login import current_user, login_user, login_required, logout_user
# from email_validators import validate_email, EmailNotValidError
# import validators  # for email validation
from werkzeug.security import generate_password_hash, check_password_hash
from models import storage
from models.user import User


@app_auth.route('/me', methods=['GET'])
def get_current_user():
    """ Returns the currently logged-in user
    """
    if not current_user.is_authenticated:
        abort(401, description="User not authenticated.")

    user = {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "role": current_user.role
    }

    return jsonify(user), 200


@app_auth.route('/login', methods=['POST'])
def login():
    """ Validates credentials and establishes a user session
    """
    data = request.get_json(silent=True) or {}

    email = data.get('email')
    password = data.get('password')
    remember = bool(data.get('remember', False))

    if not email or not password:
        abort(400, description="Email and password are required.")

    user = storage.get_by_filter(User, email=email)

    if not user or not check_password_hash(user.password, password):
        abort(401, description="Invalid email or password.")

    login_user(user, remember=remember)

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
    }), 200


@app_auth.route('/signup', methods=['POST'])
def signup():
    """ Validates, creates and adds new user credentials to the database
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

    login_user(new_user)
    return jsonify({
        "message": "Signup successful",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "role": new_user.role
        }
    }), 201


@app_auth.route('/logout', methods=['POST'])
@login_required
def logout():
    """ Logs out the current user / ends the user session
    """
    logout_user()
    return jsonify({"message": "Logged out"}), 200
