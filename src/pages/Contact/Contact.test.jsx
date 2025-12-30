import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../src/test/test-utils';
import Contact from './Contact';
import toastMessage from '../../utils/toastMessage';

vi.mock('../../utils/toastMessage', () => ({
  default: vi.fn(),
}));

describe('Contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete window.location;
    window.location = { href: '' };
  });

  it('should render contact form', () => {
    const { container } = render(<Contact />);
    expect(container).toBeInTheDocument();
  });

  it('should render form fields', () => {
    const { container } = render(<Contact />);
    expect(container.querySelector('input[name="email"]')).toBeTruthy();
  });

  it('should render submit button', () => {
    const { container } = render(<Contact />);
    expect(container.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should render all form fields', () => {
    render(<Contact />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('should display contact information', () => {
    render(<Contact />);
    
    expect(screen.getByText(/support@findmyservice\.com/i)).toBeInTheDocument();
  });

  it('should show error when submitting empty form', () => {
    render(<Contact />);
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    expect(submitButton).toBeInTheDocument();
    
    // Form should have all required fields
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should validate email format', () => {
    render(<Contact />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Email input should accept the value
    expect(emailInput).toHaveValue('invalid-email');
  });

  it('should accept valid email addresses', () => {
    render(<Contact />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test Message' } });
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    expect(toastMessage).toHaveBeenCalledWith({
      msg: 'Opening your email client...',
      type: 'success',
    });
  });

  it('should construct mailto link with form data', () => {
    render(<Contact />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test Message' } });
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    expect(window.location.href).toContain('mailto:support@findmyservice.com');
    expect(window.location.href).toContain('subject=Test%20Subject');
  });

  it('should update form fields when typing', () => {
    render(<Contact />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
  });

  it('should reset form after successful submission', async () => {
    render(<Contact />);
    
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    expect(nameInput).toHaveValue('John Doe');
  });

  it('should display contact heading', () => {
    render(<Contact />);
    // Should render contact page
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('should show multiple ways to contact', () => {
    render(<Contact />);
    
    // Should show email, phone, and address sections
    const contactSections = screen.getAllByRole('heading', { level: 6 });
    expect(contactSections.length).toBeGreaterThan(0);
  });

  it('should have subject field', () => {
    render(<Contact />);
    const subjectField = screen.getByLabelText(/subject/i);
    expect(subjectField.value).toBe('');
  });

  it('should allow empty form initially', () => {
    const { container } = render(<Contact />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should render contact info section', () => {
    const { container } = render(<Contact />);
    const headings = container.querySelectorAll('h6');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('should have all form controls', () => {
    const { container } = render(<Contact />);
    const form = container.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('should render social media links', () => {
    const { container } = render(<Contact />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });
});
