#!/usr/bin/env python3
"""
module main:
Renders main web app templates
"""
from web_app.main import app_main
from flask import render_template
from flask_login import login_required, current_user


@app_main.context_processor
def inject_user():
    values = {
        'isLoggedIn': current_user.is_authenticated
    }
    return values


@app_main.route('/')
def index():
    """ Renders index page
    """
    return render_template('index.html')


@app_main.route('/profile')
@login_required
def profile():
    """ Renders profile page
    """
    return render_template('profile.html', name=current_user.name)

@app_main.route('/songs')
@login_required
def songs():
    """ Renders the songs page
    """
    # load songs from database
    return render_template('songs.html')
