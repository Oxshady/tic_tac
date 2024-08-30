# #!/usr/bin/python3
from models import db
db.create_all()
from models.model import User, Ranks

x = db.get_session()
rank = Ranks(win=5, loss=2, draw=1 ,user_id="066d442d4db7442f9a9b928631f7eca2")
rank = Ranks(win=5, loss=2, draw=1 ,user_id="066d442d4db7442f9a9b928631f7eca2")
db.save(rank)
db.update()
user = x.query(User).filter_by(id="066d442d4db7442f9a9b928631f7eca2").first()
print(user.ranks.win)
# from models.user_model import User
# from models import db
# from views.signup import signup
# from views.login import login
# from flask import Flask, g
# from models.user_model import Rank
# if __name__ == '__main__':
#     app = Flask(__name__)
#     app.config["SECRET_KEY"] = "jadsnjkndsjkandjknjkasndjkansjkn adjk"
#     app.register_blueprint(signup)
#     app.register_blueprint(login)
#     @app.before_request
#     def before_request():
#         g.db_session = db.get_session()
#     x = Rank(win="5", loss="2",  user_id="066d442d4db7442f9a9b928631f7eca2")
#     db.save(x)
#     db.update()
#     @app.teardown_request
#     def teardown_request(exception=None):
#         db.remove_session()
#     app.run(debug=True)
# # from werkzeug.security import generate_password_hash
# # from uuid import uuid4
# # from datetime import datetime
# # from flask import Flask, g
# # if __name__ == '__main__':
# #     app = Flask(__name__)
# #     app.config["SECRET_KEY"] = "jadsnjkndsjkandjknjkasndjkansjkn adjk"
# #     app.register_blueprint(signup)
# #     app.register_blueprint(login)
# #     @app.before_request
# #     def before_request():
# #         g.db_session = db.get_session()

# #     @app.teardown_request
# #     def teardown_request(exception=None):
# #         db.remove_session()
# #     app.run(debug=True)

# # common_password = 'easy_password'
# # hashed_password = generate_password_hash(common_password, method='pbkdf2:sha256')
# # for i in range(1, 101):
# #     user_id = uuid4().hex
# #     username = f'user{i}'
# #     email = f'user{i}@example.com'
# #     created_at = datetime.utcnow().isoformat()
# #     updated_at = created_at
# #     user = User(**{"id":user_id, "username":username, "email":email, "password":hashed_password, "created_at":created_at, "updated_at":updated_at})
# #     db.save(user)

# # print("Inserted 100 user records into the users table.")