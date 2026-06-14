The system uses a whitelist-based sequencing mechanism to allow for fast preconfirmations on the L2. On the L1, whitelisted preconfirmers can propose Taiko L2 data to the MainnetInbox contract.
The whitelist is managed by the `PreconfWhitelist` contract, which currently has {{whitelistedOperatorsCount}} active operators registered.
Forced inclusions become mandatory after {{forcedInclusionDelay}} and proposing becomes permissionless after {{forcedInclusionPermissionlessDelay}} if the queue is still ignored.
Proving is controlled separately by `ProverWhitelist`, which currently has {{whitelistedProverCount}} whitelisted prover{{proverPlural}}.
Non-whitelisted actors must wait {{permissionlessProvingDelay}} after an unproven proposal before the whitelist is dropped. MainnetInbox currently sets minBond={{minBond}} and livenessBond={{livenessBond}}.
Currently, proving a proposal requires SGX (Geth), plus either SGX (Reth), SP1, or RISC0.
