from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import schema, pydantic_schemas
from database import get_db
from routers.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[pydantic_schemas.InventoryResponse])
def get_inventory(db: Session = Depends(get_db), current_user: schema.User = Depends(get_current_user)):
    if current_user.role != "restaurant":
        raise HTTPException(status_code=403, detail="Not authorized")
    restaurant = db.query(schema.Restaurant).filter(schema.Restaurant.user_id == current_user.user_id).first()
    inventory = db.query(schema.Inventory).filter(schema.Inventory.restaurant_id == restaurant.restaurant_id).all()
    return inventory

@router.post("/", response_model=pydantic_schemas.InventoryResponse)
def add_inventory(item: pydantic_schemas.InventoryCreate, db: Session = Depends(get_db), current_user: schema.User = Depends(get_current_user)):
    if current_user.role != "restaurant":
        raise HTTPException(status_code=403, detail="Not authorized")
    restaurant = db.query(schema.Restaurant).filter(schema.Restaurant.user_id == current_user.user_id).first()
    
    db_item = db.query(schema.Inventory).filter(
        schema.Inventory.restaurant_id == restaurant.restaurant_id, 
        schema.Inventory.ingredient_name == item.ingredient_name
    ).first()
    
    if db_item:
        db_item.quantity += item.quantity
        db_item.minimum_level = item.minimum_level
        if item.expiry_date:
            db_item.expiry_date = item.expiry_date
    else:
        db_item = schema.Inventory(
            **item.model_dump(),
            restaurant_id=restaurant.restaurant_id
        )
        db.add(db_item)
        
    db.commit()
    db.refresh(db_item)
    return db_item
