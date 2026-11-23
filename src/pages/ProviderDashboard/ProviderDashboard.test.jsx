import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store/store';
import ProviderDashboard from './ProviderDashboard';

vi.mock('../../utils/apiClient');

describe('ProviderDashboard', () => {
  it('should render provider dashboard', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ProviderDashboard />
        </MemoryRouter>
      </Provider>
    );
    expect(container).toBeTruthy();
  });
});
