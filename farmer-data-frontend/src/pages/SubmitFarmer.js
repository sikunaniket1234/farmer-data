import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './SubmitFarmer.css';

const SubmitFarmer = () => {
  const { user } = useContext(AuthContext);
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
    const fetchLocations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/location', { withCredentials: true });
        console.log('Fetched locations:', res.data); // Debug
        setLocations(res.data);
        setFilteredLocations((prev) => ({
          ...prev,
          states: res.data.map((loc) => ({ name: loc.state })),
        }));
      } catch (err) {
        setError('Failed to fetch locations');
        console.error('Fetch locations error:', err);
      }
    };
    fetchLocations();
    // Empty dependency array to run only once on mount
  }, []); // Added empty dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict input based on field
    let sanitizedValue = value;
    if (name === 'age' && value !== '') {
      sanitizedValue = value.replace(/[^0-9]/g, ''); // Allow only numbers
      if (sanitizedValue > 150) sanitizedValue = sanitizedValue.slice(0, -1); // Limit to 150
    } else if (name === 'contact' && value !== '') {
      sanitizedValue = value.replace(/[^0-9]/g, ''); // Allow only numbers
      if (sanitizedValue.length > 10) sanitizedValue = sanitizedValue.slice(0, 10); // Limit to 10 digits
    } else if (name === 'aadhar' && value !== '') {
      sanitizedValue = value.replace(/[^0-9]/g, ''); // Allow only numbers
      if (sanitizedValue.length > 12) sanitizedValue = sanitizedValue.slice(0, 12); // Limit to 12 digits
    } else if (name === 'income' && value !== '') {
      sanitizedValue = value.replace(/[^0-9.]/g, ''); // Allow numbers and decimal
      const parts = sanitizedValue.split('.');
      if (parts.length > 1 && parts[1].length > 2) sanitizedValue = parts[0] + '.' + parts[1].slice(0, 2); // Limit to 2 decimal places
      if (parseFloat(sanitizedValue) < 0) sanitizedValue = '0.00'; // Prevent negative
    }

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

    // Reset downstream fields and filter locations
    if (name === 'state') {
      const stateLoc = locations.find((loc) => loc.state === value);
      setFormData((prev) => ({ ...prev, district: '', block: '', panchayat: '', village: '' }));
      setFilteredLocations((prev) => ({
        ...prev,
        districts: stateLoc ? stateLoc.districts : [],
        blocks: [],
        panchayats: [],
        villages: [],
      }));
    } else if (name === 'district') {
      const stateLoc = locations.find((loc) => loc.state === formData.state);
      const districtLoc = stateLoc?.districts.find((d) => d.name === value);
      setFormData((prev) => ({ ...prev, block: '', panchayat: '', village: '' }));
      setFilteredLocations((prev) => ({
        ...prev,
        blocks: districtLoc ? districtLoc.blocks : [],
        panchayats: [],
        villages: [],
      }));
    } else if (name === 'block') {
      const stateLoc = locations.find((loc) => loc.state === formData.state);
      const districtLoc = stateLoc?.districts.find((d) => d.name === formData.district);
      const blockLoc = districtLoc?.blocks.find((b) => b.name === value);
      setFormData((prev) => ({ ...prev, panchayat: '', village: '' }));
      setFilteredLocations((prev) => ({
        ...prev,
        panchayats: blockLoc ? blockLoc.panchayats : [],
        villages: [],
      }));
    } else if (name === 'panchayat') {
      const stateLoc = locations.find((loc) => loc.state === formData.state);
      const districtLoc = stateLoc?.districts.find((d) => d.name === formData.district);
      const blockLoc = districtLoc?.blocks.find((b) => b.name === formData.block);
      const panchayatLoc = blockLoc?.panchayats.find((p) => p.name === value);
      setFormData((prev) => ({ ...prev, village: '' }));
      setFilteredLocations((prev) => ({
        ...prev,
        villages: panchayatLoc ? panchayatLoc.villages : [],
      }));
    } else if (name === 'farmerPicture') {
      setFormData((prev) => ({ ...prev, farmerPicture: e.target.files[0] }));
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

    // Validation
    if (!formData.farmerPicture) {
      setError('Farmer picture is required');
      return;
    }
    if (!formData.age || !/^\d+$/.test(formData.age) || parseInt(formData.age) < 0 || parseInt(formData.age) > 150) {
      setError('Age must be a number between 0 and 150');
      return;
    }
    if (!formData.contact || !/^\d{10}$/.test(formData.contact)) {
      setError('Contact must be exactly 10 digits');
      return;
    }
    if (!formData.aadhar || !/^\d{12}$/.test(formData.aadhar)) {
      setError('Aadhar must be exactly 12 digits');
      return;
    }
    if (!formData.income || isNaN(parseFloat(formData.income)) || parseFloat(formData.income) < 0) {
      setError('Income must be a positive number');
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'crops') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'farmerPicture') {
          data.append(key, formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      });

      const res = await axios.post('http://localhost:5000/api/form', data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Farmer submitted successfully!');
      setError('');
      setFormData({
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
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit farmer');
      setSuccess('');
    }
  };

  if (!user || user.role !== 'CEO') {
    return <Navigate to="/login" />;
  }

  return (
    <Container fluid className="mt-4 mb-4 animate__animated animate__fadeIn">
      <h2 className="text-primary mb-4">Submit Farmer</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>CEO Name</Form.Label>
              <Form.Control type="text" value={user.name} disabled className="shadow-sm" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>FPO Name</Form.Label>
              <Form.Control type="text" value={user.fpoName || 'N/A'} disabled className="shadow-sm" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="shadow-sm"
              >
                <option value="">Select State</option>
                {filteredLocations.states.map((loc, index) => (
                  <option key={index} value={loc.name}>{loc.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>District</Form.Label>
              <Form.Select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                disabled={!formData.state}
                className="shadow-sm"
              >
                <option value="">Select District</option>
                {filteredLocations.districts.map((loc, index) => (
                  <option key={index} value={loc.name}>{loc.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Block</Form.Label>
              <Form.Select
                name="block"
                value={formData.block}
                onChange={handleChange}
                required
                disabled={!formData.district}
                className="shadow-sm"
              >
                <option value="">Select Block</option>
                {filteredLocations.blocks.map((loc, index) => (
                  <option key={index} value={loc.name}>{loc.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Panchayat</Form.Label>
              <Form.Select
                name="panchayat"
                value={formData.panchayat}
                onChange={handleChange}
                required
                disabled={!formData.block}
                className="shadow-sm"
              >
                <option value="">Select Panchayat</option>
                {filteredLocations.panchayats.map((loc, index) => (
                  <option key={index} value={loc.name}>{loc.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Village</Form.Label>
              <Form.Select
                name="village"
                value={formData.village}
                onChange={handleChange}
                required
                disabled={!formData.panchayat}
                className="shadow-sm"
              >
                <option value="">Select Village</option>
                {filteredLocations.villages.map((loc, index) => (
                  <option key={index} value={loc.name}>{loc.name}</option>
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
                required
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sex</Form.Label>
              <Form.Select name="sex" value={formData.sex} onChange={handleChange} required className="shadow-sm">
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
                required
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
                required
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
                required
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Income</Form.Label>
              <Form.Control
                type="text"
                name="income"
                value={formData.income}
                onChange={handleChange}
                required
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Land Type</Form.Label>
              <Form.Select name="landType" value={formData.landType} onChange={handleChange} required className="shadow-sm">
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
                    required
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
                required
                className="shadow-sm"
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="w-100 mt-3 shadow-sm haptic-button">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default SubmitFarmer;