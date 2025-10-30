import { useState } from "react";

function QuestionForm({ questions, setQuestions }) {
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  function handleAnswerChange(idx, value) {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newQuestion = { prompt, answers, correctIndex };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion)
    })
      .then(res => res.json())
      .then(data => setQuestions([...questions, data]));

    // Reset form
    setPrompt("");
    setAnswers(["", "", "", ""]);
    setCorrectIndex(0);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Prompt:
        <input value={prompt} onChange={e => setPrompt(e.target.value)} />
      </label>

      {answers.map((ans, idx) => (
        <label key={idx}>
          Answer {idx + 1}:
          <input
            value={ans}
            onChange={e => handleAnswerChange(idx, e.target.value)}
          />
        </label>
      ))}

      <label>
        Correct Answer:
        <select value={correctIndex} onChange={e => setCorrectIndex(parseInt(e.target.value))}>
          {answers.map((_, idx) => (
            <option key={idx} value={idx}>{idx + 1}</option>
          ))}
        </select>
      </label>

      <button type="submit">Add Question</button>
    </form>
  );
}

export default QuestionForm;
