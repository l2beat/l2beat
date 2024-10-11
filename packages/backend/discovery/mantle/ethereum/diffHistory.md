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
