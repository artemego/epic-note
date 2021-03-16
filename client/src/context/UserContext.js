import { React, useEffect, createContext, useReducer } from "react";

const UserContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        isAuth: true,
      };
    }
    case "LOGOUT": {
      return {
        isAuth: false,
      };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
};

export const UserContextProvider = ({ children, isAuth }) => {
  const [state, dispatch] = useReducer(reducer, { isAuth: isAuth });

  // выполняется только когда значение isAuth изменилось, предотвращаем лишние диспатчи.
  useEffect(() => {
    if (isAuth) {
      dispatch({ type: "LOGIN" });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, [isAuth]);

  <UserContext.Provider value={[state, dispatch]}>
    {...children}
  </UserContext.Provider>;
};
