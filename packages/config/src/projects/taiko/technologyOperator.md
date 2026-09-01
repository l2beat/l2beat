The system uses a whitelist-based sequencing mechanism to allow for fast preconfirmations on the L2. On the L1, batch proposing is permissioned through the `PreconfWhitelist` contract, which currently has {{whitelistedOperatorsCount}} active operators registered.
For each epoch, `PreconfWhitelist` selects a single active operator that can propose to MainnetInbox. There is no fallback proposer path, and non-selected operators cannot propose for the current epoch.
Proving is controlled separately by `ProverWhitelist`, which currently has {{whitelistedProverCount}} whitelisted prover{{proverPlural}}.
While the prover whitelist is non-empty, non-whitelisted actors cannot submit proofs. MainnetInbox currently sets minBond={{minBond}} and livenessBond={{livenessBond}}.
Proving a proposal range requires exactly two proofs and at least one of them must be a ZK proof. Accepted combinations are SGX (Geth or Reth) plus SP1 or RISC0, or SP1 plus RISC0.
