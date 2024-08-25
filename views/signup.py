from flask import Blueprint, render_template, request, redirect, url_for, flash
signup = Blueprint('signup', __name__)

@signup.route('/signup', methods=['GET', 'POST'])
def signup_user():
    from models import db
    from models.user_model import User
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        email = request.form.get('email')
        if not username or not password:
            flash('please fill out all fields')
            return render_template('signup.html')
        user = User(**{"username":username, "password":password, "email":email})
        db.save(user)
        flash('user created successfully')
        return render_template('home.html')
    return render_template('signup.html')
