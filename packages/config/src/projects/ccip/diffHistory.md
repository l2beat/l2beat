Generated with discovered.json: 0x72e154c684e6ed3724489a3e22780c95c6efca6a

# Diff at Thu, 23 Apr 2026 10:20:33 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1776938804

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_mode (eth:0x01346721418045A6c07b71052e452eF8615e9084)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_cronos (eth:0x03CB4C67D01a78F44289541281E57C33E6b834d9)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_cronoszkevm (eth:0x0428dF02c581E605AABF83005b427b1561b587De)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_hedera (eth:0x08C798376AfA295C047bDb5c011097865895672d)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_soneium (eth:0x093844Bd4b26792791cD4038e94Bec70f88CaD63)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_4348158687435793198 (eth:0x0aB48c500AbD8392620c3C4E4fdD5d7063C44554)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_2_from_polygonpos (eth:0x0af338F0E314c7551bcE0EF516d46d855b0Ee395)
    +++ description: v1.2 CCIP inbound ramp — one instance per source chain it serves. Still active for sources whose lane has not been migrated to v1.5. A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Owner can rotate OCR signers/transmitters, change dynamic config, and change rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_zksync2 (eth:0x0d26BaE784c8986502E072F4e73B6168e2052045)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_ink (eth:0x0F1B1A46AdeadF3C0D583AC86f40bC9e0b2e4Ba2)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_lisk (eth:0x0F254ECcC89219CEC945BCeA48A4681eb5a380d7)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_sonic (eth:0x0f5552d17505dC8f70D6cd65BEADFE20f42bBE75)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_metis (eth:0x0f89C7c0586536B618e0469402e1c8234bc52959)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_plume (eth:0x109c666A021214C96a7ab7cde7E987F4e7dCD9fE)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_sei (eth:0x10D5611D4E1fBB0Eb614C25f14ED6AfD6C945c75)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CCIPBypasserMCMS (eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc)
    +++ description: Chainlink's merkle-root-based multisig (MCMS). Signers are grouped into up to NUM_GROUPS hierarchical groups; each group has a quorum (groupQuorums) and a parent (groupParents) forming a tree. A merkle root of (chain, contract, data) operations is valid once the root of the group tree is signed. Then anyone can execute individual ops under that root via setRoot / execute.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_2_from_gnosis (eth:0x118a9389960F86390A4F14ce4C95D6ff076C6bFC)
    +++ description: v1.2 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.2 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_polygonpos (eth:0x15a9D79d6b3485F70bF82bC49dDD1fcB37A7149c)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract TokenPoolFactory (eth:0x17D8a409fE2ceF2d3808bcB61F14aBEFfc28876e)
    +++ description: Factory used to deploy standardized CCIP TokenPool contracts (BurnMint / LockRelease variants). Not part of the runtime message path; holds no funds and has no authority over existing pools. Historical artifact for self-service token onboarding.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_hashkey (eth:0x1807769Abe5133c9B41cA6746044b6a1d83F5633)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_4348158687435793198 (eth:0x1A3D582d1aB9CF630b44B91C54CBD16Ca7e35a8d)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_2_from_blast (eth:0x1a904DbbaDdE629a1460e2F6E2E485Ce06Ed7599)
    +++ description: v1.2 CCIP inbound ramp — one instance per source chain it serves. Still active for sources whose lane has not been migrated to v1.5. A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Owner can rotate OCR signers/transmitters, change dynamic config, and change rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_bob (eth:0x1B960560324c03db5565545B353198fdd07A195d)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_monad (eth:0x1bddbA5DC2cd6ED3343A8E94D02023cC720533B9)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_mint (eth:0x1Fa3aF677DC1b627f8A57e26b2a55d5F7945F06b)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_merlin (eth:0x20fD5ab74D519df395f41c958D982BecB6b64432)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_abstract (eth:0x266e520E272FCca3cE46A379a06Dc5ba62717b8F)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_scroll (eth:0x26a10137A54F4Ea01D20758Ac5AdBf9326340Fc3)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_6 (eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5)
    +++ description: v1.6 CCIP inbound ramp — a single per-chain contract that serves every source (as opposed to the per-source OffRamp in v1.5). Combines the v1.5 CommitStore (blessed merkle roots) and OffRamp (message execution) into one. Uses MultiOCR3: two separate Chainlink OCR instances, one per plugin (0=Commit, 1=Execution). Commit OCR signs source-chain merkle roots; Execute OCR signs lists of messages to deliver with their proofs. RMN blesses commit roots, and once blessed anyone can submit proofs to execute individual messages. Owner can rotate OCR signers/transmitters per plugin, change dynamic config, and enable/disable RMN verification per source chain.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_merlin (eth:0x27A4E7ff4a6E28056Ac3e39445639876Ee9926FB)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_2_from_avalanche (eth:0x2aa101BF99CaeF7fc1355D4c493a1fe187A007cE)
    +++ description: v1.2 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.2 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CCIPRateLimitAdminMCMS (eth:0x2F2A3e36CE5Fb0924C414BEB1D98B531Cdf17e0B)
    +++ description: Chainlink's merkle-root-based multisig (MCMS). Signers are grouped into up to NUM_GROUPS hierarchical groups; each group has a quorum (groupQuorums) and a parent (groupParents) forming a tree. A merkle root of (chain, contract, data) operations is valid once the root of the group tree is signed. Then anyone can execute individual ops under that root via setRoot / execute.
```

```diff
+   Status: CREATED
    contract FeeQuoter (eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57)
    +++ description: CCIP v1.6 FeeQuoter (replacement for PriceRegistry in v1.5). Stores per-token fee configuration, per-destination-chain gas costs, and the price feeds that update both. Used by the v1.6 OnRamp to compute fees in fee-token (LINK, WETH, native) for any cross-chain message. Owner can change supported fee tokens, set per-token fee config, and rotate authorized callers / price updaters.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_fraxtal (eth:0x31ee106a4585a796caacC645172B9F7e9c2f8D37)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_2_from_wemix (eth:0x31f6ab382DDeb9A316Ab61C3945a5292a50a89AB)
    +++ description: v1.2 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.2 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_metis (eth:0x330349112e13232131Da51f9f3b153d825f65e61)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_astar (eth:0x33276152d082120F5190362e6E5F6783bbCb2B26)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_4348158687435793198 (eth:0x33417f13DFBC2FfB9e1B43051c3737370F3691a4)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_optimism (eth:0x3455D8E039736944e66e19eAc77a42e8077B07bf)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_rootstock (eth:0x34748FbeD8fD8468eD66D53A7D102ce793cB4094)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_rootstock (eth:0x34eEc7EcA3Ce1e693028255ebE2063728224a604)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_scroll (eth:0x362A221C3cfd7F992DFE221687323F0BA9BA8187)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_katana (eth:0x38A806580D93c5B3e295F5181723C11f15c43271)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_2_from_wemix (eth:0x3a129e6C18b23d18BA9E6Aa14Dc2e79d1f91c6c5)
    +++ description: v1.2 CCIP inbound ramp — one instance per source chain it serves. Still active for sources whose lane has not been migrated to v1.5. A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Owner can rotate OCR signers/transmitters, change dynamic config, and change rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_shibarium (eth:0x3Ac0D8fe5b4e8d0a95C507CCd83F6A8d73A8c6b1)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_bitlayer (eth:0x3B45dd27E0cF84F1af98DEaBDc8f96303475ef58)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_superseed (eth:0x3c5990484D4D7b728Ae875d001E97469284210C1)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_xlayer (eth:0x3c672f0f9E73cB7984A5Ab486C7839f84C8EDC09)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_2_from_blast (eth:0x3CB2A81bb8a188C5353CdFa9994ed8666556FC53)
    +++ description: v1.2 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.2 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_2_from_metis (eth:0x3d8a95adA63D406ee8232562AbD83CEdb0B90466)
    +++ description: v1.2 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.2 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_metal (eth:0x3f1c3541B7035dEd84E4502E41D5C919da4C4527)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_7222032299962346917 (eth:0x4109D281EB5C768556dFF78ba400cE2E3564d5B0)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract ARMProxy (eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81)
    +++ description: Immutable proxy for the CCIP Risk Management Network (RMN). Forwards blessing/cursing calls to the active ARM implementation (getARM). Its owner can atomically swap the underlying ARM implementation, effectively rotating the entire risk-validation system with no delay at the proxy level (any delay comes from whatever contract holds the owner role).
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_linea (eth:0x418dcbCf229897d0CCf1B8B464Db06C23879FBB4)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CCIPTimelock (eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449)
    +++ description: OpenZeppelin AccessControl-based TimelockController. PROPOSER_ROLE schedules arbitrary (target, value, calldata) operations. After minDelay passes, EXECUTOR_ROLE can execute them. CANCELLER_ROLE can cancel pending operations before execution. BYPASSER_ROLE can execute arbitrary operations without any delay, which is the weakest link in the timelock guarantee. ADMIN_ROLE can grant and revoke any of the above roles.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_fraxtal (eth:0x459154447d3BD41392Ea3f49738a887dD3f1e5d0)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_kaia (eth:0x4676537819a87E9D515D654f8bedf45A744cF214)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract RegistryModuleOwnerCustom (eth:0x4855174E9479E211337832E109E7721d43A4CA64)
    +++ description: Self-service onboarding hook for the TokenAdminRegistry. Anyone can call registerAdminViaOwner(token) or registerAdminViaGetCCIPAdmin(token) here to nominate themselves as the CCIP admin for an ERC20 token they control (proven via owner() or getCCIPAdmin() on the token). The nomination is forwarded to the TokenAdminRegistry, where the caller becomes the administrator who can then call setPool to bind a TokenPool to the token.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_superseed (eth:0x486170Bca7fE5126AFeaF171d3a60A211bF2C44C)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_apechain (eth:0x48F836a7697c0082B2Ecb4B2639f6da79de21980)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_mint (eth:0x49Aac6Fc36F32aC22867Ac0bAa23E6F2551f8edD)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract RMNExecutorProxy (eth:0x49edf594E698F406A15afEf44CE7a0Fd8d998610)
    +++ description: Minimal immutable forwarder that anyone can call to invoke a target with calldata. When granted EXECUTOR_ROLE on a Timelock, it makes timelocked operations publicly executable by any caller once the delay has elapsed (no privileged keeper needed). Grants no delay-skipping power; only serves as the public execution pathway after the delay.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_2_from_optimism (eth:0x4af4B497c998007eF83ad130318eB2b925a79dc8)
    +++ description: v1.2 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.2 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_hemi (eth:0x4B50Cd4637a8EA94729811201A699f4800ee3282)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_lens (eth:0x4Bc6027Cd2da6CB7A105D5cE2D039c4892225419)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_zircuit (eth:0x4Cc3D95d9384D3287724B83099f01BC3025702c0)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_zircuit (eth:0x4E4003DAFD00eC3B5F17f05950759054051950d6)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_bitlayer (eth:0x4FB5407d6911DaA0B8bde58A754E7D01CB8b05c5)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_sonic (eth:0x4fdAaDe22bd05537EeaB204cF7319589CE595D6a)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract LinkToken (eth:0x514910771AF9Ca656af840dff83E8264EcF986CA)
    +++ description: Chainlink's LINK ERC20 on Ethereum. Not part of CCIP; held by CCIP contracts as a fee token. Leaf — its admin chain is outside of CCIP's trust surface.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_blast (eth:0x52275dC17f9eD92230C8C4d57fD36d128701f694)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_fraxtal (eth:0x559c3233aE9A0EcD45a6c45ee3B8c2c6DBa5F48D)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_optimism (eth:0x562a2025E60AA19Aa03Ea41D70ea1FD3286d1D3B)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_2_from_avalanche (eth:0x569940e02D4425eac61A7601632eC00d69f75c17)
    +++ description: v1.2 CCIP inbound ramp — one instance per source chain it serves. Still active for sources whose lane has not been migrated to v1.5. A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Owner can rotate OCR signers/transmitters, change dynamic config, and change rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_sei (eth:0x5739E5376702AAc79a53B375ca160EE3C12025E0)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_polygonpos (eth:0x57b548C9c213EA2bcf60193E3D7fd2d2b53Fb9b3)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_scroll (eth:0x57d6cD9CD44770C807b2763Dbe4CFDA0113dd114)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_1546563616611573946 (eth:0x57da0fAD1CC3B98a8f04545A45Ba156e944db4DE)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_merlin (eth:0x5B6D2998EEF5cBBa7e8345B08Dd41AecEC5EACA5)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_mantle (eth:0x5B859E596C4285bf489E1bFa222b97dB431da7eC)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_zora (eth:0x5e24de8F7Ccb3E1e204707573a672823d88C559F)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_unichain (eth:0x5E7397CA539C94185BBD950706F0Dd8628587E04)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_worldchain (eth:0x5EDa6801dBD2bBdbF0401d34c730fa2C3A97C3F4)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_taiko (eth:0x5F6e7707DE5019E13BaFbD2f4569B2453F16eB3e)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_taiko (eth:0x5Fd81cF5734498467634Ed9432aad298022e15Ff)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_plume (eth:0x607c0979C55628680167260Ca68e0EF22e8f128C)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_hashkey (eth:0x61B4B85364a2609177D2C498ff864E01a63148a5)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_linea (eth:0x626189C882A80fF0D036d8D9f6447555e81F78E9)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_botanix (eth:0x64A5c64945c72bc46DF52c82Cfce9161b888578B)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract RMNTimelock (eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A)
    +++ description: OpenZeppelin AccessControl-based TimelockController. PROPOSER_ROLE schedules arbitrary (target, value, calldata) operations. After minDelay passes, EXECUTOR_ROLE can execute them. CANCELLER_ROLE can cancel pending operations before execution. BYPASSER_ROLE can execute arbitrary operations without any delay, which is the weakest link in the timelock guarantee. ADMIN_ROLE can grant and revoke any of the above roles.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_bsc (eth:0x66d84fedED0e51aeB47ceD1BB2fc0221Ae8D7C12)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_lens (eth:0x6715EA73EcAf1CaE1c736731129637B2E94a6B49)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_blast (eth:0x6751cA96b769129dFE6eB8E349c310deCEDb4e36)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_superseed (eth:0x67b972054152E6F4B7434D84439EE225e5a00b90)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_botanix (eth:0x6818278a6e4DA0aD588ef4dd04b59bC4E6703248)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_zksync2 (eth:0x6868FefbEFDc2B2FB75E6ED216dB1BeC02563D69)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_hyperevm (eth:0x69c3619326d5DF0d5abB752f2AE629413811ccD1)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_arbitrum (eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_base (eth:0x6B4B6359Dd5B47Cdb030E5921456D2a0625a9EbD)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_bitlayer (eth:0x6C8b9672B4482A876168b9415bF8bBEA574bF4B9)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_abstract (eth:0x6f4AbCe0B22343e66C856F28e2d07074c5c5BF75)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_soneium (eth:0x6fe6F73F7Cd11E34b6908cdC080683690229d0A4)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_ink (eth:0x700b6adcCfAa4c66638b1AD36BDeFE2038794E02)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_kaia (eth:0x70Ac0F926a64D82f0cC69A3E505f0eE57E27006a)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_gnosis (eth:0x70C705ff3eCAA04c8c61d581a59a168a1c49c2ec)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_apechain (eth:0x7115F0fB22e0A85133C06b50aDc3B90b335ea175)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_polygonpos (eth:0x718672076D6d51E4c76142B37bC99E4945d704a3)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_taiko (eth:0x720EA8a2662376B89dEe1A7bAcA95b2eb6B6fF81)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_celo (eth:0x741599d9a5a1bfC40A22f530fbCd85E2718e9F90)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_lisk (eth:0x74Cb66502D855992137c5dC8A502c396A6E77931)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_metis (eth:0x75d536eED32f4c8Bb39F4B0c992163f5BA49B84e)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_2_from_mode (eth:0x76264869a3eBF51a59FCa5ABa84ee2867c7F190e)
    +++ description: v1.2 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.2 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_celo (eth:0x794aE32b63b8a82a6e2Ec5017bbC6bfbddA5ce96)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract RMNProposerMCMS (eth:0x79bC82F3931A7d017719146A822e4AD8152b157e)
    +++ description: Chainlink's merkle-root-based multisig (MCMS). Signers are grouped into up to NUM_GROUPS hierarchical groups; each group has a quorum (groupQuorums) and a parent (groupParents) forming a tree. A merkle root of (chain, contract, data) operations is valid once the root of the group tree is signed. Then anyone can execute individual ops under that root via setRoot / execute.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_hedera (eth:0x7A82D2d3d824f9BAc136C31ef8086C673d23666D)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_2_from_bsc (eth:0x7Afe7088aff57173565F4b034167643AA8b9171c)
    +++ description: v1.2 CCIP inbound ramp — one instance per source chain it serves. Still active for sources whose lane has not been migrated to v1.5. A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Owner can rotate OCR signers/transmitters, change dynamic config, and change rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_corn (eth:0x7B78f8D16C4ae6E51c29295D58f05dCC67180A2b)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_hemi (eth:0x7d7C4933f17B414f50C97d1a8862A1ace82557B3)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract Router (eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D)
    +++ description: User-facing CCIP entry point. ccipSend routes outbound messages to the destination-chain OnRamp registered for the destination chain selector. Inbound messages are delivered by OffRamps via routeMessage. Owner can replace the OnRamp for any destination (outbound attack surface) and add or remove OffRamps (inbound attack surface). The wrappedNative field names the WETH-like token users pay native fees in.
```

```diff
+   Status: CREATED
    contract RMNCancellerMCMS (eth:0x806659842cFeEE3CBEF35F8ad2eA42460574b413)
    +++ description: Chainlink's merkle-root-based multisig (MCMS). Signers are grouped into up to NUM_GROUPS hierarchical groups; each group has a quorum (groupQuorums) and a parent (groupParents) forming a tree. A merkle root of (chain, contract, data) operations is valid once the root of the group tree is signed. Then anyone can execute individual ops under that root via setRoot / execute.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_lens (eth:0x807dd69Bc9BC4e9411490f7b79Ff30c91E799A04)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CCIPExecutorProxy (eth:0x82b8A19497fA25575f250a3DcFfCD2562B575A2e)
    +++ description: Minimal immutable forwarder that anyone can call to invoke a target with calldata. When granted EXECUTOR_ROLE on a Timelock, it makes timelocked operations publicly executable by any caller once the delay has elapsed (no privileged keeper needed). Grants no delay-skipping power; only serves as the public execution pathway after the delay.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_lisk (eth:0x82dAe15e45D63f2Ae85B1f0D690685A021D3a0fC)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_2_from_celo (eth:0x831097033C88c82a7F1897b168Aa88cC44540C8f)
    +++ description: v1.2 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.2 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_optimism (eth:0x83F3DA5aa2C7534d694B0acde7624573c830250D)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_kaia (eth:0x8469b5AbD81987F9347c0bAbd47b9eB11dA7d0dF)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_botanix (eth:0x86768e4e4B2E3C1CF812D5C8A7c7becFA4c8D486)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_metal (eth:0x8693cdA8E6D3Aee7c9fC258c3E7F648c8E6580c1)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_worldchain (eth:0x8705F734b7ac1FC0bb2d16F60c6eFac5Ed646159)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_2_from_bsc (eth:0x87c55D48DF6EF7B08153Ab079e76bFEcbb793D75)
    +++ description: v1.2 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.2 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_corn (eth:0x8A1680fBbDb3Da1e0E7cA9078435631bEaf8a2cF)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_shibarium (eth:0x8B3eEed4948684c3ec1bb60967820f40285018B8)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_cronoszkevm (eth:0x8b858ED23502611aB86109717C8842A7A8f117ec)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract RMNBypasserMCMS (eth:0x8C00Cc7cC37396e88BbFe66371341a59D1b5771F)
    +++ description: Chainlink's merkle-root-based multisig (MCMS). Signers are grouped into up to NUM_GROUPS hierarchical groups; each group has a quorum (groupQuorums) and a parent (groupParents) forming a tree. A merkle root of (chain, contract, data) operations is valid once the root of the group tree is signed. Then anyone can execute individual ops under that root via setRoot / execute.
```

```diff
+   Status: CREATED
    contract PriceRegistry (eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad)
    +++ description: v1.5 CCIP price registry. Holds the current USD price of each fee-token and the current gas price for each supported destination chain. v1.5 OnRamps query it to compute fees; v1.5 CommitStores push fresh prices into it. Owner can change the set of fee tokens and the set of price-updaters (addresses permitted to push prices).
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_mint (eth:0x8D846b1E9032827546B62160c32aDe293f77B1AB)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_2_from_base (eth:0x8DC27D621c41a32140e22E2a4dAf1259639BAe04)
    +++ description: v1.2 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.2 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_cronos (eth:0x8FC54E798eAC51353E160C9113682714F5e9E262)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_mind (eth:0x8FEE869eDD935391B4979F8C79560102A8594B28)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_6 (eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa)
    +++ description: v1.6 CCIP outbound ramp — a single per-chain contract that serves every destination (as opposed to the per-destination OnRamp in v1.5). Destination is identified by destChainSelector in the emitted CCIPMessageSent event. Uses the FeeQuoter for fee computation, delegates nonce tracking to the NonceManager, and consults the RMN. Owner can swap the dynamic config (FeeQuoter pointer, fee aggregator, allowlist admin, message interceptor) and per-destination configuration.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_unichain (eth:0x913A2AC13907F29EF2346E21368214B9b3dDc04B)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_5214452172935136222 (eth:0x92fBcF9B006189c242146c21f5E8CE4fEa9da04F)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_bsc (eth:0x948306C220Ac325fa9392A6E601042A3CD0b480d)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_celo (eth:0x95deB0c4bB9168202d50E874865f9A1842b82D64)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_mind (eth:0x98d0f843AE9BA7c55F6e3941E6660a5947a67Ed9)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_ronin (eth:0x9a3Ed7007809CfD666999e439076B4Ce4120528D)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_zksync2 (eth:0x9B14AE850653dD0E30fBC93ab7f77D0d638a365B)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_2_from_arbitrum (eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749)
    +++ description: v1.2 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.2 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_bsc (eth:0x9B9Ec8E26955c034828bBD78E22ab258d983dCdb)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_mind (eth:0x9cb0FF2Ea9110dc8831b39F620811a0da09747D3)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_7222032299962346917 (eth:0x9cbbA13011CD9D9310Ff9f1F6515582d6518a90e)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_gnosis (eth:0x9D93D536Ced80871Bf3DA5Bb47bAedE62c794f8A)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_hemi (eth:0x9de971a8449Bc9F31Fe7B0F2Ccdab3873f711988)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_abstract (eth:0x9f0E818A8DDDf48C52d5c94D55079E3617d55181)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_linea (eth:0x9f592c28590595F3F78a8881E8Dbb9984ed705cD)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_wemix (eth:0xA4755Cd68CA2092447c8c842659a2931f9110320)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_zircuit (eth:0xA48269e5c9A234daBfEBE98b82390Be705536d1c)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_2_from_zksync2 (eth:0xa4d264470a67D9f6682EE12Bdc9c35Df44e3F194)
    +++ description: v1.2 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.2 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_bsquared (eth:0xa58818D1acD8D62ab077a1F79606fCb5CE3741b9)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_berachain (eth:0xA627F208c5c32e5638c64147d0aC98bb40F758f0)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_core (eth:0xa6D806e4EB8726542cf536518fC47f39d68cCb48)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_hyperevm (eth:0xA7E77BD47e2fDeE61df271E8b9206F3F1E804427)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_katana (eth:0xa8c12a859225531254dDef7079030f7DD6992A14)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_avalanche (eth:0xA9f9bF2b643348c0884f2eBA4F712E833DA9a2b8)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_unichain (eth:0xaA0DA3e06F43a5227abB0eA7D6DF3d1037B1769B)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CCIPCancellerMCMS (eth:0xAD97C0270a243270136E40278155C12ce7C7F87B)
    +++ description: Chainlink's merkle-root-based multisig (MCMS). Signers are grouped into up to NUM_GROUPS hierarchical groups; each group has a quorum (groupQuorums) and a parent (groupParents) forming a tree. A merkle root of (chain, contract, data) operations is valid once the root of the group tree is signed. Then anyone can execute individual ops under that root via setRoot / execute.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_cronos (eth:0xAe2A2A088A8F85A2DB90A61BD463433985C437F0)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_avalanche (eth:0xaFd31C0C78785aDF53E4c185670bfd5376249d8A)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_2_from_optimism (eth:0xB095900fB91db00E6abD247A5A5AD1cee3F20BF7)
    +++ description: v1.2 CCIP inbound ramp — one instance per source chain it serves. Still active for sources whose lane has not been migrated to v1.5. A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Owner can rotate OCR signers/transmitters, change dynamic config, and change rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_corn (eth:0xb0F5b6DB1157719795eCCd9C6023C66bB2ec414F)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract TokenAdminRegistry (eth:0xb22764f98dD05c789929716D677382Df22C05Cb6)
    +++ description: Registry that maps each ERC20 token to its CCIP TokenPool. Every v1.5+ OnRamp / OffRamp consults this mapping to find the pool for an attached token. Each registered token has its own administrator (distinct from this contract's owner) who can call setPool to redirect the pool for that token, which effectively controls minting/releasing behavior for cross-chain transfers of that token. This contract's owner can appoint or revoke administrators and toggle whether outsiders can self-register tokens.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_2_from_zksync2 (eth:0xb368c8946D9fa5A497cDe1Dff7213f9CdfD143Bf)
    +++ description: v1.2 CCIP inbound ramp — one instance per source chain it serves. Still active for sources whose lane has not been migrated to v1.5. A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Owner can rotate OCR signers/transmitters, change dynamic config, and change rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_sonic (eth:0xB45cF8df3AAa50199B7AaabD345119BAd1b8d977)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_mode (eth:0xb57D52F7Cb7BBD19a117585bbaf712108E56dd8f)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_1546563616611573946 (eth:0xb86C91861A7043fffC26C7740C3678eE09599234)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_base (eth:0xb8a882f3B88bd52D1Ff56A873bfDB84b70431937)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_opbnb (eth:0xbAf669bBe01882082C83F8B2d146057202fc4cB7)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_berachain (eth:0xBeFfEF56Cd6FA063d2e04E126cF1b93269886c42)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_wemix (eth:0xc1EcCE580B2C96f4fd202fB7c2a259ECe19a1bF2)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_core (eth:0xc46890D248a389A40725dbd9fa5e13548B56Ad8d)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_zora (eth:0xc46e2F17c04f2C880Ea56a0c69c4520AdB4aBF88)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_berachain (eth:0xc5164AF94Be6737fE21085eDDa4E43BcBf224F9f)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_katana (eth:0xc5Dbe2055Fa233ece44c99432526F3Fc46cA3FC2)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_sei (eth:0xc876D50A0Ecc147FC0cEd194cD2b66210d482f9c)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_cronoszkevm (eth:0xcdcA3F3aa3A4df41a3DAF885e3E25666Ee96D7e4)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_2_from_metis (eth:0xCe6364dBe64D2789D916180131fAda2ABFF702E8)
    +++ description: v1.2 CCIP inbound ramp — one instance per source chain it serves. Still active for sources whose lane has not been migrated to v1.5. A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Owner can rotate OCR signers/transmitters, change dynamic config, and change rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_7222032299962346917 (eth:0xd079265E929C845707e816E3855721D055d40235)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_bob (eth:0xd2428F8C62fBfEA4b44a703CF11e02D7B0a6Cd99)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_2_from_polygonpos (eth:0xD37a60E8C36E802D2E1a6321832Ee85556Beeb76)
    +++ description: v1.2 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.2 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_2_from_celo (eth:0xd5083684eE92dDeA117636ae5E2F1cb7fE4dfd46)
    +++ description: v1.2 CCIP inbound ramp — one instance per source chain it serves. Still active for sources whose lane has not been migrated to v1.5. A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Owner can rotate OCR signers/transmitters, change dynamic config, and change rate limits.
```

```diff
+   Status: CREATED
    contract CCIPGovSafe (eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_1546563616611573946 (eth:0xd8A0Ab1C5e6BA9b2aC5A998Be3429D4479989224)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_astar (eth:0xD8E8720709a3d9A18a9B281E6148E94149B2E252)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_mantle (eth:0xd8F93Aff87dC2AEEe0D0b0dF347baDA861BFf802)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CCIPProposerMCMS_B (eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e)
    +++ description: Chainlink's merkle-root-based multisig (MCMS). Signers are grouped into up to NUM_GROUPS hierarchical groups; each group has a quorum (groupQuorums) and a parent (groupParents) forming a tree. A merkle root of (chain, contract, data) operations is valid once the root of the group tree is signed. Then anyone can execute individual ops under that root via setRoot / execute.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_avalanche (eth:0xd98E80C79a15E4dbaF4C40B6cCDF690fe619BFBb)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_xlayer (eth:0xD9d3d90D729F50794741Da7a2d54d8B12dC3Da72)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_metal (eth:0xDAa386621aB173C4E788ecebC4F8c2E6EB016819)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_base (eth:0xDaC3A82Cc5e7C137bF28e6EF4F68f29D66205ffe)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_5214452172935136222 (eth:0xDb156E875Ef17dDe70c90a1529023fFf376e627c)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_worldchain (eth:0xdB6ebB3ea15595E516dEf4a9875479573a4F19b6)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_ronin (eth:0xdC5b578ff3AFcC4A4a6E149892b9472390b50844)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_shibarium (eth:0xdCF6F209d36d93A26B251D2CFE994bEF02954110)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_bsquared (eth:0xddF4b4aF7A9603869C90189EFa8826683D0D234b)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_core (eth:0xdE66080eABE390198b8918cb3F61e1869dbC8079)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_bob (eth:0xdE81f1627ef2F6E23A2C0f338623C78c10EA57AC)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_wemix (eth:0xdEFeADd30D5BFD403d86245b43e39a73d76423cC)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_arbitrum (eth:0xdf615eF8D4C64d0ED8Fd7824BBEd2f6a10245aC9)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_2_from_base (eth:0xdf85c8381954694E74abD07488f452b4c2Cddfb3)
    +++ description: v1.2 CCIP inbound ramp — one instance per source chain it serves. Still active for sources whose lane has not been migrated to v1.5. A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Owner can rotate OCR signers/transmitters, change dynamic config, and change rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_soneium (eth:0xdFD8C353044aB175cC96FD4261c2Af3E3AB768a4)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_ronin (eth:0xE41677500B425999cB4133950ca3aB79eA7470a6)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CCIPProposerMCMS_A (eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F)
    +++ description: Chainlink's merkle-root-based multisig (MCMS). Signers are grouped into up to NUM_GROUPS hierarchical groups; each group has a quorum (groupQuorums) and a parent (groupParents) forming a tree. A merkle root of (chain, contract, data) operations is valid once the root of the group tree is signed. Then anyone can execute individual ops under that root via setRoot / execute.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_opbnb (eth:0xe79705E9f6842223C9b07B70119f3468E2962162)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract RMNRemote (eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20)
    +++ description: CCIP v1.6 Risk Management Network on this chain. Holds the curse state (isCursed, getCursedSubjects) that halts CCIP messaging, and the signer set (getVersionedConfig.signers) whose fSign-of-N threshold blesses commit reports off-ramps will execute. A cursed subject (global or per-source-chain) causes the v1.6 OffRamp to refuse execution for any message under that subject. Owner can rotate signers and change the signing threshold.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_2_from_mode (eth:0xE8af3b68eDfFf65Ce48648009982380701f09B92)
    +++ description: v1.2 CCIP inbound ramp — one instance per source chain it serves. Still active for sources whose lane has not been migrated to v1.5. A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Owner can rotate OCR signers/transmitters, change dynamic config, and change rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_2_from_gnosis (eth:0xE93ec2A57e38C8541c893348cCafEAB01F7D47d4)
    +++ description: v1.2 CCIP inbound ramp — one instance per source chain it serves. Still active for sources whose lane has not been migrated to v1.5. A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Owner can rotate OCR signers/transmitters, change dynamic config, and change rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_mode (eth:0xeA6d4a24B262aB3e61a8A62f018A30beCD086f82)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_ink (eth:0xEEe2AE1d0Fa6D1D38BBBa555A7C7B90C8734a8e2)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_2_from_arbitrum (eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d)
    +++ description: v1.2 CCIP inbound ramp — one instance per source chain it serves. Still active for sources whose lane has not been migrated to v1.5. A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Owner can rotate OCR signers/transmitters, change dynamic config, and change rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_zora (eth:0xF191733ea5be14E4a5f381a3c375A4F3F8fd4793)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_hashkey (eth:0xf2EB4CE854C8C0AAea6080Ef825efA5A84a8656a)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_bsquared (eth:0xF3AC96642F9BA5De3BBc864d609E3F534dD3b7F9)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_blast (eth:0xF4468E56179e6EF59d6f5B133D9355AAD91Ea9ae)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_gnosis (eth:0xf50B9A46C394bD98491ce163d420222d8030F6F0)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_arbitrum (eth:0xf7B343A17445F175f2Dd9f5CB29BAf0a8dE75ed3)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_hedera (eth:0xf7D68CcC92B836316C40B24ea77F6805DcBb8F02)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_astar (eth:0xFa94e57b12b6C45A3aD3CBb9451ba99a997eb210)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_apechain (eth:0xfacFe88fdf03Ab7D30d6CA45A070Df7C54551fd6)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OffRamp_v1_5_from_monad (eth:0xfC92C3b8a374F70cb46cf884D4f02bb120f0F0a3)
    +++ description: v1.5 CCIP inbound ramp — one instance per source chain (sometimes multiple per source while old versions are being decommissioned). A Chainlink OCR DON signs execution reports (a list of messages to execute + their merkle proofs); a transmitter submits the report on-chain; the OffRamp verifies each message's proof against the commit root in its paired CommitStore, consults RMN for curse state, and delivers the message to the Router. Tokens are released/minted via the per-token TokenPool. Owner can change the dynamic config and rate limits.
```

```diff
+   Status: CREATED
    contract CommitStore_v1_5_from_rootstock (eth:0xFE73BccC5b88D22969099EBb4E2eb5e19eFb0165)
    +++ description: v1.5 CCIP inbound-lane commit root store — one per source chain, paired 1:1 with a v1.5 OffRamp. A Chainlink OCR DON posts signed commit reports (merkle root of messages sent on the source chain + sequence range + token-price updates) here. Once ARM has blessed the root, the paired OffRamp accepts merkle proofs against it to execute messages. Owner can rotate the OCR committee (f, signers, transmitters, configDigest), change the dynamic config, and pause.
```

```diff
+   Status: CREATED
    contract OnRamp_v1_5_to_opbnb (eth:0xffbEC42C001f0E54924078C6D36412128bBC4330)
    +++ description: v1.5 CCIP outbound ramp — one instance per destination chain. Takes ccipSend calls from the Router, computes fees via the PriceRegistry, collects them in the fee token, locks/burns any attached token amounts via their TokenPool, and emits CCIPSendRequested. Owner can change the dynamic config (fee tokens, gas limits, message interceptor) and disable the ramp. Funds do NOT sit here: token custody is in per-token TokenPools; fees in the fee aggregator.
```
