import time

class TrackingService:
    def __init__(self):
        # Maps track_id to dictionary of data
        self.tracks = {}
        # Simple implementation to simulate DeepSORT
        
    def update_tracks(self, detections):
        """
        Takes YOLO detections and assigns them IDs over time.
        In a production DeepSORT, this would use kalman filters and appearance descriptors.
        """
        # Simulated tracker update
        current_time = time.time()
        tracked_objects = []
        
        for idx, det in enumerate(detections):
            # Assigning mock ID based on index for simulation
            track_id = f"id_{idx}"
            
            if track_id not in self.tracks:
                self.tracks[track_id] = {
                    "class": det["class"],
                    "first_seen": current_time,
                    "last_seen": current_time,
                    "features": [] # For DeepSORT appearance
                }
            else:
                self.tracks[track_id]["last_seen"] = current_time
                
            stay_duration = current_time - self.tracks[track_id]["first_seen"]
            
            tracked_objects.append({
                "track_id": track_id,
                "class": det["class"],
                "bbox": det["bbox"],
                "stay_duration": stay_duration
            })
            
        return tracked_objects
        
    def check_worker_idle(self, tracked_objects):
        alerts = []
        for obj in tracked_objects:
            if obj["class"] == "person" and obj["stay_duration"] > 300: # 5 mins
                # If we identify this person as a worker, check if inactive
                alerts.append({"type": "worker_idle", "message": f"Worker {obj['track_id']} idle for 5+ mins."})
            if obj["class"] == "cell phone":
                # Check bounding box intersection with person (simplified)
                alerts.append({"type": "worker_phone", "message": f"Phone usage detected near {obj['bbox']}"})
        return alerts
