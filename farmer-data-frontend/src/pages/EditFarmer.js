import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import './SubmitFarmer.css';

const EditFarmer = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    fatherName: '',
    contact: '',
    aadhar: '',
    income: '',
    landType: '',
    crops: [''],
    state: '',
    district: '',
    block: '',
    panchayat: '',
    village: '',
    farmerPicture: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState({
    states: [],
    districts: [],
    blocks: [],
    panchayats: [],
    villages: [],
  });

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/form/${id}`, { withCredentials: true });
        const farmer = res.data;
        setFormData({
          name: farmer.name,
          age: farmer.age,
          sex: farmer.sex,
          fatherName: farmer.fatherName,
          contact: farmer.contact,
          aadhar: farmer.aadhar,
          income: farmer.income,
          landType: farmer.landType,
          crops: Array.isArray(farmer.crops) ? farmer.crops : JSON.parse(farmer.crops || '[]'),
          state: farmer.state,
          district: farmer.district,
          block: farmer.block,
          panchayat: farmer.panchayat,
          village: farmer.village,
          farmerPicture: null,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch farmer data');
      }
    };

    const fetchLocations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/location', { withCredentials: true });
        setLocations(res.data);
        setFilteredLocations({
          states: res.data,
          districts: formData.state
            ? res.data.find(s => s.state === formData.state)?.districts || []
            : [],
          blocks: formData.district
            ? res.data
                .find(s => s.state === formData.state)
                ?.districts.find(d => d.name === formData.district)?.blocks || []
            : [],
          panchayats: formData.block
            ? res.data
                .find(s => s.state === formData.state)
                ?.districts.find(d => d.name === formData.district)
                ?.blocks.find(b => b.name === formData.block)?.panchayats || []
            : [],
          villages: formData.panchayat
            ? res.data
                .find(s => s.state === formData.state)
                ?.districts.find(d => d.name === formData.district)
                ?.blocks.find(b => b.name === formData.block)
                ?.panchayats.find(p => p.name === formData.panchayat)?.villages || []
            : [],
        });
      } catch (err) {
        setError('Failed to fetch locations');
      }
    };

    fetchFarmer();
    fetchLocations();
  }, [id, formData.state, formData.district, formData.block, formData.panchayat]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'farmerPicture') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === 'state') {
      setFormData((prev) => ({ ...prev, district: '', block: '', panchayat: '', village: '' }));
      setFilteredLocations((prev) => ({
        ...prev,
        districts: locations.find(s => s.state === value)?.districts || [],
        blocks: [],
        panchayats: [],
        villages: [],
      }));
    } else if (name === 'district') {
      setFormData((prev) => ({ ...prev, block: '', panchayat: '', village: '' }));
      setFilteredLocations((prev) => ({
        ...prev,
        blocks: locations
          .find(s => s.state === formData.state)
          ?.districts.find(d => d.name === value)?.blocks || [],
        panchayats: [],
        villages: [],
      }));
    } else if (name === 'block') {
      setFormData((prev) => ({ ...prev, panchayat: '', village: '' }));
      setFilteredLocations((prev) => ({
        ...prev,
        panchayats: locations
          .find(s => s.state === formData.state)
          ?.districts.find(d => d.name === formData.district)
          ?.blocks.find(b => b.name === value)?.panchayats || [],
        villages: [],
      }));
    } else if (name === 'panchayat') {
      setFormData((prev) => ({ ...prev, village: '' }));
      setFilteredLocations((prev) => ({
        ...prev,
        villages: locations
          .find(s => s.state === formData.state)
          ?.districts.find(d => d.name === formData.district)
          ?.blocks.find(b => b.name === formData.block)
          ?.panchayats.find(p => p.name === value)?.villages || [],
      }));
    }
  };

  const handleCropChange = (index, value) => {
    const newCrops = [...formData.crops];
    newCrops[index] = value;
    setFormData({ ...formData, crops: newCrops });
  };

  const addCrop = () => {
    setFormData({ ...formData, crops: [...formData.crops, ''] });
  };

  const removeCrop = (index) => {
    if (formData.crops.length > 1) {
      const newCrops = formData.crops.filter((_, i) => i !== index);
      setFormData({ ...formData, crops: newCrops });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'crops') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'farmerPicture' && formData[key]) {
          data.append(key, formData[key]);
        } else if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      const res = await axios.patch(`http://localhost:5000/api/form/${id}`, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Farmer updated successfully!');
      setError('');
      setTimeout(() => navigate('/my-entries'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update farmer');
      setSuccess('');
    }
  };

  if (!user || user.role !== 'CEO') {
    return <Navigate to="/login" />;
  }

  return (
    <Container fluid className="mt-4 mb-4 animate__animated animate__fadeIn">
      <h2 className="text-primary mb-4">Edit Farmer</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="shadow-sm"
              >
                <option value="">Select State</option>
                {filteredLocations.states.map((loc) => (
                  <option key={loc.state} value={loc.state}>{loc.state}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>District</Form.Label>
              <Form.Select
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!formData.state}
                className="shadow-sm"
              >
                <option value="">Select District</option>
                {filteredLocations.districts.map((loc) => (
                  <option key={loc.name} value={loc.name}>{loc.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Block</Form.Label>
              <Form.Select
                name="block"
                value={formData.block}
                onChange={handleChange}
                disabled={!formData.district}
                className="shadow-sm"
              >
                <option value="">Select Block</option>
                {filteredLocations.blocks.map((loc) => (
                  <option key={loc.name} value={loc.name}>{loc.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Panchayat</Form.Label>
              <Form.Select
                name="panchayat"
                value={formData.panchayat}
                onChange={handleChange}
                disabled={!formData.block}
                className="shadow-sm"
              >
                <option value="">Select Panchayat</option>
                {filteredLocations.panchayats.map((loc) => (
                  <option key={loc.name} value={loc.name}>{loc.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Village</Form.Label>
              <Form.Select
                name="village"
                value={formData.village}
                onChange={handleChange}
                disabled={!formData.panchayat}
                className="shadow-sm"
              >
                <option value="">Select Village</option>
                {filteredLocations.villages.map((loc) => (
                  <option key={loc.name} value={loc.name}>{loc.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                max="150"
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sex</Form.Label>
              <Form.Select name="sex" value={formData.sex} onChange={handleChange} className="shadow-sm">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Father's Name</Form.Label>
              <Form.Control
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                pattern="\d{10}"
                title="Contact must be 10 digits"
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Aadhar</Form.Label>
              <Form.Control
                type="text"
                name="aadhar"
                value={formData.aadhar}
                onChange={handleChange}
                pattern="\d{12}"
                title="Aadhar must be 12 digits"
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Income</Form.Label>
              <Form.Control
                type="number"
                name="income"
                value={formData.income}
                onChange={handleChange}
                min="0"
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Land Type</Form.Label>
              <Form.Select name="landType" value={formData.landType} onChange={handleChange} className="shadow-sm">
                <option value="">Select</option>
                <option value="Own">Own</option>
                <option value="Rented">Rented</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Crops</Form.Label>
              {formData.crops.map((crop, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    value={crop}
                    onChange={(e) => handleCropChange(index, e.target.value)}
                    className="me-2 shadow-sm"
                  />
                  {formData.crops.length > 1 && (
                    <Button variant="danger" onClick={() => removeCrop(index)}>
                      -
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="primary" onClick={addCrop} className="mt-2">
                + Add Crop
              </Button>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Farmer Picture</Form.Label>
              <Form.Control
                type="file"
                name="farmerPicture"
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

export default EditFarmer;