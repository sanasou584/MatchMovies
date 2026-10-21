import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from './App';
import { ProtectedRoute } from './pages/ProtectedRoute';
import { useAuth } from './context/AuthContext';

vi.mock('./context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});

test('does not block protected content on loading state', () => {
  vi.mocked(useAuth).mockReturnValue({
    user: { uid: '123' } as any,
    role: 'user',
    loading: true,
    logout: vi.fn(),
  });

  render(
    <MemoryRouter>
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    </MemoryRouter>
  );

  expect(screen.getByText('Protected Content')).toBeTruthy();
});
