Generated with discovered.json: 0x8fb30e87ed98dc149cc60dec9af5ff2b9c6f77e5

# Diff at Tue, 14 Jul 2026 17:23:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@24b66dabda72dfc1e4f6b250e25cdeaadeda1854 block: 1782304372
- current timestamp: 1784036439

## Description

Document the complete Starknet SHARP trust chain. This entry combines the latest live discovery delta with the configuration and verification metadata changes.

## Watched changes

```diff
    contract SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) [shared-sharp-verifier/SHARPVerifierCallProxy] {
    +++ description: Upgradeable call router through which Starknet and other applications access SHARP fact registries. It uses `call`, not `delegatecall`, so facts and immutable verifier configuration remain at each target registry. The explicit `isValid` entry point always queries the default target. Other calls handled by the fallback, principally proof submissions, can be routed per caller to a still-active registry in the default target's reference chain. The default target can be replaced by eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 after 8d.
      values.$pastUpgrades.14:
+        ["2026-07-12T11:53:47.000Z","0x7f1e6f9a7268ea6ce5b3b2ce055c3ce420ee776c63c41f57823a0e9cb782e254",["eth:0x3597c5CBCbCB30079a0bD2A68cDE5f98272f9feb"]]
      values.$upgradeCount:
-        14
+        15
+++ description: Default SHARP fact registry called by the proxy and the only registry queried directly by its explicit `isValid` entry point. Replacing it changes the complete proof-verification trust chain: outer bootloader, bootloader commitments, recursive verifier allowlist, Solidity CPU verifiers, and temporary reference registries.
+++ severity: HIGH
      values.callProxyImplementation:
-        "eth:0xE67515a751291445B85b2F176c1eCdf08e86b406"
+        "eth:0x4956bda1d23F75B988644329c5B06BD1494a72b6"
      values.StarkWareProxy_callImplementation:
-        "eth:0xE67515a751291445B85b2F176c1eCdf08e86b406"
+        "eth:0x4956bda1d23F75B988644329c5B06BD1494a72b6"
    }
```

```diff
+   Status: CREATED
    contract SHARPVerifier (eth:0x4956bda1d23F75B988644329c5B06BD1494a72b6) [shared-sharp-verifier/SHARPVerifier]
    +++ description: Immutable GPS statement verifier shared by Starknet and other StarkWare systems. It verifies a STARK proof of the exact Cairo bootloader stored onchain, forces the bootloader configuration into public memory, and registers a fact for every bootloader task. A fact is also considered valid when it exists in the time-limited reference fact registry.
```

## Source code changes

```diff
.../shared-sharp-verifier/.flat/SHARPVerifier.sol  | 2413 ++++++++++++++++++++
 1 file changed, 2413 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1782304372 (main branch discovery), not current.

```diff
    contract EcdsaPointsXColumn (eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuVerifierAllSolidity_2026_13 (eth:0x015381651F240Ed6C44122dCba6Cf807c9442CD6) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
      name:
-        "CpuFrilessVerifier"
+        "CpuVerifierAllSolidity_2026_13"
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0xE4937AC1Da4211c6E48cf41A7B298b74edA9B103","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2","eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce","eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771"],"eth:0x99480b7c32C4F8965fF1929a368Dd586C6DC3595","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","96","30"]
+        {"auxPolynomials":["eth:0xE4937AC1Da4211c6E48cf41A7B298b74edA9B103","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2","eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce","eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771"],"oodsContract":"eth:0x99480b7c32C4F8965fF1929a368Dd586C6DC3595","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"96","minProofOfWorkBits_":"30"}
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0x032e5cDb729Ce94638ACA9e82A22688109B43046) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PedersenHashPointsXColumn (eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuConstraintPoly (eth:0x05C98569CA566a2035b87dE7d1b623C950798035) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed","eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1","eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"],"eth:0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","80","0"]
+        {"auxPolynomials":["eth:0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed","eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1","eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"],"oodsContract":"eth:0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"80","minProofOfWorkBits_":"0"}
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract CpuOods (eth:0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuVerifierDex_2026_13 (eth:0x0cD0cDf0132c566db61B691BCEEBA2c4D8cA5CdC) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
      name:
-        "CpuFrilessVerifier"
+        "CpuVerifierDex_2026_13"
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0xd8e47340bdC4fB06D37056b1725c653836Cc81E5","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2","eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce","eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771"],"eth:0xaE325CE505AA13EDC30d48187B05c24A3BaC2707","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","96","30"]
+        {"auxPolynomials":["eth:0xd8e47340bdC4fB06D37056b1725c653836Cc81E5","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2","eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce","eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771"],"oodsContract":"eth:0xaE325CE505AA13EDC30d48187B05c24A3BaC2707","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"96","minProofOfWorkBits_":"30"}
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract SHARPVerifier_2025_11 (eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934) [shared-sharp-verifier/SHARPVerifier] {
    +++ description: Immutable GPS statement verifier shared by Starknet and other StarkWare systems. It verifies a STARK proof of the exact Cairo bootloader stored onchain, forces the bootloader configuration into public memory, and registers a fact for every bootloader task. A fact is also considered valid when it exists in the time-limited reference fact registry.
      description:
-        "Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output."
+        "Immutable GPS statement verifier shared by Starknet and other StarkWare systems. It verifies a STARK proof of the exact Cairo bootloader stored onchain, forces the bootloader configuration into public memory, and registers a fact for every bootloader task. A fact is also considered valid when it exists in the time-limited reference fact registry."
+++ description: The three bootloader configuration words forced into the proven program output. In modern versions they are (1) a Pedersen commitment to the ordered list of supported simple-bootloader program hashes, (2) the applicative-bootloader program hash, and (3) a Pedersen commitment to the ordered list of supported recursive Cairo-verifier program hashes. The 2024_10 verifier instead uses a direct Poseidon commitment for word 0. Reproducing a list commitment is insufficient unless its exact ordered preimage and every program behind the listed hashes are also published and reproducible. A malicious allowed program can make invalid nested tasks appear proven.
+++ severity: HIGH
      values.getBootloaderConfig:
-        ["3035974089339935040143966034750116008615662951603253398063766337728525196711","3585039955034622347908243360088523999417661979601115750324841620224559981237","2466486069452806242840925975386070877213363233399077553187556921270027085075"]
+        {"simpleBootloaderConfigurationCommitment":"3035974089339935040143966034750116008615662951603253398063766337728525196711","applicativeBootloaderProgramHash":"3585039955034622347908243360088523999417661979601115750324841620224559981237","supportedCairoVerifierProgramHashesCommitment":"2466486069452806242840925975386070877213363233399077553187556921270027085075"}
      fieldMeta:
+        {"bootloaderProgramContractAddress":{"severity":"HIGH","description":"Contract containing the full compiled Cairo outer bootloader executed by every proof. The Solidity verifier copies this program into the STARK public memory, so its onchain bytecode pins the exact program. A malicious bootloader could register arbitrary application facts even when the underlying application programs were not executed correctly.","type":"CODE_CHANGE"},"memoryPageFactRegistry":{"severity":"HIGH","description":"Registry used by the Solidity STARK verifier for public-memory page facts. If it accepted an invalid page fact, proof verification could use memory that was not committed to correctly.","type":"CODE_CHANGE"},"cpuFrilessVerifiers":{"severity":"HIGH","description":"Immutable Solidity STARK verifiers indexed by the caller-supplied `cairoVerifierId`. Each entry fixes a Cairo CPU layout and its verifier helper contracts. Any entry that accepts an invalid execution proof can register arbitrary SHARP facts.","type":"CODE_CHANGE"},"getBootloaderConfig":{"severity":"HIGH","description":"The three bootloader configuration words forced into the proven program output. In modern versions they are (1) a Pedersen commitment to the ordered list of supported simple-bootloader program hashes, (2) the applicative-bootloader program hash, and (3) a Pedersen commitment to the ordered list of supported recursive Cairo-verifier program hashes. The 2024_10 verifier instead uses a direct Poseidon commitment for word 0. Reproducing a list commitment is insufficient unless its exact ordered preimage and every program behind the listed hashes are also published and reproducible. A malicious allowed program can make invalid nested tasks appear proven.","type":"CODE_CHANGE"},"referenceFactRegistry":{"severity":"HIGH","description":"Previous SHARP fact registry whose facts remain valid until `referralExpirationTime`. Its complete verifier and bootloader trust chain is therefore part of this verifier's active safety assumptions during the referral window.","type":"EXTERNAL"},"referralExpirationTime":{"severity":"HIGH","description":"Unix timestamp after which facts from `referenceFactRegistry` stop being accepted. Before this time, either registry can satisfy a fact lookup.","type":"RISK_PARAMETER"}}
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed","eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1","eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"],"eth:0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","80","0"]
+        {"auxPolynomials":["eth:0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed","eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1","eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"],"oodsContract":"eth:0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"80","minProofOfWorkBits_":"0"}
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract CairoBootloaderProgram_2025_11 (eth:0x192292817680196A0215a50B07d1C5E7Ab8A8636) [shared-sharp-verifier/CairoBootloaderProgram] {
    +++ description: Stores the complete compiled Cairo outer bootloader used as the top-level program of a SHARP proof. The SHARP verifier copies these words into public memory, pinning this exact executable onchain independently of the separately committed simple, applicative, and recursive-verifier programs.
      description:
-        "Bootloader program for the SHARPVerifier."
+        "Stores the complete compiled Cairo outer bootloader used as the top-level program of a SHARP proof. The SHARP verifier copies these words into public memory, pinning this exact executable onchain independently of the separately committed simple, applicative, and recursive-verifier programs."
      fieldMeta:
+        {"getCompiledProgram":{"severity":"HIGH","description":"The full compiled Cairo outer-bootloader instruction array. Source-level reproducibility requires rebuilding this exact array, not merely publishing similar Cairo source.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract PedersenHashPointsYColumn (eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuConstraintPoly (eth:0x1BdE14B50e7dAeD71eE14F7e8defaa3d8A7D4420) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (eth:0x21578B24F86AdF6f59C406f641F693745C31Ea8F) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract SHARP Multisig (eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) [GnosisSafe] {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60","description":"Administer the CallProxy's `GOVERNANCE_ADMIN` and role-admin hierarchy. This AccessControl role is separate from the outer proxy governor that schedules implementation upgrades.","role":".governanceAdminAC"}
      receivedPermissions.0.role:
-        ".governanceAdminAC"
+        ".appRoleAdminAC"
      receivedPermissions.0.description:
-        "manage the upgrade admin amd access control roles."
+        "Grant and revoke application roles, including the `APP_GOVERNOR` role that controls caller-specific fallback routes."
      receivedPermissions.1.description:
-        "set custom implementations for specific operators (changes the verifier based on who calls it)."
+        "Route fallback calls from specific callers to a still-active registry in the default verifier's reference chain. This principally determines which verifier and bootloader configuration processes their proof submissions; the proxy's explicit `isValid` entry point always queries the default target."
    }
```

```diff
    contract CairoBootloaderProgram (eth:0x24105e6697AdD9B4B1BDE04079a91BDFCCa24A47) [shared-sharp-verifier/CairoBootloaderProgram] {
    +++ description: Stores the complete compiled Cairo outer bootloader used as the top-level program of a SHARP proof. The SHARP verifier copies these words into public memory, pinning this exact executable onchain independently of the separately committed simple, applicative, and recursive-verifier programs.
      template:
+        "shared-sharp-verifier/CairoBootloaderProgram"
      description:
+        "Stores the complete compiled Cairo outer bootloader used as the top-level program of a SHARP proof. The SHARP verifier copies these words into public memory, pinning this exact executable onchain independently of the separately committed simple, applicative, and recursive-verifier programs."
      fieldMeta:
+        {"getCompiledProgram":{"severity":"HIGH","description":"The full compiled Cairo outer-bootloader instruction array. Source-level reproducibility requires rebuilding this exact array, not merely publishing similar Cairo source.","type":"CODE_CHANGE"}}
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x243682b9A01455ac671c97D8dE686EBd4EE25791) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed","eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1","eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"],"eth:0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","80","0"]
+        {"auxPolynomials":["eth:0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed","eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1","eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"],"oodsContract":"eth:0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"80","minProofOfWorkBits_":"0"}
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract CpuVerifierRecursive_2026_13 (eth:0x2867A4509B0969531641A42a3D4A9B0A07109B6B) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
      name:
-        "CpuFrilessVerifier"
+        "CpuVerifierRecursive_2026_13"
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0x1BdE14B50e7dAeD71eE14F7e8defaa3d8A7D4420","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2"],"eth:0x35e9F63Efc97E008f3f9097eA3293b540483e7Cb","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","96","30"]
+        {"auxPolynomials":["eth:0x1BdE14B50e7dAeD71eE14F7e8defaa3d8A7D4420","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2"],"oodsContract":"eth:0x35e9F63Efc97E008f3f9097eA3293b540483e7Cb","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"96","minProofOfWorkBits_":"30"}
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract CpuConstraintPoly (eth:0x2c9726B081305F314A74D570F0FED8dd9fab01A1) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract FriStatementContract (eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuVerifierSmall_2026_13 (eth:0x30F3AB988Cb00fe3Fb5ab891F50c13684770419b) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
      name:
-        "CpuFrilessVerifier"
+        "CpuVerifierSmall_2026_13"
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0x9A62fa46D88697bBbEFAf5F9Ef1234E6502d31a9","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2","eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce","eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771"],"eth:0xa4D0Bb20c708262155378C9D14A5A6A863E15Dd4","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","96","30"]
+        {"auxPolynomials":["eth:0x9A62fa46D88697bBbEFAf5F9Ef1234E6502d31a9","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2","eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce","eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771"],"oodsContract":"eth:0xa4D0Bb20c708262155378C9D14A5A6A863E15Dd4","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"96","minProofOfWorkBits_":"30"}
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract MerkleStatementContract (eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuConstraintPoly (eth:0x351666E9EeA6E012f08695ccd1923f37519563f1) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuOods (eth:0x35e9F63Efc97E008f3f9097eA3293b540483e7Cb) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x3d57526c1C8D63fa2A8704487Df65e9000166c8E) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed","eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1","eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"],"eth:0xA9db7bDfbc3664C8954f490e4d94B8607a080f23","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","80","0"]
+        {"auxPolynomials":["eth:0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed","eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1","eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"],"oodsContract":"eth:0xA9db7bDfbc3664C8954f490e4d94B8607a080f23","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"80","minProofOfWorkBits_":"0"}
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract CpuConstraintPoly (eth:0x3E727f44Fd2c92bd960AAb86DaAcD1A831B16eba) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x42AF9498647Be47A256C9cc8278eE94473Cb7771) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0x05C98569CA566a2035b87dE7d1b623C950798035","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed","eth:0xedFfEA8296945aA91FC035Aefc8c33D737dBc573","eth:0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc","eth:0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8","eth:0x53daC4aB94955f35657463252a7b25F343A14451","eth:0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2"],"eth:0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","80","0"]
+        {"auxPolynomials":["eth:0x05C98569CA566a2035b87dE7d1b623C950798035","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed","eth:0xedFfEA8296945aA91FC035Aefc8c33D737dBc573","eth:0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc","eth:0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8","eth:0x53daC4aB94955f35657463252a7b25F343A14451","eth:0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2"],"oodsContract":"eth:0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"80","minProofOfWorkBits_":"0"}
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (eth:0x4576bA889ddCb27738c4D3b8dF2FF2616650BA0b) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) [shared-sharp-verifier/SHARPVerifierCallProxy] {
    +++ description: Upgradeable call router through which Starknet and other applications access SHARP fact registries. It uses `call`, not `delegatecall`, so facts and immutable verifier configuration remain at each target registry. The explicit `isValid` entry point always queries the default target. Other calls handled by the fallback, principally proof submissions, can be routed per caller to a still-active registry in the default target's reference chain. The default target can be replaced by eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 after 8d.
      description:
-        "Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay."
+        "Upgradeable call router through which Starknet and other applications access SHARP fact registries. It uses `call`, not `delegatecall`, so facts and immutable verifier configuration remain at each target registry. The explicit `isValid` entry point always queries the default target. Other calls handled by the fallback, principally proof submissions, can be routed per caller to a still-active registry in the default target's reference chain. The default target can be replaced by eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 after 8d."
      values.customImplOperators:
-        ["eth:0x54B839D988C9E712cd36cBf7C95dedC2B9F9aE6c","eth:0xfE325F97146124F3767bFA59899Fa4177fd46D2f","eth:0x8B0A18cc6472Bf429d058948AF78d85CB25cd284","eth:0xDBf0eDAebbC97931c595f4aC883d7C7fdedc7526","eth:0xb641a2035c7340CDff40f069454EB0B8Bbab6a3C","eth:0x3F3380d9e31D53264dEA568E654b6e9D9EB3895A","eth:0x93b1F80BaDc57AE16Ef21d25EEc31A3785e7c426","eth:0x8Cdcf93be2508cb8b348E539EC8EEF2434BFB2DE","eth:0x6eEDe907dF99F7FBCd26e71e5b157BBB6483Fc8b","eth:0xA410aEA6d7ad518165c214a42730A19fB3828170"]
      values.customProxyImplementations:
-        ["eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942","eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934","eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066","eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe","eth:0xE67515a751291445B85b2F176c1eCdf08e86b406"]
      values.appRoleAdminAC:
+        ["eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"]
+++ description: Latest nonzero caller-to-registry fallback routes reconstructed from events. These are `call` targets, not delegatecall implementations. The stored route is usable only while the target is in the default registry's unexpired reference chain; otherwise the caller's fallback call reverts. This affects proof submissions but not the proxy's explicit `isValid`, which always queries the default target.
+++ severity: HIGH
      values.customFactRegistryRoutes:
+        [{"operator":"eth:0x54B839D988C9E712cd36cBf7C95dedC2B9F9aE6c","customReference":"eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"},{"operator":"eth:0xfE325F97146124F3767bFA59899Fa4177fd46D2f","customReference":"eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"},{"operator":"eth:0x8B0A18cc6472Bf429d058948AF78d85CB25cd284","customReference":"eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934"},{"operator":"eth:0xDBf0eDAebbC97931c595f4aC883d7C7fdedc7526","customReference":"eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934"},{"operator":"eth:0xb641a2035c7340CDff40f069454EB0B8Bbab6a3C","customReference":"eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066"},{"operator":"eth:0x3F3380d9e31D53264dEA568E654b6e9D9EB3895A","customReference":"eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066"},{"operator":"eth:0x93b1F80BaDc57AE16Ef21d25EEc31A3785e7c426","customReference":"eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe"},{"operator":"eth:0x8Cdcf93be2508cb8b348E539EC8EEF2434BFB2DE","customReference":"eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe"},{"operator":"eth:0x6eEDe907dF99F7FBCd26e71e5b157BBB6483Fc8b","customReference":"eth:0xE67515a751291445B85b2F176c1eCdf08e86b406"},{"operator":"eth:0xA410aEA6d7ad518165c214a42730A19fB3828170","customReference":"eth:0xE67515a751291445B85b2F176c1eCdf08e86b406"}]
      fieldMeta.$admin.description:
+        "Can upgrade the proxy logic and replace the default SHARP fact registry after the configured delay. A malicious target can make arbitrary facts valid for callers routed to it."
      fieldMeta.customProxyImplementations:
-        {"severity":"HIGH","description":"Non-default targets for call proxy delegation. These targets are automatically chosen based on which operator makes a call."}
      fieldMeta.customImplOperators:
-        {"severity":"HIGH","description":"Calls of these operators are redirected to custom proxy implementations, usually older versions of verifiers."}
      fieldMeta.callProxyImplementation:
+        {"severity":"HIGH","description":"Default SHARP fact registry called by the proxy and the only registry queried directly by its explicit `isValid` entry point. Replacing it changes the complete proof-verification trust chain: outer bootloader, bootloader commitments, recursive verifier allowlist, Solidity CPU verifiers, and temporary reference registries.","type":"CODE_CHANGE"}
      fieldMeta.customFactRegistryRoutes:
+        {"severity":"HIGH","description":"Latest nonzero caller-to-registry fallback routes reconstructed from events. These are `call` targets, not delegatecall implementations. The stored route is usable only while the target is in the default registry's unexpired reference chain; otherwise the caller's fallback call reverts. This affects proof submissions but not the proxy's explicit `isValid`, which always queries the default target."}
    }
```

```diff
    contract CpuOods (eth:0x4742f8723CAE9C17Cb1D54708898904fB43621c9) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (eth:0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuOods (eth:0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuConstraintPoly (eth:0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0x5318edCfEcAF84EB5A3A4D364C2dCFF06083953E) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0x53daC4aB94955f35657463252a7b25F343A14451) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuConstraintPoly (eth:0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CairoBootloaderProgram_2024_10 (eth:0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515) [shared-sharp-verifier/CairoBootloaderProgram] {
    +++ description: Stores the complete compiled Cairo outer bootloader used as the top-level program of a SHARP proof. The SHARP verifier copies these words into public memory, pinning this exact executable onchain independently of the separately committed simple, applicative, and recursive-verifier programs.
      description:
-        "Bootloader program for the SHARPVerifier."
+        "Stores the complete compiled Cairo outer bootloader used as the top-level program of a SHARP proof. The SHARP verifier copies these words into public memory, pinning this exact executable onchain independently of the separately committed simple, applicative, and recursive-verifier programs."
      fieldMeta:
+        {"getCompiledProgram":{"severity":"HIGH","description":"The full compiled Cairo outer-bootloader instruction array. Source-level reproducibility requires rebuilding this exact array, not merely publishing similar Cairo source.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract SHARPVerifier_2026_13_1 (eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe) [shared-sharp-verifier/SHARPVerifier] {
    +++ description: Immutable GPS statement verifier shared by Starknet and other StarkWare systems. It verifies a STARK proof of the exact Cairo bootloader stored onchain, forces the bootloader configuration into public memory, and registers a fact for every bootloader task. A fact is also considered valid when it exists in the time-limited reference fact registry.
      description:
-        "Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output."
+        "Immutable GPS statement verifier shared by Starknet and other StarkWare systems. It verifies a STARK proof of the exact Cairo bootloader stored onchain, forces the bootloader configuration into public memory, and registers a fact for every bootloader task. A fact is also considered valid when it exists in the time-limited reference fact registry."
+++ description: The three bootloader configuration words forced into the proven program output. In modern versions they are (1) a Pedersen commitment to the ordered list of supported simple-bootloader program hashes, (2) the applicative-bootloader program hash, and (3) a Pedersen commitment to the ordered list of supported recursive Cairo-verifier program hashes. The 2024_10 verifier instead uses a direct Poseidon commitment for word 0. Reproducing a list commitment is insufficient unless its exact ordered preimage and every program behind the listed hashes are also published and reproducible. A malicious allowed program can make invalid nested tasks appear proven.
+++ severity: HIGH
      values.getBootloaderConfig:
-        ["37889379279861089970868356983774360253508326951064758033885675883862334778","989994135429182905628199499137734285064642484443466268071170571058909750176","2989448937132554463006794084002640731746256535824175616421304143852713734169"]
+        {"simpleBootloaderConfigurationCommitment":"37889379279861089970868356983774360253508326951064758033885675883862334778","applicativeBootloaderProgramHash":"989994135429182905628199499137734285064642484443466268071170571058909750176","supportedCairoVerifierProgramHashesCommitment":"2989448937132554463006794084002640731746256535824175616421304143852713734169"}
      fieldMeta:
+        {"bootloaderProgramContractAddress":{"severity":"HIGH","description":"Contract containing the full compiled Cairo outer bootloader executed by every proof. The Solidity verifier copies this program into the STARK public memory, so its onchain bytecode pins the exact program. A malicious bootloader could register arbitrary application facts even when the underlying application programs were not executed correctly.","type":"CODE_CHANGE"},"memoryPageFactRegistry":{"severity":"HIGH","description":"Registry used by the Solidity STARK verifier for public-memory page facts. If it accepted an invalid page fact, proof verification could use memory that was not committed to correctly.","type":"CODE_CHANGE"},"cpuFrilessVerifiers":{"severity":"HIGH","description":"Immutable Solidity STARK verifiers indexed by the caller-supplied `cairoVerifierId`. Each entry fixes a Cairo CPU layout and its verifier helper contracts. Any entry that accepts an invalid execution proof can register arbitrary SHARP facts.","type":"CODE_CHANGE"},"getBootloaderConfig":{"severity":"HIGH","description":"The three bootloader configuration words forced into the proven program output. In modern versions they are (1) a Pedersen commitment to the ordered list of supported simple-bootloader program hashes, (2) the applicative-bootloader program hash, and (3) a Pedersen commitment to the ordered list of supported recursive Cairo-verifier program hashes. The 2024_10 verifier instead uses a direct Poseidon commitment for word 0. Reproducing a list commitment is insufficient unless its exact ordered preimage and every program behind the listed hashes are also published and reproducible. A malicious allowed program can make invalid nested tasks appear proven.","type":"CODE_CHANGE"},"referenceFactRegistry":{"severity":"HIGH","description":"Previous SHARP fact registry whose facts remain valid until `referralExpirationTime`. Its complete verifier and bootloader trust chain is therefore part of this verifier's active safety assumptions during the referral window.","type":"EXTERNAL"},"referralExpirationTime":{"severity":"HIGH","description":"Unix timestamp after which facts from `referenceFactRegistry` stop being accepted. Before this time, either registry can satisfy a fact lookup.","type":"RISK_PARAMETER"}}
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed","eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1","eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"],"eth:0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","80","0"]
+        {"auxPolynomials":["eth:0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed","eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1","eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"],"oodsContract":"eth:0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"80","minProofOfWorkBits_":"0"}
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract CpuOods (eth:0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (eth:0x69833933e59269aB062eAfDe074C059ce5DC7755) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuVerifierDexWithBitwise_2026_13 (eth:0x6a67796ee97700B5B5f5aFBCFFDCbc5F80803F11) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
      name:
-        "CpuFrilessVerifier"
+        "CpuVerifierDexWithBitwise_2026_13"
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0xC716C4E3f68ad6785524f65Df129fC090339dBD8","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2","eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce","eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771"],"eth:0xa40115c39Dc257E5aAE39e2F311AF6a0247bb766","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","96","30"]
+        {"auxPolynomials":["eth:0xC716C4E3f68ad6785524f65Df129fC090339dBD8","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2","eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce","eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771"],"oodsContract":"eth:0xa40115c39Dc257E5aAE39e2F311AF6a0247bb766","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"96","minProofOfWorkBits_":"30"}
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract CpuVerifierStarknet_2026_13 (eth:0x71574057D12541ccDa98643aC56441838353A26D) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
      name:
-        "CpuFrilessVerifier"
+        "CpuVerifierStarknet_2026_13"
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0x2c9726B081305F314A74D570F0FED8dd9fab01A1","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2","eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce","eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771","eth:0x21578B24F86AdF6f59C406f641F693745C31Ea8F","eth:0xE5AC9312f30623EB20D435533A4205790aF68Fd0","eth:0x4576bA889ddCb27738c4D3b8dF2FF2616650BA0b","eth:0xb45b87Ba49C64F79df0EF81043a57999af5Ea7A0","eth:0xc1Cd710bB0d8A07A46Cc884a552091d1ED433Ccc"],"eth:0xd67C6798df68b98f1ef10BEeF0f35De788014fAA","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","96","30"]
+        {"auxPolynomials":["eth:0x2c9726B081305F314A74D570F0FED8dd9fab01A1","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2","eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce","eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771","eth:0x21578B24F86AdF6f59C406f641F693745C31Ea8F","eth:0xE5AC9312f30623EB20D435533A4205790aF68Fd0","eth:0x4576bA889ddCb27738c4D3b8dF2FF2616650BA0b","eth:0xb45b87Ba49C64F79df0EF81043a57999af5Ea7A0","eth:0xc1Cd710bB0d8A07A46Cc884a552091d1ED433Ccc"],"oodsContract":"eth:0xd67C6798df68b98f1ef10BEeF0f35De788014fAA","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"96","minProofOfWorkBits_":"30"}
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract CpuOods (eth:0x7ca0201319f98b5494d90d0f8dA9427C64AF135e) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract SHARPVerifier_2026_13_2 (eth:0x7Da1225C752ab37E610a242D9D8a0548262E3fF7) [shared-sharp-verifier/SHARPVerifier] {
    +++ description: Immutable GPS statement verifier shared by Starknet and other StarkWare systems. It verifies a STARK proof of the exact Cairo bootloader stored onchain, forces the bootloader configuration into public memory, and registers a fact for every bootloader task. A fact is also considered valid when it exists in the time-limited reference fact registry.
      description:
-        "Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output."
+        "Immutable GPS statement verifier shared by Starknet and other StarkWare systems. It verifies a STARK proof of the exact Cairo bootloader stored onchain, forces the bootloader configuration into public memory, and registers a fact for every bootloader task. A fact is also considered valid when it exists in the time-limited reference fact registry."
+++ description: The three bootloader configuration words forced into the proven program output. In modern versions they are (1) a Pedersen commitment to the ordered list of supported simple-bootloader program hashes, (2) the applicative-bootloader program hash, and (3) a Pedersen commitment to the ordered list of supported recursive Cairo-verifier program hashes. The 2024_10 verifier instead uses a direct Poseidon commitment for word 0. Reproducing a list commitment is insufficient unless its exact ordered preimage and every program behind the listed hashes are also published and reproducible. A malicious allowed program can make invalid nested tasks appear proven.
+++ severity: HIGH
      values.getBootloaderConfig:
-        ["3442855748187296636739564186904728563385971901122957091055928358173521721079","2358844945297786488640123814540854423585455959362109345448922524567546993330","2344514586684536563385559840360704301482767436870016911498865422916991654732"]
+        {"simpleBootloaderConfigurationCommitment":"3442855748187296636739564186904728563385971901122957091055928358173521721079","applicativeBootloaderProgramHash":"2358844945297786488640123814540854423585455959362109345448922524567546993330","supportedCairoVerifierProgramHashesCommitment":"2344514586684536563385559840360704301482767436870016911498865422916991654732"}
      fieldMeta:
+        {"bootloaderProgramContractAddress":{"severity":"HIGH","description":"Contract containing the full compiled Cairo outer bootloader executed by every proof. The Solidity verifier copies this program into the STARK public memory, so its onchain bytecode pins the exact program. A malicious bootloader could register arbitrary application facts even when the underlying application programs were not executed correctly.","type":"CODE_CHANGE"},"memoryPageFactRegistry":{"severity":"HIGH","description":"Registry used by the Solidity STARK verifier for public-memory page facts. If it accepted an invalid page fact, proof verification could use memory that was not committed to correctly.","type":"CODE_CHANGE"},"cpuFrilessVerifiers":{"severity":"HIGH","description":"Immutable Solidity STARK verifiers indexed by the caller-supplied `cairoVerifierId`. Each entry fixes a Cairo CPU layout and its verifier helper contracts. Any entry that accepts an invalid execution proof can register arbitrary SHARP facts.","type":"CODE_CHANGE"},"getBootloaderConfig":{"severity":"HIGH","description":"The three bootloader configuration words forced into the proven program output. In modern versions they are (1) a Pedersen commitment to the ordered list of supported simple-bootloader program hashes, (2) the applicative-bootloader program hash, and (3) a Pedersen commitment to the ordered list of supported recursive Cairo-verifier program hashes. The 2024_10 verifier instead uses a direct Poseidon commitment for word 0. Reproducing a list commitment is insufficient unless its exact ordered preimage and every program behind the listed hashes are also published and reproducible. A malicious allowed program can make invalid nested tasks appear proven.","type":"CODE_CHANGE"},"referenceFactRegistry":{"severity":"HIGH","description":"Previous SHARP fact registry whose facts remain valid until `referralExpirationTime`. Its complete verifier and bootloader trust chain is therefore part of this verifier's active safety assumptions during the referral window.","type":"EXTERNAL"},"referralExpirationTime":{"severity":"HIGH","description":"Unix timestamp after which facts from `referenceFactRegistry` stop being accepted. Before this time, either registry can satisfy a fact lookup.","type":"RISK_PARAMETER"}}
    }
```

```diff
    contract CpuConstraintPoly (eth:0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuOods (eth:0x8f3af16cF4eB89f256cDebeaDd46e1b982dC4775) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuOods (eth:0x99480b7c32C4F8965fF1929a368Dd586C6DC3595) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuConstraintPoly (eth:0x9A62fa46D88697bBbEFAf5F9Ef1234E6502d31a9) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (eth:0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuConstraintPoly (eth:0x9Ddb8A6E3B23B33CE685e6d9f89f0ca25510AE6F) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract SHARPVerifier_2024_10 (eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942) [shared-sharp-verifier/SHARPVerifier] {
    +++ description: Immutable GPS statement verifier shared by Starknet and other StarkWare systems. It verifies a STARK proof of the exact Cairo bootloader stored onchain, forces the bootloader configuration into public memory, and registers a fact for every bootloader task. A fact is also considered valid when it exists in the time-limited reference fact registry.
      description:
-        "Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output."
+        "Immutable GPS statement verifier shared by Starknet and other StarkWare systems. It verifies a STARK proof of the exact Cairo bootloader stored onchain, forces the bootloader configuration into public memory, and registers a fact for every bootloader task. A fact is also considered valid when it exists in the time-limited reference fact registry."
+++ description: The three bootloader configuration words forced into the proven program output. In modern versions they are (1) a Pedersen commitment to the ordered list of supported simple-bootloader program hashes, (2) the applicative-bootloader program hash, and (3) a Pedersen commitment to the ordered list of supported recursive Cairo-verifier program hashes. The 2024_10 verifier instead uses a direct Poseidon commitment for word 0. Reproducing a list commitment is insufficient unless its exact ordered preimage and every program behind the listed hashes are also published and reproducible. A malicious allowed program can make invalid nested tasks appear proven.
+++ severity: HIGH
      values.getBootloaderConfig:
-        ["160268921359133235574810995023520895391777547407923205700393332203861498631","1104316318711847786071125527957082259001554753246760931396914052122269757907","988080400528720010398639244351885480706475299330001427790099377094461351470"]
+        {"simpleBootloaderConfigurationCommitment":"160268921359133235574810995023520895391777547407923205700393332203861498631","applicativeBootloaderProgramHash":"1104316318711847786071125527957082259001554753246760931396914052122269757907","supportedCairoVerifierProgramHashesCommitment":"988080400528720010398639244351885480706475299330001427790099377094461351470"}
      fieldMeta:
+        {"bootloaderProgramContractAddress":{"severity":"HIGH","description":"Contract containing the full compiled Cairo outer bootloader executed by every proof. The Solidity verifier copies this program into the STARK public memory, so its onchain bytecode pins the exact program. A malicious bootloader could register arbitrary application facts even when the underlying application programs were not executed correctly.","type":"CODE_CHANGE"},"memoryPageFactRegistry":{"severity":"HIGH","description":"Registry used by the Solidity STARK verifier for public-memory page facts. If it accepted an invalid page fact, proof verification could use memory that was not committed to correctly.","type":"CODE_CHANGE"},"cpuFrilessVerifiers":{"severity":"HIGH","description":"Immutable Solidity STARK verifiers indexed by the caller-supplied `cairoVerifierId`. Each entry fixes a Cairo CPU layout and its verifier helper contracts. Any entry that accepts an invalid execution proof can register arbitrary SHARP facts.","type":"CODE_CHANGE"},"getBootloaderConfig":{"severity":"HIGH","description":"The three bootloader configuration words forced into the proven program output. In modern versions they are (1) a Pedersen commitment to the ordered list of supported simple-bootloader program hashes, (2) the applicative-bootloader program hash, and (3) a Pedersen commitment to the ordered list of supported recursive Cairo-verifier program hashes. The 2024_10 verifier instead uses a direct Poseidon commitment for word 0. Reproducing a list commitment is insufficient unless its exact ordered preimage and every program behind the listed hashes are also published and reproducible. A malicious allowed program can make invalid nested tasks appear proven.","type":"CODE_CHANGE"},"referenceFactRegistry":{"severity":"HIGH","description":"Previous SHARP fact registry whose facts remain valid until `referralExpirationTime`. Its complete verifier and bootloader trust chain is therefore part of this verifier's active safety assumptions during the referral window.","type":"EXTERNAL"},"referralExpirationTime":{"severity":"HIGH","description":"Unix timestamp after which facts from `referenceFactRegistry` stop being accepted. Before this time, either registry can satisfy a fact lookup.","type":"RISK_PARAMETER"}}
    }
```

```diff
    contract EcdsaPointsXColumn (eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuOods (eth:0xa40115c39Dc257E5aAE39e2F311AF6a0247bb766) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuOods (eth:0xa4D0Bb20c708262155378C9D14A5A6A863E15Dd4) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PedersenHashPointsYColumn (eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuConstraintPoly (eth:0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuOods (eth:0xA9db7bDfbc3664C8954f490e4d94B8607a080f23) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xAaAe0edF6536de72E7163D293518c40011179f8a) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0x351666E9EeA6E012f08695ccd1923f37519563f1","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"],"eth:0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","80","0"]
+        {"auxPolynomials":["eth:0x351666E9EeA6E012f08695ccd1923f37519563f1","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"],"oodsContract":"eth:0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"80","minProofOfWorkBits_":"0"}
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract CpuOods (eth:0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuOods (eth:0xaE325CE505AA13EDC30d48187B05c24A3BaC2707) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuConstraintPoly (eth:0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0xb45b87Ba49C64F79df0EF81043a57999af5Ea7A0) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuVerifierRecursiveLargeOutput_2026_13 (eth:0xbe0F8F150Fd10798524B4de80eD75751658CAEF3) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
      name:
-        "CpuFrilessVerifier"
+        "CpuVerifierRecursiveLargeOutput_2026_13"
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0x9Ddb8A6E3B23B33CE685e6d9f89f0ca25510AE6F","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2","eth:0xdf10757de64811df030cf88bB700B8CC63bAB090","eth:0xe58327a05F21ab12AB33A4408003A87e571f810D","eth:0x69833933e59269aB062eAfDe074C059ce5DC7755","eth:0x5318edCfEcAF84EB5A3A4D364C2dCFF06083953E","eth:0xECc282Dc2571E43696d3259490faFa3b98790e20"],"eth:0x7ca0201319f98b5494d90d0f8dA9427C64AF135e","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","96","30"]
+        {"auxPolynomials":["eth:0x9Ddb8A6E3B23B33CE685e6d9f89f0ca25510AE6F","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2","eth:0xdf10757de64811df030cf88bB700B8CC63bAB090","eth:0xe58327a05F21ab12AB33A4408003A87e571f810D","eth:0x69833933e59269aB062eAfDe074C059ce5DC7755","eth:0x5318edCfEcAF84EB5A3A4D364C2dCFF06083953E","eth:0xECc282Dc2571E43696d3259490faFa3b98790e20"],"oodsContract":"eth:0x7ca0201319f98b5494d90d0f8dA9427C64AF135e","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"96","minProofOfWorkBits_":"30"}
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0xc1Cd710bB0d8A07A46Cc884a552091d1ED433Ccc) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuConstraintPoly (eth:0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuConstraintPoly (eth:0xC716C4E3f68ad6785524f65Df129fC090339dBD8) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (eth:0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract EcdsaPointsYColumn (eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuOods (eth:0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuOods (eth:0xd67C6798df68b98f1ef10BEeF0f35De788014fAA) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuConstraintPoly (eth:0xd8e47340bdC4fB06D37056b1725c653836Cc81E5) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuOods (eth:0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PedersenHashPointsXColumn (eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (eth:0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CairoBootloaderProgram_2025_12 (eth:0xdf0B63653E86995556079cbc09594BCD88D1D917) [shared-sharp-verifier/CairoBootloaderProgram] {
    +++ description: Stores the complete compiled Cairo outer bootloader used as the top-level program of a SHARP proof. The SHARP verifier copies these words into public memory, pinning this exact executable onchain independently of the separately committed simple, applicative, and recursive-verifier programs.
      description:
-        "Bootloader program for the SHARPVerifier."
+        "Stores the complete compiled Cairo outer bootloader used as the top-level program of a SHARP proof. The SHARP verifier copies these words into public memory, pinning this exact executable onchain independently of the separately committed simple, applicative, and recursive-verifier programs."
      fieldMeta:
+        {"getCompiledProgram":{"severity":"HIGH","description":"The full compiled Cairo outer-bootloader instruction array. Source-level reproducibility requires rebuilding this exact array, not merely publishing similar Cairo source.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (eth:0xdf10757de64811df030cf88bB700B8CC63bAB090) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xe155154845950573EC5F518fC0D4950AB71303ff) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed","eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1","eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716","eth:0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540","eth:0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc","eth:0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD","eth:0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF","eth:0x032e5cDb729Ce94638ACA9e82A22688109B43046"],"eth:0x4742f8723CAE9C17Cb1D54708898904fB43621c9","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","80","0"]
+        {"auxPolynomials":["eth:0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE","eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1","eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed","eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1","eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716","eth:0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540","eth:0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc","eth:0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD","eth:0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF","eth:0x032e5cDb729Ce94638ACA9e82A22688109B43046"],"oodsContract":"eth:0x4742f8723CAE9C17Cb1D54708898904fB43621c9","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"80","minProofOfWorkBits_":"0"}
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
    contract EcdsaPointsYColumn (eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract CpuConstraintPoly (eth:0xE4937AC1Da4211c6E48cf41A7B298b74edA9B103) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (eth:0xe58327a05F21ab12AB33A4408003A87e571f810D) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract MemoryPageFactRegistry (eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460) [shared-sharp-verifier/MemoryPageFactRegistry] {
    +++ description: Permissionless commitment calculator and registry used by the Solidity STARK verifiers. Anyone may submit a public-memory page and interaction elements; the contract computes its hash and cumulative product and registers the fact key committing to them, which the CPU verifier must bind to the proof. It is part of the proof verifier, not an application-level program registry. A malicious or nonconforming implementation can break public-memory soundness; binding to a different honest registry generally causes a liveness failure instead.
      description:
-        "Auxiliary to the SHARPVerifier contract: Verified 'memory fact pages' get stored here. This is important as it registers all necessary onchain data produced by the verifier."
+        "Permissionless commitment calculator and registry used by the Solidity STARK verifiers. Anyone may submit a public-memory page and interaction elements; the contract computes its hash and cumulative product and registers the fact key committing to them, which the CPU verifier must bind to the proof. It is part of the proof verifier, not an application-level program registry. A malicious or nonconforming implementation can break public-memory soundness; binding to a different honest registry generally causes a liveness failure instead."
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (eth:0xE5AC9312f30623EB20D435533A4205790aF68Fd0) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract SHARPVerifier_2026_13_3 (eth:0xE67515a751291445B85b2F176c1eCdf08e86b406) [shared-sharp-verifier/SHARPVerifier] {
    +++ description: Immutable GPS statement verifier shared by Starknet and other StarkWare systems. It verifies a STARK proof of the exact Cairo bootloader stored onchain, forces the bootloader configuration into public memory, and registers a fact for every bootloader task. A fact is also considered valid when it exists in the time-limited reference fact registry.
      name:
-        "SHARPVerifier"
+        "SHARPVerifier_2026_13_3"
      description:
-        "Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output."
+        "Immutable GPS statement verifier shared by Starknet and other StarkWare systems. It verifies a STARK proof of the exact Cairo bootloader stored onchain, forces the bootloader configuration into public memory, and registers a fact for every bootloader task. A fact is also considered valid when it exists in the time-limited reference fact registry."
+++ description: The three bootloader configuration words forced into the proven program output. In modern versions they are (1) a Pedersen commitment to the ordered list of supported simple-bootloader program hashes, (2) the applicative-bootloader program hash, and (3) a Pedersen commitment to the ordered list of supported recursive Cairo-verifier program hashes. The 2024_10 verifier instead uses a direct Poseidon commitment for word 0. Reproducing a list commitment is insufficient unless its exact ordered preimage and every program behind the listed hashes are also published and reproducible. A malicious allowed program can make invalid nested tasks appear proven.
+++ severity: HIGH
      values.getBootloaderConfig:
-        ["3442855748187296636739564186904728563385971901122957091055928358173521721079","2358844945297786488640123814540854423585455959362109345448922524567546993330","2344514586684536563385559840360704301482767436870016911498865422916991654732"]
+        {"simpleBootloaderConfigurationCommitment":"3442855748187296636739564186904728563385971901122957091055928358173521721079","applicativeBootloaderProgramHash":"2358844945297786488640123814540854423585455959362109345448922524567546993330","supportedCairoVerifierProgramHashesCommitment":"2344514586684536563385559840360704301482767436870016911498865422916991654732"}
      fieldMeta:
+        {"bootloaderProgramContractAddress":{"severity":"HIGH","description":"Contract containing the full compiled Cairo outer bootloader executed by every proof. The Solidity verifier copies this program into the STARK public memory, so its onchain bytecode pins the exact program. A malicious bootloader could register arbitrary application facts even when the underlying application programs were not executed correctly.","type":"CODE_CHANGE"},"memoryPageFactRegistry":{"severity":"HIGH","description":"Registry used by the Solidity STARK verifier for public-memory page facts. If it accepted an invalid page fact, proof verification could use memory that was not committed to correctly.","type":"CODE_CHANGE"},"cpuFrilessVerifiers":{"severity":"HIGH","description":"Immutable Solidity STARK verifiers indexed by the caller-supplied `cairoVerifierId`. Each entry fixes a Cairo CPU layout and its verifier helper contracts. Any entry that accepts an invalid execution proof can register arbitrary SHARP facts.","type":"CODE_CHANGE"},"getBootloaderConfig":{"severity":"HIGH","description":"The three bootloader configuration words forced into the proven program output. In modern versions they are (1) a Pedersen commitment to the ordered list of supported simple-bootloader program hashes, (2) the applicative-bootloader program hash, and (3) a Pedersen commitment to the ordered list of supported recursive Cairo-verifier program hashes. The 2024_10 verifier instead uses a direct Poseidon commitment for word 0. Reproducing a list commitment is insufficient unless its exact ordered preimage and every program behind the listed hashes are also published and reproducible. A malicious allowed program can make invalid nested tasks appear proven.","type":"CODE_CHANGE"},"referenceFactRegistry":{"severity":"HIGH","description":"Previous SHARP fact registry whose facts remain valid until `referralExpirationTime`. Its complete verifier and bootloader trust chain is therefore part of this verifier's active safety assumptions during the referral window.","type":"EXTERNAL"},"referralExpirationTime":{"severity":"HIGH","description":"Unix timestamp after which facts from `referenceFactRegistry` stop being accepted. Before this time, either registry can satisfy a fact lookup.","type":"RISK_PARAMETER"}}
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0xECc282Dc2571E43696d3259490faFa3b98790e20) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (eth:0xedFfEA8296945aA91FC035Aefc8c33D737dBc573) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (eth:0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
      description:
+        "Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain."
    }
```

```diff
    contract SHARPVerifier_2025_12 (eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066) [shared-sharp-verifier/SHARPVerifier] {
    +++ description: Immutable GPS statement verifier shared by Starknet and other StarkWare systems. It verifies a STARK proof of the exact Cairo bootloader stored onchain, forces the bootloader configuration into public memory, and registers a fact for every bootloader task. A fact is also considered valid when it exists in the time-limited reference fact registry.
      description:
-        "Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output."
+        "Immutable GPS statement verifier shared by Starknet and other StarkWare systems. It verifies a STARK proof of the exact Cairo bootloader stored onchain, forces the bootloader configuration into public memory, and registers a fact for every bootloader task. A fact is also considered valid when it exists in the time-limited reference fact registry."
+++ description: The three bootloader configuration words forced into the proven program output. In modern versions they are (1) a Pedersen commitment to the ordered list of supported simple-bootloader program hashes, (2) the applicative-bootloader program hash, and (3) a Pedersen commitment to the ordered list of supported recursive Cairo-verifier program hashes. The 2024_10 verifier instead uses a direct Poseidon commitment for word 0. Reproducing a list commitment is insufficient unless its exact ordered preimage and every program behind the listed hashes are also published and reproducible. A malicious allowed program can make invalid nested tasks appear proven.
+++ severity: HIGH
      values.getBootloaderConfig:
-        ["37889379279861089970868356983774360253508326951064758033885675883862334778","3480185788024326007166778030599498673382667448173974782477620863541158415714","2932072919023221119013858170796075739921358449313810261427542077330086829225"]
+        {"simpleBootloaderConfigurationCommitment":"37889379279861089970868356983774360253508326951064758033885675883862334778","applicativeBootloaderProgramHash":"3480185788024326007166778030599498673382667448173974782477620863541158415714","supportedCairoVerifierProgramHashesCommitment":"2932072919023221119013858170796075739921358449313810261427542077330086829225"}
      fieldMeta:
+        {"bootloaderProgramContractAddress":{"severity":"HIGH","description":"Contract containing the full compiled Cairo outer bootloader executed by every proof. The Solidity verifier copies this program into the STARK public memory, so its onchain bytecode pins the exact program. A malicious bootloader could register arbitrary application facts even when the underlying application programs were not executed correctly.","type":"CODE_CHANGE"},"memoryPageFactRegistry":{"severity":"HIGH","description":"Registry used by the Solidity STARK verifier for public-memory page facts. If it accepted an invalid page fact, proof verification could use memory that was not committed to correctly.","type":"CODE_CHANGE"},"cpuFrilessVerifiers":{"severity":"HIGH","description":"Immutable Solidity STARK verifiers indexed by the caller-supplied `cairoVerifierId`. Each entry fixes a Cairo CPU layout and its verifier helper contracts. Any entry that accepts an invalid execution proof can register arbitrary SHARP facts.","type":"CODE_CHANGE"},"getBootloaderConfig":{"severity":"HIGH","description":"The three bootloader configuration words forced into the proven program output. In modern versions they are (1) a Pedersen commitment to the ordered list of supported simple-bootloader program hashes, (2) the applicative-bootloader program hash, and (3) a Pedersen commitment to the ordered list of supported recursive Cairo-verifier program hashes. The 2024_10 verifier instead uses a direct Poseidon commitment for word 0. Reproducing a list commitment is insufficient unless its exact ordered preimage and every program behind the listed hashes are also published and reproducible. A malicious allowed program can make invalid nested tasks appear proven.","type":"CODE_CHANGE"},"referenceFactRegistry":{"severity":"HIGH","description":"Previous SHARP fact registry whose facts remain valid until `referralExpirationTime`. Its complete verifier and bootloader trust chain is therefore part of this verifier's active safety assumptions during the referral window.","type":"EXTERNAL"},"referralExpirationTime":{"severity":"HIGH","description":"Unix timestamp after which facts from `referenceFactRegistry` stop being accepted. Before this time, either registry can satisfy a fact lookup.","type":"RISK_PARAMETER"}}
    }
```

```diff
    contract CpuVerifierPerpetual_2026_13 (eth:0xFFC7974cd74b95f631f454cd787AAc28F0476b44) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`.
      name:
-        "CpuFrilessVerifier"
+        "CpuVerifierPerpetual_2026_13"
+++ description: All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.
+++ severity: HIGH
      values.constructorArgs:
-        [["eth:0x3E727f44Fd2c92bd960AAb86DaAcD1A831B16eba","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2","eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce","eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771"],"eth:0x8f3af16cF4eB89f256cDebeaDd46e1b982dC4775","eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","96","30"]
+        {"auxPolynomials":["eth:0x3E727f44Fd2c92bd960AAb86DaAcD1A831B16eba","eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70","eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2","eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce","eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771"],"oodsContract":"eth:0x8f3af16cF4eB89f256cDebeaDd46e1b982dC4775","memoryPageFactRegistry_":"eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460","merkleStatementContractAddress":"eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd","friStatementContractAddress":"eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400","numSecurityBits_":"96","minProofOfWorkBits_":"30"}
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
      description:
+        "Immutable Solidity verifier for one Cairo CPU layout. It checks the STARK proof using layout-specific constraint, OODS, Merkle, FRI, and periodic-column helper contracts. The SHARP verifier can select any configured layout by `cairoVerifierId`."
      fieldMeta:
+        {"constructorArgs":{"severity":"HIGH","description":"All immutable verifier dependencies and security parameters. `auxPolynomials[0]` is the layout's CPU constraint polynomial and the remaining entries are periodic-column contracts; the other arguments pin the CPU OODS contract, this verifier's memory-page registry, Merkle and FRI statement contracts, security bits, and proof-of-work bits. A malicious helper or nonconforming memory registry, or insufficient security parameters, can make an invalid execution proof pass; a different honest registry generally causes proof submission to revert instead.","type":"CODE_CHANGE"},"getLayoutInfo":{"severity":"HIGH","description":"The public-memory offset and builtin bitmap for this Cairo layout. The outer SHARP verifier uses these values when constructing the public input supplied to this verifier.","type":"CODE_CHANGE"}}
    }
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x03Fa911dfCa026D9C8Edb508851b390accF912e8) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0x04bE0E2D5EcCC744BE21BFb28d91d4a3CBefA8EB) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0x1Db84E79E8daEC762d6aDaa5bf358A4Ba001E975) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey1Column (eth:0x1E8E41141347E01f33d84718b7f4cEFB433D5a94) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0x1F038cdFeEE2Afa44a4213b12A6F0a5A7E6DE676) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0x20F10963eBCA608f8B24a5AEE275861B20ec868E) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x217750c27bE9147f9e358D9FF26a8224F8aCC214) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Level2CpuFrilessVerifier (eth:0x28E3aD4201ba416B23d9950503dB28a9232BE32a) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: Legacy immutable Solidity verifier for one Cairo CPU layout, together with its arithmetic, Merkle, FRI, OODS, and periodic-column helper contracts.
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey2Column (eth:0x2b159027d7F0E23D5C15b0517e33DdA838C46045) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0x307982EB84858A04d32b5e0b72D152be5A3eEcEA) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0x367B337Aa4A056CB78Fd74F94E283A73B27DfBB6) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract PedersenHashPointsXColumn (eth:0x3d571a45D2B14FF423D2DC4A0e7a46e07D9682bB) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract MemoryPageFactRegistry_2023_9 (eth:0x40864568f679c10aC9e72211500096a5130770fA) [shared-sharp-verifier/MemoryPageFactRegistry]
    +++ description: Permissionless commitment calculator and registry used by the Solidity STARK verifiers. Anyone may submit a public-memory page and interaction elements; the contract computes its hash and cumulative product and registers the fact key committing to them, which the CPU verifier must bind to the proof. It is part of the proof verifier, not an application-level program registry. A malicious or nonconforming implementation can break public-memory soundness; binding to a different honest registry generally causes a liveness failure instead.
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0x450909cC615036Ca4772dDDd8a69988B031811c9) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0x473E7B002f9A3109fd0FcdA4597935E4E610f367) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0x4D654CEd9cE0781986A4612C76e3e18D6D3B2fFB) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CairoBootloaderProgram_2022_7 (eth:0x5d07afFAfc8721Ef3dEe4D11A2D1484CBf6A9dDf) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Level2CpuFrilessVerifier (eth:0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: Legacy immutable Solidity verifier for one Cairo CPU layout, together with its arithmetic, Merkle, FRI, OODS, and periodic-column helper contracts.
```

```diff
+   Status: CREATED
    contract Level2CpuFrilessVerifier (eth:0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: Legacy immutable Solidity verifier for one Cairo CPU layout, together with its arithmetic, Merkle, FRI, OODS, and periodic-column helper contracts.
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0x62960C874379653D7BBe3644Ac653736Da2eda12) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x630A97901Ac29590DF83f4A64B8D490D54caf239) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract MerkleStatementContract_2023_9 (eth:0x634DCf4f1421Fc4D95A968A559a450ad0245804c) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract Level2CpuFrilessVerifier (eth:0x66F2345D003511a1A60D87E3984Bb8d12C21A970) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: Legacy immutable Solidity verifier for one Cairo CPU layout, together with its arithmetic, Merkle, FRI, OODS, and periodic-column helper contracts.
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0x697Ce81ea1732c74850Eef111EbC47c0FBd14a0a) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract Level3SHARPVerifier_2022_7 (eth:0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) [shared-sharp-verifier/Level3SHARPVerifier]
    +++ description: Legacy third-level shared StarkWare SHARP verifier retained as a fallback or historical fact registry. Its facts are safety-relevant only while an active verifier or call-proxy route still refers to it.
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0x704DFf65eD9b3d121d469b7A790A9927C853607F) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0x75D887d2437eF87EA17B93143716BECD7BBbCa0a) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x78Af2BFB12Db15d35f7dE8DD77f29C299C78c590) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey0Column (eth:0x8004e851fa3F3C66A3c80e4F7E96559f4C3E16a6) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract Level2CpuFrilessVerifier (eth:0x8055948c530dbBc19cc350d53473EEe3a1e3d22B) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: Legacy immutable Solidity verifier for one Cairo CPU layout, together with its arithmetic, Merkle, FRI, OODS, and periodic-column helper contracts.
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x8488e8f4e26eBa40faE229AB653d98E341cbE57B) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0x88bA01753F2e96C3a00c6aaf76EaEB36Ccf715C1) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract EcdsaPointsYColumn (eth:0x9e4FdD8ff1b11e8f788Af77caA4b0037c137EcC1) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x9E614a417f8309575fC11b175A51599661f2Bd21) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Level2CpuFrilessVerifier (eth:0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: Legacy immutable Solidity verifier for one Cairo CPU layout, together with its arithmetic, Merkle, FRI, OODS, and periodic-column helper contracts.
```

```diff
+   Status: CREATED
    contract CairoBootloaderProgram_2023_9 (eth:0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40) [shared-sharp-verifier/CairoBootloaderProgram]
    +++ description: Stores the complete compiled Cairo outer bootloader used as the top-level program of a SHARP proof. The SHARP verifier copies these words into public memory, pinning this exact executable onchain independently of the separately committed simple, applicative, and recursive-verifier programs.
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey2Column (eth:0xB5A5759Dd063899F213eB9699906B445f855660D) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0xB62Dc40175812208f509B69506315A48C92fb15A) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0xB640935b164024EF1BC0b9e176432c440a5cd4dc) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract Level2CpuFrilessVerifier (eth:0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: Legacy immutable Solidity verifier for one Cairo CPU layout, together with its arithmetic, Merkle, FRI, OODS, and periodic-column helper contracts.
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey1Column (eth:0xC2969a099F22430e20bcE237F469ac6F3101Ac5f) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0xC879aF7D5eD80e4676C203FD300E640C297F31e3) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract EcdsaPointsXColumn (eth:0xcB799CbBd4f5F0a3b6bbd9b55F59E8b301A0286B) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0xCC80e9E852cAE30E2d30d98ab2868648E84BF2A4) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0xcd96f43343Aa06d6ED0D412969c6D462fd17cF02) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract Level2CpuFrilessVerifier (eth:0xD0fC19710c389ef4a7244656cB08db08eA9D88b4) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: Legacy immutable Solidity verifier for one Cairo CPU layout, together with its arithmetic, Merkle, FRI, OODS, and periodic-column helper contracts.
```

```diff
+   Status: CREATED
    contract Level2SHARPVerifier_2023_9 (eth:0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) [shared-sharp-verifier/Level2SHARPVerifier]
    +++ description: Legacy shared StarkWare SHARP verifier retained as a fallback or historical fact registry. It verifies a STARK proof of an onchain Cairo bootloader and registers application facts. It remains safety-relevant whenever an active verifier or call-proxy route still accepts its facts.
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0xDd4cBe8CC7f420A9576F93E1D1CcC501495B5253) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract FriStatementContract_2023_9 (eth:0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0xE5313feE344376D22A42C9F0919e7F0d43920CAc) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey0Column (eth:0xe7B835eA7e348B25aF2480272C4cA28429573293) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0xe9664D230490d5A515ef7Ef30033d8075a8D0E24) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsYColumn (eth:0xFD12A123ecf4326E70A4D8b2bC260ec730BBE7Fd) [shared-sharp-verifier/ignoreComputeSpam]
    +++ description: Immutable arithmetic, constraint, Merkle/FRI, or periodic-column helper used by a Solidity Cairo CPU verifier. It is grouped as discovery noise, but its bytecode remains part of the onchain proof-verification trust chain.
```

```diff
+   Status: CREATED
    contract MemoryPageFactRegistry_2022_7 (eth:0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4) [N/A]
    +++ description: None
```

Generated with discovered.json: 0xdb4c93d65aac4f190440217b4951bc8f8ad4daac

# Diff at Wed, 24 Jun 2026 12:34:05 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@de5d8a0f706ed1564e5583609b20d2bf29d3dfd5 block: 1782119094
- current timestamp: 1782304372

## Description

Added custom implementation operators for the current callproxy implementation. It does not introduce any trust assumptions because this callproxy is used by default anyway.

## Watched changes

```diff
    contract SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) [shared-sharp-verifier/SHARPVerifierCallProxy] {
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay.
+++ description: Calls of these operators are redirected to custom proxy implementations, usually older versions of verifiers.
+++ severity: HIGH
      values.customImplOperators.8:
+        "eth:0x6eEDe907dF99F7FBCd26e71e5b157BBB6483Fc8b"
+++ description: Calls of these operators are redirected to custom proxy implementations, usually older versions of verifiers.
+++ severity: HIGH
      values.customImplOperators.9:
+        "eth:0xA410aEA6d7ad518165c214a42730A19fB3828170"
+++ description: Non-default targets for call proxy delegation. These targets are automatically chosen based on which operator makes a call.
+++ severity: HIGH
      values.customProxyImplementations.4:
+        "eth:0xE67515a751291445B85b2F176c1eCdf08e86b406"
    }
```

Generated with discovered.json: 0x48091a0469dcd0a331a808bf4041e1e950719f7e

# Diff at Mon, 22 Jun 2026 10:11:52 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@18532eacfff59dfa2ff9ea37d128b65c569fef40 block: 1777891441
- current timestamp: 1782119094

## Description

Redeployed SHARP verifier with the same program hashes and same contracts (https://disco.l2beat.com/diff/eth:0x7Da1225C752ab37E610a242D9D8a0548262E3fF7/eth:0xE67515a751291445B85b2F176c1eCdf08e86b406). 

The new verifier has expiry timestamp at 1782316139, which is in 2 days and not 600 years as for previous verifiers. All older verifiers will become unusable (and should be purged from the FE) after this timestamp.

## Watched changes

```diff
    contract SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) [shared-sharp-verifier/SHARPVerifierCallProxy] {
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay.
      values.$pastUpgrades.13:
+        ["2026-06-21T09:15:59.000Z","0x57f323ff6c828c8fe0c65c9c89d5b242264455cd5f3a5bacd25a78efa17b0ed4",["eth:0x3597c5CBCbCB30079a0bD2A68cDE5f98272f9feb"]]
      values.$upgradeCount:
-        13
+        14
      values.callProxyImplementation:
-        "eth:0x7Da1225C752ab37E610a242D9D8a0548262E3fF7"
+        "eth:0xE67515a751291445B85b2F176c1eCdf08e86b406"
      values.StarkWareProxy_callImplementation:
-        "eth:0x7Da1225C752ab37E610a242D9D8a0548262E3fF7"
+        "eth:0xE67515a751291445B85b2F176c1eCdf08e86b406"
    }
```

```diff
+   Status: CREATED
    contract SHARPVerifier (eth:0xE67515a751291445B85b2F176c1eCdf08e86b406) [shared-sharp-verifier/SHARPVerifier]
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
```

## Source code changes

```diff
.../shared-sharp-verifier/.flat/SHARPVerifier.sol  | 2413 ++++++++++++++++++++
 1 file changed, 2413 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777891441 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0x28E3aD4201ba416B23d9950503dB28a9232BE32a) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: None
```

```diff
    contract SHARPVerifier_2026_13_1 (eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe) [shared-sharp-verifier/SHARPVerifier] {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      name:
-        "SHARPVerifier_2026_13"
+        "SHARPVerifier_2026_13_1"
    }
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0x66F2345D003511a1A60D87E3984Bb8d12C21A970) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level3SHARPVerifier (eth:0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) [shared-sharp-verifier/Level3SHARPVerifier]
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
```

```diff
    contract SHARPVerifier_2026_13_2 (eth:0x7Da1225C752ab37E610a242D9D8a0548262E3fF7) [shared-sharp-verifier/SHARPVerifier] {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      name:
-        "SHARPVerifier"
+        "SHARPVerifier_2026_13_2"
    }
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0x8055948c530dbBc19cc350d53473EEe3a1e3d22B) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: None
```

```diff
-   Status: DELETED
    contract CairoBootloaderProgram_2023_9 (eth:0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40) [shared-sharp-verifier/CairoBootloaderProgram]
    +++ description: Bootloader program for the SHARPVerifier.
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0xD0fC19710c389ef4a7244656cB08db08eA9D88b4) [shared-sharp-verifier/Level2CpuFrilessVerifier]
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2SHARPVerifier (eth:0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) [shared-sharp-verifier/Level2SHARPVerifier]
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
```

Generated with discovered.json: 0x5cc2ebe5db7e9cc030b100516d5bf0d696421e86

# Diff at Fri, 08 May 2026 07:52:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1777891441
- current timestamp: 1777891441

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777891441 (main branch discovery), not current.

```diff
    contract CpuFrilessVerifier (eth:0x015381651F240Ed6C44122dCba6Cf807c9442CD6) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0x6156385d69e1bf7290adaaaa1e5d33748df1c8da588f686403aca38710f05693"
+        "0x95dbba309e90963bdf97703ccc5716ab881b50739f99541b55e4abed3153a9ae"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0xa78b7bb374044ea6a603766c4b16c5d1ec5573ddc1dfb9b9413701020ebfe195"
+        "0x432fe8c93783a375ba6345117927303066b97cb04acf056253303f6edf6c545a"
    }
```

```diff
    contract CpuOods (eth:0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0x0436bd83534187cf17ffbb4cc97b6caab2a1ac66d80a9daef6d6589e93bb4c77"
+        "0x75b9c03f92fe5939c6afa765489c0bbe8d66237fabc1dfa3a14fc0f109bc4f38"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x0cD0cDf0132c566db61B691BCEEBA2c4D8cA5CdC) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0xa78b7bb374044ea6a603766c4b16c5d1ec5573ddc1dfb9b9413701020ebfe195"
+        "0x432fe8c93783a375ba6345117927303066b97cb04acf056253303f6edf6c545a"
    }
```

```diff
    contract SHARPVerifier_2025_11 (eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934) [shared-sharp-verifier/SHARPVerifier] {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      sourceHashes.0:
-        "0x4861d3367a504472f64f32236f1345c2ab6b1b5e897ece08bc5e215bf14d3c7a"
+        "0x59a9cd18dfd9d425813a54d5f7fbf4b4df08b6504188fa73f2e324231fdac637"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0x6156385d69e1bf7290adaaaa1e5d33748df1c8da588f686403aca38710f05693"
+        "0x95dbba309e90963bdf97703ccc5716ab881b50739f99541b55e4abed3153a9ae"
    }
```

```diff
    contract SHARP Multisig (eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x243682b9A01455ac671c97D8dE686EBd4EE25791) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0xdea77b54fa6a0489f5a57f0dc4ade2e0082aa3017b33bb8b4c47b5c693c65383"
+        "0x1f9f05bf9e73af6dd1b40cc4be8449df1039d30061479c593c4b909d1ef258ea"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x2867A4509B0969531641A42a3D4A9B0A07109B6B) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0x683cac2609eeb80f624fedec43b3622138b0579960bf74162c2f49eebd1e1b4d"
+        "0xb8fd15f34d012cc9f2ca1c8184c9e7e6aa3e5fa28dafc23c6a644be85dc48c3b"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x28E3aD4201ba416B23d9950503dB28a9232BE32a) [shared-sharp-verifier/Level2CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0xf51c19545fc3804626755b86bd142a8c98efcbfacbd2499b1ae9ecda7a163540"
+        "0x959b66c4e0ca7d27b2f3f35e84911c954165ec82edb6cba3dbf50038c0679928"
    }
```

```diff
    contract FriStatementContract (eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0xdb6522c746b47c8025bdd3942737207a45de03416b891219d4ad3328e3cbcb07"
+        "0xf71797d479a665686e6fcccb6c80b49e5dfb373f38bb8363729d7eacede46b91"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x30F3AB988Cb00fe3Fb5ab891F50c13684770419b) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0x0bb18873bc3a6a2cc498c681c3bc67777185bf377294eb531123d4529deb8b38"
+        "0x2fe4df71d75d27c76880ece36632b58ea8bdd84a8ca199a326e1f8b95093d268"
    }
```

```diff
    contract MerkleStatementContract (eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0x353a1ed6ef3ef47ed725cf0832c357c4e71680318751a7bbd706d607d8acb7aa"
+        "0xaca823368006ed788b5c39c8a5441f4078675429b11a0255fa3c4739da757787"
    }
```

```diff
    contract CpuOods (eth:0x35e9F63Efc97E008f3f9097eA3293b540483e7Cb) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0x6e983e16c9f7b72cb7f29f2e7fcb0061acc1622409a2e45534fa03fd05ff9672"
+        "0xd446fcab8f5c29a3cb78d30509ab38f9829fd14d35464cfe3d4049d5c82aa13b"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x3d57526c1C8D63fa2A8704487Df65e9000166c8E) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0x0bb18873bc3a6a2cc498c681c3bc67777185bf377294eb531123d4529deb8b38"
+        "0x2fe4df71d75d27c76880ece36632b58ea8bdd84a8ca199a326e1f8b95093d268"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x42AF9498647Be47A256C9cc8278eE94473Cb7771) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0xcc5a725835dea04291bf4edd2b8b39c4d15358a01b6baa116e9aede7b897fdf4"
+        "0xf0616d290d472f2ecc84d6aa921864d91e9e0535c3cb9f927dfbaa2c374b932b"
    }
```

```diff
    contract SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) [shared-sharp-verifier/SHARPVerifierCallProxy] {
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay.
      sourceHashes.0:
-        "0x1cfb47b7d41edbe1b49e9d32ab6b39caae53d74feac405b948cc774b2d8db7a5"
+        "0xcb7bc19b402a7528b48f945e7e388a0085b0d9596186e8ae3b5a17c8e40f48d6"
      sourceHashes.1:
-        "0x7477a4b1d5db367c21e2c2d493553a2f519bd0d4305433a902d9b9322e7b81cb"
+        "0x5fe2d920435811a3cc2a10ecfd4887771e33fb259a37562f01c5f6239daf7618"
    }
```

```diff
    contract CpuOods (eth:0x4742f8723CAE9C17Cb1D54708898904fB43621c9) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0x9c476ab40346f6531ff512dbd20c84273a3cca2fb0e870b6aed5c67aa20d32f8"
+        "0xe02da9f94c167d2e7810a91f52b8d6ece9428c858d2cb050de600148b6776251"
    }
```

```diff
    contract CpuOods (eth:0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0x01d75ee9eb5d04eb0bdef657f41a7a4953dfc1dbb219b2c2c4504f988d4054da"
+        "0xc4d2148d6cd791873abac02aba0f89a5c902b9b810c5bb301604470ce047c01d"
    }
```

```diff
    contract SHARPVerifier_2026_13 (eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe) [shared-sharp-verifier/SHARPVerifier] {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      sourceHashes.0:
-        "0xb9dd070b540ba3bad7b65f9cd4ed80b62e8cf034bd4f4acdf0373e4af46068f3"
+        "0x702c3ac8228cb7a90fdc21a1ff9a274add0e7c4d692fafa13cde53c3cab10c45"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d) [shared-sharp-verifier/Level2CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0x455c07ce6901510356c3380308551257434cb25c1460e324772f60468e46682a"
+        "0x6d84591f30dacfe16b962302797626ed63b321e8875f1ae503e127bed7d5f095"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460) [shared-sharp-verifier/Level2CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0xb1d6c8068e8976bde7fbfd4294f8808b6d28efd5d87ca84820a7e3e890446761"
+        "0x436452908b4069cd28e48ce238a5687878f7a881aaa29423b580e71531692530"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0x6c96d348b73a5436aaac0d8de8c5f06a7a625c1ff02b0c069fc677f0ac01c009"
+        "0x77b5fe32f7b78f96106850c0c9fb590acd56dce1040e159d3eb1fdc483064ff1"
    }
```

```diff
    contract CpuOods (eth:0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0x2263b0314ef958372095f3d5a50817b8f1de525cc589a9a6acd462814968c84a"
+        "0xc2263421f1724484975ff224cd66eeaf740b4c5fd0635b8e9c19c073f4ce1831"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x66F2345D003511a1A60D87E3984Bb8d12C21A970) [shared-sharp-verifier/Level2CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0x0a08e622000c261c38a85bb0054bb2b50ae684e6edf79f0986e931d10fc5c277"
+        "0x375f1f2f62c75f2f26d292b116059a4dc4f08ad647351f30858f4c7578d723a9"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x6a67796ee97700B5B5f5aFBCFFDCbc5F80803F11) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0xdea77b54fa6a0489f5a57f0dc4ade2e0082aa3017b33bb8b4c47b5c693c65383"
+        "0x1f9f05bf9e73af6dd1b40cc4be8449df1039d30061479c593c4b909d1ef258ea"
    }
```

```diff
    contract Level3SHARPVerifier (eth:0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) [shared-sharp-verifier/Level3SHARPVerifier] {
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
      sourceHashes.0:
-        "0x4a3316e3eb418f807ad2271f24b4764f4069731c7be4041cf2574e66ee2b20cc"
+        "0x81f1d5794593bf5e70a855f51034a88f7bca94b8b77b9bfc055231b61945beef"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x71574057D12541ccDa98643aC56441838353A26D) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0x16540ae818b59b005fe1cee4b1fbc4d3e29806d95076929b196adc7e3f347522"
+        "0x941f25b6ad31af56f49fcbac70edce0badb28303f0aadcb5f10407906d42fef7"
    }
```

```diff
    contract CpuOods (eth:0x7ca0201319f98b5494d90d0f8dA9427C64AF135e) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0x01d75ee9eb5d04eb0bdef657f41a7a4953dfc1dbb219b2c2c4504f988d4054da"
+        "0xc4d2148d6cd791873abac02aba0f89a5c902b9b810c5bb301604470ce047c01d"
    }
```

```diff
    contract SHARPVerifier (eth:0x7Da1225C752ab37E610a242D9D8a0548262E3fF7) [shared-sharp-verifier/SHARPVerifier] {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      sourceHashes.0:
-        "0xb9dd070b540ba3bad7b65f9cd4ed80b62e8cf034bd4f4acdf0373e4af46068f3"
+        "0x702c3ac8228cb7a90fdc21a1ff9a274add0e7c4d692fafa13cde53c3cab10c45"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x8055948c530dbBc19cc350d53473EEe3a1e3d22B) [shared-sharp-verifier/Level2CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0xdc9bb80d233601bb801b1e447c903b9c5a929f3630f4e158f75b9931e44beb9f"
+        "0x26ad17f9da869fe8252fca0474758685abb0de5bcb49fbcdd2334b4931c9f8ad"
    }
```

```diff
    contract CpuOods (eth:0x8f3af16cF4eB89f256cDebeaDd46e1b982dC4775) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0x2263b0314ef958372095f3d5a50817b8f1de525cc589a9a6acd462814968c84a"
+        "0xc2263421f1724484975ff224cd66eeaf740b4c5fd0635b8e9c19c073f4ce1831"
    }
```

```diff
    contract CpuOods (eth:0x99480b7c32C4F8965fF1929a368Dd586C6DC3595) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0x0436bd83534187cf17ffbb4cc97b6caab2a1ac66d80a9daef6d6589e93bb4c77"
+        "0x75b9c03f92fe5939c6afa765489c0bbe8d66237fabc1dfa3a14fc0f109bc4f38"
    }
```

```diff
    contract SHARPVerifier_2024_10 (eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942) [shared-sharp-verifier/SHARPVerifier] {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      sourceHashes.0:
-        "0x851b82890362af9467218d27c5666552421bca8023529b83632b6ebc4cc6bc8f"
+        "0xb2fd3a883d471e64996c35699173931df174bd303b3032311d63f2a58ba61b28"
    }
```

```diff
    contract CpuOods (eth:0xa40115c39Dc257E5aAE39e2F311AF6a0247bb766) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0xeb39302b38f5f5b329700407c9c1c9f7b90dd0550f5bc4d1273e365ff48b5eb3"
+        "0xe390f7396234c6cc841aa421a1d1ccb8872ccf3a354a248e45f65729dae6c087"
    }
```

```diff
    contract CpuOods (eth:0xa4D0Bb20c708262155378C9D14A5A6A863E15Dd4) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0xea43d74304db71ee531509d5f054b9172347c79c10ce2ef9fe7da542b11b420b"
+        "0x8c46f2cb0ccf501034b8dbe976044b44d42b9596de9c9b876cc111ba6d2bea7d"
    }
```

```diff
    contract CpuOods (eth:0xA9db7bDfbc3664C8954f490e4d94B8607a080f23) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0xea43d74304db71ee531509d5f054b9172347c79c10ce2ef9fe7da542b11b420b"
+        "0x8c46f2cb0ccf501034b8dbe976044b44d42b9596de9c9b876cc111ba6d2bea7d"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9) [shared-sharp-verifier/Level2CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0x130226ac91c1d6deb82b863eea95c84640b9c20c1e292b26cb88fc6db73c0b15"
+        "0x0775d8ea4da30591eac7620db651cd7edc8ac137d60e39f95118e231a7158372"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xAaAe0edF6536de72E7163D293518c40011179f8a) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0x683cac2609eeb80f624fedec43b3622138b0579960bf74162c2f49eebd1e1b4d"
+        "0xb8fd15f34d012cc9f2ca1c8184c9e7e6aa3e5fa28dafc23c6a644be85dc48c3b"
    }
```

```diff
    contract CpuOods (eth:0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0xeb39302b38f5f5b329700407c9c1c9f7b90dd0550f5bc4d1273e365ff48b5eb3"
+        "0xe390f7396234c6cc841aa421a1d1ccb8872ccf3a354a248e45f65729dae6c087"
    }
```

```diff
    contract CpuOods (eth:0xaE325CE505AA13EDC30d48187B05c24A3BaC2707) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0x996c7267677d4955986302f31421117e77179197ff49e9dab8e8fff5c0f41257"
+        "0xe3889a0e87718f39844e3ed41e417ae36561dccf53941c5a69bc8300b6934f79"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xbe0F8F150Fd10798524B4de80eD75751658CAEF3) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0xcc5a725835dea04291bf4edd2b8b39c4d15358a01b6baa116e9aede7b897fdf4"
+        "0xf0616d290d472f2ecc84d6aa921864d91e9e0535c3cb9f927dfbaa2c374b932b"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc) [shared-sharp-verifier/Level2CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0xb44fea2230221135a15c6fbca5ca2f96e5962e3c7e3ec951f0971b590d8962a5"
+        "0x01d95ec0b312bee91534acb9979182ebb7d818ac53c8d581adfaf33490aa3b4c"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xD0fC19710c389ef4a7244656cB08db08eA9D88b4) [shared-sharp-verifier/Level2CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0x85234db76e94b2ff3ad7e2f2a1b16709e261ffc53900bb726e05cf1ee79811aa"
+        "0xac0d4d19933d317f0bf831ce01c35f792b2354f8ab4de270f35402f81f1d322f"
    }
```

```diff
    contract Level2SHARPVerifier (eth:0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) [shared-sharp-verifier/Level2SHARPVerifier] {
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
      sourceHashes.0:
-        "0xbe473240e6de093ae7120378ade4c19b5ab4bbe69143651df5cc3fe66c33c3eb"
+        "0x8b984d2626d18ecafa46268a839943172c1e10997e82549b5467ceb45851846d"
    }
```

```diff
    contract CpuOods (eth:0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0x6e983e16c9f7b72cb7f29f2e7fcb0061acc1622409a2e45534fa03fd05ff9672"
+        "0xd446fcab8f5c29a3cb78d30509ab38f9829fd14d35464cfe3d4049d5c82aa13b"
    }
```

```diff
    contract CpuOods (eth:0xd67C6798df68b98f1ef10BEeF0f35De788014fAA) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0x9c476ab40346f6531ff512dbd20c84273a3cca2fb0e870b6aed5c67aa20d32f8"
+        "0xe02da9f94c167d2e7810a91f52b8d6ece9428c858d2cb050de600148b6776251"
    }
```

```diff
    contract CpuOods (eth:0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84) [shared-sharp-verifier/ignoreComputeSpam] {
    +++ description: None
      sourceHashes.0:
-        "0x996c7267677d4955986302f31421117e77179197ff49e9dab8e8fff5c0f41257"
+        "0xe3889a0e87718f39844e3ed41e417ae36561dccf53941c5a69bc8300b6934f79"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xe155154845950573EC5F518fC0D4950AB71303ff) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0x16540ae818b59b005fe1cee4b1fbc4d3e29806d95076929b196adc7e3f347522"
+        "0x941f25b6ad31af56f49fcbac70edce0badb28303f0aadcb5f10407906d42fef7"
    }
```

```diff
    contract MemoryPageFactRegistry (eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460) [shared-sharp-verifier/MemoryPageFactRegistry] {
    +++ description: Auxiliary to the SHARPVerifier contract: Verified 'memory fact pages' get stored here. This is important as it registers all necessary onchain data produced by the verifier.
      sourceHashes.0:
-        "0x122eb6d5583cc680f59abc49750d9d6c0a65ca937e292b2ce67e18e8a8cdb114"
+        "0xb39531f2d5802255bd28ef9c4a41c69deeaaacbb0107d4d1a09e89dc64ca2903"
    }
```

```diff
    contract SHARPVerifier_2025_12 (eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066) [shared-sharp-verifier/SHARPVerifier] {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      sourceHashes.0:
-        "0x114aa5977a86555ce5c1db3a96c7348dff6f5792982e1f284652996af22cfe4f"
+        "0x6715f44bddbc89fb65bc31bb21ba5e55c72d20db70fee29a588cd33734de9a46"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xFFC7974cd74b95f631f454cd787AAc28F0476b44) [shared-sharp-verifier/CpuFrilessVerifier] {
    +++ description: None
      sourceHashes.0:
-        "0x6c96d348b73a5436aaac0d8de8c5f06a7a625c1ff02b0c069fc677f0ac01c009"
+        "0x77b5fe32f7b78f96106850c0c9fb590acd56dce1040e159d3eb1fdc483064ff1"
    }
```

Generated with discovered.json: 0x6db0b7b2d859fe8bbf1c430788aa6af2ff39db31

# Diff at Tue, 05 May 2026 10:23:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1777891441
- current timestamp: 1777891441

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777891441 (main branch discovery), not current.

```diff
    contract EcdsaPointsXColumn (eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x015381651F240Ed6C44122dCba6Cf807c9442CD6) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0x032e5cDb729Ce94638ACA9e82A22688109B43046) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PedersenHashPointsXColumn (eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0x05C98569CA566a2035b87dE7d1b623C950798035) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x0cD0cDf0132c566db61B691BCEEBA2c4D8cA5CdC) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract SHARPVerifier_2025_11 (eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934) {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CairoBootloaderProgram_2025_11 (eth:0x192292817680196A0215a50B07d1C5E7Ab8A8636) {
    +++ description: Bootloader program for the SHARPVerifier.
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PedersenHashPointsYColumn (eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0x1BdE14B50e7dAeD71eE14F7e8defaa3d8A7D4420) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (eth:0x21578B24F86AdF6f59C406f641F693745C31Ea8F) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract SHARP Multisig (eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      deployerAddress:
+        "eth:0x59232aC80E6d403b6381393e52f4665ECA328558"
    }
```

```diff
    contract CairoBootloaderProgram (eth:0x24105e6697AdD9B4B1BDE04079a91BDFCCa24A47) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x243682b9A01455ac671c97D8dE686EBd4EE25791) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x2867A4509B0969531641A42a3D4A9B0A07109B6B) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x28E3aD4201ba416B23d9950503dB28a9232BE32a) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0x2c9726B081305F314A74D570F0FED8dd9fab01A1) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract FriStatementContract (eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x30F3AB988Cb00fe3Fb5ab891F50c13684770419b) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract MerkleStatementContract (eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0x351666E9EeA6E012f08695ccd1923f37519563f1) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0x35e9F63Efc97E008f3f9097eA3293b540483e7Cb) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x3d57526c1C8D63fa2A8704487Df65e9000166c8E) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0x3E727f44Fd2c92bd960AAb86DaAcD1A831B16eba) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x42AF9498647Be47A256C9cc8278eE94473Cb7771) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (eth:0x4576bA889ddCb27738c4D3b8dF2FF2616650BA0b) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay.
      deployerAddress:
+        "eth:0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6"
    }
```

```diff
    contract CpuOods (eth:0x4742f8723CAE9C17Cb1D54708898904fB43621c9) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (eth:0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0x5318edCfEcAF84EB5A3A4D364C2dCFF06083953E) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0x53daC4aB94955f35657463252a7b25F343A14451) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CairoBootloaderProgram_2024_10 (eth:0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515) {
    +++ description: Bootloader program for the SHARPVerifier.
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract SHARPVerifier_2026_13 (eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe) {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x66F2345D003511a1A60D87E3984Bb8d12C21A970) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (eth:0x69833933e59269aB062eAfDe074C059ce5DC7755) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x6a67796ee97700B5B5f5aFBCFFDCbc5F80803F11) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract Level3SHARPVerifier (eth:0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x71574057D12541ccDa98643aC56441838353A26D) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0x7ca0201319f98b5494d90d0f8dA9427C64AF135e) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract SHARPVerifier (eth:0x7Da1225C752ab37E610a242D9D8a0548262E3fF7) {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0x8055948c530dbBc19cc350d53473EEe3a1e3d22B) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0x8f3af16cF4eB89f256cDebeaDd46e1b982dC4775) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0x99480b7c32C4F8965fF1929a368Dd586C6DC3595) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0x9A62fa46D88697bBbEFAf5F9Ef1234E6502d31a9) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (eth:0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0x9Ddb8A6E3B23B33CE685e6d9f89f0ca25510AE6F) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract SHARPVerifier_2024_10 (eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942) {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract EcdsaPointsXColumn (eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0xa40115c39Dc257E5aAE39e2F311AF6a0247bb766) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0xa4D0Bb20c708262155378C9D14A5A6A863E15Dd4) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PedersenHashPointsYColumn (eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0xA9db7bDfbc3664C8954f490e4d94B8607a080f23) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xAaAe0edF6536de72E7163D293518c40011179f8a) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0xaE325CE505AA13EDC30d48187B05c24A3BaC2707) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0xb45b87Ba49C64F79df0EF81043a57999af5Ea7A0) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CairoBootloaderProgram_2023_9 (eth:0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40) {
    +++ description: Bootloader program for the SHARPVerifier.
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xbe0F8F150Fd10798524B4de80eD75751658CAEF3) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0xc1Cd710bB0d8A07A46Cc884a552091d1ED433Ccc) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0xC716C4E3f68ad6785524f65Df129fC090339dBD8) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (eth:0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract EcdsaPointsYColumn (eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xD0fC19710c389ef4a7244656cB08db08eA9D88b4) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract Level2SHARPVerifier (eth:0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0xd67C6798df68b98f1ef10BEeF0f35De788014fAA) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0xd8e47340bdC4fB06D37056b1725c653836Cc81E5) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuOods (eth:0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PedersenHashPointsXColumn (eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (eth:0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CairoBootloaderProgram_2025_12 (eth:0xdf0B63653E86995556079cbc09594BCD88D1D917) {
    +++ description: Bootloader program for the SHARPVerifier.
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (eth:0xdf10757de64811df030cf88bB700B8CC63bAB090) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xe155154845950573EC5F518fC0D4950AB71303ff) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract EcdsaPointsYColumn (eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuConstraintPoly (eth:0xE4937AC1Da4211c6E48cf41A7B298b74edA9B103) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (eth:0xe58327a05F21ab12AB33A4408003A87e571f810D) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract MemoryPageFactRegistry (eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460) {
    +++ description: Auxiliary to the SHARPVerifier contract: Verified 'memory fact pages' get stored here. This is important as it registers all necessary onchain data produced by the verifier.
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (eth:0xE5AC9312f30623EB20D435533A4205790aF68Fd0) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0xECc282Dc2571E43696d3259490faFa3b98790e20) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (eth:0xedFfEA8296945aA91FC035Aefc8c33D737dBc573) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (eth:0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract SHARPVerifier_2025_12 (eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066) {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract CpuFrilessVerifier (eth:0xFFC7974cd74b95f631f454cd787AAc28F0476b44) {
    +++ description: None
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

Generated with discovered.json: 0xc2e59c70c122e3ffc83323926b3db6b3a4755cb0

# Diff at Mon, 04 May 2026 10:46:13 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@49e04c9893b7bab5ccd06ae4d7a23fa1d10918a8 block: 1777544162
- current timestamp: 1777891441

## Description

Verifier upgrade finalized, it is now actively used.

## Watched changes

```diff
    contract SHARPVerifier (eth:0x7Da1225C752ab37E610a242D9D8a0548262E3fF7) {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      values.hasRegisteredFact:
-        false
+        true
    }
```

Generated with discovered.json: 0x39bd6cf02f85348f8dd9eee253a25198a5f6775a

# Diff at Thu, 30 Apr 2026 10:29:01 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@48c82436aca63abdd2a1dd0798daa7eaa9ef5e58 block: 1775810150
- current timestamp: 1777544162

## Description

Deployed a new SHARP verifier with new bootloader programs. Sources are not yet published.

## Watched changes

```diff
    contract SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay.
      values.$pastUpgrades.12:
+        ["2026-04-29T12:20:47.000Z","0xf088946bc461774cf86ce348fcee4d52bb27ebf049d99f3fab806226053b0d5b",["eth:0x3597c5CBCbCB30079a0bD2A68cDE5f98272f9feb"]]
      values.$upgradeCount:
-        12
+        13
      values.callProxyImplementation:
-        "eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe"
+        "eth:0x7Da1225C752ab37E610a242D9D8a0548262E3fF7"
      values.StarkWareProxy_callImplementation:
-        "eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe"
+        "eth:0x7Da1225C752ab37E610a242D9D8a0548262E3fF7"
    }
```

```diff
+   Status: CREATED
    contract SHARPVerifier (eth:0x7Da1225C752ab37E610a242D9D8a0548262E3fF7)
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
```

## Source code changes

```diff
.../shared-sharp-verifier/.flat/SHARPVerifier.sol  | 2411 ++++++++++++++++++++
 1 file changed, 2411 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1775810150 (main branch discovery), not current.

```diff
    contract SHARPVerifier_2026_13 (eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe) {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      name:
-        "SHARPVerifier"
+        "SHARPVerifier_2026_13"
    }
```

Generated with discovered.json: 0x5c2dd7308bb56bb32fad11628212c7015accb333

# Diff at Fri, 10 Apr 2026 08:37:14 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@cab23b784a70bbaea251f1f4559cea26a4d51f77 block: 1770030445
- current timestamp: 1775810150

## Description

Set two custom callproxy operators, their verification requests are customly routed to the current (stwo) verifier. Probably they are preparing for an upgrade.

## Watched changes

```diff
    contract SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay.
+++ description: Calls of these operators are redirected to custom proxy implementations, usually older versions of verifiers.
+++ severity: HIGH
      values.customImplOperators.6:
+        "eth:0x93b1F80BaDc57AE16Ef21d25EEc31A3785e7c426"
+++ description: Calls of these operators are redirected to custom proxy implementations, usually older versions of verifiers.
+++ severity: HIGH
      values.customImplOperators.7:
+        "eth:0x8Cdcf93be2508cb8b348E539EC8EEF2434BFB2DE"
+++ description: Non-default targets for call proxy delegation. These targets are automatically chosen based on which operator makes a call.
+++ severity: HIGH
      values.customProxyImplementations.3:
+        "eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe"
    }
```

Generated with discovered.json: 0x0d8d92af58a08a07ec75807b8b3d2dcb3608b39c

# Diff at Wed, 04 Feb 2026 15:50:25 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@f2185b73306696aeeb886f57aa0d588decafd3b4 block: 1770030445
- current timestamp: 1770030445

## Description

Stopped ignoring all old gps statement verifier smart contracts to be able to fetch their bootloader program hashes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1770030445 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract EcdsaPointsXColumn (eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0x032e5cDb729Ce94638ACA9e82A22688109B43046)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsXColumn (eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0x05C98569CA566a2035b87dE7d1b623C950798035)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SHARPVerifier_2025_11 (eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934)
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CairoBootloaderProgram_2025_11 (eth:0x192292817680196A0215a50B07d1C5E7Ab8A8636)
    +++ description: Bootloader program for the SHARPVerifier.
```

```diff
+   Status: CREATED
    contract PedersenHashPointsYColumn (eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x243682b9A01455ac671c97D8dE686EBd4EE25791)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x28E3aD4201ba416B23d9950503dB28a9232BE32a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0x351666E9EeA6E012f08695ccd1923f37519563f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x3d57526c1C8D63fa2A8704487Df65e9000166c8E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x42AF9498647Be47A256C9cc8278eE94473Cb7771)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0x4742f8723CAE9C17Cb1D54708898904fB43621c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey2Column (eth:0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0x53daC4aB94955f35657463252a7b25F343A14451)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CairoBootloaderProgram_2024_10 (eth:0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515)
    +++ description: Bootloader program for the SHARPVerifier.
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x66F2345D003511a1A60D87E3984Bb8d12C21A970)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Level3SHARPVerifier (eth:0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6)
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x8055948c530dbBc19cc350d53473EEe3a1e3d22B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey1Column (eth:0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SHARPVerifier_2024_10 (eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942)
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0xA9db7bDfbc3664C8954f490e4d94B8607a080f23)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0xAaAe0edF6536de72E7163D293518c40011179f8a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CairoBootloaderProgram_2023_9 (eth:0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40)
    +++ description: Bootloader program for the SHARPVerifier.
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey0Column (eth:0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0xD0fC19710c389ef4a7244656cB08db08eA9D88b4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Level2SHARPVerifier (eth:0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF)
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey2Column (eth:0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CairoBootloaderProgram_2025_12 (eth:0xdf0B63653E86995556079cbc09594BCD88D1D917)
    +++ description: Bootloader program for the SHARPVerifier.
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0xe155154845950573EC5F518fC0D4950AB71303ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EcdsaPointsYColumn (eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey0Column (eth:0xedFfEA8296945aA91FC035Aefc8c33D737dBc573)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey1Column (eth:0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SHARPVerifier_2025_12 (eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066)
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
```

Generated with discovered.json: 0x286e9f66c31330470d29f0daaa8c346abeac74f9

# Diff at Mon, 02 Feb 2026 11:17:10 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@0848453811f47d862414d125666784260c12d17b block: 1768823299
- current timestamp: 1770030445

## Description

Upgraded Stwo verifier to a version with the new bootloader program. Diff here: https://disco.l2beat.com/diff/eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066/eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe.

## Watched changes

```diff
    contract SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay.
      values.$pastUpgrades.11:
+        ["2026-02-01T14:05:59.000Z","0x257cfdefacd18f0c221b1e486ee002cb974d14bb292884dfaf7f5aa987cc7170",["eth:0x3597c5CBCbCB30079a0bD2A68cDE5f98272f9feb"]]
      values.$upgradeCount:
-        11
+        12
      values.callProxyImplementation:
-        "eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066"
+        "eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe"
      values.StarkWareProxy_callImplementation:
-        "eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066"
+        "eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe"
    }
```

```diff
-   Status: DELETED
    contract CairoBootloaderProgram (eth:0xdf0B63653E86995556079cbc09594BCD88D1D917)
    +++ description: Bootloader program for the SHARPVerifier.
```

```diff
-   Status: DELETED
    contract SHARPVerifier (eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066)
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
```

```diff
+   Status: CREATED
    contract CairoBootloaderProgram (eth:0x24105e6697AdD9B4B1BDE04079a91BDFCCa24A47)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SHARPVerifier (eth:0x5C1Ce45534A9c5f7F3E6683Cd79a8ad57EE3a9fe)
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
```

## Source code changes

```diff
.../CairoBootloaderProgram.sol                     | 133 +++++++++++----------
 .../{.flat@1768823299 => .flat}/SHARPVerifier.sol  |   4 +-
 2 files changed, 69 insertions(+), 68 deletions(-)
```

Generated with discovered.json: 0xac929868294f09d85b4bff505e17b13b7d150d8f

# Diff at Mon, 19 Jan 2026 11:49:27 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@7fd8e6c42f2f1cc03bcf6ecae4818cfa02672b07 block: 1765205910
- current timestamp: 1768823299

## Description

Added two operators with custom SHARP verifier proxy implementations that are redirected to the current callproxy implementation. De facto nothing changes now, but this might indicate an upcoming upgrade to a new verifier version in the near future.

## Watched changes

```diff
    contract SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay.
+++ description: Calls of these operators are redirected to custom proxy implementations, usually older versions of verifiers.
+++ severity: HIGH
      values.customImplOperators.4:
+        "eth:0xb641a2035c7340CDff40f069454EB0B8Bbab6a3C"
+++ description: Calls of these operators are redirected to custom proxy implementations, usually older versions of verifiers.
+++ severity: HIGH
      values.customImplOperators.5:
+        "eth:0x3F3380d9e31D53264dEA568E654b6e9D9EB3895A"
+++ description: Non-default targets for call proxy delegation. These targets are automatically chosen based on which operator makes a call.
+++ severity: HIGH
      values.customProxyImplementations.2:
+        "eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066"
    }
```

Generated with discovered.json: 0x91e5ce7cf182f095806f70d554370066c7405451

# Diff at Mon, 08 Dec 2025 15:40:43 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@57890661a42a73a0a4e8b9f30546cf1492a8662e block: 1761735589
- current timestamp: 1765205910

## Description

Updated the SHARP verifier by modifying bootloader programs (applicative and simple).

## Watched changes

```diff
-   Status: DELETED
    contract SHARPVerifier (eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934)
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
```

```diff
-   Status: DELETED
    contract CairoBootloaderProgram (eth:0x192292817680196A0215a50B07d1C5E7Ab8A8636)
    +++ description: Bootloader program for the SHARPVerifier.
```

```diff
    contract SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay.
      values.$pastUpgrades.10:
+        ["2025-12-08T11:08:11.000Z","0xed93cf713d33ac63297d8c7e2eafc0d9f277b718b4074600536eb9a4205bcb81",["eth:0x3597c5CBCbCB30079a0bD2A68cDE5f98272f9feb"]]
      values.$upgradeCount:
-        10
+        11
      values.callProxyImplementation:
-        "eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934"
+        "eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066"
+++ description: Calls of these operators are redirected to custom proxy implementations, usually older versions of verifiers.
+++ severity: HIGH
      values.customImplOperators.2:
+        "eth:0x8B0A18cc6472Bf429d058948AF78d85CB25cd284"
+++ description: Calls of these operators are redirected to custom proxy implementations, usually older versions of verifiers.
+++ severity: HIGH
      values.customImplOperators.3:
+        "eth:0xDBf0eDAebbC97931c595f4aC883d7C7fdedc7526"
+++ description: Non-default targets for call proxy delegation. These targets are automatically chosen based on which operator makes a call.
+++ severity: HIGH
      values.customProxyImplementations.1:
+        "eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934"
      values.StarkWareProxy_callImplementation:
-        "eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934"
+        "eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066"
    }
```

```diff
+   Status: CREATED
    contract CairoBootloaderProgram (eth:0xdf0B63653E86995556079cbc09594BCD88D1D917)
    +++ description: Bootloader program for the SHARPVerifier.
```

```diff
+   Status: CREATED
    contract SHARPVerifier (eth:0xFE5e5b24FfE981C9faA0d4F36Ce346c3B22B0066)
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
```

## Source code changes

```diff
.../CairoBootloaderProgram.sol                     | 145 +++++++++++----------
 .../{.flat@1761735589 => .flat}/SHARPVerifier.sol  |   4 +-
 2 files changed, 75 insertions(+), 74 deletions(-)
```

Generated with discovered.json: 0xc394eaf0b246f4846a339613477ce2b05ea7052a

# Diff at Wed, 29 Oct 2025 16:13:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@eb258fc8a4f09c1ec78661959e5ef0ad546c0bea block: 1747113875
- current timestamp: 1761735589

## Description

Upgraded SHARP verifier to support Stwo proofs. This includes:

- An upgrade of bootloader program, diff: https://disco.l2beat.com/diff/eth:0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515/eth:0x192292817680196A0215a50B07d1C5E7Ab8A8636. The bootloader now holds some of the "builtins" code instead of the OS (EC_OP, Keccak).
- An upgrade of the SHARPVerifier, diff: https://disco.l2beat.com/diff/eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942/eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934. Minor refactoring + program size update.
- An upgrade of callproxy, diff: https://disco.l2beat.com/diff/eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458/eth:0x3597c5CBCbCB30079a0bD2A68cDE5f98272f9feb. Major changes: access control with new roles was added to call proxy. Custom proxy impl references added to call proxy to allow project operators use the old SHARP prover.

## Watched changes

```diff
-   Status: DELETED
    contract EcdsaPointsXColumn (eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0x032e5cDb729Ce94638ACA9e82A22688109B43046)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PedersenHashPointsXColumn (eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (eth:0x05C98569CA566a2035b87dE7d1b623C950798035)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (eth:0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PedersenHashPointsYColumn (eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed)
    +++ description: None
```

```diff
    contract SHARP Multisig (eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60","description":"manage the upgrade admin amd access control roles.","role":".governanceAdminAC"}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60","description":"set custom implementations for specific operators (changes the verifier based on who calls it).","role":".appGovernorAC"}
    }
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0x243682b9A01455ac671c97D8dE686EBd4EE25791)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (eth:0x351666E9EeA6E012f08695ccd1923f37519563f1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0x3d57526c1C8D63fa2A8704487Df65e9000166c8E)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0x42AF9498647Be47A256C9cc8278eE94473Cb7771)
    +++ description: None
```

```diff
    contract SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay.
      sourceHashes.1:
-        "0x1993eaf381afc46f98a6d57b20658554efa839ecfb519a698bf45042d7ff5b27"
+        "0x7477a4b1d5db367c21e2c2d493553a2f519bd0d4305433a902d9b9322e7b81cb"
      values.$implementation:
-        "eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
+        "eth:0x3597c5CBCbCB30079a0bD2A68cDE5f98272f9feb"
      values.$pastUpgrades.9:
+        ["2025-10-19T08:27:47.000Z","0x7b4a25af246b28b6d5bed86942696273a84e57abc629b83072be370df2bdb797",["eth:0x3597c5CBCbCB30079a0bD2A68cDE5f98272f9feb"]]
      values.$upgradeCount:
-        9
+        10
      values.accessControl.GOVERNANCE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":["eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"]}
      values.accessControl.APP_GOVERNOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":["eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"]}
      values.accessControl.APP_ROLE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":["eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"]}
      values.accessControl.OPERATOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.TOKEN_ADMIN:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.UPGRADE_GOVERNOR:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.SECURITY_ADMIN:
+        {"adminRole":"SECURITY_ADMIN","members":["eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"]}
      values.accessControl.SECURITY_AGENT:
+        {"adminRole":"SECURITY_ADMIN","members":[]}
      values.CALL_PROXY_VERSION:
-        "3.1.0"
      values.callProxyImplementation:
-        "eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"
+        "eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934"
      values.implementation:
-        "eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
+        "eth:0x3597c5CBCbCB30079a0bD2A68cDE5f98272f9feb"
      values.StarkWareProxy_callImplementation:
-        "eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"
+        "eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934"
      values.appGovernorAC:
+        ["eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"]
+++ description: Calls of these operators are redirected to custom proxy implementations, usually older versions of verifiers.
+++ severity: HIGH
      values.customImplOperators:
+        ["eth:0x54B839D988C9E712cd36cBf7C95dedC2B9F9aE6c","eth:0xfE325F97146124F3767bFA59899Fa4177fd46D2f"]
+++ description: Non-default targets for call proxy delegation. These targets are automatically chosen based on which operator makes a call.
+++ severity: HIGH
      values.customProxyImplementations:
+        ["eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"]
      values.ENABLE_WINDOW_DURATION_SLOT:
+        "0xb00a6109e73dbe7bbf8d3f18fb9221d2d024dc2671e3d5ff02532ccc40590738"
      values.governanceAdminAC:
+        ["eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"]
      errors:
-        {"appGovernorAC":"Processing error occurred.","customImplOperators":"Processing error occurred.","customProxyImplementations":"Processing error occurred.","governanceAdminAC":"Processing error occurred."}
      implementationNames.eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458:
-        "CallProxy"
      implementationNames.eth:0x3597c5CBCbCB30079a0bD2A68cDE5f98272f9feb:
+        "CallProxy"
    }
```

```diff
-   Status: DELETED
    contract CpuOods (eth:0x4742f8723CAE9C17Cb1D54708898904fB43621c9)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey2Column (eth:0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (eth:0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (eth:0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0x53daC4aB94955f35657463252a7b25F343A14451)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (eth:0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CairoBootloaderProgram (eth:0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515)
    +++ description: Bootloader program for the SHARPVerifier.
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (eth:0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (eth:0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey1Column (eth:0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SHARPVerifier (eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942)
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (eth:0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (eth:0xA9db7bDfbc3664C8954f490e4d94B8607a080f23)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0xAaAe0edF6536de72E7163D293518c40011179f8a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (eth:0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (eth:0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (eth:0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey0Column (eth:0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (eth:0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (eth:0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey2Column (eth:0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (eth:0xe155154845950573EC5F518fC0D4950AB71303ff)
    +++ description: None
```

```diff
-   Status: DELETED
    contract EcdsaPointsYColumn (eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey0Column (eth:0xedFfEA8296945aA91FC035Aefc8c33D737dBc573)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey1Column (eth:0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x015381651F240Ed6C44122dCba6Cf807c9442CD6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x0cD0cDf0132c566db61B691BCEEBA2c4D8cA5CdC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SHARPVerifier (eth:0x13e120F6c8E747983F7aaF0f7731796bfcb0D934)
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
```

```diff
+   Status: CREATED
    contract CairoBootloaderProgram (eth:0x192292817680196A0215a50B07d1C5E7Ab8A8636)
    +++ description: Bootloader program for the SHARPVerifier.
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0x1BdE14B50e7dAeD71eE14F7e8defaa3d8A7D4420)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey0Column (eth:0x21578B24F86AdF6f59C406f641F693745C31Ea8F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x2867A4509B0969531641A42a3D4A9B0A07109B6B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0x2c9726B081305F314A74D570F0FED8dd9fab01A1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x30F3AB988Cb00fe3Fb5ab891F50c13684770419b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0x35e9F63Efc97E008f3f9097eA3293b540483e7Cb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0x3E727f44Fd2c92bd960AAb86DaAcD1A831B16eba)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey2Column (eth:0x4576bA889ddCb27738c4D3b8dF2FF2616650BA0b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0x5318edCfEcAF84EB5A3A4D364C2dCFF06083953E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey2Column (eth:0x69833933e59269aB062eAfDe074C059ce5DC7755)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x6a67796ee97700B5B5f5aFBCFFDCbc5F80803F11)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0x71574057D12541ccDa98643aC56441838353A26D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0x7ca0201319f98b5494d90d0f8dA9427C64AF135e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0x8f3af16cF4eB89f256cDebeaDd46e1b982dC4775)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0x99480b7c32C4F8965fF1929a368Dd586C6DC3595)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0x9A62fa46D88697bBbEFAf5F9Ef1234E6502d31a9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0x9Ddb8A6E3B23B33CE685e6d9f89f0ca25510AE6F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EcdsaPointsXColumn (eth:0xa3da166aef05dBa08d67EA5b442dD9574274b9Ce)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0xa40115c39Dc257E5aAE39e2F311AF6a0247bb766)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0xa4D0Bb20c708262155378C9D14A5A6A863E15Dd4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsYColumn (eth:0xA55C0F91945958C40f7fa41EB650340245F4B6c2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0xaE325CE505AA13EDC30d48187B05c24A3BaC2707)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey0Column (eth:0xb45b87Ba49C64F79df0EF81043a57999af5Ea7A0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0xbe0F8F150Fd10798524B4de80eD75751658CAEF3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0xc1Cd710bB0d8A07A46Cc884a552091d1ED433Ccc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0xC716C4E3f68ad6785524f65Df129fC090339dBD8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EcdsaPointsYColumn (eth:0xCaea5002758D5B977680Fe65164B7fE6a062C771)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (eth:0xd67C6798df68b98f1ef10BEeF0f35De788014fAA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0xd8e47340bdC4fB06D37056b1725c653836Cc81E5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsXColumn (eth:0xDc596B881bD9e33d3A56AE86031417645d1d9E70)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey0Column (eth:0xdf10757de64811df030cf88bB700B8CC63bAB090)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (eth:0xE4937AC1Da4211c6E48cf41A7B298b74edA9B103)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey1Column (eth:0xe58327a05F21ab12AB33A4408003A87e571f810D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey1Column (eth:0xE5AC9312f30623EB20D435533A4205790aF68Fd0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey1Column (eth:0xECc282Dc2571E43696d3259490faFa3b98790e20)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (eth:0xFFC7974cd74b95f631f454cd787AAc28F0476b44)
    +++ description: None
```

## Source code changes

```diff
.../CairoBootloaderProgram.sol                     |  712 +++++++++----
 ...0x1BdE14B50e7dAeD71eE14F7e8defaa3d8A7D4420.sol} |    0
 ...0x2c9726B081305F314A74D570F0FED8dd9fab01A1.sol} |    0
 ...0x3E727f44Fd2c92bd960AAb86DaAcD1A831B16eba.sol} |    0
 ...0x9A62fa46D88697bBbEFAf5F9Ef1234E6502d31a9.sol} |    0
 ...0x9Ddb8A6E3B23B33CE685e6d9f89f0ca25510AE6F.sol} |    0
 ...0xC716C4E3f68ad6785524f65Df129fC090339dBD8.sol} |    0
 ...0xE4937AC1Da4211c6E48cf41A7B298b74edA9B103.sol} |    0
 ...0xd8e47340bdC4fB06D37056b1725c653836Cc81E5.sol} |    0
 ...0x015381651F240Ed6C44122dCba6Cf807c9442CD6.sol} |    0
 ...0x0cD0cDf0132c566db61B691BCEEBA2c4D8cA5CdC.sol} |    0
 ...0x2867A4509B0969531641A42a3D4A9B0A07109B6B.sol} |    0
 ...0x30F3AB988Cb00fe3Fb5ab891F50c13684770419b.sol} |    0
 ...0x6a67796ee97700B5B5f5aFBCFFDCbc5F80803F11.sol} |    0
 ...0x71574057D12541ccDa98643aC56441838353A26D.sol} |    0
 ...0xFFC7974cd74b95f631f454cd787AAc28F0476b44.sol} |    0
 ...0xbe0F8F150Fd10798524B4de80eD75751658CAEF3.sol} |    0
 ...0x35e9F63Efc97E008f3f9097eA3293b540483e7Cb.sol} |    0
 ...0x7ca0201319f98b5494d90d0f8dA9427C64AF135e.sol} |    0
 ...0x8f3af16cF4eB89f256cDebeaDd46e1b982dC4775.sol} |    0
 ...0x99480b7c32C4F8965fF1929a368Dd586C6DC3595.sol} |    0
 ...0xa40115c39Dc257E5aAE39e2F311AF6a0247bb766.sol} |    0
 ...0xa4D0Bb20c708262155378C9D14A5A6A863E15Dd4.sol} |    0
 ...0xaE325CE505AA13EDC30d48187B05c24A3BaC2707.sol} |    0
 ...0xd67C6798df68b98f1ef10BEeF0f35De788014fAA.sol} |    0
 ...0x21578B24F86AdF6f59C406f641F693745C31Ea8F.sol} |    0
 ...0xdf10757de64811df030cf88bB700B8CC63bAB090.sol} |    0
 ...0xE5AC9312f30623EB20D435533A4205790aF68Fd0.sol} |    0
 ...0xe58327a05F21ab12AB33A4408003A87e571f810D.sol} |    0
 ...0x4576bA889ddCb27738c4D3b8dF2FF2616650BA0b.sol} |    0
 ...0x69833933e59269aB062eAfDe074C059ce5DC7755.sol} |    0
 ...0x5318edCfEcAF84EB5A3A4D364C2dCFF06083953E.sol} |    0
 ...0xb45b87Ba49C64F79df0EF81043a57999af5Ea7A0.sol} |    0
 ...0xECc282Dc2571E43696d3259490faFa3b98790e20.sol} |    0
 ...0xc1Cd710bB0d8A07A46Cc884a552091d1ED433Ccc.sol} |    0
 .../{.flat@1747113875 => .flat}/SHARPVerifier.sol  |   37 +-
 .../SHARPVerifierCallProxy/CallProxy.sol           | 1080 ++++++++++++++++++--
 37 files changed, 1550 insertions(+), 279 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1747113875 (main branch discovery), not current.

```diff
    contract SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay.
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      fieldMeta.customProxyImplementations:
+        {"severity":"HIGH","description":"Non-default targets for call proxy delegation. These targets are automatically chosen based on which operator makes a call."}
      fieldMeta.customImplOperators:
+        {"severity":"HIGH","description":"Calls of these operators are redirected to custom proxy implementations, usually older versions of verifiers."}
      errors:
+        {"appGovernorAC":"Processing error occurred.","customImplOperators":"Processing error occurred.","customProxyImplementations":"Processing error occurred.","governanceAdminAC":"Processing error occurred."}
    }
```

Generated with discovered.json: 0x1159dc07a4e41b92fb2d359ea34748d8d0e649c3

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xc08ce26652ccf01cc378a353179f3f27e1a1fc50

# Diff at Mon, 14 Jul 2025 12:46:14 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22472206
- current block number: 22472206

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22472206 (main branch discovery), not current.

```diff
    contract EcdsaPointsXColumn (0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1) {
    +++ description: None
      address:
-        "0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1"
+        "eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1"
      implementationNames.0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1:
-        "EcdsaPointsXColumn"
      implementationNames.eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1:
+        "EcdsaPointsXColumn"
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (0x032e5cDb729Ce94638ACA9e82A22688109B43046) {
    +++ description: None
      address:
-        "0x032e5cDb729Ce94638ACA9e82A22688109B43046"
+        "eth:0x032e5cDb729Ce94638ACA9e82A22688109B43046"
      implementationNames.0x032e5cDb729Ce94638ACA9e82A22688109B43046:
-        "PoseidonPoseidonPartialRoundKey1Column"
      implementationNames.eth:0x032e5cDb729Ce94638ACA9e82A22688109B43046:
+        "PoseidonPoseidonPartialRoundKey1Column"
    }
```

```diff
    EOA  (0x0405107a60391Eb51821be373ff978115Ee58488) {
    +++ description: None
      address:
-        "0x0405107a60391Eb51821be373ff978115Ee58488"
+        "eth:0x0405107a60391Eb51821be373ff978115Ee58488"
    }
```

```diff
    contract PedersenHashPointsXColumn (0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1) {
    +++ description: None
      address:
-        "0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
+        "eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
      implementationNames.0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1:
-        "PedersenHashPointsXColumn"
      implementationNames.eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1:
+        "PedersenHashPointsXColumn"
    }
```

```diff
    contract CpuConstraintPoly (0x05C98569CA566a2035b87dE7d1b623C950798035) {
    +++ description: None
      address:
-        "0x05C98569CA566a2035b87dE7d1b623C950798035"
+        "eth:0x05C98569CA566a2035b87dE7d1b623C950798035"
      implementationNames.0x05C98569CA566a2035b87dE7d1b623C950798035:
-        "CpuConstraintPoly"
      implementationNames.eth:0x05C98569CA566a2035b87dE7d1b623C950798035:
+        "CpuConstraintPoly"
    }
```

```diff
    contract CpuFrilessVerifier (0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3) {
    +++ description: None
      address:
-        "0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3"
+        "eth:0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3"
      values.constructorArgs.0.4:
-        "0xE3929Ea107238Ce59d64A3cE497f12b57846B716"
+        "eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"
      values.constructorArgs.0.3:
-        "0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1"
+        "eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1"
      values.constructorArgs.0.2:
-        "0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
+        "eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
      values.constructorArgs.0.1:
-        "0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
+        "eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
      values.constructorArgs.0.0:
-        "0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B"
+        "eth:0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B"
      values.constructorArgs.1:
-        "0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84"
+        "eth:0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84"
      values.constructorArgs.2:
-        "0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
+        "eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
      values.constructorArgs.3:
-        "0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
+        "eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
      implementationNames.0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3:
-        "CpuFrilessVerifier"
      implementationNames.eth:0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3:
+        "CpuFrilessVerifier"
    }
```

```diff
    contract CpuOods (0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb) {
    +++ description: None
      address:
-        "0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb"
+        "eth:0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb"
      implementationNames.0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb:
-        "CpuOods"
      implementationNames.eth:0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb:
+        "CpuOods"
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2) {
    +++ description: None
      address:
-        "0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2"
+        "eth:0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2"
      implementationNames.0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2:
-        "PoseidonPoseidonPartialRoundKey1Column"
      implementationNames.eth:0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2:
+        "PoseidonPoseidonPartialRoundKey1Column"
    }
```

```diff
    contract CpuFrilessVerifier (0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E) {
    +++ description: None
      address:
-        "0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E"
+        "eth:0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E"
      values.constructorArgs.0.4:
-        "0xE3929Ea107238Ce59d64A3cE497f12b57846B716"
+        "eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"
      values.constructorArgs.0.3:
-        "0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1"
+        "eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1"
      values.constructorArgs.0.2:
-        "0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
+        "eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
      values.constructorArgs.0.1:
-        "0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
+        "eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
      values.constructorArgs.0.0:
-        "0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717"
+        "eth:0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717"
      values.constructorArgs.1:
-        "0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb"
+        "eth:0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb"
      values.constructorArgs.2:
-        "0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
+        "eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
      values.constructorArgs.3:
-        "0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
+        "eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
      implementationNames.0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E:
-        "CpuFrilessVerifier"
      implementationNames.eth:0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E:
+        "CpuFrilessVerifier"
    }
```

```diff
    contract PedersenHashPointsYColumn (0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed) {
    +++ description: None
      address:
-        "0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
+        "eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
      implementationNames.0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed:
-        "PedersenHashPointsYColumn"
      implementationNames.eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed:
+        "PedersenHashPointsYColumn"
    }
```

```diff
    contract SHARP Multisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      address:
-        "0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"
+        "eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x0405107a60391Eb51821be373ff978115Ee58488"
+        "eth:0x0405107a60391Eb51821be373ff978115Ee58488"
      values.$members.1:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "eth:0x59232aC80E6d403b6381393e52f4665ECA328558"
      values.$members.2:
-        "0xebc8416179fE90854fe8B3f774801165572cfD7F"
+        "eth:0xebc8416179fE90854fe8B3f774801165572cfD7F"
      values.$members.3:
-        "0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
+        "eth:0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
      implementationNames.0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract CpuFrilessVerifier (0x243682b9A01455ac671c97D8dE686EBd4EE25791) {
    +++ description: None
      address:
-        "0x243682b9A01455ac671c97D8dE686EBd4EE25791"
+        "eth:0x243682b9A01455ac671c97D8dE686EBd4EE25791"
      values.constructorArgs.0.4:
-        "0xE3929Ea107238Ce59d64A3cE497f12b57846B716"
+        "eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"
      values.constructorArgs.0.3:
-        "0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1"
+        "eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1"
      values.constructorArgs.0.2:
-        "0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
+        "eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
      values.constructorArgs.0.1:
-        "0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
+        "eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
      values.constructorArgs.0.0:
-        "0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46"
+        "eth:0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46"
      values.constructorArgs.1:
-        "0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0"
+        "eth:0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0"
      values.constructorArgs.2:
-        "0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
+        "eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
      values.constructorArgs.3:
-        "0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
+        "eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
      implementationNames.0x243682b9A01455ac671c97D8dE686EBd4EE25791:
-        "CpuFrilessVerifier"
      implementationNames.eth:0x243682b9A01455ac671c97D8dE686EBd4EE25791:
+        "CpuFrilessVerifier"
    }
```

```diff
    contract FriStatementContract (0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400) {
    +++ description: None
      address:
-        "0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
+        "eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
      implementationNames.0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400:
-        "FriStatementContract"
      implementationNames.eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400:
+        "FriStatementContract"
    }
```

```diff
    contract MerkleStatementContract (0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd) {
    +++ description: None
      address:
-        "0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
+        "eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
      implementationNames.0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd:
-        "MerkleStatementContract"
      implementationNames.eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd:
+        "MerkleStatementContract"
    }
```

```diff
    contract CpuConstraintPoly (0x351666E9EeA6E012f08695ccd1923f37519563f1) {
    +++ description: None
      address:
-        "0x351666E9EeA6E012f08695ccd1923f37519563f1"
+        "eth:0x351666E9EeA6E012f08695ccd1923f37519563f1"
      implementationNames.0x351666E9EeA6E012f08695ccd1923f37519563f1:
-        "CpuConstraintPoly"
      implementationNames.eth:0x351666E9EeA6E012f08695ccd1923f37519563f1:
+        "CpuConstraintPoly"
    }
```

```diff
    contract CpuFrilessVerifier (0x3d57526c1C8D63fa2A8704487Df65e9000166c8E) {
    +++ description: None
      address:
-        "0x3d57526c1C8D63fa2A8704487Df65e9000166c8E"
+        "eth:0x3d57526c1C8D63fa2A8704487Df65e9000166c8E"
      values.constructorArgs.0.4:
-        "0xE3929Ea107238Ce59d64A3cE497f12b57846B716"
+        "eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"
      values.constructorArgs.0.3:
-        "0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1"
+        "eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1"
      values.constructorArgs.0.2:
-        "0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
+        "eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
      values.constructorArgs.0.1:
-        "0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
+        "eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
      values.constructorArgs.0.0:
-        "0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5"
+        "eth:0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5"
      values.constructorArgs.1:
-        "0xA9db7bDfbc3664C8954f490e4d94B8607a080f23"
+        "eth:0xA9db7bDfbc3664C8954f490e4d94B8607a080f23"
      values.constructorArgs.2:
-        "0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
+        "eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
      values.constructorArgs.3:
-        "0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
+        "eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
      implementationNames.0x3d57526c1C8D63fa2A8704487Df65e9000166c8E:
-        "CpuFrilessVerifier"
      implementationNames.eth:0x3d57526c1C8D63fa2A8704487Df65e9000166c8E:
+        "CpuFrilessVerifier"
    }
```

```diff
    contract CpuFrilessVerifier (0x42AF9498647Be47A256C9cc8278eE94473Cb7771) {
    +++ description: None
      address:
-        "0x42AF9498647Be47A256C9cc8278eE94473Cb7771"
+        "eth:0x42AF9498647Be47A256C9cc8278eE94473Cb7771"
      values.constructorArgs.0.7:
-        "0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2"
+        "eth:0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2"
      values.constructorArgs.0.6:
-        "0x53daC4aB94955f35657463252a7b25F343A14451"
+        "eth:0x53daC4aB94955f35657463252a7b25F343A14451"
      values.constructorArgs.0.5:
-        "0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8"
+        "eth:0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8"
      values.constructorArgs.0.4:
-        "0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc"
+        "eth:0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc"
      values.constructorArgs.0.3:
-        "0xedFfEA8296945aA91FC035Aefc8c33D737dBc573"
+        "eth:0xedFfEA8296945aA91FC035Aefc8c33D737dBc573"
      values.constructorArgs.0.2:
-        "0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
+        "eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
      values.constructorArgs.0.1:
-        "0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
+        "eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
      values.constructorArgs.0.0:
-        "0x05C98569CA566a2035b87dE7d1b623C950798035"
+        "eth:0x05C98569CA566a2035b87dE7d1b623C950798035"
      values.constructorArgs.1:
-        "0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17"
+        "eth:0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17"
      values.constructorArgs.2:
-        "0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
+        "eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
      values.constructorArgs.3:
-        "0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
+        "eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
      implementationNames.0x42AF9498647Be47A256C9cc8278eE94473Cb7771:
-        "CpuFrilessVerifier"
      implementationNames.eth:0x42AF9498647Be47A256C9cc8278eE94473Cb7771:
+        "CpuFrilessVerifier"
    }
```

```diff
    contract SHARPVerifierCallProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay.
      address:
-        "0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"
+        "eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"
      description:
-        "Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows 0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay."
+        "Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay."
+++ severity: HIGH
      values.$admin:
-        "0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"
+        "eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"
      values.$implementation:
-        "0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
+        "eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
      values.$pastUpgrades.0.2.0:
-        "0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
+        "eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
      values.$pastUpgrades.1.2.0:
-        "0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
+        "eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
      values.$pastUpgrades.2.2.0:
-        "0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
+        "eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
      values.$pastUpgrades.3.2.0:
-        "0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
+        "eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
      values.$pastUpgrades.4.2.0:
-        "0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
+        "eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
      values.$pastUpgrades.5.2.0:
-        "0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
+        "eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
      values.$pastUpgrades.6.2.0:
-        "0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
+        "eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
      values.$pastUpgrades.7.2.0:
-        "0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
+        "eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
      values.$pastUpgrades.8.2.0:
-        "0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
+        "eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
      values.callProxyImplementation:
-        "0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"
+        "eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"
      values.implementation:
-        "0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
+        "eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"
      values.StarkWareProxy_callImplementation:
-        "0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"
+        "eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"
      implementationNames.0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60:
-        "Proxy"
      implementationNames.0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458:
-        "CallProxy"
      implementationNames.eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60:
+        "Proxy"
      implementationNames.eth:0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458:
+        "CallProxy"
    }
```

```diff
    contract CpuOods (0x4742f8723CAE9C17Cb1D54708898904fB43621c9) {
    +++ description: None
      address:
-        "0x4742f8723CAE9C17Cb1D54708898904fB43621c9"
+        "eth:0x4742f8723CAE9C17Cb1D54708898904fB43621c9"
      implementationNames.0x4742f8723CAE9C17Cb1D54708898904fB43621c9:
-        "CpuOods"
      implementationNames.eth:0x4742f8723CAE9C17Cb1D54708898904fB43621c9:
+        "CpuOods"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8) {
    +++ description: None
      address:
-        "0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8"
+        "eth:0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8"
      implementationNames.0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8:
-        "PoseidonPoseidonFullRoundKey2Column"
      implementationNames.eth:0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8:
+        "PoseidonPoseidonFullRoundKey2Column"
    }
```

```diff
    contract CpuOods (0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17) {
    +++ description: None
      address:
-        "0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17"
+        "eth:0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17"
      implementationNames.0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17:
-        "CpuOods"
      implementationNames.eth:0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17:
+        "CpuOods"
    }
```

```diff
    contract CpuConstraintPoly (0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5) {
    +++ description: None
      address:
-        "0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5"
+        "eth:0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5"
      implementationNames.0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5:
-        "CpuConstraintPoly"
      implementationNames.eth:0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5:
+        "CpuConstraintPoly"
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (0x53daC4aB94955f35657463252a7b25F343A14451) {
    +++ description: None
      address:
-        "0x53daC4aB94955f35657463252a7b25F343A14451"
+        "eth:0x53daC4aB94955f35657463252a7b25F343A14451"
      implementationNames.0x53daC4aB94955f35657463252a7b25F343A14451:
-        "PoseidonPoseidonPartialRoundKey0Column"
      implementationNames.eth:0x53daC4aB94955f35657463252a7b25F343A14451:
+        "PoseidonPoseidonPartialRoundKey0Column"
    }
```

```diff
    contract CpuConstraintPoly (0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717) {
    +++ description: None
      address:
-        "0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717"
+        "eth:0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717"
      implementationNames.0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717:
-        "CpuConstraintPoly"
      implementationNames.eth:0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717:
+        "CpuConstraintPoly"
    }
```

```diff
    contract CairoBootloaderProgram (0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515) {
    +++ description: Bootloader program for the SHARPVerifier.
      address:
-        "0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515"
+        "eth:0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515"
      implementationNames.0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515:
-        "CairoBootloaderProgram"
      implementationNames.eth:0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515:
+        "CairoBootloaderProgram"
    }
```

```diff
    EOA  (0x59232aC80E6d403b6381393e52f4665ECA328558) {
    +++ description: None
      address:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "eth:0x59232aC80E6d403b6381393e52f4665ECA328558"
    }
```

```diff
    contract CpuFrilessVerifier (0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1) {
    +++ description: None
      address:
-        "0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1"
+        "eth:0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1"
      values.constructorArgs.0.4:
-        "0xE3929Ea107238Ce59d64A3cE497f12b57846B716"
+        "eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"
      values.constructorArgs.0.3:
-        "0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1"
+        "eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1"
      values.constructorArgs.0.2:
-        "0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
+        "eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
      values.constructorArgs.0.1:
-        "0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
+        "eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
      values.constructorArgs.0.0:
-        "0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67"
+        "eth:0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67"
      values.constructorArgs.1:
-        "0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e"
+        "eth:0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e"
      values.constructorArgs.2:
-        "0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
+        "eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
      values.constructorArgs.3:
-        "0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
+        "eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
      implementationNames.0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1:
-        "CpuFrilessVerifier"
      implementationNames.eth:0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1:
+        "CpuFrilessVerifier"
    }
```

```diff
    contract CpuOods (0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e) {
    +++ description: None
      address:
-        "0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e"
+        "eth:0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e"
      implementationNames.0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e:
-        "CpuOods"
      implementationNames.eth:0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e:
+        "CpuOods"
    }
```

```diff
    contract CpuConstraintPoly (0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46) {
    +++ description: None
      address:
-        "0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46"
+        "eth:0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46"
      implementationNames.0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46:
-        "CpuConstraintPoly"
      implementationNames.eth:0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46:
+        "CpuConstraintPoly"
    }
```

```diff
    EOA  (0x955B978F3ee7818dA71fA25c676062E6BC462Fec) {
    +++ description: None
      address:
-        "0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
+        "eth:0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc) {
    +++ description: None
      address:
-        "0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc"
+        "eth:0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc"
      implementationNames.0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc:
-        "PoseidonPoseidonFullRoundKey1Column"
      implementationNames.eth:0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc:
+        "PoseidonPoseidonFullRoundKey1Column"
    }
```

```diff
    contract SHARPVerifier (0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942) {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      address:
-        "0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"
+        "eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"
      values.bootloaderProgramContractAddress:
-        "0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515"
+        "eth:0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515"
      values.cpuFrilessVerifiers.0:
-        "0x3d57526c1C8D63fa2A8704487Df65e9000166c8E"
+        "eth:0x3d57526c1C8D63fa2A8704487Df65e9000166c8E"
      values.cpuFrilessVerifiers.1:
-        "0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3"
+        "eth:0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3"
      values.cpuFrilessVerifiers.2:
-        "0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1"
+        "eth:0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1"
      values.cpuFrilessVerifiers.3:
-        "0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E"
+        "eth:0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E"
      values.cpuFrilessVerifiers.4:
-        "0xAaAe0edF6536de72E7163D293518c40011179f8a"
+        "eth:0xAaAe0edF6536de72E7163D293518c40011179f8a"
      values.cpuFrilessVerifiers.5:
-        "0x243682b9A01455ac671c97D8dE686EBd4EE25791"
+        "eth:0x243682b9A01455ac671c97D8dE686EBd4EE25791"
      values.cpuFrilessVerifiers.6:
-        "0xe155154845950573EC5F518fC0D4950AB71303ff"
+        "eth:0xe155154845950573EC5F518fC0D4950AB71303ff"
      values.cpuFrilessVerifiers.7:
-        "0x42AF9498647Be47A256C9cc8278eE94473Cb7771"
+        "eth:0x42AF9498647Be47A256C9cc8278eE94473Cb7771"
      values.memoryPageFactRegistry:
-        "0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460"
+        "eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460"
      values.referenceFactRegistry:
-        "0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF"
+        "eth:0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF"
      implementationNames.0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942:
-        "GpsStatementVerifier"
      implementationNames.eth:0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942:
+        "GpsStatementVerifier"
    }
```

```diff
    contract CpuConstraintPoly (0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE) {
    +++ description: None
      address:
-        "0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE"
+        "eth:0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE"
      implementationNames.0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE:
-        "CpuConstraintPoly"
      implementationNames.eth:0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE:
+        "CpuConstraintPoly"
    }
```

```diff
    contract CpuOods (0xA9db7bDfbc3664C8954f490e4d94B8607a080f23) {
    +++ description: None
      address:
-        "0xA9db7bDfbc3664C8954f490e4d94B8607a080f23"
+        "eth:0xA9db7bDfbc3664C8954f490e4d94B8607a080f23"
      implementationNames.0xA9db7bDfbc3664C8954f490e4d94B8607a080f23:
-        "CpuOods"
      implementationNames.eth:0xA9db7bDfbc3664C8954f490e4d94B8607a080f23:
+        "CpuOods"
    }
```

```diff
    contract CpuFrilessVerifier (0xAaAe0edF6536de72E7163D293518c40011179f8a) {
    +++ description: None
      address:
-        "0xAaAe0edF6536de72E7163D293518c40011179f8a"
+        "eth:0xAaAe0edF6536de72E7163D293518c40011179f8a"
      values.constructorArgs.0.2:
-        "0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
+        "eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
      values.constructorArgs.0.1:
-        "0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
+        "eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
      values.constructorArgs.0.0:
-        "0x351666E9EeA6E012f08695ccd1923f37519563f1"
+        "eth:0x351666E9EeA6E012f08695ccd1923f37519563f1"
      values.constructorArgs.1:
-        "0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40"
+        "eth:0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40"
      values.constructorArgs.2:
-        "0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
+        "eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
      values.constructorArgs.3:
-        "0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
+        "eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
      implementationNames.0xAaAe0edF6536de72E7163D293518c40011179f8a:
-        "CpuFrilessVerifier"
      implementationNames.eth:0xAaAe0edF6536de72E7163D293518c40011179f8a:
+        "CpuFrilessVerifier"
    }
```

```diff
    contract CpuOods (0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0) {
    +++ description: None
      address:
-        "0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0"
+        "eth:0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0"
      implementationNames.0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0:
-        "CpuOods"
      implementationNames.eth:0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0:
+        "CpuOods"
    }
```

```diff
    contract CpuConstraintPoly (0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67) {
    +++ description: None
      address:
-        "0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67"
+        "eth:0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67"
      implementationNames.0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67:
-        "CpuConstraintPoly"
      implementationNames.eth:0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67:
+        "CpuConstraintPoly"
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF) {
    +++ description: None
      address:
-        "0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF"
+        "eth:0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF"
      implementationNames.0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF:
-        "PoseidonPoseidonPartialRoundKey0Column"
      implementationNames.eth:0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF:
+        "PoseidonPoseidonPartialRoundKey0Column"
    }
```

```diff
    contract CpuConstraintPoly (0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B) {
    +++ description: None
      address:
-        "0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B"
+        "eth:0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B"
      implementationNames.0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B:
-        "CpuConstraintPoly"
      implementationNames.eth:0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B:
+        "CpuConstraintPoly"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540) {
    +++ description: None
      address:
-        "0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540"
+        "eth:0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540"
      implementationNames.0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540:
-        "PoseidonPoseidonFullRoundKey0Column"
      implementationNames.eth:0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540:
+        "PoseidonPoseidonFullRoundKey0Column"
    }
```

```diff
    contract CpuOods (0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40) {
    +++ description: None
      address:
-        "0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40"
+        "eth:0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40"
      implementationNames.0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40:
-        "CpuOods"
      implementationNames.eth:0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40:
+        "CpuOods"
    }
```

```diff
    contract CpuOods (0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84) {
    +++ description: None
      address:
-        "0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84"
+        "eth:0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84"
      implementationNames.0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84:
-        "CpuOods"
      implementationNames.eth:0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84:
+        "CpuOods"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD) {
    +++ description: None
      address:
-        "0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD"
+        "eth:0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD"
      implementationNames.0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD:
-        "PoseidonPoseidonFullRoundKey2Column"
      implementationNames.eth:0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD:
+        "PoseidonPoseidonFullRoundKey2Column"
    }
```

```diff
    contract CpuFrilessVerifier (0xe155154845950573EC5F518fC0D4950AB71303ff) {
    +++ description: None
      address:
-        "0xe155154845950573EC5F518fC0D4950AB71303ff"
+        "eth:0xe155154845950573EC5F518fC0D4950AB71303ff"
      values.constructorArgs.0.9:
-        "0x032e5cDb729Ce94638ACA9e82A22688109B43046"
+        "eth:0x032e5cDb729Ce94638ACA9e82A22688109B43046"
      values.constructorArgs.0.8:
-        "0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF"
+        "eth:0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF"
      values.constructorArgs.0.7:
-        "0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD"
+        "eth:0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD"
      values.constructorArgs.0.6:
-        "0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc"
+        "eth:0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc"
      values.constructorArgs.0.5:
-        "0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540"
+        "eth:0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540"
      values.constructorArgs.0.4:
-        "0xE3929Ea107238Ce59d64A3cE497f12b57846B716"
+        "eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"
      values.constructorArgs.0.3:
-        "0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1"
+        "eth:0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1"
      values.constructorArgs.0.2:
-        "0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
+        "eth:0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed"
      values.constructorArgs.0.1:
-        "0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
+        "eth:0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1"
      values.constructorArgs.0.0:
-        "0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE"
+        "eth:0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE"
      values.constructorArgs.1:
-        "0x4742f8723CAE9C17Cb1D54708898904fB43621c9"
+        "eth:0x4742f8723CAE9C17Cb1D54708898904fB43621c9"
      values.constructorArgs.2:
-        "0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
+        "eth:0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd"
      values.constructorArgs.3:
-        "0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
+        "eth:0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400"
      implementationNames.0xe155154845950573EC5F518fC0D4950AB71303ff:
-        "CpuFrilessVerifier"
      implementationNames.eth:0xe155154845950573EC5F518fC0D4950AB71303ff:
+        "CpuFrilessVerifier"
    }
```

```diff
    contract EcdsaPointsYColumn (0xE3929Ea107238Ce59d64A3cE497f12b57846B716) {
    +++ description: None
      address:
-        "0xE3929Ea107238Ce59d64A3cE497f12b57846B716"
+        "eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716"
      implementationNames.0xE3929Ea107238Ce59d64A3cE497f12b57846B716:
-        "EcdsaPointsYColumn"
      implementationNames.eth:0xE3929Ea107238Ce59d64A3cE497f12b57846B716:
+        "EcdsaPointsYColumn"
    }
```

```diff
    contract MemoryPageFactRegistry (0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460) {
    +++ description: Auxiliary to the SHARPVerifier contract: Verified 'memory fact pages' get stored here. This is important as it registers all necessary onchain data produced by the verifier.
      address:
-        "0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460"
+        "eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460"
      implementationNames.0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460:
-        "MemoryPageFactRegistry"
      implementationNames.eth:0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460:
+        "MemoryPageFactRegistry"
    }
```

```diff
    EOA  (0xebc8416179fE90854fe8B3f774801165572cfD7F) {
    +++ description: None
      address:
-        "0xebc8416179fE90854fe8B3f774801165572cfD7F"
+        "eth:0xebc8416179fE90854fe8B3f774801165572cfD7F"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (0xedFfEA8296945aA91FC035Aefc8c33D737dBc573) {
    +++ description: None
      address:
-        "0xedFfEA8296945aA91FC035Aefc8c33D737dBc573"
+        "eth:0xedFfEA8296945aA91FC035Aefc8c33D737dBc573"
      implementationNames.0xedFfEA8296945aA91FC035Aefc8c33D737dBc573:
-        "PoseidonPoseidonFullRoundKey0Column"
      implementationNames.eth:0xedFfEA8296945aA91FC035Aefc8c33D737dBc573:
+        "PoseidonPoseidonFullRoundKey0Column"
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc) {
    +++ description: None
      address:
-        "0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc"
+        "eth:0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc"
      implementationNames.0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc:
-        "PoseidonPoseidonFullRoundKey1Column"
      implementationNames.eth:0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc:
+        "PoseidonPoseidonFullRoundKey1Column"
    }
```

```diff
+   Status: CREATED
    contract EcdsaPointsXColumn (0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey1Column (0x032e5cDb729Ce94638ACA9e82A22688109B43046)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsXColumn (0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x05C98569CA566a2035b87dE7d1b623C950798035)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey1Column (0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsYColumn (0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SHARP Multisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x243682b9A01455ac671c97D8dE686EBd4EE25791)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FriStatementContract (0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MerkleStatementContract (0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x351666E9EeA6E012f08695ccd1923f37519563f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x3d57526c1C8D63fa2A8704487Df65e9000166c8E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x42AF9498647Be47A256C9cc8278eE94473Cb7771)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SHARPVerifierCallProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60)
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows eth:0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay.
```

```diff
+   Status: CREATED
    contract CpuOods (0x4742f8723CAE9C17Cb1D54708898904fB43621c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey2Column (0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey0Column (0x53daC4aB94955f35657463252a7b25F343A14451)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CairoBootloaderProgram (0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515)
    +++ description: Bootloader program for the SHARPVerifier.
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey1Column (0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SHARPVerifier (0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942)
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xA9db7bDfbc3664C8954f490e4d94B8607a080f23)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0xAaAe0edF6536de72E7163D293518c40011179f8a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey0Column (0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey0Column (0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey2Column (0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0xe155154845950573EC5F518fC0D4950AB71303ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EcdsaPointsYColumn (0xE3929Ea107238Ce59d64A3cE497f12b57846B716)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MemoryPageFactRegistry (0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460)
    +++ description: Auxiliary to the SHARPVerifier contract: Verified 'memory fact pages' get stored here. This is important as it registers all necessary onchain data produced by the verifier.
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey0Column (0xedFfEA8296945aA91FC035Aefc8c33D737dBc573)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey1Column (0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc)
    +++ description: None
```

Generated with discovered.json: 0xf699d39cde57d76ae9259d35fbada301b3dc46fc

# Diff at Fri, 04 Jul 2025 13:26:28 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f3be48c7969ce9c9727876024c540666c2956e91 block: 22472206
- current block number: 22472206

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22472206 (main branch discovery), not current.

```diff
    contract CpuFrilessVerifier (0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3) {
    +++ description: None
      values.constructorArgs.2:
-        "0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460"
    }
```

```diff
    contract CpuFrilessVerifier (0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E) {
    +++ description: None
      values.constructorArgs.2:
-        "0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460"
    }
```

```diff
    contract CpuFrilessVerifier (0x243682b9A01455ac671c97D8dE686EBd4EE25791) {
    +++ description: None
      values.constructorArgs.2:
-        "0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460"
    }
```

```diff
    contract CpuFrilessVerifier (0x3d57526c1C8D63fa2A8704487Df65e9000166c8E) {
    +++ description: None
      values.constructorArgs.2:
-        "0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460"
    }
```

```diff
    contract CpuFrilessVerifier (0x42AF9498647Be47A256C9cc8278eE94473Cb7771) {
    +++ description: None
      values.constructorArgs.2:
-        "0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460"
    }
```

```diff
    contract CpuFrilessVerifier (0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1) {
    +++ description: None
      values.constructorArgs.2:
-        "0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460"
    }
```

```diff
    contract CpuFrilessVerifier (0xAaAe0edF6536de72E7163D293518c40011179f8a) {
    +++ description: None
      values.constructorArgs.2:
-        "0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460"
    }
```

```diff
    contract CpuFrilessVerifier (0xe155154845950573EC5F518fC0D4950AB71303ff) {
    +++ description: None
      values.constructorArgs.2:
-        "0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460"
    }
```

Generated with discovered.json: 0x623297236b1cf486ab08eef72385512ccf17e85d

# Diff at Fri, 04 Jul 2025 12:19:20 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22472206
- current block number: 22472206

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22472206 (main branch discovery), not current.

```diff
    contract SHARP Multisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"
+        "eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"
    }
```

Generated with discovered.json: 0x0b8394f018f9f544be81e8d8e589ecead6b7cda8

# Diff at Fri, 23 May 2025 09:41:04 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22472206
- current block number: 22472206

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22472206 (main branch discovery), not current.

```diff
    contract SHARP Multisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      receivedPermissions.0.role:
+        ".$admin"
    }
```

Generated with discovered.json: 0xca84e6ce394ec8220d1f1afebb375b40956ab646

# Diff at Tue, 13 May 2025 05:48:08 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5ba28053edf7fe0e2de7e027498320d49e46c825 block: 22465351
- current block number: 22472206

## Description

sharp verifier call proxy upgraded: same code, upgrade delay 8d.

## Watched changes

```diff
    contract SHARP Multisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      receivedPermissions.0.delay:
+        691200
    }
```

```diff
    contract SHARPVerifierCallProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows 0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay.
      description:
-        "Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows 0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 0s delay."
+        "Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows 0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 8d delay."
      values.$pastUpgrades.8:
+        ["2022-05-02T16:49:21.000Z","0x604e235c6207b7909f6fc8dc0bd86b410e935dcf2f6f6bd37a5567a89379353a",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]]
      values.$pastUpgrades.7.2:
-        "0x604e235c6207b7909f6fc8dc0bd86b410e935dcf2f6f6bd37a5567a89379353a"
+        "0xc31b74237a0c68aa1b95fe2ed28ad54cf6d7df42a8beab1ea947532c95dda20a"
      values.$pastUpgrades.7.1:
-        "2022-05-02T16:49:21.000Z"
+        "2022-08-07T10:50:09.000Z"
      values.$pastUpgrades.6.2:
-        "0xc31b74237a0c68aa1b95fe2ed28ad54cf6d7df42a8beab1ea947532c95dda20a"
+        "0x4b25445a8e86b4620b9a19f747122b518d8973975ea73aa474b210395e277b66"
      values.$pastUpgrades.6.1:
-        "2022-08-07T10:50:09.000Z"
+        "2024-07-28T20:08:35.000Z"
      values.$pastUpgrades.5.2:
-        "0x4b25445a8e86b4620b9a19f747122b518d8973975ea73aa474b210395e277b66"
+        "0x31e3caf3940dde662a1e98580259f79963dc5e098793b6519311e201d4e19312"
      values.$pastUpgrades.5.1:
-        "2024-07-28T20:08:35.000Z"
+        "2024-02-26T09:25:23.000Z"
      values.$pastUpgrades.3.2:
-        "0x31e3caf3940dde662a1e98580259f79963dc5e098793b6519311e201d4e19312"
+        "0x80ebb7a22a207d00e26464db2f8a719d43eb3b836740a693aad13d5ef922f5e4"
      values.$pastUpgrades.3.1:
-        "2024-02-26T09:25:23.000Z"
+        "2021-10-24T13:06:25.000Z"
      values.$pastUpgrades.2.2:
-        "0x80ebb7a22a207d00e26464db2f8a719d43eb3b836740a693aad13d5ef922f5e4"
+        "0xbaa8ffb1b7e5177dbf75de753b9b2ff2fc313b244ff910cfd6d7f1f6254b6e1a"
      values.$pastUpgrades.2.1:
-        "2021-10-24T13:06:25.000Z"
+        "2023-03-06T12:34:23.000Z"
      values.$pastUpgrades.1.2:
-        "0xbaa8ffb1b7e5177dbf75de753b9b2ff2fc313b244ff910cfd6d7f1f6254b6e1a"
+        "0x7c71592ea4c455371365d843f1a21bbf647aad7d6fae12f7187650ce24805f00"
      values.$pastUpgrades.1.1:
-        "2023-03-06T12:34:23.000Z"
+        "2024-07-28T10:07:47.000Z"
      values.$pastUpgrades.0.2:
-        "0x7c71592ea4c455371365d843f1a21bbf647aad7d6fae12f7187650ce24805f00"
+        "2025-05-12T16:09:35.000Z"
      values.$pastUpgrades.0.1:
-        "2024-07-28T10:07:47.000Z"
+        "0x0764cd09cc5c9a96b151dd222bf14b9c33111c80bdddf27721a6406f4c0e1f3f"
      values.$upgradeCount:
-        8
+        9
      values.getUpgradeActivationDelay:
-        0
+        691200
      values.StarkWareProxy_upgradeDelay:
-        0
+        691200
      values.upgradeActivationDelayFmt:
-        "0s"
+        "8d"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22465351 (main branch discovery), not current.

```diff
    contract SHARPVerifierCallProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows 0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 0s delay.
      description:
-        "Upgradable contract through which the SHARPVerifier can be called. This allows 0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 0s delay."
+        "Upgradable call proxy contract through which the SHARPVerifier can be called. A call proxy does not delegatecall and the storage context remains at the target contract. It allows 0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 0s delay."
    }
```

Generated with discovered.json: 0x0e63db5716c9630ee782d0345007f309df32bb45

# Diff at Tue, 29 Apr 2025 08:19:11 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22346402
- current block number: 22346402

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22346402 (main branch discovery), not current.

```diff
    contract SHARPVerifierCallProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable contract through which the SHARPVerifier can be called. This allows 0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 0s delay.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4","via":[]}]
    }
```

Generated with discovered.json: 0x5b88323f00185a488b376c67a02f6b699a49264c

# Diff at Wed, 19 Mar 2025 13:05:31 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21973570
- current block number: 21973570

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21973570 (main branch discovery), not current.

```diff
    contract SHARP Multisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x0bfeacb83003472906c8c517a766edb2dc1054f8

# Diff at Tue, 18 Mar 2025 08:13:59 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21973570
- current block number: 21973570

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21973570 (main branch discovery), not current.

```diff
    contract SHARP Multisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      name:
-        "SHARPVerifierAdminMultisig"
+        "SHARP Multisig"
    }
```

Generated with discovered.json: 0xe0f61553c95874ea37f793ac24b9ba41c79eb7d4

# Diff at Tue, 04 Mar 2025 12:37:33 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@40abad0e9dad8439d751a811eb767233c5a70a2f block: 21951256
- current block number: 21973570

## Description

removed level 2 and 3 contracts because they are expired. see `isValidOnReference()` in the SHARPVerifier.

config related: starknet discodrive.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21951256 (main branch discovery), not current.

```diff
    contract EcdsaPointsXColumn (0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (0x032e5cDb729Ce94638ACA9e82A22688109B43046) {
    +++ description: None
      sinceBlock:
+        20376819
    }
```

```diff
    contract PedersenHashPointsXColumn (0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly0 (0x04bE0E2D5EcCC744BE21BFb28d91d4a3CBefA8EB)
    +++ description: None
```

```diff
    contract CpuConstraintPoly (0x05C98569CA566a2035b87dE7d1b623C950798035) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
    contract CpuFrilessVerifier (0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3) {
    +++ description: None
      sinceBlock:
+        20376782
    }
```

```diff
    contract CpuOods (0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
    contract CpuFrilessVerifier (0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
    contract PedersenHashPointsYColumn (0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonPartialRoundKey0Column0 (0x1Db84E79E8daEC762d6aDaa5bf358A4Ba001E975)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonFullRoundKey1Column0 (0x1E8E41141347E01f33d84718b7f4cEFB433D5a94)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly1 (0x1F038cdFeEE2Afa44a4213b12A6F0a5A7E6DE676)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonPartialRoundKey1Column0 (0x20F10963eBCA608f8B24a5AEE275861B20ec868E)
    +++ description: None
```

```diff
    contract SHARPVerifierAdminMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      sinceBlock:
+        16770549
    }
```

```diff
    contract CpuFrilessVerifier (0x243682b9A01455ac671c97D8dE686EBd4EE25791) {
    +++ description: None
      sinceBlock:
+        20376816
    }
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier0 (0x28E3aD4201ba416B23d9950503dB28a9232BE32a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonFullRoundKey2Column0 (0x2b159027d7F0E23D5C15b0517e33DdA838C46045)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly2 (0x307982EB84858A04d32b5e0b72D152be5A3eEcEA)
    +++ description: None
```

```diff
    contract FriStatementContract (0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
    contract MerkleStatementContract (0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
    contract CpuConstraintPoly (0x351666E9EeA6E012f08695ccd1923f37519563f1) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
-   Status: DELETED
    contract Level2CpuOods0 (0x367B337Aa4A056CB78Fd74F94E283A73B27DfBB6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2PedersenHashPointsXColumn (0x3d571a45D2B14FF423D2DC4A0e7a46e07D9682bB)
    +++ description: None
```

```diff
    contract CpuFrilessVerifier (0x3d57526c1C8D63fa2A8704487Df65e9000166c8E) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
-   Status: DELETED
    contract Level2MemoryPageFactRegistry (0x40864568f679c10aC9e72211500096a5130770fA)
    +++ description: None
```

```diff
    contract CpuFrilessVerifier (0x42AF9498647Be47A256C9cc8278eE94473Cb7771) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly3 (0x450909cC615036Ca4772dDDd8a69988B031811c9)
    +++ description: None
```

```diff
    contract SHARPVerifierCallProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable contract through which the SHARPVerifier can be called. This allows 0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 0s delay.
      sinceBlock:
+        13480127
    }
```

```diff
-   Status: DELETED
    contract Level2CpuOods1 (0x473E7B002f9A3109fd0FcdA4597935E4E610f367)
    +++ description: None
```

```diff
    contract CpuOods (0x4742f8723CAE9C17Cb1D54708898904fB43621c9) {
    +++ description: None
      sinceBlock:
+        20376820
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
    contract CpuOods (0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
-   Status: DELETED
    contract Level2CpuOods2 (0x4D654CEd9cE0781986A4612C76e3e18D6D3B2fFB)
    +++ description: None
```

```diff
    contract CpuConstraintPoly (0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (0x53daC4aB94955f35657463252a7b25F343A14451) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
    contract CpuConstraintPoly (0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
    contract CairoBootloaderProgram (0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515) {
    +++ description: Bootloader program for the SHARPVerifier.
      sinceBlock:
+        20376781
    }
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier1 (0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier2 (0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460)
    +++ description: None
```

```diff
    contract CpuFrilessVerifier (0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonPartialRoundKey1Column1 (0x62960C874379653D7BBe3644Ac653736Da2eda12)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2MerkleStatementContract (0x634DCf4f1421Fc4D95A968A559a450ad0245804c)
    +++ description: None
```

```diff
    contract CpuOods (0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e) {
    +++ description: None
      sinceBlock:
+        20376782
    }
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier3 (0x66F2345D003511a1A60D87E3984Bb8d12C21A970)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuOods3 (0x697Ce81ea1732c74850Eef111EbC47c0FBd14a0a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level3SHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6)
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
```

```diff
-   Status: DELETED
    contract Level2CpuOods4 (0x704DFf65eD9b3d121d469b7A790A9927C853607F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonPartialRoundKey0Column1 (0x75D887d2437eF87EA17B93143716BECD7BBbCa0a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonFullRoundKey0Column0 (0x8004e851fa3F3C66A3c80e4F7E96559f4C3E16a6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier4 (0x8055948c530dbBc19cc350d53473EEe3a1e3d22B)
    +++ description: None
```

```diff
    contract CpuConstraintPoly (0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
-   Status: DELETED
    contract Level2CpuOods5 (0x88bA01753F2e96C3a00c6aaf76EaEB36Ccf715C1)
    +++ description: None
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc) {
    +++ description: None
      sinceBlock:
+        20376818
    }
```

```diff
-   Status: DELETED
    contract Level2EcdsaPointsYColumn (0x9e4FdD8ff1b11e8f788Af77caA4b0037c137EcC1)
    +++ description: None
```

```diff
    contract SHARPVerifier (0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942) {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      sinceBlock:
+        20407220
    }
```

```diff
    contract CpuConstraintPoly (0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE) {
    +++ description: None
      sinceBlock:
+        20376816
    }
```

```diff
    contract CpuOods (0xA9db7bDfbc3664C8954f490e4d94B8607a080f23) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier5 (0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9)
    +++ description: None
```

```diff
    contract CpuFrilessVerifier (0xAaAe0edF6536de72E7163D293518c40011179f8a) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
    contract CpuOods (0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0) {
    +++ description: None
      sinceBlock:
+        20376785
    }
```

```diff
    contract CpuConstraintPoly (0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67) {
    +++ description: None
      sinceBlock:
+        20376782
    }
```

```diff
-   Status: DELETED
    contract Level2CairoBootloaderProgram (0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40)
    +++ description: Bootloader program for the SHARPVerifier.
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonFullRoundKey2Column1 (0xB5A5759Dd063899F213eB9699906B445f855660D)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly4 (0xB62Dc40175812208f509B69506315A48C92fb15A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuOods6 (0xB640935b164024EF1BC0b9e176432c440a5cd4dc)
    +++ description: None
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF) {
    +++ description: None
      sinceBlock:
+        20376819
    }
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier6 (0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonFullRoundKey1Column1 (0xC2969a099F22430e20bcE237F469ac6F3101Ac5f)
    +++ description: None
```

```diff
    contract CpuConstraintPoly (0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B) {
    +++ description: None
      sinceBlock:
+        20376782
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540) {
    +++ description: None
      sinceBlock:
+        20376816
    }
```

```diff
-   Status: DELETED
    contract Level2EcdsaPointsXColumn (0xcB799CbBd4f5F0a3b6bbd9b55F59E8b301A0286B)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuOods7 (0xCC80e9E852cAE30E2d30d98ab2868648E84BF2A4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly5 (0xcd96f43343Aa06d6ED0D412969c6D462fd17cF02)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2CpuFrilessVerifier7 (0xD0fC19710c389ef4a7244656cB08db08eA9D88b4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Level2SHARPVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF)
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
```

```diff
    contract CpuOods (0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40) {
    +++ description: None
      sinceBlock:
+        20376784
    }
```

```diff
    contract CpuOods (0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84) {
    +++ description: None
      sinceBlock:
+        20376782
    }
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly6 (0xDd4cBe8CC7f420A9576F93E1D1CcC501495B5253)
    +++ description: None
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD) {
    +++ description: None
      sinceBlock:
+        20376818
    }
```

```diff
-   Status: DELETED
    contract Level2FriStatementContract (0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb)
    +++ description: None
```

```diff
    contract CpuFrilessVerifier (0xe155154845950573EC5F518fC0D4950AB71303ff) {
    +++ description: None
      sinceBlock:
+        20376821
    }
```

```diff
    contract EcdsaPointsYColumn (0xE3929Ea107238Ce59d64A3cE497f12b57846B716) {
    +++ description: None
      sinceBlock:
+        20376781
    }
```

```diff
-   Status: DELETED
    contract Level2CpuConstraintPoly7 (0xE5313feE344376D22A42C9F0919e7F0d43920CAc)
    +++ description: None
```

```diff
    contract MemoryPageFactRegistry (0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460) {
    +++ description: Auxiliary to the SHARPVerifier contract: Verified 'memory fact pages' get stored here. This is important as it registers all necessary onchain data produced by the verifier.
      sinceBlock:
+        20376781
    }
```

```diff
-   Status: DELETED
    contract Level2PoseidonPoseidonFullRoundKey0Column1 (0xe7B835eA7e348B25aF2480272C4cA28429573293)
    +++ description: None
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (0xedFfEA8296945aA91FC035Aefc8c33D737dBc573) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc) {
    +++ description: None
      sinceBlock:
+        20377720
    }
```

```diff
-   Status: DELETED
    contract Level2PedersenHashPointsYColumn (0xFD12A123ecf4326E70A4D8b2bC260ec730BBE7Fd)
    +++ description: None
```

Generated with discovered.json: 0xa84d934cf1c8e32e772a9256c107c7b88ece99f3

# Diff at Sat, 01 Mar 2025 11:47:20 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a345eaeb3dc1d9d41bdaf608eb366f7f0aae874a block: 21766214
- current block number: 21951256

## Description

config related: renamed some starknet contracts.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766214 (main branch discovery), not current.

```diff
    contract EcdsaPointsXColumn (0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (0x032e5cDb729Ce94638ACA9e82A22688109B43046) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PedersenHashPointsXColumn (0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly0 (0x04bE0E2D5EcCC744BE21BFb28d91d4a3CBefA8EB) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuConstraintPoly (0x05C98569CA566a2035b87dE7d1b623C950798035) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuFrilessVerifier (0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuFrilessVerifier (0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PedersenHashPointsYColumn (0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey0Column0 (0x1Db84E79E8daEC762d6aDaa5bf358A4Ba001E975) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey1Column0 (0x1E8E41141347E01f33d84718b7f4cEFB433D5a94) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly1 (0x1F038cdFeEE2Afa44a4213b12A6F0a5A7E6DE676) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey1Column0 (0x20F10963eBCA608f8B24a5AEE275861B20ec868E) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract SHARPVerifierAdminMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      severity:
+        "HIGH"
    }
```

```diff
    contract CpuFrilessVerifier (0x243682b9A01455ac671c97D8dE686EBd4EE25791) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier0 (0x28E3aD4201ba416B23d9950503dB28a9232BE32a) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey2Column0 (0x2b159027d7F0E23D5C15b0517e33DdA838C46045) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly2 (0x307982EB84858A04d32b5e0b72D152be5A3eEcEA) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract FriStatementContract (0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract MerkleStatementContract (0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuConstraintPoly (0x351666E9EeA6E012f08695ccd1923f37519563f1) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuOods0 (0x367B337Aa4A056CB78Fd74F94E283A73B27DfBB6) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PedersenHashPointsXColumn (0x3d571a45D2B14FF423D2DC4A0e7a46e07D9682bB) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuFrilessVerifier (0x3d57526c1C8D63fa2A8704487Df65e9000166c8E) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2MemoryPageFactRegistry (0x40864568f679c10aC9e72211500096a5130770fA) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuFrilessVerifier (0x42AF9498647Be47A256C9cc8278eE94473Cb7771) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly3 (0x450909cC615036Ca4772dDDd8a69988B031811c9) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract SHARPVerifierCallProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: Upgradable contract through which the SHARPVerifier can be called. This allows 0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 0s delay.
      name:
-        "SHARPVerifierProxy"
+        "SHARPVerifierCallProxy"
      values.upgradeActivationDelayFmt:
+        "0s"
      template:
+        "shared-sharp-verifier/SHARPVerifierCallProxy"
      description:
+        "Upgradable contract through which the SHARPVerifier can be called. This allows 0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4 to change the otherwise immutable verifier contract with 0s delay."
      fieldMeta:
+        {"$admin":{"severity":"HIGH"}}
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract Level2CpuOods1 (0x473E7B002f9A3109fd0FcdA4597935E4E610f367) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0x4742f8723CAE9C17Cb1D54708898904fB43621c9) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuOods2 (0x4D654CEd9cE0781986A4612C76e3e18D6D3B2fFB) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuConstraintPoly (0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (0x53daC4aB94955f35657463252a7b25F343A14451) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuConstraintPoly (0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CairoBootloaderProgram (0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515) {
    +++ description: Bootloader program for the SHARPVerifier.
      template:
+        "shared-sharp-verifier/CairoBootloaderProgram"
      description:
+        "Bootloader program for the SHARPVerifier."
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier1 (0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier2 (0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuFrilessVerifier (0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey1Column1 (0x62960C874379653D7BBe3644Ac653736Da2eda12) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2MerkleStatementContract (0x634DCf4f1421Fc4D95A968A559a450ad0245804c) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier3 (0x66F2345D003511a1A60D87E3984Bb8d12C21A970) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuOods3 (0x697Ce81ea1732c74850Eef111EbC47c0FBd14a0a) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level3SHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
      name:
-        "OldSHARPVerifier"
+        "Level3SHARPVerifier"
      template:
-        "shared-sharp-verifier/DeprecatedVerifier"
+        "shared-sharp-verifier/Level3SHARPVerifier"
      values.bootloaderProgramContractAddress:
-        "0x0000000000000000000000000000000000000008"
      values.cpuFrilessVerifiers:
-        []
      values.memoryPageFactRegistry:
-        "0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4"
      description:
+        "Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuOods4 (0x704DFf65eD9b3d121d469b7A790A9927C853607F) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey0Column1 (0x75D887d2437eF87EA17B93143716BECD7BBbCa0a) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey0Column0 (0x8004e851fa3F3C66A3c80e4F7E96559f4C3E16a6) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier4 (0x8055948c530dbBc19cc350d53473EEe3a1e3d22B) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuConstraintPoly (0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuOods5 (0x88bA01753F2e96C3a00c6aaf76EaEB36Ccf715C1) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2EcdsaPointsYColumn (0x9e4FdD8ff1b11e8f788Af77caA4b0037c137EcC1) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract SHARPVerifier (0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942) {
    +++ description: Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output.
      template:
-        "shared-sharp-verifier/Verifier"
+        "shared-sharp-verifier/SHARPVerifier"
      description:
+        "Shared Starkware SHARP verifier used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output."
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract CpuConstraintPoly (0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0xA9db7bDfbc3664C8954f490e4d94B8607a080f23) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier5 (0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuFrilessVerifier (0xAaAe0edF6536de72E7163D293518c40011179f8a) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuConstraintPoly (0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CairoBootloaderProgram (0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40) {
    +++ description: Bootloader program for the SHARPVerifier.
      template:
+        "shared-sharp-verifier/CairoBootloaderProgram"
      description:
+        "Bootloader program for the SHARPVerifier."
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey2Column1 (0xB5A5759Dd063899F213eB9699906B445f855660D) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly4 (0xB62Dc40175812208f509B69506315A48C92fb15A) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuOods6 (0xB640935b164024EF1BC0b9e176432c440a5cd4dc) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier6 (0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey1Column1 (0xC2969a099F22430e20bcE237F469ac6F3101Ac5f) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuConstraintPoly (0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2EcdsaPointsXColumn (0xcB799CbBd4f5F0a3b6bbd9b55F59E8b301A0286B) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuOods7 (0xCC80e9E852cAE30E2d30d98ab2868648E84BF2A4) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly5 (0xcd96f43343Aa06d6ED0D412969c6D462fd17cF02) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuFrilessVerifier7 (0xD0fC19710c389ef4a7244656cB08db08eA9D88b4) {
    +++ description: None
      template:
-        "shared-sharp-verifier/CpuFrilessVerifier"
+        "shared-sharp-verifier/Level2CpuFrilessVerifier"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2SHARPVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback
      template:
-        "shared-sharp-verifier/DeprecatedVerifier"
+        "shared-sharp-verifier/Level2SHARPVerifier"
      description:
+        "Old shared Starkware SHARP verifier that was used collectively by Starknet and other SN stack and StarkEx projects. It receives STARK proofs from the Prover and verifies the integrity of the offchain execution including a correctly computed state root which is part of the Program Output. Only used as fallback"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuOods (0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly6 (0xDd4cBe8CC7f420A9576F93E1D1CcC501495B5253) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2FriStatementContract (0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract CpuFrilessVerifier (0xe155154845950573EC5F518fC0D4950AB71303ff) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract EcdsaPointsYColumn (0xE3929Ea107238Ce59d64A3cE497f12b57846B716) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2CpuConstraintPoly7 (0xE5313feE344376D22A42C9F0919e7F0d43920CAc) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract MemoryPageFactRegistry (0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460) {
    +++ description: Auxiliary to the SHARPVerifier contract: Verified 'memory fact pages' get stored here. This is important as it registers all necessary onchain data produced by the verifier.
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/MemoryPageFactRegistry"
      description:
+        "Auxiliary to the SHARPVerifier contract: Verified 'memory fact pages' get stored here. This is important as it registers all necessary onchain data produced by the verifier."
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey0Column1 (0xe7B835eA7e348B25aF2480272C4cA28429573293) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (0xedFfEA8296945aA91FC035Aefc8c33D737dBc573) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract Level2PedersenHashPointsYColumn (0xFD12A123ecf4326E70A4D8b2bC260ec730BBE7Fd) {
    +++ description: None
      template:
-        "shared-sharp-verifier/ignoreCompute"
+        "shared-sharp-verifier/ignoreComputeSpam"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
-   Status: DELETED
    contract OldMemoryPageFactRegistry (0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4)
    +++ description: None
```

Generated with discovered.json: 0x8b4d91c6e108abe69cf276f6947ea54a64b20646

# Diff at Mon, 03 Feb 2025 13:17:17 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3a66ce5694d8c3f9dfc80675eaa6c0bc1a2489b3 block: 20842982
- current block number: 21766214

## Description

Removed EOA permission.

## Watched changes

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6","via":[]}
      values.$admin:
-        ["0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6","0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"]
+        "0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842982 (main branch discovery), not current.

```diff
    contract SHARPVerifierAdminMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      name:
-        "SHARPVerifierGovernorMultisig"
+        "SHARPVerifierAdminMultisig"
    }
```

Generated with discovered.json: 0x3dfb5f7729604707a3662c768eb267e9ca64202e

# Diff at Mon, 20 Jan 2025 11:10:05 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20842982
- current block number: 20842982

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842982 (main branch discovery), not current.

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"
      receivedPermissions.0.from:
+        "0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"
    }
```

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      issuedPermissions.1.target:
-        "0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6"
      issuedPermissions.1.to:
+        "0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6"
      issuedPermissions.0.target:
-        "0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"
      issuedPermissions.0.to:
+        "0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4"
    }
```

Generated with discovered.json: 0x92de448ebe52681a228f7ddc64c08037654355c2

# Diff at Mon, 21 Oct 2024 11:10:09 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20842982
- current block number: 20842982

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842982 (main branch discovery), not current.

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      values.$pastUpgrades.7.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.7.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0x4b25445a8e86b4620b9a19f747122b518d8973975ea73aa474b210395e277b66"
      values.$pastUpgrades.6.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.6.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0x7c71592ea4c455371365d843f1a21bbf647aad7d6fae12f7187650ce24805f00"
      values.$pastUpgrades.5.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.5.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0x31e3caf3940dde662a1e98580259f79963dc5e098793b6519311e201d4e19312"
      values.$pastUpgrades.4.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.4.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0x31e3caf3940dde662a1e98580259f79963dc5e098793b6519311e201d4e19312"
      values.$pastUpgrades.3.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.3.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0xbaa8ffb1b7e5177dbf75de753b9b2ff2fc313b244ff910cfd6d7f1f6254b6e1a"
      values.$pastUpgrades.2.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.2.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0xc31b74237a0c68aa1b95fe2ed28ad54cf6d7df42a8beab1ea947532c95dda20a"
      values.$pastUpgrades.1.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.1.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0x604e235c6207b7909f6fc8dc0bd86b410e935dcf2f6f6bd37a5567a89379353a"
      values.$pastUpgrades.0.2:
+        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
      values.$pastUpgrades.0.1:
-        ["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]
+        "0x80ebb7a22a207d00e26464db2f8a719d43eb3b836740a693aad13d5ef922f5e4"
    }
```

Generated with discovered.json: 0x6664bf1510a000dec22ac5848542740064506791

# Diff at Mon, 14 Oct 2024 10:55:45 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20842982
- current block number: 20842982

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842982 (main branch discovery), not current.

```diff
    contract EcdsaPointsXColumn (0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1) {
    +++ description: None
      sourceHashes:
+        ["0x412fb414e7fea74325d60a077f704a49cf6d23a7a1d43c9fd09be7e9a4e5e76f"]
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (0x032e5cDb729Ce94638ACA9e82A22688109B43046) {
    +++ description: None
      sourceHashes:
+        ["0x5e84fb9b706cdc8accbf714b0921245dc0fa26f9b14bbeb97b3d347abd832b5d"]
    }
```

```diff
    contract PedersenHashPointsXColumn (0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1) {
    +++ description: None
      sourceHashes:
+        ["0x6eb94f42b6ee59326d27f5ec055a5872adf1df7825af5df411459832c72ba175"]
    }
```

```diff
    contract Level2CpuConstraintPoly0 (0x04bE0E2D5EcCC744BE21BFb28d91d4a3CBefA8EB) {
    +++ description: None
      sourceHashes:
+        ["0x23119114187536afb19dd113fa8b7a5e59da2d76ff5ad78bde5efe9dabe09c67"]
    }
```

```diff
    contract CpuConstraintPoly (0x05C98569CA566a2035b87dE7d1b623C950798035) {
    +++ description: None
      sourceHashes:
+        ["0x23119114187536afb19dd113fa8b7a5e59da2d76ff5ad78bde5efe9dabe09c67"]
    }
```

```diff
    contract CpuFrilessVerifier (0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3) {
    +++ description: None
      sourceHashes:
+        ["0xa78b7bb374044ea6a603766c4b16c5d1ec5573ddc1dfb9b9413701020ebfe195"]
    }
```

```diff
    contract CpuOods (0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb) {
    +++ description: None
      sourceHashes:
+        ["0x0436bd83534187cf17ffbb4cc97b6caab2a1ac66d80a9daef6d6589e93bb4c77"]
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey1Column (0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2) {
    +++ description: None
      sourceHashes:
+        ["0x5e84fb9b706cdc8accbf714b0921245dc0fa26f9b14bbeb97b3d347abd832b5d"]
    }
```

```diff
    contract CpuFrilessVerifier (0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E) {
    +++ description: None
      sourceHashes:
+        ["0x6156385d69e1bf7290adaaaa1e5d33748df1c8da588f686403aca38710f05693"]
    }
```

```diff
    contract PedersenHashPointsYColumn (0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed) {
    +++ description: None
      sourceHashes:
+        ["0x05c19e648542d62b4ddf24a4fa4c15a3a6e25cd850736e41c5544eb570a9f2a2"]
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey0Column0 (0x1Db84E79E8daEC762d6aDaa5bf358A4Ba001E975) {
    +++ description: None
      sourceHashes:
+        ["0x25dd1929fec2a9443c338244c4662b650c29efb6cf29691e799b2046bb1e138b"]
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey1Column0 (0x1E8E41141347E01f33d84718b7f4cEFB433D5a94) {
    +++ description: None
      sourceHashes:
+        ["0x0b3787429d9d8281d861b3ec991d3042eed31b610240e2a0310d8f59ef194622"]
    }
```

```diff
    contract Level2CpuConstraintPoly1 (0x1F038cdFeEE2Afa44a4213b12A6F0a5A7E6DE676) {
    +++ description: None
      sourceHashes:
+        ["0x5014b4dd4ac75d575b7511cda643b511a4f57eaffccb5aad8fe12fd2a412be65"]
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey1Column0 (0x20F10963eBCA608f8B24a5AEE275861B20ec868E) {
    +++ description: None
      sourceHashes:
+        ["0x5e84fb9b706cdc8accbf714b0921245dc0fa26f9b14bbeb97b3d347abd832b5d"]
    }
```

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract CpuFrilessVerifier (0x243682b9A01455ac671c97D8dE686EBd4EE25791) {
    +++ description: None
      sourceHashes:
+        ["0xdea77b54fa6a0489f5a57f0dc4ade2e0082aa3017b33bb8b4c47b5c693c65383"]
    }
```

```diff
    contract Level2CpuFrilessVerifier0 (0x28E3aD4201ba416B23d9950503dB28a9232BE32a) {
    +++ description: None
      sourceHashes:
+        ["0xf51c19545fc3804626755b86bd142a8c98efcbfacbd2499b1ae9ecda7a163540"]
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey2Column0 (0x2b159027d7F0E23D5C15b0517e33DdA838C46045) {
    +++ description: None
      sourceHashes:
+        ["0x57c50a0d1562f3139dbb628a80e20f0d13db2a8eec9672350c40e474bed459f6"]
    }
```

```diff
    contract Level2CpuConstraintPoly2 (0x307982EB84858A04d32b5e0b72D152be5A3eEcEA) {
    +++ description: None
      sourceHashes:
+        ["0x8caeb68cf2d1508fc57800f8ff78ad1b3c9ad8d0f1f6e30998fd012c9b6182ba"]
    }
```

```diff
    contract FriStatementContract (0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400) {
    +++ description: None
      sourceHashes:
+        ["0xdb6522c746b47c8025bdd3942737207a45de03416b891219d4ad3328e3cbcb07"]
    }
```

```diff
    contract MerkleStatementContract (0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd) {
    +++ description: None
      sourceHashes:
+        ["0x353a1ed6ef3ef47ed725cf0832c357c4e71680318751a7bbd706d607d8acb7aa"]
    }
```

```diff
    contract CpuConstraintPoly (0x351666E9EeA6E012f08695ccd1923f37519563f1) {
    +++ description: None
      sourceHashes:
+        ["0xc6b85b7926407ac9352754cb496033d4bf5689bc99395d4b8b15d2d79b245209"]
    }
```

```diff
    contract Level2CpuOods0 (0x367B337Aa4A056CB78Fd74F94E283A73B27DfBB6) {
    +++ description: None
      sourceHashes:
+        ["0x9c476ab40346f6531ff512dbd20c84273a3cca2fb0e870b6aed5c67aa20d32f8"]
    }
```

```diff
    contract Level2PedersenHashPointsXColumn (0x3d571a45D2B14FF423D2DC4A0e7a46e07D9682bB) {
    +++ description: None
      sourceHashes:
+        ["0x6eb94f42b6ee59326d27f5ec055a5872adf1df7825af5df411459832c72ba175"]
    }
```

```diff
    contract CpuFrilessVerifier (0x3d57526c1C8D63fa2A8704487Df65e9000166c8E) {
    +++ description: None
      sourceHashes:
+        ["0x0bb18873bc3a6a2cc498c681c3bc67777185bf377294eb531123d4529deb8b38"]
    }
```

```diff
    contract Level2MemoryPageFactRegistry (0x40864568f679c10aC9e72211500096a5130770fA) {
    +++ description: None
      sourceHashes:
+        ["0x388a630368c27b0a52e63f2233c93b88a5fc3100ba178780176dceba351487fa"]
    }
```

```diff
    contract CpuFrilessVerifier (0x42AF9498647Be47A256C9cc8278eE94473Cb7771) {
    +++ description: None
      sourceHashes:
+        ["0xcc5a725835dea04291bf4edd2b8b39c4d15358a01b6baa116e9aede7b897fdf4"]
    }
```

```diff
    contract Level2CpuConstraintPoly3 (0x450909cC615036Ca4772dDDd8a69988B031811c9) {
    +++ description: None
      sourceHashes:
+        ["0x7022113b2e37d8a13b820de3fc4a30b173169193b244b19c704a5d9411e37ad0"]
    }
```

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      sourceHashes:
+        ["0x1cfb47b7d41edbe1b49e9d32ab6b39caae53d74feac405b948cc774b2d8db7a5","0x1993eaf381afc46f98a6d57b20658554efa839ecfb519a698bf45042d7ff5b27"]
    }
```

```diff
    contract Level2CpuOods1 (0x473E7B002f9A3109fd0FcdA4597935E4E610f367) {
    +++ description: None
      sourceHashes:
+        ["0x2263b0314ef958372095f3d5a50817b8f1de525cc589a9a6acd462814968c84a"]
    }
```

```diff
    contract CpuOods (0x4742f8723CAE9C17Cb1D54708898904fB43621c9) {
    +++ description: None
      sourceHashes:
+        ["0x9c476ab40346f6531ff512dbd20c84273a3cca2fb0e870b6aed5c67aa20d32f8"]
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8) {
    +++ description: None
      sourceHashes:
+        ["0x57c50a0d1562f3139dbb628a80e20f0d13db2a8eec9672350c40e474bed459f6"]
    }
```

```diff
    contract CpuOods (0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17) {
    +++ description: None
      sourceHashes:
+        ["0x01d75ee9eb5d04eb0bdef657f41a7a4953dfc1dbb219b2c2c4504f988d4054da"]
    }
```

```diff
    contract Level2CpuOods2 (0x4D654CEd9cE0781986A4612C76e3e18D6D3B2fFB) {
    +++ description: None
      sourceHashes:
+        ["0x0436bd83534187cf17ffbb4cc97b6caab2a1ac66d80a9daef6d6589e93bb4c77"]
    }
```

```diff
    contract CpuConstraintPoly (0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5) {
    +++ description: None
      sourceHashes:
+        ["0x7022113b2e37d8a13b820de3fc4a30b173169193b244b19c704a5d9411e37ad0"]
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (0x53daC4aB94955f35657463252a7b25F343A14451) {
    +++ description: None
      sourceHashes:
+        ["0x25dd1929fec2a9443c338244c4662b650c29efb6cf29691e799b2046bb1e138b"]
    }
```

```diff
    contract CpuConstraintPoly (0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717) {
    +++ description: None
      sourceHashes:
+        ["0x5014b4dd4ac75d575b7511cda643b511a4f57eaffccb5aad8fe12fd2a412be65"]
    }
```

```diff
    contract CairoBootloaderProgram (0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515) {
    +++ description: None
      sourceHashes:
+        ["0xf4a899549b88ecceef625c257853e823973744ca16b4e995c327f29be092cc3c"]
    }
```

```diff
    contract Level2CpuFrilessVerifier1 (0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d) {
    +++ description: None
      sourceHashes:
+        ["0x455c07ce6901510356c3380308551257434cb25c1460e324772f60468e46682a"]
    }
```

```diff
    contract Level2CpuFrilessVerifier2 (0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460) {
    +++ description: None
      sourceHashes:
+        ["0xb1d6c8068e8976bde7fbfd4294f8808b6d28efd5d87ca84820a7e3e890446761"]
    }
```

```diff
    contract CpuFrilessVerifier (0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1) {
    +++ description: None
      sourceHashes:
+        ["0x6c96d348b73a5436aaac0d8de8c5f06a7a625c1ff02b0c069fc677f0ac01c009"]
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey1Column1 (0x62960C874379653D7BBe3644Ac653736Da2eda12) {
    +++ description: None
      sourceHashes:
+        ["0x5e84fb9b706cdc8accbf714b0921245dc0fa26f9b14bbeb97b3d347abd832b5d"]
    }
```

```diff
    contract Level2MerkleStatementContract (0x634DCf4f1421Fc4D95A968A559a450ad0245804c) {
    +++ description: None
      sourceHashes:
+        ["0x353a1ed6ef3ef47ed725cf0832c357c4e71680318751a7bbd706d607d8acb7aa"]
    }
```

```diff
    contract CpuOods (0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e) {
    +++ description: None
      sourceHashes:
+        ["0x2263b0314ef958372095f3d5a50817b8f1de525cc589a9a6acd462814968c84a"]
    }
```

```diff
    contract Level2CpuFrilessVerifier3 (0x66F2345D003511a1A60D87E3984Bb8d12C21A970) {
    +++ description: None
      sourceHashes:
+        ["0x0a08e622000c261c38a85bb0054bb2b50ae684e6edf79f0986e931d10fc5c277"]
    }
```

```diff
    contract Level2CpuOods3 (0x697Ce81ea1732c74850Eef111EbC47c0FBd14a0a) {
    +++ description: None
      sourceHashes:
+        ["0x01d75ee9eb5d04eb0bdef657f41a7a4953dfc1dbb219b2c2c4504f988d4054da"]
    }
```

```diff
    contract OldSHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    +++ description: None
      sourceHashes:
+        ["0x4a3316e3eb418f807ad2271f24b4764f4069731c7be4041cf2574e66ee2b20cc"]
    }
```

```diff
    contract Level2CpuOods4 (0x704DFf65eD9b3d121d469b7A790A9927C853607F) {
    +++ description: None
      sourceHashes:
+        ["0xea43d74304db71ee531509d5f054b9172347c79c10ce2ef9fe7da542b11b420b"]
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey0Column1 (0x75D887d2437eF87EA17B93143716BECD7BBbCa0a) {
    +++ description: None
      sourceHashes:
+        ["0x25dd1929fec2a9443c338244c4662b650c29efb6cf29691e799b2046bb1e138b"]
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey0Column0 (0x8004e851fa3F3C66A3c80e4F7E96559f4C3E16a6) {
    +++ description: None
      sourceHashes:
+        ["0xa1aa27ff7953106ca4dfbaa9583880e2df0d01bf601c63858504ed7fefc2261c"]
    }
```

```diff
    contract Level2CpuFrilessVerifier4 (0x8055948c530dbBc19cc350d53473EEe3a1e3d22B) {
    +++ description: None
      sourceHashes:
+        ["0xdc9bb80d233601bb801b1e447c903b9c5a929f3630f4e158f75b9931e44beb9f"]
    }
```

```diff
    contract CpuConstraintPoly (0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46) {
    +++ description: None
      sourceHashes:
+        ["0xa863111e2d969c242b95e592a09048d8ae0e7c2b8c4e5d237f420f2ae9d6b6b0"]
    }
```

```diff
    contract Level2CpuOods5 (0x88bA01753F2e96C3a00c6aaf76EaEB36Ccf715C1) {
    +++ description: None
      sourceHashes:
+        ["0x996c7267677d4955986302f31421117e77179197ff49e9dab8e8fff5c0f41257"]
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc) {
    +++ description: None
      sourceHashes:
+        ["0x0b3787429d9d8281d861b3ec991d3042eed31b610240e2a0310d8f59ef194622"]
    }
```

```diff
    contract Level2EcdsaPointsYColumn (0x9e4FdD8ff1b11e8f788Af77caA4b0037c137EcC1) {
    +++ description: None
      sourceHashes:
+        ["0x16786b57094cb8c3157552703287a310748c4453d743f9f2fa22adc7a6bf991c"]
    }
```

```diff
    contract SHARPVerifier (0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942) {
    +++ description: None
      sourceHashes:
+        ["0x851b82890362af9467218d27c5666552421bca8023529b83632b6ebc4cc6bc8f"]
    }
```

```diff
    contract CpuConstraintPoly (0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE) {
    +++ description: None
      sourceHashes:
+        ["0x5595d4856475241caf1eea25b1f3921875fcd4f8f0481ef29d2cae21d74394fb"]
    }
```

```diff
    contract CpuOods (0xA9db7bDfbc3664C8954f490e4d94B8607a080f23) {
    +++ description: None
      sourceHashes:
+        ["0xea43d74304db71ee531509d5f054b9172347c79c10ce2ef9fe7da542b11b420b"]
    }
```

```diff
    contract Level2CpuFrilessVerifier5 (0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9) {
    +++ description: None
      sourceHashes:
+        ["0x130226ac91c1d6deb82b863eea95c84640b9c20c1e292b26cb88fc6db73c0b15"]
    }
```

```diff
    contract CpuFrilessVerifier (0xAaAe0edF6536de72E7163D293518c40011179f8a) {
    +++ description: None
      sourceHashes:
+        ["0x683cac2609eeb80f624fedec43b3622138b0579960bf74162c2f49eebd1e1b4d"]
    }
```

```diff
    contract CpuOods (0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0) {
    +++ description: None
      sourceHashes:
+        ["0xeb39302b38f5f5b329700407c9c1c9f7b90dd0550f5bc4d1273e365ff48b5eb3"]
    }
```

```diff
    contract CpuConstraintPoly (0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67) {
    +++ description: None
      sourceHashes:
+        ["0x8caeb68cf2d1508fc57800f8ff78ad1b3c9ad8d0f1f6e30998fd012c9b6182ba"]
    }
```

```diff
    contract Level2CairoBootloaderProgram (0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40) {
    +++ description: None
      sourceHashes:
+        ["0xbeae5546b3ade5af5df9bfc3c26b178639a7c992a8d59b98a3fbb46dfe0c3a2c"]
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey2Column1 (0xB5A5759Dd063899F213eB9699906B445f855660D) {
    +++ description: None
      sourceHashes:
+        ["0x57c50a0d1562f3139dbb628a80e20f0d13db2a8eec9672350c40e474bed459f6"]
    }
```

```diff
    contract Level2CpuConstraintPoly4 (0xB62Dc40175812208f509B69506315A48C92fb15A) {
    +++ description: None
      sourceHashes:
+        ["0x7deae45fbdef9d73c9faefb89a11904e2f2bd48e4cb9365f1ba55739857cbc62"]
    }
```

```diff
    contract Level2CpuOods6 (0xB640935b164024EF1BC0b9e176432c440a5cd4dc) {
    +++ description: None
      sourceHashes:
+        ["0x6e983e16c9f7b72cb7f29f2e7fcb0061acc1622409a2e45534fa03fd05ff9672"]
    }
```

```diff
    contract PoseidonPoseidonPartialRoundKey0Column (0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF) {
    +++ description: None
      sourceHashes:
+        ["0x25dd1929fec2a9443c338244c4662b650c29efb6cf29691e799b2046bb1e138b"]
    }
```

```diff
    contract Level2CpuFrilessVerifier6 (0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc) {
    +++ description: None
      sourceHashes:
+        ["0xb44fea2230221135a15c6fbca5ca2f96e5962e3c7e3ec951f0971b590d8962a5"]
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey1Column1 (0xC2969a099F22430e20bcE237F469ac6F3101Ac5f) {
    +++ description: None
      sourceHashes:
+        ["0x0b3787429d9d8281d861b3ec991d3042eed31b610240e2a0310d8f59ef194622"]
    }
```

```diff
    contract CpuConstraintPoly (0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B) {
    +++ description: None
      sourceHashes:
+        ["0x7deae45fbdef9d73c9faefb89a11904e2f2bd48e4cb9365f1ba55739857cbc62"]
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540) {
    +++ description: None
      sourceHashes:
+        ["0xa1aa27ff7953106ca4dfbaa9583880e2df0d01bf601c63858504ed7fefc2261c"]
    }
```

```diff
    contract Level2EcdsaPointsXColumn (0xcB799CbBd4f5F0a3b6bbd9b55F59E8b301A0286B) {
    +++ description: None
      sourceHashes:
+        ["0x412fb414e7fea74325d60a077f704a49cf6d23a7a1d43c9fd09be7e9a4e5e76f"]
    }
```

```diff
    contract Level2CpuOods7 (0xCC80e9E852cAE30E2d30d98ab2868648E84BF2A4) {
    +++ description: None
      sourceHashes:
+        ["0xeb39302b38f5f5b329700407c9c1c9f7b90dd0550f5bc4d1273e365ff48b5eb3"]
    }
```

```diff
    contract Level2CpuConstraintPoly5 (0xcd96f43343Aa06d6ED0D412969c6D462fd17cF02) {
    +++ description: None
      sourceHashes:
+        ["0xc6b85b7926407ac9352754cb496033d4bf5689bc99395d4b8b15d2d79b245209"]
    }
```

```diff
    contract Level2CpuFrilessVerifier7 (0xD0fC19710c389ef4a7244656cB08db08eA9D88b4) {
    +++ description: None
      sourceHashes:
+        ["0x85234db76e94b2ff3ad7e2f2a1b16709e261ffc53900bb726e05cf1ee79811aa"]
    }
```

```diff
    contract Level2SHARPVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: None
      sourceHashes:
+        ["0xbe473240e6de093ae7120378ade4c19b5ab4bbe69143651df5cc3fe66c33c3eb"]
    }
```

```diff
    contract CpuOods (0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40) {
    +++ description: None
      sourceHashes:
+        ["0x6e983e16c9f7b72cb7f29f2e7fcb0061acc1622409a2e45534fa03fd05ff9672"]
    }
```

```diff
    contract CpuOods (0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84) {
    +++ description: None
      sourceHashes:
+        ["0x996c7267677d4955986302f31421117e77179197ff49e9dab8e8fff5c0f41257"]
    }
```

```diff
    contract Level2CpuConstraintPoly6 (0xDd4cBe8CC7f420A9576F93E1D1CcC501495B5253) {
    +++ description: None
      sourceHashes:
+        ["0x5595d4856475241caf1eea25b1f3921875fcd4f8f0481ef29d2cae21d74394fb"]
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey2Column (0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD) {
    +++ description: None
      sourceHashes:
+        ["0x57c50a0d1562f3139dbb628a80e20f0d13db2a8eec9672350c40e474bed459f6"]
    }
```

```diff
    contract Level2FriStatementContract (0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb) {
    +++ description: None
      sourceHashes:
+        ["0xdb6522c746b47c8025bdd3942737207a45de03416b891219d4ad3328e3cbcb07"]
    }
```

```diff
    contract CpuFrilessVerifier (0xe155154845950573EC5F518fC0D4950AB71303ff) {
    +++ description: None
      sourceHashes:
+        ["0x16540ae818b59b005fe1cee4b1fbc4d3e29806d95076929b196adc7e3f347522"]
    }
```

```diff
    contract EcdsaPointsYColumn (0xE3929Ea107238Ce59d64A3cE497f12b57846B716) {
    +++ description: None
      sourceHashes:
+        ["0x16786b57094cb8c3157552703287a310748c4453d743f9f2fa22adc7a6bf991c"]
    }
```

```diff
    contract Level2CpuConstraintPoly7 (0xE5313feE344376D22A42C9F0919e7F0d43920CAc) {
    +++ description: None
      sourceHashes:
+        ["0xa863111e2d969c242b95e592a09048d8ae0e7c2b8c4e5d237f420f2ae9d6b6b0"]
    }
```

```diff
    contract MemoryPageFactRegistry (0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460) {
    +++ description: None
      sourceHashes:
+        ["0x122eb6d5583cc680f59abc49750d9d6c0a65ca937e292b2ce67e18e8a8cdb114"]
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey0Column1 (0xe7B835eA7e348B25aF2480272C4cA28429573293) {
    +++ description: None
      sourceHashes:
+        ["0xa1aa27ff7953106ca4dfbaa9583880e2df0d01bf601c63858504ed7fefc2261c"]
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey0Column (0xedFfEA8296945aA91FC035Aefc8c33D737dBc573) {
    +++ description: None
      sourceHashes:
+        ["0xa1aa27ff7953106ca4dfbaa9583880e2df0d01bf601c63858504ed7fefc2261c"]
    }
```

```diff
    contract PoseidonPoseidonFullRoundKey1Column (0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc) {
    +++ description: None
      sourceHashes:
+        ["0x0b3787429d9d8281d861b3ec991d3042eed31b610240e2a0310d8f59ef194622"]
    }
```

```diff
    contract Level2PedersenHashPointsYColumn (0xFD12A123ecf4326E70A4D8b2bC260ec730BBE7Fd) {
    +++ description: None
      sourceHashes:
+        ["0x05c19e648542d62b4ddf24a4fa4c15a3a6e25cd850736e41c5544eb570a9f2a2"]
    }
```

```diff
    contract OldMemoryPageFactRegistry (0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4) {
    +++ description: None
      sourceHashes:
+        ["0xb58bf9ec993cfca7aa0c9a3df23c2bbab281d357b8088ea5769d57a6a38352a6"]
    }
```

Generated with discovered.json: 0x655bf55d66d80bcdb4dd88847fe4b44a090b1bdf

# Diff at Tue, 01 Oct 2024 11:34:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@44a272605826a951722a52b2a862abdf86e16896 block: 20842982
- current block number: 20842982

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842982 (main branch discovery), not current.

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-10-24T13:06:25.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]],["2022-05-02T16:49:21.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]],["2022-08-07T10:50:09.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]],["2023-03-06T12:34:23.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]],["2024-02-26T09:25:23.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]],["2024-02-26T09:25:23.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]],["2024-07-28T10:07:47.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]],["2024-07-28T20:08:35.000Z",["0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458"]]]
      values.$upgradeCount:
+        8
    }
```

Generated with discovered.json: 0xb29a39303bfc9827c15a8514e8c3e6f06ac66853

# Diff at Fri, 27 Sep 2024 15:54:28 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20756791
- current block number: 20842982

## Description

Add signer to SHARPVerifierGovernorMultisig.

## Watched changes

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      values.$members.3:
+        "0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
      values.$members.2:
-        "0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
+        "0xebc8416179fE90854fe8B3f774801165572cfD7F"
      values.$members.1:
-        "0xebc8416179fE90854fe8B3f774801165572cfD7F"
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
      values.$members.0:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0x0405107a60391Eb51821be373ff978115Ee58488"
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "2 of 4 (50%)"
    }
```

Generated with discovered.json: 0x23ac602e5cc33add49f501507d85408bc3f89b74

# Diff at Sun, 15 Sep 2024 15:05:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ca08843b12ed576cbcc139ad58ca045f72d96ab5 block: 20440714
- current block number: 20756791

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20440714 (main branch discovery), not current.

```diff
    contract OldSHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    +++ description: None
      values.bootloaderProgramContractAddress:
+        "0x0000000000000000000000000000000000000008"
      values.cpuFrilessVerifiers:
+        []
    }
```

Generated with discovered.json: 0xaeb113ee3aa75cca1c42a7ad41806c76eee26522

# Diff at Fri, 30 Aug 2024 07:59:26 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20440714
- current block number: 20440714

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20440714 (main branch discovery), not current.

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x65d0556fcac240a27d3265cc50da97e98f8a9c77

# Diff at Wed, 21 Aug 2024 10:05:46 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20440714
- current block number: 20440714

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20440714 (main branch discovery), not current.

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60","via":[]}]
    }
```

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4","via":[]},{"permission":"upgrade","target":"0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6","via":[]}]
    }
```

Generated with discovered.json: 0x86e2a6fc9a2b8c94699e05c077c90d8bf04f6370

# Diff at Fri, 09 Aug 2024 10:12:10 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20440714
- current block number: 20440714

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20440714 (main branch discovery), not current.

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"]
      assignedPermissions.upgrade:
+        ["0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"]
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x59232aC80E6d403b6381393e52f4665ECA328558","0xebc8416179fE90854fe8B3f774801165572cfD7F","0x955B978F3ee7818dA71fA25c676062E6BC462Fec"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x59232aC80E6d403b6381393e52f4665ECA328558","0xebc8416179fE90854fe8B3f774801165572cfD7F","0x955B978F3ee7818dA71fA25c676062E6BC462Fec"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0xc4095b9fe151aa9ae9134c09679c785f7ae93b43

# Diff at Fri, 02 Aug 2024 12:00:46 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6303daac6763b37e188cf2b2de396f3d25372c89 block: 19531641
- current block number: 20440714

## Description

A new GpsStatementVerifier (SHARPVerifier) is deployed and registered with all its relatives:
- `constant N_BUILTINS` increased from 9 to 11 (https://docs.cairo-lang.org/how_cairo_works/builtins.html)
- introduction of `applicativeBootloaderProgramHash_` in addition to the old `simpleBootloaderProgramHash_`
- `OFFSET_N_VERIFIER_FRIENDLY_LAYERS` introduced in the offsets section
- `PROGRAM_SIZE` increased from 728 to 794

A related commit to the cairo repo [can be found here](https://github.com/starkware-libs/cairo-lang/commit/0e4dab8a6065d80d1c726394f5d9d23cb451706a). 

The discovery config now uses templates and recursively discovers old verifiers and their relatives.

### Applicative bootloader upgrade
Check out the excalidraw: https://app.excalidraw.com/s/1Pobo8fNXle/4L6PujZS81l
Copypaste summary from Bartek's research:
- Bootloader that they are using rn allows for running a list of Tasks. Each Task produces an output and these outputs are streamed to DA layer. It's very simple.
- Now they have introduced a new bootloader (CAIRO program) called applicative bootloader. Think about it as a program that runs a sequence of Base Tasks programs (e.g. StarkNet os), then runs an Aggregator Task program which takes output from Base programs, merges that output and produces "aggregated" output.
- If you tried to run the same sequence (couple of Base Tasks + Aggregator) you would produce output from both Base Tasks AND the Aggretor which kind of defeats the purpose of the Aggregator. With applicative bootloader you only have output from the Aggregator (+ hash of Base Task so that you know what was actually aggregated).
- my understanding is that Sharp is now "ready" but since they haven't upgraded the StarkNet core contract, they are not using this feature yet

## Watched changes

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      values.callProxyImplementation:
-        "0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF"
+        "0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"
      values.StarkWareProxy_callImplementation:
-        "0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF"
+        "0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942"
    }
```

```diff
    contract Level2SHARPVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: None
      template:
-        "shared-sharp-verifier/Verifier"
+        "shared-sharp-verifier/DeprecatedVerifier"
    }
```

```diff
+   Status: CREATED
    contract EcdsaPointsXColumn (0x01228f83C6664A14fC3Bb4EA28B7d1a2FC283bF1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey1Column (0x032e5cDb729Ce94638ACA9e82A22688109B43046)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsXColumn (0x047Dd4275bbDc1eE6b8bf026239E203c617E86D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x05C98569CA566a2035b87dE7d1b623C950798035)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey1Column (0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsYColumn (0x1A6F3bD4E4b80F85A0b1974b73D981F3295899ed)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x243682b9A01455ac671c97D8dE686EBd4EE25791)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FriStatementContract (0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MerkleStatementContract (0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x351666E9EeA6E012f08695ccd1923f37519563f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x3d57526c1C8D63fa2A8704487Df65e9000166c8E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x42AF9498647Be47A256C9cc8278eE94473Cb7771)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x4742f8723CAE9C17Cb1D54708898904fB43621c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey2Column (0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey0Column (0x53daC4aB94955f35657463252a7b25F343A14451)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CairoBootloaderProgram (0x58600A1Dc51dcF7D4F541a8f1F5C6c6AA86cc515)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey1Column (0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SHARPVerifier (0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xA9db7bDfbc3664C8954f490e4d94B8607a080f23)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0xAaAe0edF6536de72E7163D293518c40011179f8a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonPartialRoundKey0Column (0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey0Column (0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey2Column (0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier (0xe155154845950573EC5F518fC0D4950AB71303ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EcdsaPointsYColumn (0xE3929Ea107238Ce59d64A3cE497f12b57846B716)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MemoryPageFactRegistry (0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey0Column (0xedFfEA8296945aA91FC035Aefc8c33D737dBc573)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoseidonPoseidonFullRoundKey1Column (0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/CairoBootloaderProgram.sol      |  809 +++
 ...-0x05C98569CA566a2035b87dE7d1b623C950798035.sol | 4408 +++++++++++++
 ...-0x351666E9EeA6E012f08695ccd1923f37519563f1.sol | 3208 ++++++++++
 ...-0x4feFa770f154624067cF9d8Ff4B925a21E33Abe5.sol | 5047 +++++++++++++++
 ...-0x547eeCf2aeE8f3859732BCFFC70dE24C75CE0717.sol | 6512 ++++++++++++++++++++
 ...-0x86ABf7A15Ea9Ff955C0E6e168DA4cd009a8CdA46.sol | 5790 +++++++++++++++++
 ...-0xA9baC69dbcC703096Ee4db8B6Fdb8480a4DC2DAE.sol | 6252 +++++++++++++++++++
 ...-0xC3938063598A23B9f3c71cA8AFa3A22fdB287f7B.sol | 5067 +++++++++++++++
 ...-0xb195C66bf046cb4A4D7FcCD7a24Fb5a2b9D36b67.sol | 3584 +++++++++++
 ...-0x094bD609998F0D4504145adAaaC3C3B3406e0Ae3.sol | 3080 +++++++++
 ...-0x18d3f47Ff00272Db6db5D4548B5d7b6a0765138E.sol | 3192 ++++++++++
 ...-0x243682b9A01455ac671c97D8dE686EBd4EE25791.sol | 3175 ++++++++++
 ...-0x3d57526c1C8D63fa2A8704487Df65e9000166c8E.sol | 3080 +++++++++
 ...-0x42AF9498647Be47A256C9cc8278eE94473Cb7771.sol | 3178 ++++++++++
 ...-0x61BF6C2C60E3416B13C3c8d0591AEDd4D9d398D1.sol | 3080 +++++++++
 ...-0xAaAe0edF6536de72E7163D293518c40011179f8a.sol | 3134 ++++++++++
 ...-0xe155154845950573EC5F518fC0D4950AB71303ff.sol | 3236 ++++++++++
 ...-0x0aCC3292202b05175F86C7Bf4bd6011eB79eC5cb.sol | 5674 +++++++++++++++++
 ...-0x4742f8723CAE9C17Cb1D54708898904fB43621c9.sol | 6069 ++++++++++++++++++
 ...-0x4A3635EEd2C38cB0Eac2D52ddE9CFaB49Be48C17.sol | 3904 ++++++++++++
 ...-0x6454b594e2C968ab4BdA63139B0df83A4EfD4A6e.sol | 3029 +++++++++
 ...-0xA9db7bDfbc3664C8954f490e4d94B8607a080f23.sol | 3855 ++++++++++++
 ...-0xAC6250BCc9C806FDFFAd774276c7584CDCFE3ac0.sol | 4849 +++++++++++++++
 ...-0xD5700c7d3948BE2361177CaE9Ce0bB4A2c8d2A40.sol | 2957 +++++++++
 ...-0xdc2c543f4eE2711C34fe7F892D4F9177BfaeAE84.sol | 3819 ++++++++++++
 .../ethereum/.flat/EcdsaPointsXColumn.sol          |  648 ++
 .../ethereum/.flat/EcdsaPointsYColumn.sol          |  648 ++
 .../ethereum/.flat/FriStatementContract.sol        | 1278 ++++
 .../ethereum/.flat/MemoryPageFactRegistry.sol      |  344 ++
 .../ethereum/.flat/MerkleStatementContract.sol     |  286 +
 .../ethereum/.flat/PedersenHashPointsXColumn.sol   | 1271 ++++
 .../ethereum/.flat/PedersenHashPointsYColumn.sol   | 1271 ++++
 ...-0xc9A02D0d8A88e71Cc92417b6011029cF8A44a540.sol |   47 +
 ...-0xedFfEA8296945aA91FC035Aefc8c33D737dBc573.sol |   47 +
 ...-0x9d820BA19fBAbE91F01413a7a7Ae554925CF95Fc.sol |   47 +
 ...-0xF0B58EFdA0721c768149e85C1DDF2D02fc9e05Fc.sol |   47 +
 ...-0x487175b93FDbac971ceB3a88b9843F46f1d5d2C8.sol |   47 +
 ...-0xde8d55104aBdf18ad2642F45D5bd51eb4f6D41fD.sol |   47 +
 ...-0x53daC4aB94955f35657463252a7b25F343A14451.sol |  183 +
 ...-0xBaeC49f8Ac145D6b7CE7c7B8FF86b3a158D717EF.sol |  183 +
 ...-0x032e5cDb729Ce94638ACA9e82A22688109B43046.sol |  104 +
 ...-0x14106Aa9431ED9b3006D742AEBf9f9930d7CE0C2.sol |  104 +
 .../ethereum/.flat/SHARPVerifier.sol               |  889 +++
 43 files changed, 107479 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531641 (main branch discovery), not current.

```diff
    contract Level2CpuConstraintPoly0 (0x04bE0E2D5EcCC744BE21BFb28d91d4a3CBefA8EB) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly0"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey0Column0 (0x1Db84E79E8daEC762d6aDaa5bf358A4Ba001E975) {
    +++ description: None
      name:
-        "Fri6_PoseidonPoseidonPartialRoundKey0Column"
+        "Level2PoseidonPoseidonPartialRoundKey0Column0"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey1Column0 (0x1E8E41141347E01f33d84718b7f4cEFB433D5a94) {
    +++ description: None
      name:
-        "Fri1_PoseidonPoseidonFullRoundKey1Column"
+        "Level2PoseidonPoseidonFullRoundKey1Column0"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuConstraintPoly1 (0x1F038cdFeEE2Afa44a4213b12A6F0a5A7E6DE676) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly1"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey1Column0 (0x20F10963eBCA608f8B24a5AEE275861B20ec868E) {
    +++ description: None
      name:
-        "Fri1_PoseidonPoseidonPartialRoundKey1Column"
+        "Level2PoseidonPoseidonPartialRoundKey1Column0"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuFrilessVerifier0 (0x28E3aD4201ba416B23d9950503dB28a9232BE32a) {
    +++ description: None
      name:
-        "CpuFrilessVerifier1"
+        "Level2CpuFrilessVerifier0"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey2Column0 (0x2b159027d7F0E23D5C15b0517e33DdA838C46045) {
    +++ description: None
      name:
-        "Fri1_PoseidonPoseidonFullRoundKey2Column"
+        "Level2PoseidonPoseidonFullRoundKey2Column0"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuConstraintPoly2 (0x307982EB84858A04d32b5e0b72D152be5A3eEcEA) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly2"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuOods0 (0x367B337Aa4A056CB78Fd74F94E283A73B27DfBB6) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods0"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PedersenHashPointsXColumn (0x3d571a45D2B14FF423D2DC4A0e7a46e07D9682bB) {
    +++ description: None
      name:
-        "PedersenHashPointsXColumn"
+        "Level2PedersenHashPointsXColumn"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2MemoryPageFactRegistry (0x40864568f679c10aC9e72211500096a5130770fA) {
    +++ description: None
      name:
-        "MemoryPageFactRegistry"
+        "Level2MemoryPageFactRegistry"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuConstraintPoly3 (0x450909cC615036Ca4772dDDd8a69988B031811c9) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly3"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuOods1 (0x473E7B002f9A3109fd0FcdA4597935E4E610f367) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods1"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuOods2 (0x4D654CEd9cE0781986A4612C76e3e18D6D3B2fFB) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods2"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuFrilessVerifier1 (0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d) {
    +++ description: None
      name:
-        "CpuFrilessVerifier2"
+        "Level2CpuFrilessVerifier1"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2CpuFrilessVerifier2 (0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460) {
    +++ description: None
      name:
-        "CpuFrilessVerifier3"
+        "Level2CpuFrilessVerifier2"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey1Column1 (0x62960C874379653D7BBe3644Ac653736Da2eda12) {
    +++ description: None
      name:
-        "Fri6_PoseidonPoseidonPartialRoundKey1Column"
+        "Level2PoseidonPoseidonPartialRoundKey1Column1"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2MerkleStatementContract (0x634DCf4f1421Fc4D95A968A559a450ad0245804c) {
    +++ description: None
      name:
-        "MerkleStatementContract"
+        "Level2MerkleStatementContract"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuFrilessVerifier3 (0x66F2345D003511a1A60D87E3984Bb8d12C21A970) {
    +++ description: None
      name:
-        "CpuFrilessVerifier4"
+        "Level2CpuFrilessVerifier3"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2CpuOods3 (0x697Ce81ea1732c74850Eef111EbC47c0FBd14a0a) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods3"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract OldSHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    +++ description: None
      template:
+        "shared-sharp-verifier/DeprecatedVerifier"
    }
```

```diff
    contract Level2CpuOods4 (0x704DFf65eD9b3d121d469b7A790A9927C853607F) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods4"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PoseidonPoseidonPartialRoundKey0Column1 (0x75D887d2437eF87EA17B93143716BECD7BBbCa0a) {
    +++ description: None
      name:
-        "Fri1_PoseidonPoseidonPartialRoundKey0Column"
+        "Level2PoseidonPoseidonPartialRoundKey0Column1"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey0Column0 (0x8004e851fa3F3C66A3c80e4F7E96559f4C3E16a6) {
    +++ description: None
      name:
-        "Fri1_PoseidonPoseidonFullRoundKey0Column"
+        "Level2PoseidonPoseidonFullRoundKey0Column0"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuFrilessVerifier4 (0x8055948c530dbBc19cc350d53473EEe3a1e3d22B) {
    +++ description: None
      name:
-        "CpuFrilessVerifier5"
+        "Level2CpuFrilessVerifier4"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2CpuOods5 (0x88bA01753F2e96C3a00c6aaf76EaEB36Ccf715C1) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods5"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2EcdsaPointsYColumn (0x9e4FdD8ff1b11e8f788Af77caA4b0037c137EcC1) {
    +++ description: None
      name:
-        "EcdsaPointsYColumn"
+        "Level2EcdsaPointsYColumn"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuFrilessVerifier5 (0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9) {
    +++ description: None
      name:
-        "CpuFrilessVerifier6"
+        "Level2CpuFrilessVerifier5"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2CairoBootloaderProgram (0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40) {
    +++ description: None
      name:
-        "CairoBootloaderProgram"
+        "Level2CairoBootloaderProgram"
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey2Column1 (0xB5A5759Dd063899F213eB9699906B445f855660D) {
    +++ description: None
      name:
-        "Fri6_PoseidonPoseidonFullRoundKey2Column"
+        "Level2PoseidonPoseidonFullRoundKey2Column1"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuConstraintPoly4 (0xB62Dc40175812208f509B69506315A48C92fb15A) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly4"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuOods6 (0xB640935b164024EF1BC0b9e176432c440a5cd4dc) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods6"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuFrilessVerifier6 (0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc) {
    +++ description: None
      name:
-        "CpuFrilessVerifier7"
+        "Level2CpuFrilessVerifier6"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey1Column1 (0xC2969a099F22430e20bcE237F469ac6F3101Ac5f) {
    +++ description: None
      name:
-        "Fri6_PoseidonPoseidonFullRoundKey1Column"
+        "Level2PoseidonPoseidonFullRoundKey1Column1"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2EcdsaPointsXColumn (0xcB799CbBd4f5F0a3b6bbd9b55F59E8b301A0286B) {
    +++ description: None
      name:
-        "EcdsaPointsXColumn"
+        "Level2EcdsaPointsXColumn"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuOods7 (0xCC80e9E852cAE30E2d30d98ab2868648E84BF2A4) {
    +++ description: None
      name:
-        "CpuOods"
+        "Level2CpuOods7"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuConstraintPoly5 (0xcd96f43343Aa06d6ED0D412969c6D462fd17cF02) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly5"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuFrilessVerifier7 (0xD0fC19710c389ef4a7244656cB08db08eA9D88b4) {
    +++ description: None
      name:
-        "CpuFrilessVerifier8"
+        "Level2CpuFrilessVerifier7"
      template:
+        "shared-sharp-verifier/CpuFrilessVerifier"
    }
```

```diff
    contract Level2SHARPVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: None
      name:
-        "SHARPVerifier"
+        "Level2SHARPVerifier"
      template:
+        "shared-sharp-verifier/Verifier"
    }
```

```diff
    contract Level2CpuConstraintPoly6 (0xDd4cBe8CC7f420A9576F93E1D1CcC501495B5253) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly6"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2FriStatementContract (0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb) {
    +++ description: None
      name:
-        "FriStatementContract"
+        "Level2FriStatementContract"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2CpuConstraintPoly7 (0xE5313feE344376D22A42C9F0919e7F0d43920CAc) {
    +++ description: None
      name:
-        "CpuConstraintPoly"
+        "Level2CpuConstraintPoly7"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PoseidonPoseidonFullRoundKey0Column1 (0xe7B835eA7e348B25aF2480272C4cA28429573293) {
    +++ description: None
      name:
-        "Fri6_PoseidonPoseidonFullRoundKey0Column"
+        "Level2PoseidonPoseidonFullRoundKey0Column1"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

```diff
    contract Level2PedersenHashPointsYColumn (0xFD12A123ecf4326E70A4D8b2bC260ec730BBE7Fd) {
    +++ description: None
      name:
-        "PedersenHashPointsYColumn"
+        "Level2PedersenHashPointsYColumn"
      template:
+        "shared-sharp-verifier/ignoreCompute"
    }
```

Generated with discovered.json: 0x42ce99e80cd13ef6a6889fb328565d57beecd590

# Diff at Thu, 18 Jul 2024 10:33:19 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19531641
- current block number: 19531641

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531641 (main branch discovery), not current.

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      assignedPermissions:
+        {"admin":["0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"]}
    }
```

Generated with discovered.json: 0x5c0ffa57659e38889ca2880a1ee7efda61b6d240

# Diff at Thu, 28 Mar 2024 09:13:10 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19468852
- current block number: 19531641

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19468852 (main branch discovery), not current.

```diff
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0xaff8a6ad66c53b2303b9c9c77d308de4890151ad

# Diff at Tue, 19 Mar 2024 12:40:39 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@284847fdd85d7b4f5b56effe092db242cda5349d block: 19432182
- current block number: 19468852

## Description

Updated the names and references to new SHARP verifier contracts.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19432182 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x03Fa911dfCa026D9C8Edb508851b390accF912e8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x0C099caf7a87e4eB28bcd8D0608063f8a69bb434)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x217750c27bE9147f9e358D9FF26a8224F8aCC214)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x297951a67D1BF7795500C3802d21a8C846D9C962)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x3405F644F9390C3478f42Fd205CE6920CcAF3280)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey0Column (0x37070Fd8051f63E5A6D7E87026e086Cc19db1aBe)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FriStatementContract (0x3E6118DA317f7A433031F03bB71ab870d87dd2DD)
    +++ description: None
```

```diff
    contract GpsMemoryPageFactRegistry (0x40864568f679c10aC9e72211500096a5130770fA) {
    +++ description: None
      name:
-        "GpsMemoryPageFactRegistry"
+        "MemoryPageFactRegistry"
    }
```

```diff
-   Status: DELETED
    contract CpuOods (0x43A1C0bBa540e1C98d4b413F876250bdCFd0b9e0)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x4bf82e627D57cB3F455E740bcDA25848cDbd2FF7)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x4CF5c11321d54b83bDAE84bBbd018c26621d2950)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonPartialRoundKey1Column (0x4d0E80AB34ee2B19295F2CaC3101d03452D874b8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey2Column (0x4FB05b7CC348C5a72C59a3f307baf66e3CA1F835)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PedersenHashPointsYColumn (0x519DA5F74503dA351EbBED889111377d33096002)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x52314e0b25b024c34480Ac3c75cfE98c2Ed6aa4a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MerkleStatementContract (0x5899Efea757E0Dbd6d114b3375C23D7540f65fa4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract EcdsaPointsXColumn (0x593a71DC43e9B67FE009d7C76B6EfA925FB329B1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CairoBootloaderProgram (0x5d07afFAfc8721Ef3dEe4D11A2D1484CBf6A9dDf)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x630A97901Ac29590DF83f4A64B8D490D54caf239)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x68293272FEA2D6e74572BC18ffaD11F21344e090)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x691ca565B7416B681e4f9Fb56A1283Ae8b34E55e)
    +++ description: None
```

```diff
    contract SHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    +++ description: None
      name:
-        "SHARPVerifier"
+        "OldSHARPVerifier"
      values.constructorArgs:
-        ["0x5d07afFAfc8721Ef3dEe4D11A2D1484CBf6A9dDf","0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4",["0x217750c27bE9147f9e358D9FF26a8224F8aCC214","0x630A97901Ac29590DF83f4A64B8D490D54caf239","0x8488e8f4e26eBa40faE229AB653d98E341cbE57B","0x9E614a417f8309575fC11b175A51599661f2Bd21","0xC879aF7D5eD80e4676C203FD300E640C297F31e3","0x78Af2BFB12Db15d35f7dE8DD77f29C299C78c590","0xe9664D230490d5A515ef7Ef30033d8075a8D0E24","0x03Fa911dfCa026D9C8Edb508851b390accF912e8"],"3178097804922730583543126053422762895998573737925004508949311089390705597156","2962621603719000361370283216422448934312521782617806945663080079725495842070"]
      values.memoryPageFactRegistry:
+        "0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4"
    }
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x78Af2BFB12Db15d35f7dE8DD77f29C299C78c590)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonPartialRoundKey0Column (0x812c2AD2161D099724A99C8114c539b9e5b449cd)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x8488e8f4e26eBa40faE229AB653d98E341cbE57B)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0x8518F459A698038B4CCED66C042c48C6bB5B17fe)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x89B7a7276cBc8Cb35Ec11fAE9da83b20Db3edf20)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0x943248dA0FFd5834Da56c5AD5308E2E2991378EB)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0x9E614a417f8309575fC11b175A51599661f2Bd21)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PoseidonPoseidonFullRoundKey1Column (0xb4711a4614368516529d6118C97905aB4B28e267)
    +++ description: None
```

```diff
    contract GpsCairoBootloaderProgram (0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40) {
    +++ description: None
      name:
-        "GpsCairoBootloaderProgram"
+        "CairoBootloaderProgram"
    }
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0xBE8bd7a41ba7DC7b995a53368e7fFE30Fd2BC447)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PedersenHashPointsXColumn (0xc4f21318937017B8aBe5fDc0D48f58dBc1d18940)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0xC879aF7D5eD80e4676C203FD300E640C297F31e3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0xc9E067AF5d00eb4aA2E73843ac36AfF83C5CeeD3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract EcdsaPointsYColumn (0xcA59f6FD499ffF50c78Ffb420a9bcd0d273abf29)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuConstraintPoly (0xd0aAdECA2d25AEFde0da214d27b04b6ea20D7418)
    +++ description: None
```

```diff
    contract GpsStatementVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: None
      name:
-        "GpsStatementVerifier"
+        "SHARPVerifier"
      values.cairoVerifierContractAddresses:
-        ["0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d","0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460","0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc","0x66F2345D003511a1A60D87E3984Bb8d12C21A970","0x8055948c530dbBc19cc350d53473EEe3a1e3d22B","0xD0fC19710c389ef4a7244656cB08db08eA9D88b4","0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9","0x28E3aD4201ba416B23d9950503dB28a9232BE32a"]
      values.cpuFrilessVerifiers:
+        ["0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d","0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460","0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc","0x66F2345D003511a1A60D87E3984Bb8d12C21A970","0x8055948c530dbBc19cc350d53473EEe3a1e3d22B","0xD0fC19710c389ef4a7244656cB08db08eA9D88b4","0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9","0x28E3aD4201ba416B23d9950503dB28a9232BE32a"]
    }
```

```diff
-   Status: DELETED
    contract CpuFrilessVerifier (0xe9664D230490d5A515ef7Ef30033d8075a8D0E24)
    +++ description: None
```

```diff
-   Status: DELETED
    contract CpuOods (0xED219933b58e9c00E66682356588d42C7932EE8E)
    +++ description: None
```

```diff
    contract MemoryPageFactRegistry (0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4) {
    +++ description: None
      name:
-        "MemoryPageFactRegistry"
+        "OldMemoryPageFactRegistry"
    }
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x04bE0E2D5EcCC744BE21BFb28d91d4a3CBefA8EB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonPartialRoundKey0Column (0x1Db84E79E8daEC762d6aDaa5bf358A4Ba001E975)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonFullRoundKey1Column (0x1E8E41141347E01f33d84718b7f4cEFB433D5a94)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x1F038cdFeEE2Afa44a4213b12A6F0a5A7E6DE676)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonPartialRoundKey1Column (0x20F10963eBCA608f8B24a5AEE275861B20ec868E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier1 (0x28E3aD4201ba416B23d9950503dB28a9232BE32a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonFullRoundKey2Column (0x2b159027d7F0E23D5C15b0517e33DdA838C46045)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x307982EB84858A04d32b5e0b72D152be5A3eEcEA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x367B337Aa4A056CB78Fd74F94E283A73B27DfBB6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsXColumn (0x3d571a45D2B14FF423D2DC4A0e7a46e07D9682bB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0x450909cC615036Ca4772dDDd8a69988B031811c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x473E7B002f9A3109fd0FcdA4597935E4E610f367)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x4D654CEd9cE0781986A4612C76e3e18D6D3B2fFB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier2 (0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier3 (0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonPartialRoundKey1Column (0x62960C874379653D7BBe3644Ac653736Da2eda12)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MerkleStatementContract (0x634DCf4f1421Fc4D95A968A559a450ad0245804c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier4 (0x66F2345D003511a1A60D87E3984Bb8d12C21A970)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x697Ce81ea1732c74850Eef111EbC47c0FBd14a0a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x704DFf65eD9b3d121d469b7A790A9927C853607F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonPartialRoundKey0Column (0x75D887d2437eF87EA17B93143716BECD7BBbCa0a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri1_PoseidonPoseidonFullRoundKey0Column (0x8004e851fa3F3C66A3c80e4F7E96559f4C3E16a6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier5 (0x8055948c530dbBc19cc350d53473EEe3a1e3d22B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0x88bA01753F2e96C3a00c6aaf76EaEB36Ccf715C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EcdsaPointsYColumn (0x9e4FdD8ff1b11e8f788Af77caA4b0037c137EcC1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier6 (0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonFullRoundKey2Column (0xB5A5759Dd063899F213eB9699906B445f855660D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xB62Dc40175812208f509B69506315A48C92fb15A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xB640935b164024EF1BC0b9e176432c440a5cd4dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier7 (0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonFullRoundKey1Column (0xC2969a099F22430e20bcE237F469ac6F3101Ac5f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EcdsaPointsXColumn (0xcB799CbBd4f5F0a3b6bbd9b55F59E8b301A0286B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuOods (0xCC80e9E852cAE30E2d30d98ab2868648E84BF2A4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xcd96f43343Aa06d6ED0D412969c6D462fd17cF02)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuFrilessVerifier8 (0xD0fC19710c389ef4a7244656cB08db08eA9D88b4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xDd4cBe8CC7f420A9576F93E1D1CcC501495B5253)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FriStatementContract (0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CpuConstraintPoly (0xE5313feE344376D22A42C9F0919e7F0d43920CAc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fri6_PoseidonPoseidonFullRoundKey0Column (0xe7B835eA7e348B25aF2480272C4cA28429573293)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PedersenHashPointsYColumn (0xFD12A123ecf4326E70A4D8b2bC260ec730BBE7Fd)
    +++ description: None
```

Generated with discovered.json: 0xbb98743c8594276adcd76e065855646cd7c5ccea

# Diff at Thu, 14 Mar 2024 08:53:25 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@0d9e81470e7f864bf251e22aca8c3ece6e6f4429 block: 19426040
- current block number: 19432182

## Description

Fetch addresses from GpsStatementVerifier that were internal.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19426040 (main branch discovery), not current.

```diff
    contract GpsStatementVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF) {
    +++ description: None
      values.bootloaderProgramContractAddress:
+        "0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40"
      values.cairoVerifierContractAddresses:
+        ["0x5f1AbAA5d375Edb7bEd213855D44268B844CD65d","0x6097FC32a720D0DE369A67FecdBC91fE3C6Cc460","0xbF8D127efc09ed49C65f00355A0C5a5FF57D26cc","0x66F2345D003511a1A60D87E3984Bb8d12C21A970","0x8055948c530dbBc19cc350d53473EEe3a1e3d22B","0xD0fC19710c389ef4a7244656cB08db08eA9D88b4","0xaA2c9CDD4ceAebe9A35873B77F57FB47c3Ef11b9","0x28E3aD4201ba416B23d9950503dB28a9232BE32a"]
      values.memoryPageFactRegistry:
+        "0x40864568f679c10aC9e72211500096a5130770fA"
    }
```

```diff
+   Status: CREATED
    contract GpsMemoryPageFactRegistry (0x40864568f679c10aC9e72211500096a5130770fA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GpsCairoBootloaderProgram (0xb4c61d092eCf1b69F1965F9D8DE639148ea26a40)
    +++ description: None
```

Generated with discovered.json: 0x8f966e62bd027d2c699e581a404494171a98fecc

# Diff at Wed, 13 Mar 2024 12:07:03 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4f6a54f5fa748334d34176673b2c233534ce2fbc block: 19376058
- current block number: 19426040

## Description

This value always should've been `false`.
If it was `true` it would mean that no upgrades can be happen in the SHARPVerifier.
But that is not the case, there were upgrades happening while this was set to "`true`" in our discovered.json.
The reason for this mistake is that in the StarkWare Proxy handler the wrong slot was copied for the FINALIZATION flag.
So this is the value that is actually correct.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19376058 (main branch discovery), not current.

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      upgradeability.isFinal:
-        true
+        false
    }
```

Generated with discovered.json: 0xa365edf645a8b7c07fb86981c0293b69f7b70d1d

# Diff at Wed, 06 Mar 2024 12:15:21 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cea88c5f3ff85fed5d72dadc72ae50315d0808d6 block: 19063965
- current block number: 19376058

## Description

Increased the program size. Some functions have been renamed. The `Address` library has been added. Facts are now both checked on the new contract or the old one, if the current one cannot find them. The usage of the old one has an expiration time. My understanding is that this is to enable a smoother transition to the new contract. `N_BUILTINS` have been increased by one, but not sure what it means. Some more info can be found here: <https://docs.cairo-lang.org/how_cairo_works/builtins.html#layout>.

The upgrade delay is now zero, meaning that the risk of many project is now affected.

## Watched changes

```diff
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    +++ description: None
      upgradeability.callImplementation:
-        "0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6"
+        "0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF"
      upgradeability.upgradeDelay:
-        2419200
+        0
      values.callProxyImplementation:
-        "0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6"
+        "0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF"
      values.getUpgradeActivationDelay:
-        2419200
+        0
    }
```

```diff
+   Status: CREATED
    contract GpsStatementVerifier (0xd51A3D50d4D2f99a345a66971E650EEA064DD8dF)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.code/GpsStatementVerifier/meta.txt   |   2 +
 .../starkware/solidity/components/FactRegistry.sol |  58 ++
 .../solidity/components/ReferableFactRegistry.sol  |  90 +++
 .../solidity/interfaces/IFactRegistry.sol          |  39 ++
 .../solidity/interfaces/IQueryableFactRegistry.sol |  30 +
 .../starkware/solidity/interfaces/Identity.sol     |  24 +
 .../starkware/solidity/libraries/Addresses.sol     |  58 ++
 .../solidity/verifier/PrimeFieldElement0.sol       | 104 +++
 .../verifier/cpu/CairoBootloaderProgram.sol        | 761 +++++++++++++++++++++
 .../verifier/cpu/CairoVerifierContract.sol         |  46 ++
 .../verifier/cpu/CpuPublicInputOffsetsBase.sol     |  45 ++
 .../verifier/cpu/MemoryPageFactRegistry.sol        | 273 ++++++++
 .../starkware/solidity/verifier/cpu/PageInfo.sol   |  31 +
 .../solidity/verifier/gps/GpsOutputParser.sol      | 294 ++++++++
 .../solidity/verifier/gps/GpsStatementVerifier.sol | 336 +++++++++
 15 files changed, 2191 insertions(+)
```

