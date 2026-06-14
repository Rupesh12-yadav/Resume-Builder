import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Resume Builder title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Resume Builder/i); // Sahi hai!
  expect(linkElement).toBeInTheDocument();
});
