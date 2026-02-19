import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import About from './components/pages/About';
import Projects from './components/pages/Projects';
import ProjectDetails from './components/pages/ProjectDetails';
import CityProjects from './components/pages/CityProjects';
import Contact from './components/pages/Contact';
import Login from './components/auth/Login';
import AdminDashboard from './components/dashboard/AdminDashboard';
import UserDashboard from './components/dashboard/UserDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

import NewProject from './components/admin/NewProject';
import EditProject from './components/admin/EditProject';
import NewCity from './components/admin/NewCity';
import EditCity from './components/admin/EditCity';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/proyectos" element={<Projects />} />
        <Route path="/proyecto/:id" element={<ProjectDetails />} />
        <Route path="/proyectos/:cityId" element={<CityProjects />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/new"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <NewProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cities/new"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <NewCity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cities/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditCity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
