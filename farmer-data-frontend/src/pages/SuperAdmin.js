import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import LocationInsert from './LocationInsert'

const SuperAdmin = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'SuperAdmin') {
    return <Navigate to="/login" />;
  }

  return (
    <Container fluid className="mt-4 mb-4 animate__animated animate__fadeIn">
      <h2 className="text-primary mb-4">Hello, {user.name}</h2>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm card-hover">
            <Card.Body>
              <Card.Title>Create CEO</Card.Title>
              <Card.Text>Add a new CEO to the system.</Card.Text>
              <Link to="/create-user">
                <Button variant="primary" className="w-100 haptic-button">
                  Create CEO
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm card-hover">
            <Card.Body>
              <Card.Title>View Farmers</Card.Title>
              <Card.Text>View all farmers in the system.</Card.Text>
              <Link to="/view-farmers">
                <Button variant="primary" className="w-100 haptic-button">
                  View Farmers
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm card-hover">
            <Card.Body>
              <Card.Title>All Membership Entries</Card.Title>
              <Card.Text>View all membership entries by CEOs.</Card.Text>
              <Link to="/all-membership-entries">
                <Button variant="primary" className="w-100 haptic-button">
                  View Entries
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
        <Card className="shadow-sm card-hover">
          <Card.Body>
            <Card.Title>All CEO Data</Card.Title>
            <Card.Text>View all CEOs.</Card.Text>
            <Link to="/user-credentials">
              <Button variant="primary" className="w-100 haptic-button">
                View Entries
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} className="mb-4">
        <Card className="shadow-sm card-hover">
          <Card.Body>
            <Card.Title>Insert Locations</Card.Title>
            <Card.Text>loactions.</Card.Text>
            <Link to="/location-insert">
              <Button variant="primary" className="w-100 haptic-button">
                View Entries
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>
      </Row>
    </Container>
  );
};

export default SuperAdmin;