#!/usr/bin/env python3
"""
module test_app:
Contains tests for API app
"""
import sys
import os
from api.v1.app import create_app
import pytest
from models import storage
from models.user import User


sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ['CONFIG_TYPE'] = 'api.v1.config.TestingConfig'
app = create_app()


@pytest.fixture
def client():
    """ A test client for the app
    """
    with app.test_client() as client:
        yield client


@pytest.fixture
def auth_client(client):
    """ Authenticate a test admin user to access restricted endpoints
    """
    name = os.environ.get('TEST_USER_NAME')
    email = os.environ.get('TEST_USER_EMAIL')
    hashed_password = os.environ.get('TEST_USER_HASHED_PWD')
    password = os.environ.get('TEST_USER_PWD')
    role = os.environ.get('TEST_USER_ROLE')
    storage.new(User(name=name, email=email, password=hashed_password, role=role))
    storage.save()
    login_data = {
        'email': email,
        'password': password
    }
    response = client.post('/api/v1/auth/login', json=login_data)
    assert response.status_code == 200
    yield client
    client.post('/api/v1/auth/logout')
    storage.delete_all(User)
    storage.save()


def test_not_found(client):
    """ Tests that non-existing route url returns a 404 error
    """
    response = client.get('/api/v1/wrong_route')
    assert response.status_code == 404
