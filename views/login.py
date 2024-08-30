from flask import Blueprint, request, redirect, url_for, g
from models import db
from werkzeug.security import check_password_hash
login = Blueprint('login', __name__)

@login.route('/login', methods=['POST'])
def login_user():
    from models import db
    from models.model import User
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return {"success":  False, "message": "please fill out all fields"}, 400
        sess = g.db_session
        user = sess.query(User).filter_by(email=email).first()
        if check_password_hash(user.password, password):
            return {"success":  True, "message": "login successful"}, 200
    return {"success":  False, "message": "login failed"}, 401
