import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import CoverLetterGeneration from '../components/coverletter/CoverLetterGeneration';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Create a mock Redux store
const mockStore = {
  getState: () => ({
    authReducer: global.mockAuthState,
    api: { queries: {}, mutations: {} }
  }),
  subscribe: jest.fn(),
  dispatch: jest.fn()
};

// Mock the toast notifications
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock html2pdf
jest.mock('html2pdf.js', () => ({
  __esModule: true,
  default: {
    from: jest.fn().mockReturnValue({
      save: jest.fn()
    })
  }
}));

const server = setupServer(
  rest.post('http://localhost:10210/api/users/generate-cover-letter', (req, res, ctx) => {
    return res(ctx.json({
      coverLetter: '# Professional Cover Letter\n\nDear Hiring Manager...'
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders cover letter form', async () => {
  render(
    <Provider store={mockStore}>
      <CoverLetterGeneration 
        resume="I am a software engineer with 3 years of experience"
        jd="Looking for a software engineer who can code in JavaScript"
        pdfText=""
      />
    </Provider>
  );
  
  // Verify the component renders
  expect(screen.getByText('Auto-generated')).toBeInTheDocument();
  expect(screen.getByRole('button')).toBeInTheDocument();
  
  // Find placeholder text
  expect(screen.getByText(/Your professionally crafted cover letter will appear here/i)).toBeInTheDocument();
});