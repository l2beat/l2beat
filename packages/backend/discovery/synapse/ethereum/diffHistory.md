Generated with discovered.json: 0xea83efda488692ae9def96c628aa57b676734899

# Diff at Thu, 28 Mar 2024 11:26:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19467277
- current block number: 19532299

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19467277 (main branch discovery), not current.

```diff
    contract Bridge Multisig (0x67F60b0891EBD842Ebe55E4CCcA1098d7Aac1A55) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x318ed27da4a4ee3c26b9a1b4767fea204abb68fe

# Diff at Tue, 19 Mar 2024 07:21:48 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@87a9df6317bf41ef2d063033dfc77d54521b9991 block: 17620009
- current block number: 19467277

## Description

New EOA is given the GOVERNANCE_ROLE in the bridge contract.
Roles: GOVERNANCE_ROLE can set fees, pause and unpause; NODEGROUP_ROLE can call bridging funtions; ADMIN_ROLE can setWethAddress()

## Watched changes

```diff
    contract SynapseBridge (0x2796317b0fF8538F253012862c06787Adfb8cEb6) {
    +++ description: accessControl roles described in meta.json
      values.accessControl.GOVERNANCE_ROLE.members.1:
+        "0xa31C04BFD3545E6d00A80573a0B009F7557D958D"
    }
```

Generated with discovered.json: 0x6432e46d2098f11efc4f4531cca556844f364128
