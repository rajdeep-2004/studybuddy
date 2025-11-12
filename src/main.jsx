import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { AuthProvider } from "./context/AuthContext.jsx";
// import { UserDataProvider } from "./context/UserDataContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <AuthProvider> */}
      {/* <UserDataProvider> */}
        <App />
      {/* </UserDataProvider> */}
    {/* </AuthProvider> */}
  </StrictMode>
);