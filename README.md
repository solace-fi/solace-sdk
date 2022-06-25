The Solace SDK exists to make it easy for developers to integrate Solace into external protocols and custom scripts. It is designed to run in Javascript environments (browsers, frontend, Node.js). 


This SDK is in alpha testing and may contain bugs or change significantly between patch versions. If you have questions about how to use the SDK, please reach out in the Discord. Pull requests welcome!

### Install npm package

`npm i @solace-fi/sdk`

### Testing

`yarn test`

### Basic Usage

Get active cover limit of Solace Cover Product on Ethereum mainnet
```
import { Coverage } from "@solace-fi/sdk"

// Create new Coverage instance, connected to Ethereum mainnet (chainID = 1)
const coverage = new Coverage(1)

// Makes read-only call to SolaceCoverProduct.sol smart contract
const activeCoverLimit = await coverage.activeCoverLimit()
```

### Documentation

https://docs.solace.fi/docs/dev-docs/sdk/getting-started