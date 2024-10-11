Generated with discovered.json: 0xd97b2cb4e179850b9ec5569ebc16941e345ce95c

# Diff at Tue, 01 Oct 2024 10:55:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20777100
- current block number: 20777100

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20777100 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:03:59.000Z",["0x12f893689f9603991a8c22C249FFd0509Be95661"]],["2024-09-09T13:09:23.000Z",["0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"]]]
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:04:23.000Z",["0x8279B7E48fA074f966385d87AEf29Bd031e54fD5"]],["2024-08-06T08:56:59.000Z",["0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"]]]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:17:59.000Z",["0xCba1aF8f0bB223b2544F8eB8f69d1c7960f788dB"]],["2024-08-26T07:51:11.000Z",["0xb56A8225A745756DD215faf22E4796f373561AcD"]]]
    }
```

Generated with discovered.json: 0xc9681e2069081f5380a59667639df35872f0358c

# Diff at Wed, 18 Sep 2024 11:12:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14dc1d5395aaa4aca4e79a08fd6132e42e3cf1a4 block: 20741455
- current block number: 20777100

## Description

Renamed for clarity. (has both ChainAdmin and Elastic Chain Operator roles)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20741455 (main branch discovery), not current.

```diff
    contract EraChainAdminProxy (0x2cf3bD6a9056b39999F3883955E183F655345063) {
    +++ description: None
      name:
-        "ChainAdmin"
+        "EraChainAdminProxy"
    }
```

Generated with discovered.json: 0x87075ab461d044a431c2143eca3e60ab362bc7ad

# Diff at Fri, 13 Sep 2024 11:40:40 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@f3f080827a9c9144630c7d8b5f28745b2029ead2 block: 20725957
- current block number: 20741455

## Description

Ownership of the four shared ZK stack contracts and their ProxyAdmin has been fully transferred to the ProtocolUpgradeHandler.

## Watched changes

```diff
-   Status: DELETED
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61)
    +++ description: None
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
      values.pendingOwner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
      values.pendingOwner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
      values.pendingOwner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.owner:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
      values.pendingOwner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0x0000000000000000000000000000000000000000"
    }
```

## Source code changes

```diff
.../.flat@20725957/Governance.sol => /dev/null     | 440 ---------------------
 1 file changed, 440 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20725957 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract GnosisSafe (0x13f07d9BF17615f6a17F272fe1A913168C275A66)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0)
    +++ description: None
```

```diff
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897) {
    +++ description: None
      values.EXTENDED_LEGAL_VETO_PERIOD:
+        604800
      values.HARD_FREEZE_PERIOD:
+        604800
      values.SOFT_FREEZE_PERIOD:
+        43200
      values.STANDARD_LEGAL_VETO_PERIOD:
+        259200
      values.UPGRADE_DELAY_PERIOD:
+        86400
      values.UPGRADE_WAIT_OR_EXPIRE_PERIOD:
+        2592000
      fieldMeta:
+        {"protocolFrozenUntil":{"severity":"HIGH","description":"Timestamp until which ALL Hyperchains connected to the main STM are frozen. (Mailbox and Executor facets blocked)"}}
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44)
    +++ description: None
```

```diff
    contract ZkFoundationMultisig (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "ZkFoundationMultisig"
    }
```

```diff
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D) {
    +++ description: None
      fieldMeta:
+        {"softFreezeNonce":{"severity":"HIGH","description":"Increments with each softFreeze (freezes ALL Hyperchains (blocks Mailbox and Executor facets) connected to the main STM for SOFT_FREEZE_PERIOD"},"hardFreezeNonce":{"severity":"HIGH","description":"Increments with each hardFreeze (freezes ALL Hyperchains (blocks Mailbox and Executor facets) connected to the main STM for HARD_FREEZE_PERIOD"}}
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231)
    +++ description: None
```

Generated with discovered.json: 0x5316f6730537230399f403d045aae371108b264d

# Diff at Wed, 11 Sep 2024 07:44:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@407590ebfbad0b4f799badc3ad5fce90a7eaed11 block: 20713619
- current block number: 20725957

## Description

Two child-multisigs of the SecurityCouncil have signer-changes.

## Watched changes

```diff
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2) {
    +++ description: None
      values.$members.11:
+        "0x663ec2BfB273447DC236A646d6dAAA333aAB08f7"
      values.$members.10:
-        "0x663ec2BfB273447DC236A646d6dAAA333aAB08f7"
+        "0x670B24610DF99b1685aEAC0dfD5307B92e0cF4d7"
      values.$members.9:
-        "0x670B24610DF99b1685aEAC0dfD5307B92e0cF4d7"
+        "0x7be0FF978bB8C96F78fb1B1fC6c04b5b572a80B8"
      values.$members.8:
-        "0x7be0FF978bB8C96F78fb1B1fC6c04b5b572a80B8"
+        "0xe968FB773e54f77350A427B057FDB44e6592E338"
      values.$members.7:
-        "0xe968FB773e54f77350A427B057FDB44e6592E338"
+        "0x6754CaFCe32a1bD1A8c88ABc19a113365b85917F"
      values.$members.6:
-        "0x6754CaFCe32a1bD1A8c88ABc19a113365b85917F"
+        "0x23aaaD48A6409d98Fcc2e9061CD2F437ff4E5839"
      values.$members.5:
-        "0x23aaaD48A6409d98Fcc2e9061CD2F437ff4E5839"
+        "0x371F6E45784E7DFBEA2dc18Edb68cD90aD530E6c"
      values.$members.4:
-        "0x371F6E45784E7DFBEA2dc18Edb68cD90aD530E6c"
+        "0xF3d913D11dd577DDe5da4f2AA9611Aa799185C46"
      values.$members.3:
-        "0xF3d913D11dd577DDe5da4f2AA9611Aa799185C46"
+        "0x7e0d106fD2Cee9aa846bc419944f5eD8F2935135"
      values.$members.2:
-        "0x7e0d106fD2Cee9aa846bc419944f5eD8F2935135"
+        "0x5F18752518d81E4AFbB28341EDFba9Aa0E16707C"
      values.$members.1:
-        "0x5F18752518d81E4AFbB28341EDFba9Aa0E16707C"
+        "0xaaAdAa000867fb883089B7e528d7eA96937b777f"
      values.$members.0:
-        "0xaaAdAa000867fb883089B7e528d7eA96937b777f"
+        "0x3766Ae19984f845bb149E05b6F7E14FFB4f85a1A"
      values.multisigThreshold:
-        "1 of 11 (9%)"
+        "1 of 12 (8%)"
    }
```

```diff
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44) {
    +++ description: None
      values.$members.4:
+        "0x57855BeeB39C56ca4Ff41C1D039B0F022ED08cea"
      values.$members.3:
-        "0x57855BeeB39C56ca4Ff41C1D039B0F022ED08cea"
+        "0xA1AF6Ed43eDeE80F1913ea44E9DC2A93A738EB44"
      values.$members.2:
-        "0xA1AF6Ed43eDeE80F1913ea44E9DC2A93A738EB44"
+        "0x896E7D2108245ae8d5Aa7E4763024b3945AEd77F"
      values.$members.1:
-        "0x896E7D2108245ae8d5Aa7E4763024b3945AEd77F"
+        "0x6c25cda91Bef3A4Ba1e4488b4ac276aA02921D67"
      values.$members.0:
-        "0x6c25cda91Bef3A4Ba1e4488b4ac276aA02921D67"
+        "0xdF28907A6A272fa06333a197d7F0379A0f8f00aa"
      values.multisigThreshold:
-        "1 of 4 (25%)"
+        "1 of 5 (20%)"
    }
```

Generated with discovered.json: 0xfebdc41677b04bf109847e17a5320f23bd01c291

# Diff at Mon, 09 Sep 2024 14:22:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@92161a8609a409a7bea80cf1d38924cd21e5bc7f block: 20692926
- current block number: 20713619

## Description

BridgeHub upgrade (one-line diff):
* `addToken()` (acts as a global token whitelist for the shared bridge) now can only be called by the owner (not the admin). Currently those two roles are still held by the same address anyway.

## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.64:
+        {"delay":0,"operation":{"calls":[{"target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","value":"0","function":"upgrade","inputs":[{"name":"proxy","value":"0x303a465B659cBB0ab36eE643eA362c509EEb5213"},{"name":"implementation","value":"0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.$implementation:
-        "0x12f893689f9603991a8c22C249FFd0509Be95661"
+        "0x509dA1BE24432F8804C4A9FF4a3c3f80284CDd13"
      values.$upgradeCount:
-        1
+        2
    }
```

## Source code changes

```diff
.../ethereum/{.flat@20692926 => .flat}/BridgeHub/Bridgehub.sol          | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x954bbe4a7a75f6047280a13af0431f31d4dc3168

# Diff at Fri, 06 Sep 2024 17:05:06 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20663562
- current block number: 20692926

## Description

This update introduces a new ProtocolUpgradeHandler contract, with a new attached Governance system. The ProtocolUpgradeHandler is pendingOwner in all shared ZK stack contracts and will supposedly be used as the new owner of the central ProxyAdmin. It currently has no gov roles assigned (yet).

The L2 part of the Governance will be added in a separate config / PR.

### ProtocolUpgradeHandler.sol

Keeps track of the upgrade stages, executes upgrades, freezes contracts (all ZK shared contracts). (needs ProxyAdmin Owner and owner permissions)

check out my ART:
```
                     +----------------+
                     |     START      |
                     | (UpgradeState  |
                     |     .None)     |
                     +----------------+
                              |
      L2_PROTOCOL_GOVERNOR    |  (Currently timelock with 3 L2 Gov contracts)
                              v
                     +----------------+
                     |    Proposal    |
                     | (UpgradeState  |
                     |     .None)     |
                     +----------------+
                              |
    Timelock L2 (minDelay 0)  | message to L1
                              v
         +---------------------------------------------+
         |           Legal Veto Period                 |
         | (3 days, extendable to 7 days by Guardians) |
         |        (UpgradeState.LegalVetoPeriod)       |
         +---------------------------------------------+
                              |
                              | Time passes
                              v 
                     +----------------+ nobody   +----------------------+
                     |    Waiting     | approves |                      |
                     | (UpgradeState  |--------> | UpgradeState.expired |
                     |   .Waiting)    | 30 days  |                      |
                     +----------------+          +----------------------+
                         /        \
     Security Council  /            \ Guardians approve within
approves (immediate)  /              \  waiting period (+ 30d !!)
                     v                v 
         +---------------------------------+ 
         |       Execution Pending         | 
         | (UpgradeState.ExecutionPending) | 
         +---------------------------------+ 
                          |
                          | 1 day
                          v  
                 +-----------------+
                 |      Ready      |
                 | (UpgradeState   |
                 |    .Ready)      |
                 +-----------------+
                 | 
                 |        
                 |  Executor   or
                 |  Security Council
                 v 
         +-----------------+
         |    Executed     |
         | (UpgradeState   |
         |     .Done)      |
         +-----------------+

Actors:
- L2 Timelock Governors: Initiate the upgrade proposal
- Guardians: Can extend legal veto period and/or approve within 30d delay
- Security Council: Can approve immediately after legal waiting (3d)
- Executor: Specified address that can execute the upgrade when ready

UpgradeState Enum:
- None: Initial state or non-existent upgrade
- LegalVetoPeriod: During the legal veto period
- Waiting: Waiting for approval by SC or Guardians
- ExecutionPending: Approved, waiting for execution delay (1d)
- Ready: Ready for execution
- Done: Upgrade executed
- Expired: Upgrade expired without execution
```

Apart from this non-emergency track, there is `executeEmergencyUpgrade()` which has no delay. For this, SC, ZK_FOUNDATION MS and Guardians must all approve. (Uses eip712 standard)

Delay with current vars: 
- L2 proposal, then SC: messageToL1delay+3d+1d = ~5d (The ProtocolUpgradeHandler calls `proveL2MessageInclusion()` which needs the upgrade message batch from L2 to be executed on L1, thus currently ~1d messageToL1delay)
- L2 Proposal, then Guardians: messageToL1delay+3d+30d+1d = ~35d
- L1 'emergency' proposal by SC, ZK_FOUNDATION MS, Guardians = No delay

### EmergencyUpgradeBoard.sol

Uses eip712 standard to check signatures from SC, ZK_FOUNDATION MS and Guardians to push emergency approvals through the ProtocolUpgradeHandler.

### SecurityCouncil

12 signers custom multisig (some signers are MS themselves) with varying thresholds for certain actions. (3-9) Has eip712 support.

### Guardians

8 signers custom multisig (all signers are 1/1 GnosisSafes) with eip712 support. `"APPROVE_UPGRADE_GUARDIANS_THRESHOLD": 5`

### ZK Foundation Safe

New 3/5 GnosisSafe currently only used in by the EmergencyUpgradeBoard.

### Various GnosisSafes in the diff

Belong to Guardians or SC signers, there are no superfluous contracts in the config.

## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.63:
+        {"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"transferOwnership","inputs":[{"name":"newOwner","value":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]},{"target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","value":"0","function":"transferOwnership","inputs":[{"name":"newOwner","value":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]},{"target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","value":"0","function":"transferOwnership","inputs":[{"name":"newOwner","value":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]},{"target":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","value":"0","function":"transferOwnership","inputs":[{"name":"newOwner","value":"0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x015318c16AE443a20DE0A776dB06a59F0D279057)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x13f07d9BF17615f6a17F272fe1A913168C275A66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x178D8Eb1A1fb81B5102808A83318Bb04C6a9fC6D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x2A90830083C5Ca1f18d7AA7fCDC2998f93475384)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x34Ea62D4b9bBB8AD927eFB6ab31E3Ab3474aC93a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x35eA56fd9eAd2567F339Eb9564B6940b9DD5653F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x3888777686F0b0d8c3108fc22ad8DE9E049bE26F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x538612F6eba6ff80FBD95D60dCDee16b8FfF2c0f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x55c671BcE13120387Ded710A1d1b80C0e3d8E857)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x590926dBCDfD19627c3BbD2A6Eb96DeC7a3AbF69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x69462a81ba94D64c404575f1899a464F123497A2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6D26874130A174839b9cd8CB87Ed4E09D0c1a5f0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x725065b4eB99294BaaE57AdDA9c32e42F453FA8A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x84BF0Ac41Eeb74373Ddddae8b7055Bf2bD3CE6E0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x9B39Ea22e838B316Ea7D74e7C4B07d91D51ccA88)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x9B8Be3278B7F0168D82059eb6BAc5991DcdfA803)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xB7aC3A79A23B148c85fba259712c5A1e7ad0ca44)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xbC1653bd3829dfEc575AfC3816D4899cd103B51c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xc3Abc9f9AA75Be8341E831482cdA0125a7B1A23e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCe7a3dFcc35602155809920Ff65e093aa726f6cf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xFB90Da9DC45378A1B50775Beb03aD10C7E8DC231)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/EmergencyUpgradeBoard.sol       | 1233 +++++++++++++++++
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../GnosisSafe.sol                                 |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../shared-zk-stack/ethereum/.flat/Guardians.sol   | 1439 ++++++++++++++++++++
 .../ethereum/.flat/ProtocolUpgradeHandler.sol      |  605 ++++++++
 .../ethereum/.flat/SecurityCouncil.sol             | 1389 +++++++++++++++++++
 46 files changed, 25414 insertions(+)
```

Generated with discovered.json: 0xe131f21db446bf93a860e4e5e83e4f27e772bd97

# Diff at Fri, 30 Aug 2024 08:00:41 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20618759
- current block number: 20618759

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20618759 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xfddab7e20377594ae29665447bb6672e87b6f07a

# Diff at Tue, 27 Aug 2024 08:35:30 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@cf2dd34fdc5bce846ae811aa246ba203fc03f637 block: 20585030
- current block number: 20618759

## Description

The transactions were executed immediately and update the implementation of the shared bridge contract to introduce the ability to set an admin that can initialize new chains to the shared bridge (can set a chain's l2 bridge address) or add a new pending admin. The `onlyOwnerOrAdmin` is added for this purpose, so the two functions are also callable by the owner (matter labs gov).

## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.62:
+        {"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"setPendingAdmin","inputs":[{"name":"_newPendingAdmin","value":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
      values.scheduledTransactions.61:
+        {"delay":0,"operation":{"calls":[{"target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","value":"0","function":"upgrade","inputs":[{"name":"proxy","value":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"},{"name":"implementation","value":"0xb56A8225A745756DD215faf22E4796f373561AcD"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
      values.scheduledTransactions.60:
+        {"delay":0,"operation":{"calls":[{"target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","value":"0","function":"requestL2TransactionDirect","inputs":[{"name":"_request","value":[388,"8000000000000000000","0x898B3560AFFd6D955b1574D87EE09e46669c60eA",0,"0xb71bcf9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000005457468657200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034554480000000000000000000000000000000000000000000000000000000000",1600000,800,[],"0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"]}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.$implementation:
-        "0xCba1aF8f0bB223b2544F8eB8f69d1c7960f788dB"
+        "0xb56A8225A745756DD215faf22E4796f373561AcD"
      values.$upgradeCount:
-        1
+        2
      values.admin:
+        "0x2cf3bD6a9056b39999F3883955E183F655345063"
      values.pendingAdmin:
+        "0x0000000000000000000000000000000000000000"
    }
```

## Source code changes

```diff
.../L1SharedBridge/L1SharedBridge.sol              | 68 +++++++++++++++++++++-
 1 file changed, 67 insertions(+), 1 deletion(-)
```

Generated with discovered.json: 0x3f5e72eeb57d7ed748830fda356242452bae1bd4

# Diff at Fri, 23 Aug 2024 09:55:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20585030
- current block number: 20585030

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20585030 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x4640fe69b924e5b47a41d891a603415d05e47cc1

# Diff at Thu, 22 Aug 2024 15:26:28 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@08f0832a5dea29e7c493cd50bda4bf1729aa03ae block: 20577647
- current block number: 20585030

## Description

Config changes related to trust permissions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20577647 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","via":[]},{"permission":"upgrade","target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","via":[]},{"permission":"upgrade","target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","via":[]}]
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

Generated with discovered.json: 0x21457d5a4d6030a99808e98536320926080b462b

# Diff at Wed, 21 Aug 2024 14:40:15 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9ff9ee2b2fd37e2cdd4a4bcebdcefcb5e61b1e6c block: 20469956
- current block number: 20577647

## Description

10 zkCRO tokens were transferred from the Matter Labs Multisig to the Governance contract and then 2 of them deposited to the bridge.

## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.59:
+        {"delay":0,"operation":{"calls":[{"target":"0x28Ff2E4dD1B58efEB0fC138602A28D5aE81e44e2","value":"0","function":"approve","inputs":[{"name":"spender","value":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"},{"name":"value","value":"10000000000000000000"}]},{"target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","value":"0","function":"requestL2TransactionDirect","inputs":[{"name":"_request","value":[388,"2000000000000000000","0x898B3560AFFd6D955b1574D87EE09e46669c60eA",0,"0xb71bcf9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000005457468657200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034554480000000000000000000000000000000000000000000000000000000000",400000,800,[],"0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"]}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20469956 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","via":[]},{"permission":"upgrade","target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","via":[]},{"permission":"upgrade","target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","via":[]}]
      assignedPermissions:
+        {"upgrade":["0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]}
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

Generated with discovered.json: 0xa9240a22791f73d566140a9cdc4236fe6c458128

# Diff at Wed, 21 Aug 2024 10:05:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20469956
- current block number: 20469956

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20469956 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","via":[]},{"permission":"upgrade","target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","via":[]},{"permission":"upgrade","target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","via":[]}]
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","via":[]}]
    }
```

Generated with discovered.json: 0xda40aa4c78260b726a113b92cf0b6ad67b96c8e1

# Diff at Fri, 09 Aug 2024 12:02:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20469956
- current block number: 20469956

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20469956 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      assignedPermissions.upgrade.0:
-        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
+        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
    }
```

Generated with discovered.json: 0xf03a299dddbd127d2d553cbfff574e6d581ee856

# Diff at Fri, 09 Aug 2024 10:12:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20469956
- current block number: 20469956

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20469956 (main branch discovery), not current.

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      values.$multisigThreshold:
-        "4 of 7 (57%)"
+++ description: Signers of the multisig
+++ severity: LOW
      values.getOwners:
-        ["0x3F0009D00cc78979d00Eb635490F23E8d6aCc481","0xe79af29d618141Ffef951B240b250d47030D56d7","0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc","0x702caCafA54B88e9c54449563Fb2e496e85c78b7","0xFAdb20191Ab38362C50f52909817B74214CA79AE","0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2","0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"]
+++ description: Should be 4/8 per official docs
+++ severity: HIGH
      values.getThreshold:
-        4
      values.$members:
+        ["0x3F0009D00cc78979d00Eb635490F23E8d6aCc481","0xe79af29d618141Ffef951B240b250d47030D56d7","0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc","0x702caCafA54B88e9c54449563Fb2e496e85c78b7","0xFAdb20191Ab38362C50f52909817B74214CA79AE","0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2","0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]
      assignedPermissions.upgrade:
+        ["0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0x303a465B659cBB0ab36eE643eA362c509EEb5213","0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"]
    }
```

Generated with discovered.json: 0xa996360228c16c8eb5c8e3493c4f01c107b710c8

# Diff at Tue, 06 Aug 2024 13:54:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@08572cac0b099c9871f6e5b417260b029c0e9393 block: 20432409
- current block number: 20469956

## Description

The shared ZK stack contracts BridgeHub and StateTransitionManager (used by cronos and ZKsync Era) and also the ZKsync Era diamond proxy are moved to new admin contract called 'ChainAdmin' (owner is Matter Labs MS). The STM is upgraded to a new implementation with marginal diff (one added event).

The scheduled tx is immediately executed.

This upgrade does not change net permissions at the moment but will probably be used in the future once more ZK stack chains are used or something like a SecurityCouncil is added.

### New ChainAdmin contract

This contract is very simple with the most important functions being:
- `multicall` (onlyOwner): Does what the name suggests
- `setTokenMultiplier` (callable by `tokenMultiplierSetter`): Used for the custom gas tokens of ZK stack chains
- `setUpgradeTimestamp` (onlyOwner): sets a public expected upgrade timestamp for a new protocol version (like the one used for this upgrade `103079215106`), this var is only informative and not enforced so far

The contract is set as admin (NOT upgradeability admin, see upgrades&gov diagram) for the BridgeHub, the STM and the ZKsync Era diamond at the moment.
The Governance contract still has its former upgradeabilityAdmin role.


## Watched changes

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions.58:
+        {"delay":0,"operation":{"calls":[{"target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","value":"0","function":"setNewVersionUpgrade","inputs":[{"name":"_cutData","value":[[],"0x4d376798Ba8F69cEd59642c3AE8687c7457e855d","0x08284e5700000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004a000000000000000000000000000000000000000000000000000000000000004c00000000000000000000000000000000000000000000000000000000066ab923f0000000000000000000000000000000000000000000000000000001800000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"]},{"name":"_oldProtocolVersion","value":103079215105},{"name":"_oldProtocolVersionDeadline","value":"115792089237316195423570985008687907853269984665640564039457584007913129639935"},{"name":"_newProtocolVersion","value":103079215106}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
      values.scheduledTransactions.57:
+        {"delay":0,"operation":{"calls":[{"target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","value":"0","function":"upgrade","inputs":[{"name":"proxy","value":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"},{"name":"implementation","value":"0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"}]},{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"0","function":"setPendingAdmin","inputs":[{"name":"_newPendingAdmin","value":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]},{"target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","value":"0","function":"setPendingAdmin","inputs":[{"name":"_newPendingAdmin","value":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]},{"target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","value":"0","function":"setPendingAdmin","inputs":[{"name":"_newPendingAdmin","value":"0x2cf3bD6a9056b39999F3883955E183F655345063"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}}
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.admin:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x2cf3bD6a9056b39999F3883955E183F655345063"
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
+++ description: Signers of the multisig
+++ severity: LOW
      values.getOwners.4:
-        "0x9dF8bc0918F357c766A5697E031fF5237c05747A"
+        "0xFAdb20191Ab38362C50f52909817B74214CA79AE"
    }
```

```diff
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C) {
    +++ description: None
      values.$implementation:
-        "0x8279B7E48fA074f966385d87AEf29Bd031e54fD5"
+        "0xed1Dc7F0Be2B19cb02a2476150C8ea24A37c5274"
      values.admin:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x2cf3bD6a9056b39999F3883955E183F655345063"
      values.getSemverProtocolVersion.2:
-        1
+        2
      values.protocolVersion:
-        103079215105
+        103079215106
    }
```

```diff
+   Status: CREATED
    contract ChainAdmin (0x2cf3bD6a9056b39999F3883955E183F655345063)
    +++ description: None
```

## Source code changes

```diff
.../shared-zk-stack/ethereum/.flat/ChainAdmin.sol  | 214 +++++++++++++++++++++
 .../StateTransitionManager.sol                     |  24 ++-
 2 files changed, 228 insertions(+), 10 deletions(-)
```

Generated with discovered.json: 0x71be9779a8f3457a1989249b52a4cdb17a231835

# Diff at Wed, 31 Jul 2024 10:26:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20425929

## Description

Initial discovery of the shared config.

Two governance transactions (no delay) add the new Cronos zkEVM (First ZK stack chain). It shares the StateTransitionManager, ValidatorTimelock and Verifier with ZKsync Era, thus sharing the L2 logic. For DA it uses ValidiumMode. (https://etherscan.io/tx/0xb2a1d8913ebe7b4a8a21064c994801ad036fc85da1f378f35b57956df72f0131)
Four new Validators are registered with the Timelock, of which two are removed, leaving two new ones and two each for ZKsync Era and Cronos zkEVM.

The Cronos DiamondProxy is not yet verified.

## Initial discovery

```diff
+   Status: CREATED
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenesisUpgrade (0x3dDD7ED2AeC0758310A4C6596522FCAeD108DdA2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828)
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB)
    +++ description: None
```
