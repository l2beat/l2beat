The token address must come from the Ethereum portal, rather than the wallet's unsigned deployment manifest. This check compares a fresh public-source build with the contract class of that L1-pinned Aztec instance.

1. Clone [zkmoney-public](https://github.com/aztec-labs-eng/zkmoney-public) and check out `1ac7d607e2a524aa7e6ab881a7f14c0a7a02d585`. Install its dependencies with `pnpm install --frozen-lockfile`, using pnpm `9.14.4` and the Aztec `5.2.0` toolchain.
2. Compile the token from the checkout root:
   ```bash
   VERSION=5.2.0 pnpm build-contracts -c oxide_token_contract
   ```
   The build script uses `--inliner-aggressiveness 0`, matching the deployment pipeline. The output is `packages/contracts/src/artifacts/target/oxide_token_contract/oxide_token_contract-OxideToken.json`. Derive the class id from this fresh artifact, rather than trusting the id embedded in a wallet release.
3. Set `ETHEREUM_RPC_URL` to an Ethereum mainnet node and `AZTEC_NODE_URL` to an Aztec mainnet node. An independently operated Aztec node synced from Ethereum removes trust in an external node's answer. Read the token address from the immutable portal:
   ```bash
   export ZKMONEY_L2_TOKEN=$(cast call \
     0xdf410ad448A0f7165181FBdB32f8896f4a0d9449 \
     'L2_PORTAL()(bytes32)' --rpc-url "$ETHEREUM_RPC_URL")
   ```
4. From `packages/contracts`, compare the class derived from the fresh artifact with the current class of that instance:
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
   const instance = await node.getContract(AztecAddress.fromString(process.env.ZKMONEY_L2_TOKEN))
   assert(instance, 'The L1-pinned token instance is missing')
   assert.equal(compiled.id.toString(), instance.currentContractClassId.toString())
   console.log(`L1-pinned token ${process.env.ZKMONEY_L2_TOKEN}: class ${compiled.id} matches the fresh build`)
   JS
   ```

A matching class id binds the published artifact's functions and verification keys to the running instance. This check covers the token, not the fee-paying contract, broadcaster, wallet or approved enclave image. The fresh token compilation has not been rerun as part of this review.
