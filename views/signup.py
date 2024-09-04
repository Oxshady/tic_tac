from flask import Blueprint, request, jsonify
signup = Blueprint('signup', __name__)

@signup.route('/signup', methods=['POST'])
def signup_user():
    from models import db
    from models.model import User, Ranks
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        if not username or not password:
            return jsonify({"success":  False, "message": "please fill out all fields"}), 400
        user = User(**{"username":username, "password":password, "email":email})
        db.save(user)
        rank = Ranks(user=user)
        db.save(rank)
        return jsonify({"success":  True, "message": "signup successful"}), 200
    return jsonify({"success":  False, "message": "signup failed"}), 401
