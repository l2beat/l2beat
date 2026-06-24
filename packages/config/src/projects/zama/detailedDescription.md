Zama is an account-based confidential token wrapper system on Ethereum. Users deposit regular ERC-20 tokens into asset-specific wrappers and receive confidential wrapper tokens whose balances and internal transfer amounts are represented as encrypted FHE handles.

The wrapper is not a note-based mixer: EVM sender and receiver addresses remain public. The privacy goal is to hide balances and transfer amounts while keeping account-level attribution and compliance controls.

### Architecture

Zama uses fully homomorphic encryption (FHE) to let contracts operate on encrypted values. Each confidential wrapper stores balances as encrypted handles instead of plaintext balances, and calls the FHEVM system contracts when it needs encrypted arithmetic, comparisons, transfers, minting, or burning.

The ACL is the onchain access-control registry for encrypted handles. It records which accounts or contracts are allowed to use a ciphertext handle, which prevents arbitrary users from reusing encrypted values they do not control.

The FHE coprocessor is an offchain service that performs FHE-related work the EVM cannot execute directly. Encrypted user inputs are accepted onchain only after the InputVerifier checks signatures from the coprocessor signer set. This is not a Tornado-style zk note-spend proof: the wrappers primarily rely on FHE, ACL checks, and signed offchain FHE service outputs.

The KMS is the threshold key-management system used for public decryptions. For example, an unwrap burns an encrypted confidential-token amount and asks for that amount to be publicly decrypted; finalization is accepted only after the KMSVerifier checks enough KMS signatures over the decrypted result.

### Privacy considerations

Deposits and withdrawals are public privacy boundaries. A `wrap` emits the confidential-token recipient and the rounded clear underlying-token amount, while the underlying ERC-20 transfer exposes the depositor and wrapper address. The recipient can be different from the depositor, but that relationship is still visible in the wrapper event.

Within a confidential wrapper token, holders can make confidential transfers between visible EVM addresses. These transfers reveal the parties and encrypted ciphertext handles, but not the clear amount or resulting balances. Withdrawals are two-step: an unwrap request burns an encrypted amount and asks the KMS to make it publicly decryptable, then finalization emits the withdrawal receiver and clear amount before transferring the underlying token out.

The smart contracts do not recompute FHE offchain work themselves. Encrypted user inputs are accepted through the InputVerifier, which requires {{coprocessorThreshold}}/{{coprocessorSignerCount}} coprocessor signatures. Public decryptions are accepted through the KMSVerifier, which requires {{kmsThreshold}}/{{kmsSignerCount}} KMS signatures. Ethereum verifies the signatures and contract state transitions; privacy and correctness additionally depend on those offchain services.

Practical privacy also depends on timing, amounts, address reuse, wallet/RPC providers, and any frontend or service used to create encrypted inputs. Users are advised to research [OPSEC best practice](/publications/privacy-best-practices).

### Fees

No wrapper-level protocol fee was found in the reviewed wrappers. Users still pay Ethereum gas and may pay costs charged by external wallets, relayers, or services used to create or submit transactions.

### Compliance

Compliance is enforced in each wrapper. The owner can block and unblock local users, and wrappers can be configured to call an underlying-token denylist function. These checks apply to direct deposits, ERC-1363 callback deposits, confidential transfers, unwrap requests, and unwrap finalization.

Because confidential wrapper tokens are backed by underlying tokens held in wrapper addresses, issuer or token-admin controls over those underlyings remain a dependency. If an underlying token admin blocks a wrapper address, the escrowed token can become stuck. If a user address is blocked by an underlying token and the wrapper has a transitive denylist hook configured, that address can be prevented from depositing, transferring, or completing withdrawals.

### Anonymity set

Zama does not use fixed-denomination notes. The relevant set for confidential activity is the set of visible accounts that hold or transact a given confidential wrapper token, with amounts hidden by FHE. Boundary activity is more linkable because deposits and finalized withdrawals expose clear amounts and endpoint addresses. Each wrapper is a single pool of collateral for its underlying token, but it is not a single note pool that hides senders and recipients.
