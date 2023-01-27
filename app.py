from keycloak import KeycloakOpenID
from flask import Flask, render_template, redirect, request, make_response, jsonify,json
import graphene
from flask_cors import CORS
from keycloak import KeycloakAdmin

keycloak_openid = KeycloakOpenID(server_url="http://localhost:8080/",
                                 client_id="Flask",
                                 realm_name="TestRealm",
                                 client_secret_key="op8P3Kmk4Bx0kt2alaPTAd0n3RTVHYuI")

keycloak_admin = KeycloakAdmin(server_url="http://localhost:8080/",
                               realm_name="TestRealm",
                               client_secret_key="m83oMgFCyxgypqepq6CxPLvS6Qt6CcJx",
                               )
app = Flask(__name__)
react_url="http://localhost:3000/"
cor = CORS(app)

#graphene objects
class Item(graphene.ObjectType):
    id = graphene.String()
    name = graphene.String()
    content = graphene.String()
    time = graphene.String()
    status = graphene.Boolean()
    image = graphene.String()

class ItemInput(graphene.InputObjectType):
    id = graphene.String(required=True)
    name = graphene.String(required=True)
    content = graphene.String(required=True)
    time = graphene.String(required=True)
    status = graphene.Boolean(required=True)
    image = graphene.String(required=True)

class CreateItem(graphene.Mutation):
    class Arguments:
        itemInput=ItemInput(required=True)
    status = graphene.Boolean()
    item = graphene.Field(Item)

    def mutate(self,info,itemInput):
        item = Item(id=itemInput.id,
                    name=itemInput.name,
                    content=itemInput.content,
                    time=itemInput.time,
                    status=itemInput.status,
                    image=itemInput.image)
        status = True
        return CreateItem(item=item,status=status)

class ItemMutation(graphene.ObjectType):
    createItem = CreateItem.Field()

class ItemQuery(graphene.ObjectType):
    item=graphene.Field(Item)

class User(graphene.ObjectType):
    name = graphene.String()
    id = graphene.String()
    paid = graphene.Boolean()
    list = graphene.List(Item)

    def resolve_list(self,info):
        return userData['newList']
    def resolve_name(self,info):
        return userData['preferred_username']
    def resolve_id(self,info):
        return userData['sub']
    def resolve_paid(self,info):
        return userData['paid']

def postAttributes():
    try:
        keycloak_admin.update_user(user_id=userData['sub'],
                                payload={
                                    'attributes': { 'newList':json.dumps(userData['newList']),
                                                'paid':userData['paid']
                                                }})
    except:
        keycloak_admin.refresh_token()
        print('keycloak refresh')
        keycloak_admin.update_user(user_id=userData['sub'],
                                payload={
                                    'attributes': { 'newList':json.dumps(userData['newList']),
                                                'paid':False
                                                }})
        # keycloak_admin.refresh_token()
        
        

@app.route('/')
def hello_world():
    return render_template("login.html")

@app.route('/login',methods=['POST','GET'])
def login():
    if request.method == 'POST':
        jsonData = request.json
        token = keycloak_openid.token(jsonData['user'],jsonData['pass'])
        response = make_response(token)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

@app.route('/getGraphql',methods=['POST'])
def getData():
    if request.method == 'POST':
        jsonData = request.json
        global userData
        userData = keycloak_openid.userinfo(jsonData['access_token'])
        schema=graphene.Schema(query=User)
        result = schema.execute(jsonData['query'])
        response = make_response(result.data)
        response.headers.add("Access-Control-Allow-Origin", "*")
        print(result.data)
        return response

@app.route('/postGraphql',methods=['POST'])
def postData():
    if request.method == 'POST':
        jsonData = request.json
        # userData = keycloak_openid.userinfo(jsonData['access_token'])
        schema = graphene.Schema(query=ItemQuery,mutation=ItemMutation) 
        item_mutate = schema.execute(jsonData['query'])
        userData['newList'].append(item_mutate.data['createItem']['item'])
        postAttributes()
        response = make_response(item_mutate.data)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

@app.route('/updateGraphql',methods=['POST'])
def updateData():
    if request.method == 'POST':
        jsonData = request.json
        userData['newList']=jsonData
        postAttributes()
        response = make_response(jsonData)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

if __name__ == "__main__":
    app.run()