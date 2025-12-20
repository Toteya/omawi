#!/usr/bin/env python3
"""
module app:
Contains Flask API implementation
"""
from api.v1.views import app_views
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from models import storage
import os


def create_app():
    """ Creates and initialises the API app
    """
    app = Flask(__name__)

    config_type = os.getenv('CONFIG_TYPE', 'api.v1.config.DevelopmentConfig')
    app.config.from_object(config_type)

    app.register_blueprint(app_views)

    return app


app = create_app()
CORS(app, resources={r"/api/v1/*": {"origins": "*"}})
# cors = CORS(app)


@app.teardown_appcontext
def close_session(error=None):
    """ Closes/removes the database session
    """
    storage.close()


# @app.before_request
# def authenticate():
#     """ Authentication before each request
#     """
#     pass


@app.errorhandler(404)
def not_found(error=None):
    """ Returns 404 Error - for API resource not found
    """
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(401)
def unauthorized(error=None):
    """ Unauthorized request handler - Returns 401 error
    """
    return jsonify({'error': 'Unauthorized'}), 401


@app.errorhandler(403)
def forbidden(error=None):
    """ Forbidden request handler - Returns 403 error
    """
    return jsonify({'error': 'Forbidden'}), 403


if __name__ == '__main__':
    # host = os.getenv('OMAWI_API_HOST', '0.0.0.0')
    # port = os.getenv('OMAWI_API_PORT', '5001')
    host = app.config['HOST']
    port = app.config['PORT']
    app.run(host=host, port=port, threaded=True, debug=True)
