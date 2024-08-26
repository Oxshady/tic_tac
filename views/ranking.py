from flask import Flask, jsonify, render_template, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

rankings = [
    {"id": 1, "name": "Ali", "win": 5, "loss": 2, "draw": 0},
    {"id": 2, "name": "Fatima", "win": 4, "loss": 3, "draw": 1},
    {"id": 3, "name": "Mohammed", "win": 6, "loss": 1, "draw": 1},
    {"id": 4, "name": "Sarah", "win": 5, "loss": 3, "draw": 2},
    {"id": 5, "name": "Youssef", "win": 4, "loss": 4, "draw": 2},
]

for i in rankings:
    i['score'] = i.get('win')*3 + i.get('draw')*1 - i.get('loss')*2


@app.route('/api/ranking/<int:ranking_id>', methods=['GET'])
def get_ranking(ranking_id):
    for search_rank in rankings:
        if search_rank.get('id') == ranking_id:
            return jsonify(search_rank)
    return jsonify({}), 404

@app.route('/api/ranking', methods=['GET','PUT'])
def get_rankings():
    sort_by = request.args.get('sort_by')
    if sort_by == 'win':
        ranking_sorted = sorted(rankings, key=lambda x: x['win'])
    elif sort_by == 'loss':
        ranking_sorted = sorted(rankings, key=lambda x: x['loss'])
    elif sort_by == 'draw':
        ranking_sorted = sorted(rankings, key=lambda x: x['draw'])
    elif sort_by == 'score':
        ranking_sorted = sorted(rankings, key=lambda x: x['score'])
    return jsonify(ranking_sorted)

@app.route('/')
def index():
    """Render the HTML page."""
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
