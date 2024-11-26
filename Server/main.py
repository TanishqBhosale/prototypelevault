from fastapi import FastAPI, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from jose import JWTError, jwt
from passlib.context import CryptContext
from bson import ObjectId
import os

# FastAPI app instance
app = FastAPI()

# MongoDB Configuration
MONGO_URI = "mongodb://localhost:27017"  # Replace with your MongoDB URI
DATABASE_NAME = "user_db"
COLLECTION_NAME = "users"

# JWT Configuration
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB client and collection
client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]
user_collection = db[COLLECTION_NAME]

# Pydantic models
class RegisterModel(BaseModel):
    name: str
    email: EmailStr
    username: str
    password: str
    confirmPassword: str
    address: str
    zipCode: str
    location: dict
    mousePath: list
    keystrokes: list

class LoginModel(BaseModel):
    username: str
    password: str

# Helpers
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

async def get_user_by_username(username: str):
    return await user_collection.find_one({"username": username})

# Routes
@app.post("/register")
async def register_user(user: RegisterModel):
    if user.password != user.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    if await get_user_by_username(user.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Hash password
    hashed_password = hash_password(user.password)

    # Save user to MongoDB
    user_data = user.dict()
    user_data["password"] = hashed_password
    user_data.pop("confirmPassword")  # Remove confirmPassword
    user_data["_id"] = str(ObjectId())  # Add a unique MongoDB object ID

    result = await user_collection.insert_one(user_data)
    if result.inserted_id:
        return {"message": "User registered successfully", "uid": user_data["_id"]}
    else:
        raise HTTPException(status_code=500, detail="Registration failed")

@app.post("/login")
async def login_user(credentials: LoginModel):
    user = await get_user_by_username(credentials.username)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    # Generate JWT
    token = create_access_token(data={"username": user["username"], "uid": user["_id"]})
    return {"message": "Login successful", "token": token, "uid": user["_id"]}

# Run server using uvicorn
# `uvicorn main:app --reload`
