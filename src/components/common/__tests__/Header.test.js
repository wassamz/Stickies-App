import { render, screen } from "@testing-library/react";
import React from "react";
import { getToken } from "../../../util/auth";
import Header from "../Header";
import { UserProvider, useUserProfile } from '../../../context/UserContext'; 

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mock the UserContext
jest.mock('../../../context/UserContext', () => ({
  UserProvider: ({ children }) => <div>{children}</div>, // Simple mock provider
  useUserProfile: jest.fn(),
}));



jest.mock("../../../util/auth", () => ({
  getToken: jest.fn(),
  clearTokens: jest.fn(),
}));

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserProfile.mockReturnValue({ user: { email: 'mocktest@example.com' } });
  });

  it("should render the header with the correct title and icon", () => {
    const mockOnSearch = jest.fn();
    
    getToken.mockReturnValue(true);

    render(<UserProvider><Header onSearch={mockOnSearch} /></UserProvider>);

    expect(screen.getByText("Stickies")).toBeInTheDocument();
    expect(screen.getByAltText("Sticky Notes")).toBeInTheDocument();
    expect(screen.getByTestId("NotesIcon")).toBeInTheDocument();
  });

  it("should not display the search component", () => {
    const hideSearchBox = () => {};

    getToken.mockReturnValue(true);

    render(<UserProvider><Header onSearch={hideSearchBox} /></UserProvider>);
    expect(screen.queryByText("Search...")).not.toBeInTheDocument();
  });
  it("should display the search component", () => {
    const showSearchBox = (show) => true;
    getToken.mockReturnValue(true);

    render(<UserProvider><Header onSearch={showSearchBox}/></UserProvider>);
    const searchBox = screen.getByTestId("search-note-content");

    expect(searchBox).toBeInTheDocument();
  });
  it('displays user email when logged in', () => {
    getToken.mockReturnValue("test")
    render(
      <UserProvider>
        <Header onSearch={() => {}} />
      </UserProvider>
    );

    expect(screen.getByText('mocktest@example.com')).toBeInTheDocument();
  });
});
