import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import publicRoutes from "./routes/publicRoutes";

function PublicApp() {
  return (
    <div className="App">
      <Router>{publicRoutes}</Router>
    </div>
  );
}

export default PublicApp;
