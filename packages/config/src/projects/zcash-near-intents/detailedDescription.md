Vizor, a Zcash wallet, lets users move funds from one Ethereum address to a new one through Zcash's shielded pool, which hides the path. Its swap screen uses NEAR Intents to turn Ethereum assets into shielded ZEC and, later, ZEC back into Ethereum assets. Both Ethereum transfers and every swap on NEAR are public.

Users trust the NEAR Intents operator, which holds the Ethereum funds in a custodial bridge, screens every swap and can freeze balances. Two NEAR multisigs upgrade the contracts instantly, and NEAR's MPC network signs every Zcash payout. Leaving needs the operator, which runs the Ethereum side of every swap.

### Flow

1. **Ethereum to NEAR Intents.** Each quote from the operator's 1Click API comes with a fresh Ethereum deposit address. The user sends ETH or an ERC-20 there. The operator's custodial bridge, named Proof-of-Authority (PoA), sweeps the funds into its treasury [`0x2CfF…2680`](https://etherscan.io/address/0x2CfF890f0378a11913B6129B2E97417a2c302680). It then mints a wrapped token on NEAR whose memo names the Ethereum transaction hash.
2. **Swap to ZEC.** Market makers quote offchain through a relay the operator runs. The winning quote settles in the Verifier contract [`intents.near`](https://nearblocks.io/address/intents.near), whose balances and swaps are public NEAR state.
3. **Withdraw into Zcash.** The wrapped ZEC is burned through the Zcash connector `zcash-connector.bridge.near`. The connector builds a transaction from bridge funds and has NEAR's MPC network sign it. The payout goes to a shielded address that Vizor creates for every swap, and the burn message publishes it. The connector requires an all-zero outgoing viewing key so that it can check the payout, so anyone can decrypt its address and amount.
4. **Inside Zcash.** The ZEC sits in the shielded pool, where transfers hide sender, recipient and amount. Every amount that enters or leaves the pool is public, so a round trip of similar size within a short time pairs up.
5. **Back to Ethereum.** Vizor pays ZEC from the pool to a fresh transparent deposit address of the connector. A relayer proves the deposit to the Zcash light client `zcash-client.bridge.near`, and the wrapped ZEC is minted and swapped. The operator then pays the Ethereum address from its treasury.

### App

The ratings cover Vizor's Linux desktop release 0.0.64 with Tor and Private queries on, both off by default. Private queries, marked experimental, send the account's transparent lookups and transaction fetches to Valar Group's private information retrieval (PIR) servers. Lightwalletd, by default zec.rocks, serves blocks and broadcasts. With Tor on, every connection goes over Tor, each PIR request and 1Click call on its own circuit. Swap quotes, deposits and status checks pass Vizor's server, which adds Vizor's referral and fee. Vizor's mobile builds have no published source pin.

### Custody

The Ethereum leg is custodial. The operator's deposit and treasury addresses are EOAs, and the operator mints the wrapped tokens on NEAR. The Verifier lets the NEAR Intents multisig and one single-key account freeze any account, which the operator uses for compliance holds. On Zcash, the connector holds funds at MPC-derived addresses and checks deposits against the light client. Relayers post Zcash block headers, credit deposits and request withdrawals. Anyone can become one by staking 1,000 NEAR and waiting seven days, unless the Rainbow Bridge multisig rejects them. The roles are listed under [upgrades and governance](#upgrades-and-governance).

### Fees

The Verifier charges 1 pip (0.0001%) per swap. Vizor's server adds a 0.67% app fee to each quote, which Vizor [shares with the 1Click API](https://docs.near-intents.org/resources/fees). Each leg also pays a bridge withdrawal fee, 0.000035 ETH on Ethereum and 0.00047 ZEC on Zcash on 2026-10-08.
