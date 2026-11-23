import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from 'react-toastify';
import toastMessage from './toastMessage';

vi.mock('react-toastify', () => ({
  toast: vi.fn(),
  Bounce: 'Bounce',
}));

describe('toastMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call toast with message and type', () => {
    toastMessage({ msg: 'Test message', type: 'success' });

    expect(toast).toHaveBeenCalledWith('Test message', expect.objectContaining({
      type: 'success',
      position: 'top-right',
      autoClose: 2000,
    }));
  });

  it('should handle error type', () => {
    toastMessage({ msg: 'Error message', type: 'error' });

    expect(toast).toHaveBeenCalledWith('Error message', expect.objectContaining({
      type: 'error',
    }));
  });

  it('should handle warning type', () => {
    toastMessage({ msg: 'Warning message', type: 'warning' });

    expect(toast).toHaveBeenCalledWith('Warning message', expect.objectContaining({
      type: 'warning',
    }));
  });

  it('should handle info type', () => {
    toastMessage({ msg: 'Info message', type: 'info' });

    expect(toast).toHaveBeenCalledWith('Info message', expect.objectContaining({
      type: 'info',
    }));
  });
});
