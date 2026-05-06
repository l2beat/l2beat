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
