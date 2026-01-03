#!/usr/bin/env python3
"""
Flask API blueprint for admin routes
"""
from flask import abort, Blueprint, make_response
from flask_login import current_user, login_required
from flask_cors import cross_origin

app_admin = Blueprint('app_admin', __name__, url_prefix='/api/v1/admin')

from api.v1.admin.users import *

@app_admin.before_request
@cross_origin(supports_credentials=True)
@login_required
def admin_only():
    """ Restricts access to admin routes
    """
    if not current_user.role == 'admin':
        abort(403, description="Admin access denied.")
    return make_response("", 200)