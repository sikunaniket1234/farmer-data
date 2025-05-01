import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import CEO from './pages/CEO';
import SuperAdmin from './pages/SuperAdmin';
import SubmitFarmer from './pages/SubmitFarmer';
import MyEntries from './pages/MyEntries';
import CreateUser from './pages/CreateUser';
import ViewFarmers from './pages/ViewFarmers';
import MembershipForm from './pages/MembershipForm';
import MembershipEntries from './pages/MembershipEntries';
import AllMembershipEntries from './pages/AllMembershipEntries';
import UserCredentials from './pages/UserCredentials'; 
import LocationInsert from './pages/LocationInsert';
import EditFarmer from './pages/EditFarmer';
import EditMembership from './pages/EditMembership';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import './index.css';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const defaultPath = user
    ? user.role === 'SuperAdmin'
      ? '/super-admin'
      : '/'
    : '/login';

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={defaultPath} />} />
        <Route
          path="/"
          element={user ? (user.role === 'SuperAdmin' ? <Navigate to="/super-admin" /> : <CEO />) : <Navigate to="/login" />}
        />
        <Route
          path="/super-admin"
          element={user && user.role === 'SuperAdmin' ? <SuperAdmin /> : <Navigate to="/login" />}
        />
        <Route
          path="/superadmin"
          element={<Navigate to="/super-admin" replace />}
        />
        <Route
          path="/submit-farmer"
          element={user && user.role === 'CEO' ? <SubmitFarmer /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-farmer/:id"
          element={user && user.role === 'CEO' ? <EditFarmer /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-entries"
          element={user && user.role === 'CEO' ? <MyEntries /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-user"
          element={user && user.role === 'SuperAdmin' ? <CreateUser /> : <Navigate to="/login" />}
        />
        <Route
          path="/view-farmers"
          element={user && user.role === 'SuperAdmin' ? <ViewFarmers /> : <Navigate to="/login" />}
        />
        <Route
          path="/membership-form"
          element={user && user.role === 'CEO' ? <MembershipForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/membership-entries"
          element={user && user.role === 'CEO' ? <MembershipEntries /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-membership/:id"
          element={user && user.role === 'CEO' ? <EditMembership /> : <Navigate to="/login" />}
        />
        <Route
          path="/all-membership-entries"
          element={user && user.role === 'SuperAdmin' ? <AllMembershipEntries /> : <Navigate to="/login" />}
        />
        <Route
          path="/user-credentials"
          element={user && user.role === 'SuperAdmin' ? <UserCredentials /> : <Navigate to="/login" />}
        />
        <Route
          path="/location-insert"
          element={user && user.role === 'SuperAdmin' ? <LocationInsert /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<div className="text-center mt-5">Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;