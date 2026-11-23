import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/test-utils';
import ProfilePage from '../pages/Profile/ProfilePage';

// Mock toast
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(() => 'toast-id'),
    dismiss: vi.fn(),
  },
  ToastContainer: () => null,
}));

describe('ProfilePage Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows user to update profile information', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);
    
    // Find and fill in name field
    const nameInput = screen.getByLabelText(/^Name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'John Doe');
    
    // Find and fill in email field
    const emailInput = screen.getByLabelText(/Email/i);
    await user.clear(emailInput);
    await user.type(emailInput, 'john.doe@example.com');
    
    // Verify values were entered
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john.doe@example.com');
  });

  it('allows user to navigate between tabs and fill different sections', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);
    
    // Navigate to address tab
    const addressButton = screen.getByRole('button', { name: /address/i });
    await user.click(addressButton);
    
    // Fill address fields
    const address1Input = screen.getByLabelText(/Address Line 1/i);
    await user.clear(address1Input);
    await user.type(address1Input, '123 Main St');
    
    expect(address1Input).toHaveValue('123 Main St');
    
    // Navigate to settings tab
    const settingsButton = screen.getByRole('button', { name: /account settings/i });
    await user.click(settingsButton);
    
    // Verify settings section is displayed
    const headings = screen.getAllByText('Account Settings');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('maintains form state when switching tabs', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);
    
    // Enter data in personal info
    const nameInput = screen.getByLabelText(/^Name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Jane Smith');
    
    // Switch to address tab
    const addressButton = screen.getByRole('button', { name: /address/i });
    await user.click(addressButton);
    
    // Switch back to personal info
    const personalButton = screen.getByRole('button', { name: /personal info/i });
    await user.click(personalButton);
    
    // Verify data persisted
    const nameInputAgain = screen.getByLabelText(/^Name/i);
    expect(nameInputAgain).toHaveValue('Jane Smith');
  });
});
