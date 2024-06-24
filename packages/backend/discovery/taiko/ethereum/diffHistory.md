Generated with discovered.json: 0x732fba392e5bf8459e8bf52a8a8a443cf3fd581a

# Diff at Mon, 10 Jun 2024 18:24:02 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@d3c8c03ba1310e94fe51ccffffb90b46e5ec9ea9 block: 20054153
- current block number: 20063194

## Description

Moved consumeTokenQuota from beginning to very end of _transferTokens function. Quota manager contract is currently not set.

## Watched changes

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      upgradeability.implementation:
-        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
+        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
      implementations.0:
-        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
+        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
      values.impl:
-        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
+        "0x75b5E276c5C1e9378E899cb3A87977421980Eb22"
    }
```

## Source code changes

```diff
.../ethereum/{.flat@20054153 => .flat}/SharedERC20Vault/ERC20Vault.sol | 3 +--
 1 file changed, 1 insertion(+), 2 deletions(-)
```

Generated with discovered.json: 0x11db6f6b7eec90e64b2483ebac75da462cc2cc5a

# Diff at Sun, 09 Jun 2024 12:06:08 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@023db9216bab49e9b3ffde0e43664e3e63c60fcf block: 20039414
- current block number: 20054153

## Description

Added "payable" to proposeBlock function in ProverSet. Calling proposeBlocks from ProverSet allows the ProverSetProxy to be the proposer of the block. On proveBlock(), also called from ProverSetProxy, there will be no validityBond posted as net transfers will be zero, since the TaikoL1 needs to return the livenessBond (250 TAIKO) to ProverSetProxy, and the validityBond (250 TAIKO) is of the same amount.
There are no special privileges for ProverSetProxy or its set provers in TaikoL1 contract.

Also new SGX instances registered.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.prover_set:
-        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
+        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
    }
```

```diff
-   Status: DELETED
    contract ProverSet (0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd)
    +++ description: None
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      upgradeability.implementation:
-        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
+        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
      implementations.0:
-        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
+        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
      values.impl:
-        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
+        "0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1"
    }
```

```diff
+   Status: CREATED
    contract ProverSet (0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1)
    +++ description: None
```

## Source code changes

```diff
.../ProverSet-0xD547Ca5d6b50dC5E900a091978597eB51F18F9D1.sol}            | 1 +
 .../ethereum/{.flat@20039414 => .flat}/ProverSetProxy/ProverSet.sol      | 1 +
 2 files changed, 2 insertions(+)
```

Generated with discovered.json: 0x038e91afa3edebd8b8da34afbe138b21b7d82f25

# Diff at Fri, 07 Jun 2024 10:40:21 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@41d748a25dcae1e5bca51dff605a48b4ddac2c56 block: 20032840
- current block number: 20039414

## Description

- ProverSet.sol: can now propose blocks by calling proposeBlock from proverSet contract, which will in turn call TaikoL1 proposeBlock().
- ERC20Vault.sol - LibStrings update, typo fixes and gas optimisations.
- SignalService.sol - Reverted to old implementation of SignalService (0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d). It is now back to old LibStrings, expecting an update soon.
- Bridge.sol - LibStrings update, added a max size for a calldata message to be processable by a relayer during proof verification.
- TaikoL1.sol - Added L1_NO_HOOKS error but not used. Fixed a bug where if they passed no hooks in the input params the livenessBond wouldn't be transferred.
- TaikoToken.sol - Added delegates function, not allowed to delegate to TaikoL1 or ERC20Vault.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      upgradeability.implementation:
-        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
+        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
      implementations.0:
-        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
+        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
      values.getConfig.6:
-        16
+        32
      values.getConfig.2:
-        432512
+        324512
      values.getConfig.1:
-        432000
+        324000
      values.impl:
-        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
+        "0xB9E1E58bcF33B79CcfF99c298963546a6c334388"
      values.prover_set:
-        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
+        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      upgradeability.implementation:
-        "0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"
+        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
      implementations.0:
-        "0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"
+        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
      values.impl:
-        "0x7dF8bfBf0f09e94200b6a158b421e2CCaCc4830F"
+        "0x55833dA2962c2330ccCF043ff8037e6D2939bCF6"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      upgradeability.implementation:
-        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
+        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
      implementations.0:
-        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
+        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
      values.impl:
-        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
+        "0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd"
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      upgradeability.implementation:
-        "0x4F750D13005444407D44dAA30922128db0374ca1"
+        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
      implementations.0:
-        "0x4F750D13005444407D44dAA30922128db0374ca1"
+        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
      values.impl:
-        "0x4F750D13005444407D44dAA30922128db0374ca1"
+        "0xF8bdaC4E68bA2595Be8381aaa5456917e374E737"
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      upgradeability.implementation:
-        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
+        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
      implementations.0:
-        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
+        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
      values.impl:
-        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
+        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      values.instances.7:
+        ["0x6F6C0837b2c45B1bfE970bd5a0BB171605cb44F3"]
      values.instances.6:
+        ["0x4A9d339c94D1D3b685e3923907A98c73b8168AFF"]
      values.nextInstanceId:
-        6
+        8
    }
```

```diff
-   Status: DELETED
    contract ProverSet (0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F)
    +++ description: None
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.implementation:
-        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
+        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
      implementations.0:
-        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
+        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
      values.impl:
-        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
+        "0xD28f2c26aD8bA88b0691F6BB41Ff021878052561"
      values.CALLDATA_MESSAGE_SIZE_BYTES:
+        352
    }
```

```diff
+   Status: CREATED
    contract ProverSet (0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd)
    +++ description: None
```

## Source code changes

```diff
...0x5D528253fA14cd7F637937de847BE8D5BE0Bf5fd.sol} | 14 ++++-
 .../ProverSetProxy/ProverSet.sol                   | 14 ++++-
 .../SharedERC20Vault/ERC20Vault.sol                | 45 +++++++-------
 .../SignalService/SignalService.sol                | 70 ++++++++--------------
 .../TaikoBridge/Bridge.sol                         | 31 +++++++---
 .../TaikoL1Contract/TaikoL1.sol                    | 66 +++++++++-----------
 .../TaikoToken/TaikoToken.sol                      | 10 ++++
 7 files changed, 134 insertions(+), 116 deletions(-)
```

Generated with discovered.json: 0x5d7159ace678f291bde2f744c708641bebd2b669

# Diff at Thu, 06 Jun 2024 12:40:03 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@68b8e831d7a9790dc56ed4caf0e841fbec8adb53 block: 20018468
- current block number: 20032840

## Description

TaikoL1Contract implementation update:
- Retrieve the tier configurations based on router rather than tier_provider
- Removed L1_UNAUTHORIZED error and _isProposerPermitted function, making block proposing permissionless.
- checkEOAForCalldataDA is not in getConfig(), used when blob usages is not detected, it will check the calldata for tx data.
- LibStrings changes: removed assignment_hook, proposer and proposer_one. Proposer and proposer_one still resolve but unused since _isProposerPermitted is removed. 

SignalService update: getSyncedChainData to getSyncedChainHeight, some error changes.

Prover_set update: reflect changes to LibStrings, made natively aware of taiko token.

SGXVerifier update: reflect changes to LibStrings, some error changes. _replaceInstance only if new instance != old instance.

GuardianProver(s) update: safeApprove and safeTransfer function to approve and transfer. Reflect changes to LibStrings.

L1RollupAddressManager update: removed B_ASSIGNMENT_HOOK, B_PROPOSER, B_PROPOSER_ONE, B_TIER_PROVIDER. Added B_TIER_ROUTER.


## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      upgradeability.implementation:
-        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
+        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
      implementations.0:
-        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
+        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
      values.assignment_hook:
-        "0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6"
+        "0x0000000000000000000000000000000000000000"
      values.getConfig.7:
+        true
      values.impl:
-        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
+        "0x4b2743B869b85d5F7D8020566f92664995E4f3c5"
      values.prover_set:
-        "0x500735343372Dd6c9B84dBc7a75babf4479742B9"
+        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
    }
```

```diff
-   Status: DELETED
    contract ProverSet (0x500735343372Dd6c9B84dBc7a75babf4479742B9)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AssignmentHook (0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6)
    +++ description: None
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      upgradeability.implementation:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
      implementations.0:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
      values.impl:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      upgradeability.implementation:
-        "0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"
+        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
      implementations.0:
-        "0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"
+        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
      values.impl:
-        "0x8Af4669E3068Bae96b92cD73603f5D86beD07a9a"
+        "0x8EEf314878A7E56314E8DF285d0B0D649C903aF6"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      upgradeability.implementation:
-        "0x500735343372Dd6c9B84dBc7a75babf4479742B9"
+        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
      implementations.0:
-        "0x500735343372Dd6c9B84dBc7a75babf4479742B9"
+        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
      values.impl:
-        "0x500735343372Dd6c9B84dBc7a75babf4479742B9"
+        "0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F"
    }
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.nonce:
-        26
+        28
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      upgradeability.implementation:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
      implementations.0:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
      values.impl:
-        "0xB11Cd7bA46a12F238b4Ad831f6F296262C1e652d"
+        "0x3d59c18b31A7D950EF9bd15eD285b6c182E0f0bb"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      upgradeability.implementation:
-        "0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"
+        "0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"
      implementations.0:
-        "0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"
+        "0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"
      values.impl:
-        "0xf381868DD6B2aC8cca468D63B42F9040DE2257E9"
+        "0xB0b782cf0fCEce896E0C041F8e54f86cA4cC8e9F"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      upgradeability.implementation:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
      implementations.0:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
      values.impl:
-        "0x468F6A9C0ad2e9C8370687D2844A9e70fE942d5c"
+        "0x7E717FFD6f7dD1008192bDC7193904FaB25BC8A4"
    }
```

```diff
+   Status: CREATED
    contract ProverSet (0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F)
    +++ description: None
```

## Source code changes

```diff
.../AssignmentHook/AssignmentHook.sol => /dev/null | 2714 --------------------
 .../AssignmentHook/ERC1967Proxy.p.sol => /dev/null |  593 -----
 .../GuardianMinorityProver/GuardianProver.sol      |  136 +-
 .../GuardianProver.sol                             |  136 +-
 .../L1RollupAddressManager.sol                     |    8 +-
 ...0xd0AEe97712a4a88B75C31E3C61DD2Ce6E514D85F.sol} |   85 +-
 .../ProverSetProxy/ProverSet.sol                   |   85 +-
 .../SgxVerifier/SgxVerifier.sol                    |   40 +-
 .../SignalService/SignalService.sol                |   70 +-
 .../TaikoL1Contract/TaikoL1.sol                    |  333 +--
 10 files changed, 263 insertions(+), 3937 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20018468 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.tier_sgx_zkvm:
-        "0x0000000000000000000000000000000000000000"
      values.verifier_TIER_SGX_ZKVM:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract AssignmentHook (0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6) {
    +++ description: None
      values.proxiableUUID:
-        "EXPECT_REVERT"
      errors:
+        {"proxiableUUID":"Multicall failed"}
    }
```

Generated with discovered.json: 0xc7cd32149b27868b3a50016ee3970759f8e9aa0d

# Diff at Tue, 04 Jun 2024 09:25:32 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@8229f24e26195fa97d8d36bab0dd2d52dec7efa6 block: 20009991
- current block number: 20017546

## Description

Two contracts implementation changed, TaikoL1.sol, and Bridge.sol.
- TaikoL1.sol: introduced B_TIER_ROUTER = bytes32("tier_router") to replace B_TIER_PROVIDER
- Bridge.sol: Added a max proof size for a message to be processable by a relayer, an insufficent gas check, and added the B_TIER_ROUTER variable support.

## Watched changes

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      upgradeability.implementation:
-        "0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"
+        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
      implementations.0:
-        "0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"
+        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
      values.impl:
-        "0x3505a0700DB72dEc7AbFF1aF231BB5D87aBF2944"
+        "0xE84DC8E2a21e59426542Ab040D77f81d6dB881eE"
      values.tier_router:
-        "0x0000000000000000000000000000000000000000"
+        "0xa8e5D3a2E2052bea7f10bE6a0386454b721d1f9F"
    }
```

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.nonce:
-        24
+        26
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.implementation:
-        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
+        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
      implementations.0:
-        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
+        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
      values.impl:
-        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
+        "0x3c326483EBFabCf3252205f26dF632FE83d11108"
      values.RELAYER_MAX_PROOF_BYTES:
+        200000
    }
```

```diff
+   Status: CREATED
    contract TierRouter (0xa8e5D3a2E2052bea7f10bE6a0386454b721d1f9F)
    +++ description: None
```

## Source code changes

```diff
.../TaikoBridge/Bridge.sol                         | 131 +++++++++++++--------
 .../TaikoL1Contract/TaikoL1.sol                    |  68 ++++++-----
 .../taiko/ethereum/.flat/TierRouter.sol            |  15 +++
 3 files changed, 133 insertions(+), 81 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20009991 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      values.tier_provider:
-        "0x4cffe56C947E26D07C14020499776DB3e9AE3a23"
      values.tier_router:
+        "0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x46b03e9120fb191d6dc7e9e29ada0f5de7841449

# Diff at Mon, 03 Jun 2024 08:06:00 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@3f44aa4fafff6ecd52bf4dcc77df7a9b1884b765 block: 19985265
- current block number: 20009991

## Description

Change in bridge implementation processMessage function: message Status and B_OUT_OF_ETH_QUOTA revert logic.

## Watched changes

```diff
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F) {
    +++ description: None
      values.nonce:
-        23
+        24
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.implementation:
-        "0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"
+        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
      implementations.0:
-        "0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"
+        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
      values.impl:
-        "0x71c2f41AEDe913AAEf2c62596E03702E348D6Cd0"
+        "0x951B7Ae1bB26d12dB37f01748e8fB62FEf45A8B5"
    }
```

## Source code changes

```diff
.../TaikoBridge/Bridge.sol                         | 79 ++++++++++------------
 1 file changed, 37 insertions(+), 42 deletions(-)
```

Generated with discovered.json: 0x1de79ace616f10bb275665d3e223e2f7b9555b6c

# Diff at Thu, 30 May 2024 21:14:50 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@95f6b3cb82fafd7d8a66bb00c4812b8c0f2475a5 block: 19983331
- current block number: 19985265

## Description

Admin fetching bug fix, ignore discovery values. 

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19983331 (main branch discovery), not current.

```diff
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a) {
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract AssignmentHook (0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c) {
    +++ description: Verifier contract for blocks proven by Guardian minority.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9) {
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81) {
    +++ description: Verifier contract for SGX proven blocks.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
      values.instances.5.1:
-        1717080167
      values.instances.4.1:
-        1717080191
      values.instances.3.1:
-        1716720623
      values.instances.2.1:
-        1716625511
      values.instances.1.1:
-        1716802247
      values.instances.0.1:
-        1715680091
    }
```

```diff
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC) {
    +++ description: Verifier contract for Guardian proven blocks.
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

```diff
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F"
    }
```

Generated with discovered.json: 0x3c58d71994fa7ba68b7629963e8d666c48d91dcd

# Diff at Thu, 30 May 2024 14:43:53 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19983331

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract PEMCertChainLib (0x02772b7B3a5Bea0141C993Dbb8D0733C19F46169)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TaikoL1Contract (0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a)
    +++ description: This contract provides functionalities for proposing, proving, and verifying blocks.
```

```diff
+   Status: CREATED
    contract TaikoToken (0x10dea67478c5F8C5E2D90e5E9B26dBe60c54d800)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SigVerifyLib (0x47bB416ee947fE4a4b655011aF7d6E3A1B80E6e9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TierProvider (0x4cffe56C947E26D07C14020499776DB3e9AE3a23)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProverSet (0x500735343372Dd6c9B84dBc7a75babf4479742B9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AssignmentHook (0x537a2f0D3a5879b41BCb5A2afE2EA5c4961796F6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GuardianMinorityProver (0x579A8d63a2Db646284CBFE31FE5082c9989E985c)
    +++ description: Verifier contract for blocks proven by Guardian minority.
```

```diff
+   Status: CREATED
    contract L1RollupAddressManager (0x579f40D0BE111b823962043702cabe6Aaa290780)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProverSetProxy (0x68d30f47F19c07bCCEf4Ac7FAE2Dc12FCa3e0dC9)
    +++ description: A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.
```

```diff
+   Status: CREATED
    contract AutomataDcapV3Attestation (0x8d7C954960a36a7596d7eA4945dDf891967ca8A3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SharedERC20Vault (0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TaikoAdmin (0x9CBeE534B5D8a6280e01a14844Ee8aF350399C7F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SignalService (0x9e0a24964e5397B566c1ed39258e21aB5E35C77C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SgxVerifier (0xb0f3186FC1963f774f52ff455DC86aEdD0b31F81)
    +++ description: Verifier contract for SGX proven blocks.
```

```diff
+   Status: CREATED
    contract TaikoBridge (0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GuardianProver (0xE3D777143Ea25A6E031d1e921F396750885f43aC)
    +++ description: Verifier contract for Guardian proven blocks.
```

```diff
+   Status: CREATED
    contract L1SharedAddressManager (0xEf9EaA1dd30a9AA1df01c36411b5F082aA65fBaa)
    +++ description: None
```
