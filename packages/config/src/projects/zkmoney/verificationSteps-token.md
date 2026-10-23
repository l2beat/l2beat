Each token address must come from its Ethereum portal, rather than the wallet's unsigned deployment manifest. This check compares a fresh public-source build with the contract class of the DAI and sUSDS instances those portals pin. Both instances share one class.

1. Clone [zkmoney-public](https://github.com/aztec-labs-eng/zkmoney-public) and check out `1ac7d607e2a524aa7e6ab881a7f14c0a7a02d585`. Install its dependencies with `pnpm install --frozen-lockfile`, using pnpm `9.14.4` and the Aztec `5.2.0` toolchain.
2. Compile the token from the checkout root:
   ```bash
   VERSION=5.2.0 pnpm build-contracts -c oxide_token_contract
   ```
   The build script uses `--inliner-aggressiveness 0`, matching the deployment pipeline. The output is `packages/contracts/src/artifacts/target/oxide_token_contract/oxide_token_contract-OxideToken.json`. Derive the class id from this fresh artifact, rather than trusting the id embedded in a wallet release. Without the monorepo, `aztec compile --inliner-aggressiveness 0` in `vendor/oxide/noir-projects/oxide_token_contract`, run in the `aztecprotocol/aztec:5.2.0` image, yields the same class.
3. Set `ETHEREUM_RPC_URL` to an Ethereum mainnet node and `AZTEC_NODE_URL` to an Aztec mainnet node. An independently operated Aztec node synced from Ethereum removes trust in an external node's answer. Read both token addresses from the immutable portals, DAI first and sUSDS second:
   ```bash
   export ZKMONEY_L2_TOKENS=$(for portal in \
     0xdf410ad448A0f7165181FBdB32f8896f4a0d9449 \
     0xD7Ae00b91ba0B8e0240B22Cd75fE447d177C260f; do
     cast call "$portal" 'L2_PORTAL()(bytes32)' --rpc-url "$ETHEREUM_RPC_URL"
   done | paste -sd, -)
   ```
4. From `packages/contracts`, compare the class derived from the fresh artifact with the current class of each instance:
   ```bash
   node --input-type=module <<'JS'
   import { readFileSync } from 'node:fs'
   import { strict as assert } from 'node:assert'
   import { createAztecNodeClient } from '@aztec/aztec.js'
   import { AztecAddress } from '@aztec/stdlib/aztec-address'
   import { loadContractArtifact } from '@aztec/stdlib/abi'
   import { getContractClassFromArtifact } from '@aztec/stdlib/contract'

   const raw = JSON.parse(readFileSync('./src/artifacts/target/oxide_token_contract/oxide_token_contract-OxideToken.json', 'utf8'))
   const compiled = await getContractClassFromArtifact(loadContractArtifact(raw))
   const node = createAztecNodeClient(process.env.AZTEC_NODE_URL)
   for (const token of process.env.ZKMONEY_L2_TOKENS.split(',')) {
     const instance = await node.getContract(AztecAddress.fromString(token))
     assert(instance, `The L1-pinned token instance ${token} is missing`)
     assert.equal(compiled.id.toString(), instance.currentContractClassId.toString())
     console.log(`L1-pinned token ${token}: class ${compiled.id} matches the fresh build`)
   }
   JS
   ```

Both checks print class `0x1979a8fdbb3e928c486554559baa63a9c81a143a9a7741f1bc9195f549198013`. A matching class id binds the published artifact's functions and verification keys to the running instances. This check covers the tokens (L2 contracts) only.
