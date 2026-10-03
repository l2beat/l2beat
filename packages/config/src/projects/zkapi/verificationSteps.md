### Contract reproduction

Reviewed source: [ethereum/zkapi at 045b444](https://github.com/ethereum/zkapi/tree/045b444ea1b52538d1b40273c7cb6ed09468a052). The live manifest reports `95b022fd339a391321481d31dffa4b947954b0a6` as its deployment source. The vault, adapter and circuit source are unchanged between those revisions.

Compile the deployment workspace, which uses solc `0.8.28+commit.7893614a`, optimizer runs `200`, `viaIR: true` and EVM version `prague`:

```bash
git clone https://github.com/ethereum/zkapi.git
cd zkapi
git checkout 045b444ea1b52538d1b40273c7cb6ed09468a052
cd demo/contracts
forge build --skip test --build-info
```

Read the creation transactions from an Ethereum RPC:

```bash
cast tx 0xf753fd93c7e672f7b851f261f600e06930e502bdfd73be29ce8a065643df6985 --json --rpc-url "$ZKAPI_RESEARCH_RPC_URL" > vault-tx.json
cast tx 0x45f2f5259476afd5f64a6a62a36c9012c3a26efcdd35b048a7fac5ae1ba43780 --json --rpc-url "$ZKAPI_RESEARCH_RPC_URL" > verifier-tx.json
```

The adapter's compiled creation bytecode matches its entire transaction input exactly, including metadata. The vault's compiled creation bytecode matches after replacing every `Bn254Poseidon` link reference with `0xc6B55e86668d8c446B3D81273AAb9CBb20F28c7f`. The remaining transaction bytes decode as its ten constructor arguments. Decode rather than assuming the treasury, signing keys or deployment parameters.

The vault has 9,598 bytes of creation code plus 320 bytes of constructor arguments, and 8,535 bytes of runtime code. The adapter has 6,527 bytes of creation code and 6,501 bytes of runtime code. Runtime hashes observed for this deployment:

| Contract | Runtime keccak256 |
| --- | --- |
| ZkApiVault | `0x0ccfe907122037eef6220c8e9f4792b82a6a23a80b908eaeb8a7fd27c759a5a0` |
| Groth16ProofAdapter | `0x5cfce41ec9f29c8e23cb6a30c8d4bc328f7d98032ccd7683a888b88d73766ab9` |

Both initially unverified contracts and the linked Poseidon library were successfully verified on Etherscan using the public sources. For the standard JSON submission, remove Foundry's top-level `version`, `allowPaths`, `basePath` and `includePaths`, omit the unrelated deployment script and forge-std, and resolve dependency source keys consistently with the published remappings. Set the vault's library address and use the constructor bytes from its creation transaction. [Vault](https://etherscan.io/address/0x4386FDbdA35D995beB3BF8625118Ec5982ec81fe#code), [adapter](https://etherscan.io/address/0x8e92013Dd7cc86f75b539DBD3814B2e603e0F9C1#code), [library](https://etherscan.io/address/0xc6B55e86668d8c446B3D81273AAb9CBb20F28c7f#code).

### Circuit and artifact boundary

The deployed adapter hardcodes the request and withdrawal keys. Its 12 request public inputs and 14 withdrawal public inputs match the published circuit interfaces. The public setup directory contains the verifying keys, proving keys, manifest and generated Solidity adapter. The generated and deployed adapter sources differ in formatting, so compare their structure and key coordinates rather than whole-file hashes.

Published proving-key SHA-256 pins:

| Key | SHA-256 |
| --- | --- |
| request.pk | `c894b261a13f571d0df36be29734aabf2a8cd7162baddc5e08a50341aa076584` |
| withdrawal.pk | `8e41398092fdd02b9ff86c6ccbecbd7ce2402e6f22ec162e6124d1d04fe0a668` |

These match the checked-in SDK artifacts and production deployment profiles. Source and bytecode matching do not establish that the published setup was generated honestly from the reviewed circuit or that its secrets were destroyed. The zk catalog entry therefore retains `notVerified` for circuit reproduction. Do not run the `setup` command to reproduce the deployed keys: it generates a fresh incompatible single-party setup.
