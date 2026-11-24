Generated with discovered.json: 0xc0bde1a1e6adb74764de71a025e77621b54c5d6c

# Diff at Tue, 24 Nov 2026 09:25:45 GMT:

- id: 0a92d111
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@4543e3b4810d193ef5a247036295c604271b20a8 block: 1795100733
- current timestamp: 1795512257

## Description

AdminVerifierWhitelist: one more adopter assigned to a manager account.
Adopter manager EOA: now an EIP-7702 account delegated to MetaMask's EIP7702StatelessDeleGator v1.3.0.

## Watched changes

```diff
    contract AdminVerifierWhitelist (eth:0x1Ab8D3CDb7eE245abD53859F8D967a4F9a91a130) [phylax/AdminVerifierWhitelist] {
    +++ description: Admin verifier that approves a manager registration only from the account a whitelist admin assigned to that adopter. Whitelist admins can also exclude an adopter, which blocks assignments until the exclusion's releaser lifts it. Assignments are checked only at registration.
+++ description: Account assigned to each adopter.
+++ severity: MEDIUM
      values.assignedManagers.10:
+        {"assertionAdopter":"eth:0x9ccE444F8c60BD570986cd7D0ED7aEc29f127310","admin":"eth:0x71092efD4909Fb34e023ec10984F6cB64824E926"}
    }
```

```diff
    EOA (eth:0x3B7F2cA306882D240634e01a3Bf71BD04C194C23) {
    +++ description: None
      proxyType:
-        "EOA"
+        "EIP7702 EOA"
      sourceHashes:
+        ["0x1f44812af62d28f019e30e8eb2af596fb36c7db9d34576972c0405e110a6ef45"]
      values:
+        {"$implementation":"eth:0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B","delegationManager":"eth:0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3","DOMAIN_VERSION":"1","eip712Domain":{"fields":"0x0f","name":"EIP7702StatelessDeleGator","version":"1","chainId":1,"verifyingContract":"eth:0x3B7F2cA306882D240634e01a3Bf71BD04C194C23","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"entryPoint":"eth:0x0000000071727De22E5E9d8BAf0edAc6f37da032","getDeposit":0,"getDomainHash":"0x30cb07e685b38c7fe2269ef438311403e7178f0b5bda254087903879ed8fca00","getNonce":0,"NAME":"EIP7702StatelessDeleGator","PACKED_USER_OP_TYPEHASH":"0xbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc18","VERSION":"1.3.0"}
    }
```

Generated with discovered.json: 0xecfa6704afe8b88bb9acdd817fe09ff6bc20fedb

# Diff at Thu, 19 Nov 2026 15:06:40 GMT:

- id: 331e51da
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@effc7b76c6801cd4c9ec2c53189bf505acfd41b2 block: 1794851290
- current timestamp: 1795100733

## Description

PhylaxMultisig: one member added and the threshold raised from 1 to 2 (now 2 of 3).
StateOracle (production): one account added to the registration allowlist, assertions replaced or added on two adopters, and one adopter's manager moved to a new 1-of-3 Safe.
AdminVerifierWhitelist (production): four Lighter contracts (Lighter, ZkLighterVerifier, Governance, UpgradeGatekeeper) assigned to that account for manager registration.

## Watched changes

```diff
    contract StateOracle (eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D) [phylax/StateOracle] {
    +++ description: Registry of assertions, rules that enforcers run offchain, per protected contract (adopter). Each adopter has a manager, approved by a registered admin verifier, who adds and removes its assertions. Changes take effect 75 blocks later, and a new assertion needs a proof that a registered DA verifier accepts.
      values.adopterManagers.eth:0x20053Eca14839d40FaE113034501e9FE1477dc66:
-        "eth:0x1C668430ecAe8Bd24a239684c3b5372B4e65b374"
+        "eth:0x3A24d388d214514800eDCD34571516848e088285"
      values.assertions.eth:0x18554EEE2c4598905eDab1C6525d11EB085B34Dc.0:
-        "0x5cff8c00339ab7ea0d8eddee1b288d26673bf0c2dcecd268abd4db1594c5116b"
+        "0x5c052863a39f6926be64ad81a7004c1d7965e1b30886c1e76079818f061f14a6"
      values.assertions.eth:0x20053Eca14839d40FaE113034501e9FE1477dc66.0:
+        "0x309beab5d93b3a9e1c3b13638cc2bf0e707bc49217c04b47c8018e83b43fb860"
      values.assertions.eth:0x20053Eca14839d40FaE113034501e9FE1477dc66.1:
+        "0xf0817bbf150cc02426bef365387c67ba35c8146407db2b42bf7f8c4e233ece01"
      values.assertions.eth:0x20053Eca14839d40FaE113034501e9FE1477dc66.0:
-        "0x34da9f95dcd5079c3c8a3a29c00068fdd47b9087d7533396d3f571eaa655d0ed"
+        "0xfab44d5e3cf33773708f0da795a6ab75c367da8c766a633f2176681acebf22b2"
+++ severity: MEDIUM
      values.registrationAllowlist.3:
+        "eth:0x71092efD4909Fb34e023ec10984F6cB64824E926"
    }
```

```diff
    contract AdminVerifierWhitelist (eth:0x1Ab8D3CDb7eE245abD53859F8D967a4F9a91a130) [phylax/AdminVerifierWhitelist] {
    +++ description: Admin verifier that approves a manager registration only from the account a whitelist admin assigned to that adopter. Whitelist admins can also exclude an adopter, which blocks assignments until the exclusion's releaser lifts it. Assignments are checked only at registration.
+++ description: Account assigned to each adopter.
+++ severity: MEDIUM
      values.assignedManagers.6:
+        {"assertionAdopter":"eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7","admin":"eth:0x71092efD4909Fb34e023ec10984F6cB64824E926"}
+++ description: Account assigned to each adopter.
+++ severity: MEDIUM
      values.assignedManagers.7:
+        {"assertionAdopter":"eth:0xac3Ce44B6ff4E402858C99D5699ff63131572BaA","admin":"eth:0x71092efD4909Fb34e023ec10984F6cB64824E926"}
+++ description: Account assigned to each adopter.
+++ severity: MEDIUM
      values.assignedManagers.8:
+        {"assertionAdopter":"eth:0xa464DA0B43f80EE3FfC4795cbbFC78472b5c81A1","admin":"eth:0x71092efD4909Fb34e023ec10984F6cB64824E926"}
+++ description: Account assigned to each adopter.
+++ severity: MEDIUM
      values.assignedManagers.9:
+        {"assertionAdopter":"eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67","admin":"eth:0x71092efD4909Fb34e023ec10984F6cB64824E926"}
    }
```

```diff
    EOA (eth:0x1C668430ecAe8Bd24a239684c3b5372B4e65b374) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"add or remove the assertions of the adopters it manages and transfer that role.","role":".adopterManagers","via":[{"address":"eth:0x3A24d388d214514800eDCD34571516848e088285"}]}
    }
```

```diff
    EOA (eth:0x2913e84C4a9065daB453C6746B61FD5f99ACe221) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"add or remove accounts on the registration allowlist.","role":".operators","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"add or remove admin and DA verifiers, toggle the registration allowlist and set the maximum number of assertions per adopter.","role":".governance","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]}
      receivedPermissions.2:
-        {"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"grant or revoke the governance, guardian admin and operator admin roles, and transfer ownership.","role":".owner","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]}
      receivedPermissions.3:
-        {"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"grant or revoke the guardian role.","role":".guardianAdmins","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]}
      receivedPermissions.4:
-        {"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"grant or revoke the operator role.","role":".operatorAdmins","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]}
      receivedPermissions.5:
-        {"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"remove any adopter's assertions and revoke any adopter's manager.","role":".guardians","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]}
      receivedPermissions.6:
-        {"permission":"interact","from":"eth:0x1Ab8D3CDb7eE245abD53859F8D967a4F9a91a130","description":"assign the account that may register as each adopter's manager, and exclude adopters.","role":".whitelistAdmins","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]}
      receivedPermissions.7:
-        {"permission":"interact","from":"eth:0x1Ab8D3CDb7eE245abD53859F8D967a4F9a91a130","description":"grant or revoke the admin and whitelist admin roles.","role":".defaultAdmin","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]}
      receivedPermissions.17:
-        {"permission":"interact","from":"eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70","delay":259200,"description":"add or remove builders and change the timelock delay.","role":".defaultAdmin","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]}
      receivedPermissions.18:
-        {"permission":"interact","from":"eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70","description":"cancel scheduled builder and delay changes.","role":".guardians","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]}
      receivedPermissions.19:
-        {"permission":"interact","from":"eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70","description":"grant or revoke the admin and guardian roles.","role":".defaultAdmin","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]}
      receivedPermissions.28:
-        {"permission":"upgrade","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","role":"admin","via":[{"address":"eth:0x003C71246D92fae09ae3F3CAeFF234c8B8242F2E"},{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]}
    }
```

```diff
    EOA (eth:0x9EAAe186f9A0314b7Db856509277F030894C1Dcc) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"add or remove the assertions of the adopters it manages and transfer that role.","role":".adopterManagers","via":[{"address":"eth:0x3A24d388d214514800eDCD34571516848e088285"}]}
    }
```

```diff
    contract PhylaxMultisig (eth:0xa4556B53286206A9B50e65700C4372c9Be62b934) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0x78471170bE963A8e503AB2ee00826C9385034064"
      values.$threshold:
-        1
+        2
      values.multisigThreshold:
-        "1 of 2 (50%)"
+        "2 of 3 (67%)"
      directlyReceivedPermissions.1:
-        {"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"add or remove accounts on the registration allowlist.","role":".operators"}
      directlyReceivedPermissions.2:
-        {"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"add or remove admin and DA verifiers, toggle the registration allowlist and set the maximum number of assertions per adopter.","role":".governance"}
      directlyReceivedPermissions.3:
-        {"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"grant or revoke the governance, guardian admin and operator admin roles, and transfer ownership.","role":".owner"}
      directlyReceivedPermissions.4:
-        {"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"grant or revoke the guardian role.","role":".guardianAdmins"}
      directlyReceivedPermissions.5:
-        {"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"grant or revoke the operator role.","role":".operatorAdmins"}
      directlyReceivedPermissions.6:
-        {"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"remove any adopter's assertions and revoke any adopter's manager.","role":".guardians"}
      directlyReceivedPermissions.7:
-        {"permission":"interact","from":"eth:0x1Ab8D3CDb7eE245abD53859F8D967a4F9a91a130","description":"assign the account that may register as each adopter's manager, and exclude adopters.","role":".whitelistAdmins"}
      directlyReceivedPermissions.8:
-        {"permission":"interact","from":"eth:0x1Ab8D3CDb7eE245abD53859F8D967a4F9a91a130","description":"grant or revoke the admin and whitelist admin roles.","role":".defaultAdmin"}
      directlyReceivedPermissions.9:
-        {"permission":"interact","from":"eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70","delay":259200,"description":"add or remove builders and change the timelock delay.","role":".defaultAdmin"}
      directlyReceivedPermissions.10:
-        {"permission":"interact","from":"eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70","description":"cancel scheduled builder and delay changes.","role":".guardians"}
      directlyReceivedPermissions.11:
-        {"permission":"interact","from":"eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70","description":"grant or revoke the admin and guardian roles.","role":".defaultAdmin"}
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"add or remove accounts on the registration allowlist.","role":".operators"},{"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"add or remove admin and DA verifiers, toggle the registration allowlist and set the maximum number of assertions per adopter.","role":".governance"},{"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"grant or revoke the governance, guardian admin and operator admin roles, and transfer ownership.","role":".owner"},{"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"grant or revoke the guardian role.","role":".guardianAdmins"},{"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"grant or revoke the operator role.","role":".operatorAdmins"},{"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"remove any adopter's assertions and revoke any adopter's manager.","role":".guardians"},{"permission":"interact","from":"eth:0x1Ab8D3CDb7eE245abD53859F8D967a4F9a91a130","description":"assign the account that may register as each adopter's manager, and exclude adopters.","role":".whitelistAdmins"},{"permission":"interact","from":"eth:0x1Ab8D3CDb7eE245abD53859F8D967a4F9a91a130","description":"grant or revoke the admin and whitelist admin roles.","role":".defaultAdmin"},{"permission":"interact","from":"eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70","delay":259200,"description":"add or remove builders and change the timelock delay.","role":".defaultAdmin"},{"permission":"interact","from":"eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70","description":"cancel scheduled builder and delay changes.","role":".guardians"},{"permission":"interact","from":"eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70","description":"grant or revoke the admin and guardian roles.","role":".defaultAdmin"},{"permission":"upgrade","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","role":"admin","via":[{"address":"eth:0x003C71246D92fae09ae3F3CAeFF234c8B8242F2E"}]}]
    }
```

```diff
    EOA (eth:0xD4f639806483B68BddF1a338C9d4Fa188e01241c) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"add or remove accounts on the registration allowlist.","role":".operators","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]},{"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"add or remove admin and DA verifiers, toggle the registration allowlist and set the maximum number of assertions per adopter.","role":".governance","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]},{"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"grant or revoke the governance, guardian admin and operator admin roles, and transfer ownership.","role":".owner","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]},{"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"grant or revoke the guardian role.","role":".guardianAdmins","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]},{"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"grant or revoke the operator role.","role":".operatorAdmins","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]},{"permission":"interact","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","description":"remove any adopter's assertions and revoke any adopter's manager.","role":".guardians","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]},{"permission":"interact","from":"eth:0x1Ab8D3CDb7eE245abD53859F8D967a4F9a91a130","description":"assign the account that may register as each adopter's manager, and exclude adopters.","role":".whitelistAdmins","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]},{"permission":"interact","from":"eth:0x1Ab8D3CDb7eE245abD53859F8D967a4F9a91a130","description":"grant or revoke the admin and whitelist admin roles.","role":".defaultAdmin","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]},{"permission":"interact","from":"eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70","delay":259200,"description":"add or remove builders and change the timelock delay.","role":".defaultAdmin","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]},{"permission":"interact","from":"eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70","description":"cancel scheduled builder and delay changes.","role":".guardians","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]},{"permission":"interact","from":"eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70","description":"grant or revoke the admin and guardian roles.","role":".defaultAdmin","via":[{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]},{"permission":"upgrade","from":"eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D","role":"admin","via":[{"address":"eth:0x003C71246D92fae09ae3F3CAeFF234c8B8242F2E"},{"address":"eth:0xa4556B53286206A9B50e65700C4372c9Be62b934"}]}]
      eoaWithUpgradePermissions:
-        true
    }
```

```diff
+   Status: CREATED
    contract Safe (eth:0x3A24d388d214514800eDCD34571516848e088285) [GnosisSafe]
    +++ description: None
```

## Source code changes

```diff
.../src/projects/phylax/.flat/Safe/Safe.sol        | 1797 ++++++++++++++++++++
 .../src/projects/phylax/.flat/Safe/SafeProxy.p.sol |   28 +
 2 files changed, 1825 insertions(+)
```

Generated with discovered.json: 0xe3dc1ed9e5cb67029fe7fc0bf827357c2663a347

# Diff at Mon, 16 Nov 2026 22:13:11 GMT:

- id: 3bb72159
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1794851290

## Description

Initial discovery of the Phylax Credible Layer: the CredibleRegistry and three StateOracles with their admins and verifiers.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x003C71246D92fae09ae3F3CAeFF234c8B8242F2E) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract DAVerifierECDSA (eth:0x12b2E5606688b0B111D7eb961b24A5BC032B4C0f) [phylax/DAVerifierECDSA]
    +++ description: DA verifier that accepts an assertion only if its proof is DA_PROVER's signature of the assertion ID. The assertion's code is not required onchain.
```

```diff
+   Status: CREATED
    contract StateOracle (eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D) [phylax/StateOracle]
    +++ description: Registry of assertions, rules that enforcers run offchain, per protected contract (adopter). Each adopter has a manager, approved by a registered admin verifier, who adds and removes its assertions. Changes take effect 75 blocks later, and a new assertion needs a proof that a registered DA verifier accepts.
```

```diff
+   Status: CREATED
    contract AdminVerifierWhitelist (eth:0x1Ab8D3CDb7eE245abD53859F8D967a4F9a91a130) [phylax/AdminVerifierWhitelist]
    +++ description: Admin verifier that approves a manager registration only from the account a whitelist admin assigned to that adopter. Whitelist admins can also exclude an adopter, which blocks assignments until the exclusion's releaser lifts it. Assignments are checked only at registration.
```

```diff
+   Status: CREATED
    contract AdminVerifierWhitelist (eth:0x25642997751A2F1bbA234a3B1c2100bD0aB9a73E) [phylax/AdminVerifierWhitelist_ownable]
    +++ description: Admin verifier that approves a manager registration only from the account the owner assigned to that adopter. The owner can also exclude an adopter, which blocks assignments until the exclusion's releaser lifts it. Assignments are checked only at registration.
```

```diff
+   Status: CREATED
    contract AdminVerifierWhitelist (eth:0x3107dbCe36e98FE30539DE78bd0899bDCd9Ca291) [phylax/AdminVerifierWhitelist_ownable]
    +++ description: Admin verifier that approves a manager registration only from the account the owner assigned to that adopter. The owner can also exclude an adopter, which blocks assignments until the exclusion's releaser lifts it. Assignments are checked only at registration.
```

```diff
+   Status: CREATED
    contract DAVerifierOnChain (eth:0x5d8070789035f77624153CbF7d4cdCecfd520c5A) [phylax/DAVerifierOnChain]
    +++ description: DA verifier that accepts an assertion only if its proof hashes (keccak256) to the assertion ID, so the assertion's bytes are published onchain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x69Fb398BdF54C8313C4C0fd6087128d6E8527bbA) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AdminVerifierOwner (eth:0x6d67e393eFc3E48e522Fa5829438fe799C5DB7be) [phylax/AdminVerifierOwner]
    +++ description: Admin verifier that approves only the account returned by the adopter's owner() as its manager.
```

```diff
+   Status: CREATED
    contract AdminVerifierAlwaysApprove (eth:0x6e6EE23D01E5B1dA7054923286681AA432EB7892) [N/A]
    +++ description: Admin verifier that approves every request, so any account allowed to register can claim any adopter without a manager.
```

```diff
+   Status: CREATED
    EOA (eth:0x711f5a08857ae2a1eb6bF1BFDDe962188a65EE50)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AdminVerifierAlwaysApprove (eth:0x90792771aeA614983f1AD851De764276D0D9D279) [N/A]
    +++ description: Admin verifier that approves every request, so any account allowed to register can claim any adopter without a manager.
```

```diff
+   Status: CREATED
    contract TimelockController (eth:0x9F66A1A08a3f9f9De7a95DfBAD572970bF1D9757) [global/TimelockController]
    +++ description: A timelock with access control. The current minimum delay is 3d.
```

```diff
+   Status: CREATED
    contract PhylaxMultisig (eth:0xa4556B53286206A9B50e65700C4372c9Be62b934) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateOracle (eth:0xB5E1b58638E05a69c853dEf16837D651B7EEeAA2) [phylax/StateOracle_singleDAVerifier]
    +++ description: Registry of assertions, rules that enforcers run offchain, per protected contract (adopter). Each adopter has a manager, approved by a registered admin verifier, who adds and removes its assertions. Changes take effect 10 blocks later, a new assertion needs a proof that DA_VERIFIER accepts, and a removed assertion cannot be added again.
```

```diff
+   Status: CREATED
    contract CredibleRegistry (eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70) [phylax/CredibleRegistry]
    +++ description: Records the last block a whitelisted builder marked as credible. isCredibleBlock() returns true from the marker to the end of that block and in calls with a zero gas price. Changes to the builder set and to the delay are timelocked for at least 3d.
```

```diff
+   Status: CREATED
    contract StateOracle (eth:0xbFBc833F12E973bd4A2cc46AAE959aD1B9531262) [phylax/StateOracle_singleDAVerifier]
    +++ description: Registry of assertions, rules that enforcers run offchain, per protected contract (adopter). Each adopter has a manager, approved by a registered admin verifier, who adds and removes its assertions. Changes take effect 10 blocks later, a new assertion needs a proof that DA_VERIFIER accepts, and a removed assertion cannot be added again.
```

```diff
+   Status: CREATED
    contract AdminVerifierOwner (eth:0xCb2e47Abe9b093462aa0e7FA3221fc3Fc90C4dFb) [phylax/AdminVerifierOwner]
    +++ description: Admin verifier that approves only the account returned by the adopter's owner() as its manager.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xD808cF91d30A99DCB8f6D8c3563475628863bdEE) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AdminVerifierSuperAdmin (eth:0xd9eaa6063cE1D8b6A20648dF961cA89D5F19c517) [phylax/AdminVerifierSuperAdmin]
    +++ description: Admin verifier that approves only SUPER_ADMIN_ROLE holders, each of whom can become the manager of any adopter without one.
```

```diff
+   Status: CREATED
    contract DAVerifierECDSA (eth:0xeedd9c29D597B378108483Bd46eaDC65044713f1) [phylax/DAVerifierECDSA]
    +++ description: DA verifier that accepts an assertion only if its proof is DA_PROVER's signature of the assertion ID. The assertion's code is not required onchain.
```

```diff
+   Status: CREATED
    EOA (eth:0xF31b02F47596AcC7328E9fb04aFc52Fe91Da6071)
    +++ description: None
```
