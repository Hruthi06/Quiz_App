import { useEffect, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/questions")
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  const handleChange = (qid, option) => {
    setAnswers({ ...answers, [qid]: option });
  };

  const submitQuiz = () => {
    fetch("http://127.0.0.1:8000/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ answers })
    })
      .then(res => res.json())
      .then(data => setScore(data.score));
  };

  if (score !== null) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1>🎉 Your Score</h1>
          <h2>{score} / {questions.length}</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Quiz App</h1>

        {questions.map(q => (
          <div key={q.id} style={styles.question}>
            <h3>{q.question}</h3>

            {q.options.map(opt => (
              <label key={opt} style={styles.option}>
                <input
                  type="radio"
                  name={q.id}
                  onChange={() => handleChange(q.id, opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}

        <button style={styles.button} onClick={submitQuiz}>
          Submit Quiz
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #4facfe, #00f2fe)"
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  },
  question: {
    marginBottom: "20px"
  },
  option: {
    display: "block",
    marginBottom: "8px"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#4facfe",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
  }
};

export default App;