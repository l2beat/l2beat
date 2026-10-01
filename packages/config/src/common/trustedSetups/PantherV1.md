Circuit-specific trusted setup for the 6 Groth16 circuits of Panther Protocol v1 over the BN254 curve: zAccount registration, zAccount renewal, main transaction, swap, PRP conversion (AMM) and the bus tree batch updater. It was run with snarkjs and finalised on 28 January 2026.
Phase 1 is the Hermez `powersOfTau28_hez_final_19` file, built from the first 54 contributions of the
[Perpetual Powers of Tau](https://github.com/privacy-ethereum/perpetualpowersoftau) ceremony and a random beacon.
Phase 2 had **11 contributions** after the coordinator's initial setup, each identified by GitHub username and published with the resulting zkey hashes and snarkjs transcripts. It was finalised by applying a beacon derived from the hash of Ethereum block 22038000 with 10 iterations.

- Ceremony repository, contributions and verification tooling: [https://github.com/pantherfoundation/trusted-setup-ceremony](https://github.com/pantherfoundation/trusted-setup-ceremony)
- Final verification keys and attestation: [contributions/0012_final](https://github.com/pantherfoundation/trusted-setup-ceremony/tree/c40f1a2c6f8747787fc2390f3dc87d27ebe30d26/contributions/0012_final)
- Zkeys and r1cs files of every step, on IPFS: [bafybeia7mzvd6uzi5aeojwazef643hfea5t4nyn3d7fwf36il7lj4gwewy](https://ipfs.filebase.io/ipfs/bafybeia7mzvd6uzi5aeojwazef643hfea5t4nyn3d7fwf36il7lj4gwewy)
