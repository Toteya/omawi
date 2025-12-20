#!/usr/bin/env python3
"""
module test_app:
Contains tests for API app
"""
import sys
import os
from api.v1.app import create_app
import pytest

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ['CONFIG_TYPE'] = 'api.v1.config.TestingConfig'
app = create_app()


@pytest.fixture
def client():
    """ A test client for the app
    """
    with app.test_client() as client:
        yield client

def test_not_found(client):
    """ Tests that non-existing route url returns a 404 error
    """
    response = client.get('/api/v1/wrong_route')
    assert response.status_code == 404
