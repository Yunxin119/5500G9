import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import authReducer from '../redux/authReducer';

// Mock React Router DOM's useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

// Mock the toast notification
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Create a mock login function with proper implementation
const mockLogin = jest.fn();

// Mock the RTK Query hook - Create the mock directly in the factory function
jest.mock('../redux/userApiSlice', () => {
  return {
    useLoginMutation: () => [
      (...args) => {
        // Call the mock function to track calls
        mockLogin(...args);
        // Return an object with an unwrap method that resolves/rejects based on the current test
        return {
          unwrap: () => {
            if (args[0]?.email === 'success@example.com' && args[0]?.password === 'password123') {
              return Promise.resolve({
                _id: '123',
                username: 'testuser',
                email: 'success@example.com',
                token: 'fake-token'
              });
            }
            return Promise.reject({
              data: { message: 'Invalid email or password' }
            });
          }
        };
      },
      { isLoading: false }
    ]
  };
});

// Create a proper Redux store for testing
const createTestStore = () => {
  return configureStore({
    reducer: {
      authReducer: authReducer,
      // Add other reducers as needed
      api: (state = { queries: {}, mutations: {} }) => state
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      serializableCheck: false // Disable serializability check for testing
    }),
    preloadedState: {
      authReducer: {
        userInfo: null
      }
    }
  });
};

describe('Login Component', () => {
  beforeEach(() => {
    // Reset all mocks between tests
    jest.clearAllMocks();
    mockedNavigate.mockClear();
  });

  test('renders login form correctly', () => {
    render(
      <Provider store={createTestStore()}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    
    // Use more specific selectors to avoid ambiguity
    expect(screen.getByRole('heading', { name: /Login OfferHunter/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Who goes there/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/it's a secret/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    const { toast } = require('react-toastify');
    const mockStore = createTestStore();
    
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    
    // Fill the form with valid credentials
    fireEvent.change(screen.getByPlaceholderText(/Who goes there/i), {
      target: { value: 'success@example.com' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/it's a secret/i), {
      target: { value: 'password123' }
    });
    
    // Submit the form by clicking the button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Verify the login function was called with the right credentials
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'success@example.com',
      password: 'password123'
    });
    
    // Wait for the navigation to occur after successful login
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles login failure', async () => {
    const { toast } = require('react-toastify');
    const mockStore = createTestStore();
    
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    
    // Fill the form with invalid credentials
    fireEvent.change(screen.getByPlaceholderText(/Who goes there/i), {
      target: { value: 'wrong@example.com' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/it's a secret/i), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit the form by clicking the button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Verify login was called
    expect(mockLogin).toHaveBeenCalled();
    
    // Wait for error toast to be called
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});