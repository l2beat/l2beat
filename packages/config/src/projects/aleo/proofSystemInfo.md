## Description

Aleo is a proof-of-stake blockchain whose programs run as zero-knowledge circuits. Every transaction carries a [Varuna](https://github.com/ProvableHQ/snarkVM/tree/c2909c55efb0c2202e7471e3e2efd73de1c4a468/algorithms/src/snark/varuna) proof, and every validator and client verifies it. Varuna is Provable's variant of Marlin, a universal SNARK with KZG commitments over BLS12-377.

There is no verifier contract on Ethereum. Bridges from Aleo rely on offchain attesters that read the chain.

## Proof system

snarkVM compiles each Aleo program into one circuit per function and derives its proving and verifying keys from one universal structured reference string (SRS). Proofs run in hiding mode, so they reveal nothing beyond their public inputs. Fiat-Shamir challenges come from a Poseidon sponge.

## Trusted setup

The SRS holds powers of a secret β in G1 up to 2^28 and hiding terms with a second secret γ. It also holds negative powers of β in G2 at each degree bound. The [Aleo Setup I](https://github.com/AleoNet/aleo-setup) phase 1 has a Marlin mode that outputs exactly these elements: its [degree-bound inverse powers](https://github.com/AleoNet/aleo-setup/blob/804ee2a387f19b87d22719e232276a9c4c0fc017/phase1/src/computation.rs#L187-L206) match the [SRS layout](https://github.com/ProvableHQ/snarkVM/blob/c2909c55efb0c2202e7471e3e2efd73de1c4a468/parameters/src/mainnet/powers.rs) snarkVM loads. Aleo has published no transcript of the ceremony, so the SRS files cannot be matched to its final contribution.

## Incident

Until May 2026, the batched commitment check did not absorb the opening proofs before drawing its random weights. Anyone could forge proofs and spend from any known address. [Veria Labs](https://verialabs.com/blog/forging-transactions-on-aleo/) reported it on April 30, and validators ran the fix from May 3, 2026. Aleo states that no transaction exploited it.
