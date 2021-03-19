import { useEffect } from "react";
import { Button, ChakraProvider } from "@chakra-ui/react";
import PrivateApp from "./PrivateApp";
import PublicApp from "./PublicApp";
import { useAuth } from "./context/AuthContext";
// Todo: check cookie for auth
// import BlockEditor from "./pages/blockEditor/BlockEditor";

function App() {
  // Todo: здесь в componentDidMount надо попробовать залогиниться с кукой, если не получиться надо показать unauthorized app (в которой будет страница логина, ) isAuth надо получать из контекста

  const { refreshToken, logout } = useAuth();

  // попытка логина с кукой refresh-token
  useEffect(() => {
    console.log("In component didmount");
    refreshToken();
  }, []);

  const { isAuth } = useAuth().state;
  // get global state from context provider

  // чтобы здесь использовать isAuth нам нужно App обернуть еще одной штукой, которая подключит провайдеры.

  const handleLogout = () => {
    console.log(isAuth);
    if (isAuth) logout();
  };

  console.log("app rerender");

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
