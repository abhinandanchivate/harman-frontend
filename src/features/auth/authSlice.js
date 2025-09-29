import { createSlice } from '@reduxjs/toolkit';

const storageKey = 'harman-auth';

const loadState = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to parse auth state from storage', error);
    return null;
  }
};

const persistState = (state) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to persist auth state', error);
  }
};

const emptyState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const initialState = { ...emptyState, ...(loadState() || {}) };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      if (!payload) return;
      if (Object.prototype.hasOwnProperty.call(payload, 'user')) {
        state.user = payload.user;
      }
      if (payload.access || payload.accessToken) {
        state.accessToken = payload.access || payload.accessToken;
      }
      if (payload.refresh || payload.refreshToken) {
        state.refreshToken = payload.refresh || payload.refreshToken;
      }
      persistState(state);
    },
    clearAuth: () => {
      persistState(emptyState);
      return { ...emptyState };
    },
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;
