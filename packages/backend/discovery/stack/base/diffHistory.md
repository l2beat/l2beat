Generated with discovered.json: 0x96c911030b597d8f0dabd979da13cda0dcc70307

# Diff at Sat, 02 Nov 2024 07:50:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@93f317513d51e26ce3003e34f6a9147b7f41eb7a block: 21526119
- current block number: 21872215

## Description

ConduitMultisig3 added member and kept threshold, now 3/6.

## Watched changes

```diff
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      values.$members.5:
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.4:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.0:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0x64203a489316357f5818264b29e8be7581c370d6

# Diff at Fri, 01 Nov 2024 12:11:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21526119
- current block number: 21526119

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21526119 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x25aBB510386A658c622280f488844BD3b485DC32) {
    +++ description: None
      directlyReceivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      receivedPermissions.6.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0xbA256039AEdaD407692D8Deb366308BE6Bb2515C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x8283e3349fd291d4e679072fa6edb2668b9212a9

# Diff at Tue, 29 Oct 2024 13:23:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21526119
- current block number: 21526119

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21526119 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xCC61c26901E719B73273C1484e337cBAB84369EF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0xdbe6d374de0ddd30e17c9c2b7963290858d7acec

# Diff at Fri, 25 Oct 2024 07:33:17 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ae2c410e7fd6561c1946613ca693d2dc0322c23d block: 20763805
- current block number: 21526119

## Description

Renamed upgrader to ConduitMultisig3.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20763805 (main branch discovery), not current.

```diff
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      name:
-        "StackMultisig"
+        "ConduitMultisig3"
    }
```

Generated with discovered.json: 0x86baefa1fdf40dc6fcf47933d92829878b4fd42a

# Diff at Mon, 21 Oct 2024 12:52:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20763805
- current block number: 20763805

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20763805 (main branch discovery), not current.

```diff
    contract AddressManager (0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract SystemConfig (0x52c901666Cfc8AeE9b46A3b7C101688351529B37) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1CrossDomainMessenger (0x727a91e8251A262A4ad5F2D5811c6cD862961759) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract OptimismPortal (0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1StandardBridge (0xbA256039AEdaD407692D8Deb366308BE6Bb2515C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract L2OutputOracle (0xCC61c26901E719B73273C1484e337cBAB84369EF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

Generated with discovered.json: 0xa9b90b3b1b6cbf4a58ab8a21feca30fb03d5d0bf

# Diff at Mon, 21 Oct 2024 11:14:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20763805
- current block number: 20763805

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20763805 (main branch discovery), not current.

```diff
    contract SystemConfig (0x52c901666Cfc8AeE9b46A3b7C101688351529B37) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x34E6305Fe21a0Ed945177dcD36D7E6084F9f1BcC"]
      values.$pastUpgrades.0.1:
-        ["0x34E6305Fe21a0Ed945177dcD36D7E6084F9f1BcC"]
+        "0x4566594bfb88df599197022433abb97bca60e2440a8440befa2d6d4eeb5bf167"
    }
```

```diff
    contract L1CrossDomainMessenger (0x727a91e8251A262A4ad5F2D5811c6cD862961759) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.1.2:
+        ["0xb079375dDB17FaBae0F3Ed6B9950f6cD626cE2a3"]
      values.$pastUpgrades.1.1:
-        ["0xb079375dDB17FaBae0F3Ed6B9950f6cD626cE2a3"]
+        "0x96c9ee37516c6364471bcb425d12ab64dd1738936c45159e147828304afed9ff"
      values.$pastUpgrades.0.2:
+        ["0x727a91e8251A262A4ad5F2D5811c6cD862961759"]
      values.$pastUpgrades.0.1:
-        ["0x727a91e8251A262A4ad5F2D5811c6cD862961759"]
+        "0xc046607991072863d54134a45616c828b4e3773c03db24ac175061b7c8686971"
    }
```

```diff
    contract OptimismPortal (0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x1D9e8EcF1b3D0e773c2dE9f9B864d38322e5adb9"]
      values.$pastUpgrades.0.1:
-        ["0x1D9e8EcF1b3D0e773c2dE9f9B864d38322e5adb9"]
+        "0x356a647542cea792b4465f9e252049a0a338b054224787839dab296a67ef4589"
    }
```

```diff
    contract L2OutputOracle (0xCC61c26901E719B73273C1484e337cBAB84369EF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0xA39D53FCa52Efe9a034D1EC61E30151621F9b945"]
      values.$pastUpgrades.0.1:
-        ["0xA39D53FCa52Efe9a034D1EC61E30151621F9b945"]
+        "0x38550f715e17517e66a485cef19071067b33a9907fad334e14e4f9b74ddf7fde"
    }
```

Generated with discovered.json: 0x20e3dfd1febf333ed6a2b3956888914202dcf287

# Diff at Wed, 16 Oct 2024 11:45:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20763805
- current block number: 20763805

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20763805 (main branch discovery), not current.

```diff
    contract SystemConfig (0x52c901666Cfc8AeE9b46A3b7C101688351529B37) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","via":[{"address":"0x25aBB510386A658c622280f488844BD3b485DC32","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
+        "0xeC4Db0b5a1d70167034Da00e3D7Bc5B2CA05Fc77"
      issuedPermissions.1.via.0:
-        {"address":"0x25aBB510386A658c622280f488844BD3b485DC32","delay":0}
    }
```

```diff
    contract OptimismPortal (0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","via":[{"address":"0x25aBB510386A658c622280f488844BD3b485DC32","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.0:
-        {"address":"0x25aBB510386A658c622280f488844BD3b485DC32","delay":0}
    }
```

```diff
    contract StackMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xCC61c26901E719B73273C1484e337cBAB84369EF","via":[{"address":"0x25aBB510386A658c622280f488844BD3b485DC32"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xbA256039AEdaD407692D8Deb366308BE6Bb2515C","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x25aBB510386A658c622280f488844BD3b485DC32"}]}
      receivedPermissions.5.target:
-        "0xCC61c26901E719B73273C1484e337cBAB84369EF"
+        "0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E"
      receivedPermissions.4.target:
-        "0xbA256039AEdaD407692D8Deb366308BE6Bb2515C"
+        "0x52c901666Cfc8AeE9b46A3b7C101688351529B37"
      receivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.3.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.3.via:
-        [{"address":"0x25aBB510386A658c622280f488844BD3b485DC32"}]
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.via:
-        [{"address":"0x25aBB510386A658c622280f488844BD3b485DC32"}]
      receivedPermissions.2.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.target:
-        "0x52c901666Cfc8AeE9b46A3b7C101688351529B37"
+        "0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
+        "set and change address mappings."
      receivedPermissions.1.via:
+        [{"address":"0x25aBB510386A658c622280f488844BD3b485DC32"}]
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668"
+        "0xCC61c26901E719B73273C1484e337cBAB84369EF"
      receivedPermissions.0.description:
-        "set and change address mappings."
      receivedPermissions.0.via:
-        [{"address":"0x25aBB510386A658c622280f488844BD3b485DC32"}]
    }
```

```diff
    contract L2OutputOracle (0xCC61c26901E719B73273C1484e337cBAB84369EF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","via":[{"address":"0x25aBB510386A658c622280f488844BD3b485DC32","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x28750b59d304e6ce7d3866eF9a0DbFBCfaE56A6E","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.via.0:
-        {"address":"0x25aBB510386A658c622280f488844BD3b485DC32","delay":0}
    }
```

Generated with discovered.json: 0x7b05601a377487508bd2e7188f63e8bcf4123fd5

# Diff at Mon, 14 Oct 2024 10:59:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20763805
- current block number: 20763805

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20763805 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x25aBB510386A658c622280f488844BD3b485DC32) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract AddressManager (0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract SystemConfig (0x52c901666Cfc8AeE9b46A3b7C101688351529B37) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x5afa3e86b6524528383af0276ca7f40885c1eb2ae2e9932f65dabc6b58a99643"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x727a91e8251A262A4ad5F2D5811c6cD862961759) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x6d9fd2364c536d73c3e3064034991a037e4e43313e72fb130782bf63ca586437"]
    }
```

```diff
    contract OptimismPortal (0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"]
    }
```

```diff
    contract StackMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract L1StandardBridge (0xbA256039AEdaD407692D8Deb366308BE6Bb2515C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x9acaa683f4e228c0e24b38c1b79cf896a311a7b85c6f036e915d0fb8593a3ca5"]
    }
```

```diff
    contract L2OutputOracle (0xCC61c26901E719B73273C1484e337cBAB84369EF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x66cdacb7ee63d044769108a364e635bea065ba30dc12d4e5ec83f8b90c228d3a"]
    }
```

Generated with discovered.json: 0x6444adfa8ab8cebaefc1bfd139eb7aa007363ea9

# Diff at Wed, 09 Oct 2024 13:11:14 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20763805
- current block number: 20763805

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20763805 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x25aBB510386A658c622280f488844BD3b485DC32) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract StackMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x7bfe86d38551a675cb584d7730ff722e714e9da9

# Diff at Mon, 07 Oct 2024 16:03:05 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7c3e632caf56b943789c1bfa1021d4f65d503045 block: 19927649
- current block number: 20763805

## Description

Config related (discoveryDrivenData).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927649 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x25aBB510386A658c622280f488844BD3b485DC32) {
    +++ description: None
      directlyReceivedPermissions.3.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract SystemConfig (0x52c901666Cfc8AeE9b46A3b7C101688351529B37) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","via":[{"address":"0x25aBB510386A658c622280f488844BD3b485DC32","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x25aBB510386A658c622280f488844BD3b485DC32","delay":0}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract L1CrossDomainMessenger (0x727a91e8251A262A4ad5F2D5811c6cD862961759) {
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
    contract StackMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      roles.1:
+        "Guardian"
      roles.0:
-        "Guardian"
+        "Challenger"
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xCC61c26901E719B73273C1484e337cBAB84369EF","via":[{"address":"0x25aBB510386A658c622280f488844BD3b485DC32"}]}
      receivedPermissions.4.target:
-        "0xCC61c26901E719B73273C1484e337cBAB84369EF"
+        "0xbA256039AEdaD407692D8Deb366308BE6Bb2515C"
      receivedPermissions.4.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.3.target:
-        "0xbA256039AEdaD407692D8Deb366308BE6Bb2515C"
+        "0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E"
      receivedPermissions.2.target:
-        "0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E"
+        "0x52c901666Cfc8AeE9b46A3b7C101688351529B37"
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.via:
-        [{"address":"0x25aBB510386A658c622280f488844BD3b485DC32"}]
      receivedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L1StandardBridge (0xbA256039AEdaD407692D8Deb366308BE6Bb2515C) {
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
    contract L2OutputOracle (0xCC61c26901E719B73273C1484e337cBAB84369EF) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

Generated with discovered.json: 0x37587e71382dd1e5ca9d841ff7eb94c50ff3fcb6

# Diff at Tue, 01 Oct 2024 11:13:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19927649
- current block number: 19927649

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927649 (main branch discovery), not current.

```diff
    contract SystemConfig (0x52c901666Cfc8AeE9b46A3b7C101688351529B37) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-05T23:11:37.000Z",["0x34E6305Fe21a0Ed945177dcD36D7E6084F9f1BcC"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x727a91e8251A262A4ad5F2D5811c6cD862961759) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-05T23:10:15.000Z",["0x727a91e8251A262A4ad5F2D5811c6cD862961759"]],["2024-03-05T23:12:19.000Z",["0xb079375dDB17FaBae0F3Ed6B9950f6cD626cE2a3"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract OptimismPortal (0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-03-05T23:12:45.000Z",["0x1D9e8EcF1b3D0e773c2dE9f9B864d38322e5adb9"]]]
    }
```

```diff
    contract L1StandardBridge (0xbA256039AEdaD407692D8Deb366308BE6Bb2515C) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L2OutputOracle (0xCC61c26901E719B73273C1484e337cBAB84369EF) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-05T23:12:33.000Z",["0xA39D53FCa52Efe9a034D1EC61E30151621F9b945"]]]
    }
```

Generated with discovered.json: 0x7b2e62e4308a06a63048c582ee71da2354b9aeec

# Diff at Wed, 18 Sep 2024 07:30:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6e2d68b26301ad9eaaf8acc0e8b480482b8cc712 block: 15661242
- current block number: 19927649

## Description

Shape related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15661242 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract StackMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      roles:
+        ["Guardian"]
    }
```

Generated with discovered.json: 0x901e7495e893d7530117a915b119450806557380

# Diff at Sun, 08 Sep 2024 17:20:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 15661242
- current block number: 15661242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15661242 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x25aBB510386A658c622280f488844BD3b485DC32) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668"},{"permission":"upgrade","target":"0x52c901666Cfc8AeE9b46A3b7C101688351529B37"},{"permission":"upgrade","target":"0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E"},{"permission":"upgrade","target":"0xbA256039AEdaD407692D8Deb366308BE6Bb2515C"},{"permission":"upgrade","target":"0xCC61c26901E719B73273C1484e337cBAB84369EF"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668"},{"permission":"upgrade","target":"0x52c901666Cfc8AeE9b46A3b7C101688351529B37"},{"permission":"upgrade","target":"0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E"},{"permission":"upgrade","target":"0xbA256039AEdaD407692D8Deb366308BE6Bb2515C"},{"permission":"upgrade","target":"0xCC61c26901E719B73273C1484e337cBAB84369EF"}]
    }
```

```diff
    contract AddressManager (0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x25aBB510386A658c622280f488844BD3b485DC32"
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.0:
+        {"address":"0x25aBB510386A658c622280f488844BD3b485DC32","delay":0}
    }
```

```diff
    contract SystemConfig (0x52c901666Cfc8AeE9b46A3b7C101688351529B37) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x25aBB510386A658c622280f488844BD3b485DC32"
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.0:
+        {"address":"0x25aBB510386A658c622280f488844BD3b485DC32","delay":0}
    }
```

```diff
    contract OptimismPortal (0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x25aBB510386A658c622280f488844BD3b485DC32"
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.0:
+        {"address":"0x25aBB510386A658c622280f488844BD3b485DC32","delay":0}
    }
```

```diff
    contract StackMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x25aBB510386A658c622280f488844BD3b485DC32, inheriting its permissions."]
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xCC61c26901E719B73273C1484e337cBAB84369EF","via":[{"address":"0x25aBB510386A658c622280f488844BD3b485DC32"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0xbA256039AEdaD407692D8Deb366308BE6Bb2515C","via":[{"address":"0x25aBB510386A658c622280f488844BD3b485DC32"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E","via":[{"address":"0x25aBB510386A658c622280f488844BD3b485DC32"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x52c901666Cfc8AeE9b46A3b7C101688351529B37","via":[{"address":"0x25aBB510386A658c622280f488844BD3b485DC32"}]}
      receivedPermissions.0.target:
-        "0x25aBB510386A658c622280f488844BD3b485DC32"
+        "0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668"
      receivedPermissions.0.via:
+        [{"address":"0x25aBB510386A658c622280f488844BD3b485DC32"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x25aBB510386A658c622280f488844BD3b485DC32"}]
    }
```

```diff
    contract L1StandardBridge (0xbA256039AEdaD407692D8Deb366308BE6Bb2515C) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x25aBB510386A658c622280f488844BD3b485DC32"
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.0:
+        {"address":"0x25aBB510386A658c622280f488844BD3b485DC32","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xCC61c26901E719B73273C1484e337cBAB84369EF) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x25aBB510386A658c622280f488844BD3b485DC32"
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.0:
+        {"address":"0x25aBB510386A658c622280f488844BD3b485DC32","delay":0}
    }
```

Generated with discovered.json: 0xd7a79cbecce20001566e438856473596f747cc95

# Diff at Fri, 30 Aug 2024 08:17:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 15661242
- current block number: 15661242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15661242 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x25aBB510386A658c622280f488844BD3b485DC32) {
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
    contract StackMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: It can act on behalf of 0x25aBB510386A658c622280f488844BD3b485DC32, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x8bbe4fe3f43fc4235577f3fe243ae729e5d91d88

# Diff at Fri, 23 Aug 2024 09:57:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 15661242
- current block number: 15661242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15661242 (main branch discovery), not current.

```diff
    contract SystemConfig (0x52c901666Cfc8AeE9b46A3b7C101688351529B37) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0xbA256039AEdaD407692D8Deb366308BE6Bb2515C) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L2OutputOracle (0xCC61c26901E719B73273C1484e337cBAB84369EF) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xcff758436dc5b5c007a522685e14cd7640226511

# Diff at Wed, 21 Aug 2024 10:08:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 15661242
- current block number: 15661242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15661242 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x25aBB510386A658c622280f488844BD3b485DC32) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x52c901666Cfc8AeE9b46A3b7C101688351529B37","0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E","0xCC61c26901E719B73273C1484e337cBAB84369EF","0xbA256039AEdaD407692D8Deb366308BE6Bb2515C"],"configure":["0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668","via":[]},{"permission":"upgrade","target":"0x52c901666Cfc8AeE9b46A3b7C101688351529B37","via":[]},{"permission":"upgrade","target":"0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E","via":[]},{"permission":"upgrade","target":"0xbA256039AEdaD407692D8Deb366308BE6Bb2515C","via":[]},{"permission":"upgrade","target":"0xCC61c26901E719B73273C1484e337cBAB84369EF","via":[]}]
    }
```

```diff
    contract AddressManager (0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x25aBB510386A658c622280f488844BD3b485DC32","via":[]}]
    }
```

```diff
    contract SystemConfig (0x52c901666Cfc8AeE9b46A3b7C101688351529B37) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x25aBB510386A658c622280f488844BD3b485DC32","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x25aBB510386A658c622280f488844BD3b485DC32","via":[]}]
    }
```

```diff
    contract StackMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: It can act on behalf of 0x25aBB510386A658c622280f488844BD3b485DC32, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x25aBB510386A658c622280f488844BD3b485DC32"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x25aBB510386A658c622280f488844BD3b485DC32","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xbA256039AEdaD407692D8Deb366308BE6Bb2515C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x25aBB510386A658c622280f488844BD3b485DC32","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xCC61c26901E719B73273C1484e337cBAB84369EF) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x25aBB510386A658c622280f488844BD3b485DC32","via":[]}]
    }
```

Generated with discovered.json: 0x6710ac5371dd31aa8f50608cf458e3a3adf96a0c

# Diff at Fri, 09 Aug 2024 12:04:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 15661242
- current block number: 15661242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15661242 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x25aBB510386A658c622280f488844BD3b485DC32) {
    +++ description: None
      assignedPermissions.upgrade.3:
-        "0x52c901666Cfc8AeE9b46A3b7C101688351529B37"
+        "0xbA256039AEdaD407692D8Deb366308BE6Bb2515C"
      assignedPermissions.upgrade.0:
-        "0xbA256039AEdaD407692D8Deb366308BE6Bb2515C"
+        "0x52c901666Cfc8AeE9b46A3b7C101688351529B37"
    }
```

Generated with discovered.json: 0xdb8ac947564f70b1ef58373ba56b00ee46657737

# Diff at Fri, 09 Aug 2024 10:14:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 15661242
- current block number: 15661242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15661242 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x25aBB510386A658c622280f488844BD3b485DC32) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x52c901666Cfc8AeE9b46A3b7C101688351529B37","0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E","0xCC61c26901E719B73273C1484e337cBAB84369EF","0xbA256039AEdaD407692D8Deb366308BE6Bb2515C"]
      assignedPermissions.owner:
-        ["0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668"]
      assignedPermissions.upgrade:
+        ["0xbA256039AEdaD407692D8Deb366308BE6Bb2515C","0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E","0xCC61c26901E719B73273C1484e337cBAB84369EF","0x52c901666Cfc8AeE9b46A3b7C101688351529B37"]
      assignedPermissions.configure:
+        ["0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668"]
    }
```

```diff
    contract StackMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: It can act on behalf of 0x25aBB510386A658c622280f488844BD3b485DC32, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x25aBB510386A658c622280f488844BD3b485DC32"]
      assignedPermissions.configure:
+        ["0x25aBB510386A658c622280f488844BD3b485DC32"]
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xb955e8fb34fbf6d31fb982960afcb1f6897603f9

# Diff at Thu, 18 Jul 2024 10:35:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 15661242
- current block number: 15661242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15661242 (main branch discovery), not current.

```diff
    contract StackMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x25aBB510386A658c622280f488844BD3b485DC32, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x992cf31c5a0e43c61f9e58b150539897a2eeb6e1

# Diff at Tue, 11 Jun 2024 13:17:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 12893975
- current block number: 15661242

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 12893975 (main branch discovery), not current.

```diff
    contract SystemConfig (0x52c901666Cfc8AeE9b46A3b7C101688351529B37) {
    +++ description: None
      values.resourceConfig:
-        [20000000,10,8,1000000000,1000000,"340282366920938463463374607431768211455"]
+        {"maxResourceLimit":20000000,"elasticityMultiplier":10,"baseFeeMaxChangeDenominator":8,"minimumBaseFee":1000000000,"systemTxMaxGas":1000000,"maximumBaseFee":"340282366920938463463374607431768211455"}
    }
```

Generated with discovered.json: 0x25698f6aa8b455f39fab9dd5b810ec5ebe52c1ec

# Diff at Fri, 05 Apr 2024 09:13:03 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 12759508

## Description

Standard OP Stack with no significant diff.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x25aBB510386A658c622280f488844BD3b485DC32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x31f09c4a4151EeBB1c0Ac10003bF3b06f4Aa5668)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x52c901666Cfc8AeE9b46A3b7C101688351529B37)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x727a91e8251A262A4ad5F2D5811c6cD862961759)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x752BE2A1c6DBe40884D7851CDC58c9cA54DCBD3E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StackMultisig (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xbA256039AEdaD407692D8Deb366308BE6Bb2515C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xCC61c26901E719B73273C1484e337cBAB84369EF)
    +++ description: None
```
