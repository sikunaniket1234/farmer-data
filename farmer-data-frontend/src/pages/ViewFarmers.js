import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Alert, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ViewFarmers = () => {
  const { user } = useContext(AuthContext);
  const [farmers, setFarmers] = useState([]);
  const [error, setError] = useState('');
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [filterFpo, setFilterFpo] = useState('');
  const [filterCrop, setFilterCrop] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterBlock, setFilterBlock] = useState('');
  const [filterPanchayat, setFilterPanchayat] = useState('');
  const [filterVillage, setFilterVillage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/form', { withCredentials: true });
        setFarmers(res.data);
        setFilteredFarmers(res.data); // Initialize filtered list
      } catch (err) {
        setError('Failed to fetch farmers');
      }
    };
    fetchFarmers();
  }, []);

  const handleExport = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/form/export', {
        farmers: filteredFarmers, // Send the visible filtered list
      }, {
        withCredentials: true,
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'farmers.xlsx';
      link.click();
    } catch (err) {
      setError('Failed to export farmers: ' + (err.response?.data?.message || err.message));
    }
  };

  // Apply filters and search
  useEffect(() => {
    let result = [...farmers];

    if (filterFpo) {
      result = result.filter(farmer => farmer.ceo?.fpoName === filterFpo);
    }
    if (filterCrop) {
      result = result.filter(farmer => farmer.crops.includes(filterCrop));
    }
    if (filterState) {
      result = result.filter(farmer => farmer.location?.state === filterState);
    }
    if (filterDistrict) {
      result = result.filter(farmer => farmer.location?.district === filterDistrict);
    }
    if (filterBlock) {
      result = result.filter(farmer => farmer.location?.block === filterBlock);
    }
    if (filterPanchayat) {
      result = result.filter(farmer => farmer.location?.panchayat === filterPanchayat);
    }
    if (filterVillage) {
      result = result.filter(farmer => farmer.location?.village === filterVillage);
    }
    if (searchQuery) {
      result = result.filter(farmer =>
        Object.values(farmer).some(value =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        farmer.ceo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farmer.ceo?.fpoName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFarmers(result);
  }, [filterFpo, filterCrop, filterState, filterDistrict, filterBlock, filterPanchayat, filterVillage, searchQuery, farmers]);

  // Get unique values for filters
  const fpoOptions = [...new Set(farmers.map(farmer => farmer.ceo?.fpoName).filter(Boolean))];
  const cropOptions = [...new Set(farmers.flatMap(farmer => farmer.crops).filter(Boolean))];
  const stateOptions = [...new Set(farmers.map(farmer => farmer.location?.state).filter(Boolean))];
  const districtOptions = [...new Set(farmers.map(farmer => farmer.location?.district).filter(Boolean))];
  const blockOptions = [...new Set(farmers.map(farmer => farmer.location?.block).filter(Boolean))];
  const panchayatOptions = [...new Set(farmers.map(farmer => farmer.location?.panchayat).filter(Boolean))];
  const villageOptions = [...new Set(farmers.map(farmer => farmer.location?.village).filter(Boolean))];

  if (!user || user.role !== 'SuperAdmin') {
    return <div className="text-center mt-5">Access denied</div>;
  }

  return (
    <Container fluid className="mt-4 mb-4 animate__animated animate__fadeIn">
      <h2 className="text-primary mb-4">View Farmers</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-3">
        <Col md={2}>
          <Form.Group>
            <Form.Label>Filter by FPO Name</Form.Label>
            <Form.Select value={filterFpo} onChange={(e) => setFilterFpo(e.target.value)} className="shadow-sm">
              <option value="">All</option>
              {fpoOptions.map((fpo, index) => (
                <option key={index} value={fpo}>{fpo}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Filter by Crop</Form.Label>
            <Form.Select value={filterCrop} onChange={(e) => setFilterCrop(e.target.value)} className="shadow-sm">
              <option value="">All</option>
              {cropOptions.map((crop, index) => (
                <option key={index} value={crop}>{crop}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Filter by State</Form.Label>
            <Form.Select value={filterState} onChange={(e) => setFilterState(e.target.value)} className="shadow-sm">
              <option value="">All</option>
              {stateOptions.map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Filter by District</Form.Label>
            <Form.Select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} className="shadow-sm">
              <option value="">All</option>
              {districtOptions.map((district, index) => (
                <option key={index} value={district}>{district}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Filter by Block</Form.Label>
            <Form.Select value={filterBlock} onChange={(e) => setFilterBlock(e.target.value)} className="shadow-sm">
              <option value="">All</option>
              {blockOptions.map((block, index) => (
                <option key={index} value={block}>{block}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Filter by Panchayat</Form.Label>
            <Form.Select value={filterPanchayat} onChange={(e) => setFilterPanchayat(e.target.value)} className="shadow-sm">
              <option value="">All</option>
              {panchayatOptions.map((panchayat, index) => (
                <option key={index} value={panchayat}>{panchayat}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Filter by Village</Form.Label>
            <Form.Select value={filterVillage} onChange={(e) => setFilterVillage(e.target.value)} className="shadow-sm">
              <option value="">All</option>
              {villageOptions.map((village, index) => (
                <option key={index} value={village}>{village}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all fields..."
              className="shadow-sm"
            />
          </Form.Group>
        </Col>
      </Row>

      <Button variant="success" onClick={handleExport} className="mb-3 shadow-sm haptic-button">
        Export to Excel
      </Button>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>CEO Name</th>
              <th>FPO Name</th>
              <th>Farmer Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Father Name</th>
              <th>Contact</th>
              <th>Aadhar</th>
              <th>Income</th>
              <th>Land Type</th>
              <th>Crops</th>
              <th>Location</th>
              <th>Photo</th>
              <th>Created At</th>
              <th>Last Edited At</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.map(farmer => (
              <tr key={farmer.id}>
                <td>{farmer.ceo?.name || 'N/A'}</td>
                <td>{farmer.ceo?.fpoName || 'N/A'}</td>
                <td>{farmer.name}</td>
                <td>{farmer.age}</td>
                <td>{farmer.sex}</td>
                <td>{farmer.fatherName}</td>
                <td>{farmer.contact}</td>
                <td>{farmer.aadhar}</td>
                <td>{farmer.income}</td>
                <td>{farmer.landType}</td>
                <td>{farmer.crops.join(', ')}</td>
                <td>
                  {farmer.location
                    ? `${farmer.location.state || 'N/A'} > ${farmer.location.district || 'N/A'} > ${farmer.location.block || 'N/A'} > ${farmer.location.panchayat || 'N/A'} > ${farmer.location.village || 'N/A'}`
                    : 'N/A'}
                </td>
                <td>
                  {farmer.farmerPicture ? (
                    <img
                      src={`http://localhost:5000/${farmer.farmerPicture}`}
                      alt="Farmer"
                      style={{ maxWidth: '100px', height: 'auto' }}
                    />
                  ) : (
                    'No Photo'
                  )}
                </td>
                <td>{new Date(farmer.createdAt).toLocaleString()}</td>
                <td>{new Date(farmer.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default ViewFarmers;