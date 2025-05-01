import React, { useContext } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AppNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <Navbar bg="primary" variant="dark" expand="md" sticky="top" className="px-3">
      <Navbar.Brand as={Link} to="/">Farmer Data</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {user ? (
            <>
              <Nav.Link
                as={Link}
                to={user.role === 'SuperAdmin' ? '/superadmin' : '/ceo'}
                className="btn btn-danger text-white"
              >
                Dashboard
              </Nav.Link>
              <Button
                variant="outline-light"
                onClick={handleLogout}
                className="ms-2"
              >
                Logout
              </Button>
            </>
          ) : (
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;