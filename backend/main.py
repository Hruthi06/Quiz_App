from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for hackathon)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

questions = [
    {
        "id": 1,
        "question": "What does HTML stand for?",
        "options": [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hyper Transfer Machine Language",
            "Home Tool Markup Language"
        ],
        "answer": "Hyper Text Markup Language"
    }
]

class Answer(BaseModel):
    answers: dict

@app.get("/questions")
def get_questions():
    return [
        {
            "id": q["id"],
            "question": q["question"],
            "options": q["options"]
        } for q in questions
    ]

@app.post("/submit")
def submit_answers(data: Answer):
    score = 0
    for q in questions:
        if str(q["id"]) in data.answers:
            if data.answers[str(q["id"])] == q["answer"]:
                score += 1
    return {"score": score}