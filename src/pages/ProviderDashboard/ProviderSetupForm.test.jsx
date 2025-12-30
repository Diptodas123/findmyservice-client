import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import ProviderSetupForm from './ProviderSetupForm';

vi.mock('../../utils/apiClient');
vi.mock('../../utils/toastMessage');
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('ProviderSetupForm', () => {
  it('should render provider setup form', () => {
    const { container } = render(
      <Provider store={store}>
        <ProviderSetupForm />
      </Provider>
    );
    expect(container).toBeTruthy();
  });
});
