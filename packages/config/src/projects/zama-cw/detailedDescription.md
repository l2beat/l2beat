Zama Confidential Tokens let users hold and send tokens on Ethereum with hidden balances and transfer amounts. A user wraps a token into its confidential version, such as USDC into cUSDC, pays others with it and unwraps it back. Who pays whom and every wrap and unwrap amount stay public.

Users trust the {{kmsSignerCount}} operators of the key management service (KMS), who share the decryption key, Zama for the coprocessor, relayer and app, and two governance multisigs. Any {{kmsKeyThreshold}} KMS operators together can decrypt every amount, and the multisigs can upgrade every contract instantly. Each unwrap needs a decryption signed by {{kmsThreshold}} of them, so funds leave only while the KMS and the coprocessor run.

![Zama Confidential Tokens architecture](/images/architecture/zama.png#center)

### Encryption

The tokens follow [ERC-7984](https://eips.ethereum.org/EIPS/eip-7984) and use fully homomorphic encryption (FHE), which lets contracts compute on encrypted amounts. One FHE key pair protects every balance and amount. Wallets encrypt with its public key, Zama's coprocessor computes on the ciphertexts without decrypting them, and the KMS operators hold the secret key in shares and decrypt on request.

The [KMS operators](https://docs.zama.org/protocol/protocol-apps/addresses/mainnet/ethereum#operator-staking) are Zama, Dfns, Figment, Fireblocks, InfStones, Unit410, LayerZero, Ledger, Omakase, Stake Capital, OpenZeppelin, Etherscan and Conduit. Each holds two keys: a share of the FHE secret key, which decrypts, and an ECDSA key, which signs the result for Ethereum. They decrypt an amount only for accounts that the ACL, an onchain access list, allows them to read. [Zama states](https://docs.zama.org/protocol/protocol/overview/kms) that they run in AWS Nitro enclaves, and Ethereum checks only their signatures. Governance multisigs manage signer sets in ProtocolConfig: they can add sets, retune their thresholds and destroy old ones. Removing an operator onchain leaves its key share intact.

Zama's coprocessor runs the FHE computation offchain and checks every encrypted input. Ethereum accepts an input signed by {{coprocessorThreshold}} of {{coprocessorSignerCount}} coprocessor signers, so the coprocessor is trusted for validity. Priority mode is {{priorityCoprocessorMode}}: while on, one coprocessor finalizes inputs and ciphertext commits alone, whatever the signer set. It stores all ciphertexts in a [public bucket](https://coprocessor-1.mainnet.zama.org/). The Zama Gateway, an L3 on Arbitrum, relays decryption requests and publishes who reads which balance and when. Ethereum verifies the KMS signatures itself, while inputs and unwraps depend on the Gateway running.

### Privacy considerations

The privacy ratings assume [Zama's app](https://app.zama.org), the official interface. Its source is unpublished. Apps reach the protocol through a relayer, and Zama's relayer [requires an API key](https://docs.zama.org/protocol/sdk/guides/relayer-api-keys) on mainnet. It receives each encrypted input and balance read together with the user's address and IP and the token. Practical privacy also depends on the timing and amounts of wraps and unwraps, see [OPSEC best practice](/publications/privacy-best-practices).

### Compliance

Each token's owner, controlled by the multisigs, can block users and check them against the underlying token's denylist, as cUSDC does with USDC's blacklist. It can also appoint a pauser that halts the token, and observers that decrypt all of its balances and amounts. Today no token has a pauser or an observer. Issuers of underlying tokens like USDC can freeze a token's whole escrow.

### Fees

Users pay Ethereum gas. The Gateway charges {{inputPrice}} ZAMA per encrypted input and {{decryptionPrice}} ZAMA per decryption, paid by the relayer. Zama's relayer bills apps monthly.
