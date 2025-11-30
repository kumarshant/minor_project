// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Generate from './pages/Generate';
import Profile from './pages/Profile'

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";


export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
        path= "/profile"                  
    element= {<ProtectedRoute><Profile /></ProtectedRoute>} 
    /> 
        <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />

      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      {/* Only logged in users */}
      <Route
        path="/generate"
        element={
          <ProtectedRoute>
            <Generate />
          </ProtectedRoute>
        }
      />
      </Routes>
    </>
  );
}