Generated with discovered.json: 0xcb552d8d582b465328f670a0a689651254f98daf

# Diff at Tue, 08 Apr 2025 08:48:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22223061

## Description

Initial discovery of a standard ZK stack validium.

## Initial discovery

```diff
+   Status: CREATED
    contract zkCandyZkEvmAdmin (0x309EfA797ec5cd324Cb473F141F95214F3a25ab2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock2 (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x8c0Bfc04AdA21fd496c55B8C50331f904306F564)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
```

```diff
+   Status: CREATED
    contract zkCandy Multisig (0x8eb156588D2FAD21dE0066BAA5BfDcd940695196)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidiumL1DAValidator (0x907b30407249949521Bf0c89A43558dae200146A)
    +++ description: Contract that 'verifies' the data availability for validiums. This implementation only checks the correct formatting and does not serve as a DA oracle. Can be used by ZK stack validiums as the L1 part of a DAValidator pair.
```

```diff
+   Status: CREATED
    contract Verifier (0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5)
    +++ description: Implements the ZK proof verification logic.
```

```diff
+   Status: CREATED
    contract zkCandyZkEvm (0xF2704433d11842d15aa76BBF0E00407267a99C92)
    +++ description: The main contract defining the Layer 2. Operator actions like commiting blocks, providing ZK proofs and executing batches ultimately target this contract which then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
```
