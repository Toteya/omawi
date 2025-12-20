#!/usr/bin/env python3
"""
module omawi_app:
Main Flask app to serve web static content
"""
from models import storage
from web_app.main import app_main
from web_app.auth import app_auth
from flask import Flask
from flask_login import LoginManager
import os


def create_app():
    """ Creates and initialises the web app
    """
    app = Flask(__name__)

    config_type = os.getenv('CONFIG_TYPE', 'web_app.config.DevelopmentConfig')
    app.config.from_object(config_type)

    app.register_blueprint(app_main)  # Non-auth routes
    app.register_blueprint(app_auth)  # Routes related to user authentication

    login_manager = LoginManager()
    login_manager.login_view = 'app_auth.login'
    login_manager.init_app(app)

    from models.user import User

    @login_manager.user_loader
    def load_user(user_id):
        return storage.get(User, user_id)

    return app


app = create_app()

if __name__ == '__main__':
    host = app.config['HOST']
    port = app.config['PORT']
    app.run(host=host, port=port, threaded=True, debug=True)
