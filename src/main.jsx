import ReactDOM from "react-dom/client";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import './assets/styles/index.css';


const PUBLISHABLE_KEY = "pk_test_d2lubmluZy1zcXVpZC03My5jbGVyay5hY2NvdW50cy5kZXYk"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);
