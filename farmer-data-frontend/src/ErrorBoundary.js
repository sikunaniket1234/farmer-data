import React, { Component } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5 text-center">
          <Alert variant="danger">
            <h4>Something went wrong!</h4>
            <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </Alert>
        </Container>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;