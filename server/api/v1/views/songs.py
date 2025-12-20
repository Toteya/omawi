#!/usr/bin/env python3
"""
module songs:
Contains API endpoints related to song objects
"""
from flask import abort, jsonify, request
from sqlalchemy.exc import IntegrityError
from api.v1.views import app_views
from models.melody import Melody
from models.song import Song
from models import storage


@app_views.route('/songs', methods=['GET'], strict_slashes=False)
def get_songs():
    """ Returns all the songs
    """
    songs = storage.all(Song).values()
    songs_list = [song.to_dict() for song in songs]
    songs_list = sorted(songs_list, key=lambda k: k['title'])
    return jsonify(songs_list)


@app_views.route('/songs/<song_id>', methods=['GET'], strict_slashes=False)
def get_song(song_id):
    """ Returns the song matching the given id
    """
    song = storage.get(Song, song_id)
    if not song:
        abort(404)
    return (song.to_dict())


@app_views.route('/songs', methods=['POST'], strict_slashes=False)
def post_song():
    """ Creates and saves new song
    """
    title = request.form.get('title')
    number = request.form.get('number')
    if not title:
        abort(400, description='Title is missing')
    if number:
        try:
            number = int(number)
        except ValueError:
            abort(400, description='Number must be an integer')

    song = Song(title=title, number=number)
    storage.new(song)
    try:
        storage.save()
    except IntegrityError:
        storage.close()
        abort(400, description="Song title already exists.")
    storage.close()
    return jsonify(song.to_dict()), 201


@app_views.route('/composers/<composer_id>/songs', methods=['GET'],
                 strict_slashes=False)
def get_songs_by_composer(composer_id):
    """ Returns all the songs whose melody's composer matches the given ID
    """
    songs = storage.get_join(Song, Melody, Song.melodies, composer_id=composer_id)
    songs_list = [song.to_dict() for song in songs]
    songs_list = sorted(songs_list, key=lambda k: k['title'])
    return jsonify(songs_list)
