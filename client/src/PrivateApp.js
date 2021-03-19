import { BrowserRouter as Router } from "react-router-dom";
import privateRoutes from "./routes/privateRoutes";

function PrivateApp() {
  return (
    <div className="App">
      <Router>{privateRoutes}</Router>
    </div>
  );
}

export default PrivateApp;
