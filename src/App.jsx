import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';

// Pages
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Equipments from './Pages/Equipments';
import EquipmentForm from './Pages/EquipmentForm';
import EquipmentDetail from './Pages/EquipmentDetail';
import Profile from './Pages/Profile';

// Layout
import DashboardLayout from './components/DashboardLayout';

// Services
import { authService } from './services';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />

      {/* Protected Dashboard Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/equipments" 
        element={
          <ProtectedRoute>
            <Equipments />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/equipments/add" 
        element={
          <ProtectedRoute>
            <EquipmentForm />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/equipments/edit/:id" 
        element={
          <ProtectedRoute>
            <EquipmentForm />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/equipments/:id" 
        element={
          <ProtectedRoute>
            <EquipmentDetail />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
