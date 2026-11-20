### Enforcement

The [check](https://github.com/zama-ai/protocol-apps/blob/85eef95c797da20875fe7eeae7f8d212d760486f/contracts/confidential-wrapper/contracts/ConfidentialWrapper.sol#L420-L495) covers the sender, recipient and operator of every wrap, transfer and unwrap. The five tokens with an issuer denylist are cUSDC, cUSDT, cXAUT, cTGBP and cAUSD. The owner, a Zama [governance multisig](#upgrades-and-governance), adds to the block list without delay. The ACL's owner can also deny a token's own address, which halts that token for everyone. The app sends the connected address to Elliptic before each transaction and checks the IP's country for some products, as Zama's [privacy notice](https://www.zama.org/legal/zama-app-privacy-notice) says. A direct contract call skips the app's checks and still meets the token's.

### Access to private data

ConfidentialSwap's compliance address [decrypts](https://etherscan.io/address/0x8Fe22dC7e624c02b1805d41E09741490E1018C01#code) the amounts and quotes of every swap. An observer decrypts every balance and amount of its token. No token has an observer.

### Proof of clean origin

To show an amount, the user [grants](https://etherscan.io/address/0xcA2E8f1F656CD25C01F05d0b243Ab1ecd4a8ffb6#code) one party the decryption of a single balance or transfer. They can also delegate all their amounts in one token until a set date.
