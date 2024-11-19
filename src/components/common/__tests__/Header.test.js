import { render, screen } from "@testing-library/react";
import React from "react";
import { getToken } from "../../../util/auth";
import Header from "../Header";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../../../util/auth", () => ({
  getToken: jest.fn(),
  clearTokens: jest.fn(),
}));

describe("Header Component", () => {
  it("should render the header with the correct title and icon", () => {
    const mockOnSearch = jest.fn();
    const mockUserData = { email: "test@example.com" };
    getToken.mockReturnValue(true);

    render(<Header onSearch={mockOnSearch} userData={mockUserData} />);

    expect(screen.getByText("Stickies")).toBeInTheDocument();
    expect(screen.getByAltText("Sticky Notes")).toBeInTheDocument();
    expect(screen.getByTestId("NotesIcon")).toBeInTheDocument();
  });

  it("should not display the search component", () => {
    const hideSearchBox = () => {};
    const emptyUserData = {};

    getToken.mockReturnValue(true);

    render(<Header onSearch={hideSearchBox} userData={emptyUserData} />);
    expect(screen.queryByText("Search...")).not.toBeInTheDocument();
  });
  it("should display the search component", () => {
    const showSearchBox = (show) => true;
    const emptyUserData = {};

    getToken.mockReturnValue(true);

    render(<Header onSearch={showSearchBox} userData={emptyUserData} />);
    const searchBox = screen.getByTestId("search-note-content");

    expect(searchBox).toBeInTheDocument();
  });
});
