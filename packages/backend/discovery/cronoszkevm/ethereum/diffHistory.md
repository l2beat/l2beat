Generated with discovered.json: 0x2e34a5c12281976ef6fbd69bdfc913280958f319

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
