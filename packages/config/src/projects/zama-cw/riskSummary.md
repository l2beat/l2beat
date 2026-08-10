## Funds can be stolen if
1. a malicious upgrade compromises the confidential token contracts or FHEVM contracts with their escrowed underlying tokens.
2. the threshold of the current or any non-destroyed historical Ethereum KMS context attests an inflated unwrap amount, allowing pooled underlying deposited before or after that context existed to be released. Governance can also install a malicious context; {{kmsThreshold}}/{{kmsSignerCount}} describes only the current context.
3. the {{coprocessorThreshold}}/{{coprocessorSignerCount}} coprocessor input verification path accepts invalid encrypted inputs that bypass confidential balance checks.
<br>
## Funds can be lost if
1. an underlying token admin blacklists a confidential token address or otherwise prevents transfers from the contract.
2. a user is blocked by the confidential token owner or by a configured underlying-token denylist before finalization/withdrawal.
3. offchain ciphertext data required by the coprocessor or KMS for encrypted handles becomes unavailable and cannot be reconstructed.
<br>
## Privacy can be lost if
1. enough KMS operators with usable key shares collude or are compromised and decrypt private ciphertext handles. {{kmsThreshold}}/{{kmsSignerCount}} describes only the current verifier context, while retained contexts can have different memberships and thresholds.
2. the offchain coprocessor, wallet, relayer, frontend, or RPC path records enough metadata to link a user to encrypted inputs or transactions.
3. deposits and withdrawals are linked by clear boundary amounts, recipient graph, timing, or address reuse.
