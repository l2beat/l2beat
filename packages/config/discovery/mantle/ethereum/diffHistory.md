Generated with discovered.json: 0x26cd811b4563d0d63f285e1ec5d26af71db00c17

# Diff at Tue, 04 Mar 2025 11:25:58 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21872493
- current block number: 21872493

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872493 (main branch discovery), not current.

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x33174b6f0ddec893f48f3e481d4d25f79497e9df

# Diff at Tue, 04 Mar 2025 10:39:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21872493
- current block number: 21872493

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872493 (main branch discovery), not current.

```diff
    contract PauserRegistry (0x075a48633dc6845f92339741E9c96b88f1b2A86f) {
    +++ description: None
      sinceBlock:
+        17575800
    }
```

```diff
    contract MantleTokenProxyAdmin (0x0cac2B1a172ac24012621101634DD5ABD6399ADd) {
    +++ description: None
      sinceBlock:
+        17519057
    }
```

```diff
    contract BLSRegistry (0x1eD35B793d887e028493dAC4a11AA5Feb811dd67) {
    +++ description: This contract stores the number of Mantle DA operators and their public keys. It also store the quorum threshold and the minimum stake required to be part of the quorum.
      sinceBlock:
+        17575899
    }
```

```diff
    contract InvestmentManager (0x23754725a49c0f003C349A6C7869fF8609a7CEfd) {
    +++ description: Contract managing different investment strategies, forked from EigenLayer StrategyManager.
      sinceBlock:
+        17575809
    }
```

```diff
    contract ProxyAdmin (0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83) {
    +++ description: None
      sinceBlock:
+        17575798
    }
```

```diff
    contract MantleEngineeringMultisig (0x2F44BD2a54aC3fB20cd7783cF94334069641daC9) {
    +++ description: None
      sinceBlock:
+        17491078
    }
```

```diff
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19434935
    }
```

```diff
    contract L1MantleToken (0x3c3a81e81dc49A522A592e7622A7E711c06bf354) {
    +++ description: MNT token contract: Mantle uses Mantle (MNT) as the designated gas token, allowing users pay for gas in MNT.
      sinceBlock:
+        17519070
    }
```

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19434945
    }
```

```diff
    contract ProxyAdmin (0x47D58744D8515d9aaEAf961bc03625118bd91EBb) {
    +++ description: None
      sinceBlock:
+        17575885
    }
```

```diff
    contract PauserRegistry2 (0x4ca725D446EcE6e3fFd3E072A6f2A6a16Ca492D0) {
    +++ description: None
      sinceBlock:
+        17575887
    }
```

```diff
    contract MantleSecurityMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: None
      sinceBlock:
+        17212573
    }
```

```diff
    contract EigenDataLayerChain (0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A) {
    +++ description: None
      sinceBlock:
+        17604795
    }
```

```diff
    contract DataLayrServiceManager (0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1) {
    +++ description: This contract is the main entry point for data availability. It is responsible for storing transaction data headers and confirming the data store by verifying operators signatures.
      sinceBlock:
+        17575893
    }
```

```diff
    contract TimelockController (0x65331ff6F8B0fc2612F2a0deBD9d04Fce60a447F) {
    +++ description: A timelock with access control. The current minimum delay is 1d.
      sinceBlock:
+        21829257
    }
```

```diff
    contract L1CrossDomainMessenger (0x676A795fe6E43C17c668de16730c3F690FEB7120) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        17577670
    }
```

```diff
    contract AddressManager (0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        17577535
    }
```

```diff
    contract PubkeyCompendium (0x92986cd63C3409b7dA2882624B6d6E7Cf660707a) {
    +++ description: None
      sinceBlock:
+        17575895
    }
```

```diff
    contract L1StandardBridge (0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        17577718
    }
```

```diff
    contract MantleSecondStrat (0xA937660031787C4408587D2c6A67Ec4B260630F5) {
    +++ description: Basic do-nothing investment strategy.
      sinceBlock:
+        17575837
    }
```

```diff
    contract RegistryPermission (0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01) {
    +++ description: None
      sinceBlock:
+        17575811
    }
```

```diff
    contract OptimismPortal (0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19434938
    }
```

```diff
    contract DataLayrChallenge (0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94) {
    +++ description: None
      sinceBlock:
+        17575897
    }
```

```diff
    contract ProxyAdmin (0xca35F8338054739D138884685e08b39EE2217794) {
    +++ description: None
      sinceBlock:
+        19434932
    }
```

```diff
    contract MantleFirstStrat (0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1) {
    +++ description: Basic do-nothing investment strategy.
      sinceBlock:
+        17575833
    }
```

```diff
    contract DataLayrChallengeUtils (0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D) {
    +++ description: None
      sinceBlock:
+        17575891
    }
```

```diff
    contract Delegation (0xeA4F1fE4928f1f83a450899C068bcd455BaF4798) {
    +++ description: None
      sinceBlock:
+        17575805
    }
```

Generated with discovered.json: 0xf361f459831961995f6d57fcbe6c3555a80c6d73

# Diff at Thu, 27 Feb 2025 11:45:59 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21872493
- current block number: 21872493

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872493 (main branch discovery), not current.

```diff
    contract AddressManager (0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      name:
-        "Lib_AddressManager"
+        "AddressManager"
      displayName:
-        "AddressManager"
    }
```

Generated with discovered.json: 0x8c81b0e07bb01de495880b587ead2e84897db936

# Diff at Wed, 26 Feb 2025 10:32:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21872493
- current block number: 21872493

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872493 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x676A795fe6E43C17c668de16730c3F690FEB7120) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xf2663f8aca34c891cb7a85f474daa791a70e713a

# Diff at Fri, 21 Feb 2025 14:08:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21872493
- current block number: 21872493

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872493 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x0617a66fc5c7e14b3ad0e8bf54216e6135d80fa2

# Diff at Fri, 21 Feb 2025 08:59:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21872493
- current block number: 21872493

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872493 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x676A795fe6E43C17c668de16730c3F690FEB7120) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0x30615bb2b8a42cca9d35c7d162a672d0472a606f

# Diff at Tue, 18 Feb 2025 10:00:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@aff7e43e1c06f559de916763e04088cc23b3e08e block: 21844254
- current block number: 21872493

## Description

Token ProxyAdmin owner transfered to a timelock.

## Watched changes

```diff
    contract MantleTokenProxyAdmin (0x0cac2B1a172ac24012621101634DD5ABD6399ADd) {
    +++ description: None
      values.owner:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
+        "0x65331ff6F8B0fc2612F2a0deBD9d04Fce60a447F"
    }
```

```diff
    contract L1MantleToken (0x3c3a81e81dc49A522A592e7622A7E711c06bf354) {
    +++ description: MNT token contract: Mantle uses Mantle (MNT) as the designated gas token, allowing users pay for gas in MNT.
      issuedPermissions.0.via.1:
+        {"address":"0x0cac2B1a172ac24012621101634DD5ABD6399ADd"}
      issuedPermissions.0.via.0.address:
-        "0x0cac2B1a172ac24012621101634DD5ABD6399ADd"
+        "0x65331ff6F8B0fc2612F2a0deBD9d04Fce60a447F"
      issuedPermissions.0.via.0.delay:
+        86400
    }
```

```diff
    contract MantleSecurityMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: None
      receivedPermissions.22:
+        {"permission":"upgrade","from":"0xeA4F1fE4928f1f83a450899C068bcd455BaF4798","via":[{"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}]}
      receivedPermissions.21:
+        {"permission":"upgrade","from":"0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D","via":[{"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb"}]}
      receivedPermissions.20:
+        {"permission":"upgrade","from":"0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1","via":[{"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}]}
      receivedPermissions.19:
+        {"permission":"upgrade","from":"0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94","via":[{"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb"}]}
      receivedPermissions.18:
+        {"permission":"upgrade","from":"0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb","via":[{"address":"0xca35F8338054739D138884685e08b39EE2217794"}]}
      receivedPermissions.17.from:
-        "0xeA4F1fE4928f1f83a450899C068bcd455BaF4798"
+        "0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01"
      receivedPermissions.16.from:
-        "0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D"
+        "0xA937660031787C4408587D2c6A67Ec4B260630F5"
      receivedPermissions.16.via.0.address:
-        "0x47D58744D8515d9aaEAf961bc03625118bd91EBb"
+        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
      receivedPermissions.15.from:
-        "0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1"
+        "0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012"
      receivedPermissions.15.via.0.address:
-        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
+        "0xca35F8338054739D138884685e08b39EE2217794"
      receivedPermissions.15.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.14.from:
-        "0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94"
+        "0x92986cd63C3409b7dA2882624B6d6E7Cf660707a"
      receivedPermissions.13.from:
-        "0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"
+        "0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1"
      receivedPermissions.13.via.0.address:
-        "0xca35F8338054739D138884685e08b39EE2217794"
+        "0x47D58744D8515d9aaEAf961bc03625118bd91EBb"
      receivedPermissions.12.from:
-        "0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01"
+        "0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A"
      receivedPermissions.12.via:
-        [{"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}]
      receivedPermissions.11.from:
-        "0xA937660031787C4408587D2c6A67Ec4B260630F5"
+        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
      receivedPermissions.11.via.0.address:
-        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
+        "0xca35F8338054739D138884685e08b39EE2217794"
      receivedPermissions.10.from:
-        "0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012"
+        "0x3c3a81e81dc49A522A592e7622A7E711c06bf354"
      receivedPermissions.10.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.10.via.1:
+        {"address":"0x65331ff6F8B0fc2612F2a0deBD9d04Fce60a447F","delay":86400}
      receivedPermissions.10.via.0.address:
-        "0xca35F8338054739D138884685e08b39EE2217794"
+        "0x0cac2B1a172ac24012621101634DD5ABD6399ADd"
      receivedPermissions.9.from:
-        "0x92986cd63C3409b7dA2882624B6d6E7Cf660707a"
+        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
      receivedPermissions.9.via.0.address:
-        "0x47D58744D8515d9aaEAf961bc03625118bd91EBb"
+        "0xca35F8338054739D138884685e08b39EE2217794"
      receivedPermissions.8.from:
-        "0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1"
+        "0x23754725a49c0f003C349A6C7869fF8609a7CEfd"
      receivedPermissions.8.via.0.address:
-        "0x47D58744D8515d9aaEAf961bc03625118bd91EBb"
+        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
      receivedPermissions.7.from:
-        "0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A"
+        "0x1eD35B793d887e028493dAC4a11AA5Feb811dd67"
      receivedPermissions.7.via:
+        [{"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb"}]
      receivedPermissions.6.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.6.from:
-        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
+        "0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42"
      receivedPermissions.6.description:
+        "set and change address mappings."
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0x3c3a81e81dc49A522A592e7622A7E711c06bf354"
+        "0x65331ff6F8B0fc2612F2a0deBD9d04Fce60a447F"
      receivedPermissions.5.via:
-        [{"address":"0x0cac2B1a172ac24012621101634DD5ABD6399ADd"}]
      receivedPermissions.5.description:
+        "propose transactions."
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.from:
-        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
+        "0x65331ff6F8B0fc2612F2a0deBD9d04Fce60a447F"
      receivedPermissions.4.via:
-        [{"address":"0xca35F8338054739D138884685e08b39EE2217794"}]
      receivedPermissions.4.description:
+        "manage all access control roles."
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0x23754725a49c0f003C349A6C7869fF8609a7CEfd"
+        "0x65331ff6F8B0fc2612F2a0deBD9d04Fce60a447F"
      receivedPermissions.3.via.0.address:
-        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
+        "0x65331ff6F8B0fc2612F2a0deBD9d04Fce60a447F"
      receivedPermissions.3.via.0.delay:
+        86400
      receivedPermissions.3.description:
+        "manage all access control roles."
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0x1eD35B793d887e028493dAC4a11AA5Feb811dd67"
+        "0x65331ff6F8B0fc2612F2a0deBD9d04Fce60a447F"
      receivedPermissions.2.via:
-        [{"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb"}]
      receivedPermissions.2.description:
+        "execute transactions that are ready."
      receivedPermissions.1.from:
-        "0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42"
+        "0x65331ff6F8B0fc2612F2a0deBD9d04Fce60a447F"
      receivedPermissions.1.description:
-        "set and change address mappings."
+        "cancel queued transactions."
      receivedPermissions.1.via:
-        [{"address":"0xca35F8338054739D138884685e08b39EE2217794"}]
      directlyReceivedPermissions.2.from:
-        "0x47D58744D8515d9aaEAf961bc03625118bd91EBb"
+        "0x65331ff6F8B0fc2612F2a0deBD9d04Fce60a447F"
      directlyReceivedPermissions.2.delay:
+        86400
      directlyReceivedPermissions.1.from:
-        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
+        "0x47D58744D8515d9aaEAf961bc03625118bd91EBb"
      directlyReceivedPermissions.0.from:
-        "0x0cac2B1a172ac24012621101634DD5ABD6399ADd"
+        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
    }
```

```diff
+   Status: CREATED
    contract TimelockController (0x65331ff6F8B0fc2612F2a0deBD9d04Fce60a447F)
    +++ description: A timelock with access control. The current minimum delay is 1d.
```

## Source code changes

```diff
.../mantle/ethereum/.flat/TimelockController.sol   | 1011 ++++++++++++++++++++
 1 file changed, 1011 insertions(+)
```

Generated with discovered.json: 0x40fd0aceb1b11ae0548b3afd418d36b0ee0edb01

# Diff at Fri, 14 Feb 2025 10:58:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 21680644
- current block number: 21844254

## Description

MS signer changes.

## Watched changes

```diff
    contract MantleSecurityMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: None
      values.$members.6:
-        "0x7735cDcc85E63A7684C29652DbE8B845e0b4635A"
+        "0x4b6CFecA60f8BDF8AbCEE10f033f17cb2a928498"
      values.$members.4:
-        "0xbE73dea9c8DcDdB6b03F7e5797b85982065fe34e"
+        "0xdC3644e172813ADbF6D130262e2416975Ac48Af3"
      values.$members.3:
-        "0x207E804758e28F2b3fD6E4219671B327100b82f8"
+        "0xA3C8f55BE8aF7402d5192b343E8BfE4BB9795C2F"
      values.$members.2:
-        "0x422f2df38B96395A7E61d4C02aDd4413bb79A9FC"
+        "0x50dCf0B40E593301aA75DcB54f36f379607595CE"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x7735cDcc85E63A7684C29652DbE8B845e0b4635A)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafe/GnosisSafe.sol => /dev/null         | 953 ---------------------
 .../GnosisSafe/GnosisSafeProxy.p.sol => /dev/null  |  35 -
 2 files changed, 988 deletions(-)
```

Generated with discovered.json: 0xe4d8cddd84a7321c4a3efc6354505347078a6f1b

# Diff at Mon, 10 Feb 2025 19:04:14 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21680644
- current block number: 21680644

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680644 (main branch discovery), not current.

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x79eafeddf5109bc94236e6500db930f6e22cdb22

# Diff at Tue, 04 Feb 2025 12:31:42 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21680644
- current block number: 21680644

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680644 (main branch discovery), not current.

```diff
    contract PauserRegistry (0x075a48633dc6845f92339741E9c96b88f1b2A86f) {
    +++ description: None
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract BLSRegistry (0x1eD35B793d887e028493dAC4a11AA5Feb811dd67) {
    +++ description: This contract stores the number of Mantle DA operators and their public keys. It also store the quorum threshold and the minimum stake required to be part of the quorum.
      issuedPermissions.9.permission:
-        "configure"
+        "interact"
      issuedPermissions.8.permission:
-        "configure"
+        "interact"
      issuedPermissions.7.permission:
-        "configure"
+        "interact"
      issuedPermissions.6.permission:
-        "configure"
+        "interact"
      issuedPermissions.5.permission:
-        "configure"
+        "interact"
      issuedPermissions.4.permission:
-        "configure"
+        "interact"
      issuedPermissions.3.permission:
-        "configure"
+        "interact"
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract InvestmentManager (0x23754725a49c0f003C349A6C7869fF8609a7CEfd) {
    +++ description: Contract managing different investment strategies, forked from EigenLayer StrategyManager.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract MantleSecurityMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: None
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Lib_AddressManager (0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract MantleSecondStrat (0xA937660031787C4408587D2c6A67Ec4B260630F5) {
    +++ description: Basic do-nothing investment strategy.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RegistryPermission (0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01) {
    +++ description: None
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0xca35F8338054739D138884685e08b39EE2217794) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract MantleFirstStrat (0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1) {
    +++ description: Basic do-nothing investment strategy.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x4a6a913712349bbfa9bb2c223add75788e9f9c6a

# Diff at Mon, 27 Jan 2025 08:44:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@19f9c78c593bd40f9a0b28c3dce98eac1bd1d1b8 block: 21680644
- current block number: 21680644

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21680644 (main branch discovery), not current.

```diff
    contract EigenDataLayerChain (0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"configure","from":"0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01","description":"can post data commitments to the DA bridge."}]
    }
```

```diff
    contract RegistryPermission (0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01) {
    +++ description: None
      issuedPermissions.3:
-        {"permission":"upgrade","to":"0x4e59e778a0fb77fBb305637435C62FaeD9aED40f","via":[{"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}]}
      issuedPermissions.2:
-        {"permission":"configure","to":"0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A","description":"can post data commitments to the DA bridge.","via":[]}
      issuedPermissions.1.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.1.to:
-        "0x2f40D796917ffB642bD2e2bdD2C762A5e40fd749"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.1.description:
-        "can post data commitments to the DA bridge."
      issuedPermissions.1.via.0:
+        {"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}
    }
```

Generated with discovered.json: 0x69900d75b4626ceab1aff3d4b730ef346975432c

# Diff at Wed, 22 Jan 2025 14:31:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae0363af45e5c1f3ac9d68ef4ce62fdaada6de1c block: 21628468
- current block number: 21680644

## Description

Refined mantle DA permissions.

MS member change.

## Watched changes

```diff
    contract MantleSecurityMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: None
      values.$members.5:
-        "0x5a021DC06A9630bb56099b8aEdfaDC2dEa7eB317"
+        "0x4A42577Bf6e51127c490F3639F5c8B90Ec53f5B1"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628468 (main branch discovery), not current.

```diff
    contract PauserRegistry (0x075a48633dc6845f92339741E9c96b88f1b2A86f) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x23754725a49c0f003C349A6C7869fF8609a7CEfd","description":"defines addresses that can pause or unpause ability to invest into strategies."},{"permission":"configure","from":"0xA937660031787C4408587D2c6A67Ec4B260630F5","description":"defines addresses that can pause or unpause ability to deposit tokens into strategies."},{"permission":"configure","from":"0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1","description":"defines addresses that can pause or unpause ability to deposit tokens into strategies."}]
    }
```

```diff
    contract BLSRegistry (0x1eD35B793d887e028493dAC4a11AA5Feb811dd67) {
    +++ description: This contract stores the number of Mantle DA operators and their public keys. It also store the quorum threshold and the minimum stake required to be part of the quorum.
      issuedPermissions.10:
+        {"permission":"upgrade","to":"0x4e59e778a0fb77fBb305637435C62FaeD9aED40f","via":[{"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb"}]}
      issuedPermissions.9:
+        {"permission":"configure","to":"0xcEb157a9bB9c80a845d5924e8CEAA591Caf705a5","description":"sign data commitments for the DA bridge.","via":[]}
      issuedPermissions.8:
+        {"permission":"configure","to":"0xc1dEd495E1dDf089B2b41d6397C0aBa04BDA1A21","description":"sign data commitments for the DA bridge.","via":[]}
      issuedPermissions.7:
+        {"permission":"configure","to":"0xB61298691FE0df10634A67dd83b2253E74cbF7fb","description":"sign data commitments for the DA bridge.","via":[]}
      issuedPermissions.6:
+        {"permission":"configure","to":"0x8BEF0466b7C2CbFD753eF340e062dF06E93ADA7f","description":"sign data commitments for the DA bridge.","via":[]}
      issuedPermissions.5:
+        {"permission":"configure","to":"0x8A3D6c77E5BAcE8cb0822B28E4Fc56FC06fB5645","description":"sign data commitments for the DA bridge.","via":[]}
      issuedPermissions.4:
+        {"permission":"configure","to":"0x717c3DC6Df69c316d6Ac593077BC84Cc86f214A4","description":"sign data commitments for the DA bridge.","via":[]}
      issuedPermissions.3:
+        {"permission":"configure","to":"0x6cc5A6F5a9E4757790e4068Aa9757226Cb854B64","description":"sign data commitments for the DA bridge.","via":[]}
      issuedPermissions.2:
+        {"permission":"configure","to":"0x550b3CB2D5fB5E4F0A08322CaC7b04291558CDa8","description":"sign data commitments for the DA bridge.","via":[]}
      issuedPermissions.1:
+        {"permission":"configure","to":"0x1888e4aC2Ab37A73B33448B87bABdD1ce1dcBAbe","description":"sign data commitments for the DA bridge.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
+        "0x0B6F2C77C3740A5e6f88A4eCdd02C10BE8a2e323"
      issuedPermissions.0.via.0:
-        {"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb"}
      issuedPermissions.0.description:
+        "sign data commitments for the DA bridge."
    }
```

```diff
    contract InvestmentManager (0x23754725a49c0f003C349A6C7869fF8609a7CEfd) {
    +++ description: Contract managing different investment strategies, forked from EigenLayer StrategyManager.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x4e59e778a0fb77fBb305637435C62FaeD9aED40f","via":[{"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
+        "0x075a48633dc6845f92339741E9c96b88f1b2A86f"
      issuedPermissions.0.via.0:
-        {"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}
      issuedPermissions.0.description:
+        "defines addresses that can pause or unpause ability to invest into strategies."
    }
```

```diff
    contract EigenDataLayerChain (0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01","description":"can post data commitments to the DA bridge."}]
    }
```

```diff
    contract MantleSecondStrat (0xA937660031787C4408587D2c6A67Ec4B260630F5) {
    +++ description: Basic do-nothing investment strategy.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x4e59e778a0fb77fBb305637435C62FaeD9aED40f","via":[{"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
+        "0x075a48633dc6845f92339741E9c96b88f1b2A86f"
      issuedPermissions.0.via.0:
-        {"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}
      issuedPermissions.0.description:
+        "defines addresses that can pause or unpause ability to deposit tokens into strategies."
    }
```

```diff
    contract RegistryPermission (0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01) {
    +++ description: None
      issuedPermissions.3:
+        {"permission":"upgrade","to":"0x4e59e778a0fb77fBb305637435C62FaeD9aED40f","via":[{"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}]}
      issuedPermissions.2:
+        {"permission":"configure","to":"0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A","description":"can post data commitments to the DA bridge.","via":[]}
      issuedPermissions.1:
+        {"permission":"configure","to":"0x2f40D796917ffB642bD2e2bdD2C762A5e40fd749","description":"can post data commitments to the DA bridge.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
+        "0x207E804758e28F2b3fD6E4219671B327100b82f8"
      issuedPermissions.0.via.0:
-        {"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}
      issuedPermissions.0.description:
+        "can register or change status of DA node operators."
    }
```

```diff
    contract MantleFirstStrat (0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1) {
    +++ description: Basic do-nothing investment strategy.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x4e59e778a0fb77fBb305637435C62FaeD9aED40f","via":[{"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
+        "0x075a48633dc6845f92339741E9c96b88f1b2A86f"
      issuedPermissions.0.via.0:
-        {"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}
      issuedPermissions.0.description:
+        "defines addresses that can pause or unpause ability to deposit tokens into strategies."
    }
```

Generated with discovered.json: 0x856e8d101462721c93e61079414df593a1e69ba4

# Diff at Mon, 20 Jan 2025 11:09:44 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628468
- current block number: 21628468

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628468 (main branch discovery), not current.

```diff
    contract MantleTokenProxyAdmin (0x0cac2B1a172ac24012621101634DD5ABD6399ADd) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x3c3a81e81dc49A522A592e7622A7E711c06bf354"
      directlyReceivedPermissions.0.from:
+        "0x3c3a81e81dc49A522A592e7622A7E711c06bf354"
    }
```

```diff
    contract BLSRegistry (0x1eD35B793d887e028493dAC4a11AA5Feb811dd67) {
    +++ description: This contract stores the number of Mantle DA operators and their public keys. It also store the quorum threshold and the minimum stake required to be part of the quorum.
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
    }
```

```diff
    contract InvestmentManager (0x23754725a49c0f003C349A6C7869fF8609a7CEfd) {
    +++ description: Contract managing different investment strategies, forked from EigenLayer StrategyManager.
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
    }
```

```diff
    contract ProxyAdmin (0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83) {
    +++ description: None
      directlyReceivedPermissions.4.target:
-        "0xeA4F1fE4928f1f83a450899C068bcd455BaF4798"
      directlyReceivedPermissions.4.from:
+        "0xeA4F1fE4928f1f83a450899C068bcd455BaF4798"
      directlyReceivedPermissions.3.target:
-        "0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1"
      directlyReceivedPermissions.3.from:
+        "0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1"
      directlyReceivedPermissions.2.target:
-        "0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01"
      directlyReceivedPermissions.2.from:
+        "0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01"
      directlyReceivedPermissions.1.target:
-        "0xA937660031787C4408587D2c6A67Ec4B260630F5"
      directlyReceivedPermissions.1.from:
+        "0xA937660031787C4408587D2c6A67Ec4B260630F5"
      directlyReceivedPermissions.0.target:
-        "0x23754725a49c0f003C349A6C7869fF8609a7CEfd"
      directlyReceivedPermissions.0.from:
+        "0x23754725a49c0f003C349A6C7869fF8609a7CEfd"
    }
```

```diff
    contract MantleEngineeringMultisig (0x2F44BD2a54aC3fB20cd7783cF94334069641daC9) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"
      receivedPermissions.1.from:
+        "0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"
      receivedPermissions.0.target:
-        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
      receivedPermissions.0.from:
+        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
    }
```

```diff
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.1.target:
-        "0x6667961f5e9C98A76a48767522150889703Ed77D"
      issuedPermissions.1.to:
+        "0x6667961f5e9C98A76a48767522150889703Ed77D"
      issuedPermissions.0.target:
-        "0x2F44BD2a54aC3fB20cd7783cF94334069641daC9"
      issuedPermissions.0.to:
+        "0x2F44BD2a54aC3fB20cd7783cF94334069641daC9"
    }
```

```diff
    contract L1MantleToken (0x3c3a81e81dc49A522A592e7622A7E711c06bf354) {
    +++ description: MNT token contract: Mantle uses Mantle (MNT) as the designated gas token, allowing users pay for gas in MNT.
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
    }
```

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.1.target:
-        "0x2f40D796917ffB642bD2e2bdD2C762A5e40fd749"
      issuedPermissions.1.to:
+        "0x2f40D796917ffB642bD2e2bdD2C762A5e40fd749"
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract ProxyAdmin (0x47D58744D8515d9aaEAf961bc03625118bd91EBb) {
    +++ description: None
      directlyReceivedPermissions.4.target:
-        "0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D"
      directlyReceivedPermissions.4.from:
+        "0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D"
      directlyReceivedPermissions.3.target:
-        "0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94"
      directlyReceivedPermissions.3.from:
+        "0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94"
      directlyReceivedPermissions.2.target:
-        "0x92986cd63C3409b7dA2882624B6d6E7Cf660707a"
      directlyReceivedPermissions.2.from:
+        "0x92986cd63C3409b7dA2882624B6d6E7Cf660707a"
      directlyReceivedPermissions.1.target:
-        "0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1"
      directlyReceivedPermissions.1.from:
+        "0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1"
      directlyReceivedPermissions.0.target:
-        "0x1eD35B793d887e028493dAC4a11AA5Feb811dd67"
      directlyReceivedPermissions.0.from:
+        "0x1eD35B793d887e028493dAC4a11AA5Feb811dd67"
    }
```

```diff
    contract MantleSecurityMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: None
      receivedPermissions.17.target:
-        "0xeA4F1fE4928f1f83a450899C068bcd455BaF4798"
      receivedPermissions.17.from:
+        "0xeA4F1fE4928f1f83a450899C068bcd455BaF4798"
      receivedPermissions.16.target:
-        "0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D"
      receivedPermissions.16.from:
+        "0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D"
      receivedPermissions.15.target:
-        "0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1"
      receivedPermissions.15.from:
+        "0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1"
      receivedPermissions.14.target:
-        "0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94"
      receivedPermissions.14.from:
+        "0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94"
      receivedPermissions.13.target:
-        "0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"
      receivedPermissions.13.from:
+        "0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"
      receivedPermissions.12.target:
-        "0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01"
      receivedPermissions.12.from:
+        "0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01"
      receivedPermissions.11.target:
-        "0xA937660031787C4408587D2c6A67Ec4B260630F5"
      receivedPermissions.11.from:
+        "0xA937660031787C4408587D2c6A67Ec4B260630F5"
      receivedPermissions.10.target:
-        "0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012"
      receivedPermissions.10.from:
+        "0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012"
      receivedPermissions.9.target:
-        "0x92986cd63C3409b7dA2882624B6d6E7Cf660707a"
      receivedPermissions.9.from:
+        "0x92986cd63C3409b7dA2882624B6d6E7Cf660707a"
      receivedPermissions.8.target:
-        "0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1"
      receivedPermissions.8.from:
+        "0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1"
      receivedPermissions.7.target:
-        "0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A"
      receivedPermissions.7.from:
+        "0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A"
      receivedPermissions.6.target:
-        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
      receivedPermissions.6.from:
+        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
      receivedPermissions.5.target:
-        "0x3c3a81e81dc49A522A592e7622A7E711c06bf354"
      receivedPermissions.5.from:
+        "0x3c3a81e81dc49A522A592e7622A7E711c06bf354"
      receivedPermissions.4.target:
-        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
      receivedPermissions.4.from:
+        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
      receivedPermissions.3.target:
-        "0x23754725a49c0f003C349A6C7869fF8609a7CEfd"
      receivedPermissions.3.from:
+        "0x23754725a49c0f003C349A6C7869fF8609a7CEfd"
      receivedPermissions.2.target:
-        "0x1eD35B793d887e028493dAC4a11AA5Feb811dd67"
      receivedPermissions.2.from:
+        "0x1eD35B793d887e028493dAC4a11AA5Feb811dd67"
      receivedPermissions.1.target:
-        "0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42"
      receivedPermissions.1.from:
+        "0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42"
      receivedPermissions.0.target:
-        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
      receivedPermissions.0.from:
+        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
      directlyReceivedPermissions.3.target:
-        "0xca35F8338054739D138884685e08b39EE2217794"
      directlyReceivedPermissions.3.from:
+        "0xca35F8338054739D138884685e08b39EE2217794"
      directlyReceivedPermissions.2.target:
-        "0x47D58744D8515d9aaEAf961bc03625118bd91EBb"
      directlyReceivedPermissions.2.from:
+        "0x47D58744D8515d9aaEAf961bc03625118bd91EBb"
      directlyReceivedPermissions.1.target:
-        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
      directlyReceivedPermissions.1.from:
+        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
      directlyReceivedPermissions.0.target:
-        "0x0cac2B1a172ac24012621101634DD5ABD6399ADd"
      directlyReceivedPermissions.0.from:
+        "0x0cac2B1a172ac24012621101634DD5ABD6399ADd"
    }
```

```diff
    contract EigenDataLayerChain (0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
    }
```

```diff
    contract DataLayrServiceManager (0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1) {
    +++ description: This contract is the main entry point for data availability. It is responsible for storing transaction data headers and confirming the data store by verifying operators signatures.
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
    }
```

```diff
    contract Lib_AddressManager (0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract PubkeyCompendium (0x92986cd63C3409b7dA2882624B6d6E7Cf660707a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
    }
```

```diff
    contract L1StandardBridge (0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract MantleSecondStrat (0xA937660031787C4408587D2c6A67Ec4B260630F5) {
    +++ description: Basic do-nothing investment strategy.
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
    }
```

```diff
    contract RegistryPermission (0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
    }
```

```diff
    contract OptimismPortal (0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.target:
-        "0x2F44BD2a54aC3fB20cd7783cF94334069641daC9"
      issuedPermissions.0.to:
+        "0x2F44BD2a54aC3fB20cd7783cF94334069641daC9"
    }
```

```diff
    contract DataLayrChallenge (0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
    }
```

```diff
    contract ProxyAdmin (0xca35F8338054739D138884685e08b39EE2217794) {
    +++ description: None
      directlyReceivedPermissions.4.target:
-        "0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"
      directlyReceivedPermissions.4.from:
+        "0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"
      directlyReceivedPermissions.3.target:
-        "0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012"
      directlyReceivedPermissions.3.from:
+        "0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012"
      directlyReceivedPermissions.2.target:
-        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
      directlyReceivedPermissions.2.from:
+        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
      directlyReceivedPermissions.1.target:
-        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
      directlyReceivedPermissions.1.from:
+        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
      directlyReceivedPermissions.0.target:
-        "0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42"
      directlyReceivedPermissions.0.from:
+        "0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42"
    }
```

```diff
    contract MantleFirstStrat (0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1) {
    +++ description: Basic do-nothing investment strategy.
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
    }
```

```diff
    contract DataLayrChallengeUtils (0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
    }
```

```diff
    contract Delegation (0xeA4F1fE4928f1f83a450899C068bcd455BaF4798) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
    }
```

Generated with discovered.json: 0xc255606c537d8bbcfd7ca92f9bdaa71f2e4b5217

# Diff at Wed, 15 Jan 2025 07:44:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 20928041
- current block number: 21628468

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20928041 (main branch discovery), not current.

```diff
    contract MantleTokenProxyAdmin (0x0cac2B1a172ac24012621101634DD5ABD6399ADd) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x56a3eef31355d8dbf683b9b688070ace8be3d26e

# Diff at Wed, 08 Jan 2025 09:03:45 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 20928041
- current block number: 20928041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20928041 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xe53857c87cf6112b4a07960caadccfe172c5ded2

# Diff at Fri, 01 Nov 2024 12:09:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 20928041
- current block number: 20928041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20928041 (main branch discovery), not current.

```diff
    contract MantleSecurityMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: None
      receivedPermissions.10.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0xca35F8338054739D138884685e08b39EE2217794) {
    +++ description: None
      directlyReceivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xbf3b2b0c55f88708809475a0471e27cc05254127

# Diff at Tue, 29 Oct 2024 13:11:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20928041
- current block number: 20928041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20928041 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x9e2908657b6c49ed5d1c53be5fdf4ab31f42c7ee

# Diff at Mon, 21 Oct 2024 12:45:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20928041
- current block number: 20928041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20928041 (main branch discovery), not current.

```diff
    contract BLSRegistry (0x1eD35B793d887e028493dAC4a11AA5Feb811dd67) {
    +++ description: This contract stores the number of Mantle DA operators and their public keys. It also store the quorum threshold and the minimum stake required to be part of the quorum.
      descriptions:
-        ["This contract stores the number of Mantle DA operators and their public keys. It also store the quorum threshold and the minimum stake required to be part of the quorum."]
      description:
+        "This contract stores the number of Mantle DA operators and their public keys. It also store the quorum threshold and the minimum stake required to be part of the quorum."
    }
```

```diff
    contract InvestmentManager (0x23754725a49c0f003C349A6C7869fF8609a7CEfd) {
    +++ description: Contract managing different investment strategies, forked from EigenLayer StrategyManager.
      descriptions:
-        ["Contract managing different investment strategies, forked from EigenLayer StrategyManager."]
      description:
+        "Contract managing different investment strategies, forked from EigenLayer StrategyManager."
    }
```

```diff
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract L1MantleToken (0x3c3a81e81dc49A522A592e7622A7E711c06bf354) {
    +++ description: MNT token contract: Mantle uses Mantle (MNT) as the designated gas token, allowing users pay for gas in MNT.
      descriptions:
-        ["MNT token contract: Mantle uses Mantle (MNT) as the designated gas token, allowing users pay for gas in MNT."]
      description:
+        "MNT token contract: Mantle uses Mantle (MNT) as the designated gas token, allowing users pay for gas in MNT."
    }
```

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract DataLayrServiceManager (0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1) {
    +++ description: This contract is the main entry point for data availability. It is responsible for storing transaction data headers and confirming the data store by verifying operators signatures.
      descriptions:
-        ["This contract is the main entry point for data availability. It is responsible for storing transaction data headers and confirming the data store by verifying operators signatures."]
      description:
+        "This contract is the main entry point for data availability. It is responsible for storing transaction data headers and confirming the data store by verifying operators signatures."
    }
```

```diff
    contract L1CrossDomainMessenger (0x676A795fe6E43C17c668de16730c3F690FEB7120) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract Lib_AddressManager (0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract L1StandardBridge (0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract MantleSecondStrat (0xA937660031787C4408587D2c6A67Ec4B260630F5) {
    +++ description: Basic do-nothing investment strategy.
      descriptions:
-        ["Basic do-nothing investment strategy."]
      description:
+        "Basic do-nothing investment strategy."
    }
```

```diff
    contract OptimismPortal (0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract MantleFirstStrat (0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1) {
    +++ description: Basic do-nothing investment strategy.
      descriptions:
-        ["Basic do-nothing investment strategy."]
      description:
+        "Basic do-nothing investment strategy."
    }
```

Generated with discovered.json: 0x2cf5eca3597315276a12c07545e2e36da67e37d5

# Diff at Mon, 21 Oct 2024 11:07:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20928041
- current block number: 20928041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20928041 (main branch discovery), not current.

```diff
    contract BLSRegistry (0x1eD35B793d887e028493dAC4a11AA5Feb811dd67) {
    +++ description: This contract stores the number of Mantle DA operators and their public keys. It also store the quorum threshold and the minimum stake required to be part of the quorum.
      values.$pastUpgrades.1.2:
+        ["0x64F4244eEA17a361bb919A28F614C3ad1aC565ad"]
      values.$pastUpgrades.1.1:
-        ["0x64F4244eEA17a361bb919A28F614C3ad1aC565ad"]
+        "0x43792ca3e5547575169e63a6c3d65cb80aea4d078f8b74c67e0db11a14d64012"
      values.$pastUpgrades.0.2:
+        ["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]
      values.$pastUpgrades.0.1:
-        ["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]
+        "0x9d5d1ea782248f506d764d83e7cbf9f5f3b612481d064348e55e2b9192b6202b"
    }
```

```diff
    contract InvestmentManager (0x23754725a49c0f003C349A6C7869fF8609a7CEfd) {
    +++ description: Contract managing different investment strategies, forked from EigenLayer StrategyManager.
      values.$pastUpgrades.1.2:
+        ["0x7C4813A9AF2FEA4ca765a26b05d128926E94e72E"]
      values.$pastUpgrades.1.1:
-        ["0x7C4813A9AF2FEA4ca765a26b05d128926E94e72E"]
+        "0xdbf4832652157cf7ac7025536a4ea46c98eb9ea0fd8aea5d9806ae0a88ec037f"
      values.$pastUpgrades.0.2:
+        ["0xa288E750401E6d15A62e3400C87d3ee331650a0C"]
      values.$pastUpgrades.0.1:
-        ["0xa288E750401E6d15A62e3400C87d3ee331650a0C"]
+        "0xeb7dc422709447d9ec652639cd04c817fe931d17a444f63c347c26b76aa64720"
    }
```

```diff
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0xD1230865641561653406906Fb08873F011c19080"]
      values.$pastUpgrades.0.1:
-        ["0xD1230865641561653406906Fb08873F011c19080"]
+        "0xa5fff128e999954c7dfe8e3360d0844e439425124922e85cd32fdcf2e3582247"
    }
```

```diff
    contract L1MantleToken (0x3c3a81e81dc49A522A592e7622A7E711c06bf354) {
    +++ description: MNT token contract: Mantle uses Mantle (MNT) as the designated gas token, allowing users pay for gas in MNT.
      values.$pastUpgrades.0.2:
+        ["0xCd368c1d80120b0Dd92447c87eB570154f8e685c"]
      values.$pastUpgrades.0.1:
-        ["0xCd368c1d80120b0Dd92447c87eB570154f8e685c"]
+        "0x8f7867724cfba4b9b1b19ca140711809b40dda9ae245caf7bcff9473a5a7e45e"
    }
```

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x6Dbb7D9C5dC60844B8CF442ddC6Be081c060B2E3"]
      values.$pastUpgrades.0.1:
-        ["0x6Dbb7D9C5dC60844B8CF442ddC6Be081c060B2E3"]
+        "0x667a55493b70812eedb69586be570fa87bb305ff046ebd1419cdc71163f770ac"
    }
```

```diff
    contract EigenDataLayerChain (0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xDF401d4229Fc6cA52238f7e55A04FA8EBc24C55a"]
      values.$pastUpgrades.0.1:
-        ["0xDF401d4229Fc6cA52238f7e55A04FA8EBc24C55a"]
+        "0x2b2bda7f01a3baec5d0e7b369e36172365d35b9eb9137c074d3260308c838ce8"
    }
```

```diff
    contract DataLayrServiceManager (0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1) {
    +++ description: This contract is the main entry point for data availability. It is responsible for storing transaction data headers and confirming the data store by verifying operators signatures.
      values.$pastUpgrades.1.2:
+        ["0xAB42127980a3bff124E6465e097a5fC97228827e"]
      values.$pastUpgrades.1.1:
-        ["0xAB42127980a3bff124E6465e097a5fC97228827e"]
+        "0x8c0b0f089bb73496f62f5676329337f1c6df8c9678fced830fb8ae25573c04e0"
      values.$pastUpgrades.0.2:
+        ["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]
      values.$pastUpgrades.0.1:
-        ["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]
+        "0x09367d337ef0395ea117d413b4a06a2dca0e5e7e1f4e40270716e26dfe750a35"
    }
```

```diff
    contract L1CrossDomainMessenger (0x676A795fe6E43C17c668de16730c3F690FEB7120) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.2.2:
+        ["0xb8DE82551fA4BA3bE4B3d9097763EDBeED541308"]
      values.$pastUpgrades.2.1:
-        ["0xb8DE82551fA4BA3bE4B3d9097763EDBeED541308"]
+        "0xa5fff128e999954c7dfe8e3360d0844e439425124922e85cd32fdcf2e3582247"
      values.$pastUpgrades.1.2:
+        ["0x0000000000000000000000000000000000000000"]
      values.$pastUpgrades.1.1:
-        ["0x0000000000000000000000000000000000000000"]
+        "0x667a55493b70812eedb69586be570fa87bb305ff046ebd1419cdc71163f770ac"
      values.$pastUpgrades.0.2:
+        ["0x4692363048d0F32a2dE7816860D48fff0c61B24B"]
      values.$pastUpgrades.0.1:
-        ["0x4692363048d0F32a2dE7816860D48fff0c61B24B"]
+        "0x3ef2116cdd9366a646b6625affcf0cbe96bb3c59c3ffc629432d3f79ff1f886c"
    }
```

```diff
    contract PubkeyCompendium (0x92986cd63C3409b7dA2882624B6d6E7Cf660707a) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x18Dd3cBE484f955217165FEaC6fe928D04a56a72"]
      values.$pastUpgrades.1.1:
-        ["0x18Dd3cBE484f955217165FEaC6fe928D04a56a72"]
+        "0x50bd8f78f61dc27f5c2359db587111c67e23cc9de4703a0c8e1657b351461e53"
      values.$pastUpgrades.0.2:
+        ["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]
      values.$pastUpgrades.0.1:
-        ["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]
+        "0x09d04d4b63ad6b712ebdfb04212905e21e2c64b5ba19cf01bfcc07d66dd652fb"
    }
```

```diff
    contract MantleSecondStrat (0xA937660031787C4408587D2c6A67Ec4B260630F5) {
    +++ description: Basic do-nothing investment strategy.
      values.$pastUpgrades.0.2:
+        ["0x9FEcF38689349a5CFf97526610CdB27618edc6b9"]
      values.$pastUpgrades.0.1:
-        ["0x9FEcF38689349a5CFf97526610CdB27618edc6b9"]
+        "0xfbe66fac37b117b0700dd1c6711a91362ebf626904438f6f6c336b28db471d76"
    }
```

```diff
    contract RegistryPermission (0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xAb00B934DE01c1b4931047125C2ba5B3d6186b85"]
      values.$pastUpgrades.1.1:
-        ["0xAb00B934DE01c1b4931047125C2ba5B3d6186b85"]
+        "0x199dbe55b2c0f54e8fa60a1eebcac985184a17b405e277c1abde3e8bd9524436"
      values.$pastUpgrades.0.2:
+        ["0xa288E750401E6d15A62e3400C87d3ee331650a0C"]
      values.$pastUpgrades.0.1:
-        ["0xa288E750401E6d15A62e3400C87d3ee331650a0C"]
+        "0x2cd887c0e49e302ecc909ae1ef5987405940228e4cae643f191801919e08a235"
    }
```

```diff
    contract OptimismPortal (0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0xe1399f54ba2597b4EaDA9E3450c34D393fb131A7"]
      values.$pastUpgrades.0.1:
-        ["0xe1399f54ba2597b4EaDA9E3450c34D393fb131A7"]
+        "0xa5fff128e999954c7dfe8e3360d0844e439425124922e85cd32fdcf2e3582247"
    }
```

```diff
    contract DataLayrChallenge (0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x6EE53D3d6e622Ac0296369445AFB3CBBDc57C066"]
      values.$pastUpgrades.1.1:
-        ["0x6EE53D3d6e622Ac0296369445AFB3CBBDc57C066"]
+        "0x957f5ec20d401a1a74111cb01b0f840afea478a31759b127b37ab8b7faaebb2d"
      values.$pastUpgrades.0.2:
+        ["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]
      values.$pastUpgrades.0.1:
-        ["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]
+        "0xb95bdea06d55863c8b2e41ca71ab8dbe459408d0017f2bbdfaef7e1bf30fbad1"
    }
```

```diff
    contract MantleFirstStrat (0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1) {
    +++ description: Basic do-nothing investment strategy.
      values.$pastUpgrades.0.2:
+        ["0x9FEcF38689349a5CFf97526610CdB27618edc6b9"]
      values.$pastUpgrades.0.1:
-        ["0x9FEcF38689349a5CFf97526610CdB27618edc6b9"]
+        "0x4a9c5808169c5a6fabfae05048c44c24dfb04d48815357a215a5af3809123f4f"
    }
```

```diff
    contract DataLayrChallengeUtils (0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xd8d731624d97a66e012E62208cFc921d7033c564"]
      values.$pastUpgrades.1.1:
-        ["0xd8d731624d97a66e012E62208cFc921d7033c564"]
+        "0xdde13172352499d10a1ff109d22d19980be5b84634ac36b003b0fb25eaf54508"
      values.$pastUpgrades.0.2:
+        ["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]
      values.$pastUpgrades.0.1:
-        ["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]
+        "0xfa65c0cef1bde23cdca16d9863bf43a83579f73cb40199ed18bda7e4853033df"
    }
```

```diff
    contract Delegation (0xeA4F1fE4928f1f83a450899C068bcd455BaF4798) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xAdA69A18B30B3B9235AB2748116bB9195e16aDba"]
      values.$pastUpgrades.1.1:
-        ["0xAdA69A18B30B3B9235AB2748116bB9195e16aDba"]
+        "0x609574ecb43797c58ee51ad0c87bdf5dc9f1b6a21f72406c1679f579bb865e5d"
      values.$pastUpgrades.0.2:
+        ["0xa288E750401E6d15A62e3400C87d3ee331650a0C"]
      values.$pastUpgrades.0.1:
-        ["0xa288E750401E6d15A62e3400C87d3ee331650a0C"]
+        "0xccf37452298ddc5f50e741118a64f4ee4b8ff9d1ea7c60bda84bf22a3c11a719"
    }
```

Generated with discovered.json: 0xc2f3a90e11e7fdd6cba7115ca15e9412c288ff61

# Diff at Wed, 16 Oct 2024 11:37:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20928041
- current block number: 20928041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20928041 (main branch discovery), not current.

```diff
    contract MantleEngineeringMultisig (0x2F44BD2a54aC3fB20cd7783cF94334069641daC9) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions:
+        [{"permission":"challenge","target":"0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"},{"permission":"guard","target":"0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"}]
    }
```

```diff
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4e59e778a0fb77fBb305637435C62FaeD9aED40f","via":[{"address":"0xca35F8338054739D138884685e08b39EE2217794","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x6667961f5e9C98A76a48767522150889703Ed77D","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
+        "0x2F44BD2a54aC3fB20cd7783cF94334069641daC9"
      issuedPermissions.0.via.0:
-        {"address":"0xca35F8338054739D138884685e08b39EE2217794","delay":0}
    }
```

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4e59e778a0fb77fBb305637435C62FaeD9aED40f","via":[{"address":"0xca35F8338054739D138884685e08b39EE2217794","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
+        "0x2f40D796917ffB642bD2e2bdD2C762A5e40fd749"
      issuedPermissions.1.via.0:
-        {"address":"0xca35F8338054739D138884685e08b39EE2217794","delay":0}
    }
```

```diff
    contract OptimismPortal (0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4e59e778a0fb77fBb305637435C62FaeD9aED40f","via":[{"address":"0xca35F8338054739D138884685e08b39EE2217794","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
+        "0x2F44BD2a54aC3fB20cd7783cF94334069641daC9"
      issuedPermissions.0.via.0:
-        {"address":"0xca35F8338054739D138884685e08b39EE2217794","delay":0}
    }
```

Generated with discovered.json: 0xaab779aa74b0bcbb74641ca22b729257df8a023c

# Diff at Mon, 14 Oct 2024 10:52:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20928041
- current block number: 20928041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20928041 (main branch discovery), not current.

```diff
    contract PauserRegistry (0x075a48633dc6845f92339741E9c96b88f1b2A86f) {
    +++ description: None
      sourceHashes:
+        ["0x8fa8f20d7c33aea934963671e5ac4fc1d3b586d40deb93cc4768d4a6ef323662"]
    }
```

```diff
    contract MantleTokenProxyAdmin (0x0cac2B1a172ac24012621101634DD5ABD6399ADd) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x68f689a23d3badd91255602a1eb13d4789baedc16d904c3103244642fc78ca8f"]
    }
```

```diff
    contract BLSRegistry (0x1eD35B793d887e028493dAC4a11AA5Feb811dd67) {
    +++ description: This contract stores the number of Mantle DA operators and their public keys. It also store the quorum threshold and the minimum stake required to be part of the quorum.
      sourceHashes:
+        ["0x3f8d1d2461c05779ca5de685fd391f6a4c07e91953373effd46d11f72b025dc3","0x25c9049ce3c6e3d0fb455a5ceecf01cc2d9a92f415e869786ef2f2221e85b803"]
    }
```

```diff
    contract InvestmentManager (0x23754725a49c0f003C349A6C7869fF8609a7CEfd) {
    +++ description: Contract managing different investment strategies, forked from EigenLayer StrategyManager.
      sourceHashes:
+        ["0x3f8d1d2461c05779ca5de685fd391f6a4c07e91953373effd46d11f72b025dc3","0x943049d488a42420a15934ca27ae2fc159c395727536ee64c38afdde4215c561"]
    }
```

```diff
    contract ProxyAdmin (0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0xae641c7d7a83bba7fa913b9544f946dc23ca0527c2f4abb9c6a3496f49375218"]
    }
```

```diff
    contract MantleEngineeringMultisig (0x2F44BD2a54aC3fB20cd7783cF94334069641daC9) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x45368d302fba850124115aa8ee67238f47d47d89c2b1b8c5dfd39818369e6cea"]
    }
```

```diff
    contract L1MantleToken (0x3c3a81e81dc49A522A592e7622A7E711c06bf354) {
    +++ description: MNT token contract: Mantle uses Mantle (MNT) as the designated gas token, allowing users pay for gas in MNT.
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x13e07c3c64aef03cfd7f5c01b2b1b443fd1dfb19c4128447fe316bb5fcd128cd"]
    }
```

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xb2a3bda11c08328ecb46ec5789f3264be5d816bc218a5024a4cafd1c59017160"]
    }
```

```diff
    contract ProxyAdmin (0x47D58744D8515d9aaEAf961bc03625118bd91EBb) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0xae641c7d7a83bba7fa913b9544f946dc23ca0527c2f4abb9c6a3496f49375218"]
    }
```

```diff
    contract PauserRegistry2 (0x4ca725D446EcE6e3fFd3E072A6f2A6a16Ca492D0) {
    +++ description: None
      sourceHashes:
+        ["0x8fa8f20d7c33aea934963671e5ac4fc1d3b586d40deb93cc4768d4a6ef323662"]
    }
```

```diff
    contract MantleSecurityMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract EigenDataLayerChain (0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A) {
    +++ description: None
      sourceHashes:
+        ["0x63677738b5ca073872cd350783b51e6dcd4bf6469f02eadf4cead9aef171c781","0x5333d2d13f53d445ff99fbe5845e2658fbafd68944683fb56a2644d76e5a4f36"]
    }
```

```diff
    contract DataLayrServiceManager (0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1) {
    +++ description: This contract is the main entry point for data availability. It is responsible for storing transaction data headers and confirming the data store by verifying operators signatures.
      sourceHashes:
+        ["0x3f8d1d2461c05779ca5de685fd391f6a4c07e91953373effd46d11f72b025dc3","0xf52658c0dbe857c858ac93c9c3dad449fff36d7e6454b67ac61a5bf3dcecca30"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x676A795fe6E43C17c668de16730c3F690FEB7120) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x6e4b297b822bdda2bb8bbf4dde360ee51379af5a0de55c0d726a2d7b68791bf7","0x430d270834512dafe98bf268d6912f12a10c5a6287e7463830a22e4616dd63a0"]
    }
```

```diff
    contract Lib_AddressManager (0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0x763c5728a19538783edf38c17731f9cf79ff6f38bfa4bce61333cef0aac5452e"]
    }
```

```diff
    contract GnosisSafe (0x7735cDcc85E63A7684C29652DbE8B845e0b4635A) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract PubkeyCompendium (0x92986cd63C3409b7dA2882624B6d6E7Cf660707a) {
    +++ description: None
      sourceHashes:
+        ["0x3f8d1d2461c05779ca5de685fd391f6a4c07e91953373effd46d11f72b025dc3","0x8ae883de7991fc1ec2291f58deabd148cec4b61384f2eafa6c703304b9a2c757"]
    }
```

```diff
    contract L1StandardBridge (0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd","0x1cd5cb2fa146b2a5dfb07279a52cd93855b268115912df60292b18394cc532e8"]
    }
```

```diff
    contract MantleSecondStrat (0xA937660031787C4408587D2c6A67Ec4B260630F5) {
    +++ description: Basic do-nothing investment strategy.
      sourceHashes:
+        ["0x3f8d1d2461c05779ca5de685fd391f6a4c07e91953373effd46d11f72b025dc3","0x20018f70ed5942c8b643f26e7f19c6d30f27dead8e6eb6f1127d87a2f2a04589"]
    }
```

```diff
    contract RegistryPermission (0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01) {
    +++ description: None
      sourceHashes:
+        ["0x3f8d1d2461c05779ca5de685fd391f6a4c07e91953373effd46d11f72b025dc3","0xc65400995a550bff2a6272beee2e54f8cf8f9369406fe8531bd5d39add1635b7"]
    }
```

```diff
    contract OptimismPortal (0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x3a064711ad01291b3644b5f657fd8317cd07f19222c9f216e25557d4d69ea295"]
    }
```

```diff
    contract DataLayrChallenge (0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94) {
    +++ description: None
      sourceHashes:
+        ["0x3f8d1d2461c05779ca5de685fd391f6a4c07e91953373effd46d11f72b025dc3","0xe8b1ba037124dea50d3eec5112ed3b8507e29739b723810a9f6f00976b9e2d08"]
    }
```

```diff
    contract ProxyAdmin (0xca35F8338054739D138884685e08b39EE2217794) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract MantleFirstStrat (0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1) {
    +++ description: Basic do-nothing investment strategy.
      sourceHashes:
+        ["0x3f8d1d2461c05779ca5de685fd391f6a4c07e91953373effd46d11f72b025dc3","0x20018f70ed5942c8b643f26e7f19c6d30f27dead8e6eb6f1127d87a2f2a04589"]
    }
```

```diff
    contract DataLayrChallengeUtils (0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D) {
    +++ description: None
      sourceHashes:
+        ["0x3f8d1d2461c05779ca5de685fd391f6a4c07e91953373effd46d11f72b025dc3","0x9dc36b80e92cea40c02d3b9d2684d85d4141dcab44cf882b91cf3148476432ee"]
    }
```

```diff
    contract Delegation (0xeA4F1fE4928f1f83a450899C068bcd455BaF4798) {
    +++ description: None
      sourceHashes:
+        ["0x3f8d1d2461c05779ca5de685fd391f6a4c07e91953373effd46d11f72b025dc3","0xa961eebaaac6cb33d38501294b0f98165b96d04af2f99311bd99b282798990be"]
    }
```

Generated with discovered.json: 0x245c7ed19c7553bb6880d725a68bbcc743ec7b08

# Diff at Wed, 09 Oct 2024 12:30:38 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20675899
- current block number: 20928041

## Description

Move to discovery driven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675899 (main branch discovery), not current.

```diff
    contract MantleTokenProxyAdmin (0x0cac2B1a172ac24012621101634DD5ABD6399ADd) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x3c3a81e81dc49A522A592e7622A7E711c06bf354"}]
      template:
+        "opstack/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x3c3a81e81dc49A522A592e7622A7E711c06bf354"}]
    }
```

```diff
    contract BLSRegistry (0x1eD35B793d887e028493dAC4a11AA5Feb811dd67) {
    +++ description: This contract stores the number of Mantle DA operators and their public keys. It also store the quorum threshold and the minimum stake required to be part of the quorum.
      issuedPermissions.0.target:
-        "0x47D58744D8515d9aaEAf961bc03625118bd91EBb"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb","delay":0}
      descriptions:
+        ["This contract stores the number of Mantle DA operators and their public keys. It also store the quorum threshold and the minimum stake required to be part of the quorum."]
    }
```

```diff
    contract InvestmentManager (0x23754725a49c0f003C349A6C7869fF8609a7CEfd) {
    +++ description: Contract managing different investment strategies, forked from EigenLayer StrategyManager.
      issuedPermissions.0.target:
-        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83","delay":0}
      descriptions:
+        ["Contract managing different investment strategies, forked from EigenLayer StrategyManager."]
    }
```

```diff
-   Status: DELETED
    contract CanonicalTransactionChain (0x291dc3819b863e19b0a9b9809F8025d2EB4aaE93)
    +++ description: None
```

```diff
    contract ProxyAdmin (0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x23754725a49c0f003C349A6C7869fF8609a7CEfd"},{"permission":"upgrade","target":"0xA937660031787C4408587D2c6A67Ec4B260630F5"},{"permission":"upgrade","target":"0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01"},{"permission":"upgrade","target":"0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1"},{"permission":"upgrade","target":"0xeA4F1fE4928f1f83a450899C068bcd455BaF4798"}]
      template:
+        "opstack/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x23754725a49c0f003C349A6C7869fF8609a7CEfd"},{"permission":"upgrade","target":"0xA937660031787C4408587D2c6A67Ec4B260630F5"},{"permission":"upgrade","target":"0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01"},{"permission":"upgrade","target":"0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1"},{"permission":"upgrade","target":"0xeA4F1fE4928f1f83a450899C068bcd455BaF4798"}]
    }
```

```diff
    contract MantleEngineeringMultisig (0x2F44BD2a54aC3fB20cd7783cF94334069641daC9) {
    +++ description: None
      roles:
+        ["Challenger","Guardian"]
    }
```

```diff
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract L1MantleToken (0x3c3a81e81dc49A522A592e7622A7E711c06bf354) {
    +++ description: MNT token contract: Mantle uses Mantle (MNT) as the designated gas token, allowing users pay for gas in MNT.
      issuedPermissions.0.target:
-        "0x0cac2B1a172ac24012621101634DD5ABD6399ADd"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0x0cac2B1a172ac24012621101634DD5ABD6399ADd","delay":0}
      descriptions:
+        ["MNT token contract: Mantle uses Mantle (MNT) as the designated gas token, allowing users pay for gas in MNT."]
    }
```

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4e59e778a0fb77fBb305637435C62FaeD9aED40f","via":[{"address":"0xca35F8338054739D138884685e08b39EE2217794","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0xca35F8338054739D138884685e08b39EE2217794","delay":0}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract ProxyAdmin (0x47D58744D8515d9aaEAf961bc03625118bd91EBb) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x1eD35B793d887e028493dAC4a11AA5Feb811dd67"},{"permission":"upgrade","target":"0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1"},{"permission":"upgrade","target":"0x92986cd63C3409b7dA2882624B6d6E7Cf660707a"},{"permission":"upgrade","target":"0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94"},{"permission":"upgrade","target":"0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D"}]
      template:
+        "opstack/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x1eD35B793d887e028493dAC4a11AA5Feb811dd67"},{"permission":"upgrade","target":"0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1"},{"permission":"upgrade","target":"0x92986cd63C3409b7dA2882624B6d6E7Cf660707a"},{"permission":"upgrade","target":"0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94"},{"permission":"upgrade","target":"0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D"}]
    }
```

```diff
    contract MantleSecurityMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: None
      receivedPermissions.17:
+        {"permission":"upgrade","target":"0xeA4F1fE4928f1f83a450899C068bcd455BaF4798","via":[{"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}]}
      receivedPermissions.16:
+        {"permission":"upgrade","target":"0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D","via":[{"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb"}]}
      receivedPermissions.15:
+        {"permission":"upgrade","target":"0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1","via":[{"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}]}
      receivedPermissions.14:
+        {"permission":"upgrade","target":"0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94","via":[{"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb"}]}
      receivedPermissions.13:
+        {"permission":"upgrade","target":"0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb","via":[{"address":"0xca35F8338054739D138884685e08b39EE2217794"}]}
      receivedPermissions.12:
+        {"permission":"upgrade","target":"0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01","via":[{"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","target":"0xA937660031787C4408587D2c6A67Ec4B260630F5","via":[{"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xca35F8338054739D138884685e08b39EE2217794"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0x92986cd63C3409b7dA2882624B6d6E7Cf660707a","via":[{"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1","via":[{"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A"}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x427Ea0710FA5252057F0D88274f7aeb308386cAf","via":[{"address":"0xca35F8338054739D138884685e08b39EE2217794"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x3c3a81e81dc49A522A592e7622A7E711c06bf354","via":[{"address":"0x0cac2B1a172ac24012621101634DD5ABD6399ADd"}]}
      receivedPermissions.4.target:
-        "0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"
+        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
      receivedPermissions.3.target:
-        "0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012"
+        "0x23754725a49c0f003C349A6C7869fF8609a7CEfd"
      receivedPermissions.3.via.0.address:
-        "0xca35F8338054739D138884685e08b39EE2217794"
+        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
      receivedPermissions.2.target:
-        "0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A"
+        "0x1eD35B793d887e028493dAC4a11AA5Feb811dd67"
      receivedPermissions.2.via:
+        [{"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb"}]
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
+        "0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42"
      receivedPermissions.1.description:
+        "set and change address mappings."
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
+        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
      receivedPermissions.0.via:
-        [{"address":"0xca35F8338054739D138884685e08b39EE2217794"}]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      directlyReceivedPermissions.3:
+        {"permission":"act","target":"0xca35F8338054739D138884685e08b39EE2217794"}
      directlyReceivedPermissions.2:
+        {"permission":"act","target":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb"}
      directlyReceivedPermissions.1:
+        {"permission":"act","target":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"}
      directlyReceivedPermissions.0.target:
-        "0xca35F8338054739D138884685e08b39EE2217794"
+        "0x0cac2B1a172ac24012621101634DD5ABD6399ADd"
    }
```

```diff
    contract DataLayrServiceManager (0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1) {
    +++ description: This contract is the main entry point for data availability. It is responsible for storing transaction data headers and confirming the data store by verifying operators signatures.
      issuedPermissions.0.target:
-        "0x47D58744D8515d9aaEAf961bc03625118bd91EBb"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb","delay":0}
      descriptions:
+        ["This contract is the main entry point for data availability. It is responsible for storing transaction data headers and confirming the data store by verifying operators signatures."]
    }
```

```diff
-   Status: DELETED
    contract ChainStorageContainerCTC (0x5Dd48eF85B99E3e3d711Ca8B41cBC07dA1677F3E)
    +++ description: None
```

```diff
    contract L1CrossDomainMessenger (0x676A795fe6E43C17c668de16730c3F690FEB7120) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract Lib_AddressManager (0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      name:
-        "AddressManager"
+        "Lib_AddressManager"
      values.BondManager:
-        "0x0000000000000000000000000000000000000000"
      values.CanonicalTransactionChain:
-        "0x291dc3819b863e19b0a9b9809F8025d2EB4aaE93"
      values.ChainStorageContainerCTC:
-        "0x5Dd48eF85B99E3e3d711Ca8B41cBC07dA1677F3E"
      values.ChainStorageContainerSCC:
-        "0xd3f0BD982D72e28cccc69e0A9dA439e9D587b3bD"
      values.FraudVerifier:
-        "0x0000000000000000000000000000000000000000"
      values.L1CrossDomainMessenger:
-        "0xb8DE82551fA4BA3bE4B3d9097763EDBeED541308"
      values.L1CrossDomainMessengerProxy:
-        "0x676A795fe6E43C17c668de16730c3F690FEB7120"
      values.L1MantleAddress:
-        "0x3c3a81e81dc49A522A592e7622A7E711c06bf354"
      values.L1StandardBridgeProxy:
-        "0x0000000000000000000000000000000000000000"
      values.proposer:
-        "0x0000000000000000000000000000000000000000"
      values.rolluper:
-        "0x6667961f5e9C98A76a48767522150889703Ed77D"
      values.sequencer:
-        "0x0000000000000000000000000000000000000000"
      values.StateCommitmentChain:
-        "0x89E9D387555AF0cDE22cb98833Bae40d640AD7fa"
      values.TssGroupManager:
-        "0xF7576237087F808eB39531cA490b4F8eFd4a0c69"
      values.TssGroupManagerProxy:
-        "0x399ca67660B79F7aA8A7Efd5BEF9836A4c19CACF"
      values.TssStakingSlashing:
-        "0x09b276F9EcB83Fb6a37970e655863B04143Dc431"
      values.TssStakingSlashingProxy:
-        "0x78CF48880E9e1b3ab209779c0D8A76f611e53e81"
      template:
+        "opstack/AddressManager"
      displayName:
+        "AddressManager"
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      issuedPermissions:
+        [{"permission":"configure","target":"0x4e59e778a0fb77fBb305637435C62FaeD9aED40f","via":[{"address":"0xca35F8338054739D138884685e08b39EE2217794","delay":0,"description":"set and change address mappings."}]}]
    }
```

```diff
-   Status: DELETED
    contract StateCommitmentChain (0x89E9D387555AF0cDE22cb98833Bae40d640AD7fa)
    +++ description: None
```

```diff
    contract PubkeyCompendium (0x92986cd63C3409b7dA2882624B6d6E7Cf660707a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x47D58744D8515d9aaEAf961bc03625118bd91EBb"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb","delay":0}
    }
```

```diff
    contract L1StandardBridge (0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
    }
```

```diff
    contract MantleSecondStrat (0xA937660031787C4408587D2c6A67Ec4B260630F5) {
    +++ description: Basic do-nothing investment strategy.
      issuedPermissions.0.target:
-        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83","delay":0}
      descriptions:
+        ["Basic do-nothing investment strategy."]
    }
```

```diff
    contract RegistryPermission (0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83","delay":0}
    }
```

```diff
    contract OptimismPortal (0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract DataLayrChallenge (0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x47D58744D8515d9aaEAf961bc03625118bd91EBb"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xca35F8338054739D138884685e08b39EE2217794) {
    +++ description: None
      directlyReceivedPermissions.4:
+        {"permission":"upgrade","target":"0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"}
      directlyReceivedPermissions.3.target:
-        "0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"
+        "0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012"
      directlyReceivedPermissions.3.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      directlyReceivedPermissions.2.target:
-        "0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012"
+        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
      directlyReceivedPermissions.1.target:
-        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
+        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
      directlyReceivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.0.target:
-        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
+        "0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42"
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract MantleFirstStrat (0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1) {
    +++ description: Basic do-nothing investment strategy.
      issuedPermissions.0.target:
-        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83","delay":0}
      descriptions:
+        ["Basic do-nothing investment strategy."]
    }
```

```diff
    contract DataLayrChallengeUtils (0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x47D58744D8515d9aaEAf961bc03625118bd91EBb"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb","delay":0}
    }
```

```diff
-   Status: DELETED
    contract ChainStorageContainerSCC (0xd3f0BD982D72e28cccc69e0A9dA439e9D587b3bD)
    +++ description: None
```

```diff
    contract Delegation (0xeA4F1fE4928f1f83a450899C068bcd455BaF4798) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83","delay":0}
    }
```

Generated with discovered.json: 0x4bc1aea05c2646ed4a46497d6d84f24ee0904a70

# Diff at Tue, 01 Oct 2024 10:52:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20675899
- current block number: 20675899

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675899 (main branch discovery), not current.

```diff
    contract BLSRegistry (0x1eD35B793d887e028493dAC4a11AA5Feb811dd67) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-28T06:00:47.000Z",["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]],["2023-06-28T06:05:35.000Z",["0x64F4244eEA17a361bb919A28F614C3ad1aC565ad"]]]
    }
```

```diff
    contract InvestmentManager (0x23754725a49c0f003C349A6C7869fF8609a7CEfd) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-28T05:42:35.000Z",["0xa288E750401E6d15A62e3400C87d3ee331650a0C"]],["2023-06-28T05:46:11.000Z",["0x7C4813A9AF2FEA4ca765a26b05d128926E94e72E"]]]
    }
```

```diff
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-15T08:19:35.000Z",["0xD1230865641561653406906Fb08873F011c19080"]]]
    }
```

```diff
    contract L1MantleToken (0x3c3a81e81dc49A522A592e7622A7E711c06bf354) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-20T06:16:35.000Z",["0xCd368c1d80120b0Dd92447c87eB570154f8e685c"]]]
    }
```

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-15T01:47:47.000Z",["0x6Dbb7D9C5dC60844B8CF442ddC6Be081c060B2E3"]]]
    }
```

```diff
    contract EigenDataLayerChain (0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-02T07:18:23.000Z",["0xDF401d4229Fc6cA52238f7e55A04FA8EBc24C55a"]]]
    }
```

```diff
    contract DataLayrServiceManager (0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-28T05:59:35.000Z",["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]],["2023-06-28T06:04:23.000Z",["0xAB42127980a3bff124E6465e097a5fC97228827e"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x676A795fe6E43C17c668de16730c3F690FEB7120) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-28T13:13:59.000Z",["0x4692363048d0F32a2dE7816860D48fff0c61B24B"]],["2024-03-15T01:47:47.000Z",["0x0000000000000000000000000000000000000000"]],["2024-03-15T08:19:35.000Z",["0xb8DE82551fA4BA3bE4B3d9097763EDBeED541308"]]]
      values.$upgradeCount:
+        3
    }
```

```diff
    contract PubkeyCompendium (0x92986cd63C3409b7dA2882624B6d6E7Cf660707a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-28T05:59:59.000Z",["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]],["2023-06-28T06:04:47.000Z",["0x18Dd3cBE484f955217165FEaC6fe928D04a56a72"]]]
    }
```

```diff
    contract L1StandardBridge (0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract MantleSecondStrat (0xA937660031787C4408587D2c6A67Ec4B260630F5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-28T05:48:11.000Z",["0x9FEcF38689349a5CFf97526610CdB27618edc6b9"]]]
    }
```

```diff
    contract RegistryPermission (0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-28T05:42:59.000Z",["0xa288E750401E6d15A62e3400C87d3ee331650a0C"]],["2023-06-28T05:46:35.000Z",["0xAb00B934DE01c1b4931047125C2ba5B3d6186b85"]]]
    }
```

```diff
    contract OptimismPortal (0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-15T08:19:35.000Z",["0xe1399f54ba2597b4EaDA9E3450c34D393fb131A7"]]]
    }
```

```diff
    contract DataLayrChallenge (0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-28T06:00:23.000Z",["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]],["2023-06-28T06:05:11.000Z",["0x6EE53D3d6e622Ac0296369445AFB3CBBDc57C066"]]]
    }
```

```diff
    contract MantleFirstStrat (0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-28T05:47:23.000Z",["0x9FEcF38689349a5CFf97526610CdB27618edc6b9"]]]
    }
```

```diff
    contract DataLayrChallengeUtils (0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-28T05:59:11.000Z",["0x4b64d1Fd7cf1230468AEdF3a401cFe74cA9B366f"]],["2023-06-28T06:03:47.000Z",["0xd8d731624d97a66e012E62208cFc921d7033c564"]]]
    }
```

```diff
    contract Delegation (0xeA4F1fE4928f1f83a450899C068bcd455BaF4798) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-06-28T05:41:47.000Z",["0xa288E750401E6d15A62e3400C87d3ee331650a0C"]],["2023-06-28T05:45:11.000Z",["0xAdA69A18B30B3B9235AB2748116bB9195e16aDba"]]]
    }
```

Generated with discovered.json: 0x526487d00c87592c0df139620a2a63ce4ceb29ce

# Diff at Sun, 08 Sep 2024 17:18:43 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20675899
- current block number: 20675899

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675899 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xca35F8338054739D138884685e08b39EE2217794"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0xca35F8338054739D138884685e08b39EE2217794","delay":0}
    }
```

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xca35F8338054739D138884685e08b39EE2217794"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0xca35F8338054739D138884685e08b39EE2217794","delay":0}
    }
```

```diff
    contract MantleSecurityMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0xca35F8338054739D138884685e08b39EE2217794, inheriting its permissions."]
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb","via":[{"address":"0xca35F8338054739D138884685e08b39EE2217794"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012","via":[{"address":"0xca35F8338054739D138884685e08b39EE2217794"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A"}
      receivedPermissions.1.target:
-        "0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A"
+        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
      receivedPermissions.1.via:
+        [{"address":"0xca35F8338054739D138884685e08b39EE2217794"}]
      receivedPermissions.0.permission:
-        "configure"
+        "upgrade"
      receivedPermissions.0.target:
-        "0xca35F8338054739D138884685e08b39EE2217794"
+        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
      receivedPermissions.0.via:
+        [{"address":"0xca35F8338054739D138884685e08b39EE2217794"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xca35F8338054739D138884685e08b39EE2217794"}]
    }
```

```diff
    contract L1StandardBridge (0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xca35F8338054739D138884685e08b39EE2217794"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0xca35F8338054739D138884685e08b39EE2217794","delay":0}
    }
```

```diff
    contract OptimismPortal (0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xca35F8338054739D138884685e08b39EE2217794"
+        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      issuedPermissions.0.via.0:
+        {"address":"0xca35F8338054739D138884685e08b39EE2217794","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xca35F8338054739D138884685e08b39EE2217794) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x4e59e778a0fb77fBb305637435C62FaeD9aED40f","via":[]}]
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"},{"permission":"upgrade","target":"0x427Ea0710FA5252057F0D88274f7aeb308386cAf"},{"permission":"upgrade","target":"0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012"},{"permission":"upgrade","target":"0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"}]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"},{"permission":"upgrade","target":"0x427Ea0710FA5252057F0D88274f7aeb308386cAf"},{"permission":"upgrade","target":"0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012"},{"permission":"upgrade","target":"0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"}]
    }
```

Generated with discovered.json: 0xd84b7f1294db4201d0ccc3fa0b7e535ebfd494af

# Diff at Wed, 04 Sep 2024 08:04:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@878a951312cec062f5003f6749f781861b0cdba1 block: 20433272
- current block number: 20675899

## Description

One signer of MantleEngineeringMultisig is changed.

## Watched changes

```diff
    contract MantleEngineeringMultisig (0x2F44BD2a54aC3fB20cd7783cF94334069641daC9) {
    +++ description: None
      values.$members.3:
-        "0x66f13847536153eFFFFdfD7Bd4Dea5eD3F60f639"
+        "0x00da2F87c56C3a19BD863613995705095F55b524"
    }
```

Generated with discovered.json: 0x504f9af21a4c06cbc2570fc45c518eac5f65a44a

# Diff at Fri, 30 Aug 2024 07:53:40 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20433272
- current block number: 20433272

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20433272 (main branch discovery), not current.

```diff
    contract MantleTokenProxyAdmin (0x0cac2B1a172ac24012621101634DD5ABD6399ADd) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83) {
    +++ description: None
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x47D58744D8515d9aaEAf961bc03625118bd91EBb) {
    +++ description: None
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract MantleSecurityMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: It can act on behalf of 0xca35F8338054739D138884685e08b39EE2217794, inheriting its permissions.
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xca35F8338054739D138884685e08b39EE2217794) {
    +++ description: None
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xf0434885c949482e2f00d4ee14e60b71354d2882

# Diff at Fri, 23 Aug 2024 09:53:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20433272
- current block number: 20433272

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20433272 (main branch discovery), not current.

```diff
    contract BLSRegistry (0x1eD35B793d887e028493dAC4a11AA5Feb811dd67) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract InvestmentManager (0x23754725a49c0f003C349A6C7869fF8609a7CEfd) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1MantleToken (0x3c3a81e81dc49A522A592e7622A7E711c06bf354) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract EigenDataLayerChain (0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract DataLayrServiceManager (0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract PubkeyCompendium (0x92986cd63C3409b7dA2882624B6d6E7Cf660707a) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1StandardBridge (0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract MantleSecondStrat (0xA937660031787C4408587D2c6A67Ec4B260630F5) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RegistryPermission (0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract OptimismPortal (0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract DataLayrChallenge (0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract MantleFirstStrat (0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract DataLayrChallengeUtils (0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract Delegation (0xeA4F1fE4928f1f83a450899C068bcd455BaF4798) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x877e6cb0131e4f2a7530ddf4b9ac44004723cc22

# Diff at Wed, 21 Aug 2024 10:04:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20433272
- current block number: 20433272

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20433272 (main branch discovery), not current.

```diff
    contract MantleTokenProxyAdmin (0x0cac2B1a172ac24012621101634DD5ABD6399ADd) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x3c3a81e81dc49A522A592e7622A7E711c06bf354"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x3c3a81e81dc49A522A592e7622A7E711c06bf354","via":[]}]
    }
```

```diff
    contract BLSRegistry (0x1eD35B793d887e028493dAC4a11AA5Feb811dd67) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb","via":[]}]
    }
```

```diff
    contract InvestmentManager (0x23754725a49c0f003C349A6C7869fF8609a7CEfd) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x23754725a49c0f003C349A6C7869fF8609a7CEfd","0xA937660031787C4408587D2c6A67Ec4B260630F5","0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01","0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1","0xeA4F1fE4928f1f83a450899C068bcd455BaF4798"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x23754725a49c0f003C349A6C7869fF8609a7CEfd","via":[]},{"permission":"upgrade","target":"0xA937660031787C4408587D2c6A67Ec4B260630F5","via":[]},{"permission":"upgrade","target":"0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01","via":[]},{"permission":"upgrade","target":"0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1","via":[]},{"permission":"upgrade","target":"0xeA4F1fE4928f1f83a450899C068bcd455BaF4798","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xca35F8338054739D138884685e08b39EE2217794","via":[]}]
    }
```

```diff
    contract L1MantleToken (0x3c3a81e81dc49A522A592e7622A7E711c06bf354) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0cac2B1a172ac24012621101634DD5ABD6399ADd","via":[]}]
    }
```

```diff
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xca35F8338054739D138884685e08b39EE2217794","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x47D58744D8515d9aaEAf961bc03625118bd91EBb) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1eD35B793d887e028493dAC4a11AA5Feb811dd67","0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1","0x92986cd63C3409b7dA2882624B6d6E7Cf660707a","0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D","0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1eD35B793d887e028493dAC4a11AA5Feb811dd67","via":[]},{"permission":"upgrade","target":"0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1","via":[]},{"permission":"upgrade","target":"0x92986cd63C3409b7dA2882624B6d6E7Cf660707a","via":[]},{"permission":"upgrade","target":"0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94","via":[]},{"permission":"upgrade","target":"0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D","via":[]}]
    }
```

```diff
    contract MantleSecurityMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: It can act on behalf of 0xca35F8338054739D138884685e08b39EE2217794, inheriting its permissions.
      assignedPermissions:
-        {"upgrade":["0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A"],"configure":["0xca35F8338054739D138884685e08b39EE2217794"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xca35F8338054739D138884685e08b39EE2217794","via":[]},{"permission":"upgrade","target":"0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A","via":[]}]
    }
```

```diff
    contract EigenDataLayerChain (0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4e59e778a0fb77fBb305637435C62FaeD9aED40f","via":[]}]
    }
```

```diff
    contract DataLayrServiceManager (0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb","via":[]}]
    }
```

```diff
    contract PubkeyCompendium (0x92986cd63C3409b7dA2882624B6d6E7Cf660707a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xca35F8338054739D138884685e08b39EE2217794","via":[]}]
    }
```

```diff
    contract MantleSecondStrat (0xA937660031787C4408587D2c6A67Ec4B260630F5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83","via":[]}]
    }
```

```diff
    contract RegistryPermission (0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83","via":[]}]
    }
```

```diff
    contract OptimismPortal (0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xca35F8338054739D138884685e08b39EE2217794","via":[]}]
    }
```

```diff
    contract DataLayrChallenge (0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xca35F8338054739D138884685e08b39EE2217794) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481","0x427Ea0710FA5252057F0D88274f7aeb308386cAf","0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012","0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4e59e778a0fb77fBb305637435C62FaeD9aED40f","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481","via":[]},{"permission":"upgrade","target":"0x427Ea0710FA5252057F0D88274f7aeb308386cAf","via":[]},{"permission":"upgrade","target":"0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012","via":[]},{"permission":"upgrade","target":"0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb","via":[]}]
    }
```

```diff
    contract MantleFirstStrat (0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83","via":[]}]
    }
```

```diff
    contract DataLayrChallengeUtils (0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x47D58744D8515d9aaEAf961bc03625118bd91EBb","via":[]}]
    }
```

```diff
    contract Delegation (0xeA4F1fE4928f1f83a450899C068bcd455BaF4798) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83","via":[]}]
    }
```

Generated with discovered.json: 0x1e623bbead202cc00edaf74464ffdc390a2e1e8e

# Diff at Fri, 09 Aug 2024 12:00:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20433272
- current block number: 20433272

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20433272 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83) {
    +++ description: None
      assignedPermissions.upgrade.4:
-        "0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01"
+        "0xeA4F1fE4928f1f83a450899C068bcd455BaF4798"
      assignedPermissions.upgrade.3:
-        "0xA937660031787C4408587D2c6A67Ec4B260630F5"
+        "0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1"
      assignedPermissions.upgrade.2:
-        "0xeA4F1fE4928f1f83a450899C068bcd455BaF4798"
+        "0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01"
      assignedPermissions.upgrade.1:
-        "0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1"
+        "0xA937660031787C4408587D2c6A67Ec4B260630F5"
    }
```

```diff
    contract ProxyAdmin (0x47D58744D8515d9aaEAf961bc03625118bd91EBb) {
    +++ description: None
      assignedPermissions.upgrade.4:
-        "0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D"
+        "0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94"
      assignedPermissions.upgrade.3:
-        "0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94"
+        "0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D"
      assignedPermissions.upgrade.2:
-        "0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1"
+        "0x92986cd63C3409b7dA2882624B6d6E7Cf660707a"
      assignedPermissions.upgrade.1:
-        "0x1eD35B793d887e028493dAC4a11AA5Feb811dd67"
+        "0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1"
      assignedPermissions.upgrade.0:
-        "0x92986cd63C3409b7dA2882624B6d6E7Cf660707a"
+        "0x1eD35B793d887e028493dAC4a11AA5Feb811dd67"
    }
```

```diff
    contract ProxyAdmin (0xca35F8338054739D138884685e08b39EE2217794) {
    +++ description: None
      assignedPermissions.upgrade.3:
-        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
+        "0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"
      assignedPermissions.upgrade.2:
-        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
+        "0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012"
      assignedPermissions.upgrade.1:
-        "0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"
+        "0x427Ea0710FA5252057F0D88274f7aeb308386cAf"
      assignedPermissions.upgrade.0:
-        "0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012"
+        "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481"
    }
```

Generated with discovered.json: 0x12ff3e5e8ad11504598d06b204dad21c188db736

# Diff at Fri, 09 Aug 2024 10:10:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20433272
- current block number: 20433272

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20433272 (main branch discovery), not current.

```diff
    contract MantleTokenProxyAdmin (0x0cac2B1a172ac24012621101634DD5ABD6399ADd) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x3c3a81e81dc49A522A592e7622A7E711c06bf354"]
      assignedPermissions.upgrade:
+        ["0x3c3a81e81dc49A522A592e7622A7E711c06bf354"]
    }
```

```diff
    contract ProxyAdmin (0x2Cd33d3DC4d6Ea24B6941e4741F4Bf4772929e83) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x23754725a49c0f003C349A6C7869fF8609a7CEfd","0xA937660031787C4408587D2c6A67Ec4B260630F5","0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01","0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1","0xeA4F1fE4928f1f83a450899C068bcd455BaF4798"]
      assignedPermissions.upgrade:
+        ["0x23754725a49c0f003C349A6C7869fF8609a7CEfd","0xCAD08A7B9eF6ADeFAef08d0d85a577a288F93Ee1","0xeA4F1fE4928f1f83a450899C068bcd455BaF4798","0xA937660031787C4408587D2c6A67Ec4B260630F5","0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01"]
    }
```

```diff
    contract MantleEngineeringMultisig (0x2F44BD2a54aC3fB20cd7783cF94334069641daC9) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 7 (43%)"
      values.getOwners:
-        ["0xC37642355c18ec9c3b3268AAC67e33516aa115eb","0x207E804758e28F2b3fD6E4219671B327100b82f8","0x5a021DC06A9630bb56099b8aEdfaDC2dEa7eB317","0x66f13847536153eFFFFdfD7Bd4Dea5eD3F60f639","0xbE73dea9c8DcDdB6b03F7e5797b85982065fe34e","0x3Dc5FcB0Ad5835C6059112e51A75b57DBA668eB8","0x915dc866e2e5E64f912A5ac1D40E3be4597F172a"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xC37642355c18ec9c3b3268AAC67e33516aa115eb","0x207E804758e28F2b3fD6E4219671B327100b82f8","0x5a021DC06A9630bb56099b8aEdfaDC2dEa7eB317","0x66f13847536153eFFFFdfD7Bd4Dea5eD3F60f639","0xbE73dea9c8DcDdB6b03F7e5797b85982065fe34e","0x3Dc5FcB0Ad5835C6059112e51A75b57DBA668eB8","0x915dc866e2e5E64f912A5ac1D40E3be4597F172a"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 7 (43%)"
    }
```

```diff
    contract ProxyAdmin (0x47D58744D8515d9aaEAf961bc03625118bd91EBb) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1eD35B793d887e028493dAC4a11AA5Feb811dd67","0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1","0x92986cd63C3409b7dA2882624B6d6E7Cf660707a","0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D","0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94"]
      assignedPermissions.upgrade:
+        ["0x92986cd63C3409b7dA2882624B6d6E7Cf660707a","0x1eD35B793d887e028493dAC4a11AA5Feb811dd67","0x5BD63a7ECc13b955C4F57e3F12A64c10263C14c1","0xc9C24f1aaD2614E81f033746292F5Dc5d7Ccad94","0xCDC78c5eaea2dE33B00a9200Ee1700937fb0f55D"]
    }
```

```diff
    contract MantleSecurityMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: It can act on behalf of 0xca35F8338054739D138884685e08b39EE2217794, inheriting its permissions.
      assignedPermissions.admin:
-        ["0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A"]
      assignedPermissions.owner:
-        ["0xca35F8338054739D138884685e08b39EE2217794"]
      assignedPermissions.upgrade:
+        ["0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A"]
      assignedPermissions.configure:
+        ["0xca35F8338054739D138884685e08b39EE2217794"]
      values.$multisigThreshold:
-        "6 of 13 (46%)"
      values.getOwners:
-        ["0xf73546Da2F971bD0Ed1b3c5F9C01092180Db5089","0x61Af7a48B0EeA8481E5A055A35f829d0e8505fE3","0x422f2df38B96395A7E61d4C02aDd4413bb79A9FC","0x207E804758e28F2b3fD6E4219671B327100b82f8","0xbE73dea9c8DcDdB6b03F7e5797b85982065fe34e","0x5a021DC06A9630bb56099b8aEdfaDC2dEa7eB317","0x7735cDcc85E63A7684C29652DbE8B845e0b4635A","0x3Dc5FcB0Ad5835C6059112e51A75b57DBA668eB8","0xf5b16239f88B54894e03e0293d3d7FDdEb9f9070","0xe75D7324d6BC4E70A200c5E268160332F43b2d2B","0x3000BE80ad204D327990eB403654aCd1Eaa8eCeb","0xc4143711aA5bd6d37F1b0A690120AA5859e32A93","0x915dc866e2e5E64f912A5ac1D40E3be4597F172a"]
      values.getThreshold:
-        6
      values.$members:
+        ["0xf73546Da2F971bD0Ed1b3c5F9C01092180Db5089","0x61Af7a48B0EeA8481E5A055A35f829d0e8505fE3","0x422f2df38B96395A7E61d4C02aDd4413bb79A9FC","0x207E804758e28F2b3fD6E4219671B327100b82f8","0xbE73dea9c8DcDdB6b03F7e5797b85982065fe34e","0x5a021DC06A9630bb56099b8aEdfaDC2dEa7eB317","0x7735cDcc85E63A7684C29652DbE8B845e0b4635A","0x3Dc5FcB0Ad5835C6059112e51A75b57DBA668eB8","0xf5b16239f88B54894e03e0293d3d7FDdEb9f9070","0xe75D7324d6BC4E70A200c5E268160332F43b2d2B","0x3000BE80ad204D327990eB403654aCd1Eaa8eCeb","0xc4143711aA5bd6d37F1b0A690120AA5859e32A93","0x915dc866e2e5E64f912A5ac1D40E3be4597F172a"]
      values.$threshold:
+        6
      values.multisigThreshold:
+        "6 of 13 (46%)"
    }
```

```diff
    contract GnosisSafe (0x7735cDcc85E63A7684C29652DbE8B845e0b4635A) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0x5881541E79f5D9d5d72c87E8Ea6F681CAb289B12","0x2288226d687c01B7332c2A99A0C5A4a112c63f1e"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x5881541E79f5D9d5d72c87E8Ea6F681CAb289B12","0x2288226d687c01B7332c2A99A0C5A4a112c63f1e"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract ProxyAdmin (0xca35F8338054739D138884685e08b39EE2217794) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481","0x427Ea0710FA5252057F0D88274f7aeb308386cAf","0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012","0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"]
      assignedPermissions.upgrade:
+        ["0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012","0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb","0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481","0x427Ea0710FA5252057F0D88274f7aeb308386cAf"]
    }
```

Generated with discovered.json: 0x47f246c1b4fd1e4a70f61cb95293dbfa09886564

# Diff at Thu, 01 Aug 2024 11:03:10 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@03fdf86a062c9d83062b678171d068bd5c4a79aa block: 19531981
- current block number: 20433272

## Description

Add the total stake for of MantleDA.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531981 (main branch discovery), not current.

```diff
    contract BLSRegistry (0x1eD35B793d887e028493dAC4a11AA5Feb811dd67) {
    +++ description: None
      values.totalStake:
+        ["1000000000000000000000000",0]
    }
```

```diff
    contract MantleEngineeringMultisig (0x2F44BD2a54aC3fB20cd7783cF94334069641daC9) {
    +++ description: None
      name:
-        "Owner2Multisig"
+        "MantleEngineeringMultisig"
    }
```

```diff
    contract MantleSecurityMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: It can act on behalf of 0xca35F8338054739D138884685e08b39EE2217794, inheriting its permissions.
      name:
-        "OwnerMultisig"
+        "MantleSecurityMultisig"
    }
```

```diff
    contract RegistryPermission (0xBcF6d8273DAF842b6Fc288b08E48C438Fa911D01) {
    +++ description: None
      values.dataStorePermission:
+        ["0x2f40D796917ffB642bD2e2bdD2C762A5e40fd749","0x50Fa427235C7C8cAA4A0C21b5009f5a0d015B23A"]
      values.deregisterOperatorPermission:
+        []
      values.registerOperatorPermission:
+        ["0x1888e4aC2Ab37A73B33448B87bABdD1ce1dcBAbe","0x717c3DC6Df69c316d6Ac593077BC84Cc86f214A4","0x8BEF0466b7C2CbFD753eF340e062dF06E93ADA7f","0xc1dEd495E1dDf089B2b41d6397C0aBa04BDA1A21","0x6cc5A6F5a9E4757790e4068Aa9757226Cb854B64","0x550b3CB2D5fB5E4F0A08322CaC7b04291558CDa8","0x8A3D6c77E5BAcE8cb0822B28E4Fc56FC06fB5645","0xB61298691FE0df10634A67dd83b2253E74cbF7fb","0xcEb157a9bB9c80a845d5924e8CEAA591Caf705a5","0x0B6F2C77C3740A5e6f88A4eCdd02C10BE8a2e323"]
    }
```

Generated with discovered.json: 0x565461d71ce076e91d1237caa87e8dd7846f5c5e

# Diff at Thu, 18 Jul 2024 10:31:51 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19531981
- current block number: 19531981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531981 (main branch discovery), not current.

```diff
    contract OwnerMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0xca35F8338054739D138884685e08b39EE2217794, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x3515691705b04980bf76d4b6f6cc0b6ce2f50896

# Diff at Thu, 28 Mar 2024 10:21:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19477042
- current block number: 19531981

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19477042 (main branch discovery), not current.

```diff
    contract Owner2Multisig (0x2F44BD2a54aC3fB20cd7783cF94334069641daC9) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 7 (43%)"
    }
```

```diff
    contract OwnerMultisig (0x4e59e778a0fb77fBb305637435C62FaeD9aED40f) {
    +++ description: None
      upgradeability.threshold:
+        "6 of 13 (46%)"
    }
```

```diff
    contract GnosisSafe (0x7735cDcc85E63A7684C29652DbE8B845e0b4635A) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 2 (100%)"
    }
```

Generated with discovered.json: 0xc9d1fbc1a9147a6b42e379d18dc691e2e6e62438

# Diff at Wed, 20 Mar 2024 16:17:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@88f881ab370a6b85fd531f2bc620891afd1f41bb block: 19469245
- current block number: 19477042

## Description

Removed from discovery not utilized old contracts.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19469245 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract TssGroupManager (0x399ca67660B79F7aA8A7Efd5BEF9836A4c19CACF)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TssStakingSlashing (0x78CF48880E9e1b3ab209779c0D8A76f611e53e81)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TssDelegationSlasher (0x910265C29c099eAc87EF6d374b6f3bE45B516EB7)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TssDelegationManager (0xA90FCe37D274e673f3850b835F18790542b1755d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TssDelegation (0xd4B5E3D46D202C3523C3Ad89dfe74eC272BFC96A)
    +++ description: None
```

Generated with discovered.json: 0x69e2aa7bef3e340dd92701d3a1b540b16e9354b4

# Diff at Tue, 19 Mar 2024 14:00:41 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@ed3dd09f83459eadf3704e0797de8bbf1ae98817 block: 18469566
- current block number: 19469245

## Description

Update discovery to include the multisig threshold.

## Watched changes

```diff
-   Status: DELETED
    contract BondManager (0x31aBe1c466C2A8b95fd84258dD1471472979B650)
    +++ description: None
```

```diff
-   Status: DELETED
    contract VerifierEntry (0x3F77D44E1789D47e076a4d5f2779a1fCAb821C2a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x47336ae44F573a7C3C41a9ae04A9D48E5dFD8f8E)
    +++ description: None
```

```diff
    contract L1CrossDomainMessenger (0x676A795fe6E43C17c668de16730c3F690FEB7120) {
    +++ description: None
      upgradeability.implementation:
-        "0x4692363048d0F32a2dE7816860D48fff0c61B24B"
+        "0xb8DE82551fA4BA3bE4B3d9097763EDBeED541308"
      implementations.0:
-        "0x4692363048d0F32a2dE7816860D48fff0c61B24B"
+        "0xb8DE82551fA4BA3bE4B3d9097763EDBeED541308"
      values.getPauseOwner:
-        "0x2F44BD2a54aC3fB20cd7783cF94334069641daC9"
      values.libAddressManager:
-        "0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42"
      values.owner:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
      values.paused:
-        false
      values.HASH_MESSAGE_BASE_GAS:
+        800
      values.HASH_MESSAGE_GAS_PER_BYTE:
+        2
      values.L1_MNT_ADDRESS:
+        "0x3c3a81e81dc49A522A592e7622A7E711c06bf354"
      values.MESSAGE_VERSION:
+        1
      values.MIN_GAS_CALLDATA_OVERHEAD:
+        16
      values.MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR:
+        63
      values.MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR:
+        64
      values.OTHER_MESSENGER:
+        "0x4200000000000000000000000000000000000007"
      values.PORTAL:
+        "0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb"
      values.RELAY_CALL_OVERHEAD:
+        40000
      values.RELAY_CONSTANT_OVERHEAD:
+        200000
      values.RELAY_GAS_CHECK_BUFFER:
+        55000
      values.RELAY_RESERVED_GAS:
+        90000
      values.version:
+        "1.5.0"
    }
```

```diff
    contract AddressManager (0x6968f3F16C3e64003F02E121cf0D5CCBf5625a42) {
    +++ description: None
      values.BondManager:
-        "0x31aBe1c466C2A8b95fd84258dD1471472979B650"
+        "0x0000000000000000000000000000000000000000"
      values.FraudVerifier:
-        "0x2F44BD2a54aC3fB20cd7783cF94334069641daC9"
+        "0x0000000000000000000000000000000000000000"
      values.L1CrossDomainMessenger:
-        "0x4692363048d0F32a2dE7816860D48fff0c61B24B"
+        "0xb8DE82551fA4BA3bE4B3d9097763EDBeED541308"
      values.owner:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
+        "0xca35F8338054739D138884685e08b39EE2217794"
      values.proposer:
-        "0xD1328C9167e0693B689b5aa5a024379d4e437858"
+        "0x0000000000000000000000000000000000000000"
      values.sequencer:
-        "0x2F6AFE2E3feA041b892a6e240Fd1A0E5b51e8376"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x84A628347537d4900a0b720Ee294445F90c3887a)
    +++ description: None
```

```diff
    contract L1StandardBridge (0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012) {
    +++ description: None
      upgradeability.implementation:
-        "0x6B6e0dC564d4603452E40752ecDAa0e9630B38A2"
+        "0xb4133552BA49dFb60DA6eb5cA0102d0f94ce071f"
      upgradeability.admin:
-        "0x4e59e778a0fb77fBb305637435C62FaeD9aED40f"
+        "0xca35F8338054739D138884685e08b39EE2217794"
      implementations.0:
-        "0x6B6e0dC564d4603452E40752ecDAa0e9630B38A2"
+        "0xb4133552BA49dFb60DA6eb5cA0102d0f94ce071f"
      values.l1MantleAddress:
-        "0x3c3a81e81dc49A522A592e7622A7E711c06bf354"
      values.L1_MNT_ADDRESS:
+        "0x3c3a81e81dc49A522A592e7622A7E711c06bf354"
      values.MESSENGER:
+        "0x676A795fe6E43C17c668de16730c3F690FEB7120"
      values.OTHER_BRIDGE:
+        "0x4200000000000000000000000000000000000010"
      values.version:
+        "1.1.0"
    }
```

```diff
-   Status: DELETED
    contract AssertionMap (0xa0d79E982bfD3C2ccD09D2E374ddC75fe328f317)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Rollup (0xD1328C9167e0693B689b5aa5a024379d4e437858)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x427Ea0710FA5252057F0D88274f7aeb308386cAf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xca35F8338054739D138884685e08b39EE2217794)
    +++ description: None
```

## Source code changes

```diff
.../L1/fraud-proof/AssertionMap.sol => /dev/null   |  153 ---
 .../fraud-proof/libraries/Errors.sol => /dev/null  |   40 -
 .../implementation/meta.txt => /dev/null           |    2 -
 .../proxy/ERC1967/ERC1967Proxy.sol => /dev/null    |   32 -
 .../proxy/ERC1967/ERC1967Upgrade.sol => /dev/null  |  193 ---
 .../contracts/proxy/Proxy.sol => /dev/null         |   85 --
 .../proxy/beacon/IBeacon.sol => /dev/null          |   15 -
 .../contracts/utils/StorageSlot.sol => /dev/null   |   83 --
 .../TransparentUpgradeableProxy.sol => /dev/null   |  124 --
 .../AssertionMap/proxy/meta.txt => /dev/null       |    2 -
 .../L1/verification/BondManager.sol => /dev/null   |   33 -
 .../L1/verification/IBondManager.sol => /dev/null  |   13 -
 .../resolver/Lib_AddressManager.sol => /dev/null   |   61 -
 .../resolver/Lib_AddressResolver.sol => /dev/null  |   40 -
 .../BondManager/meta.txt => /dev/null              |    2 -
 .../implementation/contracts/GnosisSafe.sol        |    0
 .../implementation/contracts/base/Executor.sol     |    0
 .../contracts/base/FallbackManager.sol             |    0
 .../implementation/contracts/base/GuardManager.sol |    0
 .../contracts/base/ModuleManager.sol               |    0
 .../implementation/contracts/base/OwnerManager.sol |    0
 .../implementation/contracts/common/Enum.sol       |    0
 .../contracts/common/EtherPaymentFallback.sol      |    0
 .../contracts/common/SecuredTokenTransfer.sol      |    0
 .../contracts/common/SelfAuthorized.sol            |    0
 .../contracts/common/SignatureDecoder.sol          |    0
 .../implementation/contracts/common/Singleton.sol  |    0
 .../contracts/common/StorageAccessible.sol         |    0
 .../contracts/external/GnosisSafeMath.sol          |    0
 .../contracts/interfaces/ISignatureValidator.sol   |    0
 .../GnosisSafe}/implementation/meta.txt            |    0
 .../GnosisSafe}/proxy/GnosisSafeProxy.sol          |    0
 .../GnosisSafe}/proxy/meta.txt                     |    0
 .../proxy/meta.txt => /dev/null                    |    2 -
 .../contracts/GnosisSafe.sol => /dev/null          |  422 ------
 .../contracts/base/Executor.sol => /dev/null       |   27 -
 .../base/FallbackManager.sol => /dev/null          |   53 -
 .../contracts/base/GuardManager.sol => /dev/null   |   50 -
 .../contracts/base/ModuleManager.sol => /dev/null  |  133 --
 .../contracts/base/OwnerManager.sol => /dev/null   |  149 ---
 .../contracts/common/Enum.sol => /dev/null         |    8 -
 .../common/EtherPaymentFallback.sol => /dev/null   |   13 -
 .../common/SecuredTokenTransfer.sol => /dev/null   |   35 -
 .../common/SelfAuthorized.sol => /dev/null         |   16 -
 .../common/SignatureDecoder.sol => /dev/null       |   36 -
 .../contracts/common/Singleton.sol => /dev/null    |   11 -
 .../common/StorageAccessible.sol => /dev/null      |   47 -
 .../external/GnosisSafeMath.sol => /dev/null       |   54 -
 .../ISignatureValidator.sol => /dev/null           |   20 -
 .../implementation/meta.txt => /dev/null           |    2 -
 .../proxy/GnosisSafeProxy.sol => /dev/null         |  155 ---
 .../contracts/GnosisSafe.sol => /dev/null          |  422 ------
 .../contracts/base/Executor.sol => /dev/null       |   27 -
 .../base/FallbackManager.sol => /dev/null          |   53 -
 .../contracts/base/GuardManager.sol => /dev/null   |   50 -
 .../contracts/base/ModuleManager.sol => /dev/null  |  133 --
 .../contracts/base/OwnerManager.sol => /dev/null   |  149 ---
 .../contracts/common/Enum.sol => /dev/null         |    8 -
 .../common/EtherPaymentFallback.sol => /dev/null   |   13 -
 .../common/SecuredTokenTransfer.sol => /dev/null   |   35 -
 .../common/SelfAuthorized.sol => /dev/null         |   16 -
 .../common/SignatureDecoder.sol => /dev/null       |   36 -
 .../contracts/common/Singleton.sol => /dev/null    |   11 -
 .../common/StorageAccessible.sol => /dev/null      |   47 -
 .../external/GnosisSafeMath.sol => /dev/null       |   54 -
 .../ISignatureValidator.sol => /dev/null           |   20 -
 .../implementation/meta.txt => /dev/null           |    2 -
 .../proxy/GnosisSafeProxy.sol => /dev/null         |  155 ---
 .../proxy/meta.txt => /dev/null                    |    2 -
 .../security/PausableUpgradeable.sol => /dev/null  |  117 --
 .../ReentrancyGuardUpgradeable.sol => /dev/null    |   75 --
 .../contracts/L1/L1CrossDomainMessenger.sol        |  299 +++++
 .../implementation/contracts/L1/L2OutputOracle.sol |  350 +++++
 .../implementation/contracts/L1/OptimismPortal.sol |  552 ++++++++
 .../contracts/L1/ResourceMetering.sol              |  188 +++
 .../implementation/contracts/L1/SystemConfig.sol   |  319 +++++
 .../IL1CrossDomainMessenger.sol => /dev/null       |   63 -
 .../L1CrossDomainMessenger.sol => /dev/null        |  401 ------
 .../ICanonicalTransactionChain.sol => /dev/null    |  179 ---
 .../rollup/IChainStorageContainer.sol => /dev/null |   67 -
 .../rollup/IStateCommitmentChain.sol => /dev/null  |  101 --
 .../contracts/L2/L2CrossDomainMessenger.sol        |  307 +++++
 .../contracts/L2/L2ToL1MessagePasser.sol           |  164 +++
 .../contracts/libraries/Arithmetic.sol             |   48 +
 .../implementation/contracts/libraries/Burn.sol    |   42 +
 .../implementation/contracts/libraries/Bytes.sol}  |   99 +-
 .../contracts/libraries/Constants.sol              |   49 +
 .../contracts/libraries/Encoding.sol               |  169 +++
 .../implementation/contracts/libraries/Hashing.sol |  177 +++
 .../contracts/libraries/Predeploys.sol             |  119 ++
 .../contracts/libraries/SafeCall.sol               |  160 +++
 .../implementation/contracts/libraries/Types.sol   |   90 ++
 .../bridge/ICrossDomainMessenger.sol => /dev/null  |   43 -
 .../bridge/Lib_CrossDomainUtils.sol => /dev/null   |   31 -
 .../libraries/codec/Lib_BVMCodec.sol => /dev/null  |  145 ---
 .../constants/Lib_DefaultValues.sol => /dev/null   |   12 -
 .../Lib_PredeployAddresses.sol => /dev/null        |   22 -
 .../resolver/Lib_AddressManager.sol => /dev/null   |   61 -
 .../resolver/Lib_AddressResolver.sol => /dev/null  |   40 -
 .../libraries/rlp/Lib_RLPReader.sol => /dev/null   |  388 ------
 .../libraries/rlp/Lib_RLPWriter.sol => /dev/null   |  208 ---
 .../contracts/libraries/rlp/RLPReader.sol          |  359 ++++++
 .../contracts/libraries/rlp}/RLPWriter.sol         |   10 +-
 .../libraries/trie/Lib_MerkleTrie.sol => /dev/null |  304 -----
 .../trie/Lib_SecureMerkleTrie.sol => /dev/null     |   66 -
 .../contracts/libraries/trie/MerkleTrie.sol        |  288 +++++
 .../contracts/libraries/trie/SecureMerkleTrie.sol  |   64 +
 .../utils/Lib_Bytes32Utils.sol => /dev/null        |   47 -
 .../contracts/universal/CrossDomainMessenger.sol   |  598 +++++++++
 .../contracts/universal/IOptimismMintableERC20.sol |   34 +
 .../contracts/universal/OptimismMintableERC20.sol  |  149 +++
 .../implementation/contracts/universal/Semver.sol  |   58 +
 .../contracts/vendor}/AddressAliasHelper.sol       |    2 +-
 .../L1CrossDomainMessenger/implementation/meta.txt |    2 +-
 .../contracts/proxy/utils/Initializable.sol        |  138 ++
 .../@openzeppelin/contracts/token/ERC20/ERC20.sol  |  383 ++++++
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |   39 +-
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 +
 .../contracts/token/ERC20/utils/SafeERC20.sol      |   18 +
 .../@openzeppelin/contracts/utils/Address.sol      |   26 +-
 .../@openzeppelin/contracts/utils/Context.sol      |    1 +
 .../@openzeppelin/contracts/utils/Strings.sol      |   75 ++
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../@openzeppelin/contracts/utils/math/Math.sol    |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../access/OwnableUpgradeable.sol                  |    0
 .../proxy/utils/Initializable.sol                  |    0
 .../utils/AddressUpgradeable.sol                   |    0
 .../utils/ContextUpgradeable.sol                   |    0
 .../solmate/src/utils/FixedPointMathLib.sol        |  366 ++++++
 .../contracts/L1/L1StandardBridge.sol              |  896 +++++++++++++
 .../contracts/L1/ResourceMetering.sol              |  188 +++
 .../L1/messaging/IL1ERC20Bridge.sol => /dev/null   |  124 --
 .../messaging/IL1StandardBridge.sol => /dev/null   |   75 --
 .../L1/messaging/L1StandardBridge.sol => /dev/null |  298 -----
 .../contracts/L2/L2StandardBridge.sol              |  711 ++++++++++
 .../L2/messaging/IL2ERC20Bridge.sol => /dev/null   |  108 --
 .../contracts/libraries/Arithmetic.sol             |   48 +
 .../implementation/contracts/libraries/Burn.sol    |   42 +
 .../contracts/libraries/Constants.sol              |   49 +
 .../contracts/libraries/Encoding.sol               |  169 +++
 .../implementation/contracts/libraries/Hashing.sol |  177 +++
 .../contracts/libraries/Predeploys.sol             |  119 ++
 .../contracts/libraries/SafeCall.sol               |  160 +++
 .../implementation/contracts/libraries/Types.sol   |   90 ++
 .../bridge/CrossDomainEnabled.sol => /dev/null     |   83 --
 .../bridge/ICrossDomainMessenger.sol => /dev/null  |   43 -
 .../Lib_PredeployAddresses.sol => /dev/null        |   22 -
 .../contracts/libraries/rlp}/RLPWriter.sol         |   10 +-
 .../contracts/universal/CrossDomainMessenger.sol   |  598 +++++++++
 .../contracts/universal/IOptimismMintableERC20.sol |   34 +
 .../contracts/universal/OptimismMintableERC20.sol  |  149 +++
 .../implementation/contracts/universal/Semver.sol  |   58 +
 .../contracts/universal/StandardBridge.sol         |  643 ++++++++++
 .../L1StandardBridge/implementation/meta.txt       |    2 +-
 .../contracts/proxy/utils/Initializable.sol        |  138 ++
 .../@openzeppelin/contracts/token/ERC20/ERC20.sol  |  383 ++++++
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |   39 +-
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 +
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../@openzeppelin/contracts/utils/Address.sol      |   26 +-
 .../@openzeppelin/contracts/utils/Context.sol      |    1 +
 .../@openzeppelin/contracts/utils/Strings.sol      |   75 ++
 .../utils/introspection/ERC165Checker.sol          |  123 ++
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../@openzeppelin/contracts/utils/math/Math.sol    |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../proxy/utils/Initializable.sol                  |    0
 .../utils/AddressUpgradeable.sol                   |    0
 .../solmate/src/utils/FixedPointMathLib.sol        |  366 ++++++
 .../implementation/contracts/L1/L2OutputOracle.sol |  350 +++++
 .../implementation/contracts/libraries/Types.sol   |   90 ++
 .../implementation/contracts/universal/Semver.sol  |   58 +
 .../.code/L2OutputOracle/implementation/meta.txt   |    2 +
 .../contracts/proxy/utils/Initializable.sol        |  138 ++
 .../@openzeppelin/contracts/utils/Address.sol      |   26 +-
 .../@openzeppelin/contracts/utils/Strings.sol      |   75 ++
 .../proxy/contracts/universal/Proxy.sol            |  217 ++++
 .../ethereum/.code/L2OutputOracle/proxy/meta.txt   |    2 +
 .../implementation/contracts/L1/L2OutputOracle.sol |  350 +++++
 .../implementation/contracts/L1/OptimismPortal.sol |  552 ++++++++
 .../contracts/L1/ResourceMetering.sol              |  188 +++
 .../implementation/contracts/L1/SystemConfig.sol   |  319 +++++
 .../contracts/libraries/Arithmetic.sol             |   48 +
 .../implementation/contracts/libraries/Burn.sol    |   42 +
 .../implementation/contracts/libraries/Bytes.sol}  |   99 +-
 .../contracts/libraries/Constants.sol              |   49 +
 .../contracts/libraries/Encoding.sol               |  169 +++
 .../implementation/contracts/libraries/Hashing.sol |  177 +++
 .../contracts/libraries/SafeCall.sol               |  160 +++
 .../implementation/contracts/libraries/Types.sol   |   90 ++
 .../contracts/libraries/rlp/RLPReader.sol          |  359 ++++++
 .../contracts/libraries/rlp/RLPWriter.sol}         |   69 +-
 .../contracts/libraries/trie/MerkleTrie.sol        |  288 +++++
 .../contracts/libraries/trie/SecureMerkleTrie.sol  |   64 +
 .../implementation/contracts/universal/Semver.sol  |   58 +
 .../contracts/vendor/AddressAliasHelper.sol        |   43 +
 .../.code/OptimismPortal/implementation/meta.txt   |    2 +
 .../contracts/proxy/utils/Initializable.sol        |  138 ++
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |   82 ++
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 +
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 ++
 .../@openzeppelin/contracts/utils/Address.sol      |   26 +-
 .../@openzeppelin/contracts/utils/Strings.sol      |   75 ++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../access/OwnableUpgradeable.sol                  |    0
 .../proxy/utils/Initializable.sol                  |    0
 .../utils/AddressUpgradeable.sol                   |    0
 .../utils/ContextUpgradeable.sol                   |    0
 .../solmate/src/utils/FixedPointMathLib.sol        |  366 ++++++
 .../proxy/contracts/universal/Proxy.sol            |  217 ++++
 .../ethereum/.code/OptimismPortal/proxy/meta.txt   |    2 +
 .../contracts/legacy/AddressManager.sol            |   64 +
 .../contracts/legacy/L1ChugSplashProxy.sol         |  289 +++++
 .../contracts/universal/Proxy.sol                  |  217 ++++
 .../contracts/universal/ProxyAdmin.sol             |  254 ++++
 .../meta.txt                                       |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   26 +-
 .../@openzeppelin/contracts/utils/Context.sol      |    1 +
 .../contracts/access/Ownable.sol => /dev/null      |   71 -
 .../L1/fraud-proof/AssertionMap.sol => /dev/null   |  153 ---
 .../L1/fraud-proof/IRollup.sol => /dev/null        |  254 ----
 .../L1/fraud-proof/Rollup.sol => /dev/null         |  642 ----------
 .../L1/fraud-proof/RollupLib.sol => /dev/null      |   39 -
 .../L1/fraud-proof/WhiteList.sol => /dev/null      |   96 --
 .../challenge/Challenge.sol => /dev/null           |  301 -----
 .../challenge/ChallengeLib.sol => /dev/null        |   63 -
 .../challenge/IChallenge.sol => /dev/null          |  121 --
 .../libraries/BytesLib.sol => /dev/null            |  494 -------
 .../libraries/DeserializationLib.sol => /dev/null  |   37 -
 .../fraud-proof/libraries/Errors.sol => /dev/null  |   40 -
 .../libraries/MerkleLib.sol => /dev/null           | 1354 --------------------
 .../libraries/RLPReader.sol => /dev/null           |  369 ------
 .../verifier/IVerifier.sol => /dev/null            |   28 -
 .../verifier/IVerifierEntry.sol => /dev/null       |   30 -
 .../verifier/libraries/BloomLib.sol => /dev/null   |   72 --
 .../libraries/EVMTypesLib.sol => /dev/null         |  141 --
 .../verifier/libraries/MemoryLib.sol => /dev/null  |  311 -----
 .../libraries/OneStepProof.sol => /dev/null        |  598 ---------
 .../libraries/VerificationContext.sol => /dev/null |  122 --
 .../libraries/codec/Lib_BVMCodec.sol => /dev/null  |  145 ---
 .../resolver/Lib_AddressManager.sol => /dev/null   |   61 -
 .../resolver/Lib_AddressResolver.sol => /dev/null  |   40 -
 .../libraries/rlp/Lib_RLPReader.sol => /dev/null   |  388 ------
 .../utils/Lib_Bytes32Utils.sol => /dev/null        |   47 -
 .../Rollup/implementation/meta.txt => /dev/null    |    2 -
 .../proxy/ERC1967/ERC1967Proxy.sol => /dev/null    |   32 -
 .../proxy/ERC1967/ERC1967Upgrade.sol => /dev/null  |  193 ---
 .../contracts/proxy/Proxy.sol => /dev/null         |   85 --
 .../proxy/beacon/IBeacon.sol => /dev/null          |   15 -
 .../contracts/utils/StorageSlot.sol => /dev/null   |   83 --
 .../TransparentUpgradeableProxy.sol => /dev/null   |  124 --
 .../Rollup/proxy/meta.txt => /dev/null             |    2 -
 .../contracts/L1/ResourceMetering.sol              |  188 +++
 .../implementation/contracts/L1/SystemConfig.sol   |  319 +++++
 .../contracts/libraries/Arithmetic.sol             |   48 +
 .../implementation/contracts/libraries/Burn.sol    |   42 +
 .../implementation/contracts/universal/Semver.sol  |   58 +
 .../.code/SystemConfig/implementation/meta.txt     |    2 +
 .../contracts/proxy/utils/Initializable.sol        |  138 ++
 .../@openzeppelin/contracts/utils/Address.sol      |  222 ++++
 .../@openzeppelin/contracts/utils/Strings.sol      |   75 ++
 .../@openzeppelin/contracts/utils/math/Math.sol    |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../access/OwnableUpgradeable.sol}                 |   44 +-
 .../proxy/utils/Initializable.sol                  |    0
 .../utils/AddressUpgradeable.sol                   |    0
 .../utils/ContextUpgradeable.sol                   |   37 +
 .../solmate/src/utils/FixedPointMathLib.sol        |  366 ++++++
 .../proxy/contracts/universal/Proxy.sol            |  217 ++++
 .../ethereum/.code/SystemConfig/proxy/meta.txt     |    2 +
 .../libraries/BytesLib.sol => /dev/null            |  494 -------
 .../libraries/DeserializationLib.sol => /dev/null  |   37 -
 .../libraries/MerkleLib.sol => /dev/null           | 1354 --------------------
 .../libraries/RLPReader.sol => /dev/null           |  369 ------
 .../verifier/IVerifier.sol => /dev/null            |   28 -
 .../verifier/IVerifierEntry.sol => /dev/null       |   30 -
 .../verifier/VerifierEntry.sol => /dev/null        |  106 --
 .../verifier/libraries/BloomLib.sol => /dev/null   |   72 --
 .../libraries/EVMTypesLib.sol => /dev/null         |  141 --
 .../verifier/libraries/MemoryLib.sol => /dev/null  |  311 -----
 .../libraries/OneStepProof.sol => /dev/null        |  598 ---------
 .../verifier/libraries/Params.sol => /dev/null     |   78 --
 .../libraries/VerificationContext.sol => /dev/null |  122 --
 .../implementation/meta.txt => /dev/null           |    2 -
 .../proxy/ERC1967/ERC1967Proxy.sol => /dev/null    |   32 -
 .../proxy/ERC1967/ERC1967Upgrade.sol => /dev/null  |  193 ---
 .../contracts/proxy/Proxy.sol => /dev/null         |   85 --
 .../proxy/beacon/IBeacon.sol => /dev/null          |   15 -
 .../contracts/utils/StorageSlot.sol => /dev/null   |   83 --
 .../TransparentUpgradeableProxy.sol => /dev/null   |  124 --
 .../VerifierEntry/proxy/meta.txt => /dev/null      |    2 -
 295 files changed, 20015 insertions(+), 17512 deletions(-)
```

Generated with discovered.json: 0x1b3cadc80c62eb2f9d718b15120e4a03fa6ec7dd

# Diff at Tue, 31 Oct 2023 10:41:08 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9fa31f2a6274083dfe7f01b69d1220921459db02

## Description

Change in Owner2Multisig owner.

## Watched changes

```diff
    contract Owner2Multisig (0x2F44BD2a54aC3fB20cd7783cF94334069641daC9) {
      values.getOwners.2:
-        "0x895562F29cd2d6B46Da776B3a7778f77E99DbDEE"
+        "0x5a021DC06A9630bb56099b8aEdfaDC2dEa7eB317"
      values.getOwners.1:
-        "0x5a021DC06A9630bb56099b8aEdfaDC2dEa7eB317"
+        "0x207E804758e28F2b3fD6E4219671B327100b82f8"
      values.getOwners.0:
-        "0x207E804758e28F2b3fD6E4219671B327100b82f8"
+        "0xC37642355c18ec9c3b3268AAC67e33516aa115eb"
    }
```
