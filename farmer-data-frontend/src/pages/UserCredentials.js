import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { Eye } from 'react-bootstrap-icons'; // Import the Eye icon

const UserCredentials = () => {
  const [users, setUsers] = useState([]);
  const [showPasswords, setShowPasswords] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/usercred/all', { withCredentials: true });
        console.log('Fetched users:', res.data);
        setUsers(res.data);
      } catch (err) {
        setError('Failed to fetch users: ' + (err.response?.data?.message || err.message));
        console.error('Fetch users error:', err);
      }
    };
    fetchUsers();
  }, []);

  const togglePassword = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  return (
    <Container fluid>
      {error && <div className="alert alert-danger">{error}</div>}
      {users.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>User ID</th>
              <th>FPO Name</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name || 'N/A'}</td>
                <td>{user.id}</td>
                <td>{user.fpoName || 'N/A'}</td>
                <td>
                  <div className="d-flex align-items-center">
                    {showPasswords[user.id] ? user.password || 'N/A' : '••••••••'}
                    <Button
                      variant="link"
                      className="p-0 ms-2"
                      onClick={() => togglePassword(user.id)}
                    >
                      <Eye size={20} /> {/* Use the Eye icon component */}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center">No CEO users found.</div>
      )}
    </Container>
  );
};

export default UserCredentials;