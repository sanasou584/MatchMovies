import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, vi } from 'vitest';
import { User } from 'firebase/auth';
import App from './App';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

vi.mock('./context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);

beforeEach(() => {
  mockUseAuth.mockReturnValue({
    user: null,
    role: null,
    loading: false,
    logout: vi.fn(),
  });
});

test('renders without crashing', () => {
  mockUseAuth.mockReturnValue({
    user: null,
    role: null,
    loading: true,
    logout: vi.fn(),
  });

  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});

test('renders protected content once authenticated and loaded', () => {
  mockUseAuth.mockReturnValue({
    user: { uid: '123' } as unknown as User,
    role: 'user',
    loading: false,
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
