from fastapi import FastAPI
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from models.loginModel import LoginModel
from userRequests.loginRequest import LoginRequest
import uuid
import uvicorn # type: ignore
import json

app = FastAPI()

moneyBalance: int = 0

@app.get("/")
def root():
    return None


clients: list[WebSocket] = []
users: list[LoginModel] = []

@app.websocket_route("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global moneyBalance
    await websocket.accept()
    clients.append(websocket)  
    try:
        didNotDisconnect = True
        while didNotDisconnect:  
            data = await websocket.receive()
            if data['type'] == "websocket.receive":
                print(data)
                money: int = int(data["text"]) 
                moneyBalance += money
                json_data = {
                    "balance":moneyBalance
                }
                for i in clients:
                    await i.send_text(json.dumps(json_data))
            else:
                didNotDisconnect =False
    except WebSocketDisconnect: 
        clients.remove(websocket)

@app.post("/login")
def login(loginRequest: LoginRequest):
    user = LoginModel()
    user.name = loginRequest.login
    user.id = str(uuid.uuid4())
    users.append(user)
    print(user)
    return user



if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)
