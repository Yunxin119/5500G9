import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import CoverLetterGeneration from '../components/coverletter/CoverLetterGeneration';
import store from '../store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

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

test('generates cover letter when form is submitted', async () => {
  render(
    <Provider store={store}>
      <CoverLetterGeneration 
        resume="I am a software engineer with 3 years of experience"
        jd="Looking for a software engineer who can code in JavaScript"
        pdfText=""
      />
    </Provider>
  );
  
  // Find and click the generate button
  const generateButton = screen.getByText(/Generate Cover Letter/i);
  fireEvent.click(generateButton);
  
  // Wait for the cover letter to be displayed
  await waitFor(() => {
    expect(screen.getByText(/Professional Cover Letter/i)).toBeInTheDocument();
  });
});