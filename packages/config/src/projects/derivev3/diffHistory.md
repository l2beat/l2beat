Generated with discovered.json: 0x351cb46248ffff4b8b1891f0feac72c6592528d0

# Diff at Fri, 09 Oct 2026 12:31:58 GMT:

- id: 710bc3f5
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1791549055

## Description

Initial discovery of Derive V3: VerifiableApp, OnchainActionManager, WithdrawalOutbox, SpotVault, WithdrawFactory, their owner multisig with its timelock and bypass members, the guardian, pausers and keepers.

## Initial discovery

```diff
+   Status: CREATED
    contract DeriveTimelock (eth:0x12D612647e8bcacec9148e477CAdE67bD07abc78) [global/TimelockController]
    +++ description: A timelock with access control. The current minimum delay is 10m.
```

```diff
+   Status: CREATED
    contract Derive Multisig (eth:0x169a99B9958386a5D91E732Ed08B344946A92391) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x2c53cbB96fb65e8711dAAe530c87473789a13781) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SpotVault (eth:0x2e7dF4fAf35a1599979C7E764444e112d936ec42) [N/A]
    +++ description: Escrow for the collateral deposited to Derive. It grants the WithdrawalOutbox unlimited allowance for approved tokens.
```

```diff
+   Status: CREATED
    external contract SP1VerifierGateway (eth:0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x4EcBfaBF336a757FE82898e0e1083a6Cbb042C3D) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Derive Bypass Multisig (eth:0x5F8D40613d49179376a200cc808d322f4331453a) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Derive Owner Multisig (eth:0x62c004a89EDBd7bECBdf54E14779B7e7F5b390F7) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Derive Guardian Multisig (eth:0x682CD085aC63739a9F44E069E91BB6AA09a312E8) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalOutbox (eth:0x7c743D79C9C595cE332314503d84cBBb4E85FA63) [N/A]
    +++ description: Pays out withdrawals committed to by proven batches from the SpotVault, subject to USD-denominated per-recipient and global rate limits.
```

```diff
+   Status: CREATED
    contract DepositEscrow (eth:0xA20f87a5443E3Be4925109cA189134c825932560) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract VerifiableApp (eth:0xd330145C17fB6EF2a21ACf1275Ce683A305F58BB) [N/A]
    +++ description: Holds the state root and verifies SP1 validity proofs for each batch. Each proof also commits to a Celestia header range and blob hash-chain, which this contract chains from a stored Celestia anchor and checks for freshness.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xD773a38B81bBe7992209D6c4ef663c6A7F6cbfBd) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract OnchainActionManager (eth:0xE366CcA474968e33b777E13905829A3b800CFAD3) [N/A]
    +++ description: Entry point for L1 deposits and withdrawal requests. Every action is appended to an accumulator that each proven batch must consume in order.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xeB26aA88C73D3a03fE82be3C241B6ccd2D596811) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawFactory (eth:0xFec48bBC648bd2284520d862Ec67fc68F709915e) [N/A]
    +++ description: Deploys a deterministic escrow per recipient and destination chain. Withdrawals paid to such an escrow are bridged onward by keepers via LayerZero OFT or CCIP.
```

```diff
+   Status: CREATED
    external contract (eth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```
