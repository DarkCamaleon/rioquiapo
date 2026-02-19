import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

        {/* 404 Catch-all */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
              <span className="material-symbols-outlined text-7xl text-gray-300 mb-4">explore_off</span>
              <h1 className="text-5xl font-extrabold text-gray-900 mb-2">404</h1>
              <p className="text-lg text-gray-500 mb-8">La página que buscas no existe.</p>
              <Link
                to="/"
                className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg"
              >
                Volver al Inicio
              </Link>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
