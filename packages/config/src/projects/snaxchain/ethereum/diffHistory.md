Generated with discovered.json: 0xff2d8bce5163ddf7ff157659b474ad7235f2383e

# Diff at Mon, 16 Jun 2025 08:43:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22615678
- current block number: 22615678

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615678 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x2A4fC0E3B365052d71B9853Efd0123985559f62E) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"ethereum:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A","role":"admin","via":[{"address":"ethereum:0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}
      receivedPermissions.10.from:
-        "ethereum:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
+        "ethereum:0x936D881b4760D5e9b6D55b774f65c509236b4743"
      receivedPermissions.9.from:
-        "ethereum:0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "ethereum:0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
    }
```

```diff
    contract ProxyAdmin (0x672B75103c0CbFdCC4A40737a80724f87a8A25D7) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"ethereum:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A","role":"admin"}
      directlyReceivedPermissions.7.from:
-        "ethereum:0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
+        "ethereum:0x936D881b4760D5e9b6D55b774f65c509236b4743"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "ethereum:0x2A4fC0E3B365052d71B9853Efd0123985559f62E"
    }
```

Generated with discovered.json: 0x69d886305a2782b5e0bd2fc61ae25c80073ed7da

# Diff at Mon, 02 Jun 2025 08:02:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22437745
- current block number: 22615678

## Description

conduit ms signer change.

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.10:
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.9:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.8:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.7:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x81175155D85377C337d92f1FA52Da166C3A4E7Ac"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x7ea30784ab55fa8cc05c205534e5074274157887

# Diff at Fri, 30 May 2025 07:15:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22437745
- current block number: 22437745

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437745 (main branch discovery), not current.

```diff
    contract SystemConfig (0x9c9B78f798F821C2f6398f603825fd175e2427f9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x2ce701030df3a7d2ec47f8c47e03a56761537dd4

# Diff at Thu, 29 May 2025 07:50:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9764537dfab122079ee09c9ec95835b322e2dd25 block: 22437745
- current block number: 22437745

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437745 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

Generated with discovered.json: 0xa20465b264c99ba5dc94ea350c956799c4d92128

# Diff at Fri, 23 May 2025 09:41:04 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22437745
- current block number: 22437745

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437745 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

```diff
    EOA  (0x060b915cA4904b56adA63565626b9c97F6CaD212) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        ".guardian"
    }
```

```diff
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C) {
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.2.role:
+        ".guardian"
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".deputy"
    }
```

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0x9c9B78f798F821C2f6398f603825fd175e2427f9","role":"admin","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}
      receivedPermissions.9.from:
-        "0x9c9B78f798F821C2f6398f603825fd175e2427f9"
+        "0x936D881b4760D5e9b6D55b774f65c509236b4743"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.from:
-        "0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "0x45561F85e43Ac0d2258c0F0C16540ce128EA1634"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0x45561F85e43Ac0d2258c0F0C16540ce128EA1634"
+        "0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.from:
-        "0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
+        "0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
+        "0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
      receivedPermissions.5.description:
-        "set and change address mappings."
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.permission:
-        "interact"
+        "challenge"
      receivedPermissions.4.from:
-        "0x9c9B78f798F821C2f6398f603825fd175e2427f9"
+        "0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
      receivedPermissions.4.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.4.role:
+        ".CHALLENGER"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
+        "0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
      receivedPermissions.3.description:
+        "set and change address mappings."
      receivedPermissions.3.role:
+        ".owner"
      receivedPermissions.2.permission:
-        "upgrade"
+        "challenge"
      receivedPermissions.2.from:
-        "0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
+        "0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
      receivedPermissions.2.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.2.via:
-        [{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]
      receivedPermissions.2.role:
+        ".challenger"
      receivedPermissions.1.permission:
-        "challenge"
+        "upgrade"
      receivedPermissions.1.from:
-        "0xF8f3EbF2469C00A00EA9D1D04913B73896268B25"
+        "0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
      receivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.1.role:
+        ".$admin"
      receivedPermissions.1.via:
+        [{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "0x9c9B78f798F821C2f6398f603825fd175e2427f9"
      receivedPermissions.0.via:
-        [{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.1.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.1.description:
-        "set and change address mappings."
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.0.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.1.from:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.1.description:
-        "set and change address mappings."
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.0.description:
+        "set and change address mappings."
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ProxyAdmin (0x672B75103c0CbFdCC4A40737a80724f87a8A25D7) {
    +++ description: None
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.3.from:
-        "0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
+        "0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
      directlyReceivedPermissions.3.description:
-        "set and change address mappings."
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.from:
-        "0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A"
+        "0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.1.from:
-        "0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
+        "0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411"
      directlyReceivedPermissions.1.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "set and change address mappings."
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.from:
-        "0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6"
+        "0xA5fb68C24b02852e8B514E98A1014faf12547Fa5"
      directlyReceivedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.0.role:
+        ".$admin"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".fallbackOwner"
    }
```

```diff
    EOA  (0x85C73d8F7a3C95667779E0d9b8104982A5C1d04e) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0xF8f3EbF2469C00A00EA9D1D04913B73896268B25","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.2.role:
+        ".guardian"
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.role:
+        ".guardian"
      directlyReceivedPermissions.0.role:
+        ".deputyGuardian"
    }
```

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.0.role:
+        ".guardian"
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

Generated with discovered.json: 0xe45d8d8df14c8cab7c9fc95c501b36b9d4ec5daa

# Diff at Fri, 09 May 2025 10:09:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437745
- current block number: 22437745

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437745 (main branch discovery), not current.

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.2.via.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
      receivedPermissions.1.via.3.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      receivedPermissions.1.via.1.address:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.1.via.1.condition:
-        "restricted to the global pause function"
      receivedPermissions.1.via.0.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.1.via.0.condition:
+        "though restricted to the global pause function"
      receivedPermissions.0.via.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
      directlyReceivedPermissions.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.0.via.0.condition:
-        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
      directlyReceivedPermissions.0.condition:
-        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.1.via.1.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      directlyReceivedPermissions.0.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
    }
```

Generated with discovered.json: 0x664f8bef44955e5b03438bab6cede72a51dfb70b

# Diff at Thu, 08 May 2025 08:50:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22194661
- current block number: 22437745

## Description

Superchain guardian connected, not full superchain gov.

OP stack DeputyPauser upgrade (see op mainnet for more info).

## Watched changes

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.getModules.0:
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.2:
+        {"permission":"guard","from":"0x936D881b4760D5e9b6D55b774f65c509236b4743"}
      receivedPermissions.1.from:
-        "0x936D881b4760D5e9b6D55b774f65c509236b4743"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.1.via:
+        [{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"not revoked by the Security Council"}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"not revoked by the Security Council"}]
    }
```

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

## Source code changes

```diff
...0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411.sol} |    0
 ...-0xdE1FCfB0851916CA5101820A69b13a4E276bd81F.sol |  152 +++
 .../ethereum/.flat/DeputyGuardianModule.sol        |  156 +++
 .../snaxchain/ethereum/.flat/DeputyPauseModule.sol | 1338 ++++++++++++++++++++
 .../snaxchain/ethereum/.flat/LivenessModule.sol    |  258 ++++
 .../.flat/OpFoundationUpgradeSafe/GnosisSafe.sol   |  953 ++++++++++++++
 .../OpFoundationUpgradeSafe/GnosisSafeProxy.p.sol  |   35 +
 .../Optimism Guardian Multisig/GnosisSafe.sol      |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../.flat/Optimism Security Council/GnosisSafe.sol |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../Proxy.p.sol                                    |    0
 .../SuperchainConfig.sol                           |    0
 .../Proxy.p.sol                                    |  200 +++
 .../SuperchainConfig.sol                           |  477 +++++++
 .../ethereum/.flat/SuperchainProxyAdmin.sol        |  298 +++++
 .../.flat/SuperchainProxyAdminOwner/GnosisSafe.sol |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 18 files changed, 6831 insertions(+)
```

Generated with discovered.json: 0xb79d743f0e910867e6fd78e24d6a0276a8d3a896

# Diff at Tue, 29 Apr 2025 08:19:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22194661
- current block number: 22194661

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194661 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x45561F85e43Ac0d2258c0F0C16540ce128EA1634) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract SuperchainConfig (0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract OptimismPortal (0x936D881b4760D5e9b6D55b774f65c509236b4743) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract SystemConfig (0x9c9B78f798F821C2f6398f603825fd175e2427f9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x060b915cA4904b56adA63565626b9c97F6CaD212","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract L1StandardBridge (0xA5fb68C24b02852e8B514E98A1014faf12547Fa5) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract AddressManager (0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"set and change address mappings.","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract L2OutputOracle (0xF8f3EbF2469C00A00EA9D1D04913B73896268B25) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"propose","to":"0x85C73d8F7a3C95667779E0d9b8104982A5C1d04e","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

Generated with discovered.json: 0x74944c7050bcaf771fc0dda9b21bfd9a82bf82b1

# Diff at Fri, 04 Apr 2025 09:41:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22194661

## Description

Initial discovery of a standard OP stack rollup without proof system.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2A4fC0E3B365052d71B9853Efd0123985559f62E)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x45561F85e43Ac0d2258c0F0C16540ce128EA1634)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x672B75103c0CbFdCC4A40737a80724f87a8A25D7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x936D881b4760D5e9b6D55b774f65c509236b4743)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x9c9B78f798F821C2f6398f603825fd175e2427f9)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xA5fb68C24b02852e8B514E98A1014faf12547Fa5)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AddressManager (0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xF8f3EbF2469C00A00EA9D1D04913B73896268B25)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```
