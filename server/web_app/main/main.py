#!/usr/bin/env python3
"""
module main:
Renders main web app templates
"""
from flask import render_template
from flask_login import login_required, current_user
from models import storage
from models.composer import Composer
from models.song import Song
from web_app.main import app_main


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
    # load all songs from database
    songs = storage.all(Song).values()
    songs = sorted(songs, key=lambda k: k.title)
    # load all the composers from db
    composers = storage.all(Composer).values()
    composers = sorted(composers, key=lambda k: k.name)

    return render_template('songs.html', songs=songs, composers=composers)
