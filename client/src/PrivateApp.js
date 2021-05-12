import { BrowserRouter as Router } from "react-router-dom";
import privateRoutes from "./routes/privateRoutes";

function PrivateApp() {
  console.log("rerendered private app");

  return (
    <div className="App">
      <Router>{privateRoutes}</Router>
    </div>
  );
}

export default PrivateApp;
