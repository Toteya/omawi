#!/usr/bin/env python3
"""
module app:
Contains Flask API implementation
"""
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from flask_login import LoginManager
import os
from api.v1.auth import app_auth
from api.v1.views import app_views
from models import storage
from models.user import User


def create_app():
    """ Creates and initialises the API app
    """
    app = Flask(__name__)

    config_type = os.getenv('CONFIG_TYPE', 'api.v1.config.DevelopmentConfig')
    app.config.from_object(config_type)

    CORS(
        app,
        resources={r"/api/v1/*": {"origins": "http://localhost:5173"}},
        supports_credentials=True,
    )

    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return storage.get(User, user_id)

    app.register_blueprint(app_auth)    # Auth-related routes
    app.register_blueprint(app_views)

    return app


app = create_app()


@app.teardown_appcontext
def close_session(error=None):
    """ Closes/removes the database session
    """
    storage.close()


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


@app.errorhandler(Exception)
def internal(error=None):
    """ Internal Server Error handler - Returns 500 error
    """
    print(error)
    return jsonify({'error': 'Internal Server Error. Try again later.'}), 500


if __name__ == '__main__':
    host = app.config['HOST']
    port = app.config['PORT']
    app.run(host=host, port=port, threaded=True)


# Better implementation
#
# @app.errorhandler(Exception)
# def handle_exception(e):
#     if isinstance(e, HTTPException):
#         # TO DO: integrate structured logging here
#         return jsonify({"error": e.description}), e.code

#     return jsonify({
#         "error": "Internal Server Error. Try again later."
#     }), 500