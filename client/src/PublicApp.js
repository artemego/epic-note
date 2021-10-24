import { BrowserRouter as Router } from "react-router-dom";
import Splash from "./components/Splash";
import { useAuth } from "./context/AuthContext";
import publicRoutes from "./routes/publicRoutes";

function PublicApp() {
  const { isRefreshing } = useAuth().state;

  return (
    <>
      {isRefreshing ? (
        <Splash />
      ) : (
        <div className="App">
          <Router>{publicRoutes}</Router>
        </div>
      )}
    </>
  );
}

export default PublicApp;
