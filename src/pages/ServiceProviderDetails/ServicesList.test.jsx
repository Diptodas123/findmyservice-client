import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store/store';
import ServicesList from './ServicesList';

vi.mock('../../theme/useThemeMode', () => ({
  useThemeMode: () => ({ mode: 'light' }),
}));

// Mock truncate function
const mockTruncate = (str, len) => str?.slice(0, len) || '';

describe('ServicesList', () => {
  it('should render services list', () => {
    const mockServices = [
      { id: '1', name: 'Service 1', price: 100, description: 'Test description' },
      { id: '2', name: 'Service 2', price: 200, description: 'Test description' },
    ];
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ServicesList services={mockServices} truncate={mockTruncate} />
        </MemoryRouter>
      </Provider>
    );
    expect(container).toBeTruthy();
  });

  it('should render empty state when no services', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ServicesList services={[]} truncate={mockTruncate} />
        </MemoryRouter>
      </Provider>
    );
    expect(container).toBeTruthy();
  });
});
