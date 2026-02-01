import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Home from "./pages/Home";
import Reader from "./pages/Reader";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";


function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is logged in and currently on the login page, redirect to reader
        if (location.pathname === "/login") {
          navigate("/reader");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reader" element={<Reader />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
