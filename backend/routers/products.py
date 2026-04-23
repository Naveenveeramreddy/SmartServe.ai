from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from models import schema, pydantic_schemas
from database import get_db
from routers.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[pydantic_schemas.ProductResponse])
def get_products(
    restaurant_id: str = None,
    db: Session = Depends(get_db)
):
    """Public endpoint: get products for a given restaurant or all products."""
    if restaurant_id:
        products = db.query(schema.Product).filter(
            schema.Product.restaurant_id == uuid.UUID(restaurant_id),
            schema.Product.availability == True
        ).all()
    else:
        products = db.query(schema.Product).filter(schema.Product.availability == True).all()
    return products

@router.get("/mine", response_model=List[pydantic_schemas.ProductResponse])
def get_my_products(
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    """Restaurant owner gets their own products (including unavailable)."""
    if current_user.role != "restaurant":
        raise HTTPException(status_code=403, detail="Only restaurant users can access this")
    restaurant = db.query(schema.Restaurant).filter(schema.Restaurant.user_id == current_user.user_id).first()
    if not restaurant:
        return []
    return db.query(schema.Product).filter(schema.Product.restaurant_id == restaurant.restaurant_id).all()

@router.post("/", response_model=pydantic_schemas.ProductResponse)
def create_product(
    product: pydantic_schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    if current_user.role != "restaurant":
        raise HTTPException(status_code=403, detail="Not authorized")
    restaurant = db.query(schema.Restaurant).filter(schema.Restaurant.user_id == current_user.user_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant profile not found")
    db_product = schema.Product(**product.model_dump(), restaurant_id=restaurant.restaurant_id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/{product_id}", response_model=pydantic_schemas.ProductResponse)
def update_product(
    product_id: uuid.UUID,
    product: pydantic_schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    if current_user.role != "restaurant":
        raise HTTPException(status_code=403, detail="Not authorized")
    db_product = db.query(schema.Product).filter(schema.Product.product_id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.model_dump().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
def delete_product(
    product_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    if current_user.role != "restaurant":
        raise HTTPException(status_code=403, detail="Not authorized")
    db_product = db.query(schema.Product).filter(schema.Product.product_id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted"}
