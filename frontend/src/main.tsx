import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { App } from "./App";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/components/ui/Toast";
import "./index.css";

// Static hosts such as GitHub Pages have no server-side rewrite rules, so the
// hash router is used for those deployments. Set VITE_USE_HASH_ROUTER=true.
const Router = import.meta.env.VITE_USE_HASH_ROUTER === "true" ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  </React.StrictMode>
);