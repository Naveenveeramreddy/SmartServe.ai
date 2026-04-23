from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from routers.auth import get_current_user
from models import schema

router = APIRouter()

@router.get("/summary")
def get_analytics_summary(
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    if current_user.role == "restaurant":
        restaurant = db.query(schema.Restaurant).filter(schema.Restaurant.user_id == current_user.user_id).first()
        if not restaurant:
            return {"error": "Restaurant not found"}

        total_revenue = db.query(func.sum(schema.Order.total_amount)).filter(
            schema.Order.restaurant_id == restaurant.restaurant_id,
            schema.Order.status != "Cancelled"
        ).scalar() or 0

        orders_count = db.query(func.count(schema.Order.order_id)).filter(
            schema.Order.restaurant_id == restaurant.restaurant_id
        ).scalar() or 0

        pending_orders = db.query(func.count(schema.Order.order_id)).filter(
            schema.Order.restaurant_id == restaurant.restaurant_id,
            schema.Order.status == "Pending"
        ).scalar() or 0

        customer_count = db.query(func.count(schema.Customer.customer_id)).scalar() or 0

        low_stock = db.query(func.count(schema.Inventory.id)).filter(
            schema.Inventory.restaurant_id == restaurant.restaurant_id,
            schema.Inventory.quantity <= schema.Inventory.minimum_level
        ).scalar() or 0

        # Top products by order count
        product_stats = db.query(
            schema.Product.product_name,
            func.sum(schema.OrderItem.quantity).label("total_sold")
        ).join(schema.OrderItem, schema.Product.product_id == schema.OrderItem.product_id)\
         .filter(schema.Product.restaurant_id == restaurant.restaurant_id)\
         .group_by(schema.Product.product_name)\
         .order_by(func.sum(schema.OrderItem.quantity).desc())\
         .limit(5).all()

        return {
            "total_revenue": round(float(total_revenue), 2),
            "orders_today": orders_count,
            "customers_inside": customer_count,
            "low_stock_items": low_stock,
            "pending_orders": pending_orders,
            "top_products": [{"name": p[0], "sold": p[1]} for p in product_stats]
        }

    elif current_user.role == "admin":
        total_revenue = db.query(func.sum(schema.Order.total_amount)).scalar() or 0
        total_orders = db.query(func.count(schema.Order.order_id)).scalar() or 0
        total_restaurants = db.query(func.count(schema.Restaurant.restaurant_id)).scalar() or 0
        total_customers = db.query(func.count(schema.Customer.customer_id)).scalar() or 0

        # Top restaurants
        top_restaurants = db.query(
            schema.Restaurant.name,
            func.sum(schema.Order.total_amount).label("revenue"),
            func.count(schema.Order.order_id).label("orders")
        ).join(schema.Order, schema.Restaurant.restaurant_id == schema.Order.restaurant_id)\
         .group_by(schema.Restaurant.name)\
         .order_by(func.sum(schema.Order.total_amount).desc())\
         .limit(5).all()

        return {
            "total_revenue": round(float(total_revenue), 2),
            "total_orders": total_orders,
            "total_restaurants": total_restaurants,
            "total_customers": total_customers,
            "top_restaurants": [{"name": r[0], "revenue": float(r[1] or 0), "orders": r[2]} for r in top_restaurants]
        }

    return {"message": "Not applicable for this role"}


@router.get("/restaurant/{restaurant_id}/daily-revenue")
def get_daily_revenue(
    restaurant_id: str,
    db: Session = Depends(get_db),
    current_user: schema.User = Depends(get_current_user)
):
    """Return last 7 days of revenue for a restaurant."""
    from datetime import datetime, timedelta
    import uuid
    result = []
    for i in range(6, -1, -1):
        day = datetime.utcnow() - timedelta(days=i)
        start = day.replace(hour=0, minute=0, second=0)
        end = day.replace(hour=23, minute=59, second=59)
        revenue = db.query(func.sum(schema.Order.total_amount)).filter(
            schema.Order.restaurant_id == uuid.UUID(restaurant_id),
            schema.Order.created_at >= start,
            schema.Order.created_at <= end,
        ).scalar() or 0
        result.append({"date": day.strftime("%a"), "revenue": round(float(revenue), 2)})
    return result
