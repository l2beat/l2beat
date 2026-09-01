Privacy Pools is a non-custodial privacy protocol on Ethereum built around asset-specific pools and private withdrawals, adding compliance by whitelisting all legitimate deposits. A deposit creates a commitment, which is represented by secret and nullifier, and a later withdrawal uses a zero-knowledge proof to spend that commitment, either partially or in full, without revealing the matching deposit. Losing the secret and the nullifier would effectively mean losing deposited tokens.

Privacy Pools are controlled by a {{multisigStats}} multisig, which has authority to stop deposits and manage the deposit whitelist, but users always have an option to publicly withdraw deposited tokens, linking their withdrawal to their deposit.

### Privacy considerations

Privacy Pools protocol supports [relayed withdrawals](https://etherscan.io/address/0x15e355024de1cdc74addea7ebdf98418ba5b1a2c#code#F1#L133), in which relayer processes withdrawals on user's behalf for a fee, which enables sending funds to fresh addresses.

Practical privacy also depends on the timing and amounts of deposits and withdrawals, underlying network and browser used to interact with Privacy Pools frontend (if used), RPC providers used to send transactions and query public blockchain state. Users are advised to research [OPSEC best practice](/publications/privacy-best-practices).

### Fees

Privacy Pools charges a mandatory onchain vetting fee on deposits and caps relayed-withdrawal fees per asset:
{{feeSummary}}

The vetting fees are accumulated in the Entrypoint and can be withdrawn by its owner. Relayer fees are paid on withdrawals to the selected relayer and cannot exceed the per-asset cap; relayers can still choose their own quote below that cap and users can self-relay to not pay the fee.

### Compliance

The main feature of Privacy Pools is compliance, which is enforced through the ASP. Association set is a whitelist of deposits that are allowed to be withdrawn from the protocol. This set is managed in real time by the provider, which is currently a single entity. The full association set is published via IPFS, only its Merkle root is posted onchain. User's deposit could be excluded from the whitelist at any moment, in this case the user can still ragequit, i.e. publicly withdraw deposited funds and link them to their deposit.

ASP is designed to vouch that withdrawals from Privacy Pools are not related to any known illegal activity.

### Anonymity set

The anonymity set consists of all whitelisted deposits of the same token with the value greater than the withdrawal amount. Note that only deposits approved by the ASP add to the anonymity set. To maximize the anonymity set, users are recommended to withdraw smaller amounts and deposit popular tokens.
