Zcash via NEAR Intents touches three blockchains, but can be abstracted as a privacy pool with Ethereum as its base: Ethereum assets are bridged to the NEAR Intents ledger, swapped into ZEC and paid out into Zcash's shielded pool, where the actual privacy lives. To come back, the ZEC is sent to a fresh NEAR Intents deposit address, swapped and withdrawn to any Ethereum address. The reference client is [Zodl](https://zodl.com) (formerly Zashi), the Electric Coin Company's self-custodial wallet, which embeds the NEAR Intents swap directly and pays out into shielded addresses.

### Flow

1. **Ethereum to NEAR Intents.** Each swap quote from the 1Click API comes with a fresh Ethereum deposit EOA. The user sends ETH or an ERC-20 there. The operator's so-called Proof-of-Authority (PoA) bridge, in practice a custodial bridge with a single admin key, sweeps the funds into its treasury account [`0x2CfF…2680`](https://etherscan.io/address/0x2CfF890f0378a11913B6129B2E97417a2c302680), also an EOA, and mints a wrapped token (`eth.omft.near` or `eth-0x…omft.near`) on NEAR. There is no multisig or onchain verification on either side. The mint memo names the Ethereum transaction hash.
2. **Swap to ZEC.** Market makers quote off-chain through a relay run by the operator. The winning quote settles atomically in the Verifier contract [`intents.near`](https://nearblocks.io/address/intents.near). Every balance and swap is public state on the NEAR blockchain.
3. **Withdraw into Zcash.** The wrapped ZEC (`zec.omft.near`) is burned through the Zcash connector `zcash-connector.bridge.near`, which builds a transaction from bridge UTXOs and has it signed by NEAR's MPC network (`v1.signer`, 9/15 signers). The payout can be a shielded Orchard output into the Ironwood pool. Zodl requests a fresh shielded address for every swap. The recipient address is published in the burn message on NEAR.
4. **Inside Zcash.** The ZEC now sits in the shielded pool. Transfers inside the pool hide sender, recipient and amount.
5. **Back to Ethereum.** The user sends ZEC from the pool to a fresh bridge deposit address, a transparent address derived by the connector from the quote. A whitelisted relayer proves the deposit against the Zcash light client `zcash-client.bridge.near` on NEAR, wrapped ZEC is minted and swapped, and the custodial bridge operator pays the Ethereum recipient from its treasury.

### Privacy considerations

Nothing on Ethereum or NEAR is hidden: the Ethereum sender, asset and amount, the swap, the Zcash payout address and the Zcash amount are all public, and the same holds for the return leg. The only privacy the route offers is that the shielded pool breaks the link between the ZEC paid out in step 3 and the ZEC deposited in step 5. The connector requires every shielded payout to be encrypted with an all-zero outgoing viewing key so that the contract can check it, which means anyone can decrypt the paid address and amount of every NEAR Intents payout. And the amounts that enter and leave the pool are public, so a round trip of similar size within a short time is linkable by the well-known Zcash round-trip heuristic.

The Zcash side of the flow is only as private as the wallet. Zodl syncs through public lightwalletd servers and offers Tor as an opt-in setting. The 1Click API sees the IP address and both addresses of every leg.

### Custody and control

The Ethereum leg is fully custodial: the treasury and deposit addresses are EOAs controlled by the operator, and a single key (`bridge-mng.near`) mints the wrapped tokens. Deposits and withdrawals on the Ethereum side are executed by off-chain services. The Verifier lets two single-key accounts and the DAO freeze any account's balance, which the operator uses for compliance holds. On Zcash, funds are held by MPC-derived addresses, deposits are verified against an on-chain light client, and an unverified deposit can be refunded permissionlessly after a two-day timelock. Normal withdrawals still need a whitelisted relayer to trigger the MPC signature.

### Fees

The Verifier charges 1 pip (0.0001%) per swap. The 1Click API adds 0.25% (25 bps) for unauthenticated integrators and 0.20% (20 bps) for authenticated ones such as wallets, which may add their own fee on top. Each leg also carries a bridge withdrawal fee, currently 0.000035 ETH on Ethereum and 0.00032 ZEC on Zcash.

### Compliance

Intents Technology Ltd. (British Virgin Islands) screens every quote against the NEAR Intents AML portal, Binance AML, AMLBot, PureFi and TRM Labs. Its terms allow it to delay, block or freeze bridged funds, collect IP and wallet addresses, and geoblock a list of jurisdictions. Market makers must pass KYB. No KYC is asked of end users, but funds have been held for weeks during compliance reviews, and swaps were paused network-wide after the Rhea Finance exploit in April 2026.

### Anonymity set

The anonymity set is the Zcash Ironwood shielded pool. Because payout and deposit amounts are public at the pool edge, the effective set behind a user's exit is the set of pool entries (public on NEAR) that could match it in amount and time, not the whole pool.
