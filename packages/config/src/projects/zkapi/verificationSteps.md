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

The deployed verification-key coordinates and public inputs match the [published setup artifacts](https://github.com/ethereum/zkapi/tree/045b444ea1b52538d1b40273c7cb6ed09468a052/protocol/setup/v2), and the proving-key hashes match the SDK and production pins. A single-party setup with fresh randomness yields different keys each time, so matching artifacts show that the deployed keys are the published ones. Only the setup party knows whether its secrets were erased.

### Frontend and local client

The [browser frontend](https://github.com/OpenAnonymity/oa-chat/blob/60ed5be2957d984c70a7299474927becec47b61f/README.md#quick-start) and the [local API daemon](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/zkapi-clientd/README.md) have public source and build instructions. Both still depend on the operator's authorization and inference services.

### Verifier enclave

The mainnet verifier is `verifier-production-20260917.openanonymity.ai`, pinned in the hosted app's [browser config](https://chat.openanonymity.ai/zkapi/browser-config.json). It runs in an Azure confidential container on AMD SEV-SNP and serves a hardware attestation. Its source, [OpenAnonymity/oa-verifier](https://github.com/OpenAnonymity/oa-verifier), is pinned to commit `4299cfa` by the [production rollout](https://github.com/OpenAnonymity/oa-verifier/blob/86b7031c2f15d01d19efb77f547812e29992d4d9/deploy/production/rollout.py#L27-L29).

```bash
curl -sS "https://verifier-production-20260917.openanonymity.ai/attestation?nonce=$(date +%s)" > attestation.json
# 1. the JWT in .token is signed by Azure Attestation (.verify_at), its x-ms-sevsnpvm-hostdata equals sha256 of the decoded .policy
# 2. the policy lists one dm-verity layer hash for the verifier container
git clone https://github.com/OpenAnonymity/oa-verifier && cd oa-verifier
git checkout 4299cfa136c90550737dd46c89dba586c213159b
nix build .#container && docker load < result
# 3. push oa-verifier:latest to a local registry, then
go install github.com/Microsoft/hcsshim/cmd/dmverity-vhd@v0.12.9
dmverity-vhd roothash -i localhost:5000/oa-verifier:latest
```

The rebuilt image matches the published `ghcr.io/openanonymity/oa-verifier@sha256:60f9892b…` in nix store path, config and layer, and its layer root hash equals the attested policy. Pushing through a different docker version changes the compressed manifest digest, while the measured layer hash stays. The attestation also binds the TLS key of the live endpoint. Both clients pin only the verifier's address, so repeat the check when it matters.
