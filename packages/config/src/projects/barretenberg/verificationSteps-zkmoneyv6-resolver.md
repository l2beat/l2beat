The zk.money v6 Resolver checks each resolver operator's answer with one verifier. The Noir circuit compiles in under a minute on a standard Linux machine.

Prepare:

1. Install the Aztec `6.0.0` toolchain with `aztec-up install 6.0.0`. It provides `aztec-nargo` (Noir `1.0.0-rc.3`) and `aztec-bb` (`6.0.0`).
2. Install `git` and `xxd`.

Verify:

1. Clone [aztec-labs-eng/zkmoney-public](https://github.com/aztec-labs-eng/zkmoney-public) and check out commit `7a72b6b47219c1a7d4a089d93a2b2ad57d294cd2`.
2. Compile the circuit, write its verification key for EVM verification and print the key hash. `aztec-nargo` fetches the pinned `noir-bignum`, `noir_base64` and `sha256` dependencies on the first run.
   ```bash
   cd vendor/oxide/noir-projects/resolver_circuit
   aztec-nargo compile --silence-warnings --package resolver_circuit
   aztec-bb write_vk -t evm -b target/resolver_circuit.json -o target/keys
   xxd -p -c 0 target/keys/vk_hash
   ```
   The printed hash should be `012486c74ac5045c0bd91bde9cbbf5f815d2d4761eb54601f0b0c5840dac28ff`.
3. Regenerate the Solidity verifier with the zero-knowledge option, the default, and compare it with the verifier committed in the repository:
   ```bash
   aztec-bb write_solidity_verifier -t evm -k target/keys/vk -o target/verifier.sol
   cmp target/verifier.sol ../../l1-contracts/src/pinned/PinnedResolverVerifier.sol && echo matches
   ```
   It should print `matches`.
4. Compare the regenerated verifier's **full executable source** with the deployed, verified source, including `loadVerificationKey`, the proof decoder, transcript, relations and pairing checks. A matching `VK_HASH` constant alone does not establish that the contract uses that key or verifies proofs correctly. The verifier links two libraries, which are verified too.

   | Contract | Ethereum address |
   | --- | --- |
   | HonkVerifier | [0xE80d…53aE](https://etherscan.io/address/0xE80d96eB67c620b0708E1949fd2a79fdACa553aE#code) |
   | RelationsLib | [0xC4b6…ebAe](https://etherscan.io/address/0xC4b631c02Aa134D83237D798aF501B3389e0ebAe#code) |
   | ZKTranscriptLib | [0x53a5…CF82](https://etherscan.io/address/0x53a5471615868c8C82595ed1EEA2bb66e4beCF82#code) |
