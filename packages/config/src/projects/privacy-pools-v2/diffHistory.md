Generated with discovered.json: 0xd119262af5edd7f27ac08f914e87766fd17d8e57

# Diff at Wed, 21 Oct 2026 10:15:09 GMT:

- id: 75f84d35
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1792559137

## Description

Initial discovery of Privacy Pools v2 on Ethereum: Entrypoint, PoolVault, Keystore, ASPRegistry, AccessRouter, PrivacyPoolRelay, RelaySwaps, the yield routers, shares and zaps, and the 27 Groth16 verifiers.

## Initial discovery

```diff
+   Status: CREATED
    contract PrivacyPoolRelay (eth:0x01a8Fa4dbb60187aD8d3c3d08E7Fb8C14198A461) [privacy-pools-v2/PrivacyPoolRelay]
    +++ description: Withdrawal processor that submits the transact proof and pays the recipient and the relayer's fee, capped per asset.
```

```diff
+   Status: CREATED
    contract Transact4x5Verifier (eth:0x01b4954E3b3C1F68785f60D7465c38C31266bfab) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact1x2Verifier (eth:0x0e13d94235d8a0d8f9fC3B63BB41D666eF0677Ed) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract PoolVault (eth:0x0Eb42804BF897662aF851370eaeAdcDBEC1b97ed) [privacy-pools-v2/PoolVault]
    +++ description: Holds every pool asset and the state tree of note commitments and spent nullifiers.
```

```diff
+   Status: CREATED
    EOA (eth:0x12Dbd6335d7f529F8922420Ba9c15c9E7A324c92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PPRouterUSDT (eth:0x13a0b86bac3e0C29bd64fED7BCD2EE84f371f41C) [privacy-pools-v2/PPRouter]
    +++ description: Yield router for one share token. It wraps deposits of the underlying into shares, and unwraps withdrawn shares to pay the recipient and the relayer fee.
```

```diff
+   Status: CREATED
    contract Transact5x3Verifier (eth:0x20D4B794A2A1ae7A34AF184172dd931d3ff2Fa32) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact1x1Verifier (eth:0x21347145497569b34efAB7d73952208866520042) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract ASPRegistry (eth:0x259C0BEa1d783c202509BD3b2688d23b8AEf58B0) [privacy-pools-v2/ASPRegistry]
    +++ description: Publishes the association set provider's approved-label roots with their IPFS CIDs, and receives the data that ties each deposit to its label, encrypted to the ASP.
```

```diff
+   Status: CREATED
    contract Transact2x1Verifier (eth:0x338625F2199675D2aC4Fbf7A89567864ac990710) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract PPYieldTokenZapETH (eth:0x33c1eEf370bBb447414156CFc4fDABD434776EAf) [privacy-pools-v2/PPYieldTokenZap]
    +++ description: Converts between a share token and its underlying in one call, through Aave v3.
```

```diff
+   Status: CREATED
    contract Transact1x4Verifier (eth:0x3ee4A00e0ba1AC0Ef8aD3e4b541CA42FBB4592c3) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract AccessRouter (eth:0x40a6bC296D87f71Ab31Ca3Bfb50513441fBD5160) [privacy-pools-v2/AccessRouter]
    +++ description: Role registry the Privacy Pools v2 core contracts check. No role has a delay.
```

```diff
+   Status: CREATED
    contract Transact4x2Verifier (eth:0x454F1Da26DD4c7c89a849019BeC4c7C7C404d3A4) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact4x4Verifier (eth:0x4Cb752CEF56a5095321Ed72699cD7A699D48F4b5) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact3x1Verifier (eth:0x579f6734d35937b8432BA8FfC17C3120eb657c82) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract RagequitVerifier (eth:0x5a06582115953E2cAbeD8e6A0EeAE35BA430118f) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact5x1Verifier (eth:0x61573Cf3c3A20C9739b68B8e742Ca51971387Cb5) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact2x5Verifier (eth:0x62Cf8963300F284016daE0cD19f5D9BC60846a46) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract ppETH (eth:0x66051920D25af4E3596A8a46309F4D045F9D83B7) [privacy-pools-v2/PPYieldToken]
    +++ description: ERC-4626 share token over an Aave v3 aToken, the asset the pool holds for a yield deposit. The admin's fee applies to the yield only.
```

```diff
+   Status: CREATED
    contract Keystore (eth:0x6E463391c79b7e1A88eF26E0B023f9A6C9938a71) [privacy-pools-v2/Keystore]
    +++ description: Account registry of Privacy Pools v2: one leaf per account with its nullifying key hash and auth policy, plus an optional X25519 viewing public key.
```

```diff
+   Status: CREATED
    contract Transact5x4Verifier (eth:0x766c2F31483935CD55355fcE00fc5eDB82A15acC) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact3x2Verifier (eth:0x76D574559765fd4b90903fFa682964Ae7e7e878a) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract PPRouterETH (eth:0x77613D670BB9fD48A9898D0eac8ebf21B566F960) [privacy-pools-v2/PPRouter]
    +++ description: Yield router for one share token. It wraps deposits of the underlying into shares, and unwraps withdrawn shares to pay the recipient and the relayer fee.
```

```diff
+   Status: CREATED
    contract Transact5x5Verifier (eth:0x7BeE2554970A749D7671424DFa3fAbE15d7e4BD8) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact5x2Verifier (eth:0x8ABfb288dAc87392EaFdD59F6809825fcA0e8b85) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact4x1Verifier (eth:0x909ECAF2A4959726a2BC3d82Fc837B8D3F1c61d3) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact4x3Verifier (eth:0x95dEC97ac78E8C0FfDc6315FDc0A0791238b93A3) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract PPYieldTokenZapUSDC (eth:0x9Ea986BcDF6784D85B518b15bEEE1E65b585817B) [privacy-pools-v2/PPYieldTokenZap]
    +++ description: Converts between a share token and its underlying in one call, through Aave v3.
```

```diff
+   Status: CREATED
    contract ppUSDT (eth:0xA4cF419558Ef36CC6FfB666195684dC963910426) [privacy-pools-v2/PPYieldToken]
    +++ description: ERC-4626 share token over an Aave v3 aToken, the asset the pool holds for a yield deposit. The admin's fee applies to the yield only.
```

```diff
+   Status: CREATED
    contract Transact2x2Verifier (eth:0xAc716f21626994c4264eA457Fe208071050611B5) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact3x3Verifier (eth:0xAeCDf3E27A602f23cEc2E5CE250093b3E806D041) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact2x3Verifier (eth:0xB8aa00333b8D6958da72A15D59179BbDD1e49064) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract ppUSDC (eth:0xC246aFb23482fF9596E9cee5f1f678eFe0EB1ad6) [privacy-pools-v2/PPYieldToken]
    +++ description: ERC-4626 share token over an Aave v3 aToken, the asset the pool holds for a yield deposit. The admin's fee applies to the yield only.
```

```diff
+   Status: CREATED
    contract Transact1x3Verifier (eth:0xC5E1D9D9CF12E796Ec8E072646c6BF29A1e55382) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Entrypoint (eth:0xca1e072236D231130059eeA6Bfceb7F4e9a1F0C3) [privacy-pools-v2/Entrypoint]
    +++ description: Deposit gate of Privacy Pools v2. It checks each deposit against its asset's configuration and keeps the vetting fee.
```

```diff
+   Status: CREATED
    contract RelaySwaps (eth:0xd0395c08DD8eA7671a7A65bDca8E473e8E8260a8) [N/A]
    +++ description: Withdrawal processor that swaps the withdrawn asset through an approved aggregator router, with the swap calldata bound into the proof. The deployed build does not match the published source.
```

```diff
+   Status: CREATED
    contract PPYieldTokenZapUSDT (eth:0xDC3D922df81FC7B7f58229431ED91acB0482f3A5) [privacy-pools-v2/PPYieldTokenZap]
    +++ description: Converts between a share token and its underlying in one call, through Aave v3.
```

```diff
+   Status: CREATED
    contract Transact3x4Verifier (eth:0xe0aec1eE10eBfCDcB09b6e5a7ea6Ae34D066219d) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract PPRouterUSDC (eth:0xe76E793d776c1e207aD7a7fa7C57d27420d85110) [privacy-pools-v2/PPRouter]
    +++ description: Yield router for one share token. It wraps deposits of the underlying into shares, and unwraps withdrawn shares to pay the recipient and the relayer fee.
```

```diff
+   Status: CREATED
    contract DepositVerifier (eth:0xEe96Ca04d2Ab2eC9A8803eb78F39b2875dFF6fdf) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact2x4Verifier (eth:0xF1C6c55B70EC3Df923f5E9bcd64aee5c3073C42c) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact1x5Verifier (eth:0xfa0138C5dE45E520AbA349BE38a827DAb470f70A) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```

```diff
+   Status: CREATED
    contract Transact3x5Verifier (eth:0xFdF4EbC7645E1F4c04aE33285b6e3f78e4A3a275) [privacy-pools-v2/Groth16Verifier]
    +++ description: Groth16 verifier for one Privacy Pools v2 circuit, with that circuit's trusted-setup verification key hard-coded.
```
