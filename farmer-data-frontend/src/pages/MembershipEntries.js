import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const MembershipEntries = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [memberships, setMemberships] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/membership', {
          withCredentials: true,
        });
        setMemberships(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch memberships');
        setMemberships([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMemberships();
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
      <h2 className="text-primary mb-4">Membership Entries</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : memberships.length === 0 ? (
        <Alert variant="info">No memberships found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Membership Fee</th>
              <th>Receipt No</th>
              <th>Membership Type</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((membership) => (
              <tr key={membership.id}>
                <td>{membership.name}</td>
                <td>{membership.contact}</td>
                <td>{membership.membershipFee}</td>
                <td>{membership.receiptNo}</td>
                <td>{membership.membershipType}</td>
                <td>{new Date(membership.createdAt).toLocaleDateString()}</td>
                <td>
                  {canEdit(membership.createdAt) ? (
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => navigate(`/edit-membership/${membership.id}`)}
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

export default MembershipEntries;