function QuestionList({ questions, setQuestions }) {
  // Delete a question
  function handleDelete(id) {
    fetch(`http://localhost:4000/questions/${id}`, { method: "DELETE" })
      .then(() => setQuestions(prev => prev.filter(q => q.id !== id)));
  }

  // Update the correct answer (optimistic UI)
  function handleCorrectChange(id, newIndexStr) {
    const newIndex = parseInt(newIndexStr);

    // Optimistically update state
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, correctIndex: newIndex } : q));

    // Send PATCH request
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex: newIndex })
    })
    .then(res => res.json())
    .then(updated => {
      // Ensure state matches server response
      setQuestions(prev => prev.map(q => q.id === id ? updated : q));
    });
  }

  return (
    <ul>
      {questions.map(q => (
        <li key={q.id}>
          {q.prompt}
          <button onClick={() => handleDelete(q.id)}>Delete Question</button>
          <select
            aria-label="Correct Answer"
            value={q.correctIndex.toString()} // for test compatibility
            onChange={e => handleCorrectChange(q.id, e.target.value)}
          >
            {q.answers.map((ans, idx) => (
              <option key={idx} value={idx.toString()}>{ans}</option>
            ))}
          </select>
        </li>
      ))}
    </ul>
  );
}

export default QuestionList;
