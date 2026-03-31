# 🚀 Quizmify – Smart Quiz Application

A modern full-stack Quiz Application built with **FastAPI (Backend)** and **React (Frontend)** that delivers a dynamic and interactive quiz experience with randomized questions, instant feedback, and clean UI.

---

## 📌 Features

- 🎯 6 Tech Categories
- 🔀 Random 10 questions per quiz
- ⚡ One-by-one question flow
- ✅ Instant answer feedback
- 📊 Final score summary
- 🎨 Modern glassmorphism UI
- 🔄 JSON-based question system
- 🤖 Optional AI fallback for questions

---

## 🧠 Categories

- Programming Fundamentals  
- Frontend Development  
- Backend Development  
- Databases  
- Computer Networks  
- Command Line & Tools  

---

## 🏗️ Tech Stack

### 🔹 Backend
- FastAPI  
- Python  
- JSON (questions data)

### 🔹 Frontend
- React.js  
- CSS (Glassmorphism UI)

---

## ⚙️ How It Works

1. User selects a category  
2. Backend fetches questions from `questions.json`  
3. Questions are shuffled randomly  
4. Only 10 questions are returned  
5. UI displays one question at a time  
6. User selects an answer → instant feedback  
7. Score is calculated dynamically  
8. Final result is shown at the end  

---

## 📂 Project Structure
quiz-app/
│
├── backend/
│   ├── main.py
│   ├── questions.json
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   ├── styles/
│
├── README.md
---

## 🚀 Installation & Setup

### 🔹 Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Backend runs at: http://localhost:8000

Frontend (React)

cd frontend
npm install
npm start

Frontend runs at: http://localhost:3000

---

## 🎨 UI Preview

### Home Screen
![Home Screen](screenshots/home.png)

### Quiz Screen
![Quiz Screen](screenshots/quiz.png)

### Result Screen
![Result Screen](screenshots/result.png)

---

## 🛠️ Development

### Adding New Questions

Edit `backend/questions.json`:

```json
{
  "Programming Fundamentals": [
    {
      "question": "What is a variable?",
      "options": ["A", "B", "C", "D"],
      "answer": "A"
    }
  ]
}
```

### API Endpoints

- `GET /categories` → List all categories  
- `GET /generate?category=...` → Get 10 random questions  

---

## 🌐 Deployment

### Render Deployment

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host [IP_ADDRESS] --port $PORT
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
npx serve -s build -l $PORT
```

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch  
3. Commit your changes  
4. Push to the branch  
5. Open a Pull Request  

---

## 📄 License

MIT License  

---

## 👨‍💻 Author

**Quizmify**  
Built with ❤️ using FastAPI + React

---

## 🔗 Links

- [Backend GitHub](backend/)
- [Frontend GitHub](frontend/)
- [Live Demo](https://quizmify.onrender.com)