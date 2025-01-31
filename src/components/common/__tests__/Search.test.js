import { render, screen, fireEvent } from "@testing-library/react";
import Search from "../Search";

describe("Search Component", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it("renders search input and button", () => {
    render(<Search onSearch={mockOnSearch} />);
    expect(screen.getByTestId("search-note-content")).toBeInTheDocument();
    expect(screen.getByTestId("search-button")).toBeInTheDocument();
  });

  it("updates input value on change", () => {
    render(<Search onSearch={mockOnSearch} />);
    const searchInput = screen.getByTestId("search-note-content");
    fireEvent.change(searchInput, { target: { value: "test search" } });
    expect(searchInput.value).toBe("test search");
  });

  it("calls onSearch when form is search button is clicked", () => {
    render(<Search onSearch={mockOnSearch} />);
    const searchInput = screen.getByTestId("search-note-content");
    const searchButton = screen.getByTestId("search-button");

    fireEvent.change(searchInput, { target: { value: "test search" } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith("test search");
  });

  it("calls onSearch after pressing Enter key", () => {
    render(<Search onSearch={mockOnSearch} />);
    const form = screen.getByTestId("search-form");
    const searchInput = screen.getByTestId("search-note-content");
    fireEvent.change(searchInput, { target: { value: "test search" } });
    fireEvent.submit(form);
    expect(mockOnSearch).toHaveBeenCalledWith("test search");
  });
  
  it("resets search when input is cleared", () => {
    render(<Search onSearch={mockOnSearch} />);
    const searchInput = screen.getByTestId("search-note-content");
    fireEvent.change(searchInput, { target: { value: "test search" } });
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(mockOnSearch).toHaveBeenCalledWith("");
  });
});