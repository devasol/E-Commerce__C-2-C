import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import { AuthState } from '../types';

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (userData: { name: string; email: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
};

type AuthAction =
  | { type: 'AUTH_SUCCESS'; payload: { user: any; token: string } }
  | { type: 'AUTH_FAIL' }
  | { type: 'USER_LOADED'; payload: any }
  | { type: 'USER_UPDATE'; payload: any }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case 'USER_UPDATE':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    if (localStorage.getItem('token')) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const res = await authAPI.getMe();
        dispatch({ type: 'USER_LOADED', payload: res.data.data });
      } catch (err) {
        dispatch({ type: 'AUTH_FAIL', payload: false });
      }
    } else {
      dispatch({ type: 'AUTH_FAIL', payload: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await authAPI.login(email, password);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: res.data.user,
          token: res.data.token,
        },
      });
      return res.data;
    } catch (err: any) {
<<<<<<< HEAD
      throw err?.response?.data || err;
=======
      throw err.response.data;
>>>>>>> 6281576513cf78cfbb928bd30123346a6cb2908d
    }
  };

  const register = async (name: string, email: string, password: string, role?: string) => {
    try {
      const res = await authAPI.register({ name, email, password, role });
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: res.data.user,
          token: res.data.token,
        },
      });
      return res.data;
    } catch (err: any) {
<<<<<<< HEAD
      throw err?.response?.data || err;
=======
      throw err.response.data;
>>>>>>> 6281576513cf78cfbb928bd30123346a6cb2908d
    }
  };

  const logout = () => {
    authAPI.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (userData: { name: string; email: string }) => {
    try {
      const res = await authAPI.updateDetails(userData);
      dispatch({ type: 'USER_UPDATE', payload: res.data.data });
      return res.data;
    } catch (err: any) {
<<<<<<< HEAD
      throw err?.response?.data || err;
=======
      throw err.response.data;
>>>>>>> 6281576513cf78cfbb928bd30123346a6cb2908d
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const res = await authAPI.updatePassword({ currentPassword, newPassword });
      return res.data;
    } catch (err: any) {
<<<<<<< HEAD
      throw err?.response?.data || err;
=======
      throw err.response.data;
>>>>>>> 6281576513cf78cfbb928bd30123346a6cb2908d
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        loadUser,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};