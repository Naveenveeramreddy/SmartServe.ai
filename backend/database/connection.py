import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Normally we'd use SQLAlchemy with Postgres connection string, but since you are using Supabase,
# we can use the Supabase Python Client for direct PostgREST API access,
# OR we can provide both the SQLAlchemy engine for ORM and Supabase client.
# Let's provide the Supabase client for easy integration with standard Supabase features.

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://ilyoltqwlvgasicjbzqh.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlseW9sdHF3bHZnYXNpY2pienFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDg1OTgsImV4cCI6MjA4ODYyNDU5OH0.M4S5qEiREX_CfOCLn6BI4ADDDWPwPDvQgyVT91nf2UM")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# For SQLAlchemy (Postgres direct connection, better for complex joins and async):
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# A postgres connection string should be set to interact with Supabase DB directly
# Example: postgresql://postgres.ihx...:password@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./servesmart_local.db") # Fallback to sqlite for testing

# Note: sqlite doesn't support pgvector, so for full face rec, proper Supabase connection is required.
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
