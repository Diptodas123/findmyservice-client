import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../src/test/test-utils';
import NewsLetter from './NewsLetter';
import toastMessage from '../../utils/toastMessage';

vi.mock('../../utils/toastMessage', () => ({
  default: vi.fn(),
}));

describe('NewsLetter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render newsletter form', () => {
    render(<NewsLetter />);
    
    expect(screen.getByText(/Get updates — join our newsletter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subscribe/i })).toBeInTheDocument();
  });

  it('should update email input value', () => {
    render(<NewsLetter />);
    
    const emailInput = screen.getByLabelText(/Email address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput.value).toBe('test@example.com');
  });

  it('should show success message for valid email', () => {
    render(<NewsLetter />);
    
    const emailInput = screen.getByLabelText(/Email address/i);
    const submitButton = screen.getByRole('button', { name: /Subscribe/i });
    
    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    fireEvent.click(submitButton);
    
    expect(toastMessage).toHaveBeenCalledWith({
      msg: 'Thank you for subscribing to our newsletter!',
      type: 'success',
    });
  });

  it('should show error message for invalid email', () => {
    render(<NewsLetter />);
    
    const emailInput = screen.getByLabelText(/Email address/i);
    const submitButton = screen.getByRole('button', { name: /Subscribe/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    expect(toastMessage).toHaveBeenCalledWith({
      msg: 'Invalid Email',
      type: 'error',
    });
  });

  it('should handle form submission', () => {
    render(<NewsLetter />);
    
    const form = screen.getByRole('button', { name: /Subscribe/i }).closest('form');
    const emailInput = screen.getByLabelText(/Email address/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.submit(form);
    
    expect(toastMessage).toHaveBeenCalled();
  });

  it('should display newsletter description', () => {
    render(<NewsLetter />);
    
    expect(screen.getByText(/Promotions, new providers and tips delivered weekly/i)).toBeInTheDocument();
  });
});
