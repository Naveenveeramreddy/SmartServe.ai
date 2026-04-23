from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CustomerBase(BaseModel):
    name: str
    wallet_balance: float = 0.0
    loyalty_points: int = 0
    favorite_items: Optional[List[str]] = []

class CustomerCreate(CustomerBase):
    face_encoding_base64: str

class CustomerResponse(CustomerBase):
    customer_id: str
    visit_history: int

class WorkerBase(BaseModel):
    name: str
    role: str

# Define other Pydantic models here as needed for easy validation
