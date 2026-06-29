Zama CW is an account-based confidential token wrapper system on Ethereum, using the Zama FHE protocol. It is based on [ERC-7984](https://eips.ethereum.org/EIPS/eip-7984). Users deposit regular ERC-20 tokens into asset-specific wrapper escrows and receive confidential wrapper tokens whose balances and internal transfer amounts are represented as encrypted handles.

'Confidential' here means `from:` and `to:` addresses and transfer timestamps always remain public. Only balances and transfer amounts are hidden.

![Zama CW pool architecture](/images/architecture/zama-pool.png#center)

### Architecture

The Zama FHE protocol uses fully homomorphic encryption to let smart contracts operate on encrypted values. Balances are stored as encrypted handles instead of plaintext balances, and FHEVM system contracts are called for encrypted arithmetic, comparisons, transfers, minting, or burning, but most of the actual FHE execution happens offchain.

The FHE coprocessor is an offchain service that performs FHE-related work the EVM cannot execute directly. Encrypted user inputs are accepted onchain only after the InputVerifier checks signatures from the coprocessor signer set (currently {{coprocessorThreshold}}/{{coprocessorSignerCount}}). The coprocessor is constrained on what it can commit onchain by the smart contract, but it is not trustless and can affect validity if compromised.

The ACL is the onchain access-control registry for encrypted handles. It records which accounts or contracts are allowed to use a ciphertext handle, which prevents arbitrary users from reusing encrypted values they do not control.

The (T)KMS is the threshold key-management service used for public decryptions. It holds the FHE secret key and functions like a multisig with a threshold ({{kmsThreshold}}/{{kmsSignerCount}}). An unwrap for example burns an encrypted confidential-token amount and asks for that amount to be publicly decrypted; finalization is accepted only after the KMSVerifier checks enough KMS signatures over the threshold-decrypted result. The KMS Signers are operated by [Zama, Dfns, Figment, Fireblocks, InfStones, Unit410, LayerZero, Ledger, Omakase, Stake Capital, OpenZeppelin, Etherscan, and Conduit](https://docs.zama.org/protocol/protocol-apps/addresses/mainnet/ethereum#operator-staking).

There are many moving parts and offchain components in the Zama FHE protocol on which the confidential wrappers are built. The Zama Gateway, an L3 on Arbitrum, is currently used to gather signatures and make data available but the authority for asset storage and signature verification remains Ethereum L1.

### Privacy considerations

Deposits and withdrawals are public privacy boundaries. A `wrap` emits the confidential-token recipient and the rounded clear underlying-token amount. The recipient can be different from the depositor, but that relationship is still visible in the wrapper event. Withdrawals then reveil the recipient and amount.

Within a confidential wrapper token, holders can make confidential transfers between transparent EVM addresses. These transfers reveal the parties and encrypted ciphertext handles, but not the clear amount or resulting balances. The confidential balances and transfer amounts of users can be decrypted by {{coprocessorThreshold}}/{{coprocessorSignerCount}} KMS signers, including retroactively.

The smart contracts do not fully validate FHE offchain work, which makes the KMS and coprocessor each trusted for security, privacy and liveness. Encrypted user inputs are accepted through the InputVerifier, which requires {{coprocessorThreshold}}/{{coprocessorSignerCount}} coprocessor signatures. Public decryptions are accepted through the KMSVerifier, which requires {{kmsThreshold}}/{{kmsSignerCount}} KMS signatures. Decentralization of the critical offchain services is announced in the docs but not implemented onchain (e.g. coprocessors, fraud proofs, slashing, zk proofs).

Practical privacy also depends on timing, amounts, address reuse, wallet/RPC providers, and any frontend or service used to create encrypted inputs. Users are advised to research [OPSEC best practice](/publications/privacy-best-practices).

### Fees

There currently is no protocol fee. Users still pay Ethereum gas for each action, including the ones inside the pool, and may pay costs charged by external wallets, relayers, or services used to create or submit transactions.

### Compliance

Compliance is enforced in each wrapper. The owner can block and unblock local users, and wrappers can be configured to call an underlying-token denylist function. These checks apply to direct deposits, ERC-1363 callback deposits, confidential transfers, unwrap requests, and unwrap finalization.

Because confidential wrapper tokens are backed by underlying tokens held in wrapper addresses, issuer or token-admin controls over those underlyings remain a dependency. If an underlying token admin blocks a wrapper address, the escrowed token can become stuck. If a user address is blocked by an underlying token and the wrapper has a transitive denylist hook configured, that address can be prevented from depositing, transferring, or completing withdrawals.

### Anonymity set

Zama CW does not use fixed-denomination notes. For a given finalized withdrawal, the set of prior deposits that could have funded the withdrawing account through the public address graph is it's effective anonymity set: deposits credited to the same address, or to addresses that visibly transferred confidential tokens to it before the withdrawal. Amounts are encrypted inside the wrapper, so links within the remaining candidate set can remain ambiguous, but deposits and finalized withdrawals still expose clear boundary amounts and endpoint addresses.

As mentioned in 'Privacy Considerations', the mostly centralized offchain services that cannot be circumvented can corrupt practical privacy, independent of the abstract measurable anonymity set.
