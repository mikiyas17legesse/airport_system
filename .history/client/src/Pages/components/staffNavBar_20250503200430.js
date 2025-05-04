import Container from 'react-bootstrap/Container';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {

  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/'); 
  };

  return (
    <Navbar className="custom-navbar" expand="lg" variant="dark">
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
          <Nav.Link className="nav-link-spacing" onClick={handleLogout}>Logout</Nav.Link>
        </Nav>
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
