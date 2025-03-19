import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import * as router from "react-router-dom";
import { useUserProfile } from "../../../context/UserContext";
import { getToken } from "../../../util/auth";
import Header from "../Header";

// Create mock functions
const mockNavigate = jest.fn();
const mockSetUser = jest.fn();
const mockLocation = { pathname: "/notes" };

// Mock dependencies before component imports
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(),
}));

jest.mock("../../../util/auth", () => ({
  getToken: jest.fn(),
  clearTokens: jest.fn(),
}));

jest.mock("../../../context/UserContext", () => ({
  UserProvider: ({ children }) => <div>{children}</div>,
  useUserProfile: jest.fn(),
}));

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    router.useLocation.mockImplementation(() => mockLocation);
    useUserProfile.mockReturnValue({
      user: { email: "mocktest@example.com" },
      setUser: mockSetUser,
    });
  });

  const renderHeader = (props) => {
    return render(<Header {...props} />);
  };

  it("should render the header with the correct title and icon", () => {
    const mockOnSearch = jest.fn();
    getToken.mockReturnValue(true);

    renderHeader({ onSearch: mockOnSearch });

    expect(screen.getByText("Stickies")).toBeInTheDocument();
    expect(screen.getByAltText("Sticky Notes")).toBeInTheDocument();
    expect(screen.getByTestId("NotesIcon")).toBeInTheDocument();
  });

  it("should not display the search component when not on notes page", () => {
    router.useLocation.mockImplementation(() => ({ pathname: "/" }));
    renderHeader({ onSearch: () => {} });
    expect(screen.queryByText("Search...")).not.toBeInTheDocument();
  });

  it("should display the search component on notes page", () => {
    router.useLocation.mockImplementation(() => ({ pathname: "/notes" }));
    renderHeader({ onSearch: () => {} });
    const searchBox = screen.getByTestId("search-note-content");
    expect(searchBox).toBeInTheDocument();
  });

  it("displays user email when logged in", () => {
    getToken.mockReturnValue(true);
    renderHeader({ onSearch: () => {} });
    expect(screen.getByText("mocktest@example.com")).toBeInTheDocument();
  });

  it("handles logout correctly", () => {
    renderHeader({ onSearch: () => {} });
    const logoutButton = screen.getByTestId("logout-button");
    fireEvent.click(logoutButton);
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });
});
