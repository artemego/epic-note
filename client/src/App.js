import { BrowserRouter as Router } from "react-router-dom";
import routes from "./routes";
import { ChakraProvider } from "@chakra-ui/react";
// Todo: check cookie for auth
// import BlockEditor from "./pages/blockEditor/BlockEditor";

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        {/* <BlockEditor /> */}
        <Router>{routes}</Router>
      </ChakraProvider>
    </div>
  );
}

export default App;
