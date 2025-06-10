from fastapi import FastAPI, WebSocket, WebSocketDisconnect # type: ignore
from fastapi.responses import HTMLResponse # type: ignore
from models.loginModel import LoginModel
from userRequests.loginRequest import LoginRequest
import uuid
import uvicorn # type: ignore
import json
from connectionManager import ConnectionManager
from eventTypes import EventTypes
from fastapi.middleware.cors import CORSMiddleware  # type: ignore

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

moneyBalance: int = 0

@app.get("/")
def root():
    return None


manager = ConnectionManager()
users: list[LoginModel] = []




@app.websocket_route("/ws")
async def websocket_endpoint(websocket: WebSocket):
    def findUser(idToFind):
        for i in users:
            if i.id == idToFind:
                print('cos')
                print(users.index(i))
                return users.index(i)
    global moneyBalance
    await manager.connect(websocket) 
    for i in manager.active_connections:  
        print(i)
    try:
        didNotDisconnect = True
        while didNotDisconnect:  
            jsonData = await websocket.receive_text() #never use websocket.receive()!!!!!
            data = json.loads(jsonData)
            print(json.dumps(jsonData, default=LoginModel.loginModelToJson))
            eventType = data["eventType"]
            data = data["data"]
            
            if eventType == EventTypes.sendMoney:
                senderIndex = findUser(data["senderID"])
                receiverIndex = findUser(data["receiverID"])
                users[senderIndex].money -= int(data["moneyAmount"])
                users[receiverIndex].money += int(data["moneyAmount"])

                json_data_to_send = {
                    "eventType": EventTypes.broadcastUsers,
                    "data": json.dumps(users, default=LoginModel.loginModelToJson)
                }
                await manager.broadcast_json(json_data_to_send)
                        
    except WebSocketDisconnect: 
        manager.disconnect(websocket)
        




@app.post("/login")
async def login(loginRequest: LoginRequest):
    def checkIfUserExists(userName: str, usersList: list[LoginModel]):
        for i in usersList:
            if i.name == userName:
                return i
        return False
    
    user = LoginModel()
    user.name = loginRequest.login
    user.id = str(uuid.uuid4())
    doesUserExist = checkIfUserExists(userName=user.name, usersList=users)
    #print(doesUserExist)
    if  doesUserExist == False:
        users.append(user)

        jsonData = {
            "eventType" : EventTypes.broadcastUsers,
            "data" : json.dumps(users, default=LoginModel.loginModelToJson)
        }
        await manager.broadcast_json(jsonData)
        print(json.dumps(users, default=LoginModel.loginModelToJson))
        print(user.id)
        print(user.name)
        return user
    else:
        jsonData = {
            "eventType" : EventTypes.broadcastUsers,
            "data" : json.dumps(users, default=LoginModel.loginModelToJson)
        }
        await manager.broadcast_json(jsonData)
        return doesUserExist


@app.get("/users")
def get_users():
    return users
    



if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
