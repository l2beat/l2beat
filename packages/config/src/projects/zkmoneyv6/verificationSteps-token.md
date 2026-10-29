Each token address must come from its Ethereum portal, rather than the wallet's unsigned deployment manifest. This check compares a fresh public-source build with the contract class of the DAI and sUSDS instances those portals pin. Both instances share one class.

1. Install the Aztec `6.0.0` toolchain with `aztec-up install 6.0.0`.
2. Clone [zkmoney-public](https://github.com/aztec-labs-eng/zkmoney-public) and check out `8fd198412a956f214639b5782d3a86e3d47ca60e`. Compile the token without the monorepo:
   ```bash
   cd vendor/oxide/noir-projects/oxide_token_contract
   aztec compile --silence-warnings --inliner-aggressiveness 0
   ```
   `--inliner-aggressiveness 0` matches the deployment pipeline. The output is `target/oxide_token_contract-OxideToken.json`. Derive the class id from this fresh artifact, rather than trusting the id embedded in a wallet release.
3. Set `ETHEREUM_RPC_URL` to an Ethereum mainnet node and `AZTEC_NODE_URL` to an Aztec v6 mainnet node. An independently operated Aztec node synced from Ethereum removes trust in an external node's answer. Read both token addresses from the immutable portals, DAI first and sUSDS second:
   ```bash
   unset ZKMONEY_L2_TOKENS
   zkmoney_l2_tokens() {
     local portal token tokens=()
     for portal in \
       0xCB99C58Fe81Ae6b2cB4835e46F7b703745879042 \
       0x2EbFEE284bABf94869FAC44BC85eDb3C34e536D8; do
       token=$(aztec-cast call "$portal" 'L2_TOKEN()(bytes32)' --rpc-url "$ETHEREUM_RPC_URL") || return 1
       if [[ ! $token =~ ^0x[0-9a-fA-F]{64}$ || $token =~ ^0x0{64}$ ]]; then
         echo "Invalid L2 token from portal $portal: $token" >&2
         return 1
       fi
       tokens+=("$token")
     done
     (( ${#tokens[@]} == 2 )) || return 1
     local IFS=,
     echo "${tokens[*]}"
   }
   tokens=$(zkmoney_l2_tokens) && export ZKMONEY_L2_TOKENS=$tokens
   ```
   The variable is exported only after both lookups return a non-zero 32-byte address.
4. From `vendor/oxide/noir-projects/oxide_token_contract`, compare the class derived from the fresh artifact with the current class of each instance. The script loads the Aztec packages of the installed toolchain:
   ```bash
   AZTEC_NM=$HOME/.aztec/versions/6.0.0/node_modules node --input-type=module <<'JS'
   import { readFileSync } from 'node:fs'
   import { createRequire } from 'node:module'
   import { strict as assert } from 'node:assert'
   const require = createRequire(`${process.env.AZTEC_NM}/package.json`)
   const load = (name) => import(require.resolve(name))
   const { loadContractArtifact } = await load('@aztec-labs/stdlib/abi')
   const { getContractClassFromArtifact } = await load('@aztec-labs/stdlib/contract')
   const { AztecAddress } = await load('@aztec-labs/stdlib/aztec-address')
   const { createAztecNodeClient } = await load('@aztec-labs/stdlib/interfaces/client')

   const raw = JSON.parse(readFileSync('./target/oxide_token_contract-OxideToken.json', 'utf8'))
   const compiled = await getContractClassFromArtifact(loadContractArtifact(raw))
   const node = createAztecNodeClient(process.env.AZTEC_NODE_URL)
   const tokens = process.env.ZKMONEY_L2_TOKENS?.split(',') ?? []
   assert.equal(tokens.length, 2, 'Run step 3 first: it exports the DAI and sUSDS tokens')
   for (const token of tokens) {
     const instance = await node.getContract(AztecAddress.fromStringUnsafe(token))
     assert(instance, `The L1-pinned token instance ${token} is missing`)
     assert.equal(compiled.id.toString(), instance.currentContractClassId.toString())
     console.log(`L1-pinned token ${token}: class ${compiled.id} matches the fresh build`)
   }
   JS
   ```

Both checks print class `0x27df40f914de0e4368b39b4d02821d42573dfe703502c3e7a44f5254345f3949`. A matching class id binds the published artifact's functions and verification keys to the running instances. This check covers the tokens (L2 contracts) only.
