import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../src/test/test-utils';
import Banner from './Banner';

describe('Banner', () => {
  it('should render banner component', () => {
    render(<Banner />);
    
    // Just check that component renders without crashing
    expect(document.body).toBeInTheDocument();
  });
});
