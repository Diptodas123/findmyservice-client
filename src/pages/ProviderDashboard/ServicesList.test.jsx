import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ServicesList from './ServicesList';

vi.mock('../../utils/apiClient');
vi.mock('../../utils/toastMessage');

describe('ServicesList', () => {
  it('should render services list', () => {
    const { container } = render(
      <MemoryRouter>
        <ServicesList />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
