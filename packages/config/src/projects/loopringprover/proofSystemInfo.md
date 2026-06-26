## Proof system

Loopring prover is a monolithic Groth16 SNARK proving system over BN254 curve that generates validity proofs for the state transition of Loopring L2. This system has [custom R1CS circuits](https://github.com/Loopring/protocol3-circuits.git) designed to prove the specific state transition function of the L2, including deposits and withdrawals, transfers, spot trades and curve AMM swaps, NFT operations. Loopring uses [Ethsnarks prover library](https://github.com/HarryR/ethsnarks).
