import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CoverLetterGeneration from '../components/coverletter/CoverLetterGeneration';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import authReducer from '../redux/authReducer';

// Mock react-markdown since it causes issues with Jest
jest.mock('react-markdown', () => (props) => {
  return <div data-testid="markdown">{props.children}</div>;
});

// Mock react-icons
jest.mock('react-icons/fi', () => ({
  FiDownload: () => <div data-testid="download-icon" />,
  FiCopy: () => <div data-testid="copy-icon" />,
  FiCheck: () => <div data-testid="check-icon" />,
  FiPlus: () => <div data-testid="plus-icon" />
}));

// Mock html2pdf
jest.mock('html2pdf.js', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    save: jest.fn().mockResolvedValue(undefined)
  })
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve())
  }
});

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
  }
}));

// Mock AddCompany component which is causing the infinite loop
jest.mock('../components/AddCompany', () => () => <div data-testid="mock-add-company">Add Company Mock</div>);

// Mock the RTK Query hooks
jest.mock('../redux/userApiSlice', () => {
  // Create mocks inside the factory function to avoid reference errors
  const generateCoverLetterMock = jest.fn().mockImplementation(() => ({
    unwrap: jest.fn().mockResolvedValue({
      coverLetter: '# Generated Cover Letter\n\nDear Hiring Manager,\n\nThis is a test cover letter generated for testing purposes.\n\nSincerely,\nTest User'
    })
  }));
  
  const extractJobInfoMock = jest.fn().mockImplementation(() => ({
    unwrap: jest.fn().mockResolvedValue({
      company: 'Test Company',
      role: 'Software Engineer',
      city: 'San Francisco, CA',
      deadline: '2025-05-01'
    })
  }));
  
  return {
    useGenerateCoverLetterMutation: () => [generateCoverLetterMock, { isLoading: false }],
    useExtractJobInfoMutation: () => [extractJobInfoMock, { isLoading: false }],
    // Expose the mocks so they can be reconfigured in tests
    _getMocks: () => ({
      generateCoverLetterMock,
      extractJobInfoMock
    })
  };
});

// Helper to get the current mock functions
const getMocks = () => require('../redux/userApiSlice')._getMocks();

// Mock the API calls
const server = setupServer(
  // Mock cover letter generation endpoint
  rest.post('http://localhost:10210/api/users/generate-cover-letter', (req, res, ctx) => {
    return res(
      ctx.json({
        coverLetter: '# Generated Cover Letter\n\nDear Hiring Manager,\n\nThis is a test cover letter generated for testing purposes.\n\nSincerely,\nTest User'
      })
    );
  }),
  
  // Mock job info extraction endpoint
  rest.post('http://localhost:10210/api/users/extract-job-info', (req, res, ctx) => {
    return res(
      ctx.json({
        company: 'Test Company',
        role: 'Software Engineer',
        city: 'San Francisco, CA',
        deadline: '2025-05-01'
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Create a proper Redux store for testing
const createTestStore = () => {
  return configureStore({
    reducer: {
      authReducer: authReducer,
      // Add other reducers as needed
      api: (state = { queries: {}, mutations: {} }) => state
    },
    preloadedState: {
      authReducer: {
        userInfo: {
          _id: '123',
          username: 'testuser',
          email: 'test@example.com'
        }
      }
    }
  });
};

describe('CoverLetter Generation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders the cover letter form', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <CoverLetterGeneration />
      </Provider>
    );
    
    // Use more specific selectors to avoid ambiguity
    const coverLetterLabel = screen.getByText(/^Cover Letter$/); // Use regex with start/end anchors to match exact text
    expect(coverLetterLabel).toBeInTheDocument();
    expect(coverLetterLabel).toHaveClass('text-2xl', 'font-bold', 'sec-text');
    
    expect(screen.getByText(/Auto-generated/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Cover Letter/i })).toBeInTheDocument();
    expect(screen.getByText(/professionally crafted cover letter/i)).toBeInTheDocument();
  });
  
  test('shows error when generating without resume or job description', async () => {
    const store = createTestStore();
    const { toast } = require('react-toastify');
    
    render(
      <Provider store={store}>
        <CoverLetterGeneration />
      </Provider>
    );
    
    // Click the generate button without providing resume or job description
    const generateButton = screen.getByRole('button', { name: /Generate Cover Letter/i });
    fireEvent.click(generateButton);
    
    // Verify error message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Please upload your resume'));
    });
  });
  
  test('generates cover letter when provided with resume and job description', async () => {
    const store = createTestStore();
    const { toast } = require('react-toastify');
    const { generateCoverLetterMock } = getMocks();
    
    // Update the mock implementation for this test
    generateCoverLetterMock.mockImplementation(() => ({
      unwrap: jest.fn().mockResolvedValue({
        coverLetter: '# Generated Cover Letter\n\nDear Hiring Manager,\n\nThis is a test cover letter.'
      })
    }));
    
    // Render with props
    render(
      <Provider store={store}>
        <CoverLetterGeneration
          resume="My resume content"
          jd="Software Engineer job description"
        />
      </Provider>
    );
    
    const generateButton = screen.getByRole('button', { name: /Generate Cover Letter/i });
    fireEvent.click(generateButton);
    
    // Verify the API call was made
    await waitFor(() => {
      expect(generateCoverLetterMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Cover letter generated successfully!');
    });
  });
});