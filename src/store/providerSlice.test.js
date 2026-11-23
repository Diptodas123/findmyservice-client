import { describe, it, expect } from 'vitest';
import providerReducer, { setProvider, updateProvider, clearProvider } from './providerSlice';

describe('providerSlice', () => {
  it('should return the initial state', () => {
    const state = providerReducer(undefined, { type: 'unknown' });
    expect(state.profile).toBeDefined();
    expect(state.isProfileComplete).toBe(false);
  });

  it('should handle setProvider', () => {
    const profile = {
      providerId: '1',
      providerName: 'Test Provider',
      email: 'test@example.com',
      phone: '123-456-7890',
      city: 'New York',
      state: 'NY',
    };
    const actual = providerReducer(undefined, setProvider(profile));
    expect(actual.profile.providerName).toBe('Test Provider');
    expect(actual.isProfileComplete).toBe(true);
  });

  it('should handle updateProvider', () => {
    const initialState = {
      profile: {
        providerName: 'Test Provider',
        email: 'test@example.com',
        phone: '123-456-7890',
        city: 'NYC',
        state: 'NY',
      },
      isProfileComplete: true,
    };
    const updates = { providerName: 'Updated Provider' };
    const actual = providerReducer(initialState, updateProvider(updates));
    expect(actual.profile.providerName).toBe('Updated Provider');
    expect(actual.profile.email).toBe('test@example.com');
  });

  it('should handle clearProvider', () => {
    const state = {
      profile: { providerName: 'Test Provider' },
      isProfileComplete: true,
    };
    const actual = providerReducer(state, clearProvider());
    expect(actual.isProfileComplete).toBe(false);
    expect(actual.profile.providerName).toBe('');
  });
});
