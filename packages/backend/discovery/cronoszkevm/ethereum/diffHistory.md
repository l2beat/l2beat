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
