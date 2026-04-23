import cv2
from deepface import DeepFace
import numpy as np

class FaceAnalyzer:
    def __init__(self, threshold=10.0):
        self.threshold = threshold

    def extract_embedding(self, frame_np):
        """
        Extracts 128D embeddings using Facenet.
        Returns embedding list and the bounding box of the face.
        """
        try:
            results = DeepFace.represent(img_path=frame_np, model_name="Facenet", enforce_detection=True)
            if results and len(results) > 0:
                return results[0]["embedding"], results[0]["facial_area"]
        except Exception as e:
            pass
        return None, None

    def find_match(self, current_embedding, database_encodings):
        """
        db_encodings format: [{'customer_id': 'uuid', 'embedding': [...]}]
        Compares Euclidean distance.
        """
        best_match = None
        best_dist = float('inf')
        q_emb = np.array(current_embedding)

        for record in database_encodings:
            db_emb = np.array(record["embedding"])
            dist = np.linalg.norm(db_emb - q_emb)
            if dist < self.threshold and dist < best_dist:
                best_dist = dist
                best_match = record["customer_id"]

        return best_match, best_dist
