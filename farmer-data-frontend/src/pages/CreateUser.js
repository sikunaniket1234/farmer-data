import React, { useState, useContext } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Define API base URL from environment variable
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CreateUser = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CEO',
    fpoName: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user || user.role !== 'SuperAdmin') {
    return <div className="text-center mt-5">Access denied</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending request to:', `${API_BASE}/api/user`);
    console.log('User:', user); // Debug user and role
    try {
      const res = await axios.post(`${API_BASE}/api/user`, formData, {
        withCredentials: true,
      });
      setSuccess('CEO created successfully!');
      setError('');
      setFormData({ name: '', email: '', password: '', role: 'CEO', fpoName: '' });
    } catch (err) {
      console.error('Create user error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to create CEO');
      setSuccess('');
    }
  };

  return (
    <Container fluid className="mt-4 mb-4">
      <h2 className="text-primary mb-4">Create CEO</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="shadow-sm"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="shadow-sm"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="shadow-sm"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>FPO Name</Form.Label>
          <Form.Control
            type="text"
            name="fpoName"
            value={formData.fpoName}
            onChange={handleChange}
            className="shadow-sm"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 shadow-sm haptic-button">
          Create CEO
        </Button>
      </Form>
    </Container>
  );
};

export default CreateUser;