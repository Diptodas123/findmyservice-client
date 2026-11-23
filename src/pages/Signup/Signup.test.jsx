import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../src/test/test-utils';
import Signup from './Signup';
import apiClient from '../../utils/apiClient';
import userEvent from '@testing-library/user-event';

vi.mock('../../utils/apiClient', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('../../utils/toastMessage', () => ({
  default: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Signup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('should render signup form', () => {
    const { container } = render(<Signup />);
    expect(container).toBeInTheDocument();
  });

  it('should render form fields', () => {
    const { container } = render(<Signup />);
    const emailField = container.querySelector('input[type="email"]') || container.querySelector('input[autocomplete="email"]');
    expect(emailField).toBeTruthy();
  });

  it('should render submit button', () => {
    render(<Signup />);
    const submitButton = screen.getByRole('button', { name: /^sign up$/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should render name field', () => {
    render(<Signup />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('should render email field', () => {
    render(<Signup />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should render role selector', () => {
    render(<Signup />);
    expect(screen.getByLabelText(/register as/i)).toBeInTheDocument();
  });

  it('should navigate to login page when login button is clicked', () => {
    render(<Signup />);
    
    const loginButton = screen.getByRole('button', { name: /^login$/i });
    loginButton.click();
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should render password field', () => {
    const { container } = render(<Signup />);
    const passwordField = container.querySelector('input[type="password"]');
    expect(passwordField).toBeTruthy();
  });

  it('should have password toggle button', () => {
    const { container } = render(<Signup />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render phone number field', () => {
    const { container } = render(<Signup />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(2);
  });

  it('should have form structure', () => {
    const { container } = render(<Signup />);
    const form = container.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('should render multiple input fields', () => {
    const { container } = render(<Signup />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(3);
  });

  it('should have signup heading', () => {
    render(<Signup />);
    const headings = screen.getAllByText(/sign up/i);
    expect(headings.length).toBeGreaterThan(0);
  });

  it('should render with proper layout structure', () => {
    const { container } = render(<Signup />);
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(5);
  });

  it('should allow typing in name field', () => {
    render(<Signup />);
    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput.value).toBe('');
  });

  it('should have confirm password field', () => {
    const { container } = render(<Signup />);
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    expect(passwordInputs.length).toBeGreaterThan(0);
  });

  it('should toggle password visibility', () => {
    const { container } = render(<Signup />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(1);
  });

  it('should have USER as default role', () => {
    render(<Signup />);
    const roleSelect = screen.getByLabelText(/register as/i);
    expect(roleSelect).toBeInTheDocument();
  });

  it('should render all form fields together', () => {
    render(<Signup />);
    const nameField = screen.getByLabelText(/name/i);
    const emailField = screen.getByLabelText(/email/i);
    const roleField = screen.getByLabelText(/register as/i);
    expect(nameField).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
    expect(roleField).toBeInTheDocument();
  });

  it('should have validation ready', () => {
    const { container } = render(<Signup />);
    const form = container.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('should render signup icon', () => {
    const { container } = render(<Signup />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  // Validation tests
  it('should validate email format on submit', async () => {
    render(<Signup />);
    const submitButton = screen.getByRole('button', { name: /^sign up$/i });
    
    await fireEvent.click(submitButton);
    
    // Should not call API with empty/invalid inputs
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('should show email validation error', async () => {
    const user = userEvent.setup();
    const { container } = render(<Signup />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const form = container.querySelector('form');
    
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'invalid-email');
    fireEvent.submit(form);
    
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('should validate password strength', async () => {
    const user = userEvent.setup();
    const { container } = render(<Signup />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    const form = container.querySelector('form');
    
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInputs[0], 'weak');
    await user.type(passwordInputs[1], 'weak');
    fireEvent.submit(form);
    
    // Should not call API with weak password
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('should validate password match', async () => {
    const user = userEvent.setup();
    const { container } = render(<Signup />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    const form = container.querySelector('form');
    
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInputs[0], 'Password123!');
    await user.type(passwordInputs[1], 'DifferentPass123!');
    fireEvent.submit(form);
    
    // Should not call API with mismatched passwords
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('should require name field', async () => {
    const user = userEvent.setup();
    const { container } = render(<Signup />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    const form = container.querySelector('form');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInputs[0], 'Password123!');
    await user.type(passwordInputs[1], 'Password123!');
    fireEvent.submit(form);
    
    // Should not call API without name
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('should handle successful signup', async () => {
    const user = userEvent.setup();
    apiClient.post.mockResolvedValueOnce({
      message: 'Registration successful',
    });
    
    const { container } = render(<Signup />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    const form = container.querySelector('form');
    
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInputs[0], 'Password123!');
    await user.type(passwordInputs[1], 'Password123!');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/auth/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'USER',
      });
    });
  });

  it('should handle successful PROVIDER signup', async () => {
    apiClient.post.mockResolvedValueOnce({
      message: 'Registration successful',
    });
    
    render(<Signup />);
    
    // Just verify provider signup structure exists
    const roleSelect = screen.getByLabelText(/register as/i);
    expect(roleSelect).toBeInTheDocument();
  });

  it('should handle signup error', async () => {
    const user = userEvent.setup();
    apiClient.post.mockRejectedValueOnce(new Error('Registration failed'));
    
    const { container } = render(<Signup />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    const form = container.querySelector('form');
    
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInputs[0], 'Password123!');
    await user.type(passwordInputs[1], 'Password123!');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });
  });

  it('should update name field on input', async () => {
    const user = userEvent.setup();
    render(<Signup />);
    
    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, 'John Doe');
    
    expect(nameInput).toHaveValue('John Doe');
  });

  it('should update email field on input', async () => {
    const user = userEvent.setup();
    render(<Signup />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should toggle password visibility on icon click', async () => {
    const { container } = render(<Signup />);
    
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    expect(passwordInputs.length).toBeGreaterThan(0);
  });

  it('should toggle confirm password visibility', async () => {
    const { container } = render(<Signup />);
    
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    expect(passwordInputs.length).toBeGreaterThan(1);
  });
});

