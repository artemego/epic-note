import { useEffect, useState } from "react";
import { Button, ChakraProvider } from "@chakra-ui/react";
import PrivateApp from "./PrivateApp";
import PublicApp from "./PublicApp";
import { useAuth } from "./context/AuthContext";
import { useComponentDidUpdate } from "./hooks/useComponentDidUpdate";

function App() {
  const { refreshToken, logout } = useAuth();
  const { isAuth, expiryDate } = useAuth().state;
  const [timer, setTimer] = useState(null);

  // попытка логина с кукой refresh-token
  useEffect(() => {
    refreshToken();
  }, []);

  // останавливаем/запускаем таймер, когда обновился expiryDate
  useComponentDidUpdate(() => {
    if (expiryDate) startRefreshTask();
    else if (timer && !expiryDate) stopRefreshTask();
  }, [expiryDate]);

  // функция для запуска таймера на обновление токенов
  const startRefreshTask = () => {
    const curTime = Date.now();
    const timeToCheckRefresh = expiryDate * 1000 - curTime;
    const timer = setTimeout(() => {
      refreshToken();
    }, timeToCheckRefresh);
    setTimer(timer);
  };

  // функция для остановки таймера
  const stopRefreshTask = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };

  const handleLogout = () => {
    console.log(isAuth);
    if (isAuth) logout();
  };

  return (
    <div>
      <ChakraProvider>
        {/* <BlockEditor /> */}
        {/* <Router>{routes}</Router> */}
        <Button onClick={handleLogout}>Logout</Button>
        {isAuth ? <PrivateApp /> : <PublicApp />}
      </ChakraProvider>
    </div>
  );
}

export default App;
