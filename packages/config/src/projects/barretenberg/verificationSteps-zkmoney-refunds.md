The three zk.money refund verifiers are regenerated from the same source with the same commands. The Noir circuits compile in seconds on a standard Linux machine.

Prepare:

1. Install Noir `1.0.0-beta.25`, the version pinned by the Aztec `5.2.0` toolchain, for example with `noirup -v 1.0.0-beta.25`.
2. Download `barretenberg-amd64-linux.tar.gz` from the [Aztec `v5.2.0` release](https://github.com/AztecProtocol/aztec-packages/releases/tag/v5.2.0) and put the `bb` binary on your `PATH`. `bb --version` should print `5.2.0`.
3. Install `git`, `jq`, `xxd`, `base64` and `gzip`.

Verify:

1. Clone [aztec-labs-eng/zkmoney-public](https://github.com/aztec-labs-eng/zkmoney-public) and check out commit `1ac7d607e2a524aa7e6ab881a7f14c0a7a02d585`.
2. Compile each circuit, write its UltraHonk verification key and print the key hash. `nargo` fetches the pinned `aztec-nr` dependency on the first run.
   ```bash
   cd vendor/oxide/noir-projects
   for c in frozen_notes_refund frozen_deposit_refund unprocessed_deposit_refund; do
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
3. Regenerate each Solidity verifier without the zero-knowledge option and compare it with the verifier committed in the repository:
   ```bash
   for v in frozen_notes_refund:FrozenNotesRefundVerifier \
            frozen_deposit_refund:FrozenDepositRefundVerifier \
            unprocessed_deposit_refund:UnprocessedDepositRefundVerifier; do
     c=${v%%:*}
     bb write_solidity_verifier --scheme ultra_honk --disable_zk \
       -k $c/target/keys/vk -o $c/target/${v##*:}.sol
     cmp $c/target/${v##*:}.sol ../l1-contracts/src/generated/${v##*:}.sol && echo "$c matches"
   done
   ```
   Each circuit should print `matches`.
4. Compare the regenerated verifier's **full executable source** with the deployed, verified source, including `loadVerificationKey`, the proof decoder, transcript, relations and pairing checks. A matching `VK_HASH` constant alone does not establish that the contract uses that key or verifies proofs correctly.

   | Circuit | Ethereum verifier |
   | --- | --- |
   | Frozen notes | [0x0694…B877](https://etherscan.io/address/0x0694fF404DDA586C73EfCe21f34fe084541BB877#code) |
   | Frozen deposit | [0xa2fd…3cCe](https://etherscan.io/address/0xa2fd594dCA2d598aF231d615E5D34903154C3cCe#code) |
   | Unprocessed deposit | [0x5C48…0FA5](https://etherscan.io/address/0x5C487AEb500BD0fE65fe52Be7e55a150c3220FA5#code) |

   The same check can use L2BEAT's verified-source discovery output. Run `l2b discover zkmoney --dev` from `packages/config` in an L2BEAT checkout. Then run the following from `packages/discovery`, setting `ZKMONEY_PUBLIC_DIR` to the public checkout used above:

   ```bash
   node --import tsx <<'JS'
   const { readFileSync } = require('node:fs')
   const { strict: assert } = require('node:assert')
   const { parse } = require('@mradomski/fast-solidity-parser')
   const { flattenStartingFrom } = require('./src/flatten/flatten.ts')
   const normalize = (source) => parse(source).children
     .filter((node) => node.type !== 'PragmaDirective')
     .map((node) => JSON.stringify(node)).sort()
   for (const name of ['FrozenNotesRefundVerifier', 'FrozenDepositRefundVerifier', 'UnprocessedDepositRefundVerifier']) {
     const circuit = { FrozenNotesRefundVerifier: 'frozen_notes_refund', FrozenDepositRefundVerifier: 'frozen_deposit_refund', UnprocessedDepositRefundVerifier: 'unprocessed_deposit_refund' }[name]
     const content = readFileSync(`${process.env.ZKMONEY_PUBLIC_DIR}/vendor/oxide/noir-projects/${circuit}/target/${name}.sol`, 'utf8')
     const flat = flattenStartingFrom('HonkVerifier', 'verifier.sol', [{ path: 'verifier.sol', content }], [], { includeAll: true })
     const deployed = readFileSync(`../config/src/projects/zkmoney/.flat/${name}.sol`, 'utf8')
     assert.deepEqual(normalize(flat), normalize(deployed))
     console.log(`${name}: full verifier matches deployed verified source`)
   }
   JS
   ```

   Flattening removes unreachable declarations. The comparison ignores comments, formatting, the pragma and the ordering of top-level declarations. It compares all remaining Solidity syntax, including the complete verification key and verifier logic. L2BEAT checked the committed public verifiers against discovery's deployed verified source on 2026-09-30.
