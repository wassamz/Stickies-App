import { render, screen, fireEvent } from "@testing-library/react";
import AddNote from "../AddNote";

// Mock function for the onAdd prop
const mockOnAdd = jest.fn();

describe("AddNote Component", () => {
  beforeEach(() => {
    // Render the AddNote component before each test
    render(<AddNote onAdd={mockOnAdd} />);
  });

  it("renders content input correctly", () => {
    // Check if the content textarea is rendered using data-testid
    expect(screen.getByTestId("add-note-content")).toBeInTheDocument();
  });

  it("expands to show title input when content is entered", () => {
    const contentInput = screen.getByTestId("add-note-content");

    // Simulate entering text in the content textarea
    fireEvent.change(contentInput, { target: { value: "New note content" } });

    // Check if the title input is displayed using data-testid
    expect(screen.getByTestId("add-note-title")).toBeInTheDocument();
  });

  it("updates the input fields when typing", () => {
    // Select content and title inputs using data-testid
    const contentInput = screen.getByTestId("add-note-content");
    fireEvent.change(contentInput, { target: { value: "Sample content" } });

    // Check if the value of content input is updated
    expect(contentInput.value).toBe("Sample content");

    const titleInput = screen.getByTestId("add-note-title");
    fireEvent.change(titleInput, { target: { value: "Sample title" } });

    // Check if the value of title input is updated
    expect(titleInput.value).toBe("Sample title");
  });

  it("calls the onAdd function when add button is clicked", () => {
    // Select inputs and add button using data-testid
    const contentInput = screen.getByTestId("add-note-content");
    const addButton = screen.getByTestId("add-note-button");

    // Simulate user input
    fireEvent.change(contentInput, { target: { value: "Sample content" } });

    const titleInput = screen.getByTestId("add-note-title");
    fireEvent.change(titleInput, { target: { value: "Sample title" } });

    // Simulate button click
    fireEvent.click(addButton);

    // Check if the onAdd function was called with the note data
    expect(mockOnAdd).toHaveBeenCalledWith({
      title: "Sample title",
      content: "Sample content",
    });

    // Ensure inputs are cleared after adding a note
    expect(contentInput.value).toBe("");
  });

  it("does not call onAdd function if content is empty", () => {
    // Select the add button using data-testid
    const addButton = screen.getByTestId("add-note-button");

    // Simulate button click without entering content
    fireEvent.click(addButton);

    // Ensure the onAdd function is not called
    expect(mockOnAdd).not.toHaveBeenCalled();
  });
});
