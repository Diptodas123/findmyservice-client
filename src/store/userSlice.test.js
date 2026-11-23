import { describe, it, expect } from 'vitest';
import userReducer, { setUser, clearUser } from './userSlice';

describe('userSlice', () => {
  const initialState = {
    profile: {
      name: '',
      email: '',
      phone: '',
      profilePictureUrl: '',
      userId: '',
      role: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
    },
  };

  it('should return initial state', () => {
    const result = userReducer(undefined, { type: 'unknown' });
    expect(result.profile).toBeDefined();
    expect(result.profile.name).toBe('');
  });

  it('should handle setUser', () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com',
      userId: '1',
    };

    const actual = userReducer(initialState, setUser(user));
    expect(actual.profile).toEqual(user);
  });

  it('should handle clearUser', () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com',
      userId: '1',
    };

    const stateWithUser = userReducer(initialState, setUser(user));
    const actual = userReducer(stateWithUser, clearUser());
    
    expect(actual.profile.name).toBe('');
    expect(actual.profile.email).toBe('');
    expect(actual.profile.userId).toBe('');
  });

  it('should overwrite existing user on setUser', () => {
    const user1 = {
      name: 'User 1',
      email: 'user1@example.com',
      userId: '1',
    };

    const user2 = {
      name: 'User 2',
      email: 'user2@example.com',
      userId: '2',
    };

    const stateWithUser1 = userReducer(initialState, setUser(user1));
    const actual = userReducer(stateWithUser1, setUser(user2));
    
    expect(actual.profile).toEqual(user2);
  });
});
