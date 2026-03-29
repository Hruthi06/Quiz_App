import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("General Knowledge");
  const [quizStarted, setQuizStarted] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [localScore, setLocalScore] = useState(0);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/categories")
      .then(res => res.json())
      .then(data => setAvailableCategories(data))
      .catch(err => {
          console.error("Failed to fetch categories:", err);
          // Fallback if backend is down - showing the 6 from questions.json
          setAvailableCategories([
              { name: "Engineering Mathematics" },
              { name: "Technical English" },
              { name: "Computer Networks" },
              { name: "Operating Systems" },
              { name: "Problem Solving on Programming" }
          ]);
      });
  }, []);

  const fetchQuestions = (cat) => {
    setCategory(cat); // Ensure category name is set correctly
    setLoading(true);
    fetch(`http://127.0.0.1:8000/generate?category=${encodeURIComponent(cat)}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert("Error generating quiz: " + data.error);
        } else {
          setQuestions(data);
          setQuizStarted(true);
          setScore(null);
          setAnswers({});
          setCurrentIndex(0);
          setIsAnswered(false);
          setSelectedOption(null);
          setLocalScore(0);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSelectOption = (option) => {
    if (isAnswered) return; // Prevent changing answer
    
    const currentQ = questions[currentIndex];
    setSelectedOption(option);
    setIsAnswered(true);
    
    if (option === currentQ.answer) {
      setLocalScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      // Finalize the quiz
      setScore({ score: localScore, total: questions.length });
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setScore(null);
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setLocalScore(0);
    setIsAnswered(false);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div className="loader" style={styles.loader}></div>
          <h2 style={{ color: "#4facfe" }}>Generating your quiz...</h2>
          <p>Asking AI to come up with some challenges...</p>
        </div>
      </div>
    );
  }

  if (score !== null) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🎉 Results</h1>
          <div style={styles.scoreContainer}>
            <span style={styles.scoreText}>{score.score}</span>
            <span style={styles.totalText}>/ {score.total}</span>
          </div>
          <p style={styles.feedback}>
            {score.score === score.total ? "Perfect Score! You're a genius! 🏆" : 
             score.score > score.total / 2 ? "Great job! Keep it up! 👏" : 
             "Good try! Want to go again? 💪"}
          </p>
          <button style={styles.button} onClick={resetQuiz}>
            Try Another Category
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    const iconMap = {
      
      "Engineering Mathematics": "📐",
      "Technical English": "📖",
      "Computer Networks": "🔗",
      "Operating Systems": "🖥️",
      "Problem Solving on Programming": "💡",
     
    };

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>AI Quiz Master</h1>
          <p style={styles.subtitle}>Choose a category to start your quiz!</p>
          
          <div style={styles.categoryGrid}>
            {availableCategories.map(cat => (
              <button 
                key={cat.name} 
                className="category-card"
                style={styles.categoryCard}
                onClick={() => fetchQuestions(cat.name)}
              >
                <div style={styles.catIcon}>{iconMap[cat.name] || "📝"}</div>
                <div style={styles.catName}>{cat.name}</div>
              </button>
            ))}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.quizCard}>
        <div style={styles.header}>
          <h1 style={styles.quizTitle}>{category} Quiz</h1>
          <button style={styles.backButton} onClick={resetQuiz}>Change Topic</button>
        </div>

        <div style={styles.scrollArea}>
          {questions.length > 0 && (
            <div style={styles.questionCard}>
              <div style={styles.progressText}>Question {currentIndex + 1} of {questions.length}</div>
              <h3 style={styles.questionText}>
                {questions[currentIndex].question}
              </h3>

              <div style={styles.optionsGrid}>
                {questions[currentIndex].options.map(opt => {
                  const isCorrect = opt === questions[currentIndex].answer;
                  const isSelected = opt === selectedOption;
                  
                  let bg = "#f8f9fa";
                  let border = "#dee2e6";
                  let color = "#444";

                  if (isAnswered) {
                    if (isCorrect) {
                      bg = "#d4edda"; // Green
                      border = "#28a745";
                    } else if (isSelected) {
                      bg = "#f8d7da"; // Red
                      border = "#dc3545";
                    }
                    if (isSelected || isCorrect) {
                      color = "#000";
                    }
                  } else if (isSelected) {
                    bg = "#e3f2fd";
                    border = "#4facfe";
                  }

                  return (
                    <button 
                      key={opt} 
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(opt)}
                      style={{
                        ...styles.option,
                        backgroundColor: bg,
                        borderColor: border,
                        color: color,
                        cursor: isAnswered ? "default" : "pointer"
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div style={{
                  ...styles.explanationBox,
                  backgroundColor: selectedOption === questions[currentIndex].answer ? "#f0fdf4" : "#fef2f2"
                }}>
                  <div style={{fontWeight: 'bold', marginBottom: '5px'}}>
                    {selectedOption === questions[currentIndex].answer ? "✅ Correct!" : "❌ Incorrect"}
                  </div>
                  <div style={styles.explanationText}>
                    {questions[currentIndex].explanation}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={styles.footer}>
          {isAnswered && (
            <button 
              style={styles.button} 
              onClick={handleNext}
            >
              {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </button>
          )}
          {!isAnswered && (
            <p style={styles.hint}>Select an answer to continue</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    padding: "20px"
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "40px",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "550px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "15px",
    marginTop: "20px"
  },
  categoryCard: {
    background: "#fff",
    border: "2px solid #f0f0f0",
    borderRadius: "16px",
    padding: "20px 10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    outline: "none"
  },
  catIcon: {
    fontSize: "32px"
  },
  catName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333"
  },
  quizCard: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "800px",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    overflow: "hidden"
  },
  header: {
    padding: "20px 30px",
    background: "#fff",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  quizTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#333",
    textTransform: "capitalize"
  },
  backButton: {
    padding: "8px 16px",
    background: "#f0f0f0",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#666"
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
    padding: "30px",
    backgroundColor: "#fafafa"
  },
  questionCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
  },
  questionText: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#2d3436",
    lineHeight: "1.4"
  },
  qNumber: {
    color: "#4facfe",
    marginRight: "10px"
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px"
  },
  option: {
    display: "flex",
    alignItems: "center",
    padding: "15px",
    borderRadius: "12px",
    border: "2px solid #eee",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "15px",
    color: "#444"
  },
  radio: {
    marginRight: "12px",
    transform: "scale(1.2)"
  },
  footer: {
    padding: "20px 30px",
    background: "#fff",
    borderTop: "1px solid #eee",
    textAlign: "center"
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "10px",
    background: "linear-gradient(to right, #4facfe, #00f2fe)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: {
    color: "#666",
    marginBottom: "30px"
  },
  input: {
    width: "100%",
    padding: "15px",
    borderRadius: "12px",
    border: "2px solid #e0e0e0",
    marginBottom: "20px",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.3s"
  },
  button: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(79, 172, 254, 0.4)",
    transition: "transform 0.2s"
  },
  scoreContainer: {
    margin: "30px 0"
  },
  scoreText: {
    fontSize: "72px",
    fontWeight: "bold",
    color: "#4facfe"
  },
  totalText: {
    fontSize: "24px",
    color: "#999"
  },
  feedback: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "30px"
  },
  loader: {
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #4facfe",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 2s linear infinite",
    margin: "0 auto 20px"
  },
  progressText: {
    fontSize: "14px",
    color: "#667eea",
    fontWeight: "600",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  explanationBox: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid #eee",
    textAlign: "left"
  },
  explanationText: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.5"
  },
  hint: {
    fontSize: "12px",
    color: "#999",
    marginTop: "10px"
  }
};

export default App;