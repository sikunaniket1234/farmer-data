import React, { useContext } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null; // Don't show navbar for unauthenticated users

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Farmer Data</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user.role === 'CEO' && (
              <>
                <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/submit-farmer">Submit Farmer</Nav.Link>
                <Nav.Link as={Link} to="/my-entries">My Entries</Nav.Link>
                <Nav.Link as={Link} to="/membership-form">Membership Form</Nav.Link>
                <Nav.Link as={Link} to="/membership-entries">Membership Entries</Nav.Link>
              </>
            )}
            {user.role === 'SuperAdmin' && (
              <>
                <Nav.Link as={Link} to="/super-admin">SuperAdmin Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/create-user">Create User</Nav.Link>
                <Nav.Link as={Link} to="/view-farmers">View Farmers</Nav.Link>
                <Nav.Link as={Link} to="/all-membership-entries">All Membership Entries</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <Nav.Item className="d-flex align-items-center">
              <span className="text-white me-3">Welcome, {user.name}</span>
              <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;