from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from models import schema, pydantic_schemas
from database import get_db
from routers.auth import get_current_user

router = APIRouter()

@router.get("/admin/users")
def list_all_users(
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    users = db.query(schema.User).all()
    return [{"user_id": str(u.user_id), "email": u.email, "phone": u.phone, "role": u.role, "is_verified": u.is_verified, "created_at": str(u.created_at)} for u in users]

@router.get("/admin/restaurants")
def list_all_restaurants_admin(
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    restaurants = db.query(schema.Restaurant).all()
    result = []
    for r in restaurants:
        order_count = db.query(schema.Order).filter(schema.Order.restaurant_id == r.restaurant_id).count()
        result.append({
            "restaurant_id": str(r.restaurant_id),
            "name": r.name,
            "location": r.location,
            "order_count": order_count,
            "created_at": str(r.created_at)
        })
    return result

@router.patch("/admin/users/{user_id}/suspend")
def suspend_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    user = db.query(schema.User).filter(schema.User.user_id == uuid.UUID(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_verified = False
    db.commit()
    return {"message": f"User {user_id} suspended"}

@router.patch("/admin/users/{user_id}/approve")
def approve_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    user = db.query(schema.User).filter(schema.User.user_id == uuid.UUID(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_verified = True
    db.commit()
    return {"message": f"User {user_id} approved"}
