import cv2
from ultralytics import YOLO

class ObjectDetector:
    def __init__(self, model_name='yolov8n.pt'):
        # Automatically downloads YOLOv8 nano model if not present
        self.model = YOLO(model_name)
        # Assuming COCO classes: 0: person, 67: cell phone, 73: book/laptop, 41: cup, 44: bottle, 55: cake
        self.target_classes = [0, 67, 41, 44, 55, 54] # 54=sandwich

    def detect(self, frame):
        """
        Runs YOLOv8 on the frame and returns bounding boxes of targets.
        """
        results = self.model(frame, classes=self.target_classes, verbose=False)
        detections = []
        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                cls_name = self.model.names[cls_id]
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = float(box.conf[0])
                
                detections.append({
                    "class": cls_name,
                    "confidence": conf,
                    "bbox": [x1, y1, x2, y2]
                })
        return detections
