from fastapi import FastAPI, WebSocket, WebSocketDisconnect # type: ignore
import json
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast_json(self, jsonData):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(jsonData)) #json data
            except (WebSocketDisconnect):
                self.disconnect(connection)

