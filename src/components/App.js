import React, { useState, useEffect } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    prompt: "",
    answers: ["", "", "", ""],
    correctIndex: 0,
  });

  useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setQuestions(data);
      })
      .catch((err) => console.error("Failed to fetch questions:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  function handleAnswerChange(id, index) {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, correctIndex: index } : q
    );
    setQuestions(updated);
  }

  function handleDelete(id) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then(() => setQuestions(questions.filter((q) => q.id !== id)))
      .catch((err) => console.error("Failed to delete question:", err));
  }

  function handleFormChange(e, index) {
    const value = e.target.value;
    if (index !== undefined) {
      const updatedAnswers = [...newQuestion.answers];
      updatedAnswers[index] = value;
      setNewQuestion({ ...newQuestion, answers: updatedAnswers });
    } else {
      setNewQuestion({ ...newQuestion, [e.target.name]: value });
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    })
      .then((res) => res.json())
      .then((data) => setQuestions([...questions, data]))
      .catch((err) => console.error("Failed to add question:", err));
    setNewQuestion({
      prompt: "",
      answers: ["", "", "", ""],
      correctIndex: 0,
    });
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
          {newQuestion.answers.map((a, i) => (
            <label key={i}>
              Answer {i + 1}:
              <input
                value={a}
                onChange={(e) => handleFormChange(e, i)}
              />
            </label>
          ))}
          <label>
            Correct Answer:
            <select
              value={newQuestion.correctIndex}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  correctIndex: parseInt(e.target.value),
                })
              }
            >
              {[0, 1, 2, 3].map((i) => (
                <option key={i} value={i}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Add Question</button>
        </form>
      ) : (
        <section>
          <h1>Quiz Questions</h1>
          {questions.map((q) => (
            <div key={q.id}>
              <p>{q.prompt}</p>
              <label>
                Correct Answer:
                <select
                  value={q.correctIndex}
                  onChange={(e) =>
                    handleAnswerChange(q.id, parseInt(e.target.value))
                  }
                >
                  {q.answers.map((_, i) => (
                    <option key={i} value={i}>
                      {i + 1}
                    </option>
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
