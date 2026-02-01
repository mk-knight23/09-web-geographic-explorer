import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock axios to avoid actual API calls
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: [
          {
            name: { common: 'Test Country' },
            flags: { svg: 'test.svg' },
            population: 1000000,
            region: 'Asia',
            capital: ['Test Capital'],
            cca3: 'TST'
          }
        ]
      })
    )
  }
}));

describe('Country Explorer App', () => {
    it('renders navigation with region filters', async () => {
        render(<App />);
        await waitFor(() => {
            expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
        });
    });

    it('renders search input with proper accessibility', async () => {
        render(<App />);
        await waitFor(() => {
            const searchInput = screen.getByLabelText(/search countries/i);
            expect(searchInput).toBeInTheDocument();
            expect(searchInput).toHaveAttribute('aria-describedby');
        });
    });

    it('displays loading state initially', () => {
        render(<App />);
        expect(screen.getByText(/mapping the fragments/i)).toBeInTheDocument();
    });

    it('has proper ARIA labels on interactive elements', async () => {
        render(<App />);
        await waitFor(() => {
            // Check that region filter exists
            expect(screen.getByRole('button', { name: /Filter by All/i })).toBeInTheDocument();
        });
    });

    it('shows error state when API fails', async () => {
        const axios = (await import('axios')).default;
        (axios.get as any).mockRejectedValueOnce(new Error('Network error'));

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/Unable to load countries/i)).toBeInTheDocument();
        });
    });
});
