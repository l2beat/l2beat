### Enforcement

Each relayed spend [sends the relayer](https://unpkg.com/@hinkal/common@0.4.1/common/src/functions/pre-transaction/buildCommitmentValidationData.mjs) the commitments, amounts and nullifiers of its notes. The extension tells a refused user that the funds "have been flagged as sanctioned". The relayers see which notes every relayed transaction spends, so a flag can follow funds through private sends to a payee. Hinkal's documentation describes a zero-knowledge screening proof that the contract verifies. The [published circuits](https://github.com/Hinkal-Protocol/Hinkal-Contracts-Circuits/blob/61b6839aa80fc0c33bfdcde0323753c83cb2ce67/circuits/MainEVMCircuit.circom) have no such input, so the rule lives at the relayers. Its [documentation](https://hinkal-team.gitbook.io/hinkal/hinkal-compliance-gateway/how-it-works) promises flagged funds a public withdrawal to the depositing address, which is the relayers' choice. A deposit sent straight to the contract meets no check before its first relayed spend. Screening is by address, and Hinkal asks for no identity.

### Voluntary disclosure

The CSV lists date, type, tokens and transaction hash of each transaction. A reader can look up each hash, but nothing proves that the account made the transaction. Hinkal's documentation names viewing keys for auditors, which the extension does not export.
