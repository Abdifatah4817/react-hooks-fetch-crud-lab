// src/components/App.js
import React, { useState, useEffect } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    prompt: "",
    answers: ["", "", "", ""],
    correctIndex: 0,
  });

  // GET /questions
  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error("Failed to fetch questions:", err));
  }, []);

  // DELETE /questions/:id
  function handleDelete(id) {
    fetch(`http://localhost:4000/questions/${id}`, { method: "DELETE" })
      .then(() => setQuestions(prev => prev.filter(q => q.id !== id)))
      .catch(err => console.error("Failed to delete question:", err));
  }

  // PATCH /questions/:id with safe handling
  function handleCorrectChange(id, index) {
    // Optimistic UI update
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, correctIndex: index } : q));

    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex: index }),
    })
      .then(res => res.ok ? res.json() : null)
      .then(updated => {
        if (updated) {
          setQuestions(prev => prev.map(q => q.id === id ? updated : q));
        }
      })
      .catch(err => console.error("Failed to update question:", err));
  }

  // Form input change
  function handleFormChange(e, idx) {
    const { name, value } = e.target;
    if (typeof idx === "number") {
      const updatedAnswers = [...newQuestion.answers];
      updatedAnswers[idx] = value;
      setNewQuestion({ ...newQuestion, answers: updatedAnswers });
    } else {
      setNewQuestion({ ...newQuestion, [name]: value });
    }
  }

  // POST /questions
  function handleFormSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    })
      .then(res => res.json())
      .then(data => setQuestions(prev => [...prev, data]))
      .catch(err => console.error("Failed to add question:", err));

    // Reset form
    setNewQuestion({ prompt: "", answers: ["", "", "", ""], correctIndex: 0 });
    setShowForm(false);
  }

  return (
    <div className="App">
      <nav>
        <button onClick={() => setShowForm(true)}>New Question</button>
        <button onClick={() => setShowForm(false)}>View Questions</button>
      </nav>

      {showForm ? (
        <form onSubmit={handleFormSubmit}>
          <label>
            Prompt:
            <input
              name="prompt"
              value={newQuestion.prompt}
              onChange={handleFormChange}
            />
          </label>

          {newQuestion.answers.map((ans, idx) => (
            <label key={idx}>
              Answer {idx + 1}:
              <input
                value={ans}
                onChange={(e) => handleFormChange(e, idx)}
              />
            </label>
          ))}

          <label>
            Correct Answer:
            <select
              value={newQuestion.correctIndex}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, correctIndex: parseInt(e.target.value) })
              }
            >
              {[0, 1, 2, 3].map(i => (
                <option key={i} value={i}>{i + 1}</option>
              ))}
            </select>
          </label>

          <button type="submit">Add Question</button>
        </form>
      ) : (
        <section>
          <h1>Quiz Questions</h1>
          {questions.map(q => (
            <div key={q.id}>
              <p>{q.prompt}</p>
              <label>
                Correct Answer:
                <select
                  value={q.correctIndex}
                  onChange={(e) => handleCorrectChange(q.id, parseInt(e.target.value))}
                >
                  {q.answers.map((_, i) => (
                    <option key={i} value={i}>{i + 1}</option>
                  ))}
                </select>
              </label>
              <button onClick={() => handleDelete(q.id)}>Delete Question</button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default App;
