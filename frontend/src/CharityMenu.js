import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

const CharityMenu = ({ contract }) => {
  const [charityId, setCharityId] = useState("");
  const withdraw = async (charityId) => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    await contract
      .withdraw(charityId)
      .then(() => alert("withdraw balance success!"))
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <Container className="d-flex flex-column">
      <h1 className="display-6 d-flex justify-content-center">
        Charity Withdraw
      </h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Charity ID</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Charity ID#"
            value={charityId}
            onChange={(e) => {
              setCharityId(e.target.value);
            }}
            min="0"
          />
        </Form.Group>

        <Button variant="outline-success" className="mt-2" onClick={withdraw}>
          Charity Withdraw
        </Button>
      </Form>
    </Container>
  );
};

export default CharityMenu;
