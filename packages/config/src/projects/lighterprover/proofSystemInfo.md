## Description

Lighter prover is a zk proving system for Lighter L2 based on [Plonky2](https://github.com/0xPolygonZero/plonky2/tree/main) circuits. It verifies the logic for regular state transition of Lighter L2, as well as state transitions in the “desert mode” when L2 is shut down and users exit, using different sets of circuits. The circuits are proven with a STARK which is wrapped into a Plonk SNARK before settling onchain.

## Proof system

[Plonky2](https://github.com/0xPolygonZero/plonky2) implements a circuit aritmetization based on TurboPlonk over Goldilocks field, but it replaces KZG polynomial commitment scheme with a FRI-based polynomial testing scheme. In this way proving Plonky2 circuits requires no trusted setup, i.e. it is a STARK. 

However Lighter wraps these STARK in a [gnark](https://github.com/Consensys/gnark) implementation of Plonk over BN254 curve, which requires a trusted setup.

### Lighter Circuits

The proof system operates on Lighter STF circuits and desert mode circuits. All published circuits are available [here](https://github.com/elliottech/lighter-prover/tree/main). 

Lighter proof system defines circuits for proving all transactions, including internal, L1 and L2 transactions. The full list of available transactions that define Lighter STF can be seen [here](https://github.com/elliottech/lighter-prover/tree/main/circuit/src/transactions). 

Transaction circuits use custom implementations for arithmetic operations ([bigint](https://github.com/elliottech/lighter-prover/tree/main/circuit/src/bigint), [uint](https://github.com/elliottech/lighter-prover/tree/main/circuit/src/uint)), cryptographic primitives ([ecdsa](https://github.com/elliottech/lighter-prover/tree/main/circuit/src/ecdsa) on the Secp256k1 curve, [eddsa](https://github.com/elliottech/lighter-prover/tree/main/circuit/src/eddsa) on the ECgFp5 curve, [keccak](https://github.com/elliottech/lighter-prover/tree/main/circuit/src/keccak), [poseidon_bn128](https://github.com/elliottech/lighter-prover/tree/main/circuit/src/poseidon_bn128)) and other helper circuits.

### Desert circuits

Lighter also provides [desert exit circuits](https://github.com/elliottech/lighter-prover/tree/main/desertexit) that allow users to permissionlessly exit L2 when it is in the desert mode. Users can use desert circuit to generate a proof of ownership of all their positions locally, which could be submitted on L1 for withdrawing funds.

### Recursion

Lighter prover implements recursive aggregation of transaction proofs to make the whole pipeline more efficient and parallelizable. First, fixed-size blocks of consecutive transactions are processed and proven by [BlockTx circuit](https://github.com/elliottech/lighter-prover/blob/main/circuit/src/block_tx_constraints.rs), which can be done on separate machines. Next, arbitrary number of BlockTx proofs are aggregated into a single proof by [BlockTxChain circuit](https://github.com/elliottech/lighter-prover/blob/main/circuit/src/block_tx_chain_constraints.rs), which includes continuity checks across all BlockTx proofs.
