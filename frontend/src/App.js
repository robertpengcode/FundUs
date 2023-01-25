import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import NavbarTop from "./NavbarTop";
import AdminMenu from "./AdminMenu";
import DonorMenu from "./DonorMenu";
import CharityMenu from "./CharityMenu";
import { connect, getContract } from "./contract";
import { useState, useEffect } from "react";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [signerAddr, setSignerAddr] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCharity, setIsCharity] = useState(false);
  //console.log("cc", isCharity);

  useEffect(() => {
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length > 0) {
        setIsConnected(true);
        getContract().then(async ({ contract, signer }) => {
          setContract(contract);
          if (contract) {
            checkAdmin(contract, signer);
            checkCharity(contract);
          }
        });
      } else {
        setIsConnected(false);
      }
    });
  }, []);

  const checkAdmin = (contract, signer) => {
    signer.getAddress().then((address) => {
      setSignerAddr(address);
      contract
        .getOwner()
        .then((owner) => {
          return owner === address;
        })
        .then((result) => {
          setIsAdmin(result);
        });
    });
  };

  const checkCharity = (contract) => {
    contract.getCharityIds().then((idsArr) => {
      if (idsArr.length === 0) return;
      idsArr.forEach((id) => {
        contract
          .getCharityInfo(id)
          .then((charityInfo) => {
            return charityInfo[1] === signerAddr;
          })
          .then((result) => {
            setIsCharity(result);
          });
      });
    });
  };

  const connectMetaMask = async () => {
    const { contract } = await connect();
    if (contract) {
      setContract(contract);
      setIsConnected(true);
      alert("Connect!");
    }
  };

  return (
    <div className="App">
      <Router>
        <NavbarTop
          connectMetaMask={connectMetaMask}
          isConnected={isConnected}
          isAdmin={isAdmin}
          signerAddr={signerAddr}
          isCharity={isCharity}
        />
        <div className="container">
          <Routes>
            <Route path="" element={<Home contract={contract} />} />
            {isAdmin ? (
              <Route path="admin" element={<AdminMenu contract={contract} />} />
            ) : (
              <Route path="admin" element={<></>} />
            )}
            {isCharity || isAdmin ? (
              <Route
                path="charity"
                element={<CharityMenu contract={contract} />}
              />
            ) : (
              <Route path="charity" element={<></>} />
            )}
            <Route path="donor" element={<DonorMenu contract={contract} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
