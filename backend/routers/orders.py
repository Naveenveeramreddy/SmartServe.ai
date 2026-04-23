from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from models import schema, pydantic_schemas
from database import get_db
from routers.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[pydantic_schemas.OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    if current_user.role == "restaurant":
        restaurant = db.query(schema.Restaurant).filter(schema.Restaurant.user_id == current_user.user_id).first()
        if not restaurant:
            return []
        orders = db.query(schema.Order).filter(
            schema.Order.restaurant_id == restaurant.restaurant_id
        ).order_by(schema.Order.created_at.desc()).all()
    elif current_user.role == "customer":
        customer = db.query(schema.Customer).filter(schema.Customer.user_id == current_user.user_id).first()
        if not customer:
            return []
        orders = db.query(schema.Order).filter(
            schema.Order.customer_id == customer.customer_id
        ).order_by(schema.Order.created_at.desc()).all()
    else:  # Admin
        orders = db.query(schema.Order).order_by(schema.Order.created_at.desc()).all()
    return orders

@router.post("/", response_model=pydantic_schemas.OrderResponse)
def create_order(
    order_data: pydantic_schemas.OrderCreate,
    restaurant_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    customer_id = order_data.customer_id
    if current_user.role == "customer":
        customer = db.query(schema.Customer).filter(schema.Customer.user_id == current_user.user_id).first()
        if customer:
            customer_id = customer.customer_id

    db_order = schema.Order(
        restaurant_id=restaurant_id,
        customer_id=customer_id,
        table_number=order_data.table_number,
        total_amount=order_data.total_amount,
        status="Pending",
        priority=order_data.priority
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Trigger Real-time update
    from main import ws_manager
    import asyncio
    asyncio.run(ws_manager.broadcast_to_room("default-room-id", {"type": "ORDER_UPDATE"}))

    for item in order_data.items:
        db_item = schema.OrderItem(
            order_id=db_order.order_id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_time=item.price_at_time
        )
        db.add(db_item)
    db.commit()
    return db_order

@router.patch("/{order_id}/status")
def update_order_status(
    order_id: uuid.UUID,
    status_update: dict,
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    valid_statuses = ["Pending", "Cooking", "Ready", "Completed", "Cancelled"]
    new_status = status_update.get("status", "")
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")

    db_order = db.query(schema.Order).filter(schema.Order.order_id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Authorization check
    if current_user.role == "restaurant":
        restaurant = db.query(schema.Restaurant).filter(schema.Restaurant.user_id == current_user.user_id).first()
        if str(db_order.restaurant_id) != str(restaurant.restaurant_id):
            raise HTTPException(status_code=403, detail="Not authorized")

    db_order.status = new_status
    db.commit()
    db.refresh(db_order)

    # Trigger Real-time update
    from main import ws_manager
    import asyncio
    asyncio.run(ws_manager.broadcast_to_room("default-room-id", {"type": "ORDER_UPDATE"}))

    return {"order_id": str(db_order.order_id), "status": db_order.status}

@router.get("/{order_id}/items")
def get_order_items(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    items = db.query(schema.OrderItem).filter(schema.OrderItem.order_id == order_id).all()
    result = []
    for item in items:
        product = db.query(schema.Product).filter(schema.Product.product_id == item.product_id).first()
        result.append({
            "product_id": str(item.product_id),
            "product_name": product.product_name if product else "Unknown",
            "quantity": item.quantity,
            "price_at_time": item.price_at_time
        })
    return result
