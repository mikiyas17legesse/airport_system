import Container from 'react-bootstrap/Container';
import { Navbar, Nav } from 'react-bootstrap';
import './Navbar.css';

const NavigationBar = () => {
  return (
    <Navbar bg="primary" data-bs-theme="dark">
    <Container>
      <Navbar.Brand href="home">Airline Management System</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link className="nav-link-spacing" href="home">Home</Nav.Link>
        <Nav.Link className="nav-link-spacing" href="book flights">Book Flights</Nav.Link>
        <Nav.Link className="nav-link-spacing" href="search flights">Search Flights</Nav.Link>
        <Nav.Link className="nav-link-spacing" href="submit ratings">Submit Ratings</Nav.Link>
      </Nav>
    </Container>
  </Navbar>
  );
};

export default NavigationBar;  