zk.money is a private payments wallet for DAI by Aztec Labs. Funds are escrowed in the ZkMoneyPortal on Ethereum and held as private notes of the zk.money token contract on the Aztec Network, where users pay each other by tag (a zk.money name).

### Deposits
Users deposit to one-time deposit addresses (SIPAs) derived for their account. Anyone can sweep a funded deposit address into the portal: USDC and USDT are swapped to DAI through the Curve 3pool, the sweeper receives {{depositFee}} and the rest is sent to Aztec through the canonical Inbox. Claiming a tag costs {{registrationFee}} by default, paid from the first deposit. The portal accepts at most {{depositLimit}} per {{depositRefillTime}}, and every deposit, payment and withdrawal is capped per transaction.

### Multi-proof system
Every payment and withdrawal needs, in addition to the zk validity proof of the L2, a signature from an AWS Nitro enclave registered on the portal (2/2). Anyone can register an enclave with a fresh AWS attestation running on the one approved image, but L2BEAT could not rebuild that image from the published source. Stealing funds requires a failure of Aztec's private execution and of the enclave layer at the same time. But every exit depends on a live enclave, and enclaves see every operation in plaintext.

### Withdrawals and refunds
A withdrawal burns notes on Aztec and releases DAI from the portal once its L2->L1 message is proven and an enclave has signed it. A relayer usually finalizes it on Ethereum, but anyone can. If the Aztec Network moves to a new rollup, anyone can permanently freeze the portal for deposits and transfers, after which users exit through refunds that need a zk proof against the frozen Aztec state and an enclave signature.

### Fees
The portal takes {{fpcFundingCut}} from every deposit and withdrawal to fund a fee-paying contract that pays the Aztec fees of zk.money users. The wallet offers no other way to pay fees, so transactions wait while that contract is empty or Aztec fees exceed what it pays. It can be refilled by anyone.

### Tags
Tags are registered on Ethereum together with the account's Aztec address and keys, so anyone who knows a tag can look up the account behind it. Payments to zk.money names from outside zk.money are resolved through ENS by a resolver operator that derives a deposit address for each payment.

### Hosted app and local setup
Most users use the hosted web wallet at zk.money. Its code is loaded from zk.money on every visit, and the user's passkey only works on zk.money web pages. Whoever controls the zk.money domain or its web deployment can therefore serve code that reads all of a user's keys except the spending key and gets any operation signed, since the passkey prompt does not show what is being signed. By default the web wallet also uses the Aztec node and Ethereum RPC run by zk.money.

zk.money Desktop serves the same wallet from the user's own computer. Built from inspected source, started from the contract list baked into the release and pointed at the user's own Aztec node and Ethereum RPC, it removes the code and the services of the hosted setup: the code cannot change underneath the user, and apart from the enclave no zk.money service sees their requests. Without the baked contract list, the app loads its contract addresses from zk.money on every start, and that list is not signed. The passkey still belongs to zk.money, so signing in on any zk.money web page hands that page the keys again, and the user trusts their passkey provider, device and browser to keep the passkey and the cached keys safe. The protocol risks stay the same in both setups: the enclave sees every operation and must sign every exit, and the resolver operator can link deposits to their recipients.
