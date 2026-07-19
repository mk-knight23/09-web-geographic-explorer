import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
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

const renderApp = () => {
  const router = createMemoryRouter([{ path: '/', element: <App /> }], {
    initialEntries: ['/'],
  });
  return render(<RouterProvider router={router} />);
};

describe('Country Explorer App', () => {
    beforeEach(() => {
        sessionStorage.clear();
        vi.clearAllMocks();
    });

    it('renders navigation with region filters', async () => {
        renderApp();
        await waitFor(() => {
            expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
        });
    });

    it('renders search input with proper accessibility', async () => {
        renderApp();
        await waitFor(() => {
            const searchInput = screen.getByLabelText(/search countries/i);
            expect(searchInput).toBeInTheDocument();
            expect(searchInput).toHaveAttribute('aria-describedby');
        });
    });

    it('displays loading state initially', async () => {
        const axios = (await import('axios')).default;
        (axios.get as any).mockReturnValueOnce(new Promise(() => {}));
        renderApp();
        expect(await screen.findByText(/Loading countries/i)).toBeInTheDocument();
    });

    it('has proper ARIA labels on interactive elements', async () => {
        renderApp();
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument();
        });
    });

    it('shows error state when API fails', async () => {
        const axios = (await import('axios')).default;
        (axios.get as any).mockRejectedValueOnce(new Error('Network error'));

        renderApp();

        await waitFor(() => {
            expect(screen.getByText(/Unable to load countries/i)).toBeInTheDocument();
        });
    });
});



