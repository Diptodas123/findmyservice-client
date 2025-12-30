import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import ProviderHomeView from './ProviderHomeView';

vi.mock('../../utils/apiClient');

describe('ProviderHomeView', () => {
  it('should render provider home view', () => {
    const { container } = render(
      <Provider store={store}>
        <ProviderHomeView />
      </Provider>
    );
    expect(container).toBeTruthy();
  });
});
