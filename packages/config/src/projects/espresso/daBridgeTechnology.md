## Architecture
The Light Client contract serves as the DA bridge for the Espresso DA solution and is responsible for storing the HotShot consensus state on Ethereum.

When HotShot nodes reach consensus, they sign the updated HotShot state using Schnorr signatures, which indicate agreement with the state of the proposed block. These signatures are stored locally on the DA layer nodes.

A prover retrieves these signatures and generates a SNARK proof, which is sent to the LightClient contract's newFinalizedState function. The LightClient contract verifies this proof using its verifyProof method, which accepts the proof and a set of public inputs, such as the blockHeight and the Merkle root of all sequenced blocks. 

The proof should contain the HotShot state, the stake table information, and the list of Schnorr signatures from the HotShot nodes that formed a quorum and reached consensus on the state, and the new state is accepted only if the proof passes verification.

Currently, attestations are relayed to the Light Client every 12 hours.
