import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { ethers } from "ethers";

const OneCard = ({ contract, charity, latestPrice }) => {
  const [donateETH, setDonateETH] = useState(0);

  const donate = async (charityId) => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    // const ck = ethers.utils.parseEther(donateETH);
    // console.log("ck", ck);
    await contract
      .donate(charityId, { value: ethers.utils.parseEther(donateETH) })
      .then(() => alert("Donate to charity success!"))
      .catch((err) => {
        alert(err.message);
      });
  };

  const convertToETH = (usd) => {
    const valueETH = (usd * 100000000) / latestPrice;
    return (Math.ceil(valueETH * 10000) / 10000).toFixed(4);
  };

  return (
    <Card className="my-2 mt-4" style={{ width: "18rem" }}>
      <Card.Header>Charity Name: {charity.name}</Card.Header>
      <Card.Img variant="top" src={charity.imageURL} />
      <Card.Body>
        <Card.Text>{charity.description}</Card.Text>
        <Form.Group className="mb-3">
          <Form.Label>
            Donate ETH: Minimum one-time donation is ${charity.min} USD{" "}
            {`(${convertToETH(charity.min)} ETH)`}
          </Form.Label>
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
