## Funds can be stolen if
1. a malicious upgrade compromises the confidential token contracts or FHEVM contracts with their escrowed underlying tokens.
2. {{kmsThreshold}}/{{kmsSignerCount}} KMS signers attest to an incorrect public decryption during unwrap finalization, allowing more underlying tokens to be released than were burned.
3. the {{coprocessorThreshold}}/{{coprocessorSignerCount}} coprocessor input verification path accepts invalid encrypted inputs that bypass confidential balance checks.
<br>
## Funds can be lost if
1. an underlying token admin blacklists a confidential token address or otherwise prevents transfers from the contract.
2. a user is blocked by the confidential token owner or by a configured underlying-token denylist before finalization/withdrawal.
3. offchain ciphertext data required by the coprocessor or KMS for encrypted handles becomes unavailable and cannot be reconstructed.
<br>
## Privacy can be lost if
1. {{kmsThreshold}}/{{kmsSignerCount}} KMS signers collude or are compromised and decrypt private ciphertext handles.
2. the offchain coprocessor, wallet, relayer, frontend, or RPC path records enough metadata to link a user to encrypted inputs or transactions.
3. deposits and withdrawals are linked by clear boundary amounts, recipient graph, timing, or address reuse.
