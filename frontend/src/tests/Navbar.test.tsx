import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';
import '@testing-library/jest-dom';

describe('Navbar', () => {
  it('renders the navbar component', () => {
    expect(screen.queryByText(/finops/i)).not.toBeInTheDocument();
    render(<Navbar />);
    expect(screen.getByText(/finops/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /costs/i })).toBeInTheDocument();
  });
});