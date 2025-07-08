import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Today from './pages/Today';
import TodoDetail from './pages/TodoDetail';
import Planner from './pages/Planner';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import NavBar from './components/NavBar';
import { AuthProvider, useAuth } from './store/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="pb-16">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Today /></PrivateRoute>} />
            <Route path="/todo/:id" element={<PrivateRoute><TodoDetail /></PrivateRoute>} />
            <Route path="/planner" element={<PrivateRoute><Planner /></PrivateRoute>} />
            <Route path="/stats" element={<PrivateRoute><Stats /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <NavBar />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
