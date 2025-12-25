import React, { createContext, useContext, useReducer } from 'react';
import { CartState, CartItem } from '../types';
import { cartAPI } from '../services/api';

interface CartContextType {
  state: CartState;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
};

type CartAction =
  | { type: 'ADD_TO_CART'; payload: any }
  | { type: 'REMOVE_FROM_CART'; payload: any }
  | { type: 'UPDATE_CART'; payload: any }
  | { type: 'CLEAR_CART'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean };

const CartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
    case 'REMOVE_FROM_CART':
    case 'UPDATE_CART':
    case 'CLEAR_CART':
      return {
        ...state,
        items: action.payload.items,
        totalItems: action.payload.totalItems,
        totalPrice: action.payload.totalPrice,
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

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(CartReducer, initialState);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await cartAPI.get();
      dispatch({ type: 'ADD_TO_CART', payload: res.data.data });
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await cartAPI.addToCart(productId, quantity);
      dispatch({ type: 'ADD_TO_CART', payload: res.data.data });
    } catch (err: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw err.response.data;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await cartAPI.removeFromCart(productId);
      dispatch({ type: 'REMOVE_FROM_CART', payload: res.data.data });
    } catch (err: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw err.response.data;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await cartAPI.update(productId, quantity);
      dispatch({ type: 'UPDATE_CART', payload: res.data.data });
    } catch (err: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw err.response.data;
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await cartAPI.clearCart();
      dispatch({ type: 'CLEAR_CART', payload: res.data.data });
    } catch (err: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw err.response.data;
    }
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};