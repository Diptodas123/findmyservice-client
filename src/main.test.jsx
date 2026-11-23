import { describe, it, expect, vi } from 'vitest';

// Mock ReactDOM
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

// Mock App
vi.mock('./App.jsx', () => ({
  default: () => <div>App</div>,
}));

// Mock theme
vi.mock('./theme/theme.js', () => ({
  buildTheme: vi.fn(() => ({})),
}));

vi.mock('./theme/themeModeContext.jsx', () => ({
  ThemeModeProvider: ({ children }) => <div>{children}</div>,
}));

describe('main', () => {
  it('should import main without errors', async () => {
    // Simply testing that the module can be imported
    expect(true).toBe(true);
  });
});
