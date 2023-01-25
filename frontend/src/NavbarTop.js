import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

const NavbarTop = ({
  connectMetaMask,
  isConnected,
  isAdmin,
  signerAddr,
  isCharity,
}) => {
  const convertAddress = (addr) => {
    return addr.slice(0, 4) + "..." + addr.slice(addr.length - 4);
  };
  const showSignerAddr = signerAddr ? convertAddress(signerAddr) : "";

  return (
    <Navbar bg="info" expand="sm" variant="dark">
      <Container>
        <Navbar.Brand href="/">Fund Us</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAdmin ? <Nav.Link href="admin">Admin</Nav.Link> : null}
            <Nav.Link href="donor">Donor</Nav.Link>

            {isCharity || isAdmin ? (
              <Nav.Link href="charity">Charity</Nav.Link>
            ) : null}
          </Nav>
          <Nav>
            {isConnected ? (
              <Navbar.Text>{showSignerAddr} connected</Navbar.Text>
            ) : (
              <Button variant="outline-success" onClick={connectMetaMask}>
                Connect
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarTop;
