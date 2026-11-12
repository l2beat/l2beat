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

The [browser frontend](https://github.com/OpenAnonymity/oa-chat/blob/6c6046141f8b2cf4e4ba9e6967a7fa4dfcff716d/README.md#quick-start) and the [local API daemon](https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/zkapi-clientd/README.md) have public source and build instructions. Both still depend on the operator's authorization and inference services.

### Verifier enclave

The mainnet verifier is `verifier-production-20260917.openanonymity.ai`, pinned in the hosted app's [browser config](https://chat.openanonymity.ai/zkapi/browser-config.json). It runs in an Azure confidential container on AMD SEV-SNP and serves a hardware attestation. Its source, [OpenAnonymity/oa-verifier](https://github.com/OpenAnonymity/oa-verifier), is pinned to commit `a2916c6` by the [production rollout](https://github.com/OpenAnonymity/oa-verifier/blob/dccb1310c465e6494daa8f39dd020ce76385ff6c/deploy/production/rollout.py#L27-L29), which names image `sha256:5f84efe3…`, signed on 2026-10-26.

```bash
curl -sS "https://verifier-production-20260917.openanonymity.ai/attestation?nonce=$(date +%s)" > attestation.json
# 1. the JWT in .token is signed by Azure Attestation (.verify_at), its x-ms-sevsnpvm-hostdata equals sha256 of the decoded .policy
# 2. the policy lists one dm-verity layer hash for the verifier container
git clone https://github.com/OpenAnonymity/oa-verifier && cd oa-verifier
git checkout a2916c6af618ee46a851af28dee201606de895d8
nix build --no-update-lock-file .#container && gunzip -c result > image.tar
# 3. the layer root hash equals the attested one
go install github.com/Microsoft/hcsshim/cmd/dmverity-vhd@v0.12.9
dmverity-vhd -t image.tar roothash -i oa-verifier:latest
```

The attested policy lists the verifier layer `3e18df8a…` and the Rekor entry `3489318725` of the image signature. That signature comes from the `deploy-production-verifier` workflow of OpenAnonymity/oa-verifier on branch `release/verifier-provider-grace-20261026`. The rebuilt layer root hash equals that layer. The attestation also binds the TLS key of the live endpoint. Both clients pin only the verifier's address, so repeat the check when it matters.
