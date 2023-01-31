const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundUs", function () {
      let fundUs;
      let mockV3Aggregator;
      let deployer;
      let owner;
      let user2;
      let user3;
      let charity1;
      let charity2;
      before(async () => {
        [owner, user2, user3, charity1, charity2] = await ethers.getSigners();
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundUs = await ethers.getContract("FundUs", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", function () {
        it("sets the aggregator addresses correctly", async () => {
          const response = await fundUs.getPriceFeed();
          assert.equal(response, mockV3Aggregator.address);
        });
      });

      describe("listCharity", function () {
        //charity's address mush be an address, cannot be a string -> type error
        it("should not be listed by non-owner", async () => {
          await expect(
            fundUs.connect(user2).listCharity("testURI", charity1.address, 10)
          ).to.be.revertedWithCustomError(fundUs, "FundUs_NotOwner");
          //   ).to.be.reverted;
        });
        it("should be listed by owner", async () => {
          await expect(
            fundUs.listCharity("testURI", charity1.address, 10)
          ).to.emit(fundUs, "ListCharity");
        });
      });

      describe("donate", function () {
        it("should not donate if fund lower than min", async () => {
          await expect(
            fundUs.donate(0, { value: 0 })
          ).to.be.revertedWithCustomError(fundUs, "FundUs_NotSufficient");
        });
        it("should not donate if charity does not exist", async () => {
          await expect(
            fundUs.donate(1, { value: ethers.utils.parseEther("0.006") })
          ).to.be.revertedWithCustomError(fundUs, "FundUs_CharityNotExist");
        });
        it("should donate - event 'Donate'", async () => {
          await expect(
            fundUs.donate(0, { value: ethers.utils.parseEther("0.006") })
          ).to.be.emit(fundUs, "Donate");
        });
        it("should add donor to array 'donors'", async () => {
          const charityInfo = await fundUs.getCharityInfo(0);
          const donorsArr = charityInfo[4];
          expect(donorsArr.length).to.equal(1);
          expect(donorsArr[0]).to.equal(owner.address);
        });
        it("should update charity's and donor's balances", async () => {
          const donatedMoney = ethers.utils.parseEther("0.006");
          const charityInfo = await fundUs.getCharityInfo(0);
          const charityBalance = charityInfo[3];
          expect(charityBalance).to.equal(donatedMoney);
          const donorBalanceInCharity = await fundUs.getDonationAmount(0);
          expect(donorBalanceInCharity).to.equal(donatedMoney);
        });
      });

      describe("withdraw", function () {
        it("should not withdraw if not charity", async () => {
          await expect(fundUs.withdraw(0)).to.be.revertedWithCustomError(
            fundUs,
            "FundUs_NotCharity"
          );
        });
        it("should not withdraw if no balance", async () => {
          await fundUs.listCharity("testURI2", charity2.address, 20);
          await expect(
            fundUs.connect(charity2).withdraw(1)
          ).to.be.revertedWithCustomError(fundUs, "FundUs_NoBalance");
        });
        it("should withdraw", async () => {
          await expect(fundUs.connect(charity1).withdraw(0)).to.be.emit(
            fundUs,
            "Withdraw"
          );
        });
        it("should update charity's balance to 0", async () => {
          const charityInfo = await fundUs.getCharityInfo(0);
          const charityBalance = charityInfo[3];
          expect(charityBalance).to.equal(0);
        });
      });

      describe("delete charity", function () {
        it("should not delete charity that has balance", async () => {
          await fundUs.donate(1, { value: ethers.utils.parseEther("0.013") });
          await expect(fundUs.deleteCharity(1)).to.be.revertedWithCustomError(
            fundUs,
            "FundUs_HasBalance"
          );
        });
        it("should not delete charity - invalid id", async () => {
          await expect(fundUs.deleteCharity(2)).to.be.revertedWithCustomError(
            fundUs,
            "FundUs_NotValidId"
          );
        });
        it("should not delete charity by non-owner", async () => {
          await expect(
            fundUs.connect(user2).deleteCharity(0)
          ).to.be.revertedWithCustomError(fundUs, "FundUs_NotOwner");
        });
        it("should delete charity - event 'Delete'", async () => {
          await expect(fundUs.deleteCharity(0)).to.be.emit(fundUs, "Delete");
        });
        it("should reset info - address(0)", async () => {
          const charityInfo = await fundUs.getCharityInfo(0);
          const charityAddr = charityInfo[1];
          expect(charityAddr).to.equal(
            "0x0000000000000000000000000000000000000000"
          );
        });
      });
    });
