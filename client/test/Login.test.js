import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import store from '../store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

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

test('login form submits correctly with valid credentials', async () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
  
  fireEvent.change(screen.getByPlaceholderText('Who goes there?'), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.change(screen.getByPlaceholderText("Shh... it's a secret"), {
    target: { value: 'password123' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
  await waitFor(() => {
    // Assert that we've been redirected or authentication state updated
    expect(store.getState().authReducer.userInfo).not.toBeNull();
  });
});