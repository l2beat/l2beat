Generated with discovered.json: 0xd4b65b886f7b4a18d3904e11877af7861e4f808d

# Diff at Mon, 16 Nov 2026 13:24:39 GMT:

- id: 654894a6
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1794834166

## Description

Initial discovery of EAS v0.26 on Ethereum: the EAS contract and its SchemaRegistry, both immutable and without an owner.

## Initial discovery

```diff
+   Status: CREATED
    contract EAS (eth:0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587) [eas/EAS]
    +++ description: Records attestations: statements an attester makes under a registered schema, optionally about a recipient address. Each one is stored under a unique id, and only its attester can revoke it. Calls the schema's resolver, if it has one, on every attestation and revocation and forwards the ETH assigned to it. Also timestamps arbitrary 32-byte values. Immutable, with no owner.
```

```diff
+   Status: CREATED
    contract SchemaRegistry (eth:0xA7b39296258348C78294F95B872b282326A97BDF) [eas/SchemaRegistry]
    +++ description: Registers schemas for EAS. A schema is a field layout, an optional resolver contract and a flag for whether its attestations can be revoked. Its id is the hash of the three, so a registered schema never changes. Anyone can register one. Immutable, with no owner.
```
