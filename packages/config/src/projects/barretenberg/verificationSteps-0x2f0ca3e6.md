The verifier was regenerated on Linux. VK generation peaked at approximately 11.3 GiB of memory.

Prepare:

1. Install the toolchain expected by the repository: Node.js 24.12.0 or newer, Yarn 4.13.0, Rust 1.89.0, CMake 3.24 or newer, Clang 20, Zig 0.15.1, Ninja, `jq`, `xxd`, `base64`, and `gzip`.
2. Ensure at least 16 GiB of combined memory and swap is available.

Verify:

1. Clone [AztecProtocol/aztec-packages](https://github.com/AztecProtocol/aztec-packages), then check out tag `v5.0.0`. It should resolve to commit `7aa2bd616d632801fe65d97ee8a4434f26886b40`.
2. Initialize the Noir source pinned by the tag: `git submodule update --init --depth 1 noir/noir-repo`. It should resolve to commit `c57152f91260ecdb9faad4efc20abb14b6d2ece7`.
3. Build Nargo from the pinned source:
   ```bash
   cd noir/noir-repo
   cargo +1.89.0 build --locked --release --target-dir target --bin nargo
   cd ../..
   ```
4. Build the Barretenberg CLI from source without AVM components:
   ```bash
   cd barretenberg/cpp
   cmake --fresh --preset clang20-no-avm -DAVM_TRANSPILER_LIB=
   cmake --build --preset clang20-no-avm --target bb --parallel 4
   cd ../..
   ```
5. Generate the ignored Noir workspace files. Do not run the protocol-circuits bootstrap because it consumes the tracked `pinned-build.tar.gz` instead of compiling the circuit source.
   ```bash
   cd noir-projects/noir-protocol-circuits
   corepack yarn@4.13.0 install
   corepack yarn@4.13.0 generate_variants
   ```
6. Compile `rollup_root` from source:
   ```bash
   ../../noir/noir-repo/target/release/nargo check \
     --package rollup_root --silence-warnings --show-program-hash
   ../../noir/noir-repo/target/release/nargo compile \
     --package rollup_root --skip-brillig-constraints-check
   ```
   The monomorphized Noir program hash printed by the first command should be `62fd003ca75d0cd7`.
7. Generate the UltraHonk verification key from the newly compiled bytecode:
   ```bash
   mkdir -p /tmp/aztec-v5-repro
   jq -r '.bytecode' target/rollup_root.json \
     | base64 -d \
     | gunzip \
     | ../../barretenberg/cpp/build/bin/bb write_vk \
         --scheme ultra_honk --oracle_hash keccak \
         -b - -o /tmp/aztec-v5-repro
   xxd -p -c 0 /tmp/aztec-v5-repro/vk_hash
   ```
   The final command should print `2f0ca3e610369fc41f7fb8a69995a96428fbf69d7dffd2b576e63ba4d9511ee1`.
8. Regenerate the Solidity verifier:
   ```bash
   ../../barretenberg/cpp/build/bin/bb write_solidity_verifier \
     --scheme ultra_honk --disable_zk \
     -k /tmp/aztec-v5-repro/vk \
     -o /tmp/aztec-v5-repro/HonkVerifier.sol \
     --optimized
   diff -u \
     /tmp/aztec-v5-repro/HonkVerifier.sol \
     ../../l1-contracts/script/deploy/HonkVerifier.sol
   ```
   The generated verifier should be identical to the repository copy except for the latter's provenance comment after the Solidity pragma.
