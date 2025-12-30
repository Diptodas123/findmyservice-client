import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import ProfilePage from './ProfilePage';

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

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the profile page', () => {
    render(<ProfilePage />);
    
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
  });

  it('displays profile sidebar navigation', () => {
    render(<ProfilePage />);
    
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
  });

  it('shows personal information form fields', () => {
    render(<ProfilePage />);
    
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
  });

  it('switches to address tab', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);
    
    const addressButton = screen.getByRole('button', { name: /address/i });
    await user.click(addressButton);
    
    expect(screen.getByText('Address Information')).toBeInTheDocument();
    expect(screen.getByLabelText(/Address Line 1/i)).toBeInTheDocument();
  });

  it('switches to account settings tab', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);
    
    const settingsButton = screen.getByRole('button', { name: /account settings/i });
    await user.click(settingsButton);
    
    const headings = screen.getAllByText('Account Settings');
    expect(headings.length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/Current Password/i)).toBeInTheDocument();
  });

  it('displays profile picture upload button', () => {
    render(<ProfilePage />);
    
    const uploadButton = screen.getByRole('button', { name: /upload photo/i });
    expect(uploadButton).toBeInTheDocument();
  });

  it('has save changes button', () => {
    render(<ProfilePage />);
    
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    expect(saveButton).toBeInTheDocument();
  });
});
