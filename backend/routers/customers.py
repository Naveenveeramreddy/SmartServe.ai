from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from models import schema, pydantic_schemas
from database import get_db

router = APIRouter()

@router.get("/", response_model=List[pydantic_schemas.CustomerResponse])
def get_customers(db: Session = Depends(get_db)):
    customers = db.query(schema.Customer).all()
    return customers

@router.post("/", response_model=pydantic_schemas.CustomerResponse)
def create_customer(customer: pydantic_schemas.CustomerCreate, db: Session = Depends(get_db)):
    db_customer = schema.Customer(
        name=customer.name,
        wallet_balance=customer.wallet_balance,
        loyalty_points=customer.loyalty_points,
        visit_history=customer.visit_history,
        favorite_items=customer.favorite_items
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer
