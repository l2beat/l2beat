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

Compare deployed verification-key coordinates and public inputs against the [published setup artifacts](https://github.com/ethereum/zkapi/tree/045b444ea1b52538d1b40273c7cb6ed09468a052/protocol/setup/v2). Proving-key hashes match SDK and production pins. Circuit source is public, but rerunning the single-party setup with OS randomness generates different keys. Artifact matching does not independently establish circuit-to-key correspondence or setup-secret erasure.

### Frontend and local client

The team offers the full [browser frontend with localhost build/run instructions](https://github.com/OpenAnonymity/oa-chat/blob/60ed5be2957d984c70a7299474927becec47b61f/README.md#quick-start) and a released [local API daemon for Open WebUI and compatible clients](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/zkapi-clientd/README.md). Local clients still depend on remote authorization and inference services.

### TEE verifier

TODO
