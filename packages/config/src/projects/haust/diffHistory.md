Generated with discovered.json: 0x4ec0935c737a5503e138aa7bf50f60aa12130e98

# Diff at Tue, 09 Dec 2025 11:33:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ed25b2aa28d6ab9faa5f06bc943948919be9627d block: 1762959021
- current timestamp: 1762959021

## Description

config: add aggchain_type description and severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1762959021 (main branch discovery), not current.

```diff
    contract AggchainECDSAMultisig (eth:0xaD83Cd3e5A725546daDC5A25088c5c098d320Ca8) {
    +++ description: System contract defining the Haust Network Aggchain logic. It only enforces bridge accounting (pessimistic) proofs to protect the shared bridge while the Aggchain state transitions are not proven. They must instead be signed by 1 aggchainSigner(s).
      fieldMeta.AGGCHAIN_TYPE:
+        {"severity":"HIGH","description":"0: ECDSA sig verification, 1: limited to vkeys in AggchainGateway with 1 as second byte"}
    }
```

Generated with discovered.json: 0x0556b0b9d8cb590f2e6df287705e2952da9e817c

# Diff at Wed, 12 Nov 2025 14:51:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1762959021

## Description

initital disco of a no-proof others agglayer chain.

## Initial discovery

```diff
+   Status: CREATED
    reference AgglayerGateway (eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3)
    +++ description: None
```

```diff
+   Status: CREATED
    reference AgglayerBridge (eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
+   Status: CREATED
    reference AgglayerManager (eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    reference AgglayerGER (eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AggchainECDSAMultisig (eth:0xaD83Cd3e5A725546daDC5A25088c5c098d320Ca8)
    +++ description: System contract defining the Haust Network Aggchain logic. It only enforces bridge accounting (pessimistic) proofs to protect the shared bridge while the Aggchain state transitions are not proven. They must instead be signed by 1 aggchainSigner(s).
```
