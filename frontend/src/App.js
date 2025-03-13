import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import SubmitClaim from './pages/SubmitClaim';
import ClaimDetails from './pages/ClaimDetails';
import InsurerDashboard from './pages/InsurerDashboard';
import ClaimReview from './pages/ClaimReview';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Patient Routes */}
              <Route
                path="/patient/dashboard"
                element={
                  <PrivateRoute roles={['patient']}>
                    <PatientDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/patient/submit-claim"
                element={
                  <PrivateRoute roles={['patient']}>
                    <SubmitClaim />
                  </PrivateRoute>
                }
              />
              <Route
                path="/patient/claim/:id"
                element={
                  <PrivateRoute roles={['patient']}>
                    <ClaimDetails />
                  </PrivateRoute>
                }
              />

              {/* Insurer Routes */}
              <Route
                path="/insurer/dashboard"
                element={
                  <PrivateRoute roles={['insurer']}>
                    <InsurerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/insurer/claim/:id"
                element={
                  <PrivateRoute roles={['insurer']}>
                    <ClaimReview />
                  </PrivateRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
