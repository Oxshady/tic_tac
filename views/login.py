from flask import Blueprint, render_template, request, redirect, url_for, flash, g
from models import db
from werkzeug.security import check_password_hash
login = Blueprint('login', __name__)

@login.route('/login', methods=['GET', 'POST'])
def login_user():
    from models import db
    from models.user_model import User
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        if not email or not password:
            flash('please fill out all fields')
            return render_template('login.html')
        sess = g.db_session
        user = sess.query(User).filter_by(email=email).first()
        if check_password_hash(user.password, password):
            flash('login successful')
            return render_template('home.html')
    return render_template('login.html')
