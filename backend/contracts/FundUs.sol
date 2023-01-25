// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FundUs {

    struct Charity {
        string charityURI;
        address charityAddr;
        uint256 minFundUSD;
        uint256 charityBalance;
        address[] donors;
        mapping(address => uint256) donations;
    }

    address public immutable owner;
    uint256 lastCharityId;

    mapping(uint256 => Charity) charities;
    uint256[] charityIds;

    AggregatorV3Interface internal priceFeed;
    uint256 minFundETH;

    event ListCharity(address indexed listedBy, uint256 indexed charityId, string charityURI, address indexed charityAddr, uint256 minFundUSD, uint256 timeStamp);
    event Donate(address indexed donor, uint256 value, uint256 indexed charityId, address indexed charityAddr, uint256 timeStamp);
    event Withdraw(uint256 indexed charityId, address indexed charityAddr, uint256 value, uint256 timeStamp);

    error FundUs_CharityNotExist();
    error FundUs_NotSufficient();
    error FundUs_NoBalance();
    error FundUs_SentFailed();

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyCharity(uint256 charityId) {
        require(msg.sender == charities[charityId].charityAddr, "not charity");
        _;
    }

    /**
     * Network: Goerli
     * Aggregator: ETH/USD
     * Address: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
     */
    constructor() {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        );
    }

    function listCharity(string calldata charityURI, address charityAddr, uint256 minFundUSD) external onlyOwner{
        uint256 charityId = lastCharityId;
        charityIds.push(charityId);
        charities[charityId].charityURI = charityURI;
        charities[charityId].charityAddr = charityAddr;
        charities[charityId].minFundUSD = minFundUSD;
        lastCharityId++;
        emit ListCharity(msg.sender, charityId, charityURI, charityAddr, minFundUSD, block.timestamp);
    }

    function donate(uint256 charityId) external payable{
        if (charities[charityId].charityAddr == address(0)) {
            revert FundUs_CharityNotExist();
        }
        if (msg.value < minFundETH) {
            revert FundUs_NotSufficient();
        }
        if (charities[charityId].donations[msg.sender] == 0) {
            charities[charityId].donors.push(msg.sender);
        }
        charities[charityId].charityBalance += msg.value;
        charities[charityId].donations[msg.sender] += msg.value;
        
        emit Donate(msg.sender, msg.value, charityId, charities[charityId].charityAddr, block.timestamp);
    }

    function withdraw(uint256 charityId) external onlyCharity(charityId){
        uint256 amount = charities[charityId].charityBalance;
        if (amount == 0) {
            revert FundUs_NoBalance();
        }
        charities[charityId].charityBalance = 0;
        (bool sentCharity,) = payable(msg.sender).call{value: amount}("");
        if (!sentCharity) {
           revert FundUs_SentFailed();
        }
        emit Withdraw(charityId, msg.sender, amount, block.timestamp);
    }

    function getLatestPrice() public view returns (int) {
        (
            /* uint80 roundID */,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }

    function getOwner() external view returns(address) {
        return owner;
    }

    function getCharityInfo(uint256 charityId) external view returns(string memory, address, uint256, uint256, address[] memory) {
        return(
            charities[charityId].charityURI,
            charities[charityId].charityAddr,
            charities[charityId].minFundUSD,
            charities[charityId].charityBalance,
            charities[charityId].donors
        );
    }

    function getCharityIds() external view returns(uint256[] memory) {
        return charityIds;
    }

    function getMinFundUSD(uint256 charityId) external view returns(uint256) {
        return charities[charityId].minFundUSD;
    }

    function getDonationAmount(uint256 charityId) external view returns(uint256) {
        return charities[charityId].donations[msg.sender];
    }
}
