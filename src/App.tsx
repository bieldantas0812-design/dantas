import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { Shell } from './components/layout/Shell';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Sales } from './pages/Sales';
import { Products } from './pages/Products';
import { Collections } from './pages/Collections';
import { Expenses } from './pages/Expenses';
import { GoalsPage } from './pages/Goals';
import { LoginPage } from './pages/Login';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <PrivateRoute>
              <Shell />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="estoque" element={<Inventory />} />
            <Route path="vendas" element={<Sales />} />
            <Route path="produtos" element={<Products />} />
            <Route path="colecoes" element={<Collections />} />
            <Route path="gastos" element={<Expenses />} />
            <Route path="metas" element={<GoalsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
