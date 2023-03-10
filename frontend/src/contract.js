import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const FundUsAddress = "0x4620783CC39A5E2eD9228597c34eEDdcA201A654";
const FundUsAbi = [
  "constructor()",
  "error FundUs_CharityNotExist()",
  "error FundUs_NoBalance()",
  "error FundUs_NotCharity()",
  "error FundUs_NotOwner()",
  "error FundUs_NotSufficient()",
  "error FundUs_NotValidId()",
  "error FundUs_SentFailed()",
  "event Donate(address indexed donor, uint256 value, uint256 indexed charityId, address indexed charityAddr, uint256 timeStamp)",
  "event ListCharity(address indexed listedBy, uint256 indexed charityId, string charityURI, address indexed charityAddr, uint256 minFundUSD, uint256 timeStamp)",
  "event Withdraw(uint256 indexed charityId, address indexed charityAddr, uint256 value, uint256 timeStamp)",
  "function check() view returns (uint256)",
  "function deleteCharity(uint256 charityId)",
  "function donate(uint256 charityId) payable",
  "function getCharityIds() view returns (uint256[])",
  "function getCharityInfo(uint256 charityId) view returns (string, address, uint256, uint256, address[])",
  "function getDonationAmount(uint256 charityId) view returns (uint256)",
  "function getLatestPrice() view returns (int256)",
  "function getMinFundUSD(uint256 charityId) view returns (uint256)",
  "function getOwner() view returns (address)",
  "function listCharity(string charityURI, address charityAddr, uint256 minFundUSD)",
  "function owner() view returns (address)",
  "function withdraw(uint256 charityId)",
];

export const connect = async () => {
  await provider.send("eth_requestAccounts", []);
  return getContract();
};

export const getContract = async () => {
  const signer = provider.getSigner();
  const FundUsContract = new ethers.Contract(FundUsAddress, FundUsAbi, signer);
  return { contract: FundUsContract, signer: signer };
};
