from flask import abort
from flask_login import current_user, login_required
from functools import wraps

def admin_required(fn):
    """ Decorator to restrict access to admin users only
    """
    @login_required
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if current_user.role != 'admin':
            abort(403, description="Admin access denied.")
        return fn(*args, **kwargs)
    return wrapper
