Generated with discovered.json: 0x1bea035c8e12dcf122cceb309622a5984aa270c9

# Diff at Wed, 16 Sep 2026 14:03:15 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@46c99238e8a0ab5dceba63616e2dee6b1d122281 block: 1785484385
- current timestamp: 1789567320

## Description

Timelock batch proposed 2026-08-27 and executed 2026-09-08 (tx `0x2b55c1ba874ab18e9f4258c99db25bebd0a34bdcf3834eea1ea77e4e7629d364`) called `upgradeToAndCall` with empty init data on seven proxies.

CollateralToken: `0x6bBCef9f7ef3B6C592c99e0f206a0DE94Ad0925f` → `0xCe84E053301A82937F90ee2C2c1889cAb1db25dE` ([diff](https://disco.l2beat.com/diff/matic:0x6bBCef9f7ef3B6C592c99e0f206a0DE94Ad0925f/matic:0xCe84E053301A82937F90ee2C2c1889cAb1db25dE)). Wrap/unwrap callbacks removed (the 5-argument overloads remain and ignore the callback arguments). New owner-only `rescue()` transfers any token balance held by the token contract itself; the vault is not reachable through it.

PositionManager: `0x30c038F0Dae8dcC3E6AD51D016F50821D32Cb87e` → `0xCc5De1e9D14a7AB75E872E23FC9D605518Bac2D0` ([diff](https://disco.l2beat.com/diff/matic:0x30c038F0Dae8dcC3E6AD51D016F50821D32Cb87e/matic:0xCc5De1e9D14a7AB75E872E23FC9D605518Bac2D0)). Contract logic unchanged apart from address masking in ERC1155 event emission. The id libraries now carry a `ResolutionChain` in bits 24-39 of condition and event ids (0 = Polygon); those bits were previously zero, so existing ids are unchanged.

BinaryModule: `0x492FEc596eC347459E1Ebe30b9245EB3B49B1BBa` → `0xf6428c0B5fa9361c0708CDdb95468cf54C56e9A2` ([diff](https://disco.l2beat.com/diff/matic:0x492FEc596eC347459E1Ebe30b9245EB3B49B1BBa/matic:0xf6428c0B5fa9361c0708CDdb95468cf54C56e9A2)). New immutable `RESOLUTION_CHAIN` = 0. Resolver-role holders can no longer report on markets mirrored from the CTF (the result is copied from the CTF ledger) or overwrite a stored result, and a repeated report must match the stored one. Resolution pause is per event instead of per condition. Migration of already-resolved CTF positions redeems them in the same call.

NegRiskModule: `0xA61e7ca374F721D5b9FD5b0FEe6Fb90f27d448d7` → `0x39a5B01a100edF811f2748aa37B1313715Ded70e` ([diff](https://disco.l2beat.com/diff/matic:0xA61e7ca374F721D5b9FD5b0FEe6Fb90f27d448d7/matic:0x39a5B01a100edF811f2748aa37B1313715Ded70e)). Same changes as BinaryModule. Public `resolveConditionToNo()` removed: once a condition resolves YES the remaining conditions, and once all resolve NO the synthetic last condition, are derived in `getResult()` instead of being stored by an explicit call. Stored results must be exactly 0 or 1e6.

CombinatorialModule: `0x03CC063e6F9552E3842136538092134EdC8962DE` → `0x572cD48cCe93B2E58F1cc0253a7fDd4B4952a9C2` on 2026-07-31 (tx `0x8d3af126155d4a85db8cb2a990a0eb9eb0909acbe36781c84674ccf5cd1ebb19`, [diff](https://disco.l2beat.com/diff/matic:0x03CC063e6F9552E3842136538092134EdC8962DE/matic:0x572cD48cCe93B2E58F1cc0253a7fDd4B4952a9C2)) → `0xf96968a44022B17240B42c557693E7C383d2d8a3` on 2026-09-08 ([diff](https://disco.l2beat.com/diff/matic:0x572cD48cCe93B2E58F1cc0253a7fDd4B4952a9C2/matic:0xf96968a44022B17240B42c557693E7C383d2d8a3)). July: leg sets are stored on first use and checked against the stored definition. September: the module-level `mintFromBridge`, `burnFromBridge`, `addBridge` and `removeBridge` overrides were removed in favour of the inherited BaseModule and OracleModule versions. The removed override required bridged ids to belong to this module with outcome index 0 or 1; the inherited one has no id check, and the ledger has `crossModuleAuth` set for this module, so a bridge-role holder could now mint or burn positions of any module. No address holds the bridge role on any module; admins can grant it with no delay. Events now include recipients.

CombosExchange: `0x7345C6842b244926125ed4054905cAc49620B5dc` → `0x641b40ec414a076b9e79E703Fc7BF4EBEC248Bb7` ([diff](https://disco.l2beat.com/diff/matic:0x7345C6842b244926125ed4054905cAc49620B5dc/matic:0x641b40ec414a076b9e79E703Fc7BF4EBEC248Bb7)). Order fill status now tracks the maker asset actually spent for both sides (BUY orders previously tracked shares at the signed price). Orders with zero `takerAmount` are rejected. Address and uint8 calldata fields are masked before use.

Router `0x12121212006e4CD160D18e3f00711DA5c3372600` (owner Timelock, not in discovery): `0x6c405da46fdc4172239e5053189b6577e290e62f` → `0x91fa5e2f12a308a13defdb6aaf80b71dbe9b7696` ([diff](https://disco.l2beat.com/diff/matic:0x6c405da46fdc4172239e5053189b6577e290e62f/matic:0x91fa5e2f12a308a13defdb6aaf80b71dbe9b7696)), adding only a zero-length operations check.

New OracleAggregator `0x0A0a0A0A8B00C51b7D810501b03F230028C04a87` (proxy owned by the Timelock, admin AdminSafe) received the resolver role (16) on BinaryModule and NegRiskModule on 2026-08-27 in the transaction that proposed the batch (`0x312ed760426df32b16b2095c9a3444bd795d09f5327ddc66b8605f096d7545ce`). OperationsAccount `0xAC9930b2AE455a671b62dE86876A7e8587825294` received the operator and rule-manager roles (6) on 2026-09-08 (`0xcf59768c7039da7b7903cf75fe39820ade3e25f1a5fbe165855a2d3932916534`). Operators and admins can replace an open request's arbitrator with any address and set its liveness window to zero, after which that address can resolve the request; admins can also resolve directly. Its first and so far only request (2026-09-15, `0xb12ff9d222931e970b33d8c824ff2665ba82acc541a1cc2f9a7b412ecb7383b2`) targets BinaryModule with OOReporterModule `0x000012e0009c84078c4924fba808a41b9f67527f` as the only reporter and `0x000000000000000000000000000000000000dEaD` as the only disputer.

PolymarketOOReporter `0x53703Dd6129d723066b6362510E5aE2fECd48218` (proxy owned by the oracle operators' Safe `0x6ee4D971142afadEa1828445124D6137080B4146`) added to the managed oracle requester whitelist on 2026-09-11 (`0x6191243316298082ac9f7fcc0bf045e773d3e1418d7615f259ea3a4ce2931fd5`). OOReporterModule is its enabled requester (2026-09-03, `0x168de46687f406879af20438048c0eb4f1ba5181b1ff940f47cdbc3dacb196ff`) and EOA `0x2964a637feaea99edf573087e8c3c0c1917d553c` its oracle initializer (2026-09-15, `0x46d3cff218d5f5be1fc27eda2e017081f4de92ecb4d35265ea69b3e514e0bbaf`). OOReporterModule, PolymarketOOReporter and Router are not referenced by tracked contracts and stay outside discovery.

AdminSafe: 1 member added on 2026-09-10 (`0x05a7c95f0a5b648822b935f94db98e30666c8ed9505dfeef91bdb585059d1c39`), threshold 3/6 → 3/7.

Oracle operators' Safe `0x6ee4D971142afadEa1828445124D6137080B4146`: all 4 members replaced and 1 added in six transactions between 2026-09-03 and 2026-09-15, threshold 2/4 → 3/5 (`0xdf2283d8d58805cb15e5b65fb754b7e5d64d94ff3e7b03218200853c56a670c3`).

Managed oracle proposer whitelist: 41 addresses added, 95 removed.

DepositWalletFactory: one role entry set to 0 on 2026-08-22, no active role.

## Watched changes

```diff
    contract DepositWalletFactory (matic:0x00000000000Fb5C9ADea0298D729A0CB3823Cc07) [polymarket/DepositWalletFactory] {
    +++ description: Upgradeable CREATE2 wallet factory. Operator-role holders deploy deterministic beacon-proxy wallets and relay signed call batches; legacy-deployer-role holders can separately deploy deterministic legacy UUPS wallets. Admins manage both roles and set the 1h delay that wallet owners must wait after pausing before withdrawals unlock.
+++ description: Role bitmask per address, reconstructed from role-update events. Bit 0 (1) admin, bit 1 (2) operator, bit 2 (4) legacy deployer.
+++ severity: HIGH
      values.roleHolders.127:
+        {"user":"matic:0xBE4e574c7d425b2dC2f600696251134713D2260e","roles":0}
    }
```

```diff
    contract PositionManager (matic:0x006F54F7f9A22e0000CC2AB60031000000ae9fEF) [polymarket/PositionManager] {
    +++ description: Upgradeable ERC1155 ledger of combination-outcome positions, mintable and burnable only by the outcome module registered for each position or a cross-authorised module. Admins can register or remove modules and grant registered modules cross-module mint and burn power.
      sourceHashes.1:
-        "0x5fe0342de8952b4767f5c3594edec87533a6032c8afceb4bae8d4b63f62ca530"
+        "0x7af4cb8f3020926868a2afb7da0cf9a3baf5f25b693c838168707fa2b8dd4a5d"
      values.$implementation:
-        "matic:0x30c038F0Dae8dcC3E6AD51D016F50821D32Cb87e"
+        "matic:0xCc5De1e9D14a7AB75E872E23FC9D605518Bac2D0"
      values.$pastUpgrades.0:
+        ["2026-09-08T16:05:31.000Z","0x2b55c1ba874ab18e9f4258c99db25bebd0a34bdcf3834eea1ea77e4e7629d364",["matic:0xCc5De1e9D14a7AB75E872E23FC9D605518Bac2D0"]]
      values.$upgradeCount:
-        0
+        1
      implementationNames.matic:0x30c038F0Dae8dcC3E6AD51D016F50821D32Cb87e:
-        "PositionManager"
      implementationNames.matic:0xCc5De1e9D14a7AB75E872E23FC9D605518Bac2D0:
+        "PositionManager"
    }
```

```diff
    contract AddressWhitelist (matic:0x0f79d0039956D58a7d5d006a6Dd64a35616Aa2c6) [polymarket/UmaAddressWhitelist] {
    +++ description: Owner-managed address whitelist. Other contracts can query whether an address is listed; the whitelist itself does not assign a meaning to the listed addresses.
      values.getWhitelist.2:
+        "matic:0x53703Dd6129d723066b6362510E5aE2fECd48218"
    }
```

```diff
    contract BinaryModule (matic:0x1000008dD9001B968442c1000017eaE6E0dA00Ba) [polymarket/BinaryModule] {
    +++ description: Upgradeable outcome module for two-sided markets. Split, merge and redemption functions have no caller restriction. Bridge-role holders can mint positions without collateral backing, while resolver-role holders can report results directly, bypassing the oracle path, except for markets mirrored from the CTF, whose results are copied from the CTF ledger; admins can pause reporting per event.
      sourceHashes.1:
-        "0x87d8ca7db4069bf703d321769a5522bc150c32d5c6669f13aa3c0857c1e0986c"
+        "0x95797fa4c2888119bb8269b4fd03bf38e2c5d63733160cbad76322187f4487c9"
      values.$implementation:
-        "matic:0x492FEc596eC347459E1Ebe30b9245EB3B49B1BBa"
+        "matic:0xf6428c0B5fa9361c0708CDdb95468cf54C56e9A2"
      values.$pastUpgrades.0:
+        ["2026-09-08T16:05:31.000Z","0x2b55c1ba874ab18e9f4258c99db25bebd0a34bdcf3834eea1ea77e4e7629d364",["matic:0xf6428c0B5fa9361c0708CDdb95468cf54C56e9A2"]]
      values.$upgradeCount:
-        0
+        1
+++ description: Role bitmask per address, reconstructed from role-update events. Bit 0 (1) admin, bit 1 (2) operator, bit 2 (4) creator, bit 3 (8) bridge, bit 4 (16) resolver.
+++ severity: HIGH
      values.roleHolders.3:
+        {"user":"matic:0x0A0a0A0A8B00C51b7D810501b03F230028C04a87","roles":16}
+++ description: Chain identifier embedded in this module's condition ids. Resolver-role holders can only report results for conditions carrying this identifier; 0 is Polygon.
      values.RESOLUTION_CHAIN:
+        0
      errors:
-        {"RESOLUTION_CHAIN":"Processing error occurred."}
      implementationNames.matic:0x492FEc596eC347459E1Ebe30b9245EB3B49B1BBa:
-        "BinaryModule"
      implementationNames.matic:0xf6428c0B5fa9361c0708CDdb95468cf54C56e9A2:
+        "BinaryModule"
    }
```

```diff
    contract NegRiskModule (matic:0x200000900045e3B6259600682756002200028933) [polymarket/NegRiskModule] {
    +++ description: Upgradeable outcome module for multi-outcome (negative-risk) markets. Split, merge, redemption and event-level conversion functions have no caller restriction. Bridge-role holders can mint positions without collateral backing, while resolver-role holders can report results directly, bypassing the oracle path, except for markets mirrored from the CTF, whose results are copied from the CTF ledger; admins can pause reporting per event.
      sourceHashes.1:
-        "0x2ecab083c9b8b0c244f336f39380667032458294da12748992c494be88a82db5"
+        "0x99d8fec3f42e5eda4b0ca1f15ce58e2d529b0b59604c57250cedeb84227040ac"
      values.$implementation:
-        "matic:0xA61e7ca374F721D5b9FD5b0FEe6Fb90f27d448d7"
+        "matic:0x39a5B01a100edF811f2748aa37B1313715Ded70e"
      values.$pastUpgrades.0:
+        ["2026-09-08T16:05:31.000Z","0x2b55c1ba874ab18e9f4258c99db25bebd0a34bdcf3834eea1ea77e4e7629d364",["matic:0x39a5B01a100edF811f2748aa37B1313715Ded70e"]]
      values.$upgradeCount:
-        0
+        1
+++ description: Role bitmask per address, reconstructed from role-update events. Bit 0 (1) admin, bit 1 (2) operator, bit 2 (4) creator, bit 3 (8) bridge, bit 4 (16) resolver.
+++ severity: HIGH
      values.roleHolders.3:
+        {"user":"matic:0x0A0a0A0A8B00C51b7D810501b03F230028C04a87","roles":16}
+++ description: Chain identifier embedded in this module's condition ids. Resolver-role holders can only report results for conditions carrying this identifier; 0 is Polygon.
      values.RESOLUTION_CHAIN:
+        0
      errors:
-        {"RESOLUTION_CHAIN":"Processing error occurred."}
      implementationNames.matic:0xA61e7ca374F721D5b9FD5b0FEe6Fb90f27d448d7:
-        "NegRiskModule"
      implementationNames.matic:0x39a5B01a100edF811f2748aa37B1313715Ded70e:
+        "NegRiskModule"
    }
```

```diff
    contract USD Coin (PoS) Token (matic:0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174) [N/A] {
    +++ description: None
      values.totalSupply:
-        1022267684903528
+        1023394380222820
    }
```

```diff
    contract CombinatorialModule (matic:0x30000034706C7d8e12009DAB006Be20000c031A8) [polymarket/CombinatorialModule] {
    +++ description: Upgradeable outcome module for combinatorial positions built from legs of other modules; payouts derive from the legs' resolved payouts. Position preparation, transformation and redemption functions have no caller restriction. Bridge-role holders can mint and burn positions without collateral backing, and the ids they pass are not restricted to this module.
      sourceHashes.1:
-        "0x541803ac19e309d7cd3a30c5dc382a0f02e3377c34bc0d6655b67ba6e674ef63"
+        "0x9b80d429676aa667aa792407ce561d5a314ab031cd77ff379148fc03990d7b30"
      values.$implementation:
-        "matic:0x03CC063e6F9552E3842136538092134EdC8962DE"
+        "matic:0xf96968a44022B17240B42c557693E7C383d2d8a3"
      values.$pastUpgrades.1:
+        ["2026-07-31T17:32:08.000Z","0x8d3af126155d4a85db8cb2a990a0eb9eb0909acbe36781c84674ccf5cd1ebb19",["matic:0x572cD48cCe93B2E58F1cc0253a7fDd4B4952a9C2"]]
      values.$pastUpgrades.2:
+        ["2026-09-08T16:05:31.000Z","0x2b55c1ba874ab18e9f4258c99db25bebd0a34bdcf3834eea1ea77e4e7629d364",["matic:0xf96968a44022B17240B42c557693E7C383d2d8a3"]]
      values.$upgradeCount:
-        1
+        3
      implementationNames.matic:0x03CC063e6F9552E3842136538092134EdC8962DE:
-        "CombinatorialModule"
      implementationNames.matic:0xf96968a44022B17240B42c557693E7C383d2d8a3:
+        "CombinatorialModule"
    }
```

```diff
    contract WrappedCollateral (matic:0x3A3BD7bb9528E159577F7C2e685CC81A765002E2) [polymarket/WrappedCollateral] {
    +++ description: ERC20 wrapper around an immutable underlying token. Its immutable owner is the deployer. Anyone can burn their wrapper units to send an equal amount of underlying to any recipient; only the owner can wrap, mint without depositing underlying, burn its own units, and release underlying held by the contract.
+++ description: Total supply of the wrapper token.
      values.totalSupply:
-        "23510804711007571"
+        "24266123776138698"
    }
```

```diff
    contract AdminSafe (matic:0x3dcE0a29139A851Da1dFCa56Af8e8a6440b4D952) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "matic:0x3b0dFCe5306C98789533E22e61F8102ab00985CB"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 7 (43%)"
    }
```

```diff
    contract Timelock (matic:0x47EbFAC3353314C788B96CDCbf41daadfE03629C) [polymarket/Timelock] {
    +++ description: Timelock with enumerable roles: proposers queue batches with a delay of at least 12h and executors run them once it elapses. Role grants are not delayed, so an admin can install new proposers, executors or cancellers instantly.
      receivedPermissions.9:
+        {"permission":"upgrade","from":"matic:0x0A0a0A0A8B00C51b7D810501b03F230028C04a87","description":"can upgrade the resolution router implementation and manage all roles.","role":".owner"}
    }
```

```diff
    contract GnosisSafeL2 (matic:0x6ee4D971142afadEa1828445124D6137080B4146) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "matic:0x14A8a909C6CAcdDc1371ca27376d1a55Cf3bec4a"
      values.$members.0:
-        "matic:0x72b32C1a6A75CBAfAe36c0CA8e763946d370E766"
+        "matic:0x4B417CB5F35571Cd608a5A9c90fB63955DFB88BF"
      values.$members.1:
-        "matic:0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
+        "matic:0xEDAC6B6b5D773c4c86B5922424FAeE701d0d66DD"
      values.$members.2:
-        "matic:0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5"
+        "matic:0xED2D6f4449E4c652e530b04102DA6ecd2eE709a3"
      values.$members.3:
-        "matic:0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
+        "matic:0x8E476274BaA30C87cdea0Ffe80210f6259fb3929"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "3 of 5 (60%)"
    }
```

```diff
    contract AddressWhitelist (matic:0x9F35885CE8f67a942D7B2f4Fbf937987DA08c463) [polymarket/UmaAddressWhitelist] {
    +++ description: Owner-managed address whitelist. Other contracts can query whether an address is listed; the whitelist itself does not assign a meaning to the listed addresses.
      values.getWhitelist.7:
-        "matic:0xa556D8d0673943b9bcC26926484fdFa6EEa62586"
      values.getWhitelist.8:
+        "matic:0xF84A9BB19845F4d79a14E1dEb475a311B4224BA9"
      values.getWhitelist.10:
-        "matic:0x397A89E36d2004295c5dE5e9698D96eB477f0c6c"
      values.getWhitelist.14:
-        "matic:0x8D56829044EC3ed70AF29AE05Aa3dA4e507F4d07"
      values.getWhitelist.18:
-        "matic:0x7df15E08b9F7f4D7ae816eF91626702384277db8"
      values.getWhitelist.19:
-        "matic:0x7e6Dc8cC674678291Fe1C5ddf54e5cC6e82FFabC"
      values.getWhitelist.24:
-        "matic:0x1639bB67dABF8d3a5d3E7f3cb6D611A3C67C1256"
      values.getWhitelist.27:
-        "matic:0x674eeFeb269E880f75Dd545c56fF4D05A2C96ec5"
      values.getWhitelist.29:
-        "matic:0xeB547c79060cE4cdBECF2d7Bd462129A6Ba3468f"
      values.getWhitelist.30:
-        "matic:0xBF97B80e69BA7C935995C1d997Fd64BBd87E729C"
      values.getWhitelist.32:
+        "matic:0xD7f6ebDf0235f587154E2D7D38f9D80568494993"
      values.getWhitelist.46:
-        "matic:0xE67BB73D79de8411424d875cAec8E0279FbFE7a2"
      values.getWhitelist.53:
-        "matic:0xdAD4a60bca951B0a090eD0ea3568Cebdb60186d9"
      values.getWhitelist.63:
-        "matic:0x634A6D52d63C18f6d20210B809cBE7f3192b0EBC"
      values.getWhitelist.68:
-        "matic:0x21b2409724C1A3e7F1693a21990b378Ca9a74d78"
      values.getWhitelist.69:
-        "matic:0xCe0ab11e6f2297460445B2962722B85A52384e4b"
      values.getWhitelist.74:
-        "matic:0xF2A96e3C603aA11E0A02edEA7f7646FAf294089d"
      values.getWhitelist.76:
-        "matic:0x4b3648A65d0ebaF66CeFdf8223c39cbF4430Df2A"
      values.getWhitelist.78:
-        "matic:0x5EcdE7348Ea5100Af4360dD7A6E0a3Fb1D420787"
      values.getWhitelist.81:
-        "matic:0xB20D26cC96515f773073DD270Aab7E12bcb4dB55"
      values.getWhitelist.88:
-        "matic:0x30c2E7B5b8A7fCE558b9139d03f4b935c3889949"
      values.getWhitelist.89:
-        "matic:0xba6fFbD29b7445D84D4ba5a794B21Ab43867e590"
      values.getWhitelist.91:
-        "matic:0xC937349bDCD6edB02804f9b38dc1F9Ca2901DAFC"
      values.getWhitelist.92:
-        "matic:0xbC9aA68eA9Af9B895C42197616634CA0BD90E2b9"
      values.getWhitelist.93:
-        "matic:0x20F9353d09627084ff0AD030E6E62148c0784FA7"
      values.getWhitelist.95:
-        "matic:0xc337b3830365b85985D3BBf4f53A360287d13AF8"
      values.getWhitelist.96:
-        "matic:0xA44bBE26C8e7C3d0cb443F2aB97Dd81295318E33"
      values.getWhitelist.97:
-        "matic:0x15712915859b017CeFCC5E672e89056D59C5E6D5"
      values.getWhitelist.98:
-        "matic:0x262091c68c31F658f5a5CF9e043185a294EA557c"
      values.getWhitelist.99:
-        "matic:0xD9535BD11f79B1940AFC1E7243236c21873B20d9"
      values.getWhitelist.100:
-        "matic:0xB6Bc3dba7cD8Ba6342676FeDfCC8A3C5718aA80f"
      values.getWhitelist.101:
-        "matic:0x3bF8d6160b031d22609AC9cCA320283bd9aB76AD"
      values.getWhitelist.103:
-        "matic:0xdC8dCe690625A14A0396758C72243Cc7802cc15d"
      values.getWhitelist.104:
-        "matic:0x289d52B11d9f4b5Ceb2007B0007B87Eb14ffACb7"
      values.getWhitelist.105:
-        "matic:0xd959C3A00694183Fe1698d0d98dB2c980B866ae3"
      values.getWhitelist.106:
-        "matic:0x107C1a4fd738C23106fb2b3eAAC13853DFBAB9Eb"
      values.getWhitelist.113:
-        "matic:0x74769E205fCCE2577cc2F4ca67762e6595D6306C"
      values.getWhitelist.116:
-        "matic:0x48d18645e747c86dEF0aC3dB8C391A36c04729Ab"
      values.getWhitelist.119:
-        "matic:0x98d85600B0434a4dc1670163b9839cf2b237B351"
      values.getWhitelist.120:
-        "matic:0x27D425D567Ef2e1c043f5D0996d2F99a78435b28"
      values.getWhitelist.123:
-        "matic:0xB033961BD425926c12f622EfF02b5A1a1Ef807dd"
      values.getWhitelist.128:
-        "matic:0xECb68695DED7baFe484C2e16c85537366bbE418b"
      values.getWhitelist.130:
-        "matic:0x30fb83dBf1F6d668255c9158A00Bdb0083131f44"
      values.getWhitelist.133:
-        "matic:0x868371fA8Bec40A21867D69197cDE90d0B3f9bF5"
      values.getWhitelist.134:
-        "matic:0xe1366Aebf8d29a9642798FB65DFcDd0451c04929"
      values.getWhitelist.135:
-        "matic:0x3807ade15D233F1b3815271d17583dc2B615135d"
      values.getWhitelist.138:
-        "matic:0xe752cE135a66B1614c2DA180CdE240e75c12Aa66"
      values.getWhitelist.143:
-        "matic:0xB835C28C0d9D88Da79D85E98BE10fF262Ad43763"
      values.getWhitelist.145:
-        "matic:0x4043bAaE419A2F34Eb8D54b0A6880B550d546921"
      values.getWhitelist.146:
-        "matic:0x8E3546Eaec803Bb2BF29F4030885cf8Ba30023D4"
      values.getWhitelist.147:
-        "matic:0x974beAce4d5Aeae2e809c875dD06D8fcF28d3DF2"
      values.getWhitelist.148:
-        "matic:0xEb01Ec29a10CBad0E5E3D3EBB56154BabAa7eB75"
      values.getWhitelist.149:
-        "matic:0xc60b3CA07984c1970841F3Fc291572941cB3fE07"
      values.getWhitelist.150:
-        "matic:0x2FFf0D0DC4eBFFe565Ed85863B9672d1558df574"
      values.getWhitelist.152:
-        "matic:0x3e8379fA4E49648D88DC6C885Abd776aDBDc2132"
      values.getWhitelist.162:
-        "matic:0x8c7560CD13975d02882c0baF3557F49d4f1db982"
      values.getWhitelist.163:
-        "matic:0x4c1805549b23b971070025De0238b5a779497AAb"
      values.getWhitelist.164:
-        "matic:0x0DC6386691a3AE90b98Fd087871172B4d515C0BB"
      values.getWhitelist.165:
-        "matic:0x83325246B84C7BAc5785E585E2f95cE8A1B0ea86"
      values.getWhitelist.166:
-        "matic:0xa418E3B9e796191d2f48fDC165FB5A5d3Ee5aD46"
      values.getWhitelist.168:
-        "matic:0x355De74F66CDE298d5f1B3bB634850D76c5E7Db9"
      values.getWhitelist.175:
-        "matic:0x93864DA3Ca625D71484BBABE7764235BF9EAaF3C"
      values.getWhitelist.176:
-        "matic:0x4160475Ab4598d0646A4a0FCBc84c9996Fbaf26D"
      values.getWhitelist.181:
-        "matic:0x47D3f93Eef4EBfe6D51bBcC5dA506Ee0DB79ACf2"
      values.getWhitelist.184:
-        "matic:0x9Ce22DC7DF3e41586269D2d9E8BC3A5cb222d21E"
      values.getWhitelist.192:
-        "matic:0xDAb2dA14DE3Aba41aDC3b4eDe3DBc99aE28a5941"
      values.getWhitelist.195:
-        "matic:0xad6153034b174437a9e470B21f1a2D9c8c60927e"
      values.getWhitelist.196:
-        "matic:0xb4949f0d5A7E6fB0848A74a41FB2eC63505E8c25"
      values.getWhitelist.199:
-        "matic:0x7060719595B61f31Ccf914399aAe5FAC4e75D888"
      values.getWhitelist.204:
-        "matic:0x988D8612286C7f4867b6f84d6306DB59573F4ca1"
      values.getWhitelist.205:
-        "matic:0xE99bd86406A2e10A01A257814B21A696Df2bf5b3"
      values.getWhitelist.206:
-        "matic:0x80f853F402f4b40B895dcE74C31E1fE2C21e440d"
      values.getWhitelist.208:
-        "matic:0x706F5b4a0fd5D0D1e05D9AdB04E0009475379cB5"
      values.getWhitelist.209:
-        "matic:0x1b45885387750Fe0346e75E914BeA82f437Dc36B"
      values.getWhitelist.215:
-        "matic:0xdE875A668A513821cFecc82ee7eEe2eb1973Ad81"
      values.getWhitelist.221:
-        "matic:0x8a661E3042311D0AcF78380F4e9698B1BE4Fa595"
      values.getWhitelist.225:
-        "matic:0xC976a7Ee027d213eEAa5D3168CE104B4c2d8297E"
      values.getWhitelist.228:
-        "matic:0xCc41097Ec48Cda14074232216af1823949A79F1D"
      values.getWhitelist.233:
-        "matic:0x58F8f1138Be2192696378629fC9aA23c7910Dc70"
      values.getWhitelist.236:
-        "matic:0xeaC50994116569475D8D9AACD70519D471Ab2bDe"
      values.getWhitelist.239:
-        "matic:0xf093e9AD27363488f06bA80AA2D52EEF4c861BC8"
      values.getWhitelist.240:
-        "matic:0x3C170f7B975699c4AD6152C7D55C961a194d97b1"
      values.getWhitelist.241:
-        "matic:0xb14Ad5ecDD9011720A23ac73381282CE37cd95cB"
      values.getWhitelist.244:
-        "matic:0x1fd3Ba39EC45C6b728491b43EDd19F8a21818f14"
      values.getWhitelist.246:
-        "matic:0x3b52b1d5A46EAe2998665293502b37b1Ca9D8073"
      values.getWhitelist.247:
-        "matic:0x1663A2506565B5ee3aBF268d59B5737DE6A13245"
      values.getWhitelist.248:
-        "matic:0x7b16FC960A98378B84BF879d75795F062fC87f71"
      values.getWhitelist.252:
-        "matic:0x0C3899Da5Bf375bA0fA964EC485B4766e35bA4C4"
      values.getWhitelist.261:
-        "matic:0x1a934044f9FBEB0EbFC721aD40200c466AE44eCc"
      values.getWhitelist.262:
-        "matic:0x0A8a4D2f6fCB8033C7592294Ad0734AEaDc2445F"
      values.getWhitelist.264:
-        "matic:0x9B836E29c55bFb31f6c92C4C099c56e7A6dCD70e"
      values.getWhitelist.267:
-        "matic:0x4e5Cc211A8728bf3188b118a015916BD370DB5D2"
      values.getWhitelist.269:
-        "matic:0xDbC85f9A0fF2e0b053fd089775bF08e2E407Dc36"
      values.getWhitelist.274:
-        "matic:0x4d176c75A70514Ab147923d07DFB7eaF40eB9915"
      values.getWhitelist.216:
+        "matic:0xe17Eb1C3872B84FA4FDC218e4FF59398CbfD42de"
      values.getWhitelist.336:
-        "matic:0xbfF43458d79aE37E87F2c9973DbcA9569706E456"
      values.getWhitelist.356:
-        "matic:0x0c783FceBFd70395Ce4D158fAF53193c720b01ed"
      values.getWhitelist.284:
+        "matic:0x03088C8Ed7d195752f3A92F6b19A4B02463BaE86"
      values.getWhitelist.386:
-        "matic:0xaA4900f5FA36278C6B5fce1B4B1d16AfB49e5f04"
      values.getWhitelist.302:
+        "matic:0x3552AAD23Ece48e17EA933bFdC0A3137dCA8eee4"
      values.getWhitelist.303:
+        "matic:0x1E2C864466418E1ecB882eB01BFA0A67662fc556"
      values.getWhitelist.304:
+        "matic:0xaf1Ff7E22177834912644eF3b74ba6BbC54355e7"
      values.getWhitelist.305:
+        "matic:0xC5A7bc94C073650dB6bCa8c2Aec07c2E25BD0491"
      values.getWhitelist.306:
+        "matic:0x1307f2E9c24C6a4CF0FD37332075b08e8740264F"
      values.getWhitelist.307:
+        "matic:0x1918D9EaBDBf4Fe57C4267aA613093231E90E788"
      values.getWhitelist.308:
+        "matic:0x3Ec0471bB31627A3aD3BC01aFcED367d3a0FBb18"
      values.getWhitelist.309:
+        "matic:0x5ABBd1aA6Ff12a45a1476B237027B14C0E3cA7F8"
      values.getWhitelist.310:
+        "matic:0x89e4e7578cB813fd2E9bF0daada9A72fA70Aa8b5"
      values.getWhitelist.311:
+        "matic:0x8a93397AAb2c1375054E196b18A599a6CE8Dc18b"
      values.getWhitelist.312:
+        "matic:0x9051949487605CD494C47daA82b6ae100A054125"
      values.getWhitelist.313:
+        "matic:0x925d85e05316a9B8476AF2437d2b7b336198C99f"
      values.getWhitelist.314:
+        "matic:0x9453a389C73df7991249d9f2C6E2c854157b1a48"
      values.getWhitelist.315:
+        "matic:0xA71954885532D6F8D90b08BBbCcE8ef63Bf546ab"
      values.getWhitelist.316:
+        "matic:0xbfE37388804148d4C9c3fD0FBd02F7c3B89Aa812"
      values.getWhitelist.317:
+        "matic:0xCf331f8e1653CfAcc307E9585056A8d6168A9a4C"
      values.getWhitelist.318:
+        "matic:0xACB821D963A1020FAa5b3Fe25b13035439D87eB6"
      values.getWhitelist.319:
+        "matic:0x36dA3e7e9469bDEBc3FeA15232D174Ca86E2E6B2"
      values.getWhitelist.320:
+        "matic:0xA5Da11CadF6fE0525df99aE02B08a60B38B3FeBb"
      values.getWhitelist.321:
+        "matic:0xbFD7224e98506FDC6CED654459922435216a4DeA"
      values.getWhitelist.322:
+        "matic:0xFeF5DAD5547ae04B2E4E8573fB6E4A2874fdC48B"
      values.getWhitelist.323:
+        "matic:0x28f34338C54a63373B411d16203A63Bc82bc9eE5"
      values.getWhitelist.324:
+        "matic:0x21b1fe2682F103215A39Fa7BEd53D387DF0cc40E"
      values.getWhitelist.325:
+        "matic:0x31E5DE361f4879250961c7783D625F54950F3eb4"
      values.getWhitelist.326:
+        "matic:0x4A0d887bd379dF3A2aF908Eb661A9e745492b961"
      values.getWhitelist.327:
+        "matic:0x5b2659656179781a9e71c8F011c2Ce63E17fdD0A"
      values.getWhitelist.328:
+        "matic:0x6ab806666E11EBFB9F4cF14096A680EF5B007241"
      values.getWhitelist.329:
+        "matic:0x9536EB4969525BA3E27fACf6dFad5F6BE944C874"
      values.getWhitelist.330:
+        "matic:0xb797eFAe3948739E245B172C7a35836F829Cd257"
      values.getWhitelist.331:
+        "matic:0xcabbddF9B34D0722100a3Fc7921749433B770Fb6"
      values.getWhitelist.332:
+        "matic:0xF0C5E584378bA038783D6ebb002f33Cc54e247d6"
      values.getWhitelist.333:
+        "matic:0xf167a6aE5fabF41a16B36a6d882CC12CAD43a399"
      values.getWhitelist.334:
+        "matic:0xE0312CFA7A660852817cA313057809AC4Da3fADA"
      values.getWhitelist.335:
+        "matic:0x3665D88AA6A0B0cdE311bb3e94100F887FAaa599"
      values.getWhitelist.336:
+        "matic:0x4De403354f450B3E51636BdB0fe4F2a5724aAFfB"
      values.getWhitelist.337:
+        "matic:0x2450a062AD74dDc7170D1637C1582ca3A5e019Be"
      values.getWhitelist.338:
+        "matic:0xaAB1a0ac6B2186f8347aF4d588786Aa19abc62B3"
    }
```

```diff
    contract CollateralToken (matic:0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB) [polymarket/CollateralToken] {
    +++ description: Upgradeable ERC20 (pUSD) that wraps either of two immutable supported assets one-for-one, transferring deposits to an immutable vault. Wrapper-role holders can wrap and unwrap; minter-role holders can mint without depositing an asset and burn their own balance. The owner can transfer out any token balance held by the contract itself, which does not include the vault.
      sourceHashes.1:
-        "0x640f1329601b6af0916559ab082aa7cfef1805c5f6fdd6bd25c2a8999f93f32d"
+        "0xbbae056c06560153f9555e521d4a6fd86a1c75473d2abe76b51ad527b714bd57"
      values.$implementation:
-        "matic:0x6bBCef9f7ef3B6C592c99e0f206a0DE94Ad0925f"
+        "matic:0xCe84E053301A82937F90ee2C2c1889cAb1db25dE"
      values.$pastUpgrades.0:
+        ["2026-09-08T16:05:31.000Z","0x2b55c1ba874ab18e9f4258c99db25bebd0a34bdcf3834eea1ea77e4e7629d364",["matic:0xCe84E053301A82937F90ee2C2c1889cAb1db25dE"]]
      values.$upgradeCount:
-        0
+        1
+++ description: Total supply of the collateral token.
      values.totalSupply:
-        491543026531785
+        467452379632150
      implementationNames.matic:0x6bBCef9f7ef3B6C592c99e0f206a0DE94Ad0925f:
-        "CollateralToken"
      implementationNames.matic:0xCe84E053301A82937F90ee2C2c1889cAb1db25dE:
+        "CollateralToken"
    }
```

```diff
    contract GnosisSafeL2 (matic:0xC193b33ff5E8A68F422a5d36A2dEf1D196b15160) [N/A] {
    +++ description: None
      values.nonce:
-        425
+        433
    }
```

```diff
    contract CombosExchange (matic:0xe3333700cA9d93003F00f0F71f8515005F6c00Aa) [polymarket/CombosExchange] {
    +++ description: Upgradeable request-for-quote exchange where operator-role holders settle EIP-712 signed orders for combination positions. Operators supply the fee on each fill; it is not part of the signed order and is checked only against a global limit of 1000 bps fixed at deployment. A zero limit means fees have no percentage cap, not that fees are zero: an operator can charge up to all proceeds on a sell or collect an additional amount from a buyer, subject to the buyer's balance and allowance.
      sourceHashes.1:
-        "0x1e5ccf5a4b9e5b8de8e01e19ebba561c71751c34e69d9db0d398f5d14ebc8b03"
+        "0xf1a6ae2587365e7e5c3d4c410f146685d8315f0207430ca3d00c009fc61b7525"
      values.$implementation:
-        "matic:0x7345C6842b244926125ed4054905cAc49620B5dc"
+        "matic:0x641b40ec414a076b9e79E703Fc7BF4EBEC248Bb7"
      values.$pastUpgrades.0:
+        ["2026-09-08T16:05:31.000Z","0x2b55c1ba874ab18e9f4258c99db25bebd0a34bdcf3834eea1ea77e4e7629d364",["matic:0x641b40ec414a076b9e79E703Fc7BF4EBEC248Bb7"]]
      values.$upgradeCount:
-        0
+        1
      implementationNames.matic:0x7345C6842b244926125ed4054905cAc49620B5dc:
-        "Exchange"
      implementationNames.matic:0x641b40ec414a076b9e79E703Fc7BF4EBEC248Bb7:
+        "Exchange"
    }
```

```diff
+   Status: CREATED
    contract OracleAggregator (matic:0x0A0a0A0A8B00C51b7D810501b03F230028C04a87) [polymarket/OracleAggregator]
    +++ description: Upgradeable resolution router that holds the resolver role on the PositionManager outcome modules. Operators register a request per event and choose its reporter modules, disputer modules, arbitrator module, optional finalizer and liveness window of at most 7d. A result proposed by enough reporter modules becomes final after the liveness window unless enough disputer modules escalate it to the arbitrator. Operators and admins can change an open request's modules, arbitrator and liveness window at any time, so an operator can appoint itself arbitrator and set any result. Admins can also resolve any request directly. Both can pause single markets or the whole oracle with no delay.
```

## Source code changes

```diff
.../BinaryModule/BinaryModule.sol                  |  910 ++-
 .../CollateralToken/CollateralToken.sol            |  217 +-
 .../CombinatorialModule/CombinatorialModule.sol    |  490 +-
 .../CombosExchange/Exchange.sol                    | 1020 ++-
 .../NegRiskModule/NegRiskModule.sol                | 1181 ++-
 .../.flat/OracleAggregator/OracleAggregator.p.sol  | 8193 ++++++++++++++++++++
 .../.flat/OracleAggregator/OracleAggregator.sol    | 8193 ++++++++++++++++++++
 .../PositionManager/PositionManager.sol            |  400 +-
 8 files changed, 19198 insertions(+), 1406 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785484385 (main branch discovery), not current.

```diff
    contract PositionManager (matic:0x006F54F7f9A22e0000CC2AB60031000000ae9fEF) [polymarket/PositionManager] {
    +++ description: Upgradeable ERC1155 ledger of combination-outcome positions, mintable and burnable only by the outcome module registered for each position or a cross-authorised module. Admins can register or remove modules and grant registered modules cross-module mint and burn power.
      sourceHashes.0:
-        "0x5fe0342de8952b4767f5c3594edec87533a6032c8afceb4bae8d4b63f62ca530"
+        "0x7af4cb8f3020926868a2afb7da0cf9a3baf5f25b693c838168707fa2b8dd4a5d"
    }
```

```diff
    contract BinaryModule (matic:0x1000008dD9001B968442c1000017eaE6E0dA00Ba) [polymarket/BinaryModule] {
    +++ description: Upgradeable outcome module for two-sided markets. Split, merge and redemption functions have no caller restriction. Bridge-role holders can mint positions without collateral backing, while resolver-role holders can report results directly, bypassing the oracle path, except for markets mirrored from the CTF, whose results are copied from the CTF ledger; admins can pause reporting per event.
      sourceHashes.0:
-        "0x87d8ca7db4069bf703d321769a5522bc150c32d5c6669f13aa3c0857c1e0986c"
+        "0x95797fa4c2888119bb8269b4fd03bf38e2c5d63733160cbad76322187f4487c9"
      description:
-        "Upgradeable outcome module for two-sided markets. Split, merge and redemption functions have no caller restriction. Bridge-role holders can mint positions without collateral backing, while resolver-role holders can report results directly, bypassing the oracle path; admins can pause reporting by a resolver or for a condition."
+        "Upgradeable outcome module for two-sided markets. Split, merge and redemption functions have no caller restriction. Bridge-role holders can mint positions without collateral backing, while resolver-role holders can report results directly, bypassing the oracle path, except for markets mirrored from the CTF, whose results are copied from the CTF ledger; admins can pause reporting per event."
      fieldMeta.RESOLUTION_CHAIN:
+        {"description":"Chain identifier embedded in this module's condition ids. Resolver-role holders can only report results for conditions carrying this identifier; 0 is Polygon."}
      errors:
+        {"RESOLUTION_CHAIN":"Processing error occurred."}
    }
```

```diff
    contract NegRiskModule (matic:0x200000900045e3B6259600682756002200028933) [polymarket/NegRiskModule] {
    +++ description: Upgradeable outcome module for multi-outcome (negative-risk) markets. Split, merge, redemption and event-level conversion functions have no caller restriction. Bridge-role holders can mint positions without collateral backing, while resolver-role holders can report results directly, bypassing the oracle path, except for markets mirrored from the CTF, whose results are copied from the CTF ledger; admins can pause reporting per event.
      sourceHashes.0:
-        "0x2ecab083c9b8b0c244f336f39380667032458294da12748992c494be88a82db5"
+        "0x99d8fec3f42e5eda4b0ca1f15ce58e2d529b0b59604c57250cedeb84227040ac"
      description:
-        "Upgradeable outcome module for multi-outcome (negative-risk) markets. Split, merge, redemption and event-level conversion functions have no caller restriction. Bridge-role holders can mint positions without collateral backing, while resolver-role holders can report results directly, bypassing the oracle path; admins can pause reporting by a resolver or for a condition."
+        "Upgradeable outcome module for multi-outcome (negative-risk) markets. Split, merge, redemption and event-level conversion functions have no caller restriction. Bridge-role holders can mint positions without collateral backing, while resolver-role holders can report results directly, bypassing the oracle path, except for markets mirrored from the CTF, whose results are copied from the CTF ledger; admins can pause reporting per event."
      fieldMeta.RESOLUTION_CHAIN:
+        {"description":"Chain identifier embedded in this module's condition ids. Resolver-role holders can only report results for conditions carrying this identifier; 0 is Polygon."}
      errors:
+        {"RESOLUTION_CHAIN":"Processing error occurred."}
    }
```

```diff
    contract CombinatorialModule (matic:0x30000034706C7d8e12009DAB006Be20000c031A8) [polymarket/CombinatorialModule] {
    +++ description: Upgradeable outcome module for combinatorial positions built from legs of other modules; payouts derive from the legs' resolved payouts. Position preparation, transformation and redemption functions have no caller restriction. Bridge-role holders can mint and burn positions without collateral backing, and the ids they pass are not restricted to this module.
      sourceHashes.0:
-        "0x06dcda146da5202954ba4febb4c81f5819607c93e007b7a5fc42118e23412302"
+        "0x9b80d429676aa667aa792407ce561d5a314ab031cd77ff379148fc03990d7b30"
      description:
-        "Upgradeable outcome module for combinatorial positions built from legs of other modules; payouts derive from the legs' resolved payouts. Position preparation, transformation and redemption functions have no caller restriction. Bridge-role holders can mint positions without collateral backing."
+        "Upgradeable outcome module for combinatorial positions built from legs of other modules; payouts derive from the legs' resolved payouts. Position preparation, transformation and redemption functions have no caller restriction. Bridge-role holders can mint and burn positions without collateral backing, and the ids they pass are not restricted to this module."
    }
```

```diff
    contract CollateralToken (matic:0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB) [polymarket/CollateralToken] {
    +++ description: Upgradeable ERC20 (pUSD) that wraps either of two immutable supported assets one-for-one, transferring deposits to an immutable vault. Wrapper-role holders can wrap and unwrap; minter-role holders can mint without depositing an asset and burn their own balance. The owner can transfer out any token balance held by the contract itself, which does not include the vault.
      sourceHashes.0:
-        "0x640f1329601b6af0916559ab082aa7cfef1805c5f6fdd6bd25c2a8999f93f32d"
+        "0xbbae056c06560153f9555e521d4a6fd86a1c75473d2abe76b51ad527b714bd57"
      description:
-        "Upgradeable ERC20 (pUSD) that wraps either of two immutable supported assets one-for-one, transferring deposits to an immutable vault. Wrapper-role holders can wrap and unwrap; minter-role holders can mint without depositing an asset and burn their own balance."
+        "Upgradeable ERC20 (pUSD) that wraps either of two immutable supported assets one-for-one, transferring deposits to an immutable vault. Wrapper-role holders can wrap and unwrap; minter-role holders can mint without depositing an asset and burn their own balance. The owner can transfer out any token balance held by the contract itself, which does not include the vault."
    }
```

```diff
    contract CombosExchange (matic:0xe3333700cA9d93003F00f0F71f8515005F6c00Aa) [polymarket/CombosExchange] {
    +++ description: Upgradeable request-for-quote exchange where operator-role holders settle EIP-712 signed orders for combination positions. Operators supply the fee on each fill; it is not part of the signed order and is checked only against a global limit of 1000 bps fixed at deployment. A zero limit means fees have no percentage cap, not that fees are zero: an operator can charge up to all proceeds on a sell or collect an additional amount from a buyer, subject to the buyer's balance and allowance.
      sourceHashes.0:
-        "0x1e5ccf5a4b9e5b8de8e01e19ebba561c71751c34e69d9db0d398f5d14ebc8b03"
+        "0xf1a6ae2587365e7e5c3d4c410f146685d8315f0207430ca3d00c009fc61b7525"
    }
```

Generated with discovered.json: 0x0484c4934eeb6e5b3019470449f801047d9dbcd9

# Diff at Wed, 12 Aug 2026 09:20:27 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1785484385

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositWalletFactory (matic:0x00000000000Fb5C9ADea0298D729A0CB3823Cc07) [polymarket/DepositWalletFactory]
    +++ description: Upgradeable CREATE2 wallet factory. Operator-role holders deploy deterministic beacon-proxy wallets and relay signed call batches; legacy-deployer-role holders can separately deploy deterministic legacy UUPS wallets. Admins manage both roles and set the 1h delay that wallet owners must wait after pausing before withdrawals unlock.
```

```diff
+   Status: CREATED
    contract PositionManager (matic:0x006F54F7f9A22e0000CC2AB60031000000ae9fEF) [polymarket/PositionManager]
    +++ description: Upgradeable ERC1155 ledger of combination-outcome positions, mintable and burnable only by the outcome module registered for each position or a cross-authorised module. Admins can register or remove modules and grant registered modules cross-module mint and burn power.
```

```diff
+   Status: CREATED
    contract Finder (matic:0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64) [polymarket/UmaFinder]
    +++ description: Maps interface names to contract addresses (UMA protocol contracts).
```

```diff
+   Status: CREATED
    contract AddressWhitelist (matic:0x0f79d0039956D58a7d5d006a6Dd64a35616Aa2c6) [polymarket/UmaAddressWhitelist]
    +++ description: Owner-managed address whitelist. Other contracts can query whether an address is listed; the whitelist itself does not assign a meaning to the listed addresses.
```

```diff
+   Status: CREATED
    contract BinaryModule (matic:0x1000008dD9001B968442c1000017eaE6E0dA00Ba) [polymarket/BinaryModule]
    +++ description: Upgradeable outcome module for two-sided markets. Split, merge and redemption functions have no caller restriction. Bridge-role holders can mint positions without collateral backing, while resolver-role holders can report results directly, bypassing the oracle path; admins can pause reporting by a resolver or for a condition.
```

```diff
+   Status: CREATED
    contract AddressWhitelist (matic:0x1020Ae36548ab28Bc0c41Fd2a08D24132C82cc55) [polymarket/UmaAddressWhitelist]
    +++ description: Owner-managed address whitelist. Other contracts can query whether an address is listed; the whitelist itself does not assign a meaning to the listed addresses.
```

```diff
+   Status: CREATED
    contract FeeReceiverSafe (matic:0x115F48DC2A731aA16251c6d6e1BEfC42f92Accc9) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract NegRiskModule (matic:0x200000900045e3B6259600682756002200028933) [polymarket/NegRiskModule]
    +++ description: Upgradeable outcome module for multi-outcome (negative-risk) markets. Split, merge, redemption and event-level conversion functions have no caller restriction. Bridge-role holders can mint positions without collateral backing, while resolver-role holders can report results directly, bypassing the oracle path; admins can pause reporting by a resolver or for a condition.
```

```diff
+   Status: CREATED
    contract IdentifierWhitelist (matic:0x2271a5E74eA8A29764ab10523575b41AA52455f0) [polymarket/UmaIdentifierWhitelist]
    +++ description: Keeps the list of identifiers that UMA oracle contracts accept for price requests.
```

```diff
+   Status: CREATED
    contract USD Coin (PoS) Token (matic:0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralOfframp (matic:0x2957922Eb93258b93368531d39fAcCA3B4dC5854) [polymarket/CollateralOfframp]
    +++ description: Lets anyone burn collateral tokens and release an equal amount of a supported asset from the configured collateral token's vault while that asset is not paused. Admins can pause or unpause unwrapping per asset with no delay.
```

```diff
+   Status: CREATED
    contract ManagedOptimisticOracleV2 (matic:0x2C0367a9DB231dDeBd88a94b4f6461a6e47C58B1) [uma/ManagedOptimisticOracleV2]
    +++ description: Managed variant of the UMA Optimistic Oracle V2 that acts as an escalation layer before UMA's DVM. Only whitelisted requesters can create price requests. Both the proposal submitter and credited proposer must pass the effective proposer whitelist, which can be overridden per request. Anyone can dispute an active proposal by posting the required bond, but only a resolver-role holder can settle the request. The proposal liveness defaults to 2h, with a minimum dispute window of 5m. Because settlement is permissioned, a proposal that outlives its liveness window does not become final on its own and can still be disputed until a resolver settles it. Roles (OpenZeppelin AccessControl): the default admin can upgrade the contract and manage the config admin role; the config admin sets the requester and default proposer whitelists, the default liveness, the minimum dispute window and the allowed bond ranges, and manages request managers; request managers set per-request proposer whitelists, bonds and liveness; the self-governing resolver admin manages resolvers.
```

```diff
+   Status: CREATED
    contract CombinatorialModule (matic:0x30000034706C7d8e12009DAB006Be20000c031A8) [polymarket/CombinatorialModule]
    +++ description: Upgradeable outcome module for combinatorial positions built from legs of other modules; payouts derive from the legs' resolved payouts. Position preparation, transformation and redemption functions have no caller restriction. Bridge-role holders can mint positions without collateral backing.
```

```diff
+   Status: CREATED
    contract WrappedCollateral (matic:0x3A3BD7bb9528E159577F7C2e685CC81A765002E2) [polymarket/WrappedCollateral]
    +++ description: ERC20 wrapper around an immutable underlying token. Its immutable owner is the deployer. Anyone can burn their wrapper units to send an equal amount of underlying to any recipient; only the owner can wrap, mint without depositing underlying, burn its own units, and release underlying held by the contract.
```

```diff
+   Status: CREATED
    contract USD Coin Token (matic:0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359) [tokens/circle/USDC]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AdminSafe (matic:0x3dcE0a29139A851Da1dFCa56Af8e8a6440b4D952) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyWallet (matic:0x44e999d5c2F66Ef0861317f9A4805AC2e90aEB4f) [polymarket/ProxyWallet]
    +++ description: Initializable wallet whose initialize() function assigns its caller as owner while the owner slot is still empty. The stored owner can execute batches of arbitrary calls or delegatecalls; delegatecalls run in the wallet's context and can modify its storage, including the owner slot.
```

```diff
+   Status: CREATED
    contract Timelock (matic:0x47EbFAC3353314C788B96CDCbf41daadfE03629C) [polymarket/Timelock]
    +++ description: Timelock with enumerable roles: proposers queue batches with a delay of at least 12h and executors run them once it elapses. Role grants are not delayed, so an admin can install new proposers, executors or cancellers instantly.
```

```diff
+   Status: CREATED
    contract ConditionalTokens (matic:0x4D97DCd97eC945f40cF65F87097ACe5EA0476045) [polymarket/ConditionalTokens]
    +++ description: Immutable, adminless ERC1155 ledger of conditional outcome tokens: anyone can split collateral into a complete outcome set, merge it back, or redeem after resolution. Only the oracle named at preparation can report payouts, and reports are write-once.
```

```diff
+   Status: CREATED
    contract DepositWallet (matic:0x58CA52ebe0DadfdF531Cde7062e76746de4Db1eB) [polymarket/DepositWallet]
    +++ description: Smart-wallet implementation for factory-deployed proxies. Only the configured factory can submit call batches, which require an EIP-712 signature from the owner or an unexpired session signer. The owner can pause the wallet and, after the factory-configured delay, withdraw assets and revoke token approvals.
```

```diff
+   Status: CREATED
    contract UmaCtfAdapterBinary (matic:0x65070BE91477460D8A7AeEb94ef92fe056C2f2A7) [polymarket/UmaCtfAdapter]
    +++ description: Resolution adapter registering market questions with an UMA optimistic oracle and reporting settled answers to the outcome-token ledger. Anyone can call initialize, but the adapter is the requester seen by the oracle, and the oracle's own access controls determine who may propose and settle the answer. After the oracle has settled an answer, anyone can call resolve to copy it into the outcome-token ledger unless an admin has paused the question. Admins can pause, unpause, reset or flag initialized questions, unflag them until the safety period has passed, and after 1h manually resolve a flagged question with either outcome or an even split.
```

```diff
+   Status: CREATED
    contract NegRiskOperator (matic:0x661992aebf6BecF7BA5abB66f6b0Bf62Aa7a2E93) [polymarket/NegRiskOperator]
    +++ description: Permissioned operator between the resolution adapter and the multi-outcome adapter. Anyone can finalize an unflagged reported question after 0s; admins can flag or unflag a question and force an outcome of their choosing after the same delay. This implementation hardcodes the delay to zero, so it enforces no waiting time after reporting or flagging.
```

```diff
+   Status: CREATED
    contract UmaCtfAdapterNegRisk (matic:0x69c47De9D4D3Dad79590d61b9e05918E03775f24) [polymarket/UmaCtfAdapter]
    +++ description: Resolution adapter registering market questions with an UMA optimistic oracle and reporting settled answers to the outcome-token ledger. Anyone can call initialize, but the adapter is the requester seen by the oracle, and the oracle's own access controls determine who may propose and settle the answer. After the oracle has settled an answer, anyone can call resolve to copy it into the outcome-token ledger unless an admin has paused the question. Admins can pause, unpause, reset or flag initialized questions, unflag them until the safety period has passed, and after 1h manually resolve a flagged question with either outcome or an even split.
```

```diff
+   Status: CREATED
    contract UmaCtfAdapterLegacy (matic:0x6A9D222616C90FcA5754cd1333cFD9b7fb6a4F74) [polymarket/UmaCtfAdapterLegacy]
    +++ description: Resolution adapter registering binary questions with an UMA optimistic oracle and reporting settled answers to an outcome-token ledger. Anyone can initialize a question and resolve it when an oracle price is available unless an admin has paused it. Admins can pause, unpause, reset or flag initialized questions. A flagged question cannot be unflagged and, after 2d, can be resolved by an admin with any two-value payout array that is not all zeroes.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (matic:0x6ee4D971142afadEa1828445124D6137080B4146) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositWalletBeacon (matic:0x7A18EDfe055488A3128f01F563e5B479D92ffc3a) [polymarket/DepositWalletBeacon]
    +++ description: Beacon with an owner-controlled default wallet implementation and per-caller implementation pins. Its owner can replace the default implementation in one transaction; callers can pin themselves to the current default and later rejoin default upgrades.
```

```diff
+   Status: CREATED
    contract NegRiskFeeVault (matic:0x7f67327E88c258932D7d8f72950bE0d46975E11D) [polymarket/NegRiskFeeVault]
    +++ description: Vault that can hold arbitrary ERC20 and ERC1155 tokens. Admins can transfer any balance to any recipient at any time, with no delay.
```

```diff
+   Status: CREATED
    contract SafeL2 (matic:0x7FB4492Ff58E4326a99D7d4F66aE1f47c8286Fc6) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract FxChild (matic:0x8397259c983751DAf40400790063935a11afa28a) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralOnramp (matic:0x93070a847efEf7F70739046A929D47a521F5B8ee) [polymarket/CollateralOnramp]
    +++ description: Lets anyone deposit an asset supported by the configured collateral token and mint an equal amount of collateral tokens while that asset is not paused. Admins can pause or unpause wrapping per asset with no delay.
```

```diff
+   Status: CREATED
    contract AddressWhitelist (matic:0x9F35885CE8f67a942D7B2f4Fbf937987DA08c463) [polymarket/UmaAddressWhitelist]
    +++ description: Owner-managed address whitelist. Other contracts can query whether an address is listed; the whitelist itself does not assign a meaning to the listed addresses.
```

```diff
+   Status: CREATED
    contract AutoRedeemer (matic:0xa1200000d0002264C9a1698e001292D00E1b00af) [polymarket/AutoRedeemer]
    +++ description: Upgradeable helper that batch-redeems resolved positions for users who approved it on the relevant ERC1155 ledger. Operator-role holders choose which approved positions to redeem and when, but the current implementation always sends proceeds to the position owner.
```

```diff
+   Status: CREATED
    EOA  (matic:0xA49e1a819c856162D87100cF20E63062e87c0E84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeProxyFactory (matic:0xaacFeEa03eb1561C4e67d661e40682Bd20E3541b) [polymarket/SafeProxyFactory]
    +++ description: Deterministic factory for single-owner Safe proxies. Anyone can submit an EIP-712 creation signature to deploy a wallet owned by the recovered signer at an address derived from that signer.
```

```diff
+   Status: CREATED
    contract ProxyWalletFactory (matic:0xaB45c5A4B0c941a2F231C04C3f49182e1A254052) [polymarket/ProxyWalletFactory]
    +++ description: Deterministic factory that associates each effective caller with one minimal-proxy wallet and forwards batched calls to it. The constructor deploys and stores the wallet implementation, with no direct setter. The owner can replace the gas-relay module, whose code executes by delegatecall and can modify factory storage.
```

```diff
+   Status: CREATED
    contract OracleChildTunnel (matic:0xac60353a54873c446101216829a6A98cDbbC3f3D) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract OperationsAccount (matic:0xAC9930b2AE455a671b62dE86876A7e8587825294) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CtfCollateralAdapter (matic:0xADa100874d00e3331D00F2007a9c336a65009718) [polymarket/CtfCollateralAdapter]
    +++ description: Adapter letting anyone split wrapped collateral into outcome positions, merge, or redeem on the conditional-token ledger while the underlying asset is not paused. It unwraps and re-wraps in the same call and cannot redirect funds to third parties. Admins can pause or unpause all operations, including redemptions, per asset with no delay.
```

```diff
+   Status: CREATED
    contract CtfCollateralAdapter2 (matic:0xAdA100Db00Ca00073811820692005400218FcE1f) [polymarket/CtfCollateralAdapter]
    +++ description: Adapter letting anyone split wrapped collateral into outcome positions, merge, or redeem on the conditional-token ledger while the underlying asset is not paused. It unwraps and re-wraps in the same call and cannot redirect funds to third parties. Admins can pause or unpause all operations, including redemptions, per asset with no delay.
```

```diff
+   Status: CREATED
    contract NegRiskCtfCollateralAdapter (matic:0xAdA200001000ef00D07553cEE7006808F895c6F1) [polymarket/NegRiskCtfCollateralAdapter]
    +++ description: Adapter letting anyone split, merge, redeem or convert wrapped collateral into multi-outcome positions while the underlying asset is not paused. It unwraps and re-wraps in the same call and cannot redirect funds to third parties. Admins can pause or unpause all operations, including redemptions, per asset with no delay.
```

```diff
+   Status: CREATED
    contract NegRiskCtfCollateralAdapter2 (matic:0xadA2005600Dec949baf300f4C6120000bDB6eAab) [polymarket/NegRiskCtfCollateralAdapter]
    +++ description: Adapter letting anyone split, merge, redeem or convert wrapped collateral into multi-outcome positions while the underlying asset is not paused. It unwraps and re-wraps in the same call and cannot redirect funds to third parties. Admins can pause or unpause all operations, including redemptions, per asset with no delay.
```

```diff
+   Status: CREATED
    contract GovernorChildTunnel (matic:0xb4AeaD497FCbEAA3C37919032d42C29682f46376) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyWallet (matic:0xB7B9D7c6627714523F2Bf612Ef8AE17Fc77A19D0) [polymarket/ProxyWallet]
    +++ description: Initializable wallet whose initialize() function assigns its caller as owner while the owner slot is still empty. The stored owner can execute batches of arbitrary calls or delegatecalls; delegatecalls run in the wallet's context and can modify its storage, including the owner slot.
```

```diff
+   Status: CREATED
    contract CollateralToken (matic:0xC011a7E12a19f7B1f670d46F03B03f3342E82DFB) [polymarket/CollateralToken]
    +++ description: Upgradeable ERC20 (pUSD) that wraps either of two immutable supported assets one-for-one, transferring deposits to an immutable vault. Wrapper-role holders can wrap and unwrap; minter-role holders can mint without depositing an asset and burn their own balance.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (matic:0xC193b33ff5E8A68F422a5d36A2dEf1D196b15160) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralVault (matic:0xC417fD8E9661c0d2120B64a04Bb3278C17E99DB1) [polymarket/CollateralVault]
    +++ description: Upgradeable ERC-4337 single-owner smart account. Its owner can execute arbitrary calls, install or uninstall plugins, and upgrade the implementation, giving it full control over any assets held by the account.
```

```diff
+   Status: CREATED
    contract NegRiskAdapter (matic:0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296) [polymarket/NegRiskAdapter]
    +++ description: Immutable adapter composing binary conditions into multi-outcome (negative-risk) markets and acting as the on-ledger oracle for them. Split, merge, redeem and conversion functions have no caller restriction; conversions can charge a per-market fee that accrues to a fixed vault.
```

```diff
+   Status: CREATED
    contract CTFExchange (matic:0xE111180000d2663C0091e4f400237545B87B996B) [polymarket/CTFExchange]
    +++ description: Exchange settling EIP-712 signed limit orders that are matched off-chain by operator-role holders, who also choose the fee on each fill. The fee is not part of the signed order and is checked against an admin-configurable rate limit, currently 0 bps. A zero rate means fees have no percentage cap, not that fees are zero: an operator can charge up to all proceeds on a sell or collect an additional amount from a buyer, subject to the buyer's balance and allowance. Users can pause settlement of all their orders, effective after 100 blocks, an interval the admins can change.
```

```diff
+   Status: CREATED
    contract CompatibilityFallbackHandler (matic:0xe16bA5bF81E5BB113e4752E4fdC20351d796fB24) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract NegRiskCtfExchange (matic:0xe2222d279d744050d28e00520010520000310F59) [polymarket/CTFExchange]
    +++ description: Exchange settling EIP-712 signed limit orders that are matched off-chain by operator-role holders, who also choose the fee on each fill. The fee is not part of the signed order and is checked against an admin-configurable rate limit, currently 0 bps. A zero rate means fees have no percentage cap, not that fees are zero: an operator can charge up to all proceeds on a sell or collect an additional amount from a buyer, subject to the buyer's balance and allowance. Users can pause settlement of all their orders, effective after 100 blocks, an interval the admins can change.
```

```diff
+   Status: CREATED
    contract CombosExchange (matic:0xe3333700cA9d93003F00f0F71f8515005F6c00Aa) [polymarket/CombosExchange]
    +++ description: Upgradeable request-for-quote exchange where operator-role holders settle EIP-712 signed orders for combination positions. Operators supply the fee on each fill; it is not part of the signed order and is checked only against a global limit of 1000 bps fixed at deployment. A zero limit means fees have no percentage cap, not that fees are zero: an operator can charge up to all proceeds on a sell or collect an additional amount from a buyer, subject to the buyer's balance and allowance.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (matic:0xE51abdf814f8854941b9Fe8e3A4F65CAB4e7A4a8) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Store (matic:0xE58480CA74f1A819faFd777BEDED4E2D5629943d) [polymarket/UmaStore]
    +++ description: UMA protocol contract responsible for calculating and collecting regular and final fees for using the DVM.
```

```diff
+   Status: CREATED
    contract PermissionedRamp (matic:0xebC2459Ec962869ca4c0bd1E06368272732BCb08) [polymarket/PermissionedRamp]
    +++ description: Wrap/unwrap entrypoint for the collateral token that additionally requires an EIP-712 signature from a witness-role holder. Admins can pause or unpause both directions for an asset with no delay.
```

```diff
+   Status: CREATED
    contract OptimisticOracleV2 (matic:0xeE3Afe347D5C74317041E2618C49534dAf887c24) [uma/OptimisticOracleV2]
    +++ description: Standard UMA Optimistic Oracle V2 with no caller allowlist. Anyone can request a price using a supported identifier and collateral, propose an answer by posting a bond, or dispute a proposal within its liveness window (2h by default, customizable per request). Undisputed proposals become final and settleable once the liveness window has passed, while disputes are escalated to UMA's DVM, where UMA token holders vote on the outcome and the loser's bond is partly awarded to the winner.
```

```diff
+   Status: CREATED
    contract DepositWallet (matic:0xf7f27C29e60fe6325beF8dA7F93250353d2e3294) [polymarket/DepositWallet]
    +++ description: Smart-wallet implementation for factory-deployed proxies. Only the configured factory can submit call batches, which require an EIP-712 signature from the owner or an unexpired session signer. The owner can pause the wallet and, after the factory-configured delay, withdraw assets and revoke token approvals.
```
