from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime, date
from uuid import UUID

class CustomBaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# User/Auth
class UserLogin(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str

class OTPRequestSchema(BaseModel):
    identifier: str

class UserRegister(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str
    role: str = "customer"
    otp_code: str

class AuthToken(BaseModel):
    access_token: str
    token_type: str

class UserResponse(CustomBaseModel):
    user_id: UUID
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str
    is_verified: bool = False
    created_at: datetime

# Restaurant
class RestaurantBase(CustomBaseModel):
    name: str
    location: Optional[str] = None
    description: Optional[str] = None
    cuisine: Optional[str] = None
    rating: Optional[float] = None
    image: Optional[str] = None

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantResponse(RestaurantBase):
    restaurant_id: UUID
    user_id: UUID
    created_at: datetime

# Product
class ProductBase(CustomBaseModel):
    product_name: str
    category: str
    price: float
    image: Optional[str] = None
    availability: bool = True

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    product_id: UUID
    restaurant_id: UUID
    created_at: datetime

# Customer
class CustomerBase(CustomBaseModel):
    name: str
    wallet_balance: float = 0.0
    loyalty_points: int = 0
    visit_history: int = 0
    favorite_items: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    customer_id: UUID
    user_id: Optional[UUID] = None
    created_at: datetime

# Inventory
class InventoryBase(CustomBaseModel):
    quantity: float
    minimum_level: float
    expiry_date: Optional[date] = None

class InventoryCreate(InventoryBase):
    ingredient_name: str

class InventoryResponse(InventoryBase):
    id: UUID
    ingredient_name: str
    restaurant_id: UUID
    last_updated: datetime

# Order
class OrderItemSchema(CustomBaseModel):
    product_id: UUID
    quantity: int
    price_at_time: float

class OrderBase(CustomBaseModel):
    customer_id: Optional[UUID] = None
    table_number: Optional[str] = None
    total_amount: float
    status: str = "Pending"
    priority: int = 0

class OrderCreate(OrderBase):
    items: List[OrderItemSchema]

class OrderResponse(OrderBase):
    order_id: UUID
    restaurant_id: UUID
    created_at: datetime
    
class AlertResponse(CustomBaseModel):
    id: UUID
    type: str
    message: str
    is_resolved: bool
    created_at: datetime
