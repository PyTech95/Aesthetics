import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ClientPortal from "@/pages/ClientPortal";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <ClientPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#FAF9F6",
            color: "#2C2A29",
            border: "1px solid #E5E1D8",
            fontFamily: "Outfit, sans-serif",
          },
        }}
      />
    </div>
  );
}

export default App;
