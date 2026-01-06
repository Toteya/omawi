#!/usr/bin/env python3
"""
module test_songs:
Contains pytests for API views - songs endpoints
"""
from test_app import client, auth_client
from test_composers import create_composers
from models import storage
from models.melody import Melody
from models.song import Song
import pytest


@pytest.fixture(scope='module')
def create_songs():
    """ Creates song objects for testing
    """
    song34 = Song(number=34, title='Song 34', id='93016e68-8e7e')
    song22 = Song(number=22, title='Song 22', id='43870a5d-cbd0')
    storage.new(song34)
    storage.new(song22)
    storage.save()
    yield
    storage.delete_all(Song)
    storage.save()
    storage.close()


def test_get_songs(client, create_songs):
    """ Test that the endpoint returns all existing songs in the database
    """
    response = client.get('/api/v1/songs')
    assert response.status_code == 200
    assert len(response.json) == 2


def test_get_song(client, create_songs):
    """ Test that the endpoint returns the correct song matching the given ID
    """
    response = client.get('/api/v1/songs/93016e68-8e7e')
    assert response.status_code == 200
    assert response.json['number'] == 34


def test_post_song(auth_client, create_songs):
    """ Test that the endpoint correctly adds a song to the DB
    """
    # Post song correctly with all details -> SUCCESS
    data = {'title': 'Song 81', 'number': 81}
    response = auth_client.post('/api/v1/songs', data=data)
    assert response.status_code == 201
    assert storage.get_by_filter(Song, title='Song 81') is not None

    # Post a song with a missing title -> 404 Error
    data = {'number': 81}
    response = auth_client.post('/api/v1/songs', data=data)
    assert response.status_code == 400
    
    # Post a song with invalid number -> 400 Error
    data = {'title': 'Little Song', 'number': 7.5}
    response = auth_client.post('/api/v1/songs', data=data)
    assert response.status_code == 400

    # Post a song with a title that already exists -> 400 Error
    data = {'title': 'Song 34', 'number': 34}
    response = auth_client.post('/api/v1/songs', data=data)
    assert response.status_code == 400


from test_melodies import create_melodies
def test_get_song_by_composer(client, create_composers, create_melodies, create_songs):
    """ Test that the endpoint returns all the songs whose melody is by
    the given composer
    """
    composer_id = 'a6458a37-8b17'
    song1 = storage.get(Song, '93016e68-8e7e')
    song2 = storage.get(Song, '43870a5d-cbd0')
    melody = storage.get(Melody, 'df7943f3-2759')
    song1.melodies.append(melody)
    song2.melodies.append(melody)

    response = client.get(f'/api/v1/composers/{composer_id}/songs')
    assert response.status_code == 200
    songs = response.json
    assert len(songs) == 2
    song_titles = [song.get('title') for song in songs]
    assert 'Song 22' in song_titles
    assert 'Song 34' in song_titles