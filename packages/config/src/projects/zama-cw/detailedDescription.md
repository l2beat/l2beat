Zama Confidential Tokens let users hold and send tokens on Ethereum with hidden balances and transfer amounts. A user wraps a token into its confidential version, such as USDC into cUSDC, swaps, lends, pays others with it and unwraps it back. Who pays whom and every wrap and unwrap amount stay public.

Users trust the {{kmsSignerCount}} operators of the key management service (KMS), who share the decryption key. They also trust {{coprocessorSignerCount}} coprocessor operators, Zama for the relayer and app, and two governance multisigs. Any {{kmsKeyThreshold}} KMS operators together can decrypt every amount, and the multisigs can upgrade every contract instantly. Unwraps need {{kmsThreshold}} KMS signatures, so funds leave only while the KMS and the coprocessors run.

![Zama Confidential Tokens architecture](/images/architecture/zama.png#center)

### Architecture

The tokens follow [ERC-7984](https://eips.ethereum.org/EIPS/eip-7984) and use fully homomorphic encryption (FHE), which lets contracts compute on encrypted amounts. One FHE key pair protects every balance and amount. Wallets encrypt with its public key, and the coprocessors compute on the ciphertexts without decrypting them. The KMS operators hold the secret key in shares and decrypt on request.

### Flow

1. **Wrap.** You deposit a token into its confidential wrapper, such as USDC into cUSDC. Your address and the amount are public.
2. **Transfer.** Your wallet encrypts the amount, and the coprocessors update both balances without decrypting them. Sender and recipient are public.
3. **Unwrap.** The wrapper asks the KMS to decrypt the amount, and the tokens are paid out once enough operators sign it. The amount is public.

### App

Before every write, the app checks the address with Zama's screening service, which refuses fresh addresses. A client built on Zama's open SDK needs a Zama [API key](https://docs.zama.org/protocol/sdk/guides/relayer-api-keys) or a [self-run relayer](https://github.com/zama-ai/fhevm/blob/4bf50a083e65f0a53997292ca5848010faf98b79/relayer/docs/SELF_HOSTING.md). The vault deposit form shares the user's vault balance with Merkl for extra rewards, [on by default, opt-out available](https://www.zama.org/post/confidential-rewards-with-merkl-are-now-available-to-claim).

### Yield vaults

Vault deposits are batched. You join the open batch with an encrypted amount. After about {{minBatchAgeHours}} hours the batch total is unwrapped publicly, deposited into the Morpho vault and the shares wrapped back. Each depositor claims an encrypted share. The app also joins other vaults' batches with encrypted zero amounts as decoys to hide which vault the user actually joined.

### Swaps

A swap is a sealed-bid auction on ConfidentialSwap. It locks the user's tokens in the swap contract's escrow until it settles or is reclaimed. Approved market makers quote every order, including decoys. The winner is public, sees the real order and has to settle it within a time window.

### KMS

The [KMS operators](https://docs.zama.org/protocol/protocol-apps/addresses/mainnet/ethereum#operator-staking) are Zama, Dfns, Figment, Fireblocks, InfStones, Unit410, LayerZero, Ledger, Omakase, Stake Capital, OpenZeppelin, Etherscan and Conduit. Each holds a share of the FHE secret key and a key that signs results for Ethereum. They decrypt an amount only for accounts that the ACL, an onchain access list, allows. [Zama states](https://docs.zama.org/protocol/protocol/overview/kms) that they run in AWS Nitro enclaves, but Ethereum checks only their signatures. Removing an operator onchain leaves its key share intact.

### Coprocessors

[Artifact, Blockscape, Luganodes, P2P and Zama](https://github.com/zama-ai/protocol-registry/blob/944485d168957ae5857e675281eec0329c7fb9ff/mainnet.md#operator-staking) run the coprocessors, which compute on ciphertexts and check every encrypted input. Ethereum accepts an input signed by {{coprocessorThreshold}} of {{coprocessorSignerCount}} of them, so they are trusted for validity. Zama stores all ciphertexts in a [public bucket](https://coprocessor-1.mainnet.zama.org/). The Zama Gateway, an L3 on Arbitrum, relays decryption requests and publishes who reads which balance and when.

### Compliance

Each token's owner, controlled by the multisigs, can block users and check them against the underlying token's denylist, as cUSDC does with USDC's blacklist. It can also appoint a pauser that halts the token, and observers that decrypt all of its balances and amounts. Today no token has a pauser or an observer. ConfidentialSwap has its own compliance address, set at deployment. Issuers of underlying tokens like USDC can freeze a token's whole escrow.

### Fees

Users pay Ethereum gas. The Gateway charges {{inputPrice}} ZAMA per encrypted input and {{decryptionPrice}} ZAMA per decryption, paid by the relayer.
