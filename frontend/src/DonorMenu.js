import Container from "react-bootstrap/Container";
import OneCard from "./OneCard";
import { useState, useEffect } from "react";

const DonorMenu = ({ contract, latestPrice }) => {
  const [charitiesArr, setCharitiesArr] = useState([]);

  useEffect(() => {
    if (!contract) return;
    const filter = contract.filters.ListCharity();
    contract
      .queryFilter(filter)
      .then((result) => {
        processData(result);
      })
      .catch((error) => console.log(error));
  }, [contract]);

  const processData = async (result) => {
    const promises = [];
    const newCharities = [];
    for (const charity of result) {
      const {
        listedBy,
        charityId,
        charityURI,
        charityAddr,
        minFundUSD,
        timeStamp,
      } = charity.args;
      const promise = contract
        .getCharityInfo(charityId)
        .then(async (charityData) => {
          const uri = charityData[2];
          if (!uri) return;
          const charityBalance = charityData[3];
          const donors = charityData[4];

          const newCharity = {
            charityId: charityId.toNumber(),
            address: charityAddr,
            min: minFundUSD.toNumber(),
            charityBalance: charityBalance.toString(),
            donors: donors,
          };

          try {
            await fetch(charityURI)
              .then((result) => result.json())
              .then((data) => {
                newCharity.name = data.name;
                newCharity.description = data.description;
                newCharity.imageURL = data.imageURL;
                newCharities.push(newCharity);
              });
          } catch {}
        });
      promises.push(promise);
    }
    await Promise.all(promises);
    setCharitiesArr(newCharities);
  };

  return (
    <Container>
      <h1 className="display-6 d-flex justify-content-center">Donate</h1>
      <Container className="d-flex justify-content-around">
        {charitiesArr.map((charity, id) => (
          <OneCard
            contract={contract}
            charity={charity}
            key={id}
            latestPrice={latestPrice}
          >
            One Card
          </OneCard>
        ))}
      </Container>
    </Container>
  );
};

export default DonorMenu;
