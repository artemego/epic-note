import * as React from "react";
import { AuthProvider } from "./AuthContext";

// Todo: добавить UserProvider
function AppProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
export default AppProviders;
