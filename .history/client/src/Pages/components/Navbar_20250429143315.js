import Container from 'react-bootstrap/Container';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';

const NavigationBar = () => {
  return (
    <Navbar bg="primary" data-bs-theme="dark">
    <Container>
      <Navbar.Brand as={Link} to="/home">Airline Management System</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link className="nav-link-spacing" as={Link} to="/book-flights">Book Flights</Nav.Link>
        <Nav.Link className="nav-link-spacing" as={Link} to="/search-flights">Search Flights</Nav.Link>
        <Nav.Link className="nav-link-spacing" as={Link} to="/submit-ratings">Submit Ratings</Nav.Link>
      </Nav>
      <Nav className="logout-nav">
        <Nav.Link className="logout-link" as={Link} to="/logout">Logout</Nav.Link>
      </Nav>
    </Container>
  </Navbar>
  );
};

export default NavigationBar;  