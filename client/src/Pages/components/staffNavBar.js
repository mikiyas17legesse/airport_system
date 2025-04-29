import Container from 'react-bootstrap/Container';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';

const NavigationBar = () => {
  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/staff-home">Airline Management System</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link className="nav-link-spacing" as={Link} to="/view-flights">View Flights</Nav.Link>
          <Nav.Link className="nav-link-spacing" as={Link} to="/create-flight">New Flight</Nav.Link>
          <Nav.Link className="nav-link-spacing" as={Link} to="/change-status">Change Flight Status</Nav.Link>
          <Nav.Link className="nav-link-spacing" as={Link} to="/add-airplane">Add Airplane</Nav.Link>
          <Nav.Link className="nav-link-spacing" as={Link} to="/add-airport">Add Airport</Nav.Link>
          <Nav.Link className="nav-link-spacing" as={Link} to="/flight-ratings">View Flight Ratings</Nav.Link>
          <Nav.Link className="nav-link-spacing" as={Link} to="/view-reports">View Reports</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
