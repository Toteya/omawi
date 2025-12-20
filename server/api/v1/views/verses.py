#!/usr/bin/env python3
"""
module verses:
Contains API endpoints relating to song verses
"""
from api.v1.views import app_views
from flask import abort, jsonify, request
from models import storage
from models.song import Song
from models.verse import Verse


@app_views.route('/verses/<verse_id>', methods=['GET'],
                 strict_slashes=False)
def get_verse(verse_id):
    """ Returns the verse matching the given id
    """
    verse = storage.get(Verse, verse_id)
    if not verse:
        abort(404)

    return jsonify(verse.to_dict())


@app_views.route('/verses/<verse_id>', methods=['DELETE'],
                 strict_slashes=False)
def delete_verse(verse_id):
    """ Deletes the verse that matches the given ID
    """
    verse = storage.get(Verse, verse_id)
    if not verse:
        abort(404)

    storage.delete(verse)
    return jsonify({'Success': 'Verse deleted'})


@app_views.route('/songs/<song_id>/verses', methods=['GET'],
                 strict_slashes=False)
def get_verses(song_id):
    """ Returns all the verses from the given song
    """
    song = storage.get(Song, song_id)
    if not song:
        abort(404)

    verses = [verse.to_dict() for verse in song.verses]
    verses = sorted(verses, key=lambda k: k['number'])

    return jsonify(verses)


@app_views.route('/songs/<song_id>/verses', methods=['POST'],
                 strict_slashes=False)
def post_verse(song_id):
    """ Creates a new verse and adds it to a song
    """
    song = storage.get(Song, song_id)
    if not song:
        abort(404)
    number = request.form.get('number')
    lyrics = request.form.get('lyrics')
    if not number:
        abort(400, description="Verse number missing")
    try:
        number = int(number)
    except ValueError:
        abort(400, description='Number must be an integer')
    if not lyrics:
        abort(400, description='Lyrics missing')
    if any([verse.number == number for verse in song.verses]):
        err_message = f'Verse number {number} already exists for this song.'
        abort(400, description=err_message)

    verse = Verse(song_id=song_id, number=number, lyrics=lyrics)
    storage.new(verse)
    storage.save()
    storage.close()

    return jsonify(verse.to_dict()), 201
