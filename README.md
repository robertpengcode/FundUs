# Hardhat FundUs

# Getting Started

```
git clone https://github.com/robertpengcode/FundUs.git
cd FundUs
cd backend
npm init
```

# Usage

Deploy:

```
npx hardhat deploy
```

## Testing

```
npx hardhat test
```

### Test Coverage

```
npx hardhat coverage
```

# Deployment to a testnet or mainnet

1. Setup environment variables

You'll want to set your `GOERLI_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file.

2. Get testnet ETH

https://goerlifaucet.com/

3. Deploy

```
npx hardhat deploy --network goerli
```
