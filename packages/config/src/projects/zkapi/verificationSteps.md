### Contracts and proof artifacts

Reviewed [ethereum/zkapi revision](https://github.com/ethereum/zkapi/tree/045b444ea1b52538d1b40273c7cb6ed09468a052), whose vault, adapter and circuits match the deployment revision reported by the production manifest. Compile with the checked-in configuration: solc 0.8.28, optimizer 200, viaIR and Prague.

```bash
git clone https://github.com/ethereum/zkapi.git
cd zkapi
git checkout 045b444ea1b52538d1b40273c7cb6ed09468a052
cd demo/contracts
forge build --skip test --build-info
cast tx 0xf753fd93c7e672f7b851f261f600e06930e502bdfd73be29ce8a065643df6985 --json --rpc-url "$ZKAPI_RESEARCH_RPC_URL" > vault-tx.json
cast tx 0x45f2f5259476afd5f64a6a62a36c9012c3a26efcdd35b048a7fac5ae1ba43780 --json --rpc-url "$ZKAPI_RESEARCH_RPC_URL" > verifier-tx.json
```

The adapter creation bytecode matches exactly, including metadata. The vault matches after linking the discovered Poseidon address. Decode its ten constructor arguments from the remaining transaction input. Sources are verified on Etherscan: [vault](https://etherscan.io/address/0x4386FDbdA35D995beB3BF8625118Ec5982ec81fe#code), [adapter](https://etherscan.io/address/0x8e92013Dd7cc86f75b539DBD3814B2e603e0F9C1#code), [Poseidon](https://etherscan.io/address/0xc6B55e86668d8c446B3D81273AAb9CBb20F28c7f#code).

Compare deployed verification-key coordinates and public inputs against the [published setup artifacts](https://github.com/ethereum/zkapi/tree/045b444ea1b52538d1b40273c7cb6ed09468a052/protocol/setup/v2). Proving-key hashes match SDK and production pins. This establishes artifact identity, not honest circuit setup or erasure. Circuit reproduction remains `notVerified`. Rerunning setup generates incompatible keys.

### Hosted application

Compared the login claims with [OA chat source](https://github.com/OpenAnonymity/oa-chat/tree/60ed5be2957d984c70a7299474927becec47b61f) and the production JavaScript on 2026-10-05. Both disable memory, scrubbing and Parallel/Council in zkAPI mode and allow direct proxy fallback. Reviewed [verifier source](https://github.com/OpenAnonymity/oa-verifier/tree/86b7031c2f15d01d19efb77f547812e29992d4d9) for the provider-setting checks. Production enclave measurements were not independently reproduced, and provider-internal logging remains outside those checks.
