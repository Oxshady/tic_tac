from flask import Blueprint, render_template, request, redirect, url_for, flash
home = Blueprint('home', __name__)

@home.route('/signup', methods=['GET', 'POST'])
def home():
    return render_template('home.html')