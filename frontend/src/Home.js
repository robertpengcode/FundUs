import { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ethers } from "ethers";

const Home = ({ contract }) => {
  const [charityURI, setCharityURI] = useState("");
  const [charityAddr, setCharityAddr] = useState("");
  const [minFundUSD, setMinFundUSD] = useState("");
  const [charityBalance, setCharityBalance] = useState(0);
  const [donors, setDonors] = useState([]);
  const [charityId, setCharityId] = useState("");
  const [charityIds, setCharityIds] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");

  const getCharityIds = async () => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    await contract
      .getCharityIds()
      .then((ids) => {
        const idsArr = ids.map((id) => id.toNumber());
        setCharityIds(idsArr);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const getCharityInfo = async (charityId) => {
    if (!contract) {
      alert("Please connect to MetaMask!");
      return;
    }
    await contract
      .getCharityInfo(charityId)
      .then((info) => {
        setInfo(info);
        getMoreInfo(info[0]);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const getMoreInfo = async (charityURI) => {
    if (!charityURI) return;
    fetch(charityURI)
      .then((result) => result.json())
      .then((data) => {
        console.log("hoho", data);
        setName(data.name);
        setDescription(data.description);
        setImageURL(data.imageURL);
      });
  };

  const setInfo = (info) => {
    setCharityURI(info[0]);
    setCharityAddr(info[1]);
    setMinFundUSD(info[2].toNumber());
    setCharityBalance(info[3].toNumber());
    setDonors(info[4]);
  };

  const convertAddress = (addr) => {
    return addr.slice(0, 4) + "..." + addr.slice(addr.length - 4);
  };

  return (
    <Container>
      <h1 className="display-6 d-flex justify-content-center">
        Charity Information
      </h1>
      <Button variant="outline-success" onClick={getCharityIds}>
        Get Charity IDs
      </Button>
      <div className="mt-1">
        <div>Charity IDs: {charityIds.join(", ")}</div>
      </div>
      <Form.Group className="mt-1">
        <Form.Label>Charity ID</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter Charity ID#"
          value={charityId}
          onChange={(e) => setCharityId(e.target.value)}
          min="0"
        />
      </Form.Group>
      <Button
        variant="outline-success"
        className="mt-2"
        onClick={() => getCharityInfo(charityId)}
      >
        Get Info
      </Button>

      <div className="mt-1">
        <div>Charity Name: {name}</div>
      </div>
      <div className="mt-1">
        <div>Charity Address: {charityAddr}</div>
      </div>
      <div className="mt-1">
        <div>Charity URI: {charityURI} </div>
      </div>
      <div className="mt-1">
        {imageURL ? <img src={imageURL} width={200}></img> : null}
      </div>
      <div className="mt-1">
        <div>Description: {description}</div>
      </div>
      <div className="mt-1">
        <div>Min Fund in USD: {minFundUSD}</div>
      </div>
      <div className="mt-1">
        <div>
          Donors({donors.length}){": "}
          {donors.length === 0
            ? null
            : donors.map((donor) => `${convertAddress(donor)}, `)}
        </div>
      </div>
      <div className="mt-1">
        <div>
          Balance (Ether):{" "}
          {charityBalance === 0
            ? null
            : ethers.utils.formatEther(charityBalance)}
        </div>
      </div>
    </Container>
  );
};

export default Home;
