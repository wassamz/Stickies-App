import { checkAuthLoader, getToken, setToken, clearTokens, reject } from '../auth';
import { AxiosError } from 'axios';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

jest.mock('axios', () => ({
  AxiosError: jest.fn(),
}));

describe('Auth Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when a valid token is present in localStorage', () => {
    const mockToken = 'valid_token';
    jest.spyOn(localStorage, 'getItem').mockReturnValue(mockToken);
  
    const result = checkAuthLoader();
  
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(result).toBeNull();
  });
  it('should throw a 401 Unauthorized response when no token is present', () => {
    jest.spyOn(localStorage, 'getItem').mockReturnValue(null);
  
    expect(() => checkAuthLoader()).toThrow(Response);
  
    const thrownError = (() => {
      try {
        checkAuthLoader();
      } catch (error) {
        return error;
      }
    })();
  
    expect(thrownError).toBeInstanceOf(Response);
    expect(thrownError.status).toBe(401);
  
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
  });
});
