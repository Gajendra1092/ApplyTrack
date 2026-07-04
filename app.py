from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from datetime import datetime
from langchain.agents import create_agent
import json
import sqlite3
from dotenv import load_dotenv
import os

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class responseSchema(BaseModel):
    Company_name: str = Field(description = "Name of company on application form")
    Role: str = Field(description = "Role for which the application form is to be filled.")
    Resume_name: str = Field(description = "Name of the resume submitted")
    Date_Time: str = Field(description = "Today's date and time")

# initialisation
model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", 
    api_key=GOOGLE_API_KEY
)

def get_date_time() -> str:
    """Get date and time."""
    current = datetime.now().strftime("%d/%m/%Y %I:%M %p")
    return str(current)

agent = create_agent(
    model=model,
    tools=[get_date_time],
    response_format=responseSchema,
    system_prompt="""
        You are an Helpful AI Assistant. You will take data as input and extract three things from the text:
            1. Company_name
            2. Role.
            3. Resume_name
            4. Today's date and time.
                
            Constraints:
                1. If any of the required info is not present do not assume. Clearly tell that the info is not present or leave it empty.
                2. For accessing data and time use tool get_date_time.
                3. If the Resume_name if it starts with number ignore the number and take the give the resume name starting with english alphabet.
            Tools:
                1. get_date_time(): Tells the current date and time.
            Return only valid JSON with this exact structure:
                {
                    "Company_name": "",
                    "Role": "",
                    "Resume_name": "",
                    "Date_Time": ""
                }
                If any value is missing, use empty string.
            """
)

def call_agent(content: str):

    result = agent.invoke(
        {"messages": [{"role": "user", "content": content}]}
    )
    print("Structured_response:", result["structured_response"])
    structured = result["structured_response"]
    dict_response = structured.model_dump()

    print(dict_response)
    storeInSQLite(dict_response)
    return dict_response # dict

# Store that dict in sql lite
def storeInSQLite(data):
    conn = sqlite3.connect("applications.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Company_name TEXT,
            Role TEXT,
            Resume_name TEXT,
            Date_Time TEXT
        )
    """)

    cursor.execute("""
        INSERT INTO applications (
            Company_name,
            Role,
            Resume_name,
            Date_Time
        )
        VALUES (?, ?, ?, ?)
    """, (
        data["Company_name"],
        data["Role"],
        data["Resume_name"],
        data["Date_Time"]
        )
    )

    conn.commit() 
    conn.close()
    with sqlite3.connect("applications.db") as conn:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT *
            FROM applications
            ORDER BY id DESC
            LIMIT 1
        """)

    last_entry = cursor.fetchone()

    print("Last Entry:",last_entry)
    return last_entry


@app.post("/handle-content")
async def read_root(request: Request):
    text = await request.body()
    decoded_text = text.decode("utf-8")

    extracted_fields = call_agent(decoded_text)
    return {"result": extracted_fields}

    
    
