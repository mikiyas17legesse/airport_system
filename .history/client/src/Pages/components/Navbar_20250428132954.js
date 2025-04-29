import Container from 'react-bootstrap/Container';
import { Navbar, Nav } from 'react-bootstrap';

const NavigationBar = () => {
  return (
    <Navbar bg="white" data-bs-theme="light">
    <Container>
      <Navbar.Brand href="home">Airline Management System</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="home">Home</Nav.Link>
        <Nav.Link href="book flights">Book Flights</Nav.Link>
        {/* <Nav.Link href="#pricing">Pricing</Nav.Link> */}
      </Nav>
    </Container>
  </Navbar>
  );
};

export default NavigationBar;  