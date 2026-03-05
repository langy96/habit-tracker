import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Habit Tracker heading", () => {
  render(<App />);
  expect(screen.getByText(/Habit Tracker/i)).toBeInTheDocument();
});