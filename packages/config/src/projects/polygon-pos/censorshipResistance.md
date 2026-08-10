The validator set (on Polygon PoS, validators are both proposers and sequencers) is closed and capped, but includes a diverse set of known entities who share block production rights. There are no specific censorship resistance gadgets built into the protocol.
### Selective censorship
As long as the Polygon PoS blockchain is producing blocks, users can expect to include their transactions due to the rotating, diverse block producers, even if they are censored by some of them. Unfortunately, the rotation is very slow (see *span* time) and even just a few entities censoring can cause long inclusion delays.
### Blanket censorship
Validators holding more than 1/3 of Polygon PoS stake among them can censor users if they actively refuse to attest to blocks with their transactions. Polygon Multisig controls the core smart contracts on Ethereum and can administer the validator set (including malicious changes) as a consequence.
### Walkaway
If validators holding more than 1/3 of the stake on Polygon PoS stop block production, the chain stops and there is no way for users to include any transactions. As the validator set is currently closed by a permissioned smart contract setting on ethereum, walkaway of the permissioned actor would require social coordination and a hard fork to progress the chain.
