from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List

from routers import customers, auth, inventory, orders, analytics, products, restaurants, admin
from database import engine
from models import schema

schema.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ServeSmart AI API", description="Core backend for ServeSmart AI platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(customers.router, prefix="/api/customers", tags=["Customers"])
app.include_router(restaurants.router, prefix="/api/restaurants", tags=["Restaurants"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(admin.router, prefix="/api", tags=["Admin"])

# Realtime WebSocket Manager with Rooms Support
class ConnectionManager:
    def __init__(self):
        self.rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = []
        self.rooms[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.rooms and websocket in self.rooms[room_id]:
            self.rooms[room_id].remove(websocket)
            if not self.rooms[room_id]:
                del self.rooms[room_id]

    async def broadcast_to_room(self, room_id: str, message: dict):
        if room_id in self.rooms:
            for connection in list(self.rooms[room_id]):
                try:
                    await connection.send_json(message)
                except Exception:
                    self.disconnect(connection, room_id)

# Global manager instance
ws_manager = ConnectionManager()
app.state.ws_manager = ws_manager

@app.websocket("/ws/realtime/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await ws_manager.connect(websocket, room_id)
    try:
        while True:
            # Receive data and broadcast it to the room
            data = await websocket.receive_json()
            await ws_manager.broadcast_to_room(room_id, data)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, room_id)
    except Exception as e:
        print(f"WebSocket Error: {e}")
        ws_manager.disconnect(websocket, room_id)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ServeSmart AI Backend"}
