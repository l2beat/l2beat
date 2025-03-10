Generated with discovered.json: 0x658b2df4853dee3fe7249bc00711864742231a05

# Diff at Tue, 04 Mar 2025 10:39:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21242106
- current block number: 21242106

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x081D1101855bD523bA69A9794e0217F0DB6323ff) {
    +++ description: None
      sinceBlock:
+        13627370
    }
```

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      sinceBlock:
+        19424659
    }
```

```diff
    contract ChainStorageContainer-SCC-batches (0x10739F09f6e62689c0aA8A1878816de9e166d6f9) {
    +++ description: None
      sinceBlock:
+        13626929
    }
```

```diff
    contract ChainStorageContainer-CTC-batches (0x38473Feb3A6366757A249dB2cA4fBB2C663416B7) {
    +++ description: None
      sinceBlock:
+        13625270
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: None
      sinceBlock:
+        13627429
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      sinceBlock:
+        13616534
    }
```

```diff
    contract CanonicalTransactionChain (0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9) {
    +++ description: None
      sinceBlock:
+        13626959
    }
```

```diff
    contract BondManager (0x595801b85628ec6979C420988b8843A40F850528) {
    +++ description: None
      sinceBlock:
+        19717907
    }
```

```diff
    contract  (0x5fF5316CD1C015970eEC83D34a69E504B577a5bb) {
    +++ description: None
      sinceBlock:
+        13627861
    }
```

```diff
    contract RewardEscrowerMultisig (0x62478E4eeb4070fE399866aB05e821AB97200947) {
    +++ description: None
      sinceBlock:
+        19697815
    }
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: None
      sinceBlock:
+        14561258
    }
```

```diff
    contract MVM_DiscountOracle (0x7f6B0b7589febc40419a8646EFf9801b87397063) {
    +++ description: None
      sinceBlock:
+        14577582
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      sinceBlock:
+        19424653
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        13625248
    }
```

```diff
    contract MToken (0x9E32b13ce7f2E80A01932B42553652E053D6ed8e) {
    +++ description: None
      sinceBlock:
+        11434969
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      sinceBlock:
+        19438866
    }
```

```diff
    contract ChainStorageContainer-CTC-queue (0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57) {
    +++ description: None
      sinceBlock:
+        13625297
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      sinceBlock:
+        19424665
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: None
      sinceBlock:
+        14567320
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: None
      sinceBlock:
+        13628326
    }
```

Generated with discovered.json: 0xa45d280158816c143fa16d7daff05fae2222eee7

# Diff at Tue, 04 Feb 2025 12:31:42 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21242106
- current block number: 21242106

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x4d30d420200d002030af6165bb9417e5d8376268

# Diff at Mon, 20 Jan 2025 11:09:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21242106
- current block number: 21242106

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.7.target:
-        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
      receivedPermissions.7.from:
+        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
      receivedPermissions.6.target:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      receivedPermissions.6.from:
+        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      receivedPermissions.5.target:
-        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      receivedPermissions.5.from:
+        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      receivedPermissions.4.target:
-        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      receivedPermissions.4.from:
+        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      receivedPermissions.3.target:
-        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      receivedPermissions.3.from:
+        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      receivedPermissions.2.target:
-        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
      receivedPermissions.2.from:
+        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
      receivedPermissions.1.target:
-        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      receivedPermissions.1.from:
+        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      receivedPermissions.0.target:
-        "0x918778e825747a892b17C66fe7D24C618262867d"
      receivedPermissions.0.from:
+        "0x918778e825747a892b17C66fe7D24C618262867d"
      directlyReceivedPermissions.0.target:
-        "0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
      directlyReceivedPermissions.0.from:
+        "0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
    }
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      directlyReceivedPermissions.1.from:
+        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      directlyReceivedPermissions.0.target:
-        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      directlyReceivedPermissions.0.from:
+        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.to:
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

Generated with discovered.json: 0x6a10bd6445b4572b3e0aa53692b4db70a921cca7

# Diff at Mon, 20 Jan 2025 09:25:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 21242106
- current block number: 21242106

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      fieldMeta.getOwners.type:
+        "PERMISSION"
      fieldMeta.getThreshold.type:
+        "PERMISSION"
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      fieldMeta.StateCommitmentChain.type:
+        "CODE_CHANGE"
    }
```

Generated with discovered.json: 0x5e91894fac1cc33d8a28a8c428389bbff89ad8e9

# Diff at Wed, 04 Dec 2024 14:21:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5ce1f4558272638b4ce9e4501463a3fa3ee115cb block: 21242106
- current block number: 21242106

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242106 (main branch discovery), not current.

```diff
    contract ChainStorageContainer-SCC-batches (0x10739F09f6e62689c0aA8A1878816de9e166d6f9) {
    +++ description: None
      name:
-        "ChainStorageContainer"
+        "ChainStorageContainer-SCC-batches"
    }
```

```diff
    contract ChainStorageContainer-CTC-batches (0x38473Feb3A6366757A249dB2cA4fBB2C663416B7) {
    +++ description: None
      name:
-        "ChainStorageContainer"
+        "ChainStorageContainer-CTC-batches"
    }
```

```diff
    contract ChainStorageContainer-CTC-queue (0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57) {
    +++ description: None
      name:
-        "ChainStorageContainer"
+        "ChainStorageContainer-CTC-queue"
    }
```

Generated with discovered.json: 0xc18eb8ea91524ae0c35320c5d45eeacf4a7106d7

# Diff at Fri, 22 Nov 2024 08:34:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@292f23170122adf00047246ebc612907f3cba48f block: 20211335
- current block number: 21242106

## Description

Config related (ProxyAdmin template match).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.via.0:
+        {"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8","delay":0}
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"}
      receivedPermissions.5.target:
-        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
+        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      receivedPermissions.5.via:
+        [{"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
      receivedPermissions.4.target:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      receivedPermissions.3.target:
-        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
+        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      receivedPermissions.2.target:
-        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
+        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
      receivedPermissions.1.target:
-        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
+        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
      receivedPermissions.1.via:
+        [{"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"}]
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"},{"permission":"upgrade","target":"0xD54c868362C2098E0E46F12E7D924C6A332952Dd"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"},{"permission":"upgrade","target":"0xD54c868362C2098E0E46F12E7D924C6A332952Dd"}]
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
      issuedPermissions.0.via.0:
+        {"address":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8","delay":0}
    }
```

Generated with discovered.json: 0x9d98c92aed2ee7c458049d4a169109e311e347cc

# Diff at Mon, 21 Oct 2024 12:46:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      descriptions:
-        ["Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system."]
      description:
+        "Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system."
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

Generated with discovered.json: 0x3aecf356f21722538eccbb22982470f6d770547f

# Diff at Mon, 21 Oct 2024 11:07:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x081D1101855bD523bA69A9794e0217F0DB6323ff) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x8bF439ef7167023F009E24b21719Ca5f768Ecb36"]
      values.$pastUpgrades.0.1:
-        ["0x8bF439ef7167023F009E24b21719Ca5f768Ecb36"]
+        "0xa752a872bee0f5d9be41b00f85e4d0b5e958f5644f5609dd0907dd74263ff7f4"
    }
```

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC"]
      values.$pastUpgrades.1.1:
-        ["0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC"]
+        "0x356768c4abdb1df76773881dc3c4d8ad7af36ac2154baaec83c3f878aedb6b57"
      values.$pastUpgrades.0.2:
+        ["0x8db636418F10d514c4c68235ee3d640dDBCC7a8a"]
      values.$pastUpgrades.0.1:
-        ["0x8db636418F10d514c4c68235ee3d640dDBCC7a8a"]
+        "0x37356e30602c7e4e6b05129e3a0375c3fbeb08856eb198ef7ec2a6c75fd3ee78"
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xD8f38c831E5032d23065Eaaee8c0620e17c04D60"]
      values.$pastUpgrades.1.1:
-        ["0xD8f38c831E5032d23065Eaaee8c0620e17c04D60"]
+        "0x356768c4abdb1df76773881dc3c4d8ad7af36ac2154baaec83c3f878aedb6b57"
      values.$pastUpgrades.0.2:
+        ["0xd87Da73F82abe83915d61342199A4690cfdf4718"]
      values.$pastUpgrades.0.1:
-        ["0xd87Da73F82abe83915d61342199A4690cfdf4718"]
+        "0x5a9766b27606f1c41f132a4a900131f39ab49a27607d27db667ecc1de2f9f0d1"
    }
```

Generated with discovered.json: 0xc823b4ffab0465686326f926227fda7a063de0b5

# Diff at Mon, 14 Oct 2024 10:53:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x081D1101855bD523bA69A9794e0217F0DB6323ff) {
    +++ description: None
      sourceHashes:
+        ["0x6e4b297b822bdda2bb8bbf4dde360ee51379af5a0de55c0d726a2d7b68791bf7","0xda7b05d88be95072ae926d6f2b176d60c2d568f45ef6c67071b28159388c81e7"]
    }
```

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      sourceHashes:
+        ["0xccb5b222f823953e2082d6174b99d09cb9046c862bb91c6fe6cb57e5289a9738","0x3052e020792c1a42febb86916d737ca4d3962b80b97fe18c7a778bf270acf023"]
    }
```

```diff
    contract ChainStorageContainer (0x10739F09f6e62689c0aA8A1878816de9e166d6f9) {
    +++ description: None
      sourceHashes:
+        ["0x94ea4eb57654b23e5ce34a8f4571a446786efb3080044f3ecfc2f3870e601ee0"]
    }
```

```diff
    contract ChainStorageContainer (0x38473Feb3A6366757A249dB2cA4fBB2C663416B7) {
    +++ description: None
      sourceHashes:
+        ["0x94ea4eb57654b23e5ce34a8f4571a446786efb3080044f3ecfc2f3870e601ee0"]
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: None
      sourceHashes:
+        ["0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd","0x6e30dabe85a54d5753ec304088b4cc9f1fc2ba202fb3982bf202b0cc4a922c99"]
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"}
      receivedPermissions.4.target:
-        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
+        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      receivedPermissions.3.target:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      receivedPermissions.2.target:
-        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
+        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
      receivedPermissions.1.target:
-        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
+        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b"
+        "0x918778e825747a892b17C66fe7D24C618262867d"
      receivedPermissions.0.description:
+        "set and change address mappings."
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract CanonicalTransactionChain (0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9) {
    +++ description: None
      sourceHashes:
+        ["0x70010b1d5bb98964174a28e3c3a229763fb65df55575104adbec0bc0552cd31d"]
    }
```

```diff
    contract BondManager (0x595801b85628ec6979C420988b8843A40F850528) {
    +++ description: None
      sourceHashes:
+        ["0xe429226928e3766e14dbbf6391a4caa68cf9e4c12cb9e81ef04b84a38747449a"]
    }
```

```diff
    contract RewardEscrowerMultisig (0x62478E4eeb4070fE399866aB05e821AB97200947) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: None
      sourceHashes:
+        ["0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd","0xc5bc8dddf764177767a3613d96c31c0fcc86db07c909c72cbf2f6a2443942109"]
    }
```

```diff
    contract MVM_DiscountOracle (0x7f6B0b7589febc40419a8646EFf9801b87397063) {
    +++ description: None
      sourceHashes:
+        ["0x8406419ac446023c37b27d0154da77b664a20b7da231802e32193c8883d32d06"]
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      sourceHashes:
+        ["0x1c9416031605fbda74b5da95a290e00995eaed2f6f6ba85ff2681131efe940a0"]
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      template:
+        "opstack/AddressManager"
      sourceHashes:
+        ["0x763c5728a19538783edf38c17731f9cf79ff6f38bfa4bce61333cef0aac5452e"]
      displayName:
+        "AddressManager"
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      issuedPermissions:
+        [{"permission":"configure","target":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

```diff
    contract MToken (0x9E32b13ce7f2E80A01932B42553652E053D6ed8e) {
    +++ description: None
      sourceHashes:
+        ["0xd0f9d9680beb2766f32df8f35302771cde6d0ccb5c3e7f32fdacd13bf5c58203"]
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      sourceHashes:
+        ["0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd","0xc6bcfffdfe15d4c259332b8f62b29950aecdec253e8eeed2ebfa9e78ca1cea2b"]
    }
```

```diff
    contract ChainStorageContainer (0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57) {
    +++ description: None
      sourceHashes:
+        ["0x94ea4eb57654b23e5ce34a8f4571a446786efb3080044f3ecfc2f3870e601ee0"]
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      sourceHashes:
+        ["0xccb5b222f823953e2082d6174b99d09cb9046c862bb91c6fe6cb57e5289a9738","0xff86f55c7d91dbdd408e8b44c6aa3647e5d7cef144de8a65bc84e13e3bf3524f"]
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: None
      sourceHashes:
+        ["0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd","0x85cae352a6b900f9d20a913095da6267900b8e10f04d7277743dcdd0ce8c809e"]
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: None
      sourceHashes:
+        ["0x18e98a64fbfe011a7514d7a547900c02a3e0f9a49ab3413d517fd7e0e3c539dd","0x8be6c2abbd355799e149ebae677a3814685c6b43ebad0b7853fe236af7a84fe7"]
    }
```

Generated with discovered.json: 0xb81d3b00e3bf20bbf472f7ce4bf1ae1c9a9021bd

# Diff at Tue, 01 Oct 2024 10:53:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x081D1101855bD523bA69A9794e0217F0DB6323ff) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-11-16T15:26:15.000Z",["0x8bF439ef7167023F009E24b21719Ca5f768Ecb36"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-13T07:27:47.000Z",["0x8db636418F10d514c4c68235ee3d640dDBCC7a8a"]],["2024-06-29T01:46:35.000Z",["0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC"]]]
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-13T07:28:59.000Z",["0xd87Da73F82abe83915d61342199A4690cfdf4718"]],["2024-06-29T01:46:35.000Z",["0xD8f38c831E5032d23065Eaaee8c0620e17c04D60"]]]
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x8063b8a835380221625fb5e93e5b60a87eba1e12

# Diff at Fri, 30 Aug 2024 07:53:44 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
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
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x5fbf6a2b5d9a2a0956c6939ffdbce796e6a1638d

# Diff at Fri, 23 Aug 2024 09:53:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0xb23695bb53308f9952d1308824fe405e1d092e00

# Diff at Wed, 21 Aug 2024 10:04:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      assignedPermissions:
-        {"upgrade":["0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b","0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a","0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6","0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb","0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b","via":[]},{"permission":"upgrade","target":"0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a","via":[]},{"permission":"upgrade","target":"0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6","via":[]},{"permission":"upgrade","target":"0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb","via":[]},{"permission":"upgrade","target":"0xf3d58D1794f2634d6649a978f2dc093898FEEBc0","via":[]}]
    }
```

```diff
    contract MVM_CanonicalTransaction (0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48","0xD54c868362C2098E0E46F12E7D924C6A332952Dd"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48","via":[]},{"permission":"upgrade","target":"0xD54c868362C2098E0E46F12E7D924C6A332952Dd","via":[]}]
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8","via":[]}]
    }
```

```diff
    contract MVM_Verifier (0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

```diff
    contract MVM_L2ChainManagerOnL1 (0xf3d58D1794f2634d6649a978f2dc093898FEEBc0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21","via":[]}]
    }
```

Generated with discovered.json: 0xfd7a32c80d4acddc2de88f062b543c857fcaf921

# Diff at Fri, 09 Aug 2024 12:00:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      assignedPermissions.upgrade.4:
-        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
+        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
      assignedPermissions.upgrade.3:
-        "0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"
+        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
      assignedPermissions.upgrade.2:
-        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
+        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
      assignedPermissions.upgrade.1:
-        "0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb"
+        "0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a"
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
+        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
      assignedPermissions.upgrade.0:
-        "0xD54c868362C2098E0E46F12E7D924C6A332952Dd"
+        "0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"
    }
```

Generated with discovered.json: 0xe0e1aa09f815df21c7c4ef140cde5cbfb26bbb3e

# Diff at Fri, 09 Aug 2024 10:10:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      assignedPermissions.admin:
-        ["0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b","0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a","0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6","0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb","0xf3d58D1794f2634d6649a978f2dc093898FEEBc0"]
      assignedPermissions.upgrade:
+        ["0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b","0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb","0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a","0xf3d58D1794f2634d6649a978f2dc093898FEEBc0","0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"]
      values.$multisigThreshold:
-        "4 of 9 (44%)"
+++ severity: LOW
      values.getOwners:
-        ["0x1577D2b835f561BD021E3219Cd786181D0e17ff5","0x36B892a31b311E5e9960739A69D2dF0aa0F81A01","0x001088E383A00ff4ab36F37f7021Cb6d7B415751","0x217fD54d336f710F8aee19572dBfBf0B2297ed69","0xB383E1331dEE29864b68f7D84b0dC289F770d846","0x7a9059F4A6e50090e4f55994d465918200AB4454","0x02058Bb1d98D88087008F2ac1273584591380e3F","0xB961047013F974C5b6B6F8dA4402379525316550","0xa6D8941F935932a531A856C2e48046DA73a1098E"]
+++ severity: HIGH
      values.getThreshold:
-        4
      values.$members:
+        ["0x1577D2b835f561BD021E3219Cd786181D0e17ff5","0x36B892a31b311E5e9960739A69D2dF0aa0F81A01","0x001088E383A00ff4ab36F37f7021Cb6d7B415751","0x217fD54d336f710F8aee19572dBfBf0B2297ed69","0xB383E1331dEE29864b68f7D84b0dC289F770d846","0x7a9059F4A6e50090e4f55994d465918200AB4454","0x02058Bb1d98D88087008F2ac1273584591380e3F","0xB961047013F974C5b6B6F8dA4402379525316550","0xa6D8941F935932a531A856C2e48046DA73a1098E"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 9 (44%)"
    }
```

```diff
    contract RewardEscrowerMultisig (0x62478E4eeb4070fE399866aB05e821AB97200947) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 4 (50%)"
      values.getOwners:
-        ["0x36B892a31b311E5e9960739A69D2dF0aa0F81A01","0x1577D2b835f561BD021E3219Cd786181D0e17ff5","0xa6D8941F935932a531A856C2e48046DA73a1098E","0x26eC4FF77DF305d5a9A7660E046dd1c06ce517f6"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x36B892a31b311E5e9960739A69D2dF0aa0F81A01","0x1577D2b835f561BD021E3219Cd786181D0e17ff5","0xa6D8941F935932a531A856C2e48046DA73a1098E","0x26eC4FF77DF305d5a9A7660E046dd1c06ce517f6"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48","0xD54c868362C2098E0E46F12E7D924C6A332952Dd"]
      assignedPermissions.upgrade:
+        ["0xD54c868362C2098E0E46F12E7D924C6A332952Dd","0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48"]
    }
```

Generated with discovered.json: 0x875c4da9f3fbdd0fee44fd890a860a348e3914cc

# Diff at Tue, 30 Jul 2024 11:12:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20211335
- current block number: 20211335

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211335 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      fieldMeta:
+        {"getOwners":{"severity":"LOW"},"getThreshold":{"severity":"HIGH"}}
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: None
      fieldMeta:
+        {"StateCommitmentChain":{"severity":"HIGH","description":"Manages the L2 state on Ethereum. L2 state batches can be appended here by proposers."}}
    }
```

Generated with discovered.json: 0xc2b133e2d28061b2f2999510d44b3619992bd7a1

# Diff at Mon, 01 Jul 2024 11:22:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b5540be6f0b9cb1f69a05dba32413b0eae0acbf4 block: 19926649
- current block number: 20211335

## Description

Small upgrade of LockingInfo and LockingPool to add a `withdraw()` function that allows whitelisted sequencers to withdraw their collateral.
No other changes.

## Watched changes

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      upgradeability.implementation:
-        "0x8db636418F10d514c4c68235ee3d640dDBCC7a8a"
+        "0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC"
      implementations.0:
-        "0x8db636418F10d514c4c68235ee3d640dDBCC7a8a"
+        "0x0D30F0d7934f53aaF6a1630A4c109AF4513a65cC"
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      upgradeability.implementation:
-        "0xd87Da73F82abe83915d61342199A4690cfdf4718"
+        "0xD8f38c831E5032d23065Eaaee8c0620e17c04D60"
      implementations.0:
-        "0xd87Da73F82abe83915d61342199A4690cfdf4718"
+        "0xD8f38c831E5032d23065Eaaee8c0620e17c04D60"
    }
```

## Source code changes

```diff
.../LockingInfo/LockingInfo.sol                    | 41 +++++++++++++++++++++-
 .../LockingPool/LockingPool.sol                    | 31 ++++++++++++++++
 2 files changed, 71 insertions(+), 1 deletion(-)
```

Generated with discovered.json: 0xa6118ecf8ee031edb689b088ecd67c6ab3dce64a

# Diff at Wed, 22 May 2024 16:35:57 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eae7b47a410c2b8cc7e6a7d7a0bc841a31c6e83 block: 19866806
- current block number: 19926649

## Description

One new signer (`0x1577D2b835f561BD021E3219Cd786181D0e17ff5`) is added to Metis Multisig and RewardEscrowerMultisig, which also gains another signer from Metis Multisig.

## Watched changes

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      upgradeability.threshold:
-        "4 of 8 (50%)"
+        "4 of 9 (44%)"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.8:
+        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.7:
-        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
+        "0xB961047013F974C5b6B6F8dA4402379525316550"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.6:
-        "0xB961047013F974C5b6B6F8dA4402379525316550"
+        "0x02058Bb1d98D88087008F2ac1273584591380e3F"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.5:
-        "0x02058Bb1d98D88087008F2ac1273584591380e3F"
+        "0x7a9059F4A6e50090e4f55994d465918200AB4454"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.4:
-        "0x7a9059F4A6e50090e4f55994d465918200AB4454"
+        "0xB383E1331dEE29864b68f7D84b0dC289F770d846"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.3:
-        "0xB383E1331dEE29864b68f7D84b0dC289F770d846"
+        "0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.2:
-        "0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
+        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.1:
-        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+        "0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.0:
-        "0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
+        "0x1577D2b835f561BD021E3219Cd786181D0e17ff5"
    }
```

```diff
    contract RewardEscrowerMultisig (0x62478E4eeb4070fE399866aB05e821AB97200947) {
    +++ description: Escrows staking rewards for Sequencers.
      upgradeability.threshold:
-        "2 of 2 (100%)"
+        "2 of 4 (50%)"
      values.getOwners.3:
+        "0x26eC4FF77DF305d5a9A7660E046dd1c06ce517f6"
      values.getOwners.2:
+        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
      values.getOwners.1:
-        "0x26eC4FF77DF305d5a9A7660E046dd1c06ce517f6"
+        "0x1577D2b835f561BD021E3219Cd786181D0e17ff5"
      values.getOwners.0:
-        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
+        "0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19866806 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x62478E4eeb4070fE399866aB05e821AB97200947) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "RewardEscrowerMultisig"
    }
```

Generated with discovered.json: 0xe1b1004c8e1e55d7df21acfdc86aae2a9e021b38

# Diff at Tue, 14 May 2024 07:37:14 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0dcad16d442c9306c666eb55cc246f5202105346 block: 19810457
- current block number: 19866806

## Description

Sequencer relatives and sequencing rewards are now ignored in watch mode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19810457 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract EqbToken (0x0Cf6ab3c169B0169E35aD58D350CbACdaF80E139)
    +++ description: None
```

```diff
-   Status: DELETED
    contract BeaconProxy (0x66c7674732357b01B3E9a8F94A05C411BeA1767A)
    +++ description: None
```

Generated with discovered.json: 0x759b0a0e3864e323491cdd0f35fd5e8153894b95

# Diff at Mon, 06 May 2024 10:30:49 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@db9818837028c52979d74016bb4f011aa0545e1f block: 19761802
- current block number: 19810457

## Description

### Enki liquid Metis staking

A sequencer is added to the LockingPool at index 4. It seems to belong to [Enki](https://enkixyz.com/), a new liquid staking protocol on Metis L2.
Enki deployed multiple contracts on L1 (Dealer, SequencerAgent) and L2 (eMetisMinter) to support their liquid staking protocol.
The METIS gets bridged natively from L2 (eMetisMinter) to the Dealer contract on L1 and then deposited by SequencerAgent contracts through the Dealer to the standard LockingInfo contract. Rewards accrue to eMetisMinter on L2.

### Rewards change

METIS rewards for sequencers have been increased by ~50% to 0.001504744 METIS (~10 cents, or 25% APY for 20k METIS per sequencer) per L1 block (L1 block because L2 block times are dynamic).

## Watched changes

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      values.BLOCK_REWARD:
-        1504744000000000
+        2245402873000000
      values.rewardPerBlock:
-        1504744000000000
+        2245402873000000
    }
```

```diff
+   Status: CREATED
    contract BeaconProxy (0x66c7674732357b01B3E9a8F94A05C411BeA1767A)
    +++ description: None
```

## Source code changes

```diff
.../contracts/interfaces/IERC1967.sol              |  26 +++
 .../contracts/interfaces/draft-IERC1822.sol        |  20 ++
 .../contracts/proxy/ERC1967/ERC1967Upgrade.sol     | 157 +++++++++++++
 .../@openzeppelin/contracts/proxy/Proxy.sol        |  86 ++++++++
 .../contracts/proxy/beacon/BeaconProxy.sol         |  61 ++++++
 .../contracts/proxy/beacon/IBeacon.sol             |  16 ++
 .../@openzeppelin/contracts/utils/Address.sol      | 244 +++++++++++++++++++++
 .../@openzeppelin/contracts/utils/StorageSlot.sol  | 138 ++++++++++++
 .../metis/ethereum/.code/BeaconProxy/meta.txt      |   2 +
 9 files changed, 750 insertions(+)
```

Generated with discovered.json: 0x32cd4835f42450c41cf18b3710f155a0ea983391

# Diff at Sat, 27 Apr 2024 06:12:10 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@137703a8d89fb4befd7908b97b5e85939d7d2e88 block: 19726038
- current block number: 19744803

## Description

Owners of StateCommitment Chains and ProxyAdmin that upgrades LockingPool and LockingInfo contracts changed from EOA to Metis MultiSig

## Watched changes

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      values.owner:
-        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8) {
    +++ description: None
      values.owner:
-        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6) {
    +++ description: None
      upgradeability.admin:
-        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      values.owner:
-        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+        "0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21"
    }
```

Generated with discovered.json: 0x94a766214a80c0a94393fcb2824015d182ebffe2

# Diff at Wed, 24 Apr 2024 15:11:42 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@c8ed50df909cddbb2e3d9ea318326016eb2de775 block: 19531985
- current block number: 19726038

## Description

Discovery now includes the addresses related to the Metis sequencer decentralization efforts.
The current discovered.json in ProtocolBeat shows a good overview.
Batches still get posted to `0xFf00000000000000000000000000000000001088`.
The logic for the Sequencer Pool MPC that results in posted hash batches on Ethereum is off-chain and does not get verified on ethereum.
LockinPool, LockingInfo (via ProxyAdmin) and SCC have an EOA as Admin.

### LockingInfo

Escrow for METIS locked by bonded Sequencers.

### LockingPool

Registry for Sequencers and the MPC address. Four sequencers are currently bonded of which 3 are funded by Metis and 1 is funded by Equilibria Finance.

### rewardPayer Multisig

2/2 Multisig that funds sequencing rewards.

### StakingPool and StakingPoolManager

Deployed by Equilibria Finance. StakingPool is registered as a Sequencer owner (manages a Sequencer).
Currently not included in discovery as it seems to be external to Metis.

## Watched changes

```diff
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48) {
    +++ description: None
      values.rewardPayer:
-        "0x0000000000000000000000000000000000000000"
+        "0x62478E4eeb4070fE399866aB05e821AB97200947"
    }
```

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: None
      values.BondManager:
-        "0xf51B9C9a1c12e7E48BEC15DC358D0C1f0d7Eb3be"
+        "0x595801b85628ec6979C420988b8843A40F850528"
    }
```

```diff
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd) {
    +++ description: None
      values.BLOCK_REWARD:
-        761000000000000
+        1504744000000000
      values.mpcAddress:
-        "0x0000000000000000000000000000000000000000"
+        "0xD294A6f4287edbFeBF9d57B79ce657BD33bB8b3b"
      values.rewardPerBlock:
-        761000000000000
+        1504744000000000
      values.sequencers.3:
+        ["58634578080235465000000",0,2,2,0,0,0,1,"0x735Aad08c5eF7620b6422E85613f8335Ec07b573","0x31e623DCb8B43aD4d05aAA6209574cf336980590","0xa3f2635f4d555f68f7be80fcf7b13ec9ecdf09365e6a57f6c5f513aa1d1af4565e53a0612e4e4a97124aa95cc17a3e56b5da1afb21c41d9cdb7e5264380a0790","0x0Cf6ab3c169B0169E35aD58D350CbACdaF80E139",2]
      values.sequencers.2:
+        ["20000000000000000000000","341195111000000000000",1,1,0,0,0,1,"0x24194DFB135B33507a8F05C3F9Ada922F40CE3Ff","0xAfF606251d8540f97Ca2Db12774C0147A170aB9e","0x713de5a736a196d0d65fc7e5d8cd716086d099fbaee929774752f2e8e370105e2d90e846d64167ea59a95160277abddf004660c6dac47f5c92a0f00234fe7000","0x0000000000000000000000000000000000000000",2]
      values.sequencers.1:
+        ["20000000000000000000000","386890878000000000000",1,1,0,0,0,1,"0xe8D97563Cfd919F1B9F7cE0049346e8796148CD5","0xa233Cc81fC6C12e3318eA71EC5D7bBA78C706b04","0x1674b9842e300ab236bf6cedfea92e80a04cc7f12bbff2ff35b01295380d9211a9861a40867a4a04c6a89ee0a022f7afccbb5dddb87d622e1ddff9bd2069c7e8","0x0000000000000000000000000000000000000000",2]
      values.sequencers.0:
+        ["20000000000000000000000","431750306000000000000",1,1,0,0,0,1,"0x05B755a8B2fEc50391B5C38B2afB206Ba0e8e50E","0xEcA7Ae7dE0d1978DF299a547Ee66c4503fBa474D","0x4d5e02936a222d68b5d423e566828d8c67ca2290cf428254c44c7be458b33decec1fe85d900756811366e2d19baeb2fe81b46ce10c1863e00d811e68a4e76c9f","0x0000000000000000000000000000000000000000",2]
    }
```

```diff
-   Status: DELETED
    contract BondManager (0xf51B9C9a1c12e7E48BEC15DC358D0C1f0d7Eb3be)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EqbToken (0x0Cf6ab3c169B0169E35aD58D350CbACdaF80E139)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BondManager (0x595801b85628ec6979C420988b8843A40F850528)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x62478E4eeb4070fE399866aB05e821AB97200947)
    +++ description: None
```

## Source code changes

```diff
.../contracts/L1/verification/BondManager.sol      |  26 +-
 .../contracts/L1/verification/IBondManager.sol     |   1 +
 .../contracts/libraries/utils/Lib_Uint.sol         |  39 ++
 .../{.code@19531985 => .code}/BondManager/meta.txt |   2 +-
 .../access/OwnableUpgradeable.sol                  |  95 +++++
 .../proxy/utils/Initializable.sol                  | 138 +++++++
 .../token/ERC20/ERC20Upgradeable.sol               | 395 +++++++++++++++++++
 .../token/ERC20/IERC20Upgradeable.sol              |  82 ++++
 .../ERC20/extensions/IERC20MetadataUpgradeable.sol |  28 ++
 .../utils/AddressUpgradeable.sol                   | 195 ++++++++++
 .../utils/ContextUpgradeable.sol                   |  37 ++
 .../ethereum/.code/EqbToken/contracts/EqbToken.sol |  24 ++
 .../metis/ethereum/.code/EqbToken/meta.txt         |   2 +
 .../implementation/contracts/GnosisSafe.sol        | 422 +++++++++++++++++++++
 .../implementation/contracts/base/Executor.sol     |  27 ++
 .../contracts/base/FallbackManager.sol             |  53 +++
 .../implementation/contracts/base/GuardManager.sol |  50 +++
 .../contracts/base/ModuleManager.sol               | 133 +++++++
 .../implementation/contracts/base/OwnerManager.sol | 149 ++++++++
 .../implementation/contracts/common/Enum.sol       |   8 +
 .../contracts/common/EtherPaymentFallback.sol      |  13 +
 .../contracts/common/SecuredTokenTransfer.sol      |  35 ++
 .../contracts/common/SelfAuthorized.sol            |  16 +
 .../contracts/common/SignatureDecoder.sol          |  36 ++
 .../implementation/contracts/common/Singleton.sol  |  11 +
 .../contracts/common/StorageAccessible.sol         |  47 +++
 .../contracts/external/GnosisSafeMath.sol          |  54 +++
 .../contracts/interfaces/ISignatureValidator.sol   |  20 +
 .../.code/GnosisSafe/implementation/meta.txt       |   2 +
 .../.code/GnosisSafe/proxy/GnosisSafeProxy.sol     | 155 ++++++++
 .../metis/ethereum/.code/GnosisSafe/proxy/meta.txt |   2 +
 31 files changed, 2286 insertions(+), 11 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531985 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract LockingInfo (0x0fe382b74C3894B65c10E5C12ae60Bbd8FAf5b48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8FbB8D00f7621B68F219B0B18738F07aF513D5C8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockingPool (0xD54c868362C2098E0E46F12E7D924C6A332952Dd)
    +++ description: None
```

Generated with discovered.json: 0x61dd6c8c90be3d312520dbd91d547e88fa6b5daf

# Diff at Thu, 28 Mar 2024 10:22:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19489325
- current block number: 19531985

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19489325 (main branch discovery), not current.

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: Can pause, censor, instantly upgrade the bridge and upgrade other critical contracts in the system.
      upgradeability.threshold:
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0x32ada392a2476f61c6a679a370ed6032290b3273

# Diff at Fri, 22 Mar 2024 09:39:12 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0bfaf274e094a51da737f99f9979af9d44884387 block: 19432288
- current block number: 19489325

## Description

The State Commitment Chain (SCC) is upgraded to a new implementation behind a proxy and the default proposer is changed.

### Decentralized proposer changes in the SCC

The SCC now disregards the Canonical Transaction Chain (CTC).
The logic for accepting state batches from permissionless proposers in the SCC is now present in appendStateBatch(), but the BondManager still disqualifies any non-default proposer and thus in practice the sequencer is still centralized until the BondManager code gets updated to actually verify collateralization when called.

The old SCC rejected any third party state batches during a 'SEQUENCER_PUBLISH_WINDOW' of half a year, which effectively made the default sequencer the only one. This has now been deprecated in the new SCC implementation.

## Watched changes

```diff
    contract Lib_AddressManager (0x918778e825747a892b17C66fe7D24C618262867d) {
    +++ description: None
      values._1088_MVM_Proposer:
-        "0x9cB01d516D930EF49591a05B09e0D33E6286689D"
+        "0xf3CEB4C2ef996CdBc95C4E18c6D0CA988CC09040"
+++ description: Manages the L2 state on Ethereum. L2 state batches can be appended here by proposers.
+++ type: CODE_CHANGE
+++ severity: HIGH
      values.StateCommitmentChain:
-        "0xf209815E595Cdf3ed0aAF9665b1772e608AB9380"
+        "0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6"
    }
```

```diff
-   Status: DELETED
    contract StateCommitmentChain (0xf209815E595Cdf3ed0aAF9665b1772e608AB9380)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateCommitmentChain (0xA2FaAAC9120c1Ff75814F0c6DdB119496a12eEA6)
    +++ description: None
```

## Source code changes

```diff
.../ICanonicalTransactionChain.sol => /dev/null    | 441 ---------------------
 .../libraries/rlp/Lib_RLPWriter.sol => /dev/null   | 208 ----------
 .../utils/Lib_Bytes32Utils.sol => /dev/null        |  47 ---
 .../utils/Lib_BytesUtils.sol => /dev/null          | 127 ------
 .../@openzeppelin/contracts/access/Ownable.sol     |   0
 .../@openzeppelin/contracts/utils/Context.sol      |   0
 .../contracts/L1/rollup/IChainStorageContainer.sol |  62 +--
 .../contracts/L1/rollup/IStateCommitmentChain.sol  |  55 +--
 .../contracts/L1/verification/IBondManager.sol     |   1 +
 .../contracts/MVM/MVM_StateCommitmentChain.sol}    | 330 +++++----------
 .../contracts/libraries/codec/Lib_OVMCodec.sol     |   3 -
 .../libraries/resolver/Lib_AddressManager.sol      |   0
 .../libraries/resolver/Lib_AddressResolver.sol     |   0
 .../contracts/libraries/rlp/Lib_RLPReader.sol      |   0
 .../contracts/libraries/utils/Lib_MerkleTree.sol   |   0
 .../contracts/libraries/utils/Lib_Uint.sol         |  39 ++
 .../StateCommitmentChain/implementation/meta.txt   |   2 +
 .../StateCommitmentChain/meta.txt => /dev/null     |   2 -
 .../contracts/chugsplash/L1ChugSplashProxy.sol     | 278 +++++++++++++
 .../interfaces/iL1ChugSplashDeployer.sol           |   9 +
 .../.code/StateCommitmentChain/proxy/meta.txt      |   2 +
 21 files changed, 459 insertions(+), 1147 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19432288 (main branch discovery), not current.

```diff
    contract StateCommitmentChain (0xf209815E595Cdf3ed0aAF9665b1772e608AB9380) {
    +++ description: None
      values.getLastSequencerTimestampByChainId:
-        1710389927
+        [0,0,0,0,0]
      values.getTotalBatchesByChainId:
-        22918
+        [0,0,0,0,0]
      values.getTotalElementsByChainId:
-        15213630
+        [0,0,0,0,0]
      errors:
+        {"getLastSequencerTimestampByChainId":"Too many values. Update configuration to explore fully","getTotalBatchesByChainId":"Too many values. Update configuration to explore fully","getTotalElementsByChainId":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0xb4944b31e0a3f27a1a1f785c95fb0e29a6338e7a

# Diff at Thu, 14 Mar 2024 09:14:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@af87effd99a7b745cb97368cfbb16dc82443174a block: 18833503
- current block number: 19432288

## Description

Two signers are added to the multisig.

## Watched changes

```diff
    contract Metis Multisig (0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21) {
    +++ description: None
      values.getOwners[7]:
+        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
      values.getOwners[6]:
+        "0xB961047013F974C5b6B6F8dA4402379525316550"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.5:
-        "0xa6D8941F935932a531A856C2e48046DA73a1098E"
+        "0x02058Bb1d98D88087008F2ac1273584591380e3F"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.4:
-        "0xB961047013F974C5b6B6F8dA4402379525316550"
+        "0x7a9059F4A6e50090e4f55994d465918200AB4454"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.3:
-        "0x02058Bb1d98D88087008F2ac1273584591380e3F"
+        "0xB383E1331dEE29864b68f7D84b0dC289F770d846"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.2:
-        "0x7a9059F4A6e50090e4f55994d465918200AB4454"
+        "0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.1:
-        "0xB383E1331dEE29864b68f7D84b0dC289F770d846"
+        "0x001088E383A00ff4ab36F37f7021Cb6d7B415751"
+++ description: Array of the multisig signers
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.0:
-        "0x217fD54d336f710F8aee19572dBfBf0B2297ed69"
+        "0x36B892a31b311E5e9960739A69D2dF0aa0F81A01"
    }
```

Generated with discovered.json: 0xd3b550ff7c80b542babb88f19ab684dbc8a006b9

# Diff at Thu, 21 Dec 2023 10:01:06 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e3ed8c1fec052d9121fe4f20c32a54980307e76e

## Description

The total supply of the Metis Token has been increased to 10000000.

## Watched changes

```diff
    contract MToken (0x9E32b13ce7f2E80A01932B42553652E053D6ed8e) {
      values.totalSupply:
-        "5410000510000000000000000"
+        "10000000000000000000000000"
    }
```
