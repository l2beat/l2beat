The four zk.money verifiers are regenerated from the same source with the same commands. The Noir circuits compile in under a minute on a standard Linux machine.

Prepare:

1. Install Noir `1.0.0-beta.25`, the version pinned by the Aztec `5.2.0` toolchain, for example with `noirup -v 1.0.0-beta.25`.
2. Download `barretenberg-amd64-linux.tar.gz` from the [Aztec `v5.2.0` release](https://github.com/AztecProtocol/aztec-packages/releases/tag/v5.2.0) and put the `bb` binary on your `PATH`. `bb --version` should print `5.2.0`.
3. Install `git`, `jq`, `xxd`, `base64` and `gzip`.

Verify:

1. Clone [aztec-labs-eng/zkmoney-public](https://github.com/aztec-labs-eng/zkmoney-public) and check out commit `68425f9cf408ac803eade04d10318fcf345444a0`.
2. Compile each circuit, write its UltraHonk verification key and print the key hash. `nargo` fetches the pinned `aztec-nr`, `bignum` and `bigcurve` dependencies on the first run.
   ```bash
   cd vendor/oxide/noir-projects
   for c in frozen_notes_refund frozen_deposit_refund unprocessed_deposit_refund resolver_circuit; do
     (cd $c \
       && nargo compile --silence-warnings --package $c \
       && jq -r '.bytecode' target/$c.json | base64 -d | gunzip \
         | bb write_vk --scheme ultra_honk --oracle_hash keccak -b - -o target/keys \
       && echo "$c $(xxd -p -c 0 target/keys/vk_hash)")
   done
   ```
   The printed hashes should be:
   - `frozen_notes_refund`: `05ea6d9d0a0b1b837f081862dd77aae6bc047fb822b9cf7055ef68719b04198e`
   - `frozen_deposit_refund`: `2290cfb58dea33c485e0ac33581c1c8d358ac3dd9f434470b6cf87da12b5fd43`
   - `unprocessed_deposit_refund`: `080b44509f327b7b0ee935247a069be5def58e0edf1b52721d9c42f5918c390c`
   - `resolver_circuit`: `279d6dad93155d6c03ddd050359fb4675a66c08812b5306f6dfc9754e42827b7`
3. Regenerate each Solidity verifier and compare it with the verifier committed in the repository. The refund verifiers are generated without the zero-knowledge option, the resolver verifier with it:
   ```bash
   for v in frozen_notes_refund:generated/FrozenNotesRefundVerifier:--disable_zk \
            frozen_deposit_refund:generated/FrozenDepositRefundVerifier:--disable_zk \
            unprocessed_deposit_refund:generated/UnprocessedDepositRefundVerifier:--disable_zk \
            resolver_circuit:pinned/PinnedResolverVerifier:; do
     IFS=: read -r c path flags <<<"$v"
     bb write_solidity_verifier --scheme ultra_honk $flags \
       -k $c/target/keys/vk -o $c/target/verifier.sol
     cmp $c/target/verifier.sol ../l1-contracts/src/$path.sol && echo "$c matches"
   done
   ```
   Each circuit should print `matches`.
4. Optionally, run `nargo test` in `resolver_circuit`. The `comb_table_matches_curve_library` test re-derives every precomputed secp256k1 point in `src/comb_table.nr`, which the circuit uses to check the resolver operator's key.
5. Compare each regenerated verifier's **full executable source** with the deployed, verified source, including `loadVerificationKey`, the proof decoder, transcript, relations and pairing checks. A matching `VK_HASH` constant alone does not establish that the contract uses that key or verifies proofs correctly. Each verifier calls separately deployed libraries, whose verified source must be the same file.

   | Circuit | Ethereum verifier | Linked libraries |
   | --- | --- | --- |
   | Frozen notes | [0x0694…B877](https://etherscan.io/address/0x0694fF404DDA586C73EfCe21f34fe084541BB877#code) | [RelationsLib](https://etherscan.io/address/0x41F721e09a9C8027165C6Bf1B3771848f6a43D29#code) |
   | Frozen deposit | [0xa2fd…3cCe](https://etherscan.io/address/0xa2fd594dCA2d598aF231d615E5D34903154C3cCe#code) | [RelationsLib](https://etherscan.io/address/0xb66C441BbeFe703E423dbcAa515d32F50e507C2b#code) |
   | Unprocessed deposit | [0x5C48…0FA5](https://etherscan.io/address/0x5C487AEb500BD0fE65fe52Be7e55a150c3220FA5#code) | [RelationsLib](https://etherscan.io/address/0x9e2131C7B89D070a6b27f29c2b8e066399ECA5b7#code) |
   | Resolver | [0xbF05…E451](https://etherscan.io/address/0xbF058D54c5033F4cB45c6E1Eba103CaeF232E451#code) | [RelationsLib](https://etherscan.io/address/0x02353dB283087CD51b13eE088A615Dad03949070#code), [ZKTranscriptLib](https://etherscan.io/address/0xf3E445E6E292dE756bD66011c23717DAb9e12DBD#code) |
