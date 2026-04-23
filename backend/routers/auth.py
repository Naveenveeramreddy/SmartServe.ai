from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
import uuid
import random

from models import schema, pydantic_schemas
from database import get_db

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-123")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week

import bcrypt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
router = APIRouter()

def verify_password(plain_password, hashed_password):
    # bcrypt works with bytes
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

def get_password_hash(password):
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(schema.User).filter(schema.User.user_id == uuid.UUID(user_id)).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register/request-otp")
def request_otp(payload: pydantic_schemas.OTPRequestSchema, db: Session = Depends(get_db)):
    identifier = payload.identifier.strip()
    if not identifier:
        raise HTTPException(status_code=400, detail="Identifier is required")

    # Generate a 6-digit OTP
    otp_code = str(random.randint(100000, 999999))
    
    # Check if a user already exists with this email/phone
    db_user = db.query(schema.User).filter(
        (schema.User.email == identifier) | (schema.User.phone == identifier)
    ).first()
    
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered with this identifier")
        
    # Store OTP in DB
    expires = datetime.utcnow() + timedelta(minutes=10)
    db_otp = schema.OTPRequest(identifier=identifier, otp_code=otp_code, expires_at=expires)
    db.add(db_otp)
    db.commit()
    
    # Mock sending OTP
    print(f"\n{'='*40}\n[MOCK EMAIL/SMS] OTP for {identifier} is: {otp_code}\n{'='*40}\n")
    
    return {"message": f"OTP sent to {identifier}"}

@router.post("/register", response_model=pydantic_schemas.UserResponse)
def register(user: pydantic_schemas.UserRegister, db: Session = Depends(get_db)):
    identifier = user.email or user.phone
    if not identifier:
         raise HTTPException(status_code=400, detail="Email or phone is required")
         
    # Validate OTP
    db_otp = db.query(schema.OTPRequest).filter(
        schema.OTPRequest.identifier == identifier,
        schema.OTPRequest.otp_code == user.otp_code
    ).order_by(schema.OTPRequest.created_at.desc()).first()
    
    if not db_otp or db_otp.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    db_user = db.query(schema.User).filter(
        (schema.User.email == user.email) | (schema.User.phone == user.phone)
    ).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")
    
    hashed_pwd = get_password_hash(user.password)
    new_user = schema.User(
        email=user.email, 
        phone=user.phone, 
        hashed_password=hashed_pwd, 
        role=user.role, 
        is_verified=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Delete used OTP
    db.delete(db_otp)
    db.commit()
    
    # Auto-create associated profile based on role
    if user.role == "restaurant":
        new_restaurant = schema.Restaurant(user_id=new_user.user_id, name=f"{user.name}'s Cafe")
        db.add(new_restaurant)
        db.commit()
    elif user.role == "customer":
        new_customer = schema.Customer(user_id=new_user.user_id, name=user.name)
        db.add(new_customer)
        db.commit()
        
    return new_user

@router.post("/login", response_model=pydantic_schemas.AuthToken)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(schema.User).filter(
        (schema.User.email == form_data.username) | (schema.User.phone == form_data.username)
    ).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.user_id), "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=pydantic_schemas.UserResponse)
def read_users_me(current_user: schema.User = Depends(get_current_user)):
    return current_user
