Zodl, a Zcash wallet, lets users move funds from one Ethereum address to a new one through Zcash's shielded pool, which hides the path. Its swap screen uses NEAR Intents to turn Ethereum assets into shielded ZEC and, later, ZEC back into Ethereum assets. Both Ethereum transfers and every swap on NEAR are public.

Users trust the NEAR Intents operator, which holds the Ethereum funds in a custodial bridge, screens every swap and can freeze balances. Two NEAR multisigs upgrade the contracts instantly, and NEAR's MPC network signs every Zcash payout. Leaving needs the operator, which runs the Ethereum side of every swap.

### Flow

1. **Ethereum to NEAR Intents.** Each quote from the operator's 1Click API comes with a fresh Ethereum deposit address. The user sends ETH or an ERC-20 there. The operator's custodial bridge, named Proof-of-Authority (PoA), sweeps the funds into its treasury [`0x2CfF…2680`](https://etherscan.io/address/0x2CfF890f0378a11913B6129B2E97417a2c302680). It then mints a wrapped token on NEAR whose memo names the Ethereum transaction hash.
2. **Swap to ZEC.** Market makers quote offchain through a relay the operator runs. The winning quote settles in the Verifier contract [`intents.near`](https://nearblocks.io/address/intents.near), whose balances and swaps are public NEAR state.
3. **Withdraw into Zcash.** The wrapped ZEC is burned through the Zcash connector `zcash-connector.bridge.near`, which builds a transaction from bridge funds and has NEAR's MPC network sign it. The payout goes to a shielded address that Zodl creates for every swap, and the burn message publishes it.
4. **Inside Zcash.** The ZEC sits in the shielded pool, where transfers hide sender, recipient and amount.
5. **Back to Ethereum.** Zodl pays ZEC from the pool to a fresh transparent deposit address of the connector. A relayer proves the deposit to the Zcash light client `zcash-client.bridge.near`, and the wrapped ZEC is minted and swapped. The operator then pays the Ethereum address from its treasury.

### Privacy considerations

Every amount that enters or leaves the shielded pool is public. The connector requires each payout to be encrypted with an all-zero outgoing viewing key so that it can check the payout. Anyone can therefore decrypt the address and amount of every payout, and a round trip of similar size within a short time pairs up.

The ratings assume [Zodl](https://zodl.com), formerly Zashi, with its built-in Tor on. Zodl syncs from public lightwalletd servers, which serve the Zcash chain to light wallets, zec.rocks by default. Tor carries swap requests, payout fetches and transactions, each on its own circuit. Block sync and lookups of the account's transparent addresses stay direct, so the server can tie the isolated requests to the account by timing. Other wallets may leak more: the NEAR Intents web app pays only transparent Zcash addresses, which adds a public shielding step.

### Custody

The Ethereum leg is custodial. The operator's deposit and treasury addresses are EOAs, and the operator mints the wrapped tokens on NEAR. The Verifier lets the NEAR Intents multisig and one single-key account freeze any account, which the operator uses for compliance holds. On Zcash, the connector holds funds at MPC-derived addresses and checks deposits against the light client. Relayers post Zcash block headers, credit deposits and request withdrawals. Anyone can become one by staking 1,000 NEAR and waiting seven days, unless the Rainbow Bridge multisig rejects them. The roles are listed under [upgrades and governance](#upgrades-and-governance).

### Fees

The Verifier charges 1 pip (0.0001%) per swap. Zodl adds a 0.67% app fee to each quote, which it [shares with the 1Click API](https://docs.near-intents.org/resources/fees). Each leg also pays a bridge withdrawal fee, 0.000035 ETH on Ethereum and 0.00047 ZEC on Zcash on 2026-10-08.

### Compliance

Intents Technology Ltd. (British Virgin Islands) screens every quote against the NEAR Intents AML portal, Binance AML, AMLBot, PureFi and TRM Labs. Its [terms](https://docs.near-intents.org/security-compliance/terms-of-service) let it delay, block or freeze bridged funds and collect IP and wallet addresses. Market makers pass KYB, end users swap without an account.
