import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProviderSidebar from './ProviderSidebar';

vi.mock('react-redux', () => ({
  useSelector: vi.fn(() => ({ profile: { name: 'Test Provider' } })),
}));

describe('ProviderSidebar', () => {
  it('should render provider sidebar', () => {
    const { container } = render(
      <MemoryRouter>
        <ProviderSidebar />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
