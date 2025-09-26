Generated with discovered.json: 0x40e634f70d11e01ba3ff24c83f364c9c1170149c

# Diff at Tue, 23 Sep 2025 12:36:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1758630948

## Description

create new shared disco that contains only the sp1 verifiers, to be referenced by projects that do not share the sp1gateway and by the shared-sp1-gateway disco itself.

## Initial discovery

```diff
+   Status: CREATED
    contract SP1Verifier (arb1:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract SP1Verifier (base:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```
