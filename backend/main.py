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
    global moneyBalance
    await manager.connect(websocket) 
    for i in manager.active_connections:
        print(i)
    try:
        didNotDisconnect = True
        while didNotDisconnect:  
            jsondData = await websocket.receive_text() #never use websocket.receive()!!!!!
            data = json.loads(jsondData)
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
    print(doesUserExist)
    if  doesUserExist == False:
        users.append(user)

        jsonData = {
            "eventType" : EventTypes.newUser,
            "data" : json.dumps(users, default=LoginModel.loginModelToJson)
        }
        await manager.broadcast_json(jsonData)
        print(json.dumps(users, default=LoginModel.loginModelToJson))
        print(user.id)
        print(user.name)
        return user
    else:
        jsonData = {
            "eventType" : EventTypes.newUser,
            "data" : json.dumps(users, default=LoginModel.loginModelToJson)
        }
        await manager.broadcast_json(jsonData)
        return doesUserExist

    



if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
