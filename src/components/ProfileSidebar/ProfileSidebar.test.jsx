import { describe, it, expect } from 'vitest';
import { render } from '../../../src/test/test-utils';
import ProfileSidebar from '../../pages/Profile/ProfileSidebar';

describe('ProfileSidebar', () => {
  it('should render without crashing', () => {
    const { container } = render(<ProfileSidebar activeTab="profile" onTabChange={() => {}} />);
    expect(container).toBeInTheDocument();
  });

  it('should render navigation items', () => {
    const { container } = render(<ProfileSidebar activeTab="profile" onTabChange={() => {}} />);
    expect(container.firstChild).toBeTruthy();
  });
});
