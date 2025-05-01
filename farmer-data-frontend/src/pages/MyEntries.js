import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const MyEntries = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/form', {
          withCredentials: true,
        });
        setFarmers(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch farmers');
        setFarmers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  const canEdit = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInSeconds = (now - created) / 1000;
    return diffInSeconds < 3600; // 60 minutes
  };

  if (!user || user.role !== 'CEO') {
    return <Navigate to="/login" />;
  }

  return (
    <Container fluid className="mt-4 mb-4 animate__animated animate__fadeIn">
      <h2 className="text-primary mb-4">My Entries</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : farmers.length === 0 ? (
        <Alert variant="info">No farmers found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Contact</th>
              <th>Aadhar</th>
              <th>Income</th>
              <th>Land Type</th>
              <th>Crops</th>
              <th>Location</th>
              <th>Photo</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((farmer) => (
              <tr key={farmer.id}>
                <td>{farmer.name}</td>
                <td>{farmer.age}</td>
                <td>{farmer.sex}</td>
                <td>{farmer.contact}</td>
                <td>{farmer.aadhar}</td>
                <td>{farmer.income}</td>
                <td>{farmer.landType}</td>
                <td>{Array.isArray(farmer.crops) ? farmer.crops.join(', ') : farmer.crops}</td>
                <td>
                  {farmer.location
                    ? `${farmer.location.state || ''} > ${farmer.location.district || ''} > ${farmer.location.block || ''} > ${farmer.location.panchayat || ''} > ${farmer.location.village || ''}`
                    : 'N/A'}
                </td>
                <td>
                  {farmer.farmerPicture ? (
                    <img
                      src={`http://localhost:5000/${farmer.farmerPicture}`}
                      alt="Farmer"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  ) : (
                    'No Photo'
                  )}
                </td>
                <td>{new Date(farmer.createdAt).toLocaleDateString()}</td>
                <td>
                  {canEdit(farmer.createdAt) ? (
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => navigate(`/edit-farmer/${farmer.id}`)}
                    >
                      Edit
                    </Button>
                  ) : (
                    'Expired'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MyEntries;