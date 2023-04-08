from typing import Dict, List, TypedDict
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

    class Picture(TypedDict):
        small: str
        medium: str
        large: str
    
    class Person(TypedDict):
        id: int
        first_name: str
        last_name: str
        email: str
        registration_status: str
        picture: Picture
        groups: List[str]
        balance: List[float]
        updated_at: str

    class FriendsListResponse(TypedDict):
        friends: List[Person]
    
    class UserInfoResponse(TypedDict):
        user: Person

    class BasicFriendInfo(TypedDict):
        first_name: str
        last_name: str
        id: int
        avatar: str

    token = request.args["token"]
    search = request.args["search"].lower()
    response = requests.get("https://secure.splitwise.com/api/v3.0/get_friends", headers={
        "Authorization": f"Bearer {token}"
    })
    friends_list_response: FriendsListResponse = response.json()

    friends_list: List[BasicFriendInfo] = [{"first_name": friend["first_name"],
                    "last_name": friend["last_name"],
                     "id": friend["id"],
                     "avatar": friend["picture"]["large"]} for friend in friends_list_response["friends"]]
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


    class Picture(TypedDict):
        small: str
        medium: str
        large: str


    class Balance(TypedDict):
        currency_code: str
        amount: str


    class Member(TypedDict):
        id: int
        first_name: str
        last_name: str
        email: str
        registration_status: str
        picture: Picture
        balance: List[Balance]


    class Avatar(TypedDict):
        original: None
        xxlarge: str
        xlarge: str
        large: str
        medium: str
        small: str


    class OriginalDebt(TypedDict):
        from_: int
        to: int
        amount: str
        currency_code: str


    class SimplifiedDebt(TypedDict):
        from_: int
        to: int
        amount: str
        currency_code: str


    class CoverPhoto(TypedDict):
        xxlarge: str
        xlarge: str


    class Group(TypedDict):
        id: int
        name: str
        group_type: str
        updated_at: str
        simplify_by_default: bool
        members: List[Member]
        original_debts: List[OriginalDebt]
        simplified_debts: List[SimplifiedDebt]
        avatar: Avatar
        custom_avatar: bool
        cover_photo: CoverPhoto
        invite_link: str


    class SplitwiseData(TypedDict):
        groups: List[Group]


    class CommonGroup(TypedDict):
        id: int
        name: str

    participants = request.args["participants"].split(",")
    participants = [int(participant) for participant in participants]
    token = request.args["token"]
    response = requests.get("https://secure.splitwise.com/api/v3.0/get_groups", headers={
        "Authorization": f"Bearer {token}"
    })
    groups: SplitwiseData = response.json()
    groups_list = []

    for group in groups["groups"]:
        groups_list.append(group)
        members = groups_list[-1]["members"]
        groups_list[-1]["members"] = set([member["id"]
                                          for member in members])

    common_groups: List[CommonGroup] = []
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

    class Expense(TypedDict):
        token: str
        cost: str
        description: str
        splitwise_group: int
        date: str
        paid_by: int
        participants: List[int]
        splits: Dict[str, str]

    if request.json is None:
        return "No expense provided", 400
    expense: Expense = request.json
    body = {
        "cost": expense["cost"],
        "description": expense["description"],
        "group_id": expense["splitwise_group"],
        "date": expense["date"] + "T11:00:00Z"
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
    expense_info = response.json()["expenses"][0]

    if response.status_code == 200:
        return jsonify({"id": expense_info["id"]}), 200

    return "Failure", 400

@app.route("/add_comments", methods=["POST"])
def addComments():

    class Participant(TypedDict):
        id: int
        first_name: str
        last_name: str


    class Expense(TypedDict):
        token: str
        expenseID: int
        participants: List[Participant]
        items: List[List]

    if request.json is None:
        return "No expense provided", 400

    expense: Expense = request.json
    header = [participant["first_name"] + " " + participant["last_name"] if participant["last_name"] is not None else participant["first_name"] for participant in expense["participants"]]
    header = ["Item"] + header + ["Item Cost"]
    comments = []
    comments.append(",".join(header))
    for item in expense["items"]:
        row = []
        row.append(item[0])
        for participant in expense["participants"]:
            key = str(participant["id"])
            if key not in item[2]:
                row.append("0")
            else:
                row.append(str(item[2][key]))
        row.append(str(item[1]))
        comments.append(",".join(row))
        
    response = requests.post("https://secure.splitwise.com/api/v3.0/create_comment", headers={
        "Authorization": f"Bearer {expense['token']}"
    }, data={
        "expense_id": expense["expenseID"],
        "content": "\n".join(comments)
    })
    if response.status_code == 200:
        return "Success", 200
    return "Failure", 400



if __name__ == "__main__":
    port = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=port)
