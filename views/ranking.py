from models import db
from flask import jsonify, Blueprint, request,g
from models.model import Ranks

ranking = Blueprint('ranking',__name__)

rankings = db.all(Ranks)
rankings_list = [ i.to_dict() for i in rankings]
for i in rankings_list:
    i['score'] = i.get('win')*3 + i.get('draw')*1 - i.get('loss')*2

@ranking.route('/api/ranking/<ranking_id>', methods=['GET'])
def get_ranking(ranking_id):
    for search_rank in rankings_list:
        if search_rank.get('id') == ranking_id:
            return jsonify(search_rank)
    return jsonify({}), 404

@ranking.route('/api/ranking', methods=['GET','PUT'])
def get_rankings():
    if request.method == "PUT":
        data = request.get_json()
        if data is None:
            return jsonify({}), 400
        for rank in data:
            r = Ranks(**rank)
            db.save(r)
        return jsonify({}), 201
    ranking_sorted = None
    sort_by = request.args.get('sort_by')
    if sort_by == 'win':
        ranking_sorted = sorted(rankings_list, key=lambda x: x['win'])
    elif sort_by == 'loss':
        ranking_sorted = sorted(rankings_list, key=lambda x: x['loss'])
    elif sort_by == 'draw':
        ranking_sorted = sorted(rankings_list, key=lambda x: x['draw'])
    elif sort_by == 'score':
        ranking_sorted = sorted(rankings_list, key=lambda x: x['score'])
    return jsonify(ranking_sorted)
