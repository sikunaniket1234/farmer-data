import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';


const CEO = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'CEO') {
    return <Navigate to="/login" />;
  }

  return (
    <Container fluid className="mt-4 mb-4 animate__animated animate__fadeIn">
      <h2 className="text-primary mb-4">Hello, {user.name}</h2>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm card-hover">
            <Card.Body>
              <Card.Title>Submit Farmer</Card.Title>
              <Card.Text>Add a new farmer to the system.</Card.Text>
              <Link to="/submit-farmer">
                <Button variant="primary" className="w-100 haptic-button">
                  Go to Form
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm card-hover">
            <Card.Body>
              <Card.Title>My Entries</Card.Title>
              <Card.Text>View and edit your submitted farmers.</Card.Text>
              <Link to="/my-entries">
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
              <Card.Title>Members/Shareholders</Card.Title>
              <Card.Text>Add membership details for farmers.</Card.Text>
              <Link to="/membership-form">
                <Button variant="primary" className="w-100 haptic-button">
                  Add Membership
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm card-hover">
            <Card.Body>
              <Card.Title>Membership Entries</Card.Title>
              <Card.Text>View and edit your membership entries.</Card.Text>
              <Link to="/membership-entries">
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

export default CEO;