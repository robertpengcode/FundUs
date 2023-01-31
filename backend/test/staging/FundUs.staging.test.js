const { assert } = require("chai");
const { network, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundUs Staging Tests", function () {
      let deployer;
      let fundUs;
      let owner;
      //const sendValue = ethers.utils.parseEther("0.007");
      beforeEach(async () => {
        [owner] = await ethers.getSigners();
        deployer = (await getNamedAccounts()).deployer;
        fundUs = await ethers.getContract("FundUs", deployer);
      });

      it("allows owner to list charity", async () => {
        const response1 = await fundUs.listCharity(
          "testURI",
          "0x5d0dA0E8C842Fcb9515Be77f9B7822A7617aBd40",
          10
        );
        await response1.wait(1);
        const charityInfo = await fundUs.getCharityInfo(0);
        const charityAddr = charityInfo[1];
        assert.equal(charityAddr, "0x5d0dA0E8C842Fcb9515Be77f9B7822A7617aBd40");
      });
    });
