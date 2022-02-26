The Solace SDK exists to make it easy for developers to integrate Solace into external protocols and custom scripts. It is designed to run in Javascript environments (browsers, frontend, Node.js). 


This SDK is in alpha testing and may contain bugs or change significantly between patch versions. If you have questions about how to use the SDK, please reach out in the Discord. Pull requests welcome!

### Install npm package

`npm i @solace-fi/sdk`

### Testing

`yarn test`

### Basic Usage

Get active cover limit of Solace Cover Product on Ethereum mainnet
```
import { Fetcher } from "@solace/sdk"

// Create new Fetcher instance (contains blockchain read-only methods), connected to Ethereum mainnet (chainID = 1)
const fetcher = new Fetcher(1)

// Makes read-only call to SolaceCoverProduct.sol smart contract
const activeCoverLimit = await fetcher.activeCoverLimit()
```

Making a deposit() transaction to Solace Cover Product on Ethereum mainnet - see https://docs.solace.fi/docs/dev-docs/contracts/products/SolaceCoverProduct#deposit for further details
```
import { solaceUtils, Policyholder } from "@solace/sdk"

// Default to using Metamask connection, read documentation on how to customise RPC endpoint and other network settings
const signer = await solaceUtils.getSigner()

// Create new Policyholder instance (contains blockchain write methods), connected to Ethereum mainnet and Metamask
const policyholder = new Policyholder(1, signer)

// Makes call to deposit() function on deployed SolaceCoverProduct.sol with provided parameters
// Read documentation on how to customize gas settings for the transactio
let tx = await policyholder.deposit(<ADDRESS_STRING>, <DEPOSIT_AMOUNT_BIGNUMBER>)
```

Obtaining SolaceCoverProduct referral code for Rinkeby for a selected Metamask account
```
import { solaceUtils, Policyholder } from "@solace/sdk"
const signer = await solaceUtils.getSigner()
const policyholder = new Policyholder(4, signer)
const referralCode = policyholder.getReferralCode()
```

