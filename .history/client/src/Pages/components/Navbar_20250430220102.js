import Container from 'react-bootstrap/Container';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/'); // Redirect to home after logout
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/home">Airline Management System</Navbar.Brand>
        <Nav className="me-auto">
          {user && (
            <>
              <Nav.Link className="nav-link-spacing" as={Link} to="/book-flights">Book Flights</Nav.Link>
              <Nav.Link className="nav-link-spacing" as={Link} to="/search-flights">Search Flights</Nav.Link>
              <Nav.Link className="nav-link-spacing" as={Link} to="/submit-ratings">Submit Ratings</Nav.Link>
            </>
          )}
        </Nav>
        {user && (
          <Nav className="logout-nav">
            <Nav.Link 
              className="logout-link" 
              onClick={handleLogout}
            >
              Logout
            </Nav.Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default NavigationBar;