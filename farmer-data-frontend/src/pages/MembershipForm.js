import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MembershipForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [formData, setFormData] = useState({
    farmerId: '',
    membershipFee: '',
    receiptNo: '',
    receiptPicture: null,
  });
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/form', { withCredentials: true });
        setFarmers(res.data.filter(farmer => !farmer.membership)); // Exclude farmers with membership
      } catch (err) {
        setError('Failed to fetch farmers');
      }
    };
    fetchFarmers();
  }, []);

  const handleFarmerChange = (e) => {
    const farmerId = e.target.value;
    const farmer = farmers.find(f => f.id === parseInt(farmerId));
    setFormData({ ...formData, farmerId });
    setSelectedFarmer(farmer);
  };

  const handleChange = (e) => {
    if (e.target.name === 'receiptPicture') {
      setFormData({ ...formData, receiptPicture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('farmerId', formData.farmerId);
      data.append('membershipFee', formData.membershipFee);
      data.append('receiptNo', formData.receiptNo);
      data.append('receiptPicture', formData.receiptPicture);

      const res = await axios.post('http://localhost:5000/api/membership', data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Membership submitted successfully!');
      setError('');
      setFormData({ farmerId: '', membershipFee: '', receiptNo: '', receiptPicture: null });
      setSelectedFarmer(null);
      setTimeout(() => navigate('/membership-entries'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit membership');
      setSuccess('');
    }
  };

  if (!user || user.role !== 'CEO') {
    return <div className="text-center mt-5">Access denied</div>;
  }

  return (
    <Container fluid className="mt-4 mb-4 animate__animated animate__fadeIn">
      <h2 className="text-primary mb-4">Members/Shareholders</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Select Farmer</Form.Label>
              <Form.Select name="farmerId" value={formData.farmerId} onChange={handleFarmerChange} required className="shadow-sm">
                <option value="">Select Farmer</option>
                {farmers.map(farmer => (
                  <option key={farmer.id} value={farmer.id}>{farmer.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                value={selectedFarmer?.location?.state || ''}
                disabled
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>District</Form.Label>
              <Form.Control
                type="text"
                value={selectedFarmer?.location?.district || ''}
                disabled
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Block</Form.Label>
              <Form.Control
                type="text"
                value={selectedFarmer?.location?.block || ''}
                disabled
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Panchayat</Form.Label>
              <Form.Control
                type="text"
                value={selectedFarmer?.location?.panchayat || ''}
                disabled
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Village</Form.Label>
              <Form.Control
                type="text"
                value={selectedFarmer?.location?.village || ''}
                disabled
                className="shadow-sm"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Father's Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedFarmer?.fatherName || ''}
                disabled
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                value={selectedFarmer?.contact || ''}
                disabled
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Membership Fee</Form.Label>
              <Form.Control
                type="number"
                name="membershipFee"
                value={formData.membershipFee}
                onChange={handleChange}
                min="0"
                required
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Receipt Number</Form.Label>
              <Form.Control
                type="text"
                name="receiptNo"
                value={formData.receiptNo}
                onChange={handleChange}
                required
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
                required
                className="shadow-sm"
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="w-100 mt-3 shadow-sm haptic-button">
          Submit Membership
        </Button>
      </Form>
    </Container>
  );
};

export default MembershipForm;