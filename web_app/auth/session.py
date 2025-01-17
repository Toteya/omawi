#!/usr/bin/env python3
"""
module session:
Handles and renders user authentication related routes and templates respectively
"""
from web_app.auth import app_auth
from flask import flash, redirect, render_template, request, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from models import storage
from models.user import User

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

    users = list(storage.all(User).values())
    user = None
    for obj in users:
        if obj.email == email:
            user = obj
    
    if not user or not check_password_hash(user.password, password):
        flash('Please check your login details and try again.')
        return redirect(url_for('auth.login'))

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

    users = list(storage.all(User).values())
    user = None
    for obj in users:
        if obj.email == email:
            user = obj

    if user:
        flash('Email address already exists')
        return redirect(url_for('app_auth.signup'))
    
    new_user = User(email=email, name=name,
                    password=generate_password_hash(password, method='scrypt'))
    storage.new(new_user)
    storage.save()
    
    return redirect(url_for('app_auth.login'))


@app_auth.route('/logout')
def logout():
    """ Handles logging out
    """
    return 'Logout'
