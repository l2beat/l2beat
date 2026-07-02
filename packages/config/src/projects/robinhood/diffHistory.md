Generated with discovered.json: 0x41f2248201ce14db7fe75abebaca5071072f14e4

# Diff at Wed, 01 Jul 2026 23:05:42 GMT:

- author: Daniel Chew (<daniel.chew@robinhood.com>)
- current timestamp: 1782947077

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract  (eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (eth:0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D) [orbitstack/Inbox]
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (eth:0x23A19d23e89166adedbDcB432518AB01e4272D94) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (eth:0x4B15E064d5d55705E89080bDEA4BFe4cF20D6114) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (eth:0x5087a6fD526eFD5c6770d94D0c325de0e2A2c44D) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf) [orbitstack/UpgradeExecutor]
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (eth:0x665CEA1cA6C36aB701f4C6AE895b156f79C51c35) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract EdgeChallengeManager (eth:0x6f38FC91105Fc9a43931DcA33450ab3315E3D4Fa) [orbitstack/EdgeChallengeManager]
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (eth:0x6fE84aC811EBEcd888Eca93757fEa378Bb03b00c) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (eth:0xB7FE37712e46F28C8f22Ec4bAA33A09fb8B52BD0) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (eth:0xc34f4907822d1cDC6aE3038Be22e6f12DEa35bd4) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (eth:0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3) [orbitstack/Bridge]
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (eth:0xe1aAfAfBde42f043495B39d1a15a58E91c894Fbf) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (eth:0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9) [orbitstack/Outbox]
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```
