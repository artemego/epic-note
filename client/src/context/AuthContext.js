import { React, createContext, useReducer, useContext } from "react";
import * as authApi from "../api/authApi";
import * as ac from "./actions";

const AuthContext = createContext();

const initialState = {
  isAuth: false,
  accessToken: null,
  expiryDate: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
  email: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS": {
      return {
        isAuth: true,
        accessToken: action.accessToken,
        expiryDate: action.expiryDate,
        isLoading: false,
        isRefreshing: false,
        error: null,
        email: action.info.email,
      };
    }
    case "LOGOUT": {
      return {
        ...initialState,
      };
    }
    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case "SET_REFRESHING": {
      return {
        ...state,
        isRefreshing: action.payload,
      };
    }
    case "SET_ERROR": {
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = ({ email, password }) => {
    dispatch(ac.changeLoading(true));
    authApi
      .login({ email, password })
      .then(({ accessToken, expiresIn, info }) => {
        dispatch(ac.loginSuccess(accessToken, expiresIn, info));
      })
      .catch(({ error }) => {
        dispatch(ac.setError(error));
      });
  };

  // send register request, if response ok then dispatch login success.
  const register = ({ email, password }) => {
    dispatch(ac.changeLoading(true));
    authApi
      .register({ email, password })
      .then(({ accessToken, expiresIn, info }) => {
        dispatch(ac.loginSuccess(accessToken, expiresIn, info));
      })
      .catch(({ error }) => {
        dispatch(ac.setError(error));
      });
  };

  // send logout request, dispatch refresh to userContext and authContext.
  const logout = () => {
    dispatch(ac.changeLoading(true));
    authApi
      .logout()
      .then(() => {
        dispatch(ac.logout());
      })
      .catch(({ error }) => {
        dispatch(ac.setError(error));
      });
  };
  // dispatch refresh token from api, put new accesstoken and exp in context.
  const refreshToken = () => {
    dispatch(ac.changeLoading(true));
    dispatch(ac.changeRefreshing(true));
    authApi
      .refreshToken()
      .then(({ accessToken, expiresIn, info }) => {
        dispatch(ac.loginSuccess(accessToken, expiresIn, info));
      })
      .catch(({ error }) => {
        dispatch(ac.logout());
        console.error(error);
      });
  };

  return (
    <AuthContext.Provider
      value={{ state, login, register, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
