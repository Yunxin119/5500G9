import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { configureStore } from '@reduxjs/toolkit';

// Create a mock Redux store
const mockStore = {
  getState: () => ({
    authReducer: global.mockAuthState,
    api: { queries: {}, mutations: {} }
  }),
  subscribe: jest.fn(),
  dispatch: jest.fn()
};

// Mock React Router DOM's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Mock the toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock the API call
const server = setupServer(
  rest.post('http://localhost:10210/api/users/login', (req, res, ctx) => {
    return res(ctx.json({
      _id: '123',
      username: 'testuser',
      email: 'test@example.com',
      token: 'fake-token'
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders login form correctly', () => {
  render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
  
  // Check if form elements are rendered
  expect(screen.getByRole('heading', { name: /Login OfferHunter/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Who goes there?')).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Shh... it's a secret")).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});