import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import './SubmitFarmer.css';

const EditMembership = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    farmerId: '',
    membershipFee: '',
    receiptNo: '',
    receiptPicture: null,
  });
  const [farmers, setFarmers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/membership/${id}`, { withCredentials: true });
        const membership = res.data;
        setFormData({
          farmerId: membership.farmerId,
          membershipFee: membership.membershipFee,
          receiptNo: membership.receiptNo,
          receiptPicture: null,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch membership data');
      }
    };

    const fetchFarmers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/form', { withCredentials: true });
        setFarmers(res.data);
      } catch (err) {
        setError('Failed to fetch farmers');
      }
    };

    fetchMembership();
    fetchFarmers();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'receiptPicture') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'receiptPicture' && formData[key]) {
          data.append(key, formData[key]);
        } else if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      const res = await axios.put(`http://localhost:5000/api/membership/${id}`, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Membership updated successfully!');
      setError('');
      setTimeout(() => navigate('/membership-entries'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update membership');
      setSuccess('');
    }
  };

  if (!user || user.role !== 'CEO') {
    return <Navigate to="/login" />;
  }

  return (
    <Container fluid className="mt-4 mb-4 animate__animated animate__fadeIn">
      <h2 className="text-primary mb-4">Edit Membership</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Farmer</Form.Label>
              <Form.Select
                name="farmerId"
                value={formData.farmerId}
                onChange={handleChange}
                className="shadow-sm"
              >
                <option value="">Select Farmer</option>
                {farmers.map((farmer) => (
                  <option key={farmer.id} value={farmer.id}>{farmer.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Membership Fee</Form.Label>
              <Form.Control
                type="number"
                name="membershipFee"
                value={formData.membershipFee}
                onChange={handleChange}
                min="0"
                className="shadow-sm"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Receipt Number</Form.Label>
              <Form.Control
                type="text"
                name="receiptNo"
                value={formData.receiptNo}
                onChange={handleChange}
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Receipt Picture</Form.Label>
              <Form.Control
                type="file"
                name="receiptPicture"
                accept="image/*"
                onChange={handleChange}
                className="shadow-sm"
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="w-100 mt-3 shadow-sm haptic-button">
          Update
        </Button>
      </Form>
    </Container>
  );
};

export default EditMembership;