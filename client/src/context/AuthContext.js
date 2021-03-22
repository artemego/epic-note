import { React, createContext, useReducer, useContext } from "react";
import * as authApi from "../api/authApi";
import * as ac from "./actions";

const AuthContext = createContext();

const initialState = {
  isAuth: false,
  accessToken: null,
  expiryDate: null,
  isLoading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS": {
      return {
        isAuth: true,
        accessToken: action.accessToken,
        expiryDate: action.expiryDate,
        isLoading: false,
        error: null,
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

  // здесь наверное как-то надо добавить useCallback
  const login = ({ email, password }) => {
    dispatch(ac.changeLoading(true));
    authApi
      .login({ email, password })
      .then(({ accessToken, expiresIn }) => {
        dispatch(ac.loginSuccess(accessToken, expiresIn));
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
      .then(({ accessToken, expiresIn }) => {
        dispatch(ac.loginSuccess(accessToken, expiresIn));
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
        // dispatch(ac.changeLoading(false));
        dispatch(ac.logout());
      })
      .catch(({ error }) => {
        dispatch(ac.setError(error));
      });
  };
  // dispatch refresh token from api, put new accesstoken and exp in context.
  // maybe make this async to return the response obj
  const refreshToken = () => {
    dispatch(ac.changeLoading(true));
    authApi
      .refreshToken()
      .then(({ accessToken, expiresIn }) => {
        dispatch(ac.loginSuccess(accessToken, expiresIn));
      })
      .catch(({ error }) => {
        // здесь надо еще выйти из приложения ЕСЛИ ПОЛЬЗОВАТЕЛЬ ЗАЛОГИНЕН.
        dispatch(ac.logout());
        dispatch(ac.setError(error));
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
