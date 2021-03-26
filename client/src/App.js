import { useEffect, useState } from "react";
import { Button, ChakraProvider } from "@chakra-ui/react";
import PrivateApp from "./PrivateApp";
import PublicApp from "./PublicApp";
import { useAuth } from "./context/AuthContext";
import { useComponentDidUpdate } from "./hooks/useComponentDidUpdate";
import { QueryClient, QueryClientProvider } from "react-query";
// import { useHistory } from "react-router-dom";

function App() {
  const { refreshToken, logout } = useAuth();
  const { isAuth, expiryDate } = useAuth().state;
  const [timer, setTimer] = useState(null);
  // const history = useHistory();

  const queryClient = new QueryClient();

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

  // redirect user to /login or /notes
  // useEffect(() => {
  //   if (isAuth) history.push("/notes");
  //   else history.push("/login");
  // }, [isAuth]);

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          {/* <BlockEditor /> */}
          {/* <Router>{routes}</Router> */}
          {/* <Button onClick={handleLogout}>Logout</Button> */}
          {isAuth ? <PrivateApp /> : <PublicApp />}
        </ChakraProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
