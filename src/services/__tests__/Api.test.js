import { setToken, statusCode } from "../../util/auth";
import {
  api,
  createNote,
  login,
  notes,
  removeNote,
  signUp,
  updateNote,
} from "../Api";

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
}));

jest.mock("../../util/auth", () => ({
  setToken: jest.fn(),
  getToken: jest.fn(),
  clearTokens: jest.fn(),
  reject: jest.fn(),
  statusCode: { SUCCESS: "SUCCESS", ERROR: "ERROR" },
}));

describe("Api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully login with valid credentials and set the access token", async () => {
    const mockUserData = { email: "test@example.com", password: "Password123$" };
    const mockAccessToken = "mock_access_token";
    const mockResponse = { data: { accessToken: mockAccessToken } };

    api.post.mockResolvedValueOnce(mockResponse);

    const result = await login(mockUserData);

    expect(api.post).toHaveBeenCalledWith("/users/login", mockUserData, {
      withCredentials: true,
    });
    expect(setToken).toHaveBeenCalledWith(mockAccessToken);
    expect(result).toEqual({
      status: statusCode.SUCCESS,
      message: "Login Successful",
    });
  });

  it("should handle login failure and return an error message", async () => {
    const mockUserData = {
      email: "test@example.com",
      password: "wrongpassword",
    };
    const mockError = new Error("Login failed");

    api.post.mockRejectedValueOnce(mockError);

    const result = await login(mockUserData);

    expect(api.post).toHaveBeenCalledWith("/users/login", mockUserData, {
      withCredentials: true,
    });
    expect(setToken).not.toHaveBeenCalled();
    expect(result).toEqual({
      status: statusCode.ERROR,
      message: "Unable to login",
    });
  });

  it("should successfully sign up a new user and set the access token", async () => {
    const mockUserData = {
      email: "newuser@example.com",
      password: "newpassword123",
    };
    const mockAccessToken = "new_user_access_token";
    const mockResponse = { data: { accessToken: mockAccessToken } };

    api.post.mockResolvedValueOnce(mockResponse);

    const result = await signUp(mockUserData);

    expect(api.post).toHaveBeenCalledWith("/users/signup", mockUserData, {
      withCredentials: true,
    });
    expect(setToken).toHaveBeenCalledWith(mockAccessToken);
    expect(result).toEqual({
      status: statusCode.SUCCESS,
      message: "User Created",
    });
  });

  it("should handle sign up failure and return an error message", async () => {
    const mockUserData = {
      email: "newuser@example.com",
      password: "password123",
    };
    const mockError = new Error("Sign up failed");

    api.post.mockRejectedValueOnce(mockError);

    const result = await signUp(mockUserData);

    expect(api.post).toHaveBeenCalledWith("/users/signup", mockUserData, {
      withCredentials: true,
    });
    expect(setToken).not.toHaveBeenCalled();
    expect(result).toEqual({
      status: statusCode.ERROR,
      message: "Unable to create user",
    });
  });

  it("should fetch notes successfully when authenticated", async () => {
    const mockNotes = [
      { id: 1, content: "Test note 1" },
      { id: 2, content: "Test note 2" },
    ];
    const mockResponse = { data: mockNotes };

    api.get.mockResolvedValueOnce(mockResponse);

    const result = await notes();

    expect(api.get).toHaveBeenCalledWith("/notes");
    expect(result).toEqual(mockNotes);
  });

  it("should create a new note and return the created note data", async () => {
    const mockNote = { title: "Test Note", content: "This is a test note" };
    const mockCreatedNote = { ...mockNote, id: "123" };
    const mockResponse = { data: mockCreatedNote };

    api.post.mockResolvedValueOnce(mockResponse);

    const result = await createNote(mockNote);

    expect(api.post).toHaveBeenCalledWith("/notes", mockNote);
    expect(result).toEqual(mockCreatedNote);
  });

  it("should update an existing note and return the updated note data", async () => {
    const mockNote = {
      id: "123",
      title: "Updated Note",
      content: "This is an updated note",
    };
    const mockResponse = { data: mockNote };

    api.patch.mockResolvedValueOnce(mockResponse);

    const result = await updateNote(mockNote);

    expect(api.patch).toHaveBeenCalledWith("/notes", mockNote);
    expect(result).toEqual(mockNote);
  });
  it("should delete a note by ID and return the deletion confirmation", async () => {
    const mockNoteId = "123";
    const mockDeletionConfirmation = { message: "Note deleted successfully" };
    const mockResponse = { data: mockDeletionConfirmation };

    api.delete.mockResolvedValueOnce(mockResponse);

    const result = await removeNote(mockNoteId);

    expect(api.delete).toHaveBeenCalledWith(`/notes/${mockNoteId}`);
    expect(result).toEqual(mockDeletionConfirmation);
  });
});
