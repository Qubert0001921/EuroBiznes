from fastapi import FastAPI
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

app = FastAPI()

moneyBalance: int = 0

@app.get("/")
def root():
    return None


clients: list[WebSocket] = []

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
                    await i.send_json(json_data)
            else:
                didNotDisconnect =False
    except WebSocketDisconnect: 
        clients.remove(websocket)

