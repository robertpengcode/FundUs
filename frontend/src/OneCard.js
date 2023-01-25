import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { ethers } from "ethers";

const OneCard = ({ contract, charity }) => {
  const [donateETH, setDonateETH] = useState(0);

  const donate = async (charityId) => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    const ck = ethers.utils.parseEther(donateETH);
    console.log("ck", ck);
    await contract
      .donate(charityId, { value: ethers.utils.parseEther(donateETH) })
      .then(() => alert("Donate to charity success!"))
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <Card className="my-2 mt-4">
      <Card.Header>{charity.name}</Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label>Donate ETH</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter ETH"
            value={donateETH}
            onChange={(e) => {
              setDonateETH(e.target.value);
            }}
            min="0"
          />
        </Form.Group>

        <Button
          variant="outline-success"
          size="sm"
          onClick={() => donate(charity.charityId)}
        >
          Donate
        </Button>
      </Card.Body>
    </Card>
  );
};

export default OneCard;
