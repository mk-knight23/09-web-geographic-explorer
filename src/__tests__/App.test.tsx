import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    const router = createMemoryRouter([{ path: '/', element: <App /> }], {
      initialEntries: ['/'],
    });
    const { container } = render(<RouterProvider router={router} />);
    expect(container).toBeInTheDocument()
  })
})

