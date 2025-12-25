#!/usr/bin/env python3
"""
module melodies:
Contains API endpoints related to melody objects
"""
from flask import abort, jsonify, request, send_file
from sqlalchemy.exc import IntegrityError
import os
from api.v1.views import app_views
from models import storage
from models.composer import Composer
from models.melody import Melody
from models.song import Song
from werkzeug.utils import secure_filename

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MEDIA_ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, '../../../', 'media', 'audio'))


@app_views.route('/melodies', methods=['GET'], strict_slashes=False)
def get_melodies():
    """ Returns all the melodies on the database
    """
    melodies = storage.all(Melody).values()
    melodies_list = [melody.to_dict() for melody in melodies]
    return jsonify(melodies_list)


@app_views.route('/melodies/media/<path:filepath>', methods=['GET'], strict_slashes=False)
def get_melody_media(filepath):
    """ Returns the melody file at the given filepath
    """
    # filename = secure_filename(os.path.basename(target_path))
    full_path = os.path.abspath(os.path.join(MEDIA_ROOT_DIR, filepath))
    print("FULL PATH:", full_path)
    print("MEDIA ROOT:", MEDIA_ROOT_DIR)
    if not full_path.startswith(MEDIA_ROOT_DIR):
        abort(403, description='Access to the requested file is forbidden')
    if not os.path.isfile(full_path):
        abort(404, description='File not found')

    return send_file(full_path)



@app_views.route('/melodies/<melody_id>', methods=['GET'], strict_slashes=False)
def get_melody(melody_id):
    """ Returns the melody matching the given id
    """
    melody = storage.get(Melody, melody_id)
    if not melody:
        abort(404)
    return (melody.to_dict())


@app_views.route('/melodies', methods=['POST'], strict_slashes=False)
def post_melody():
    """ Creates and saves new melody object
    """
    filepath = request.form.get('filepath')
    composer_id = request.form.get('composer_id')
    if not filepath:
        abort(400, description='Title is missing')
    if composer_id == '':
        composer_id = None
        
    if composer_id and not storage.get(Composer, composer_id):
        abort(400, description='The composer id given does not exist.')

    melody = Melody(filepath=filepath, composer_id=composer_id)
    storage.new(melody)
    try:
        storage.save()
    except IntegrityError:
        storage.close()
        abort(400, description=f"A melody already exists with that filepath {filepath}.")
    storage.close()
    return jsonify(melody.to_dict()), 201


@app_views.route('/songs/<song_id>/melodies', methods=['GET'],
                 strict_slashes=False)
def get_song_melodies(song_id):
    """ Returns the melody or melodies of the given song
    NB: A song can have multiple melodies, therefore an array is returned
    """
    song = storage.get(Song, song_id)
    if not song:
        abort(404, description='Song not found')

    melodies = [melody.to_dict() for melody in song.melodies]
    return jsonify(melodies)


@app_views.route('/songs/<song_id>/melodies/<melody_id>', methods=['PUT'],
                 strict_slashes=False)
def put_song_melodies(song_id, melody_id):
    """ Adds the given melody to the given song
    """
    melody = storage.get(Melody, melody_id)
    song = storage.get(Song, song_id)
    if not melody:
        abort(404)
    if not song:
        abort(404)
    if melody in song.melodies:
        abort(400, description='That melody has already been added to this song')

    song.melodies.append(melody)
    song.update() # updates and saves db session
    storage.close()
    return jsonify(song.to_dict()), 200
