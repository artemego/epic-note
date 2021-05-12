import { BrowserRouter as Router } from "react-router-dom";
import PlaceholderSplash from "./components/PlaceholderSplash";
import { useAuth } from "./context/AuthContext";
import publicRoutes from "./routes/publicRoutes";

function PublicApp() {
  const { isRefreshing } = useAuth().state;

  return (
    <>
      {isRefreshing ? (
        <PlaceholderSplash />
      ) : (
        <div className="App">
          <Router>{publicRoutes}</Router>
        </div>
      )}
    </>
  );
}

export default PublicApp;
