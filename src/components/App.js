import { useState, useEffect } from "react";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";

function App() {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error("Failed to fetch questions:", err));
  }, []);

  return (
    <main>
      <nav>
        <button onClick={() => setShowForm(true)}>New Question</button>
        <button onClick={() => setShowForm(false)}>View Questions</button>
      </nav>
      <section>
        <h1>Quiz Questions</h1>
        {showForm ? (
          <QuestionForm questions={questions} setQuestions={setQuestions} />
        ) : (
          <QuestionList questions={questions} setQuestions={setQuestions} />
        )}
      </section>
    </main>
  );
}

export default App;
