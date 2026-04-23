import os
import cv2
import json
import time
import asyncio
import websockets
try:
    from ultralytics import YOLO
except ImportError:
    print("Warning: ultralytics not installed. Proceeding with mocking for vision processing.")

# Default configuration
RESTAURANT_ID = os.getenv("RESTAURANT_ID", "default-room-id") # Replace with actual restaurant UUID when testing
WEBSOCKET_URL = f"ws://localhost:8000/ws/realtime/{RESTAURANT_ID}"

# Track visitors in memory
visitor_data = {} # track_id -> {start_time: float, items: set, last_seen: float, face_captured: bool, orders: float}

# Load Haar Cascade for Face Detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

async def run_vision_pipeline():
    print(f"Connecting to ServeSmart AI Backend via WebSockets at {WEBSOCKET_URL}...")
    
    try:
        model = YOLO('yolov8n.pt') 
    except Exception as e:
        print("Ultralytics YOLO not found or failed to load. Using mock mode.")
        model = None

    # Connect to the backend WebSocket
    async with websockets.connect(WEBSOCKET_URL) as websocket:
        print("Connected to Cloud/Backend successfully.")
        
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("Error: Could not open local webcam.")
            return

        print("Webcam initialized. Press 'q' to quit.")

        while True:
            ret, frame = cap.read()
            if not ret: break

            detections = []
            people_count = 0
            current_time = time.time()
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            if model:
                # Use track=True for persistent IDs across frames
                results = model.track(frame, persist=True, verbose=False)
                
                if results and results[0].boxes.id is not None:
                    boxes = results[0].boxes.xyxy.cpu().numpy()
                    track_ids = results[0].boxes.id.int().cpu().numpy()
                    cls_indices = results[0].boxes.cls.int().cpu().numpy()
                    confidences = results[0].boxes.conf.cpu().numpy()

                    for box, track_id, cls_idx, conf in zip(boxes, track_ids, cls_indices, confidences):
                        x1, y1, x2, y2 = box
                        label = model.names[cls_idx]
                        
                        # Monitor People for Stay Time
                        if label == 'person':
                            people_count += 1
                            if track_id not in visitor_data:
                                visitor_data[track_id] = {
                                    "start_time": current_time, 
                                    "items": set(), 
                                    "last_seen": current_time,
                                    "face_captured": False,
                                    "order_total": 0.0
                                }
                            else:
                                visitor_data[track_id]["last_seen"] = current_time
                            
                            # Face Detection within Person Box
                            if not visitor_data[track_id]["face_captured"]:
                                roi_gray = gray[int(y1):int(y2), int(x1):int(x2)]
                                faces = face_cascade.detectMultiScale(roi_gray, 1.3, 5)
                                if len(faces) > 0:
                                    visitor_data[track_id]["face_captured"] = True
                                    print(f"Face Captured for Visitor #{track_id}")

                            stay_duration = int(current_time - visitor_data[track_id]["start_time"])
                            
                            # Scaling for frontend
                            h_img, w_img = frame.shape[:2]
                            detections.append({
                                "id": int(track_id),
                                "type": "Customer",
                                "x": (x1 / w_img) * 100,
                                "y": (y1 / h_img) * 100,
                                "w": ((x2 - x1) / w_img) * 100,
                                "h": ((y2 - y1) / h_img) * 100,
                                "stay_duration": f"{stay_duration//60}m {stay_duration%60}s",
                                "face_captured": visitor_data[track_id]["face_captured"],
                                "confidence": float(conf)
                            })
                            
                            # Draw preview
                            color = (16, 185, 129) if visitor_data[track_id]["face_captured"] else (0, 165, 255)
                            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)
                            cv2.putText(frame, f"ID:{track_id} {stay_duration}s", (int(x1), int(y1)-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

                        # Detect items (simulating interaction)
                        if label in ['bottle', 'cup', 'cell phone']:
                             # Find overlap with nearest person
                             for t_id, data in visitor_data.items():
                                 if data["last_seen"] == current_time:
                                     data["items"].add(label)

                # Clean up old visitors not seen for > 15 seconds
                inactive_ids = [t_id for t_id, data in visitor_data.items() if current_time - data["last_seen"] > 15]
                for t_id in inactive_ids: del visitor_data[t_id]

                # Prepare payload
                event_data = {
                    "type": "AI_DETECTION_UPDATE",
                    "timestamp": current_time,
                    "detections": detections,
                    "active_visitors": [
                        {
                            "id": t_id, 
                            "duration": int(current_time - data["start_time"]),
                            "items": list(data["items"]),
                            "face_captured": data["face_captured"],
                            "order_total": data["order_total"]
                        } for t_id, data in visitor_data.items()
                    ],
                    "metrics": {
                        "active_customers": people_count,
                        "waiting": max(0, people_count - 1),
                        "fps": 30
                    }
                }

                try:
                    await websocket.send(json.dumps(event_data))
                except Exception as e:
                    print(f"WS Error: {e}")

            cv2.imshow('ServeSmart AI - Advanced Vision', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'): break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    asyncio.run(run_vision_pipeline())
