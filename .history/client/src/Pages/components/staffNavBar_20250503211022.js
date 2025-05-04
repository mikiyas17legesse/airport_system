import Container from 'react-bootstrap/Container';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './staffNavBar.css';

const NavigationBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Call the AuthContext logout function to clear auth state
    navigate('/');
  };

  return (
    <Navbar className="custom-navbar" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/staff-home">Airline Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/view-flights">View Flights</Nav.Link>
            <Nav.Link as={Link} to="/create-flight">New Flight</Nav.Link>
            <Nav.Link as={Link} to="/change-status">Change Flight Status</Nav.Link>
            <Nav.Link as={Link} to="/add-airplane">Add Airplane</Nav.Link>
            <Nav.Link as={Link} to="/add-airport">Add Airport</Nav.Link>
            <Nav.Link as={Link} to="/flight-ratings">View Flight Ratings</Nav.Link>
            <Nav.Link as={Link} to="/view-reports">View Reports</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
