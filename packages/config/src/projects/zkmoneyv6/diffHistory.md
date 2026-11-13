Generated with discovered.json: 0x412b57365ea8922c27537332533ad54b12a6f636

# Diff at Fri, 13 Nov 2026 13:04:25 GMT:

- id: b1d59c14
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1ced572b97485e6dc1fc02f958ee2a731593430e block: 1793614694
- current timestamp: 1794571906

## Description

Aztec Labs redeployed the zk.money naming and deposit address contracts, and the NameRegistry and the zk.money ENS record point to them. ETHBEAT verified them on Etherscan and Sourcify from public source (zkmoney-public 7a72b6b4, vendor/oxide/l1-contracts).
- Resolver: https://disco.l2beat.com/diff/eth:0xc329a74542688a3c4948B7d46F204d3d7e5Dd525/eth:0x3dc71762063D7b87b3F79b3B98E03F0051b00A6e
- RegistrationController: https://disco.l2beat.com/diff/eth:0x45F626E2a4D63232677C96B163ac46e20514a915/eth:0xeC4DDC3B27fFfc9593eE63085CbF05BfFAB6be37
- SIPAFactory: https://disco.l2beat.com/diff/eth:0x186C20F0F294378E1DecA7419c667e44c73E992C/eth:0x532eDc4A4113602c18029d80d9770d959c52AEd7
- ForwardingTable: https://disco.l2beat.com/diff/eth:0xFf839a8Be7c90c804F42563f352324cEBcDfe41C/eth:0x4cb0082B40d3CeE3Cf5237282d34B51129FF49Bd
- DepositSIPA: https://disco.l2beat.com/diff/eth:0xBFe3dE3C4466cbC5803A756847208c69B3BAe401/eth:0xCf6B670FEbDf61C4b52c30a9958631161d7294FE
- RegistrationSIPA: https://disco.l2beat.com/diff/eth:0x96A52ed47Af73423D4b8a920913e5c1ceFdC1319/eth:0x0dfaF0E5521CB1aEFfcA4458888e39374095eF93
- ResolverVerifier: https://disco.l2beat.com/diff/eth:0x1E63715af06Bb12331f6A319b46253713e4d0206/eth:0xE80d96eB67c620b0708E1949fd2a79fdACa553aE, built with Barretenberg 6.0.0 under a new key 0x012486c7…. ETHBEAT regenerated the key and the exact verifier source from the public resolver circuit.

The risks stay the same. The only code change is an open uint8 intent instead of an enum, so a deployed factory and table accept intents a later release adds. Sweep, recovery, routing and fee rules, the Resolver's proof check, owner, fees and beneficiary are unchanged. The RegistrationController accepts only registration addresses of the new factory. Addresses of the old factory keep their code and table, and their funds stay recoverable.

New intent 4, AddPasskeySIPA (compare UserOpSIPA: https://disco.l2beat.com/diff/eth:0x5180f0659D021368CDF5c4499967B9A329C775A0/eth:0x1890474918e04447b0ab718ffe60df749d953dc4). Sweeping a funded clone runs the account operation fixed in its address, signed by the account's current keys: add a passkey, set the user record, announce the account on Aztec. It then deposits the rest. The new factory blesses no open-ended UserOp intent.

New OxidePortal_steakUSDC (eth:0x4a29C4b0ED569621f0B38Aa2EF7633A950207bDf) for Steakhouse Prime USDC on Morpho, with the same verified portal code, TeeRegistry and refund verifiers. It holds about 31 USDC. Moving funds in routes DAI through a MultiStepExecutor, Maker's PSM, the vault and a PortalDepositAdapter, all verified and outside discovery. Three DepositSubsidy contracts can pay sweep relayers from their own balance and cannot change routing. Six later withdrawal executors and subsidies are unverified and unused so far.

Config: shapes for the new contracts in the zkmoney templates, new AddPasskeySIPA and v6 ResolverVerifier templates. SIPAFactory reads the current implementation per intent from its events. The replaced SIPAFactory stays as LegacySIPAFactory with its table and implementations. PortalFactory lists its portals. ensNode moved into the Resolver template. Ossification event for the switch. The zk catalog lists the v6 resolver verifier with its verification steps.

## Watched changes

```diff
-   Status: DELETED
    contract ResolverVerifier (eth:0x1E63715af06Bb12331f6A319b46253713e4d0206) [zkmoney/ResolverVerifier]
    +++ description: UltraHonk verifier for the zk.money resolver circuit with a hardcoded verification key. The Resolver uses it to check that a resolver operator's answer matches the user's registered keys and L2 address.
```

```diff
-   Status: DELETED
    contract ZKTranscriptLib (eth:0x428Fa81B22AAF7C9acb9c73D114894886E3F7d4d) [zkmoney/ResolverVerifierLibrary]
    +++ description: Runtime library immutably linked into the zk.money resolver verifier. It evaluates circuit constraints or derives Fiat-Shamir challenges for zero-knowledge UltraHonk proofs.
```

```diff
-   Status: DELETED
    contract RegistrationController (eth:0x45F626E2a4D63232677C96B163ac46e20514a915) [zkmoney/v6/RegistrationController]
    +++ description: Completes paid name registrations from blessed registration addresses: deploys the user's L1 account, claims the name, writes the user record, optionally announces the name on Aztec through the NAME_PORTAL, and installs the user's first passkey. Fees above the relayer fee go to an allowlisted beneficiary.
```

```diff
    EOA (eth:0x8c5EE3f90cA6D24eD2e2c1817f0caEE89e521601) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x3dc71762063D7b87b3F79b3B98E03F0051b00A6e","description":"replace this Resolver as the ENS resolver of zk.money names, which decides the addresses that payments to these names resolve to.","role":".ensNodeOwner"}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x4cb0082B40d3CeE3Cf5237282d34B51129FF49Bd","description":"add rows for unlisted tokens, add fees for unlisted intents, and change the beneficiary of deposit-address fees. A new row can route an unlisted token to any contract that reports that token as UNDERLYING and the table's ROLLUP_VERSION.","role":".owner"}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x532eDc4A4113602c18029d80d9770d959c52AEd7","description":"bless deposit address implementations and approve ForwardingTables. A newly blessed implementation for an intent decides the code of every new deposit address for that intent. Earlier blessings are never revoked.","role":".owner"}
      receivedPermissions.2:
-        {"permission":"interact","from":"eth:0xc329a74542688a3c4948B7d46F204d3d7e5Dd525","description":"replace this Resolver as the ENS resolver of zk.money names, which decides the addresses that payments to these names resolve to.","role":".ensNodeOwner"}
    }
```

```diff
    contract NameRegistry (eth:0xa9863B8F573D62377d987ccb9AF6e0000f99D14a) [zkmoney/NameRegistry] {
    +++ description: Registry of zk.money names. It points to the RegistrationController and the AccountMetadataRegistry, which together decide where payments to a zk.money name resolve to.
+++ severity: HIGH
      values.registrationController:
-        "eth:0x45F626E2a4D63232677C96B163ac46e20514a915"
+        "eth:0xeC4DDC3B27fFfc9593eE63085CbF05BfFAB6be37"
+++ severity: HIGH
      values.resolver:
-        "eth:0xc329a74542688a3c4948B7d46F204d3d7e5Dd525"
+        "eth:0x3dc71762063D7b87b3F79b3B98E03F0051b00A6e"
    }
```

```diff
-   Status: DELETED
    contract Resolver (eth:0xc329a74542688a3c4948B7d46F204d3d7e5Dd525) [zkmoney/Resolver]
    +++ description: ENS resolver for zk.money names. It returns a deposit address derived from a resolver operator's answer, which must come with a zk proof that it matches the user's registered keys and L2 address in the AccountMetadataRegistry.
```

```diff
    contract PortalFactory (eth:0xCeae64c7211a2208afFc4F396ADD1D46996Cd2A2) [zkmoney/v6/PortalFactory] {
    +++ description: Deploys OxidePortals that share its TEE_REGISTRY and refund verifiers. Each portal is a separate escrow for one token and one L2 token contract, and nothing in a deployed portal refers back to the factory.
+++ description: OxidePortals deployed by this factory.
      values.portals.2:
+        "eth:0x4a29C4b0ED569621f0B38Aa2EF7633A950207bDf"
    }
```

```diff
-   Status: DELETED
    contract RelationsLib (eth:0xCEBD4589238699fcD7FEA8F89f05AE35F4D7E8c4) [zkmoney/ResolverVerifierLibrary]
    +++ description: Runtime library immutably linked into the zk.money resolver verifier. It evaluates circuit constraints or derives Fiat-Shamir challenges for zero-knowledge UltraHonk proofs.
```

```diff
    contract AccountMetadataRegistry (eth:0xDA79Bae4485c40291363D885Aae5B543d2D0Efa9) [zkmoney/AccountMetadataRegistry] {
    +++ description: Stores user records (Aztec L2 address, keys, chosen resolver operator) and resolver operator entries. User records can be written by the user or by the RegistrationController. Anyone can register as a resolver operator.
      values.resolverOperators.eth:0x4748f1359c4dFf0cfB7A36968C05cc314016b664.3:
-        "eth:0xFf839a8Be7c90c804F42563f352324cEBcDfe41C"
+        "eth:0x4cb0082B40d3CeE3Cf5237282d34B51129FF49Bd"
    }
```

```diff
+   Status: CREATED
    contract RegistrationSIPA (eth:0x0dfaF0E5521CB1aEFfcA4458888e39374095eF93) [zkmoney/v6/RegistrationSIPA]
    +++ description: Implementation of zk.money registration addresses. Sweeping a funded clone registers the name through the current RegistrationController of the NameRegistry, pays the committed and listed fees and deposits the rest into the portal its ForwardingTable names. The recipient's account can recover any funds from the clone.
```

```diff
+   Status: CREATED
    contract AddPasskeySIPA (eth:0x1890474918E04447B0aB718fFE60DF749d953DC4) [zkmoney/v6/AddPasskeySIPA]
    +++ description: Implementation of zk.money addresses that add a passkey to a user's L1 account. Sweeping a funded clone swaps USDC or USDT to DAI and runs the account operation fixed in the clone's address through the ERC-4337 EntryPoint, signed by the account's current keys: it adds the passkey, writes the user record and announces the account on Aztec through the NAME_PORTAL. It then pays the listed fees and deposits the rest into the portal its ForwardingTable names. The recipient's account can recover any funds from the clone.
```

```diff
+   Status: CREATED
    contract Resolver (eth:0x3dc71762063D7b87b3F79b3B98E03F0051b00A6e) [zkmoney/Resolver]
    +++ description: ENS resolver for zk.money names. It returns a deposit address derived from a resolver operator's answer, which must come with a zk proof that it matches the user's registered keys and L2 address in the AccountMetadataRegistry.
```

```diff
+   Status: CREATED
    contract OxidePortal_steakUSDC (eth:0x4a29C4b0ED569621f0B38Aa2EF7633A950207bDf) [zkmoney/v6/OxidePortal]
    +++ description: Escrow of zk.money on the Aztec Network. A withdrawal needs both a proven Aztec L2->L1 message from L2_TOKEN and a signature from a TEE signer registered in the TEE_REGISTRY. Once the Aztec Registry's canonical rollup is no longer ROLLUP, anyone can permanently freeze the portal, stopping deposits and fixing the refund snapshot at the last proven checkpoint. A refund needs a zk proof against that snapshot and a registered signer's signature.
```

```diff
+   Status: CREATED
    contract ForwardingTable (eth:0x4cb0082B40d3CeE3Cf5237282d34B51129FF49Bd) [zkmoney/v6/ForwardingTable]
    +++ description: Routing table of zk.money deposit addresses. For each listed token it names the portal that deposit addresses using this table sweep into, and per intent the fee for the beneficiary and the tip for the sweeper. Rows and intents can only be added, never changed or removed.
```

```diff
+   Status: CREATED
    contract SIPAFactory (eth:0x532eDc4A4113602c18029d80d9770d959c52AEd7) [zkmoney/v6/SIPAFactory]
    +++ description: Deploys zk.money deposit addresses (SIPAs) as deterministic clones. A clone counts as blessed when its implementation was blessed and its ForwardingTable approved. Each clone's code and table are fixed in its address. New deposit addresses, from the wallet or the Resolver, clone the current implementation for their intent.
```

```diff
+   Status: CREATED
    contract ZKTranscriptLib (eth:0x53a5471615868c8C82595ed1EEA2bb66e4beCF82) [zkmoney/ResolverVerifierLibrary]
    +++ description: Runtime library immutably linked into the zk.money resolver verifier. It evaluates circuit constraints or derives Fiat-Shamir challenges for zero-knowledge UltraHonk proofs.
```

```diff
+   Status: CREATED
    contract RelationsLib (eth:0xC4b631c02Aa134D83237D798aF501B3389e0ebAe) [zkmoney/ResolverVerifierLibrary]
    +++ description: Runtime library immutably linked into the zk.money resolver verifier. It evaluates circuit constraints or derives Fiat-Shamir challenges for zero-knowledge UltraHonk proofs.
```

```diff
+   Status: CREATED
    contract DepositSIPA (eth:0xCf6B670FEbDf61C4b52c30a9958631161d7294FE) [zkmoney/v6/DepositSIPA]
    +++ description: Implementation of zk.money deposit addresses. Anyone can sweep a funded clone, which swaps USDC or USDT to DAI, pays the fees its ForwardingTable lists and deposits the rest into the portal that table names for the token, for the recipient fixed in the clone's address. The recipient's account can recover any funds from the clone.
```

```diff
+   Status: CREATED
    contract ResolverVerifier (eth:0xE80d96eB67c620b0708E1949fd2a79fdACa553aE) [zkmoney/v6/ResolverVerifier]
    +++ description: UltraHonk verifier for the zk.money resolver circuit with a hardcoded verification key, generated by a newer Barretenberg than the v5 resolver verifier. The Resolver uses it to check that a resolver operator's answer matches the user's registered keys and L2 address.
```

```diff
+   Status: CREATED
    contract RegistrationController (eth:0xeC4DDC3B27fFfc9593eE63085CbF05BfFAB6be37) [zkmoney/v6/RegistrationController]
    +++ description: Completes paid name registrations from blessed registration addresses: deploys the user's L1 account, claims the name, writes the user record, optionally announces the name on Aztec through the NAME_PORTAL, and installs the user's first passkey. Fees above the relayer fee go to an allowlisted beneficiary.
```

## Source code changes

```diff
.../projects/zkmoneyv6/.flat/AddPasskeySIPA.sol    | 11458 +++++++++++++++++++
 .../src/projects/zkmoneyv6/.flat/DepositSIPA.sol   |  3342 ++++++
 .../projects/zkmoneyv6/.flat/ForwardingTable.sol   |  2209 ++++
 .../zkmoneyv6/.flat/OxidePortal_steakUSDC.sol      |  4873 ++++++++
 .../RegistrationController.sol                     |   545 +-
 .../projects/zkmoneyv6/.flat/RegistrationSIPA.sol  |  3381 ++++++
 .../{.flat@1793614694 => .flat}/RelationsLib.sol   |    56 +-
 .../{.flat@1793614694 => .flat}/Resolver.sol       |   115 +-
 .../ResolverVerifier.sol                           |   181 +-
 .../src/projects/zkmoneyv6/.flat/SIPAFactory.sol   |  2773 +++++
 .../ZKTranscriptLib.sol                            |    50 +-
 11 files changed, 28586 insertions(+), 397 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1793614694 (main branch discovery), not current.

```diff
    contract LegacySIPAFactory (eth:0x186C20F0F294378E1DecA7419c667e44c73E992C) [zkmoney/v6/SIPAFactory] {
    +++ description: Deploys zk.money deposit addresses (SIPAs) as deterministic clones. A clone counts as blessed when its implementation was blessed and its ForwardingTable approved. Each clone's code and table are fixed in its address. New deposit addresses, from the wallet or the Resolver, clone the current implementation for their intent.
      name:
-        "SIPAFactory"
+        "LegacySIPAFactory"
      values.depositImplementation:
-        "eth:0xBFe3dE3C4466cbC5803A756847208c69B3BAe401"
      values.registrationImplementation:
-        "eth:0x96A52ed47Af73423D4b8a920913e5c1ceFdC1319"
      values.userOpImplementation:
-        "eth:0x5180f0659D021368CDF5c4499967B9A329C775A0"
+++ description: Current implementation per intent (1 = Deposit, 2 = Registration, 3 = UserOp, 4 = AddPasskey), cloned by new addresses for that intent.
+++ severity: HIGH
      values.implementations:
+        {"1":"eth:0xBFe3dE3C4466cbC5803A756847208c69B3BAe401","2":"eth:0x96A52ed47Af73423D4b8a920913e5c1ceFdC1319","3":"eth:0x5180f0659D021368CDF5c4499967B9A329C775A0"}
      fieldMeta.depositImplementation:
-        {"severity":"HIGH","description":"Implementation cloned by new deposit addresses."}
      fieldMeta.registrationImplementation:
-        {"severity":"HIGH","description":"Implementation cloned by new name registration addresses."}
      fieldMeta.userOpImplementation:
-        {"severity":"HIGH","description":"Implementation cloned by new deposit addresses that run an ERC-4337 user operation."}
      fieldMeta.blessedImplementations.description:
-        "Blessed implementations per intent (1 = Deposit, 2 = Registration, 3 = UserOp). Clones of any of them count as blessed."
+        "All blessed implementations with their intent. Clones of any of them count as blessed."
      fieldMeta.implementations:
+        {"severity":"HIGH","description":"Current implementation per intent (1 = Deposit, 2 = Registration, 3 = UserOp, 4 = AddPasskey), cloned by new addresses for that intent."}
    }
```

```diff
    contract LegacyUserOpSIPA (eth:0x5180f0659D021368CDF5c4499967B9A329C775A0) [zkmoney/v6/UserOpSIPA] {
    +++ description: Implementation of zk.money deposit addresses that carry an operation of the user's L1 account. Sweeping a funded clone executes the account operation fixed in the clone's address through the ERC-4337 EntryPoint, with the user's signature, then pays the listed fees and deposits the rest into the portal its ForwardingTable names. The recipient's account can recover any funds from the clone.
      name:
-        "UserOpSIPA"
+        "LegacyUserOpSIPA"
    }
```

```diff
    contract LegacyRegistrationSIPA (eth:0x96A52ed47Af73423D4b8a920913e5c1ceFdC1319) [zkmoney/v6/RegistrationSIPA] {
    +++ description: Implementation of zk.money registration addresses. Sweeping a funded clone registers the name through the current RegistrationController of the NameRegistry, pays the committed and listed fees and deposits the rest into the portal its ForwardingTable names. The recipient's account can recover any funds from the clone.
      name:
-        "RegistrationSIPA"
+        "LegacyRegistrationSIPA"
    }
```

```diff
    contract LegacyDepositSIPA (eth:0xBFe3dE3C4466cbC5803A756847208c69B3BAe401) [zkmoney/v6/DepositSIPA] {
    +++ description: Implementation of zk.money deposit addresses. Anyone can sweep a funded clone, which swaps USDC or USDT to DAI, pays the fees its ForwardingTable lists and deposits the rest into the portal that table names for the token, for the recipient fixed in the clone's address. The recipient's account can recover any funds from the clone.
      name:
-        "DepositSIPA"
+        "LegacyDepositSIPA"
    }
```

```diff
    contract Resolver (eth:0xc329a74542688a3c4948B7d46F204d3d7e5Dd525) [zkmoney/Resolver] {
    +++ description: ENS resolver for zk.money names. It returns a deposit address derived from a resolver operator's answer, which must come with a zk proof that it matches the user's registered keys and L2 address in the AccountMetadataRegistry.
      fieldMeta.ensNode.description:
-        "ENS node monitored for this deployment."
+        "ENS node of zk.money."
    }
```

```diff
    contract PortalFactory (eth:0xCeae64c7211a2208afFc4F396ADD1D46996Cd2A2) [zkmoney/v6/PortalFactory] {
    +++ description: Deploys OxidePortals that share its TEE_REGISTRY and refund verifiers. Each portal is a separate escrow for one token and one L2 token contract, and nothing in a deployed portal refers back to the factory.
+++ description: OxidePortals deployed by this factory.
      values.portals:
+        ["eth:0xCB99C58Fe81Ae6b2cB4835e46F7b703745879042","eth:0x2EbFEE284bABf94869FAC44BC85eDb3C34e536D8"]
      fieldMeta.portals:
+        {"description":"OxidePortals deployed by this factory."}
    }
```

```diff
    contract LegacyForwardingTable (eth:0xFf839a8Be7c90c804F42563f352324cEBcDfe41C) [zkmoney/v6/ForwardingTable] {
    +++ description: Routing table of zk.money deposit addresses. For each listed token it names the portal that deposit addresses using this table sweep into, and per intent the fee for the beneficiary and the tip for the sweeper. Rows and intents can only be added, never changed or removed.
      name:
-        "ForwardingTable"
+        "LegacyForwardingTable"
      fieldMeta.rows.description:
-        "Listed tokens with the portal their deposits sweep into and the fees per intent (1 = Deposit, 2 = Registration, 3 = UserOp)."
+        "Listed tokens with the portal their deposits sweep into and the fees per intent (1 = Deposit, 2 = Registration, 3 = UserOp, 4 = AddPasskey)."
    }
```

Generated with discovered.json: 0xed389da8bd2d88bda775d514db154f0c35c83193

# Diff at Mon, 02 Nov 2026 10:19:25 GMT:

- id: 0fc1d9ee
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2b8b049061be5f8409b34d1e5cecb04776a60491 block: 1793184565
- current timestamp: 1793614694

## Description

On 2026-10-29 the ForwardingTable owner moved the sweep-fee beneficiary from the deployer EOA to FPCFunderDAI, which converts DAI into Fee Juice for the ClaimFPC. The template now ignores the beneficiary as a relative, as PlainWithdrawalExecutor's does for its BENEFICIARY.

## Watched changes

```diff
    contract ForwardingTable (eth:0xFf839a8Be7c90c804F42563f352324cEBcDfe41C) [zkmoney/v6/ForwardingTable] {
    +++ description: Routing table of zk.money deposit addresses. For each listed token it names the portal that deposit addresses using this table sweep into, and per intent the fee for the beneficiary and the tip for the sweeper. Rows and intents can only be added, never changed or removed.
+++ description: Receives the beneficiary fee of each sweep through this table.
+++ severity: MEDIUM
      values._$beneficiary:
-        "eth:0x8c5EE3f90cA6D24eD2e2c1817f0caEE89e521601"
+        "eth:0x88ef976262BF715a3B0D24146fC3bb1B18464e61"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1793184565 (main branch discovery), not current.

```diff
    contract PortalFactory (eth:0xCeae64c7211a2208afFc4F396ADD1D46996Cd2A2) [zkmoney/v6/PortalFactory] {
    +++ description: Deploys OxidePortals that share its TEE_REGISTRY and refund verifiers. Each portal is a separate escrow for one token and one L2 token contract, and nothing in a deployed portal refers back to the factory.
      sourceHashes.0:
-        "0x81a4e194bf469cf8462b79af746e60bc54ff7c8cf8a4f19bb976e92e32055eb8"
+        "0x95565844e25903063164a4ee1506f77c3521161c6e5ebd378600e2e0f879e9c2"
    }
```

```diff
    contract TeeRegistry (eth:0x8b705C3519169F29850D156574ec377B686bd9CD) [zkmoney/v6/TeeRegistry] {
    +++ description: Registry of the TEE signers that the zk.money portals accept for withdrawals and refunds. Anyone can register a signer with an AWS Nitro attestation of the enclave image PCR0_HASH that is at most TEE_ATTESTATION_MAX_AGE seconds old. Registration also sends an L1->L2 message to L2_RECIPIENT, whose inclusion the zk.money contracts on Aztec prove to accept the signer there. Registrations are permanent, and the approved image cannot change.
      sourceHashes.0:
-        "0xa29b758bc432026497c37814e23e844064c0cc3000403cc0d634d6902d9563fa"
+        "0x0106f719dcaae62a3e4272e72a9f22f2900508e996f036e5822c64649d27415a"
    }
```

Generated with discovered.json: 0xecc7fcef7b208945eca0780721b8de594fe55f5b

# Diff at Wed, 28 Oct 2026 11:19:00 GMT:

- id: 4cf2689b
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1793184565

## Description

Initial discovery of zk.money on Aztec v6: immutable DAI and sUSDS OxidePortals sharing one TeeRegistry with a fixed enclave image, v5-to-v6 MigrationExecutors, and deposit-address, name and resolver contracts. The deployer EOA owns the SIPAFactory, ForwardingTable and NameRegistry.

## Initial discovery

```diff
+   Status: CREATED
    contract NitroValidator (eth:0x13114c5C847a414D20755DBc2eCbe00cc98039DF) [zkmoney/NitroValidator]
    +++ description: Validates AWS Nitro enclave attestations against the certificate chain verified by the CertManager.
```

```diff
+   Status: CREATED
    contract NamePortal (eth:0x158161B257f9bAD34C12Dd8D52638424b216c3a2) [zkmoney/v6/NamePortal]
    +++ description: Announces a zk.money name on Aztec. Anyone can send an L1->L2 message carrying a named account's name hash and bootstrap key to an Aztec address of their choice. It accepts only accounts deployed by ACCOUNT_FACTORY.
```

```diff
+   Status: CREATED
    contract SIPAFactory (eth:0x186C20F0F294378E1DecA7419c667e44c73E992C) [zkmoney/v6/SIPAFactory]
    +++ description: Deploys zk.money deposit addresses (SIPAs) as deterministic clones. A clone counts as blessed when its implementation was blessed and its ForwardingTable approved. Each clone's code and table are fixed in its address. New deposit addresses, from the wallet or the Resolver, clone the current implementation for their intent.
```

```diff
+   Status: CREATED
    contract OxideAccountFactory (eth:0x187d19EccBf2909AD3d71B798A8704D950b9C3ee) [zkmoney/OxideAccountFactory]
    +++ description: Permissionless factory for deterministic L1 accounts. The implementation is immutable and there is no administrator.
```

```diff
+   Status: CREATED
    contract ResolverVerifier (eth:0x1E63715af06Bb12331f6A319b46253713e4d0206) [zkmoney/ResolverVerifier]
    +++ description: UltraHonk verifier for the zk.money resolver circuit with a hardcoded verification key. The Resolver uses it to check that a resolver operator's answer matches the user's registered keys and L2 address.
```

```diff
+   Status: CREATED
    contract OxidePortal_sUSDS (eth:0x2EbFEE284bABf94869FAC44BC85eDb3C34e536D8) [zkmoney/v6/OxidePortal]
    +++ description: Escrow of zk.money on the Aztec Network. A withdrawal needs both a proven Aztec L2->L1 message from L2_TOKEN and a signature from a TEE signer registered in the TEE_REGISTRY. Once the Aztec Registry's canonical rollup is no longer ROLLUP, anyone can permanently freeze the portal, stopping deposits and fixing the refund snapshot at the last proven checkpoint. A refund needs a zk proof against that snapshot and a registered signer's signature.
```

```diff
+   Status: CREATED
    contract ZKTranscriptLib (eth:0x428Fa81B22AAF7C9acb9c73D114894886E3F7d4d) [zkmoney/ResolverVerifierLibrary]
    +++ description: Runtime library immutably linked into the zk.money resolver verifier. It evaluates circuit constraints or derives Fiat-Shamir challenges for zero-knowledge UltraHonk proofs.
```

```diff
+   Status: CREATED
    contract RegistrationController (eth:0x45F626E2a4D63232677C96B163ac46e20514a915) [zkmoney/v6/RegistrationController]
    +++ description: Completes paid name registrations from blessed registration addresses: deploys the user's L1 account, claims the name, writes the user record, optionally announces the name on Aztec through the NAME_PORTAL, and installs the user's first passkey. Fees above the relayer fee go to an allowlisted beneficiary.
```

```diff
+   Status: CREATED
    contract UserOpSIPA (eth:0x5180f0659D021368CDF5c4499967B9A329C775A0) [zkmoney/v6/UserOpSIPA]
    +++ description: Implementation of zk.money deposit addresses that carry an operation of the user's L1 account. Sweeping a funded clone executes the account operation fixed in the clone's address through the ERC-4337 EntryPoint, with the user's signature, then pays the listed fees and deposits the rest into the portal its ForwardingTable names. The recipient's account can recover any funds from the clone.
```

```diff
+   Status: CREATED
    contract OperationExecutor (eth:0x5ecE3b4EBE7137b1b6f92406dE17d9816D585c1c) [zkmoney/OperationExecutor]
    +++ description: Permissionless helper that executes a call and forwards the resulting token payout to the caller. Used by finalizers to collect fees and subsidies.
```

```diff
+   Status: CREATED
    contract MigrationExecutor (eth:0x70E9c762B02Ec645DF4BC2456271805cba80126c) [zkmoney/v6/MigrationExecutor]
    +++ description: Payout contract that moves refunds from the frozen SOURCE_PORTAL into DESTINATION_PORTAL. Only SOURCE_PORTAL can call it. It deposits the refund, minus the relayer tip committed in the refund, into DESTINATION_PORTAL for the recipient commitment the refund names.
```

```diff
+   Status: CREATED
    contract PlainWithdrawalExecutor (eth:0x7C8c2147d1BB8B83e0a0501097372de170eE702a) [zkmoney/v6/PlainWithdrawalExecutor]
    +++ description: Default payout contract for withdrawals and refunds. Only the PORTAL can call it. It pays the recipient and relayer tip committed on Aztec. An ordinary withdrawal first pays FEE to BENEFICIARY, while refunds pay no fee.
```

```diff
+   Status: CREATED
    contract SkyEscrowFactory (eth:0x7F890e5DF3B4165D1cE4E9A42e97C44f1d7dCc09) [zkmoney/SkyEscrowFactory]
    +++ description: Deploys deterministic escrows for moving funds between the DAI and sUSDS portals. Anyone can execute a funded escrow. Its implementation and routes are immutable.
```

```diff
+   Status: CREATED
    contract FrozenNotesRefundVerifier (eth:0x880F3C8356A930522896A7c539157D4c87F95377) [zkmoney/v6/FrozenNotesRefundVerifier]
    +++ description: UltraHonk verifier for refunds of notes that were unspent when the zk.money portal froze. Its verification key is immutable.
```

```diff
+   Status: CREATED
    contract TeeRegistry (eth:0x8b705C3519169F29850D156574ec377B686bd9CD) [zkmoney/v6/TeeRegistry]
    +++ description: Registry of the TEE signers that the zk.money portals accept for withdrawals and refunds. Anyone can register a signer with an AWS Nitro attestation of the enclave image PCR0_HASH that is at most TEE_ATTESTATION_MAX_AGE seconds old. Registration also sends an L1->L2 message to L2_RECIPIENT, whose inclusion the zk.money contracts on Aztec prove to accept the signer there. Registrations are permanent, and the approved image cannot change.
```

```diff
+   Status: CREATED
    contract SwapEscrowFactory (eth:0x8F4105a55C457D796Adab90d5D9E649861E81625) [zkmoney/SwapEscrowFactoryV2]
    +++ description: Swap-on-withdraw: a withdrawal can pay DAI to a SwapEscrowV2 clone whose route, recipient, gas share and tip are fixed in its address. Anyone can deploy and execute a funded clone to pay USDC, USDT, ETH or DAI to the recipient.
```

```diff
+   Status: CREATED
    contract MigrationExecutor_sUSDS (eth:0x92270578f3A311B3ced0019a4E15701e7405b4AE) [zkmoney/v6/MigrationExecutor]
    +++ description: Payout contract that moves refunds from the frozen SOURCE_PORTAL into DESTINATION_PORTAL. Only SOURCE_PORTAL can call it. It deposits the refund, minus the relayer tip committed in the refund, into DESTINATION_PORTAL for the recipient commitment the refund names.
```

```diff
+   Status: CREATED
    contract RegistrationSIPA (eth:0x96A52ed47Af73423D4b8a920913e5c1ceFdC1319) [zkmoney/v6/RegistrationSIPA]
    +++ description: Implementation of zk.money registration addresses. Sweeping a funded clone registers the name through the current RegistrationController of the NameRegistry, pays the committed and listed fees and deposits the rest into the portal its ForwardingTable names. The recipient's account can recover any funds from the clone.
```

```diff
+   Status: CREATED
    contract FrozenDepositsRefundVerifier (eth:0xa460C3130D1701a94f76d1122362C0D127f1C6A3) [zkmoney/v6/FrozenDepositsRefundVerifier]
    +++ description: UltraHonk verifier for refunds of deposits that reached Aztec but were unspent when the zk.money portal froze. Its verification key is immutable.
```

```diff
+   Status: CREATED
    contract NameRegistry (eth:0xa9863B8F573D62377d987ccb9AF6e0000f99D14a) [zkmoney/NameRegistry]
    +++ description: Registry of zk.money names. It points to the RegistrationController and the AccountMetadataRegistry, which together decide where payments to a zk.money name resolve to.
```

```diff
+   Status: CREATED
    contract SkyEscrow (eth:0xB61D97Faf96ec8de617aAF54F4764d01cfd25b8b) [zkmoney/SkyEscrow]
    +++ description: Implementation for savings conversion escrows. Each clone fixes the route, deposit commitment, relayer tip and recovery commitment in its address. It converts DAI into sUSDS or redeposits DAI after a savings withdrawal. The recovery account can reclaim stranded tokens, including shares taken without redemption.
```

```diff
+   Status: CREATED
    contract DepositSIPA (eth:0xBFe3dE3C4466cbC5803A756847208c69B3BAe401) [zkmoney/v6/DepositSIPA]
    +++ description: Implementation of zk.money deposit addresses. Anyone can sweep a funded clone, which swaps USDC or USDT to DAI, pays the fees its ForwardingTable lists and deposits the rest into the portal that table names for the token, for the recipient fixed in the clone's address. The recipient's account can recover any funds from the clone.
```

```diff
+   Status: CREATED
    contract Resolver (eth:0xc329a74542688a3c4948B7d46F204d3d7e5Dd525) [zkmoney/Resolver]
    +++ description: ENS resolver for zk.money names. It returns a deposit address derived from a resolver operator's answer, which must come with a zk proof that it matches the user's registered keys and L2 address in the AccountMetadataRegistry.
```

```diff
+   Status: CREATED
    contract SwapEscrow (eth:0xc953308e66DA19881d8ddD240E6369Db8Ef72Ab9) [zkmoney/SwapEscrowV2]
    +++ description: SwapEscrowV2 implementation. A clone swaps via the Curve 3pool (and Uniswap for ETH) with a slippage bound of 100 bps for stablecoins and 200 bps against the Chainlink ETH/USD price for ETH. It can first swap a capped share of the DAI to ETH for the recipient's gas. If the swap cannot execute, only the recovery key committed in the clone's address can move the funds.
```

```diff
+   Status: CREATED
    contract OxidePortal (eth:0xCB99C58Fe81Ae6b2cB4835e46F7b703745879042) [zkmoney/v6/OxidePortal]
    +++ description: Escrow of zk.money on the Aztec Network. A withdrawal needs both a proven Aztec L2->L1 message from L2_TOKEN and a signature from a TEE signer registered in the TEE_REGISTRY. Once the Aztec Registry's canonical rollup is no longer ROLLUP, anyone can permanently freeze the portal, stopping deposits and fixing the refund snapshot at the last proven checkpoint. A refund needs a zk proof against that snapshot and a registered signer's signature.
```

```diff
+   Status: CREATED
    contract PortalFactory (eth:0xCeae64c7211a2208afFc4F396ADD1D46996Cd2A2) [zkmoney/v6/PortalFactory]
    +++ description: Deploys OxidePortals that share its TEE_REGISTRY and refund verifiers. Each portal is a separate escrow for one token and one L2 token contract, and nothing in a deployed portal refers back to the factory.
```

```diff
+   Status: CREATED
    contract RelationsLib (eth:0xCEBD4589238699fcD7FEA8F89f05AE35F4D7E8c4) [zkmoney/ResolverVerifierLibrary]
    +++ description: Runtime library immutably linked into the zk.money resolver verifier. It evaluates circuit constraints or derives Fiat-Shamir challenges for zero-knowledge UltraHonk proofs.
```

```diff
+   Status: CREATED
    contract PlainWithdrawalExecutor_sUSDS (eth:0xd0D8E5C5B128ea7e5f2d461Afd6C669BC0877dF8) [zkmoney/v6/PlainWithdrawalExecutor]
    +++ description: Default payout contract for withdrawals and refunds. Only the PORTAL can call it. It pays the recipient and relayer tip committed on Aztec. An ordinary withdrawal first pays FEE to BENEFICIARY, while refunds pay no fee.
```

```diff
+   Status: CREATED
    contract OxideAccount (eth:0xdA0D7cD0f49cE7b1D04bf03eE56374a8981c2844) [zkmoney/OxideAccount]
    +++ description: Immutable implementation of users' L1 accounts. The bootstrap key authorizes the first passkey. Once a passkey is installed, only the user's passkeys can authorize operations and manage keys. The last passkey cannot be removed. Deposit recovery checks signatures against this account.
```

```diff
+   Status: CREATED
    contract AccountMetadataRegistry (eth:0xDA79Bae4485c40291363D885Aae5B543d2D0Efa9) [zkmoney/AccountMetadataRegistry]
    +++ description: Stores user records (Aztec L2 address, keys, chosen resolver operator) and resolver operator entries. User records can be written by the user or by the RegistrationController. Anyone can register as a resolver operator.
```

```diff
+   Status: CREATED
    contract CertManager (eth:0xe3DDDf3D4B624F49B4CeB81807338CCa14f5dd86) [zkmoney/CertManager]
    +++ description: Verifies and caches AWS Nitro attestation certificates. The only trust anchor is the hardcoded AWS Nitro root certificate.
```

```diff
+   Status: CREATED
    contract UnprocessedDepositRefundVerifier (eth:0xF15780eB45c49a7cB4FB0BF178D3DaF0F1D68c8a) [zkmoney/v6/UnprocessedDepositRefundVerifier]
    +++ description: UltraHonk verifier for refunds of deposits that never reached Aztec before the zk.money portal froze. Its verification key is immutable.
```

```diff
+   Status: CREATED
    contract SkyWithdrawalExecutor (eth:0xFE0B2B24cca52D1680103E258985A5aCA33742d5) [zkmoney/SkyWithdrawalExecutor]
    +++ description: Payout contract for sUSDS withdrawals and refunds. Only the PORTAL can execute a payout. It normally redeems sUSDS into USDS and converts USDS to DAI before paying the committed recipient and relayer tip. The recipient can complete an ordinary withdrawal in sUSDS shares through withdrawInShares, bypassing redemption.
```

```diff
+   Status: CREATED
    contract ForwardingTable (eth:0xFf839a8Be7c90c804F42563f352324cEBcDfe41C) [zkmoney/v6/ForwardingTable]
    +++ description: Routing table of zk.money deposit addresses. For each listed token it names the portal that deposit addresses using this table sweep into, and per intent the fee for the beneficiary and the tip for the sweeper. Rows and intents can only be added, never changed or removed.
```
