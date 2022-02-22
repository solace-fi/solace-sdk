The Solace SDK exists to make it easy for developers to integrate Solace into external protocols and custom scripts. It is designed to run in Javascript environments (browsers, frontend, Node.js). 


This SDK is in alpha testing and may contain bugs or change significantly between patch versions. If you have questions about how to use the SDK, please reach out in the Discord. Pull requests welcome!

### Intended Usage

Setup and obtain active cover limit of Solace Cover Product on Ethereum mainnet
```
import { Fetcher, Policyholder } from "@solace/sdk"
const fetcher = new Fetcher(1) // Create new Fetcher-class object, connected to Ethereum mainnet (chainID = 1)
const activeCoverLimit = await fetcher.activeCoverLimit()
```

Obtaining referral code for given Signer entity on Ethereum mainnet (https://docs.ethers.io/v5/api/signer/)
```
const signer = new ethers.Wallet(<PRIVATE_KEY>, <PROVIDER>) // Provide Signer entity here
const policyholder = new Policyholder(1, signer)
const referralCode = policyholder.getReferralCode()
```

Withdrawing from Solace Cover Product account on Ethereum mainnet for a given Signer
```
const signer = new ethers.Wallet(<PRIVATE_KEY>, <PROVIDER>) // Provide Signer entity here
const policyholder = new Policyholder(1, signer)
await policyholder.withdraw()
```

