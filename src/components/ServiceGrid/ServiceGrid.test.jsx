import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../src/test/test-utils';
import ServiceGrid from './ServiceGrid';

describe('ServiceGrid', () => {
  const mockItems = [
    { serviceName: 'Service 1', imageUrl: 'http://example.com/img1.jpg' },
    { serviceName: 'Service 2', imageUrl: 'http://example.com/img2.jpg' },
    { serviceName: 'Service 3', imageUrl: 'http://example.com/img3.jpg' },
  ];

  it('should render without crashing', () => {
    render(<ServiceGrid items={[]} />);
    expect(document.querySelector('.sg-grid')).toBeInTheDocument();
  });

  it('should render all items', () => {
    render(<ServiceGrid items={mockItems} />);
    
    expect(screen.getByText('Service 1')).toBeInTheDocument();
    expect(screen.getByText('Service 2')).toBeInTheDocument();
    expect(screen.getByText('Service 3')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<ServiceGrid items={mockItems} onItemClick={handleClick} />);
    
    const firstCard = screen.getByText('Service 1').closest('.sg-card');
    firstCard.click();
    
    expect(handleClick).toHaveBeenCalledWith('Service 1');
  });

  it('should use custom props for image and title', () => {
    const customItems = [
      { name: 'Custom 1', img: 'http://example.com/custom1.jpg' },
    ];
    
    render(
      <ServiceGrid 
        items={customItems} 
        titleProp="name" 
        imageProp="img" 
      />
    );
    
    expect(screen.getByText('Custom 1')).toBeInTheDocument();
  });

  it('should use default image when image prop is missing', () => {
    const itemsWithoutImage = [{ serviceName: 'No Image' }];
    
    render(
      <ServiceGrid 
        items={itemsWithoutImage} 
        defaultImage="default.jpg" 
      />
    );
    
    const img = screen.getByAltText('No Image');
    expect(img).toHaveAttribute('src', 'default.jpg');
  });

  it('should apply custom card size', () => {
    render(<ServiceGrid items={mockItems} cardSize={200} />);
    
    const grid = document.querySelector('.sg-grid');
    expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fill, 200px)' });
  });

  it('should use keyFn for keys when provided', () => {
    const keyFn = (item) => `key-${item.serviceName}`;
    const { container } = render(<ServiceGrid items={mockItems} keyFn={keyFn} />);
    
    const items = container.querySelectorAll('.sg-item');
    expect(items.length).toBe(3);
  });
});
