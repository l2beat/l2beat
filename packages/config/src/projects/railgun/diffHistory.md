Generated with discovered.json: 0xa7814e9968bf1dc85f2b4c576381269c2f014807

# Diff at Thu, 21 May 2026 07:19:18 GMT:

- author: torztomasz (<tomasz.torz@l2beat.com>)
- comparing to: main@81af7a0da7d0a301e5b9686bebf53af2984b37b1 block: 1777550988
- current timestamp: 1777550988

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777550988 (main branch discovery), not current.

```diff
    contract Rail Token (eth:0xe76C6c83af64e4C60245D8C7dE953DF673a7A33D) [railgun/RailToken] {
    +++ description: RAIL governance token contract with a capped mint schedule and an early anti-bot transfer override. If you trust this contract, you trust its owner to mint additional RAIL up to the hard cap.
      name:
-        "RailToken"
+        "Rail Token"
    }
```

Generated with discovered.json: 0x9d896aa554475323e31765e93cfd52a7fac2fb11

# Diff at Thu, 14 May 2026 07:39:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fda6b248112f1ba028bea437a3e980acbfd8741 block: 1777550988
- current timestamp: 1777550988

## Description

config: clean up some and remove 'act' permission from vkeysetter.owner.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777550988 (main branch discovery), not current.

```diff
    contract IntervalPayouts (eth:0x29905A43aA3865D0D7F2743dDE63754B4aa9CA11) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      name:
-        "Ae8AStreamPayout"
+        "IntervalPayouts"
    }
```

```diff
    EOA  (eth:0x5a02474A3083Bc969f20F92E7a8bd3824EC607f0) {
    +++ description: None
      name:
-        "PayoutBeneficiary_5a02"
    }
```

```diff
    contract IntervalPayouts (eth:0x7673e2E62435D25EDBcb58fD0d88c4C95806b10F) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      name:
-        "Beneficiary5a02OneOffPayout"
+        "IntervalPayouts"
    }
```

```diff
    EOA  (eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624) {
    +++ description: None
      name:
-        "SweeperProxyOwner"
      receivedPermissions.2:
-        {"permission":"interact","from":"eth:0xB6d513f6222Ee92Fff975E901bd792E2513fB53B","description":"update the Railgun smart wallet SNARK verifying keys through the Delegator.","role":".verificationKeyDelegates","via":[{"address":"eth:0x9086aFC6FC88667d4031Cabd556AfDD0E3903B46"}]}
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0x9086aFC6FC88667d4031Cabd556AfDD0E3903B46","role":".owner"}]
    }
```

```diff
    contract IntervalPayouts (eth:0x859E0C1790b8a721F4943742603cDB685A73BA5D) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      name:
-        "Ae8AOneOffPayout"
+        "IntervalPayouts"
    }
```

```diff
    EOA  (eth:0xA4f2eA0a81179362558eBC1d2Bc817c9a0134ee3) {
    +++ description: None
      name:
-        "PayoutBeneficiary_A4f2"
    }
```

```diff
    contract IntervalPayouts (eth:0xa863262Bf5E97e8CFeC47a71402aC360C0983060) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      name:
-        "A4f2OneOffPayout"
+        "IntervalPayouts"
    }
```

```diff
    EOA  (eth:0xaE8A17EB859E024cF6B541802B08932B2268dcEe) {
    +++ description: None
      name:
-        "PayoutBeneficiary_Ae8A"
    }
```

```diff
    EOA  (eth:0xbbc2fB58643235AFfBF1f0CDd27Bc6E6CFBBa4e2) {
    +++ description: None
      name:
-        "VKeySetterOwner_bbc2"
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0xB6d513f6222Ee92Fff975E901bd792E2513fB53B","description":"update the Railgun smart wallet SNARK verifying keys through the Delegator.","role":".verificationKeyDelegates","via":[{"address":"eth:0x64DA0892E8E24fECa6Eb5E3D8cbf2D9b6Fbe7598"}]}
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0x64DA0892E8E24fECa6Eb5E3D8cbf2D9b6Fbe7598","role":".owner"}]
    }
```

```diff
    contract IntervalPayouts (eth:0xCA9A2894e814305fAfc2BA83a70B34295b1DdE9D) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      name:
-        "A4f2StreamPayout"
+        "IntervalPayouts"
    }
```

```diff
    contract IntervalPayouts (eth:0xf5F9d74FbFd04801DFf83425ff6C2002f60B921A) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      name:
-        "Beneficiary5a02StreamPayout"
+        "IntervalPayouts"
    }
```

Generated with discovered.json: 0x42a7033d1f9a3d7fe186bfb5dbb3ffa7136224b0

# Diff at Fri, 08 May 2026 08:36:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@66656ed8f737863b593f2b6759c08b24d56e9571 block: 1777550988
- current timestamp: 1777550988

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777550988 (main branch discovery), not current.

```diff
    contract Ae8AStreamPayout (eth:0x29905A43aA3865D0D7F2743dDE63754B4aa9CA11) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      deployerAddress:
+        "eth:0x223e4fD4a088Abf96f16A579A3EAde3F87Dd2911"
    }
```

```diff
    contract GovernorRewardsSweeper (eth:0x2eCa05b128bF5cbd5A73CC4BB625B51131FF119B) [railgun/Sweeper] {
    +++ description: Upgradeable helper that forwards all ETH or ERC20 balances it holds to a fixed receiver. If you trust this contract, you trust its proxy admin to upgrade, pause, or retarget the sweep behavior.
      sourceHashes.0:
-        "0xbfd517af5073b0a89f8f8dfce2d11e2bc003968785985ed504c9f9ab571f9d75"
+        "0x9058adc1861f18dfc2238b3223c1d8b6da8c0bff358aa3bf00915c0d2dfb7174"
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract ProxyAdmin (eth:0x4F8E20f55f879beE7Bc010Bd6bD2138B34aC65c8) [railgun/ProxyAdmin] {
    +++ description: Admin interface for Railgun's pausable upgradeable proxies. It does not hold funds, but its controller can operate every proxy attached to it.
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract VerificationKeySetter_64DA (eth:0x64DA0892E8E24fECa6Eb5E3D8cbf2D9b6Fbe7598) [railgun/VKeySetter] {
    +++ description: Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, once Railgun governance switches the contract into COMMITTING state, can forward those keys to the Railgun smart wallet verifier through the Delegator. If you trust this contract, you trust its owner to stage and commit verifier-key changes and Railgun governance to authorize the commit phase.
      sourceHashes.0:
-        "0x97c32fbfee382b7fe3932651160b482c01c51e25cee46e8e174218dadd7bcae8"
+        "0x9be46f47e8f61b9d373f7d991c68bc9d68a40d875ddb9da58563121fdeb69a85"
      deployerAddress:
+        "eth:0xbbc2fB58643235AFfBF1f0CDd27Bc6E6CFBBa4e2"
    }
```

```diff
    contract Beneficiary5a02OneOffPayout (eth:0x7673e2E62435D25EDBcb58fD0d88c4C95806b10F) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      deployerAddress:
+        "eth:0x223e4fD4a088Abf96f16A579A3EAde3F87Dd2911"
    }
```

```diff
    contract Ae8AOneOffPayout (eth:0x859E0C1790b8a721F4943742603cDB685A73BA5D) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      deployerAddress:
+        "eth:0x223e4fD4a088Abf96f16A579A3EAde3F87Dd2911"
    }
```

```diff
    contract VerificationKeySetter_9086 (eth:0x9086aFC6FC88667d4031Cabd556AfDD0E3903B46) [railgun/VKeySetter] {
    +++ description: Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, once Railgun governance switches the contract into COMMITTING state, can forward those keys to the Railgun smart wallet verifier through the Delegator. If you trust this contract, you trust its owner to stage and commit verifier-key changes and Railgun governance to authorize the commit phase.
      sourceHashes.0:
-        "0x4c94632d11362a5297c31f6eba9f37322caadd6a88247c9032529d66ebd04cdf"
+        "0x302a2769069056aa8c4a9be3ba0d53d9d831149d84f14b7650cc2ff13729d27f"
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract GovernorRewards (eth:0xA02782CE1bF85f56f8cC7C0E66e61299Ac75c86f) [railgun/GovernorRewards] {
    +++ description: Upgradeable reward distributor that pulls assets from the Railgun treasury and allocates them to stakers using snapshot voting power. If you trust this contract, you trust its owner to set reward parameters and tracked assets, and its proxy admin to pause or upgrade the logic.
      sourceHashes.0:
-        "0xef8b7ca35114debbd8f7c5998a55ca9dd61bbd558bf6987cbfcf5ea97e3af83a"
+        "0x6719d1d65fb919b52e894f249bcbbde8d2fddde75de20893e50e1b96ec608f06"
      sourceHashes.1:
-        "0xd1b675b1a03700c03440f776180470c3a967a7ef2e7cbe7a6f2cb9d75c4ea8ad"
+        "0x9bf4e7d842e397338e0191cf08fc9478cf3988db823baa64976da77c103fab0d"
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract LegacySweeper (eth:0xa353bC0454931Ac46fd90c8EF27f908Ab9E34686) [railgun/SweeperLegacy] {
    +++ description: Older Railgun sweeper generation that still holds Treasury transfer rights. It is upgradeable and forwards balances to an immutable receiver, but this specific deployment does not expose the receiver getter cleanly through discovery.
      sourceHashes.0:
-        "0xbfd517af5073b0a89f8f8dfce2d11e2bc003968785985ed504c9f9ab571f9d75"
+        "0x9058adc1861f18dfc2238b3223c1d8b6da8c0bff358aa3bf00915c0d2dfb7174"
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract A4f2OneOffPayout (eth:0xa863262Bf5E97e8CFeC47a71402aC360C0983060) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      deployerAddress:
+        "eth:0x223e4fD4a088Abf96f16A579A3EAde3F87Dd2911"
    }
```

```diff
    contract Delegator (eth:0xB6d513f6222Ee92Fff975E901bd792E2513fB53B) [railgun/Delegator] {
    +++ description: Permission router owned by Railgun governance. If you trust this contract, you trust its owner and any currently delegated callers to execute privileged calls through it on connected Railgun components.
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract Voting (eth:0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC) [railgun/Voting] {
    +++ description: Token-weighted Railgun governance contract. Proposals must be sponsored, voted through quorum, and then executed through the Delegator; if you trust this contract, you trust RAIL voting power governed by these rules to change connected Railgun components.
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract A4f2StreamPayout (eth:0xCA9A2894e814305fAfc2BA83a70B34295b1DdE9D) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      deployerAddress:
+        "eth:0x223e4fD4a088Abf96f16A579A3EAde3F87Dd2911"
    }
```

```diff
    contract RailToken (eth:0xe76C6c83af64e4C60245D8C7dE953DF673a7A33D) [railgun/RailToken] {
    +++ description: RAIL governance token contract with a capped mint schedule and an early anti-bot transfer override. If you trust this contract, you trust its owner to mint additional RAIL up to the hard cap.
      sourceHashes.0:
-        "0xa82346e65e8737f6ecea9914efe8654029b2c87c2af1186d3515a49ce1b9db39"
+        "0xedf311c1a35646cbfb452e13446e64818194f368b2cd56c3bae91b0593f49852"
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract Treasury (eth:0xE8A8B458BcD1Ececc6b6b58F80929b29cCecFF40) [railgun/Treasury] {
    +++ description: Upgradeable treasury that collects Railgun fees, and can release ETH or ERC20s only to current TRANSFER_ROLE members. If you trust this contract, you trust its role admins to decide who can move treasury assets and its proxy admin to change the treasury logic.
      sourceHashes.0:
-        "0xbfd517af5073b0a89f8f8dfce2d11e2bc003968785985ed504c9f9ab571f9d75"
+        "0x9058adc1861f18dfc2238b3223c1d8b6da8c0bff358aa3bf00915c0d2dfb7174"
      sourceHashes.1:
-        "0x1e581c91de9e0c3cd50906d9d30663d1b8fe037db6a5a80caf0c20e961d7eb41"
+        "0x38e90021f1f1c6b5378b5a32d25769119a4c3c07b14c2f813eb2b7a6264172cd"
      deployerAddress:
+        "eth:0x223e4fD4a088Abf96f16A579A3EAde3F87Dd2911"
    }
```

```diff
    contract Getters (eth:0xe90275239D734899e8D94646139213F6F97bEB0E) [railgun/Getters] {
    +++ description: Read-only helper contract that batches governance snapshot and reward-view calls. It does not custody funds or hold privileged roles.
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract Staking (eth:0xEE6A649Aa3766bD117e12C161726b693A1B2Ee20) [railgun/Staking] {
    +++ description: Immutable RAIL staking contract that tracks delegated voting power, enforces a 30-day unstake delay, and snapshots balances for governance. It has no admin, but its parameters define the governance system's voting power.
      sourceHashes.0:
-        "0x2bff1afa5e292171f2c6c15a1e62198b014ff5a8b42eedc6ad43ba8a0627787d"
+        "0x12d1c6ff9fbd0f99b457b153c78e8f364a9aad6b9bfed98b2b682b53870cc5e4"
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

```diff
    contract Beneficiary5a02StreamPayout (eth:0xf5F9d74FbFd04801DFf83425ff6C2002f60B921A) [railgun/IntervalPayouts] {
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
      deployerAddress:
+        "eth:0x223e4fD4a088Abf96f16A579A3EAde3F87Dd2911"
    }
```

```diff
    contract RailgunSmartWallet (eth:0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9) [railgun/RailgunSmartWallet] {
    +++ description: Upgradeable privacy pool contract that accepts shielded deposits, verifies private transactions and unshields, and maintains the commitment tree. If you trust this contract, you trust its owner to change fees, treasury routing, token compatibility, and SNARK safety vectors, and its proxy admin to pause or upgrade the logic.
      sourceHashes.0:
-        "0xbfd517af5073b0a89f8f8dfce2d11e2bc003968785985ed504c9f9ab571f9d75"
+        "0x9058adc1861f18dfc2238b3223c1d8b6da8c0bff358aa3bf00915c0d2dfb7174"
      sourceHashes.1:
-        "0xcf70d21ec20aa9f668a3d77681b3214b2b7aab73bc22211bf503612e1be5b813"
+        "0x0ad85e59396caf20dd30307894a735a097dbd0d914bc1851af97c04cc874ad3b"
      deployerAddress:
+        "eth:0x76EB574EFF49FB64DE6f7F2854952B05B5E24624"
    }
```

Generated with discovered.json: 0x70860e1a5ef98e769e503e1a6cd6651aa8604907

# Diff at Wed, 06 May 2026 10:38:21 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current timestamp: 1777550988

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract Ae8AStreamPayout (eth:0x29905A43aA3865D0D7F2743dDE63754B4aa9CA11)
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
```

```diff
+   Status: CREATED
    contract GovernorRewardsSweeper (eth:0x2eCa05b128bF5cbd5A73CC4BB625B51131FF119B)
    +++ description: Upgradeable helper that forwards all ETH or ERC20 balances it holds to a fixed receiver. If you trust this contract, you trust its proxy admin to upgrade, pause, or retarget the sweep behavior.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x4F8E20f55f879beE7Bc010Bd6bD2138B34aC65c8)
    +++ description: Admin interface for Railgun's pausable upgradeable proxies. It does not hold funds, but its controller can operate every proxy attached to it.
```

```diff
+   Status: CREATED
    contract VerificationKeySetter_64DA (eth:0x64DA0892E8E24fECa6Eb5E3D8cbf2D9b6Fbe7598)
    +++ description: Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, once Railgun governance switches the contract into COMMITTING state, can forward those keys to the Railgun smart wallet verifier through the Delegator. If you trust this contract, you trust its owner to stage and commit verifier-key changes and Railgun governance to authorize the commit phase.
```

```diff
+   Status: CREATED
    contract Beneficiary5a02OneOffPayout (eth:0x7673e2E62435D25EDBcb58fD0d88c4C95806b10F)
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
```

```diff
+   Status: CREATED
    contract Ae8AOneOffPayout (eth:0x859E0C1790b8a721F4943742603cDB685A73BA5D)
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
```

```diff
+   Status: CREATED
    contract VerificationKeySetter_9086 (eth:0x9086aFC6FC88667d4031Cabd556AfDD0E3903B46)
    +++ description: Auxiliary verifier-key staging contract. Its owner stores replacement verification keys locally and, once Railgun governance switches the contract into COMMITTING state, can forward those keys to the Railgun smart wallet verifier through the Delegator. If you trust this contract, you trust its owner to stage and commit verifier-key changes and Railgun governance to authorize the commit phase.
```

```diff
+   Status: CREATED
    contract GovernorRewards (eth:0xA02782CE1bF85f56f8cC7C0E66e61299Ac75c86f)
    +++ description: Upgradeable reward distributor that pulls assets from the Railgun treasury and allocates them to stakers using snapshot voting power. If you trust this contract, you trust its owner to set reward parameters and tracked assets, and its proxy admin to pause or upgrade the logic.
```

```diff
+   Status: CREATED
    contract LegacySweeper (eth:0xa353bC0454931Ac46fd90c8EF27f908Ab9E34686)
    +++ description: Older Railgun sweeper generation that still holds Treasury transfer rights. It is upgradeable and forwards balances to an immutable receiver, but this specific deployment does not expose the receiver getter cleanly through discovery.
```

```diff
+   Status: CREATED
    contract A4f2OneOffPayout (eth:0xa863262Bf5E97e8CFeC47a71402aC360C0983060)
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
```

```diff
+   Status: CREATED
    contract Delegator (eth:0xB6d513f6222Ee92Fff975E901bd792E2513fB53B)
    +++ description: Permission router owned by Railgun governance. If you trust this contract, you trust its owner and any currently delegated callers to execute privileged calls through it on connected Railgun components.
```

```diff
+   Status: CREATED
    contract Voting (eth:0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC)
    +++ description: Token-weighted Railgun governance contract. Proposals must be sponsored, voted through quorum, and then executed through the Delegator; if you trust this contract, you trust RAIL voting power governed by these rules to change connected Railgun components.
```

```diff
+   Status: CREATED
    contract A4f2StreamPayout (eth:0xCA9A2894e814305fAfc2BA83a70B34295b1DdE9D)
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
```

```diff
+   Status: CREATED
    contract RailToken (eth:0xe76C6c83af64e4C60245D8C7dE953DF673a7A33D)
    +++ description: RAIL governance token contract with a capped mint schedule and an early anti-bot transfer override. If you trust this contract, you trust its owner to mint additional RAIL up to the hard cap.
```

```diff
+   Status: CREATED
    contract Treasury (eth:0xE8A8B458BcD1Ececc6b6b58F80929b29cCecFF40)
    +++ description: Upgradeable treasury that collects Railgun fees, and can release ETH or ERC20s only to current TRANSFER_ROLE members. If you trust this contract, you trust its role admins to decide who can move treasury assets and its proxy admin to change the treasury logic.
```

```diff
+   Status: CREATED
    contract Getters (eth:0xe90275239D734899e8D94646139213F6F97bEB0E)
    +++ description: Read-only helper contract that batches governance snapshot and reward-view calls. It does not custody funds or hold privileged roles.
```

```diff
+   Status: CREATED
    contract Staking (eth:0xEE6A649Aa3766bD117e12C161726b693A1B2Ee20)
    +++ description: Immutable RAIL staking contract that tracks delegated voting power, enforces a 30-day unstake delay, and snapshots balances for governance. It has no admin, but its parameters define the governance system's voting power.
```

```diff
+   Status: CREATED
    contract Beneficiary5a02StreamPayout (eth:0xf5F9d74FbFd04801DFf83425ff6C2002f60B921A)
    +++ description: Immutable payout stream that can pull a fixed amount of a configured asset from the Railgun treasury to a fixed beneficiary whenever the next interval is due. It has no admin, but the treasury's TRANSFER_ROLE assignment allows it to execute the programmed payout schedule.
```

```diff
+   Status: CREATED
    contract RailgunSmartWallet (eth:0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9)
    +++ description: Upgradeable privacy pool contract that accepts shielded deposits, verifies private transactions and unshields, and maintains the commitment tree. If you trust this contract, you trust its owner to change fees, treasury routing, token compatibility, and SNARK safety vectors, and its proxy admin to pause or upgrade the logic.
```
