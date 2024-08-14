Generated with discovered.json: 0xf60327b26a1b02b58bfd289f249ed0d4831ec61f

# Diff at Wed, 14 Aug 2024 08:16:16 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e32dcc268a9af9f45ad205490c9d650c487e04f1 block: 20512726
- current block number: 20525613

## Description

All roles have been revoked from the EOA and a multisig (2/3) has been granted those roles.
A pending owner is added to TransactionFiltererDenyList, which is just a step in their ownership transfer process, it will become the actual owner once the entire process is completed.

## Watched changes

```diff
    contract CronosZkEVMAdmin (0x66eF951aEC26987915582340bCAA569E5Be67cDC) {
    +++ description: None
      values.accessControl.ADMIN.members.1:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.ADMIN.members.0:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.ORACLE.members.1:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.ORACLE.members.0:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.UPGRADER.members.1:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.UPGRADER.members.0:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.FEE_ADMIN.members.1:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.FEE_ADMIN.members.0:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
    }
```

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
    }
```

```diff
+   Status: CREATED
    contract AdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DenyListOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/AdminMultisig/GnosisSafe.sol    | 952 +++++++++++++++++++++
 .../.flat/AdminMultisig/GnosisSafeProxy.p.sol      |  34 +
 .../.flat/DenyListOwnerMultisig/GnosisSafe.sol     | 952 +++++++++++++++++++++
 .../DenyListOwnerMultisig/GnosisSafeProxy.p.sol    |  34 +
 4 files changed, 1972 insertions(+)
```

Generated with discovered.json: 0xce3cf2924b53d3ff2bfa12c6d3eacfed4b824720

# Diff at Mon, 12 Aug 2024 13:07:34 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@bafa261ae877bba9966845f4d250f5cbb9d4f6d2 block: 20482316
- current block number: 20512726

## Description

A second EOA is given multiple roles, now there are two EOAs with those.

## Watched changes

```diff
    contract CronosZkEVMAdmin (0x66eF951aEC26987915582340bCAA569E5Be67cDC) {
    +++ description: None
      values.accessControl.ADMIN.members.1:
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.ORACLE.members.1:
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.UPGRADER.members.1:
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.FEE_ADMIN.members.1:
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
    }
```

Generated with discovered.json: 0x5a8ff11be549135c8b8b49f5bff96cb47ab97132

# Diff at Thu, 08 Aug 2024 07:17:33 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@5a17db968badca34a66703637dabf76a313bb43e block: 20469638
- current block number: 20482316

## Description

Updated base token gas multiplier.

## Watched changes

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.baseTokenGasPriceMultiplierNominator:
-        40000
+        25000
    }
```

Generated with discovered.json: 0x682e63ce64e58a5524b7f506518c01daf6f57142

# Diff at Thu, 01 Aug 2024 08:25:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@295430f331b68784c13ccda9222bc78df1e833c5 block: 20425837
- current block number: 20432488

## Description

Cronoszkevm is still on block 1 (verified).
Local Admin role (see ZKsync Era diagrams) is changed from an EOA to a contract `CronosZkEVMAdmin` which allows for splitting of the Admin's permissions via accessControl. Currently all roles are given to the `0x143524d0ac8D7f35a2133b6B0a7567e0E3393137` EOA.

## Watched changes

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.getAdmin:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0x66eF951aEC26987915582340bCAA569E5Be67cDC"
      values.getL2SystemContractsUpgradeBatchNumber:
-        1
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        1
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0xd05d194051ec55ccc2207d19499a7959c87327586d85b0914684b0f3319cbeff"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

```diff
+   Status: CREATED
    contract CronosZkEVMAdmin (0x66eF951aEC26987915582340bCAA569E5Be67cDC)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/CronosZkEVMAdmin.sol            | 2352 ++++++++++++++++++++
 1 file changed, 2352 insertions(+)
```

Generated with discovered.json: 0x7e266a80639b119ebd450a36cc47e5254bba527a

# Diff at Wed, 31 Jul 2024 10:08:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20425837

## Description

Initial discovery:
ZK stack chain in ValidiumMode (`getPubdataPricingMode : 1`) sharing the STM, ValidatorTimelock, Verifier and all diamond facet implementations with ZKsync Era.
DiamondProxy not yet verified which is not really a problem for our discovery?. Admin EOA so far (for the non-shared parts). BaseToken is zkCRO.

## Initial discovery

```diff
+   Status: CREATED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139)
    +++ description: None
```
