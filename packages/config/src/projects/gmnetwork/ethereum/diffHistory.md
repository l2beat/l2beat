Generated with discovered.json: 0x6966a9a8d0343532caf1100e69addc87458ae388

# Diff at Tue, 04 Mar 2025 11:25:45 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21235441
- current block number: 21235441

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x18dba6d1a5cf356a27aea6b4d85031c218b5eb69

# Diff at Tue, 04 Mar 2025 10:39:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21235441
- current block number: 21235441

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x081A54442Af40a26Ae453Da0F044a49Aa3314453) {
    +++ description: None
      sinceBlock:
+        20031092
    }
```

```diff
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        20031107
    }
```

```diff
    contract OptimismMintableERC20Factory (0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        20031109
    }
```

```diff
    contract L2OutputOracle (0x53C64d7c9a28911203Ba4BE2a6cA58254184920a) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        20031112
    }
```

```diff
    contract L1ERC721Bridge (0x6345b54426A5B80A377d07C97672331Bda3432e6) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        20031110
    }
```

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        20031106
    }
```

```diff
    contract SuperchainConfig (0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        20031095
    }
```

```diff
    contract AddressManager (0xCD749A3e59543B31658b725136Ef3616bE7001bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        20031091
    }
```

```diff
    contract DataAvailabilityChallenge (0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      sinceBlock:
+        20031101
    }
```

```diff
    contract OptimismPortal (0xd2726bde3D07645faf5aD7cCF15C94817B3556D6) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        20031105
    }
```

```diff
    contract L1CrossDomainMessenger (0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        20031108
    }
```

```diff
    contract GmMultisig (0xf040a7A04e914E1b4383C04359D03Ab5F12E7828) {
    +++ description: None
      sinceBlock:
+        20031090
    }
```

Generated with discovered.json: 0xaed7da699c192b7469fe984c9e894c972c51b4f6

# Diff at Wed, 26 Feb 2025 10:32:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21235441
- current block number: 21235441

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0x53C64d7c9a28911203Ba4BE2a6cA58254184920a) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0x6345b54426A5B80A377d07C97672331Bda3432e6) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract DataAvailabilityChallenge (0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OptimismPortal (0xd2726bde3D07645faf5aD7cCF15C94817B3556D6) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x306b427d1cfcb2c8dfcc32bb433106d751fecbac

# Diff at Fri, 21 Feb 2025 14:07:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21235441
- current block number: 21235441

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x53C64d7c9a28911203Ba4BE2a6cA58254184920a) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x7ac41dea43d522844456cc6c7432b936803a8429

# Diff at Fri, 21 Feb 2025 08:59:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21235441
- current block number: 21235441

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1CrossDomainMessenger (0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0xa35fbfbb17654d52ffa0ddfd4a3313c91c7a16b2

# Diff at Mon, 10 Feb 2025 19:04:00 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21235441
- current block number: 21235441

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0xa1caf380818608eda6297ff2166ff3653050c627

# Diff at Tue, 04 Feb 2025 12:31:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21235441
- current block number: 21235441

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x081A54442Af40a26Ae453Da0F044a49Aa3314453) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xCD749A3e59543B31658b725136Ef3616bE7001bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract DataAvailabilityChallenge (0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GmMultisig (0xf040a7A04e914E1b4383C04359D03Ab5F12E7828) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xcfcaaab272ce2fe9521df7028334c0a36279de1c

# Diff at Mon, 20 Jan 2025 11:09:33 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21235441
- current block number: 21235441

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x081A54442Af40a26Ae453Da0F044a49Aa3314453) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      directlyReceivedPermissions.8.from:
+        "0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      directlyReceivedPermissions.7.target:
-        "0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
      directlyReceivedPermissions.7.from:
+        "0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
      directlyReceivedPermissions.6.target:
-        "0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      directlyReceivedPermissions.6.from:
+        "0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      directlyReceivedPermissions.5.target:
-        "0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      directlyReceivedPermissions.5.from:
+        "0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      directlyReceivedPermissions.4.target:
-        "0x6345b54426A5B80A377d07C97672331Bda3432e6"
      directlyReceivedPermissions.4.from:
+        "0x6345b54426A5B80A377d07C97672331Bda3432e6"
      directlyReceivedPermissions.3.target:
-        "0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      directlyReceivedPermissions.3.from:
+        "0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      directlyReceivedPermissions.2.target:
-        "0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
      directlyReceivedPermissions.2.from:
+        "0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
      directlyReceivedPermissions.1.target:
-        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      directlyReceivedPermissions.1.from:
+        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      directlyReceivedPermissions.0.target:
-        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
      directlyReceivedPermissions.0.from:
+        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
    }
```

```diff
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
    }
```

```diff
    contract L2OutputOracle (0x53C64d7c9a28911203Ba4BE2a6cA58254184920a) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.1.target:
-        "0x4FACE9ec6237C04a22d434989Beb30b43055886D"
      issuedPermissions.1.to:
+        "0x4FACE9ec6237C04a22d434989Beb30b43055886D"
      issuedPermissions.0.target:
-        "0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9"
      issuedPermissions.0.to:
+        "0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9"
    }
```

```diff
    contract L1ERC721Bridge (0x6345b54426A5B80A377d07C97672331Bda3432e6) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
    }
```

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.1.target:
-        "0xd668A64E69ef82026deB46491BFCd28ba14024C8"
      issuedPermissions.1.to:
+        "0xd668A64E69ef82026deB46491BFCd28ba14024C8"
      issuedPermissions.0.target:
-        "0x652b0ee2F6727e3627328E170Fa2373B50E81601"
      issuedPermissions.0.to:
+        "0x652b0ee2F6727e3627328E170Fa2373B50E81601"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract SuperchainConfig (0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.target:
-        "0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
      issuedPermissions.0.to:
+        "0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
    }
```

```diff
    contract AddressManager (0xCD749A3e59543B31658b725136Ef3616bE7001bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract DataAvailabilityChallenge (0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions.1.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.target:
-        "0x652b0ee2F6727e3627328E170Fa2373B50E81601"
      issuedPermissions.0.to:
+        "0x652b0ee2F6727e3627328E170Fa2373B50E81601"
      issuedPermissions.0.description:
+        "can upgrade the parameters of DA challenges like the bond size or refund percentages, potentially making challenges infeasable or insecure."
    }
```

```diff
    contract OptimismPortal (0xd2726bde3D07645faf5aD7cCF15C94817B3556D6) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.target:
-        "0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
      issuedPermissions.0.to:
+        "0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
    }
```

```diff
    contract GmMultisig (0xf040a7A04e914E1b4383C04359D03Ab5F12E7828) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      receivedPermissions.8.from:
+        "0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      receivedPermissions.7.target:
-        "0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
      receivedPermissions.7.from:
+        "0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
      receivedPermissions.6.target:
-        "0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      receivedPermissions.6.from:
+        "0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      receivedPermissions.5.target:
-        "0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      receivedPermissions.5.from:
+        "0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      receivedPermissions.4.target:
-        "0x6345b54426A5B80A377d07C97672331Bda3432e6"
      receivedPermissions.4.from:
+        "0x6345b54426A5B80A377d07C97672331Bda3432e6"
      receivedPermissions.3.target:
-        "0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      receivedPermissions.3.from:
+        "0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      receivedPermissions.2.target:
-        "0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
      receivedPermissions.2.from:
+        "0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
      receivedPermissions.1.target:
-        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      receivedPermissions.1.from:
+        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      receivedPermissions.0.target:
-        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
      receivedPermissions.0.from:
+        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
      directlyReceivedPermissions.0.target:
-        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      directlyReceivedPermissions.0.from:
+        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
    }
```

Generated with discovered.json: 0x4afdcef136dc21f930a744954b7ee00aa7d2491e

# Diff at Wed, 08 Jan 2025 09:01:30 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21235441
- current block number: 21235441

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x5a8b4b3276f73ea8f15defaf1ba19c122454c46f

# Diff at Tue, 19 Nov 2024 15:24:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21222656

## Description

OP stack in alt-DA mode, not using EigenDA currently (judging from the DA-service byte in the tx data commitments). Thus BasementDA with DA challenges. Challenges must be respected in the L2 node's derivation rule, which is not clear here, but we assume they use the standard node like xterio, redstone, cyber.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x081A54442Af40a26Ae453Da0F044a49Aa3314453)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x53C64d7c9a28911203Ba4BE2a6cA58254184920a)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x6345b54426A5B80A377d07C97672331Bda3432e6)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract AddressManager (0xCD749A3e59543B31658b725136Ef3616bE7001bc)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6)
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xd2726bde3D07645faf5aD7cCF15C94817B3556D6)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract GmMultisig (0xf040a7A04e914E1b4383C04359D03Ab5F12E7828)
    +++ description: None
```
