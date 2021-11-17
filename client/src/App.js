import React from "react";
import { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { useAuth } from "./context/AuthContext";
import { useComponentDidUpdate } from "./hooks/useComponentDidUpdate";
import { QueryClient, QueryClientProvider } from "react-query";
import Placeholder from "./components/common/Placeholder";
const PrivateApp = React.lazy(() => import("./PrivateApp"));
const PublicApp = React.lazy(() => import("./PublicApp"));

function App() {
  const { refreshToken } = useAuth();
  const { isAuth, expiryDate } = useAuth().state;
  const [timer, setTimer] = useState(null);

  const queryClient = new QueryClient();

  // попытка логина с refresh-token
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

  // useEffect(() => {
  //   console.log("Is refreshing: " + isRefreshing);
  // }, [isRefreshing]);

  // useEffect(() => {
  //   console.log("Is loading: " + isLoading);
  // }, [isLoading]);

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <React.Suspense fallback={<Placeholder />}>
            {isAuth ? <PrivateApp /> : <PublicApp />}
          </React.Suspense>
        </ChakraProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
