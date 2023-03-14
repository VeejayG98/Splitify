from flask import Flask, url_for, redirect, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

SPLITWISE_CLIENT_ID = os.getenv("SPLITWISE_CLIENT_ID")
SPLITWISE_CLIENT_SECRET = os.getenv("SPLITWISE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

app = Flask(__name__)
app.config["DEBUG"] = False

CORS(app)

app.config['SECRET_KEY'] = "SECRET KEY!"
app.config['SPLITWISE_CLIENT_ID'] = SPLITWISE_CLIENT_ID
app.config['SPLITWISE_CLIENT_SECRET'] = SPLITWISE_CLIENT_SECRET

SPLITWISE_BASE_URL = "https://secure.splitwise.com/"
SPLITWISE_API_VERSION = "api/v3.0"


@app.route('/')
def home():
    return "Hello!"

@app.route("/get_client_id")
def getClientID():
    return jsonify({"client_id": app.config["SPLITWISE_CLIENT_ID"]}), 200

@app.route('/get_access_token')
def getAccessToken():
    print(request.args)
    code = request.args["code"]
    state = request.args['state']
    if state != "SPLITIFY_APP":
        return "State doesnt match", 404

    params = {
        "client_id": app.config["SPLITWISE_CLIENT_ID"],
        "client_secret": app.config["SPLITWISE_CLIENT_SECRET"],
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded",
               "Accept": "application/json"}
    response = requests.post(
        "https://secure.splitwise.com/oauth/token", data=params, headers=headers)
    return response.json()


@app.route("/getUserAvatar")
def getUserAvatar():
    token = request.args["token"]
    response = requests.get("https://secure.splitwise.com/api/v3.0/get_current_user", headers={
        "Authorization": f"Bearer {token}"
    })
    user_info = response.json()

    return jsonify({"avatar": user_info["user"]["picture"]["large"]}), 200


@app.route("/getParticipants")
def getParticipants():
    token = request.args["token"]
    search = request.args["search"].lower()
    response = requests.get("https://secure.splitwise.com/api/v3.0/get_friends", headers={
        "Authorization": f"Bearer {token}"
    })
    friends_list = response.json()
    # print(friends_list)

    # if search:
    #     new_friends_list = []
    #     for friend in friends_list["friends"]:
    #         if friend["first_name"].startswith(search) or friend["last_name"].startswith(search):
    #             new_friends_list.append({"first_name": friend["first_name"],
    #                                      "last_name": friend["last_name"],
    #                                      "id": friend["id"],
    #                                      "avatar": friend["picture"]["large"]})

    #     friends_list = new_friends_list
    # else:
    friends_list = [{"first_name": friend["first_name"],
                    "last_name": friend["last_name"],
                     "id": friend["id"],
                     "avatar": friend["picture"]["large"]} for friend in friends_list["friends"]]
    response = requests.get("https://secure.splitwise.com/api/v3.0/get_current_user", headers={
        "Authorization": f"Bearer {token}"
    })
    user_info = response.json()["user"]
    friends_list.append({"first_name": user_info["first_name"],
                         "last_name": user_info["last_name"],
                         "id": user_info["id"],
                         "avatar": user_info["picture"]["large"]})
    return jsonify({"friends": friends_list}), 200


@app.route("/find_common_groups")
def findCommonGroups():
    participants = request.args["participants"].split(",")
    participants = [int(participant) for participant in participants]
    token = request.args["token"]
    response = requests.get("https://secure.splitwise.com/api/v3.0/get_groups", headers={
        "Authorization": f"Bearer {token}"
    })
    groups = response.json()
    groups_list = []

    for group in groups["groups"]:
        groups_list.append(group)
        members = groups_list[-1]["members"]
        groups_list[-1]["members"] = set([member["id"]
                                          for member in members])

    common_groups = []
    for group in groups_list:
        isCommon = True
        for participant in participants:
            if participant not in group["members"]:
                isCommon = False
                break
        if isCommon:
            common_groups.append({"id": group["id"], "name": group["name"]})

    return jsonify({"common_groups": common_groups}), 200


@app.route("/add_expense", methods=["POST"])
def addExpense():
    expense = request.json
    body = {
        "cost": expense["cost"],
        "description": expense["description"],
        "group_id": expense["splitwise_group"]
    }

    for i, participant in enumerate(expense["participants"]):
        user_key = f"users__{i}__"
        body[user_key + "user_id"] = participant
        if participant == expense["paid_by"]:
            body[user_key + "paid_share"] = str(expense["cost"])
        else:
            body[user_key + "paid_share"] = "0"
        body[user_key +
             "owed_share"] = str(expense["splits"][str(participant)])


    response = requests.post("https://secure.splitwise.com/api/v3.0/create_expense", headers={
        "Authorization": f"Bearer {expense['token']}"
    },
        data=body)


    if response.status_code == 200:
        return "Success", 200

    return "Failure", 400

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=port)
