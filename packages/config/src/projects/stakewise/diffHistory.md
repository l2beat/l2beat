Generated with discovered.json: 0x16f19613277e1c12620580e43af4d29ebbe2193b

# Diff at Wed, 04 Nov 2026 16:45:37 GMT:

- id: e671e7a5
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1793810673

## Description

Initial discovery of StakeWise V3 (osETH): the vault registry, the Keeper and its oracle set, the osETH token and its flash-loan minter, vault controller, collateral config, redeemers and vault escrow, the shared MEV escrow, the deposit data registry, the ten vault factories, the eleven largest vaults (nine with at least 5,000 ETH plus the two nested meta vaults that anchor the osETH rate) with their admins and key managers, and the DAO Safe with its SafeSnap Reality module. The legacy V2 contracts beyond the Genesis vault's migration path, vault fee recipients, three unverified own-MEV escrows and the approved-implementation list are not crawled.

## Initial discovery

```diff
+   Status: CREATED
    contract OsTokenVaultEscrow (eth:0x09e84205DF7c68907e619D07aFD90143c5763605) [stakewise/OsTokenVaultEscrow]
    +++ description: Holds the osETH position of a staker who enters a vault's exit queue with osETH still minted until the exited ETH is claimed. Escrowed positions can be liquidated above a threshold of 999860000000000000 (1e18 = 100%) with a bonus of 1000068000000000000, or redeemed by the redeemer.
```

```diff
+   Status: CREATED
    contract SubVaultsRegistry_3428 (eth:0x1376D0233E70E021ecFFdcB2254519a66b8680E7) [stakewise/SubVaultsRegistry]
    +++ description: Per-meta-vault list of sub-vaults and the curator that allocates among them; only the meta vault's admin changes either, and adding a meta vault as a sub-vault needs the vault registry owner's acceptance.
```

```diff
+   Status: CREATED
    contract StakeWise DAO Multisig (eth:0x144a98cb1CdBb23610501fE6108858D9B7D24934) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract MetaVault_1563 (eth:0x15639E82d2072Fa510E5d2b5F0db361c823bCad3) [stakewise/EthMetaVault]
    +++ description: Vault holding shares of other vaults instead of staking itself. Deposits and exits are spread across the sub-vaults by a curator from the curators registry; the admin adds and ejects sub-vaults and picks the curator through the vault's sub-vaults registry. Rewards, losses, the exit queue and osETH minting pass through from the sub-vaults.
```

```diff
+   Status: CREATED
    EOA (eth:0x1578eD833D986c1188D1a998aA5FEcD418beF5da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PrivErc20VaultFactory (eth:0x1831834dC4Bf88B9d9183015e1285B105Ec2FdC9) [stakewise/VaultFactory]
    +++ description: Permissionless factory: anyone deploys a vault of this type as a proxy on the current implementation and registers it in the vault registry, becoming its admin.
```

```diff
+   Status: CREATED
    contract OwnMevEscrow (eth:0x1d80A09B60f4A65dfb8Dd3035b1812DCa95FFfe4) [stakewise/OwnMevEscrow]
    +++ description: Execution-layer reward receiver of a single vault; only that vault can harvest the balance.
```

```diff
+   Status: CREATED
    EOA (eth:0x2421F532abfE33A3AAc7DF2D4b4C8C84A164A653)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OwnMevEscrow (eth:0x2577609ab927EF4a2Cee449e36cFe156c5aA43B8) [stakewise/OwnMevEscrow]
    +++ description: Execution-layer reward receiver of a single vault; only that vault can harvest the balance.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x25854e2a49A6CDAeC7f0505b4179834509038549) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeWise Operations Multisig (eth:0x2685C0e39EEAAd383fB71ec3F493991d532A87ae) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract OsTokenConfig (eth:0x287d1e2A8dE183A8bf8f2b09Fa1340fBd766eb59) [stakewise/OsTokenConfig]
    +++ description: Collateral parameters for minting osETH against vault shares (loan-to-value, liquidation threshold and bonus, 1e18 = 100%), as a default and per-vault overrides; a threshold of 2^64-1 disables liquidations for that vault. Also names the redeemer allowed to burn osETH positions.
```

```diff
+   Status: CREATED
    contract SubVaultsRegistry_1563 (eth:0x29626C6b7F09cc2B6164e48683f453223FFA8ae4) [stakewise/SubVaultsRegistry]
    +++ description: Per-meta-vault list of sub-vaults and the curator that allocates among them; only the meta vault's admin changes either, and adding a meta vault as a sub-vault needs the vault registry owner's acceptance.
```

```diff
+   Status: CREATED
    contract OsTokenVaultController (eth:0x2A261e60FB14586B474C208b1B7AC6D0f5000306) [stakewise/OsTokenVaultController]
    +++ description: Share accounting behind osETH. Registered vaults on an approved implementation mint, registered vaults burn; total assets grow at the reward rate written by the keeper, 500 basis points of each increment are minted to the treasury, and the exchange rate is total assets over total shares. Minting stops at a capacity of 20000000000000000000000000 wei.
```

```diff
+   Status: CREATED
    contract MetaVault_3428 (eth:0x34284C27A2304132aF751b0dEc5bBa2CF98eD039) [stakewise/EthMetaVault]
    +++ description: Vault holding shares of other vaults instead of staking itself. Deposits and exits are spread across the sub-vaults by a curator from the curators registry; the admin adds and ejects sub-vaults and picks the curator through the vault's sub-vaults registry. Rewards, losses, the exit queue and osETH minting pass through from the sub-vaults.
```

```diff
+   Status: CREATED
    contract BlocklistErc20VaultFactory (eth:0x39c6eef5f955bcC280966504bc5c82F2394Fa368) [stakewise/VaultFactory]
    +++ description: Permissionless factory: anyone deploys a vault of this type as a proxy on the current implementation and registers it in the vault registry, becoming its admin.
```

```diff
+   Status: CREATED
    contract VaultsRegistry (eth:0x3a0008a588772446f6e656133C2D5029CC4FC20E) [stakewise/VaultsRegistry]
    +++ description: List of vaults, approved vault implementations and factories. Registered factories add the vaults they create; a vault admin can only upgrade to an approved implementation of the next version, and only vaults on an approved implementation can mint osETH.
```

```diff
+   Status: CREATED
    contract PrivMetaVaultFactory (eth:0x42427acFf6DdC93f73Fcb53d1a03AA26A292bA1A) [stakewise/VaultFactory]
    +++ description: Permissionless factory: anyone deploys a vault of this type as a proxy on the current implementation and registers it in the vault registry, becoming its admin.
```

```diff
+   Status: CREATED
    contract EthPrivVault_47fD (eth:0x47fd7ac6C6bc73F2D419a18D0692F37Df3f48034) [stakewise/EthPrivVault]
    +++ description: Staking vault with a deposit whitelist. Anyone deposits ETH for shares; the key manager registers staking keys whose withdrawal credentials point at the vault, each registration approved by the oracle quorum in the keeper. On every harvest the vault takes its cumulative reward from the keeper's root, mints 300 basis points of the gain to the fee recipient, applies losses to all shares and pays the exit queue from its spare ETH; queued exits are claimable after a delay fixed at deployment. Shareholders can mint osETH against their shares up to the vault's loan-to-value. Upgrades need the admin and a registry-approved implementation of the next version.
```

```diff
+   Status: CREATED
    contract SharedMevEscrow (eth:0x48319f97E5Da1233c21c48b80097c0FB7a20Ff86) [stakewise/SharedMevEscrow]
    +++ description: Smoothing pool for the execution-layer rewards of vaults that opted into it at creation. The oracles attribute its balance in the rewards root and each registered vault pulls its share during a harvest.
```

```diff
+   Status: CREATED
    contract EthVault_4aAf (eth:0x4AafdB911085dd7703e57951279744DD713f744d) [stakewise/EthVault]
    +++ description: Staking vault. Anyone deposits ETH for shares; the key manager registers staking keys whose withdrawal credentials point at the vault, each registration approved by the oracle quorum in the keeper. On every harvest the vault takes its cumulative reward from the keeper's root, mints 800 basis points of the gain to the fee recipient, applies losses to all shares and pays the exit queue from its spare ETH; queued exits are claimable after a delay fixed at deployment. Shareholders can mint osETH against their shares up to the vault's loan-to-value. Upgrades need the admin and a registry-approved implementation of the next version.
```

```diff
+   Status: CREATED
    contract PrivVaultFactory (eth:0x4C958642F1CD735F13aed02A4FB015153edDf8Fd) [stakewise/VaultFactory]
    +++ description: Permissionless factory: anyone deploys a vault of this type as a proxy on the current implementation and registers it in the vault registry, becoming its admin.
```

```diff
+   Status: CREATED
    contract FoxVault (eth:0x4FEF9D741011476750A243aC70b9789a63dd47Df) [stakewise/EthFoxVault]
    +++ description: First-generation staking vault with a blocklist and no osETH minting. Anyone not barred deposits ETH for shares; the keys manager publishes the root of staking keys that anyone can register, each registration approved by the oracle quorum in the keeper, with withdrawal credentials pointing at the vault. On every harvest the vault takes its cumulative reward from the keeper's root, mints 1500 basis points of the gain (fixed at creation) to the fee recipient, applies losses to all shares and pays the exit queue from its spare ETH. Upgrades need the admin and a registry-approved implementation of the next version.
```

```diff
+   Status: CREATED
    contract RealityETH (eth:0x5b7dD1E86623548AF054A4985F7fc8Ccbb554E2c) [stakewise/RealityETH]
    +++ description: Reality.eth v3 crowd-sourced oracle: anyone answers a question by posting a bond at least double the previous one; an answer stands once the timeout passes without a higher bond, or when the arbitrator rules.
```

```diff
+   Status: CREATED
    contract BlocklistVaultFactory (eth:0x608d8Ca6916b96edf63Dd429e62Fe1366ae6f3B5) [stakewise/VaultFactory]
    +++ description: Permissionless factory: anyone deploys a vault of this type as a proxy on the current implementation and registers it in the vault registry, becoming its admin.
```

```diff
+   Status: CREATED
    contract EthPrivVault_663a (eth:0x663a8C9e88c5cdc565Cc4bF0b2BEC8d862D744a6) [stakewise/EthPrivVault]
    +++ description: Staking vault with a deposit whitelist. Anyone deposits ETH for shares; the key manager registers staking keys whose withdrawal credentials point at the vault, each registration approved by the oracle quorum in the keeper. On every harvest the vault takes its cumulative reward from the keeper's root, mints 100 basis points of the gain to the fee recipient, applies losses to all shares and pays the exit queue from its spare ETH; queued exits are claimable after a delay fixed at deployment. Shareholders can mint osETH against their shares up to the vault's loan-to-value. Upgrades need the admin and a registry-approved implementation of the next version.
```

```diff
+   Status: CREATED
    contract Keeper (eth:0x6B5815467da09DaA7DC83Db21c9239d98Bb487b5) [stakewise/Keeper]
    +++ description: Entry point of the oracle committee. A rewards update stores the Merkle root of per-vault cumulative rewards that vaults harvest and forwards the osETH reward rate to the vault controller; it needs 6 of 11 oracle signatures, at least 12h since the previous update and a rate at or below a ceiling fixed at deployment. Staking key registrations, exit signatures and consolidations need 6 oracle signatures over the exact keys and the current beacon deposit root.
```

```diff
+   Status: CREATED
    contract DepositDataRegistry (eth:0x75AB6DdCe07556639333d3Df1eaa684F5735223e) [stakewise/DepositDataRegistry]
    +++ description: Default key manager for vaults that publish a Merkle root of deposit data: a per-vault deposit data manager sets the root and anyone can register the next keys in it, subject to oracle approval in the keeper.
```

```diff
+   Status: CREATED
    contract VaultFactory (eth:0x7A8cbBf690084E43De778173cfAcf7313c9122DD) [stakewise/VaultFactory]
    +++ description: Permissionless factory: anyone deploys a vault of this type as a proxy on the current implementation and registers it in the vault registry, becoming its admin.
```

```diff
+   Status: CREATED
    contract PriceFeed (eth:0x8023518b2192FB5384DAdc596765B3dD1cdFe471) [stakewise/PriceFeed]
    +++ description: Chainlink-compatible osETH/ETH feed returning the vault controller's exchange rate; no admin and no staleness check.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x830B0c3F0b06cB0d72F3c26c449F3317Dbc230E2) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RealityETH_ERC20 (eth:0x867092A32bC16816F12Fb326EfF7A2865E1ec138) [stakewise/RealityETH]
    +++ description: Reality.eth v3 crowd-sourced oracle: anyone answers a question by posting a bond at least double the previous one; an answer stands once the timeout passes without a higher bond, or when the arbitrator rules.
```

```diff
+   Status: CREATED
    contract PrivErc20MetaVaultFactory (eth:0x8f347eb308707DC1FA1acCF3ea889CF554b6B8A5) [stakewise/VaultFactory]
    +++ description: Permissionless factory: anyone deploys a vault of this type as a proxy on the current implementation and registers it in the vault registry, becoming its admin.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x9136DE31D17Ce92563469a72CD9cc01F90BeCf89) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Erc20VaultFactory (eth:0x97795DA27138BD8d79204D37F3A2e80fA4d30488) [stakewise/VaultFactory]
    +++ description: Permissionless factory: anyone deploys a vault of this type as a proxy on the current implementation and registers it in the vault registry, becoming its admin.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x9CE3027b2144e02ACD61bE66E81D48aE482A5222) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x9e83c6Bf5540f4296D8532e79636993e9eAeD338) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract OsTokenRedeemerNext (eth:0x9Fc8C7F3C1ff6d0DF39EcB5870884d59777Ea2Bb) [stakewise/OsTokenRedeemer]
    +++ description: Exit queue for osETH holders, processed in batches at least 12h apart and funded by redeeming osETH positions listed in a Merkle root the owner publishes; anyone can also buy queued osETH with ETH at the protocol rate. Where a redemption fee exists, the vault controller's owner sets it within the deployed ceiling.
```

```diff
+   Status: CREATED
    contract CuratorsRegistry (eth:0xa23F7c8d25f4503cA4cEd84d9CC2428e8745933C) [stakewise/CuratorsRegistry]
    +++ description: List of curators that meta vaults may appoint to allocate deposits and exits across their sub-vaults.
```

```diff
+   Status: CREATED
    contract EthVault_A8cB (eth:0xA8cB2e35F594b308726b242136f0a8995BF19E97) [stakewise/EthVault]
    +++ description: Staking vault. Anyone deposits ETH for shares; the key manager registers staking keys whose withdrawal credentials point at the vault, each registration approved by the oracle quorum in the keeper. On every harvest the vault takes its cumulative reward from the keeper's root, mints 500 basis points of the gain to the fee recipient, applies losses to all shares and pays the exit queue from its spare ETH; queued exits are claimable after a delay fixed at deployment. Shareholders can mint osETH against their shares up to the vault's loan-to-value. Upgrades need the admin and a registry-approved implementation of the next version.
```

```diff
+   Status: CREATED
    contract GenesisVault (eth:0xAC0F906E433d58FA868F936E8A43230473652885) [stakewise/EthGenesisVault]
    +++ description: Staking vault that absorbed the StakeWise V2 pool: V2 reward token holders migrate by burning their tokens for shares, and the V2 pool escrow that still receives the legacy stakes' withdrawals is owned by and counted into this vault. Anyone deposits ETH for shares; the key manager registers staking keys whose withdrawal credentials point at the vault, each registration approved by the oracle quorum in the keeper. On every harvest the vault takes its cumulative reward from the keeper's root, mints 500 basis points of the gain to the fee recipient, applies losses to all shares and pays the exit queue from its spare ETH; queued exits are claimable after a delay fixed at deployment. Shareholders can mint osETH against their shares up to the vault's loan-to-value. Upgrades need the admin and a registry-approved implementation of the next version.
```

```diff
+   Status: CREATED
    contract OwnMevEscrow (eth:0xB013b4F660108E16514245543f52eA6398202507) [stakewise/OwnMevEscrow]
    +++ description: Execution-layer reward receiver of a single vault; only that vault can harvest the balance.
```

```diff
+   Status: CREATED
    contract EthPrivErc20Vault_ccmETH (eth:0xB144B3b2D2a7d82e53BC70659Be03Bcd21CD94e8) [stakewise/EthPrivErc20Vault]
    +++ description: Staking vault with a deposit whitelist and transferable ERC20 shares (ccmETH). Anyone deposits ETH for shares; the key manager registers staking keys whose withdrawal credentials point at the vault, each registration approved by the oracle quorum in the keeper. On every harvest the vault takes its cumulative reward from the keeper's root, mints 0 basis points of the gain to the fee recipient, applies losses to all shares and pays the exit queue from its spare ETH; queued exits are claimable after a delay fixed at deployment. Shareholders can mint osETH against their shares up to the vault's loan-to-value. Upgrades need the admin and a registry-approved implementation of the next version.
```

```diff
+   Status: CREATED
    contract EthPrivVault_B266 (eth:0xB266274F55e784689e97b7E363B0666d92e6305B) [stakewise/EthPrivVault]
    +++ description: Staking vault with a deposit whitelist. Anyone deposits ETH for shares; the key manager registers staking keys whose withdrawal credentials point at the vault, each registration approved by the oracle quorum in the keeper. On every harvest the vault takes its cumulative reward from the keeper's root, mints 500 basis points of the gain to the fee recipient, applies losses to all shares and pays the exit queue from its spare ETH; queued exits are claimable after a delay fixed at deployment. Shareholders can mint osETH against their shares up to the vault's loan-to-value. Upgrades need the admin and a registry-approved implementation of the next version.
```

```diff
+   Status: CREATED
    contract StakeWise DAO RealityModule (eth:0xB5cF5363c3e766e64B37b2fB9554bFE8D48ED1A0) [gnosisSafeModules/RealityModule]
    +++ description: Zodiac Reality module (SafeSnap): executes transactions from the Safe once a Reality.eth question confirming an off-chain vote resolves. A question needs a bond of at least 1,000,000 of the oracle's bond token, stays open for 1d after the last answer, can execute after a further 1d and expires 7d later.
```

```diff
+   Status: CREATED
    contract OsTokenRedeemer (eth:0xc43A7b16A7a167c0318390Cba16787C11e9e1FD0) [stakewise/OsTokenRedeemer]
    +++ description: Exit queue for osETH holders, processed in batches at least 12h apart and funded by redeeming osETH positions listed in a Merkle root the owner publishes; anyone can also buy queued osETH with ETH at the protocol rate. Where a redemption fee exists, the vault controller's owner sets it within the deployed ceiling.
```

```diff
+   Status: CREATED
    contract Erc20MetaVaultFactory (eth:0xCd191DfDF52ae7aa2B1AD7B4a6A9D4d4FFB837B5) [stakewise/VaultFactory]
    +++ description: Permissionless factory: anyone deploys a vault of this type as a proxy on the current implementation and registers it in the vault registry, becoming its admin.
```

```diff
+   Status: CREATED
    contract MetaVaultFactory (eth:0xE51eE4200510498d5964627B25FE7D4685CB858c) [stakewise/VaultFactory]
    +++ description: Permissionless factory: anyone deploys a vault of this type as a proxy on the current implementation and registers it in the vault registry, becoming its admin.
```

```diff
+   Status: CREATED
    contract EthVault_e6d8 (eth:0xe6d8d8aC54461b1C5eD15740EEe322043F696C08) [stakewise/EthVault]
    +++ description: Staking vault. Anyone deposits ETH for shares; the key manager registers staking keys whose withdrawal credentials point at the vault, each registration approved by the oracle quorum in the keeper. On every harvest the vault takes its cumulative reward from the keeper's root, mints 500 basis points of the gain to the fee recipient, applies losses to all shares and pays the exit queue from its spare ETH; queued exits are claimable after a delay fixed at deployment. Shareholders can mint osETH against their shares up to the vault's loan-to-value. Upgrades need the admin and a registry-approved implementation of the next version.
```

```diff
+   Status: CREATED
    contract OsTokenFlashLoans (eth:0xeBe12d858E55DDc5FC5A8153dC3e117824fbf5d2) [stakewise/OsTokenFlashLoans]
    +++ description: Flash loans of osETH: mints up to a fixed amount to the borrower and burns it back within the same transaction, using its minter rights on the token. No admin.
```

```diff
+   Status: CREATED
    contract osETH (eth:0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38) [stakewise/OsToken]
    +++ description: ERC20 liquid staking token (osETH). Minted and burned by the vault controller and by the registered controllers; ownership is renounced, so that set is frozen, and there is no pause, blacklist or upgrade.
```

```diff
+   Status: CREATED
    contract Genesis Vault Admin Multisig (eth:0xf330b5fE72E91d1a3782E65eED876CF3624c7802) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fox Vault Admin Multisig (eth:0xFD8100AA60F851e0EB585C7c893B8Ef6A7F88788) [GnosisSafe]
    +++ description: None
```
