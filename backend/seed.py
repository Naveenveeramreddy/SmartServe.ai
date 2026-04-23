from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import schema
import uuid
from datetime import datetime
import bcrypt

def get_password_hash(password):
    # bcrypt works with bytes
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def seed():
    db: Session = SessionLocal()
    
    # Create tables if not exist
    schema.Base.metadata.create_all(bind=engine)
    
    # Check if we already have data
    if db.query(schema.User).first():
        print("Database already seeded.")
        return

    print("Seeding database...")
    
    # Create a test project admin/user
    admin_user = schema.User(
        user_id=uuid.uuid4(),
        email="admin@smartcafe.ai",
        hashed_password=get_password_hash("admin"),
        role="admin",
        is_verified=True
    )
    db.add(admin_user)
    
    # Create a restaurant owner
    owner_user = schema.User(
        user_id=uuid.uuid4(),
        email="owner@cafe.com",
        hashed_password=get_password_hash("password123"),
        role="restaurant",
        is_verified=True
    )
    db.add(owner_user)
    db.commit()

    # Create a restaurant
    restaurant = schema.Restaurant(
        restaurant_id=uuid.uuid4(),
        user_id=owner_user.user_id,
        name="The Daily Grind",
        location="123 Coffee Lane, Silicon Valley",
        description="Artisanal coffee and fresh pastries in a modern environment.",
        cuisine="Cafe",
        rating=4.8,
        image="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200"
    )
    db.add(restaurant)
    db.commit()

    # Add products
    products = [
        schema.Product(
            product_id=uuid.uuid4(),
            restaurant_id=restaurant.restaurant_id,
            product_name="Artisan Latte",
            category="Coffee",
            price=4.50,
            image="https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600",
            availability=True
        ),
        schema.Product(
            product_id=uuid.uuid4(),
            restaurant_id=restaurant.restaurant_id,
            product_name="Nitro Cold Brew",
            category="Coffee",
            price=4.95,
            image="https://images.unsplash.com/photo-1517701550927-30cfcb64db10?q=80&w=600",
            availability=True
        ),
        schema.Product(
            product_id=uuid.uuid4(),
            restaurant_id=restaurant.restaurant_id,
            product_name="Butter Croissant",
            category="Pastry",
            price=3.75,
            image="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600",
            availability=True
        )
    ]
    for p in products:
        db.add(p)
    
    db.commit()
    print("Seeding complete!")

if __name__ == "__main__":
    seed()
