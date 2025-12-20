#!/usr/bin/env python3
"""
module session:
Handles and renders user authentication related routes and templates
respectively
"""
from web_app.auth import app_auth
from flask import flash, redirect, render_template, request, url_for
from flask_login import current_user, login_user, login_required, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import storage
from models.user import User

@app_auth.context_processor
def inject_user():
    values = {
        'isLoggedIn': current_user.is_authenticated
    }
    return values

@app_auth.route('/login')
def login():
    """ Renders login page
    """
    return render_template('login.html')


@app_auth.route('/login', methods=['POST'])
def login_post():
    """ Validates and logs in the user
    """
    email = request.form.get('email')
    password = request.form.get('password')
    remember = False
    if request.form.get('remember'):
        remember = True

    user = storage.get_by_filter(User, email=email)

    if not user or not check_password_hash(user.password, password):
        flash('Please check your login details and try again.')
        return redirect(url_for('app_auth.login'))

    login_user(user, remember=remember)

    return redirect(url_for('app_main.profile'))


@app_auth.route('/signup')
def signup():
    """ Renders signing up page
    """
    return render_template('signup.html')


@app_auth.route('/signup', methods=['POST'])
def signup_post():
    """ Validates and adds user to the database
    """
    email = request.form.get('email')
    name = request.form.get('name')
    password = request.form.get('password')

    user = storage.get_by_filter(User, email=email)

    if user:
        flash('Email address already exists')
        return redirect(url_for('app_auth.signup'))

    new_user = User(email=email, name=name,
                    password=generate_password_hash(password, method='scrypt'))
    storage.new(new_user)
    storage.save()

    return redirect(url_for('app_auth.login'))


@app_auth.route('/logout')
@login_required
def logout():
    """ Logs out the current user / ends the user session
    """
    logout_user()
    return redirect(url_for('app_main.index'))
