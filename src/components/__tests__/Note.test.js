import { render, screen, fireEvent } from "@testing-library/react";
import Note from "../Note";

// Mock functions for the onDelete and onEdit props
const mockOnDelete = jest.fn();
const mockOnEdit = jest.fn();
const noteProps = {
  id: "1",
  title: "Sample Note Title",
  content: "This is a sample note.",
  onDelete: mockOnDelete,
  onEdit: mockOnEdit,
};

describe("Note Component", () => {
  beforeEach(() => {
    // Render the Note component with mock props before each test
    render(
      <Note
        id={noteProps.id}
        title={noteProps.title}
        content={noteProps.content}
        onDelete={noteProps.onDelete}
        onEdit={noteProps.onEdit}
      />
    );
  });

  it("renders the note title and content", () => {
    // Check if the title and content are rendered correctly
    expect(screen.getByText(noteProps.title)).toBeInTheDocument();
    expect(screen.getByText(noteProps.content)).toBeInTheDocument();
  });

  it("calls onDelete function when the delete button is clicked", () => {
    const deleteButton = screen.getByTestId(
      `delete-note-button${noteProps.id}`
    );

    // Simulate clicking the delete button
    fireEvent.click(deleteButton);

    // Check if the onDelete function was called with the note id
    expect(mockOnDelete).toHaveBeenCalledWith(noteProps.id);
  });

  it("calls onEdit function when the edit button is clicked", () => {
    const editButton = screen.getByTestId(`edit-note-button${noteProps.id}`);

    // Simulate clicking the edit button
    fireEvent.click(editButton);

    // Check if the onEdit function was called with the note id
    expect(mockOnEdit).toHaveBeenCalledWith(noteProps.id);
  });

  it("displays the correct delete and edit buttons with appropriate styles", () => {
    const deleteButton = screen.getByTestId(
      `delete-note-button${noteProps.id}`
    );
    const editButton = screen.getByTestId(`edit-note-button${noteProps.id}`);
  });
});
