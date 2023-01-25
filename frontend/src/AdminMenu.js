import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

const AdminMenu = ({ contract }) => {
  const [charityAddr, setCharityAddr] = useState("");
  const [charityURI, setCharityURI] = useState("");
  const [minFundUSD, setMinFundUSD] = useState("");
  const [charityId, setCharityId] = useState("");

  const listCharity = async () => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    await contract
      .listCharity(charityURI, charityAddr, minFundUSD)
      .then(() => alert("list charity success!"))
      .catch((err) => {
        alert(err.message);
      });
    setCharityAddr("");
    setCharityURI("");
    setMinFundUSD("");
  };

  const deleteCharity = async () => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    await contract
      .deleteCharity()
      .then(() => alert("delete charity success!"))
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <Container className="d-flex flex-column">
      <h1 className="display-6 d-flex justify-content-center">List Charity</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Charity Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Charity Address"
            value={charityAddr}
            onChange={(e) => {
              setCharityAddr(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Charity URI</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter URI"
            value={charityURI}
            onChange={(e) => {
              setCharityURI(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Min Donation in USD</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Min Donation"
            value={minFundUSD}
            onChange={(e) => {
              setMinFundUSD(e.target.value);
            }}
            min="0"
          />
        </Form.Group>

        <Button
          variant="outline-success"
          className="mt-2"
          onClick={listCharity}
        >
          List Charity
        </Button>
      </Form>

      <h1 className="display-6 d-flex justify-content-center mt-2">
        Delete Charity
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

        <Button
          variant="outline-success"
          className="mt-2"
          onClick={deleteCharity}
        >
          Delete Charity
        </Button>
      </Form>
    </Container>
  );
};

export default AdminMenu;
