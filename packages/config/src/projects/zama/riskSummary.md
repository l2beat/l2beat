## Funds can be stolen if
1. a malicious or compromised governance path upgrades the wrapper or FHEVM contracts to code that transfers pooled underlying tokens incorrectly.
2. {{kmsThreshold}}/{{kmsSignerCount}} KMS signers attest to an incorrect public decryption during unwrap finalization, allowing more underlying tokens to be released than were burned.
3. the {{coprocessorThreshold}}/{{coprocessorSignerCount}} coprocessor input verification path accepts invalid encrypted inputs that bypass confidential balance checks.
<br>
## Funds can be lost if
1. an underlying token admin blacklists a wrapper address or otherwise prevents transfers from the wrapper.
2. a user is blocked by the wrapper owner or by a configured underlying-token denylist after an unwrap request but before successful finalization.
3. a user loses access to the EVM account or encrypted-token client state required to spend their confidential-token balance.
<br>
## Privacy can be lost if
1. {{kmsThreshold}}/{{kmsSignerCount}} KMS signers collude or are compromised and decrypt private ciphertext handles.
2. the offchain coprocessor, wallet, relayer, frontend, or RPC path records enough metadata to link a user to encrypted inputs or transactions.
3. deposits and withdrawals are linked by clear boundary amounts, timing, or address reuse.
4. governance upgrades contracts to leak extra plaintext data or weaken ACL/KMS checks.
