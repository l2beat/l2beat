Generated with discovered.json: 0x6fe45335ec9099f9b7a96af3f3c1834a45e303b8

# Diff at Tue, 17 Sep 2024 09:16:23 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@a17234c1dfeb209a9842df2b454c07e2b8da435d block: 20763108
- current block number: 20769371

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20763108 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x034cbb620d1e0e4C2E29845229bEAc57083b04eC) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.isOutputFinalized:
-        [true,true,true,true,true]
      errors:
-        {"isOutputFinalized":"Too many values. Update configuration to explore fully"}
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract L1CrossDomainMessenger (0x36725a5e0040deB7C697d46C0e24390702b202e0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      errors:
-        {"xDomainMessageSender":"Execution reverted"}
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x3Be64BF2b9C2dE637067C7AAb6baE5EDf9fEBA55) {
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
    contract ProxyAdmin (0x3c68b1d45f4faa4F028c3DC8910fA3247c7f0a1f) {
    +++ description: None
      directlyReceivedPermissions.2.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xe512D477Cc89196AF2cE837f6AB8EA30e199f757","via":[{"address":"0x3c68b1d45f4faa4F028c3DC8910fA3247c7f0a1f"}]}
      receivedPermissions.6.target:
-        "0xe512D477Cc89196AF2cE837f6AB8EA30e199f757"
+        "0xD5890BBAFaFdce942597757385E55174569e8d1A"
      receivedPermissions.5.target:
-        "0xD5890BBAFaFdce942597757385E55174569e8d1A"
+        "0x994233366C8E11da5c525AB903c04e7AFB2915bD"
      receivedPermissions.4.target:
-        "0x994233366C8E11da5c525AB903c04e7AFB2915bD"
+        "0x58b51fb9FeeD00DD846f91D265Eba3cdd855A413"
      receivedPermissions.3.target:
-        "0x58b51fb9FeeD00DD846f91D265Eba3cdd855A413"
+        "0x3Be64BF2b9C2dE637067C7AAb6baE5EDf9fEBA55"
      receivedPermissions.3.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.2.target:
-        "0x3Be64BF2b9C2dE637067C7AAb6baE5EDf9fEBA55"
+        "0x034cbb620d1e0e4C2E29845229bEAc57083b04eC"
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x034cbb620d1e0e4C2E29845229bEAc57083b04eC"
+        "0x58b51fb9FeeD00DD846f91D265Eba3cdd855A413"
      receivedPermissions.1.via:
-        [{"address":"0x3c68b1d45f4faa4F028c3DC8910fA3247c7f0a1f"}]
      receivedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      roles:
+        ["Challenger","Guardian"]
    }
```

```diff
    contract SystemConfig (0x58b51fb9FeeD00DD846f91D265Eba3cdd855A413) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x3c68b1d45f4faa4F028c3DC8910fA3247c7f0a1f","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x3c68b1d45f4faa4F028c3DC8910fA3247c7f0a1f","delay":0}
      values.batcherHash:
-        "0x00000000000000000000000067a44ce38627f46f20b1293960559ed85dd194f1"
+        "0x67a44CE38627F46F20b1293960559eD85Dd194F1"
      values.opStackDA:
+        {"isSomeTxsLengthEqualToCelestiaDAExample":false,"isSequencerSendingBlobTx":true}
      values.sequencerInbox:
+        "0x0bd57e83B5E0f9eCD84d559bB58e1EcFEEdD2565"
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x994233366C8E11da5c525AB903c04e7AFB2915bD) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract L1ERC721Bridge (0xD5890BBAFaFdce942597757385E55174569e8d1A) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract L2OutputOracle (0xe512D477Cc89196AF2cE837f6AB8EA30e199f757) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.computeL2Timestamp:
-        [1718038175,1718038177,1718038179,1718038181,1718038183]
      values.getL2Output:
-        [["0x9d276fdeed19e04a61bc15552d5823349217ddf84a721e0a284dc6ca864210ef",1718082995,21600],["0x6465a694427255c2b050c7e23e5dc5f2f7699b240fd528c00126aacdf05cba6a",1718126003,43200],["0x4a75d83bd6fa9fc7d44853068df4343da2e9bbb29a0070e59b953307cf3cbf7d",1718168831,64800],["0xbc63ab459a16db55318a7894bd6e9db653121850f752dcf2efabfd7e496fe1df",1718212223,86400],["0xd38b96f0e5f57276188034e83bdd2c0b39390e110da3715030be1dd473e44f01",1718255615,108000]]
      values.getL2OutputAfter:
-        [["0x9d276fdeed19e04a61bc15552d5823349217ddf84a721e0a284dc6ca864210ef",1718082995,21600],["0x9d276fdeed19e04a61bc15552d5823349217ddf84a721e0a284dc6ca864210ef",1718082995,21600],["0x9d276fdeed19e04a61bc15552d5823349217ddf84a721e0a284dc6ca864210ef",1718082995,21600],["0x9d276fdeed19e04a61bc15552d5823349217ddf84a721e0a284dc6ca864210ef",1718082995,21600],["0x9d276fdeed19e04a61bc15552d5823349217ddf84a721e0a284dc6ca864210ef",1718082995,21600]]
      values.getL2OutputIndexAfter:
-        [0,0,0,0,0]
      values.deletedOutputs:
+        []
      errors:
-        {"computeL2Timestamp":"Too many values. Update configuration to explore fully","getL2Output":"Too many values. Update configuration to explore fully","getL2OutputAfter":"Too many values. Update configuration to explore fully","getL2OutputIndexAfter":"Too many values. Update configuration to explore fully"}
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

Generated with discovered.json: 0x05e0773e2a68c8d9d3fbe9380c4598dd0064b335

# Diff at Mon, 16 Sep 2024 12:23:13 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20763108

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismPortal (0x034cbb620d1e0e4C2E29845229bEAc57083b04eC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x287bBa8116F2fc5a642bfD6027EBf5AD6522655C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x36725a5e0040deB7C697d46C0e24390702b202e0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x3Be64BF2b9C2dE637067C7AAb6baE5EDf9fEBA55)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x3c68b1d45f4faa4F028c3DC8910fA3247c7f0a1f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x58b51fb9FeeD00DD846f91D265Eba3cdd855A413)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x994233366C8E11da5c525AB903c04e7AFB2915bD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xD5890BBAFaFdce942597757385E55174569e8d1A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xe512D477Cc89196AF2cE837f6AB8EA30e199f757)
    +++ description: None
```
