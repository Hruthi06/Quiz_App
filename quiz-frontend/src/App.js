import { useEffect, useState } from "react";
import logo from "./logo.png";
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
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (quizStarted && !isAnswered && score === null && !loading) {
      if (timeLeft > 0) {
        const timerId = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timerId);
      } else {
        setIsAnswered(true);
      }
    }
  }, [timeLeft, quizStarted, isAnswered, score, loading]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/categories")
      .then(res => res.json())
      .then(data => setAvailableCategories(data))
      .catch(err => {
          console.error("Failed to fetch categories:", err);
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
    setCategory(cat);
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
          setTimeLeft(10);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSelectOption = (option) => {
    if (isAnswered) return;
    
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
      setTimeLeft(10);
    } else {
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
      <div className="app-container">
        <div style={styles.card} className="fade-in">
          <div className="loader" style={styles.loader}></div>
          <h2 style={{ color: "var(--primary)" }}>Generating your quiz...</h2>
          <p style={{ color: "var(--text-muted)" }}>Asking AI to come up with some challenges...</p>
        </div>
      </div>
    );
  }

  if (score !== null) {
    return (
      <div className="app-container">
        <div style={styles.card} className="fade-in">
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
      "Programming Fundamentals": "💻",
      "Frontend Development": "🎨",
      "Backend Development": "⚙️",
      "Databases": "🗄️",
      "Command Line & Tools": "⌨️",
    };

    return (
      <div className="app-container">
        <div style={styles.card} className="fade-in">
          <div className="logo-container" style={{ marginBottom: "20px" }}>
            <img src={logo} alt="Quiz App Logo" style={{ width: "200px", height: "auto" }} />
          </div>
          <h1 style={styles.title}>Quiz Master</h1>
          <p style={styles.subtitle}>Supercharge your learning with AI-powered quizzes!</p>
          
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
    <div className="app-container">
      <div style={styles.quizCard} className="fade-in">
        <div style={styles.header}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={logo} alt="Logo" style={{ width: "40px", height: "40px" }} />
                <h1 style={styles.quizTitle}>{category} Quiz</h1>
            </div>
          <button style={styles.backButton} onClick={resetQuiz}>Exit Quiz</button>
        </div>

        <div style={styles.scrollArea}>
          {questions.length > 0 && (
            <div style={styles.questionCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{...styles.progressText, marginBottom: 0}}>Question {currentIndex + 1} of {questions.length}</div>
                <div 
                  className={timeLeft < 5 ? "timer-blink" : ""}
                  style={{ ...styles.progressText, marginBottom: 0, color: timeLeft < 5 ? "var(--error)" : "var(--primary)" }}
                >
                  ⏳ {timeLeft}s
                </div>
              </div>
              <h3 style={styles.questionText}>
                {questions[currentIndex].question}
              </h3>

              <div style={styles.optionsGrid}>
                {questions[currentIndex].options.map((opt, index) => {
                  const isCorrect = opt === questions[currentIndex].answer;
                  const isSelected = opt === selectedOption;
                  
                  let bg = "#fff";
                  let border = "#e2e8f0";
                  let color = "var(--text-main)";

                  if (isAnswered) {
                    if (isCorrect) {
                      bg = "#dcfce7";
                      border = "var(--success)";
                    } else if (isSelected) {
                      bg = "#fee2e2";
                      border = "var(--error)";
                    }
                  } else if (isSelected) {
                    bg = "#eef2ff";
                    border = "var(--primary)";
                  }

                  return (
                    <button 
                      key={opt} 
                      className="option-animated"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(opt)}
                      style={{
                        ...styles.option,
                        backgroundColor: bg,
                        borderColor: border,
                        color: color,
                        cursor: isAnswered ? "default" : "pointer",
                        animationDelay: `${index * 0.15}s`
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
                  backgroundColor: selectedOption === questions[currentIndex].answer ? "#f0fdf4" : "#fef2f2",
                  borderLeft: `5px solid ${selectedOption === questions[currentIndex].answer ? "var(--success)" : "var(--error)"}`
                }}>
                  <div style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "10px",
                    color: selectedOption === questions[currentIndex].answer ? "#166534" : "#991b1b"
                  }}>
                    {selectedOption === questions[currentIndex].answer 
                      ? "✨ Brilliant! Correct Answer" 
                      : (selectedOption ? "💡 Let's learn something new!" : "⏳ Time's Up! Let's review the correct answer.")}
                  </div>
                  
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Correct Answer:</span>
                    <span style={styles.detailValue}>{questions[currentIndex].answer}</span>
                  </div>

                  {selectedOption !== questions[currentIndex].answer && selectedOption && (
                     <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Your Choice:</span>
                        <span style={{...styles.detailValue, color: "var(--error)"}}>{selectedOption}</span>
                     </div>
                  )}

                  <hr style={styles.divider} />

                  <div style={styles.explanationHeader}>Why this is correct:</div>
                  <div style={styles.detailedExplanation}>
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
              {currentIndex < questions.length - 1 ? "Next Question" : "See My Score"}
            </button>
          )}
          {!isAnswered && (
            <p style={styles.hint}>Choose the best answer above</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--card-bg)",
    backdropFilter: "blur(10px)",
    padding: "40px",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "550px",
    boxShadow: "var(--shadow-lg)",
    textAlign: "center",
    margin: "auto"
  },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginTop: "20px"
  },
  categoryCard: {
    background: "#fff",
    border: "2px solid #f1f5f9",
    borderRadius: "16px",
    padding: "20px 10px",
    cursor: "pointer",
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
    color: "var(--text-main)"
  },
  quizCard: {
    background: "white",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "800px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "var(--shadow-lg)",
    overflow: "hidden",
    margin: "auto"
  },
  header: {
    padding: "20px 30px",
    background: "#fff",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  quizTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--text-main)",
    textTransform: "capitalize"
  },
  backButton: {
    padding: "8px 16px",
    background: "#f1f5f9",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    color: "var(--text-muted)",
    fontWeight: "600"
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
    padding: "30px",
    backgroundColor: "#f8fafc"
  },
  questionCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
  },
  questionText: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginTop: 0,
    marginBottom: "25px",
    color: "var(--text-main)",
    lineHeight: "1.5"
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "12px"
  },
  option: {
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "16px",
    fontWeight: "500",
    textAlign: "left"
  },
  footer: {
    padding: "20px 30px",
    background: "#fff",
    borderTop: "1px solid #f1f5f9",
    textAlign: "center"
  },
  title: {
    fontSize: "36px",
    fontWeight: "800",
    marginBottom: "8px",
    background: "linear-gradient(to right, var(--primary), var(--secondary))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: {
    color: "var(--text-muted)",
    fontSize: "16px",
    marginBottom: "32px",
    lineHeight: "1.6"
  },
  button: {
    width: "100%",
    padding: "16px",
    background: "var(--primary)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
    transition: "all 0.2s"
  },
  scoreContainer: {
    margin: "32px 0"
  },
  scoreText: {
    fontSize: "80px",
    fontWeight: "900",
    color: "var(--primary)"
  },
  totalText: {
    fontSize: "24px",
    color: "var(--text-muted)",
    marginLeft: "8px"
  },
  feedback: {
    fontSize: "18px",
    color: "var(--text-muted)",
    marginBottom: "32px",
    fontWeight: "500"
  },
  loader: {
    border: "5px solid #f3f3f3",
    borderTop: "5px solid var(--primary)",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px"
  },
  progressText: {
    fontSize: "12px",
    color: "var(--primary)",
    fontWeight: "700",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  explanationBox: {
    marginTop: "24px",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "left"
  },
  explanationHeader: {
    fontSize: "12px",
    fontWeight: "800",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    marginBottom: "10px",
    letterSpacing: "0.05em"
  },
  detailedExplanation: {
    fontSize: "15px",
    color: "var(--text-main)",
    lineHeight: "1.7"
  },
  detailItem: {
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  detailLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--text-muted)",
    minWidth: "130px"
  },
  detailValue: {
    fontSize: "15px",
    fontWeight: "700",
    color: "var(--success)"
  },
  divider: {
    border: "0",
    borderTop: "1px solid rgba(0,0,0,0.05)",
    margin: "20px 0"
  },
  hint: {
    fontSize: "13px",
    color: "var(--text-muted)",
    marginTop: "10px"
  }
};

export default App;