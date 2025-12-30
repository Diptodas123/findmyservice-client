import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../../store/store';
import ProviderHeader from './ProviderHeader';

describe('ProviderHeader', () => {
  it('should render provider header', () => {
    const mockHandleDrawerToggle = vi.fn();
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ProviderHeader handleDrawerToggle={mockHandleDrawerToggle} />
        </MemoryRouter>
      </Provider>
    );
    expect(container).toBeTruthy();
  });
});
