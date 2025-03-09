import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import Login from "./components/auth/login"
import { AuthProvider, ProtectedRoute } from "./lib/auth-context"
import "./index.css"
import { ThemeProvider } from "./components/theme-provider"
import './components/responsive-fixes.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                  <App />
                </ThemeProvider>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

