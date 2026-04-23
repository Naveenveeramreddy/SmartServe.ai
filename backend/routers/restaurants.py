from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from models import schema, pydantic_schemas
from database import get_db
from routers.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[pydantic_schemas.RestaurantResponse])
def get_all_restaurants(db: Session = Depends(get_db)):
    """Public endpoint: get all restaurants (for customer browsing)."""
    return db.query(schema.Restaurant).all()

@router.get("/me", response_model=pydantic_schemas.RestaurantResponse)
def get_my_restaurant(
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    restaurant = db.query(schema.Restaurant).filter(schema.Restaurant.user_id == current_user.user_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant

@router.patch("/me")
def update_my_restaurant(
    update_data: dict,
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    if current_user.role != "restaurant":
        raise HTTPException(status_code=403, detail="Not authorized")
    restaurant = db.query(schema.Restaurant).filter(schema.Restaurant.user_id == current_user.user_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    for key, value in update_data.items():
        if hasattr(restaurant, key):
            setattr(restaurant, key, value)
    db.commit()
    db.refresh(restaurant)
    return restaurant

@router.get("/{restaurant_id}")
def get_restaurant(restaurant_id: str, db: Session = Depends(get_db)):
    restaurant = db.query(schema.Restaurant).filter(
        schema.Restaurant.restaurant_id == uuid.UUID(restaurant_id)
    ).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant

@router.get("/{restaurant_id}/customers")
def get_checkedin_customers(
    restaurant_id: str,
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    """Get customers who recently ordered at this restaurant (simulates check-in)."""
    if current_user.role not in ["restaurant", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    # Customers who placed at least one order here
    orders = db.query(schema.Order).filter(
        schema.Order.restaurant_id == uuid.UUID(restaurant_id),
        schema.Order.status.in_(["Pending", "Cooking", "Ready"])
    ).all()
    customer_ids = list(set([str(o.customer_id) for o in orders if o.customer_id]))
    customers_data = []
    for cid in customer_ids:
        customer = db.query(schema.Customer).filter(schema.Customer.customer_id == uuid.UUID(cid)).first()
        if customer:
            customers_data.append({
                "customer_id": str(customer.customer_id),
                "name": customer.name,
                "loyalty_points": customer.loyalty_points,
                "favorite_items": customer.favorite_items,
                "visit_history": customer.visit_history
            })
    return customers_data
