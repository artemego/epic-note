import { BrowserRouter as Router } from "react-router-dom";
import Splash from "./components/common/Splash";
import { useAuth } from "./context/AuthContext";
import publicRoutes from "./routes/publicRoutes";

function PublicApp() {
  const { isRefreshing } = useAuth().state;

  return (
    <>
      {/* Todo: возможно, здесь нужно будет проверять, залогинен ли уже пользователь */}
      {isRefreshing ? (
        <div style={{ height: "100vh" }}>
          <Splash />
        </div>
      ) : (
        <div className="App">
          <Router>{publicRoutes}</Router>
        </div>
      )}
    </>
  );
}

export default PublicApp;
