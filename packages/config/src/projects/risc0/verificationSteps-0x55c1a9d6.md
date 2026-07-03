Verification works on a linux machine, 36 GiB of memory is enough to regenerate the verifier. Approximately 14 GiB of trusted setup files need to be downloaded.

To regenerate the verifier, both Groth16 verifier keys and constructor parameters `control_root` and `bn254_control_id` need to be regenerated.

1. Install npm, rust, git-lfs:
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env

sudo apt install npm git-lfs
```

2. Install snarkjs and circom v2.1.0 (from sources):
```
npm install -g snarkjs

git clone https://github.com/iden3/circom.git
cd circom
git checkout v2.1.0
cargo build --release
cargo install --path circom
export PATH="$HOME/.cargo/bin:$PATH"
```

3. Clone risc0 repo, lfs pull the circuit for verifying Risc Zero STARK proofs and compile it into R1CS:
```
git clone https://github.com/risc0/risc0.git
cd risc0
git checkout v2.0.0  # hash 3f26f9d4c2fb8a7e5eb830ae2433c8eae67f5a38
git lfs install
git lfs pull --include=groth16_proof/groth16/stark_verify.circom
cd groth16_proof/groth16
circom stark_verify.circom --r1cs

# check that the circuit is correct:
shasum -a 256 stark_verify.r1cs   # output should be 84d3c34b7c0eb55ad1b16b24f75e0b9de307f7b74089ea4a20a998390ee24178
```

4. Download phase 1 and phase 2 trusted setup files, verify their correctness:
```
wget https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_23.ptau
wget https://risc0-artifacts.s3.us-west-2.amazonaws.com/tsc/2024-04-04/stark_verify_final.zkey

export NODE_OPTIONS="--max-old-space-size=32768"    # without this snarkjs runs out of mem
snarkjs zkey verify stark_verify.r1cs powersOfTau28_hez_final_23.ptau stark_verify_final.zkey
```

5. Export the solidity verifier. Check it manually against the deployed smart contract: `snarkjs zkey export solidityverifier stark_verify_final.zkey verifier.sol`.

6. Check out to the `v2.0.0-rc.3` tag of risc0 repo: `git checkout v2.0.0-rc.3`, commit hash should be `99e8616b4e74203a5aa361a485e0196516b4b308`. 
From the risc0 repo root dir, call `RUST_LOG=info cargo xtask bootstrap`. 
It will output computed `allowed_control_root` and `bn254_identity_control_id` that could be compared with the contract constructor values: `0x539032186827b06719244873b17b2d4c122e2d02cfb1994fe958b2523b844576` and `0x04446e66d300eb7fb45c9726bb53c793dda407a62e9601618bb43c5c14657ac0`. Note that the bytes of `bn254_identity_control_id` will be output in the reversed order.
