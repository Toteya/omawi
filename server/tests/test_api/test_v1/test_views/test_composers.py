#!/usr/bin/env python3
"""
module test_composers:
Contains pytests for API views - composers endpoints
"""
from test_app import client, auth_client
from models import storage
from models.composer import Composer
import pytest


@pytest.fixture(scope='module')
def create_composers():
    """ Creates a composer object for testing
    """
    composer1 = Composer(name='Sibelius', id='a6458a37-8b17')
    storage.new(composer1)
    storage.save()
    yield
    storage.delete_all(Composer)
    storage.save()
    storage.close()


def test_get_composers(client, create_composers):
    """ Tests that composers route returns all existing composers
    """
    response = client.get('/api/v1/composers')
    assert response.status_code == 200
    assert len(response.json) == 1


def test_get_composer(client, create_composers):
    """ Tests that the correct composer matching the ID is returned
    """
    # Get request with existing ID -> SUCCESS
    response = client.get('api/v1/composers/a6458a37-8b17')
    assert response.status_code == 200
    assert response.json.get('name') == 'Sibelius'

    # Get request with non-existing ID -> 404 Error
    response = client.get('api/v1/composers/fake_id')
    assert response.status_code == 404


def test_post_composer(auth_client, create_composers):
    """ Tests that the endpoint correctly creates a new composer object
    """
    # Post a composer with correct data -> SUCCESS
    data = {'name': 'Vivaldi'}
    response = auth_client.post('/api/v1/composers', data=data)
    assert response.status_code == 201
    assert storage.get_by_filter(Composer, name='Vivaldi')

    # Post a composer missing a name -> 400 Error
    data = {'name': None}
    response = auth_client.post('/api/v1/composers', data=data)
    assert response.status_code == 400

    # Post a composer that already exists -> 400
    data = {'name': 'Sibelius'}
    response = auth_client.post('/api/v1/composers', data=data)
    assert response.status_code == 400
