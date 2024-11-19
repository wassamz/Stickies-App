import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createNote, notes, removeNote, updateNote } from "../../services/Api";
import Notes from "../Notes";

jest.mock("../../services/Api", () => ({
  notes: jest.fn(),
  createNote: jest.fn(),
  updateNote: jest.fn(),
  removeNote: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe("Notes Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockNavigate = jest.fn();
    const mockLocation = { state: { userData: { name: "Test User" } } };
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    require("react-router-dom").useLocation.mockReturnValue(mockLocation);

    notes.mockResolvedValue([
      { _id: "1", title: "Note 1", content: "Content 1" },
      { _id: "2", title: "Note 2", content: "Content 2" },
    ]);
  });

  it("Should display loading message when data is being fetched", async () => {
    notes.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    render(<Notes />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
  it("should show error message when API call fails", async () => {
    const errorMessage = "Failed to fetch notes";
    notes.mockRejectedValueOnce(new Error(errorMessage));

    render(<Notes />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // Check if the error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    // Verify that the notes function was called
    expect(notes).toHaveBeenCalledTimes(1);

    // Check if navigation was attempted
    expect(require("react-router-dom").useNavigate).toHaveBeenCalled();
  });

  it("should add a new note when 'addNote' function is called", async () => {
    const newNote = {
      title: "Test Added Note",
      content: "Test Content for added note",
    };
    const newNoteId = "123";
    const mockResult = { _id: newNoteId, ...newNote };
    createNote.mockResolvedValueOnce(mockResult);

    render(<Notes />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // Simulate adding a new note
    fireEvent.change(screen.getByTestId("add-note-content"), {
      target: { value: newNote.content },
    });
    fireEvent.change(screen.getByTestId("add-note-title"), {
      target: { value: newNote.title },
    });
    const addButton = screen.getByTestId("add-note-button");
    fireEvent.click(addButton);

    // Wait for the new note to be added
    await waitFor(() => {
      expect(createNote).toHaveBeenCalledWith(newNote);
    });

    // Wait for the new note to appear on the screen
    await waitFor(() => {
      expect(screen.getByText(newNote.title)).toBeInTheDocument();
      expect(screen.getByText(newNote.content)).toBeInTheDocument();
    });

    // Additional check to ensure the note is actually rendered
    expect(
      screen.getByTestId("edit-note-button" + newNoteId)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("delete-note-button" + newNoteId)
    ).toBeInTheDocument();
  });
  it("should update the note list when a note is edited", async () => {
    const initialNotes = [
      { _id: "1", title: "Note 1", content: "Content 1" },
      { _id: "2", title: "Note 2", content: "Content 2" },
    ];
    notes.mockResolvedValue(initialNotes);
    updateNote.mockResolvedValue({ status: "success" });

    render(<Notes />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // Simulate editing a note
    fireEvent.click(screen.getByTestId("edit-note-button1"));

    // Update the note content
    const updatedNote = {
      _id: "1",
      title: "Updated Note 1",
      content: "Updated Content 1",
    };
    fireEvent.change(screen.getByTestId("update-note-title"), {
      target: { value: updatedNote.title },
    });
    fireEvent.change(screen.getByTestId("update-note-content"), {
      target: { value: updatedNote.content },
    });

    // Save the updated note
    fireEvent.click(screen.getByTestId("update-save-button"));

    // Check if the note list is updated
    await waitFor(() => {
      expect(screen.getByText(updatedNote.title)).toBeInTheDocument();
      expect(screen.getByText(updatedNote.content)).toBeInTheDocument();
    });

    // Verify that updateNote was called with the correct parameters
    expect(updateNote).toHaveBeenCalledWith(updatedNote);
  });
  it("should remove a note from the list when 'deleteNote' is called", async () => {
    const initialNotes = [
      { _id: "1", title: "Note 1", content: "Content 1" },
      { _id: "2", title: "Note 2", content: "Content 2" },
    ];
    notes.mockResolvedValue(initialNotes);
    removeNote.mockResolvedValue({ status: "success" });

    render(<Notes />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // Verify initial notes are rendered
    expect(screen.getByText("Note 1")).toBeInTheDocument();
    expect(screen.getByText("Note 2")).toBeInTheDocument();

    // Simulate deleting a note
    fireEvent.click(screen.getByTestId("delete-note-button1"));

    // Check if the note is removed from the list
    await waitFor(() => {
      expect(screen.queryByText("Note 1")).not.toBeInTheDocument();
    });

    // Verify that Note 2 is still present
    expect(screen.getByText("Note 2")).toBeInTheDocument();

    // Verify that removeNote was called with the correct ID
    expect(removeNote).toHaveBeenCalledWith("1");
  });

  it("should filter notes correctly when 'searchNotes' is called", async () => {
    const initialNotes = [
      { _id: "1", title: "Note 1", content: "Content 1" },
      { _id: "2", title: "Note 2", content: "Content 2" },
      { _id: "3", title: "Different title", content: "Different content" },
    ];

    notes.mockResolvedValue(initialNotes);

    render(<Notes />);

    // Wait for notes to be loaded
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    const searchBox = screen.getByTestId("search-note-content");
    // Test searching for "Note"
    fireEvent.change(searchBox, {
      target: { value: "Note" },
    });
    fireEvent.submit(searchBox);
    await waitFor(() => {
      expect(screen.getByText("Note 1")).toBeInTheDocument();
      expect(screen.getByText("Note 2")).toBeInTheDocument();
      expect(screen.queryByText("Different title")).not.toBeInTheDocument();
    });

    // Test searching for "Different"
    fireEvent.change(searchBox, {
      target: { value: "Different" },
    });

    fireEvent.submit(searchBox);

    await waitFor(() => {
      expect(screen.queryByText("Note 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Note 2")).not.toBeInTheDocument();
      expect(screen.getByText("Different title")).toBeInTheDocument();
    });

    // Test clearing the search
    fireEvent.change(searchBox, {
      target: { value: "" },
    });

    await waitFor(() => {
      expect(screen.getByText("Note 1")).toBeInTheDocument();
      expect(screen.getByText("Note 2")).toBeInTheDocument();
      expect(screen.getByText("Different title")).toBeInTheDocument();
    });
  });
});
