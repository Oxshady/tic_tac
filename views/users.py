from flask import Blueprint, request, jsonify
from models.model import User
from models import db
usersC = Blueprint('usersC', __name__)

@usersC.route('/users', methods=['GET'])
def get_users():
    users = db.all(User)
    users_data = [{'id': user.id, 'username': user.username, 'email': user.email} for user in users]
    return jsonify(users_data)
