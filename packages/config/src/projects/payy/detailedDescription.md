Payy is a payments-focused ZK network, designed around private stablecoin transfers. Ethereum receives only state roots and the public deposit and withdrawal messages of each state update. Balances live offchain as UTXO-style notes whose commitments form a sparse Merkle tree maintained by the Payy validators. 

### Privacy considerations

To spend notes, the user's client generates a [Noir](https://noir-lang.org/) `utxo` proof that demonstrates ownership of the input notes and conservation of value; the public inputs of that proof are the commitments of the two notes consumed and the two notes created. Transfers therefore hide who paid whom and how much, but they do not hide which commitments were consumed: the deployed circuits do not use nullifiers, and a spend names its input commitments directly, which the node then marks as spent. Anyone with Payy block data can follow the resulting spend graph.

Because only commitments are stored in the tree, a recipient cannot reconstruct a received note from chain data alone: the sender must transmit the note contents out of band. In practice it is done by an encrypted registry operated by Payy, which stores the recipient's public key in the clear and serves each client the entries addressed to it. Thus it learns the delivery metadata even though it cannot read note contents. 

### Fees

The protocol charges no transfer or withdrawal fee.

### Compliance

The deployed protocol enforces no compliance measures and contains no auditor key, view key or other mechanism that could retroactively decrypt past activity. Identity data is collected at the application layer: KYC is required for the Payy card and fiat ramps, but it is not necessary for using Payy L2.

### Anonymity set

Payy hides the contents of each note but not the links between notes, so its anonymity set should not be read as the set of all users. An observer of Payy block data sees a graph of opaque commitments; privacy rests on not knowing which address, asset or amount each node in that graph carries.
