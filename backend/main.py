from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json
import re
import os
import random

app = FastAPI()

# Get absolute path to questions.json
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTIONS_FILE = os.path.join(BASE_DIR, "questions.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared state for questions
questions = []

class AnswerSubmission(BaseModel):
    answers: dict

@app.get("/generate")
def generate_questions(category: str):
    global questions
    
    # 1. Try loading from local questions.json first
    try:
        if os.path.exists(QUESTIONS_FILE):
            with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
                local_data = json.load(f)
                for cat, q_list in local_data.items():
                    if cat.lower() == category.lower():
                        all_questions = q_list.copy()
                        random.shuffle(all_questions)
                        questions = all_questions[:10]
                        # Ensure every question has an ID
                        for i, q in enumerate(questions):
                            if "id" not in q:
                                q["id"] = i + 1
                        print(f"Loading 10 random questions for {cat}")
                        return questions
    except Exception as e:
        print(f"Error reading local questions: {e}")

    # 2. If not found, return empty
    print(f"Category {category} not found in local file")
    questions = []
    return {"error": "Category not found"}

@app.get("/categories")
def get_categories():
    try:
        if os.path.exists(QUESTIONS_FILE):
            with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
                local_data = json.load(f)
                return [{"name": cat} for cat in local_data.keys()]
    except Exception as e:
        print(f"Error reading categories: {e}")
    
    return []

@app.get("/questions")
def get_questions():
    # Only return what's necessary for the UI (hide answers/explanations until submission)
    return [
        {
            "id": q["id"],
            "question": q["question"],
            "options": q["options"]
        } for q in questions
    ]

@app.post("/submit")
def submit_answers(data: AnswerSubmission):
    score = 0
    results = []
    
    for q in questions:
        user_answer = data.answers.get(str(q["id"])) or data.answers.get(q["id"])
        is_correct = user_answer == q["answer"]
        if is_correct:
            score += 1
            
        results.append({
            "id": q["id"],
            "question": q["question"],
            "correct_answer": q["answer"],
            "user_answer": user_answer,
            "is_correct": is_correct,
            "explanation": q.get("explanation", "")
        })
            
    return {"score": score, "total": len(questions), "results": results}