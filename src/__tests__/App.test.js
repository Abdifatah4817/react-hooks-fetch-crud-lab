// src/__tests__/App.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import App from "../components/App";

// Mock fetch globally for all tests
beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (options && options.method === "POST") {
      // Simulate adding a new question
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            id: 3,
            prompt: "New Question Prompt",
            answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
            correctIndex: 0,
          }),
      });
    }
    if (options && options.method === "DELETE") {
      return Promise.resolve({ ok: true });
    }
    // Default GET request returns initial questions
    return Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: 1,
            prompt: "lorem testum 1",
            answers: ["1", "2", "3", "4"],
            correctIndex: 0,
          },
          {
            id: 2,
            prompt: "lorem testum 2",
            answers: ["1", "2", "3", "4"],
            correctIndex: 1,
          },
        ]),
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test("displays question prompts after fetching", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/i));

  await waitFor(() => {
    expect(screen.getByText("lorem testum 1")).toBeInTheDocument();
    expect(screen.getByText("lorem testum 2")).toBeInTheDocument();
  });
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  fireEvent.click(screen.getByText(/New Question/i));

  fireEvent.change(screen.getByLabelText(/Prompt/i), {
    target: { value: "New Question Prompt" },
  });

  fireEvent.change(screen.getByLabelText(/Answer 1/i), {
    target: { value: "Answer 1" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2/i), {
    target: { value: "Answer 2" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 3/i), {
    target: { value: "Answer 3" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 4/i), {
    target: { value: "Answer 4" },
  });

  fireEvent.change(screen.getByLabelText(/Correct Answer/i), {
    target: { value: "0" },
  });

  fireEvent.click(screen.getByText(/Add Question/i));

  fireEvent.click(screen.getByText(/View Questions/i));

  await waitFor(() => {
    expect(screen.getByText("New Question Prompt")).toBeInTheDocument();
  });
});

test("deletes the question when the delete button is clicked", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/i));

  const deleteButtons = await screen.findAllByText(/Delete Question/i);
  fireEvent.click(deleteButtons[0]);

  await waitFor(() => {
    expect(screen.queryByText("lorem testum 1")).not.toBeInTheDocument();
  });
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/i));

  const dropdowns = await screen.findAllByLabelText(/Correct Answer/i);
  fireEvent.change(dropdowns[0], { target: { value: "3" } });

  expect(screen.getAllByLabelText(/Correct Answer/i)[0].value).toBe("3");
});
