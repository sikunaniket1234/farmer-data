import React, { useState, useContext } from 'react';
import { Container, Form, Button, Alert, Tabs, Tab, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeRole, setActiveRole] = useState('SuperAdmin');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, activeRole);
      navigate(activeRole === 'SuperAdmin' ? '/superadmin' : '/ceo');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: 'linear-gradient(135deg, #007BFF, #28A745)',
      }}
    >
      <Container fluid className="p-3">
        <Card
          className="mx-auto shadow-lg animate__animated animate__fadeIn"
          style={{ maxWidth: '400px', border: 'none', borderRadius: '15px' }}
        >
          <Card.Body className="p-4">
            <h2 className="text-center text-primary mb-4">Welcome</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Tabs
              activeKey={activeRole}
              onSelect={(k) => setActiveRole(k)}
              className="mb-4"
              justify
            >
              <Tab eventKey="SuperAdmin" title="SuperAdmin" />
              <Tab eventKey="CEO" title="CEO" />
            </Tabs>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="shadow-sm"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="shadow-sm"
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100 shadow-sm haptic-button"
              >
                Login as {activeRole}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;