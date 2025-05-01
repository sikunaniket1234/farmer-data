import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AllMembershipEntries = () => {
  const { user } = useContext(AuthContext);
  const [memberships, setMemberships] = useState([]);
  const [fpoFilter, setFpoFilter] = useState('');
  const [fpoNames, setFpoNames] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMemberships = async () => {
      if (!user || user.role !== 'SuperAdmin') return; // Exit early if not SuperAdmin
      try {
        const res = await axios.get('http://localhost:5000/api/membership', { withCredentials: true });
        console.log('Fetched memberships:', res.data); // Debug log
        setMemberships(res.data);
        const uniqueFpoNames = [...new Set(res.data.map(m => m.ceo?.fpoName).filter(Boolean))];
        setFpoNames(uniqueFpoNames);
      } catch (err) {
        setError('Failed to fetch memberships: ' + (err.response?.data?.message || err.message));
        console.error('Fetch memberships error:', err);
      }
    };
    fetchMemberships();
  }, [user]); // Dependency on user to re-fetch only if user changes

  const handleExport = async () => {
    try {
      const filteredMemberships = fpoFilter
        ? memberships.filter(m => m.ceo?.fpoName === fpoFilter)
        : memberships;
      console.log('Exporting filtered memberships:', filteredMemberships);
      const res = await axios.post('http://localhost:5000/api/membership/export', {
        memberships: filteredMemberships,
      }, {
        withCredentials: true,
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'memberships.xlsx';
      link.click();
    } catch (err) {
      setError('Failed to export memberships: ' + (err.response?.data?.message || err.message));
      console.error('Export error:', err);
    }
  };

  const filteredMemberships = fpoFilter
    ? memberships.filter(m => m.ceo?.fpoName === fpoFilter)
    : memberships;

  if (!user || user.role !== 'SuperAdmin') {
    return null; // Avoid redirect loop, handle navigation in App.js
  }

  return (
    <Container fluid className="mt-4 mb-4 animate__animated animate__fadeIn">
      <h2 className="text-primary mb-4">All Membership Entries</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Filter by FPO Name</Form.Label>
        <Form.Select value={fpoFilter} onChange={(e) => setFpoFilter(e.target.value)} className="shadow-sm">
          <option value="">All FPOs</option>
          {fpoNames.map((fpoName, index) => (
            <option key={index} value={fpoName}>{fpoName}</option>
          ))}
        </Form.Select>
      </Form.Group>
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
              <th>Membership Fee</th>
              <th>Location</th>
              <th>Receipt No</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredMemberships.map(membership => (
              <tr key={membership.id}>
                <td>{membership.ceo?.name || 'N/A'}</td>
                <td>{membership.ceo?.fpoName || 'N/A'}</td>
                <td>{membership.farmer?.name || 'N/A'}</td>
                <td>{membership.membershipFee || 'N/A'}</td>
                <td>
                  {membership.farmer?.location
                    ? `${membership.farmer.location.state || 'N/A'} > ${membership.farmer.location.district || 'N/A'} > ${membership.farmer.location.block || 'N/A'} > ${membership.farmer.location.panchayat || 'N/A'} > ${membership.farmer.location.village || 'N/A'}`
                    : 'N/A'}
                </td>
                <td>{membership.receiptNo || 'N/A'}</td>
                <td>{new Date(membership.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default AllMembershipEntries;