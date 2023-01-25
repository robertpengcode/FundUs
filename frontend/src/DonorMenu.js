import Container from "react-bootstrap/Container";
import OneCard from "./OneCard";

const DonorMenu = ({ contract }) => {
  const testCharities = [
    {
      name: "test name 1",
      address: "test addr 1",
      min: 1,
    },
    {
      name: "test name 2",
      address: "test addr 1",
      min: 2,
    },
    {
      name: "test name 3",
      address: "test addr 1",
      min: 3,
    },
  ];

  return (
    <Container>
      <h1 className="display-6 d-flex justify-content-center">Donate</h1>
      {testCharities.map((charity, id) => (
        <OneCard contract={contract} charity={charity} key={id}>
          One Card
        </OneCard>
      ))}
    </Container>
  );
};

export default DonorMenu;
