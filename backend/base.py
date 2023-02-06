from flask import Flask, url_for, redirect, request, jsonify
from authlib.integrations.flask_client import OAuth
from flask_cors import CORS
import requests

app = Flask(__name__)
app.config["DEBUG"] = True

CORS(app)

oauth = OAuth(app)

app.config['SECRET_KEY'] = "SECRET KEY!"
app.config['SPLITWISE_CLIENT_ID'] = "WODPllgL2d66VFJqGQZRJnBQZq657Qh4reBm1IjM"
app.config['SPLITWISE_CLIENT_SECRET'] = "P8BRx1Xei0RnJz69Rz8CZt4N0DS7NMMEl72Rw2Om"

SPLITWISE_BASE_URL = "https://secure.splitwise.com/"
SPLITWISE_API_VERSION = "api/v3.0"

splitwise = oauth.register(
    name='splitwise',
    client_id=app.config["SPLITWISE_CLIENT_ID"],
    client_secret=app.config["SPLITWISE_CLIENT_SECRET"],
    access_token_url=SPLITWISE_BASE_URL + SPLITWISE_API_VERSION + "oauth/token",
    access_token_params=None,
    authorize_url=SPLITWISE_BASE_URL + "oauth/authorize",
    authorize_params=None,
    api_base_url=SPLITWISE_BASE_URL + SPLITWISE_API_VERSION,
    # userinfo_endpoint = 'https://openidconnect.googleapis.com/v1/userinfo',  # This is only needed if using openId to fetch user info
    client_kwargs={'scope': 'email profile'},
)


@app.route('/')
def home():
    return "Hello!"


@app.route('/get_access_token')
def getAccessToken():
    print(request.args)
    code = request.args["code"]

    params = {
        "client_id": app.config["SPLITWISE_CLIENT_ID"],
        "client_secret": app.config["SPLITWISE_CLIENT_SECRET"],
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": "http://localhost:3000/"
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded",
               "Accept": "application/json"}
    response = requests.post(
        "https://secure.splitwise.com/oauth/token", data=params, headers=headers)
    return response.json()


app.run()
