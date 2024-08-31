# #!/usr/bin/python3
from models import db
from views.signup import signup
from views.login import login
from views.ranking import ranking
from views.users import usersC
from flask import Flask, g
from flask_cors import CORS
if __name__ == '__main__':
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "jadsnjkndsjkandjknjkasndjkansjkn adjk"
    app.register_blueprint(signup)
    app.register_blueprint(login)
    app.register_blueprint(ranking)
    app.register_blueprint(usersC)
    @app.before_request
    def before_request():
        g.db_session = db.get_session()
    @app.teardown_request
    def teardown_request(exception=None):
        db.remove_session()
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.run(port=5000)
