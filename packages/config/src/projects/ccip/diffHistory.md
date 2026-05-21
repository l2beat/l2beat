Generated with discovered.json: 0x3bef697f11f62aba7d2cb647d508e03888c4af8b

# Diff at Thu, 21 May 2026 13:56:18 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@3f32b799a8ae1f1caacd37bf2e2cc7b1dec2ddeb block: 1777388210
- current timestamp: 1778572081

## Description

Re-discovery on top of merged `main`. The ManyChainMultiSig template now sets `$members` (flat union of all signers across the tree) and `$threshold` (recursively-computed minimum signatures to satisfy the root quorum), so every ARM_Multisig now renders on the L2BEAT frontend the same way Gnosis Safes do (Multisig type badge, M/N name prefix, full participants list). The contract description disclaims the flat-M-of-N reading, surfaces the root quorum inline, and hides the per-group breakdown behind a click-to-expand collapsible. No upstream protocol changes; permissions and structural data are unchanged.

## Watched changes

```diff
    contract ARM_Multisig4 (eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc) [transporter/ManyChainMultiSig] {
    +++ description: Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 8 signatures across 67 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 8-of-67 multisig and is strictly more constrained. Root: 3-of-3, childGroups=(1,18,19). [click for per-group breakdown: Group 1: 3-of-16, parent=0, childGroups=(2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17) | Group 2: 1-of-2, parent=1, signers=2 | Group 3: 1-of-2, parent=1, signers=2 | Group 4: 1-of-2, parent=1, signers=2 | Group 5: 1-of-1, parent=1, signers=1 | Group 6: 1-of-2, parent=1, signers=2 | Group 7: 1-of-2, parent=1, signers=2 | Group 8: 1-of-4, parent=1, signers=4 | Group 9: 1-of-1, parent=1, signers=1 | Group 10: 1-of-1, parent=1, signers=1 | Group 11: 1-of-1, parent=1, signers=1 | Group 12: 1-of-1, parent=1, signers=1 | Group 13: 1-of-3, parent=1, signers=3 | Group 14: 1-of-1, parent=1, signers=1 | Group 15: 1-of-1, parent=1, signers=1 | Group 16: 1-of-3, parent=1, signers=3 | Group 17: 1-of-2, parent=1, signers=2 | Group 18: 1-of-7, parent=0, signers=7 | Group 19: 2-of-3, parent=0, childGroups=(20,21,22) | Group 20: 2-of-14, parent=19, signers=14 | Group 21: 2-of-12, parent=19, signers=12 | Group 22: 2-of-5, parent=19, signers=5]. The owner can rotate the entire signer tree.
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x1F128F883bb9f8FAcfEeE04674a35Fa96Fa3af52","description":"update the list of authorized callers that can update the nonces.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"add a 'message interceptor' contract that can gate messages based on content.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can arbitrarily update signers and transmitters set.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can disable source chains.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can enable 'RMN' verification for messages coming from a certain route, which require additional signatures to be accepted.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.6:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the fee quoter contract, where signers save new prices used for fee estimation.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.7:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the router contract used to relay messages on this chain from another chain. Each source chain has its own router configured.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.8:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the time before permissionless execution of messages, currently set to 1h.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.9:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add destination chains and update per-chain config (gas overheads, DA multipliers, fee parameters, size limits).","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.10:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove addresses in the authorized whitelist that can update prices.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.11:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove fallback price feed oracles if the default path fails or is stale.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.12:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove fee tokens accepted by CCIP pricing.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.13:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"update per-token transfer fee overrides (deciBps, min/max fee, dest gas overhead).","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.14:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"update token and destination-chain gas prices used for fee calculation.","role":".getAllAuthorizedCallers","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.22:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can set a 'message interceptor' contract to gate messages based on content.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.23:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can set the permissioned actor who can manage the sender whitelist.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.24:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can update the FeeQuoter address used for fee estimations.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.26:
+        {"permission":"interact","from":"eth:0xb22764f98dD05c789929716D677382Df22C05Cb6","description":"can register arbitrary tokens with an arbitrary administrator.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
    }
```

```diff
-   Status: DELETED
    contract EthereumToArbitrumOnRampTokenLimitAdmin (eth:0x2F2A3e36CE5Fb0924C414BEB1D98B531Cdf17e0B) [transporter/ManyChainMultiSig]
    +++ description: Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 4 signatures across 9 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 4-of-9 multisig and is strictly more constrained. Root: 1-of-1, childGroups=(1). [click for per-group breakdown: Group 1: 4-of-9, parent=0, signers=9]. The owner can rotate the entire signer tree.
```

```diff
    contract ARMTimelock (eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449) [transporter/RBACTimelock] {
    +++ description: Role based timelock used to administer CCIP contracts.
      directlyReceivedPermissions.1:
+        {"permission":"interact","from":"eth:0x1F128F883bb9f8FAcfEeE04674a35Fa96Fa3af52","description":"update the list of authorized callers that can update the nonces.","role":".owner"}
      directlyReceivedPermissions.2:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"add a 'message interceptor' contract that can gate messages based on content.","role":".owner"}
      directlyReceivedPermissions.3:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can arbitrarily update signers and transmitters set.","role":".owner"}
      directlyReceivedPermissions.4:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can disable source chains.","role":".owner"}
      directlyReceivedPermissions.5:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can enable 'RMN' verification for messages coming from a certain route, which require additional signatures to be accepted.","role":".owner"}
      directlyReceivedPermissions.6:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the fee quoter contract, where signers save new prices used for fee estimation.","role":".owner"}
      directlyReceivedPermissions.7:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the router contract used to relay messages on this chain from another chain. Each source chain has its own router configured.","role":".owner"}
      directlyReceivedPermissions.8:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the time before permissionless execution of messages, currently set to 1h.","role":".owner"}
      directlyReceivedPermissions.9:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add destination chains and update per-chain config (gas overheads, DA multipliers, fee parameters, size limits).","role":".owner"}
      directlyReceivedPermissions.10:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove addresses in the authorized whitelist that can update prices.","role":".owner"}
      directlyReceivedPermissions.11:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove fallback price feed oracles if the default path fails or is stale.","role":".owner"}
      directlyReceivedPermissions.12:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove fee tokens accepted by CCIP pricing.","role":".owner"}
      directlyReceivedPermissions.13:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"update per-token transfer fee overrides (deciBps, min/max fee, dest gas overhead).","role":".owner"}
      directlyReceivedPermissions.14:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"update token and destination-chain gas prices used for fee calculation.","role":".getAllAuthorizedCallers"}
      directlyReceivedPermissions.20:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can set a 'message interceptor' contract to gate messages based on content.","role":".owner"}
      directlyReceivedPermissions.21:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can set the permissioned actor who can manage the sender whitelist.","role":".owner"}
      directlyReceivedPermissions.22:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can update the FeeQuoter address used for fee estimations.","role":".owner"}
      directlyReceivedPermissions.24:
+        {"permission":"interact","from":"eth:0xb22764f98dD05c789929716D677382Df22C05Cb6","description":"can register arbitrary tokens with an arbitrary administrator.","role":".owner"}
    }
```

```diff
-   Status: DELETED
    contract EVM2EVMOnRamp (eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284) [transporter/OnRampV3]
    +++ description: None
```

```diff
    contract Router (eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) [transporter/RouterV1_2_0] {
    +++ description: Ethereum CCIP Router for this route. Users call it to send and receive messages from other chains. It dispatches to the appropriate OnRamp or OffRamp based on source or destination chain.
+++ description: Every Arbitrum-to-Ethereum OffRamp the Router accepts routeMessage() calls from. Multiple OffRamps can be active in parallel during a version migration, all are listed here.
      values.arbitrumOffRamps.2:
+        "eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5"
+++ description: Ethereum-to-Arbitrum OnRamp selected by the Router when users call ccipSend() for the Arbitrum chain selector.
      values.arbitrumOnRamp:
-        "eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284"
+        "eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa"
      values.onRamps.arbitrum:
-        "eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284"
+        "eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa"
      values.onRamps.base:
-        "eth:0xb8a882f3B88bd52D1Ff56A873bfDB84b70431937"
+        "eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa"
      values.onRamps.ink:
-        "eth:0xEEe2AE1d0Fa6D1D38BBBa555A7C7B90C8734a8e2"
+        "eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa"
      values.onRamps.everclear:
-        "eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa"
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) [N/A] {
    +++ description: Token accepted as fee token for sending outgoing messages.
      values.totalSupply:
-        "1823059432764109575639260"
+        "2194168877021750981562816"
    }
```

```diff
    contract ARM_GnosisSafe (eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf) [GnosisSafe] {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x1F128F883bb9f8FAcfEeE04674a35Fa96Fa3af52","description":"update the list of authorized callers that can update the nonces.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"add a 'message interceptor' contract that can gate messages based on content.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can arbitrarily update signers and transmitters set.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can disable source chains.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can enable 'RMN' verification for messages coming from a certain route, which require additional signatures to be accepted.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.6:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the fee quoter contract, where signers save new prices used for fee estimation.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.7:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the router contract used to relay messages on this chain from another chain. Each source chain has its own router configured.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.8:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the time before permissionless execution of messages, currently set to 1h.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.9:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add destination chains and update per-chain config (gas overheads, DA multipliers, fee parameters, size limits).","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.10:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove addresses in the authorized whitelist that can update prices.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.11:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove fallback price feed oracles if the default path fails or is stale.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.12:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove fee tokens accepted by CCIP pricing.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.13:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"update per-token transfer fee overrides (deciBps, min/max fee, dest gas overhead).","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.14:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"update token and destination-chain gas prices used for fee calculation.","role":".getAllAuthorizedCallers","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.22:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can set a 'message interceptor' contract to gate messages based on content.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.23:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can set the permissioned actor who can manage the sender whitelist.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.24:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can update the FeeQuoter address used for fee estimations.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.26:
+        {"permission":"interact","from":"eth:0xb22764f98dD05c789929716D677382Df22C05Cb6","description":"can register arbitrary tokens with an arbitrary administrator.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
    }
```

```diff
    contract ARM_Multisig1 (eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e) [transporter/ManyChainMultiSig] {
    +++ description: Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 4 signatures across 38 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 4-of-38 multisig and is strictly more constrained. Root: 2-of-4, childGroups=(1,2,3,4). [click for per-group breakdown: Group 1: 2-of-14, parent=0, signers=14 | Group 2: 2-of-12, parent=0, signers=12 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7]. The owner can rotate the entire signer tree.
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x1F128F883bb9f8FAcfEeE04674a35Fa96Fa3af52","description":"update the list of authorized callers that can update the nonces.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"add a 'message interceptor' contract that can gate messages based on content.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can arbitrarily update signers and transmitters set.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can disable source chains.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can enable 'RMN' verification for messages coming from a certain route, which require additional signatures to be accepted.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.6:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the fee quoter contract, where signers save new prices used for fee estimation.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.7:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the router contract used to relay messages on this chain from another chain. Each source chain has its own router configured.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.8:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the time before permissionless execution of messages, currently set to 1h.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.9:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add destination chains and update per-chain config (gas overheads, DA multipliers, fee parameters, size limits).","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.10:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove addresses in the authorized whitelist that can update prices.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.11:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove fallback price feed oracles if the default path fails or is stale.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.12:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove fee tokens accepted by CCIP pricing.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.13:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"update per-token transfer fee overrides (deciBps, min/max fee, dest gas overhead).","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.14:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"update token and destination-chain gas prices used for fee calculation.","role":".getAllAuthorizedCallers","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.22:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can set a 'message interceptor' contract to gate messages based on content.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.23:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can set the permissioned actor who can manage the sender whitelist.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.24:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can update the FeeQuoter address used for fee estimations.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.26:
+        {"permission":"interact","from":"eth:0xb22764f98dD05c789929716D677382Df22C05Cb6","description":"can register arbitrary tokens with an arbitrary administrator.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
    }
```

```diff
    contract ARM_Multisig2 (eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F) [transporter/ManyChainMultiSig] {
    +++ description: Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 4 signatures across 41 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 4-of-41 multisig and is strictly more constrained. Root: 2-of-4, childGroups=(1,2,3,4). [click for per-group breakdown: Group 1: 2-of-15, parent=0, signers=15 | Group 2: 2-of-14, parent=0, signers=14 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7]. The owner can rotate the entire signer tree.
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x1F128F883bb9f8FAcfEeE04674a35Fa96Fa3af52","description":"update the list of authorized callers that can update the nonces.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"add a 'message interceptor' contract that can gate messages based on content.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can arbitrarily update signers and transmitters set.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can disable source chains.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can enable 'RMN' verification for messages coming from a certain route, which require additional signatures to be accepted.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.6:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the fee quoter contract, where signers save new prices used for fee estimation.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.7:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the router contract used to relay messages on this chain from another chain. Each source chain has its own router configured.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.8:
+        {"permission":"interact","from":"eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5","description":"can update the time before permissionless execution of messages, currently set to 1h.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.9:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add destination chains and update per-chain config (gas overheads, DA multipliers, fee parameters, size limits).","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.10:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove addresses in the authorized whitelist that can update prices.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.11:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove fallback price feed oracles if the default path fails or is stale.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.12:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"add or remove fee tokens accepted by CCIP pricing.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.13:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"update per-token transfer fee overrides (deciBps, min/max fee, dest gas overhead).","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.14:
+        {"permission":"interact","from":"eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57","description":"update token and destination-chain gas prices used for fee calculation.","role":".getAllAuthorizedCallers","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.22:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can set a 'message interceptor' contract to gate messages based on content.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.23:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can set the permissioned actor who can manage the sender whitelist.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.24:
+        {"permission":"interact","from":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","description":"can update the FeeQuoter address used for fee estimations.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.26:
+        {"permission":"interact","from":"eth:0xb22764f98dD05c789929716D677382Df22C05Cb6","description":"can register arbitrary tokens with an arbitrary administrator.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
    }
```

```diff
+   Status: CREATED
    contract RegistryModuleOwnerCustom (eth:0x13022e3e6C77524308BD56AEd716E88311b2E533) [transporter/RegistryModuleOwnerCustom]
    +++ description: Permissionless registry-module wrapper. Anyone can call it, but each entry-point succeeds only when msg.sender is the token's own admin/owner, assuming they implement the proper interfaces (e.g. `IOwner`).
```

```diff
+   Status: CREATED
    contract NonceManager (eth:0x1F128F883bb9f8FAcfEeE04674a35Fa96Fa3af52) [ccip/NonceManager]
    +++ description: Contract maintaining message nonces,  which are updated by the OnRamp and OffRamps.
```

```diff
+   Status: CREATED
    contract EthereumOffRamp_v1_6 (eth:0x26d3681DfC9E4c8C79cfbf461adec8A21d5d73C5) [transporter/OfframpV3]
    +++ description: OffRamp used to receive messages on Ethereum from other chains. It stores the list and threshold of "OCR" signers that authorize the commitment of crosschain messages and the list of "transmitters", i.e. addresses can relay messages signed by the signers. Currently 16 signers are configured with F=5, so 5+1 signatures are required on every commit report. Committed message are usually executed by whitelisted "execution transmitters". If they are not executed within 1h, anyone can execute them.
```

```diff
+   Status: CREATED
    contract FeeQuoter (eth:0x300F2cA3e3867133BAEA866C89096F097d57Bf57) [transporter/FeeQuoter]
    +++ description: Fee oracle + price registry. It holds the per-destination-chain config (gas overheads, DA multipliers, network fee, gas multiplier, size limits, chain-family selector, etc.), the per-fee-token premium config, the per-(destChain, token) transfer fee overrides, and the live USD price tables for tokens and destination gas. The OnRamp delegates fee quoting to this contract.
```

```diff
+   Status: CREATED
    contract  (eth:0x3237c0D7B58BEc8Dc17F00103B784Bd6678f789E) [N/A]
    +++ description: Deprecated router used by BSC.
```

```diff
+   Status: CREATED
    contract RegistryModuleOwnerCustom (eth:0x4855174E9479E211337832E109E7721d43A4CA64) [transporter/RegistryModuleOwnerCustom]
    +++ description: Permissionless registry-module wrapper. Anyone can call it, but each entry-point succeeds only when msg.sender is the token's own admin/owner, assuming they implement the proper interfaces (e.g. `IOwner`).
```

```diff
+   Status: CREATED
    contract EthereumOnRamp_v1_6 (eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa) [transporter/OnRampV1_6]
    +++ description: Contract used to send outgoing messages to other chains. It saves destination chain configs, storing the router that is allowed to call the OnRamp and whether a whitelist is enabled to send messages.
```

```diff
+   Status: CREATED
    contract TokenAdminRegistry (eth:0xb22764f98dD05c789929716D677382Df22C05Cb6) [transporter/TokenAdminRegistry]
    +++ description: Central token registry that defines token pools and administrative rights to change such token pools. Tokens can either be centrally administered by Chainlink, or by the actual token admin / issuer.
```

## Source code changes

```diff
.../EVM2EVMOnRamp.sol => /dev/null                 | 3407 --------------------
 .../projects/ccip/.flat/EthereumOffRamp_v1_6.sol   | 3037 +++++++++++++++++
 .../projects/ccip/.flat/EthereumOnRamp_v1_6.sol    | 2354 ++++++++++++++
 .../dev/null                                       | 1632 ----------
 .../src/projects/ccip/.flat/FeeQuoter.sol          | 3218 ++++++++++++++++++
 .../src/projects/ccip/.flat/NonceManager.sol       | 1042 ++++++
 ...:0x13022e3e6C77524308BD56AEd716E88311b2E533.sol |   75 +
 ...:0x4855174E9479E211337832E109E7721d43A4CA64.sol |  479 +++
 .../src/projects/ccip/.flat/TokenAdminRegistry.sol |  791 +++++
 9 files changed, 10996 insertions(+), 5039 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777388210 (main branch discovery), not current.

```diff
    contract GHOEthereumTokenPool (eth:0x06179f7C1be40863405f374E7f5F8806c728660A) [transporter/TokenPool] {
    +++ description: GHO lock-and-release token pool on Ethereum. It trusts configured remote pools and only accepts inbound token releases routed through CCIP OffRamps.
      description:
-        "GHO lock-and-release token pool on Ethereum. It trusts configured Arbitrum remote pools and only accepts inbound token releases routed through CCIP OffRamps."
+        "GHO lock-and-release token pool on Ethereum. It trusts configured remote pools and only accepts inbound token releases routed through CCIP OffRamps."
    }
```

```diff
    contract ARM_Multisig4 (eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc) [transporter/ManyChainMultiSig] {
    +++ description: Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 8 signatures across 67 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 8-of-67 multisig and is strictly more constrained. Root: 3-of-3, childGroups=(1,18,19). [click for per-group breakdown: Group 1: 3-of-16, parent=0, childGroups=(2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17) | Group 2: 1-of-2, parent=1, signers=2 | Group 3: 1-of-2, parent=1, signers=2 | Group 4: 1-of-2, parent=1, signers=2 | Group 5: 1-of-1, parent=1, signers=1 | Group 6: 1-of-2, parent=1, signers=2 | Group 7: 1-of-2, parent=1, signers=2 | Group 8: 1-of-4, parent=1, signers=4 | Group 9: 1-of-1, parent=1, signers=1 | Group 10: 1-of-1, parent=1, signers=1 | Group 11: 1-of-1, parent=1, signers=1 | Group 12: 1-of-1, parent=1, signers=1 | Group 13: 1-of-3, parent=1, signers=3 | Group 14: 1-of-1, parent=1, signers=1 | Group 15: 1-of-1, parent=1, signers=1 | Group 16: 1-of-3, parent=1, signers=3 | Group 17: 1-of-2, parent=1, signers=2 | Group 18: 1-of-7, parent=0, signers=7 | Group 19: 2-of-3, parent=0, childGroups=(20,21,22) | Group 20: 2-of-14, parent=19, signers=14 | Group 21: 2-of-12, parent=19, signers=12 | Group 22: 2-of-5, parent=19, signers=5]. The owner can rotate the entire signer tree.
      name:
-        "ARMProxyOwnerBypasser"
+        "ARM_Multisig4"
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81","description":"replace the active ARM/RMN contract used for CCIP safety checks.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"cancel scheduled operations before they are executed.","role":".cancellerRoleMembers"}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"execute calls through this timelock without waiting for the configured delay.","role":".bypasserRoleMembers"}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"grant or revoke roles on this timelock.","role":".adminRoleMembers","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","description":"grant or revoke roles on this timelock.","role":".adminRoleMembers","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.6:
+        {"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"add, remove, or replace OnRamps and OffRamps used by the Router.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.7:
+        {"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"change the wrapped native token used for native-fee payments.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.8:
+        {"permission":"interact","from":"eth:0xAD97C0270a243270136E40278155C12ce7C7F87B","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]}
      receivedPermissions.0.via:
+        [{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]
      receivedPermissions.0.role:
-        ".CancellerRoleGranted"
+        ".owner"
      receivedPermissions.0.description:
-        "cancel scheduled operations before they are executed."
+        "rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root."
      receivedPermissions.0.from:
-        "eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"
+        "eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e"
      receivedPermissions.1.via:
+        [{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]
      receivedPermissions.1.role:
-        ".BypasserRoleGranted"
+        ".owner"
      receivedPermissions.1.description:
-        "execute calls through this timelock without waiting for the configured delay."
+        "rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root."
      receivedPermissions.1.from:
-        "eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"
+        "eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F"
      values.getConfig:
-        {"signers":[{"addr":"eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","index":0,"group":18},{"addr":"eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","index":1,"group":18},{"addr":"eth:0x124BA7e2188074335A0e9b12B449AD5781A73D60","index":2,"group":16},{"addr":"eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","index":3,"group":21},{"addr":"eth:0x1620E85235C124303d03671b5de5ca12249a16BF","index":4,"group":13},{"addr":"eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","index":5,"group":18},{"addr":"eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","index":6,"group":21},{"addr":"eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","index":7,"group":21},{"addr":"eth:0x266a433524AF2a471D381D8Ad4ad70DDAA5dC112","index":8,"group":7},{"addr":"eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","index":9,"group":20},{"addr":"eth:0x2b73763722378AB2013CB0877946f69fC3727Fd8","index":10,"group":8},{"addr":"eth:0x2B88575011C5E11389ddB50D28d31C7d06B352A0","index":11,"group":15},{"addr":"eth:0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6","index":12,"group":10},{"addr":"eth:0x34e42200901133bdceb1195f2c5241cb03D06274","index":13,"group":20},{"addr":"eth:0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3","index":14,"group":6},{"addr":"eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","index":15,"group":20},{"addr":"eth:0x4189a291cC7E497015B45D4bb046dC0A82580688","index":16,"group":17},{"addr":"eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","index":17,"group":20},{"addr":"eth:0x43640F208956c7D49e04F40FF95dF818643B76aA","index":18,"group":14},{"addr":"eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","index":19,"group":20},{"addr":"eth:0x48A094F7A354d8faD7263EA2a82391d105DF6628","index":20,"group":6},{"addr":"eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","index":21,"group":21},{"addr":"eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","index":22,"group":21},{"addr":"eth:0x4e509C60b3e916644dE441298595FeD12C4AC926","index":23,"group":12},{"addr":"eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","index":24,"group":20},{"addr":"eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","index":25,"group":21},{"addr":"eth:0x570F41d83b1031d382F641B9a532A8D7CBd7a695","index":26,"group":7},{"addr":"eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","index":27,"group":22},{"addr":"eth:0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6","index":28,"group":4},{"addr":"eth:0x5BF2821B248e85439B5d7c5a2bcB055Eb54Ad29F","index":29,"group":11},{"addr":"eth:0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8","index":30,"group":4},{"addr":"eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","index":31,"group":22},{"addr":"eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","index":32,"group":22},{"addr":"eth:0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7","index":33,"group":5},{"addr":"eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","index":34,"group":21},{"addr":"eth:0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae","index":35,"group":16},{"addr":"eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","index":36,"group":18},{"addr":"eth:0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5","index":37,"group":13},{"addr":"eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","index":38,"group":21},{"addr":"eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","index":39,"group":21},{"addr":"eth:0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374","index":40,"group":2},{"addr":"eth:0x843742760078Df85609690D85827173A1A96D14a","index":41,"group":20},{"addr":"eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","index":42,"group":20},{"addr":"eth:0x9079410666ED02725ee9d148398Cee26397c2A36","index":43,"group":3},{"addr":"eth:0x925d7Ea0ADe586DBFd56a942bb297286cE428C79","index":44,"group":17},{"addr":"eth:0x9453E18f03A36E2A2c70598De520bD24434D2d1D","index":45,"group":13},{"addr":"eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","index":46,"group":22},{"addr":"eth:0xA3177f64efE98422E782bC17BE7971F01187B7cF","index":47,"group":9},{"addr":"eth:0xa35B7219521134cAF52DccAD44d604335b64a4fB","index":48,"group":8},{"addr":"eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","index":49,"group":18},{"addr":"eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","index":50,"group":20},{"addr":"eth:0xa85936633588Fc7a120061CA973e65cE83839F87","index":51,"group":16},{"addr":"eth:0xb122347811e8E9C89cdbfd761fBc9929F52090B9","index":52,"group":3},{"addr":"eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","index":53,"group":21},{"addr":"eth:0xC6fA4C71F42dD1881E29DDe853FA5CcD18A59624","index":54,"group":8},{"addr":"eth:0xd107276078c6605bE0CEC43D765733291B7102aF","index":55,"group":20},{"addr":"eth:0xd3094f770579AFd66711847cE9E9C42D10BA2264","index":56,"group":8},{"addr":"eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","index":57,"group":21},{"addr":"eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","index":58,"group":20},{"addr":"eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","index":59,"group":20},{"addr":"eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","index":60,"group":20},{"addr":"eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","index":61,"group":21},{"addr":"eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","index":62,"group":20},{"addr":"eth:0xF721cEFDBD939Ba732E145817Dca810e6064c4b7","index":63,"group":2},{"addr":"eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","index":64,"group":18},{"addr":"eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","index":65,"group":18},{"addr":"eth:0xFccD1128fc823dD78e76240dc206a7A26494F271","index":66,"group":22}],"groupQuorums":[3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,0,0,0,0,0,0,0,0,0],"groupParents":[0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,19,19,19,0,0,0,0,0,0,0,0,0]}
      values.MAX_NUM_SIGNERS:
-        200
      values.NUM_GROUPS:
-        32
+++ description: Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list.
      values.$members:
+        ["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x124BA7e2188074335A0e9b12B449AD5781A73D60","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1620E85235C124303d03671b5de5ca12249a16BF","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x266a433524AF2a471D381D8Ad4ad70DDAA5dC112","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x2b73763722378AB2013CB0877946f69fC3727Fd8","eth:0x2B88575011C5E11389ddB50D28d31C7d06B352A0","eth:0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x4189a291cC7E497015B45D4bb046dC0A82580688","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x43640F208956c7D49e04F40FF95dF818643B76aA","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x48A094F7A354d8faD7263EA2a82391d105DF6628","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x4e509C60b3e916644dE441298595FeD12C4AC926","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x570F41d83b1031d382F641B9a532A8D7CBd7a695","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6","eth:0x5BF2821B248e85439B5d7c5a2bcB055Eb54Ad29F","eth:0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x9079410666ED02725ee9d148398Cee26397c2A36","eth:0x925d7Ea0ADe586DBFd56a942bb297286cE428C79","eth:0x9453E18f03A36E2A2c70598De520bD24434D2d1D","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xA3177f64efE98422E782bC17BE7971F01187B7cF","eth:0xa35B7219521134cAF52DccAD44d604335b64a4fB","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xa85936633588Fc7a120061CA973e65cE83839F87","eth:0xb122347811e8E9C89cdbfd761fBc9929F52090B9","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xC6fA4C71F42dD1881E29DDe853FA5CcD18A59624","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xd3094f770579AFd66711847cE9E9C42D10BA2264","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xF721cEFDBD939Ba732E145817Dca810e6064c4b7","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"]
+++ description: Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading.
      values.$threshold:
+        8
+++ description: Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups).
      values.config:
+        {"summary":"Root: 3-of-3, childGroups=(1,18,19) | Group 1: 3-of-16, parent=0, childGroups=(2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17) | Group 2: 1-of-2, parent=1, signers=2 | Group 3: 1-of-2, parent=1, signers=2 | Group 4: 1-of-2, parent=1, signers=2 | Group 5: 1-of-1, parent=1, signers=1 | Group 6: 1-of-2, parent=1, signers=2 | Group 7: 1-of-2, parent=1, signers=2 | Group 8: 1-of-4, parent=1, signers=4 | Group 9: 1-of-1, parent=1, signers=1 | Group 10: 1-of-1, parent=1, signers=1 | Group 11: 1-of-1, parent=1, signers=1 | Group 12: 1-of-1, parent=1, signers=1 | Group 13: 1-of-3, parent=1, signers=3 | Group 14: 1-of-1, parent=1, signers=1 | Group 15: 1-of-1, parent=1, signers=1 | Group 16: 1-of-3, parent=1, signers=3 | Group 17: 1-of-2, parent=1, signers=2 | Group 18: 1-of-7, parent=0, signers=7 | Group 19: 2-of-3, parent=0, childGroups=(20,21,22) | Group 20: 2-of-14, parent=19, signers=14 | Group 21: 2-of-12, parent=19, signers=12 | Group 22: 2-of-5, parent=19, signers=5","summaryRoot":"Root: 3-of-3, childGroups=(1,18,19)","summaryGroups":"Group 1: 3-of-16, parent=0, childGroups=(2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17) | Group 2: 1-of-2, parent=1, signers=2 | Group 3: 1-of-2, parent=1, signers=2 | Group 4: 1-of-2, parent=1, signers=2 | Group 5: 1-of-1, parent=1, signers=1 | Group 6: 1-of-2, parent=1, signers=2 | Group 7: 1-of-2, parent=1, signers=2 | Group 8: 1-of-4, parent=1, signers=4 | Group 9: 1-of-1, parent=1, signers=1 | Group 10: 1-of-1, parent=1, signers=1 | Group 11: 1-of-1, parent=1, signers=1 | Group 12: 1-of-1, parent=1, signers=1 | Group 13: 1-of-3, parent=1, signers=3 | Group 14: 1-of-1, parent=1, signers=1 | Group 15: 1-of-1, parent=1, signers=1 | Group 16: 1-of-3, parent=1, signers=3 | Group 17: 1-of-2, parent=1, signers=2 | Group 18: 1-of-7, parent=0, signers=7 | Group 19: 2-of-3, parent=0, childGroups=(20,21,22) | Group 20: 2-of-14, parent=19, signers=14 | Group 21: 2-of-12, parent=19, signers=12 | Group 22: 2-of-5, parent=19, signers=5","rootQuorum":3,"minSigs":8,"allMembers":["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x124BA7e2188074335A0e9b12B449AD5781A73D60","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1620E85235C124303d03671b5de5ca12249a16BF","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x266a433524AF2a471D381D8Ad4ad70DDAA5dC112","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x2b73763722378AB2013CB0877946f69fC3727Fd8","eth:0x2B88575011C5E11389ddB50D28d31C7d06B352A0","eth:0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x4189a291cC7E497015B45D4bb046dC0A82580688","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x43640F208956c7D49e04F40FF95dF818643B76aA","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x48A094F7A354d8faD7263EA2a82391d105DF6628","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x4e509C60b3e916644dE441298595FeD12C4AC926","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x570F41d83b1031d382F641B9a532A8D7CBd7a695","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6","eth:0x5BF2821B248e85439B5d7c5a2bcB055Eb54Ad29F","eth:0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x9079410666ED02725ee9d148398Cee26397c2A36","eth:0x925d7Ea0ADe586DBFd56a942bb297286cE428C79","eth:0x9453E18f03A36E2A2c70598De520bD24434D2d1D","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xA3177f64efE98422E782bC17BE7971F01187B7cF","eth:0xa35B7219521134cAF52DccAD44d604335b64a4fB","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xa85936633588Fc7a120061CA973e65cE83839F87","eth:0xb122347811e8E9C89cdbfd761fBc9929F52090B9","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xC6fA4C71F42dD1881E29DDe853FA5CcD18A59624","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xd3094f770579AFd66711847cE9E9C42D10BA2264","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xF721cEFDBD939Ba732E145817Dca810e6064c4b7","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"],"signerGroups":{"root":{"quorum":3,"parent":0,"childGroups":[1,18,19],"members":[]},"group1":{"quorum":3,"parent":0,"childGroups":[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"members":[]},"group2":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374","eth:0xF721cEFDBD939Ba732E145817Dca810e6064c4b7"]},"group3":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x9079410666ED02725ee9d148398Cee26397c2A36","eth:0xb122347811e8E9C89cdbfd761fBc9929F52090B9"]},"group4":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6","eth:0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8"]},"group5":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7"]},"group6":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3","eth:0x48A094F7A354d8faD7263EA2a82391d105DF6628"]},"group7":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x266a433524AF2a471D381D8Ad4ad70DDAA5dC112","eth:0x570F41d83b1031d382F641B9a532A8D7CBd7a695"]},"group8":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x2b73763722378AB2013CB0877946f69fC3727Fd8","eth:0xa35B7219521134cAF52DccAD44d604335b64a4fB","eth:0xC6fA4C71F42dD1881E29DDe853FA5CcD18A59624","eth:0xd3094f770579AFd66711847cE9E9C42D10BA2264"]},"group9":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0xA3177f64efE98422E782bC17BE7971F01187B7cF"]},"group10":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6"]},"group11":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x5BF2821B248e85439B5d7c5a2bcB055Eb54Ad29F"]},"group12":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x4e509C60b3e916644dE441298595FeD12C4AC926"]},"group13":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x1620E85235C124303d03671b5de5ca12249a16BF","eth:0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5","eth:0x9453E18f03A36E2A2c70598De520bD24434D2d1D"]},"group14":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x43640F208956c7D49e04F40FF95dF818643B76aA"]},"group15":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x2B88575011C5E11389ddB50D28d31C7d06B352A0"]},"group16":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x124BA7e2188074335A0e9b12B449AD5781A73D60","eth:0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae","eth:0xa85936633588Fc7a120061CA973e65cE83839F87"]},"group17":{"quorum":1,"parent":1,"childGroups":[],"members":["eth:0x4189a291cC7E497015B45D4bb046dC0A82580688","eth:0x925d7Ea0ADe586DBFd56a942bb297286cE428C79"]},"group18":{"quorum":1,"parent":0,"childGroups":[],"members":["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29"]},"group19":{"quorum":2,"parent":0,"childGroups":[20,21,22],"members":[]},"group20":{"quorum":2,"parent":19,"childGroups":[],"members":["eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6"]},"group21":{"quorum":2,"parent":19,"childGroups":[],"members":["eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6"]},"group22":{"quorum":2,"parent":19,"childGroups":[],"members":["eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"]}}}
+++ description: Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule.
      values.memberCount:
+        67
+++ description: Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected.
      values.minSigs:
+        8
+++ description: One-line readable form of the full tree-quorum, e.g. "Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...". Exposed as a top-level field so it can be interpolated into the entry's description.
      values.summary:
+        "Root: 3-of-3, childGroups=(1,18,19) | Group 1: 3-of-16, parent=0, childGroups=(2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17) | Group 2: 1-of-2, parent=1, signers=2 | Group 3: 1-of-2, parent=1, signers=2 | Group 4: 1-of-2, parent=1, signers=2 | Group 5: 1-of-1, parent=1, signers=1 | Group 6: 1-of-2, parent=1, signers=2 | Group 7: 1-of-2, parent=1, signers=2 | Group 8: 1-of-4, parent=1, signers=4 | Group 9: 1-of-1, parent=1, signers=1 | Group 10: 1-of-1, parent=1, signers=1 | Group 11: 1-of-1, parent=1, signers=1 | Group 12: 1-of-1, parent=1, signers=1 | Group 13: 1-of-3, parent=1, signers=3 | Group 14: 1-of-1, parent=1, signers=1 | Group 15: 1-of-1, parent=1, signers=1 | Group 16: 1-of-3, parent=1, signers=3 | Group 17: 1-of-2, parent=1, signers=2 | Group 18: 1-of-7, parent=0, signers=7 | Group 19: 2-of-3, parent=0, childGroups=(20,21,22) | Group 20: 2-of-14, parent=19, signers=14 | Group 21: 2-of-12, parent=19, signers=12 | Group 22: 2-of-5, parent=19, signers=5"
+++ description: The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description.
      values.summaryGroups:
+        "Group 1: 3-of-16, parent=0, childGroups=(2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17) | Group 2: 1-of-2, parent=1, signers=2 | Group 3: 1-of-2, parent=1, signers=2 | Group 4: 1-of-2, parent=1, signers=2 | Group 5: 1-of-1, parent=1, signers=1 | Group 6: 1-of-2, parent=1, signers=2 | Group 7: 1-of-2, parent=1, signers=2 | Group 8: 1-of-4, parent=1, signers=4 | Group 9: 1-of-1, parent=1, signers=1 | Group 10: 1-of-1, parent=1, signers=1 | Group 11: 1-of-1, parent=1, signers=1 | Group 12: 1-of-1, parent=1, signers=1 | Group 13: 1-of-3, parent=1, signers=3 | Group 14: 1-of-1, parent=1, signers=1 | Group 15: 1-of-1, parent=1, signers=1 | Group 16: 1-of-3, parent=1, signers=3 | Group 17: 1-of-2, parent=1, signers=2 | Group 18: 1-of-7, parent=0, signers=7 | Group 19: 2-of-3, parent=0, childGroups=(20,21,22) | Group 20: 2-of-14, parent=19, signers=14 | Group 21: 2-of-12, parent=19, signers=12 | Group 22: 2-of-5, parent=19, signers=5"
+++ description: Just the root-group line of the tree summary (e.g. "Root: 2-of-4, childGroups=(1,2,3,4)"). Always-visible head of the description.
      values.summaryRoot:
+        "Root: 3-of-3, childGroups=(1,18,19)"
      description:
+        "Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 8 signatures across 67 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 8-of-67 multisig and is strictly more constrained. Root: 3-of-3, childGroups=(1,18,19). [click for per-group breakdown: Group 1: 3-of-16, parent=0, childGroups=(2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17) | Group 2: 1-of-2, parent=1, signers=2 | Group 3: 1-of-2, parent=1, signers=2 | Group 4: 1-of-2, parent=1, signers=2 | Group 5: 1-of-1, parent=1, signers=1 | Group 6: 1-of-2, parent=1, signers=2 | Group 7: 1-of-2, parent=1, signers=2 | Group 8: 1-of-4, parent=1, signers=4 | Group 9: 1-of-1, parent=1, signers=1 | Group 10: 1-of-1, parent=1, signers=1 | Group 11: 1-of-1, parent=1, signers=1 | Group 12: 1-of-1, parent=1, signers=1 | Group 13: 1-of-3, parent=1, signers=3 | Group 14: 1-of-1, parent=1, signers=1 | Group 15: 1-of-1, parent=1, signers=1 | Group 16: 1-of-3, parent=1, signers=3 | Group 17: 1-of-2, parent=1, signers=2 | Group 18: 1-of-7, parent=0, signers=7 | Group 19: 2-of-3, parent=0, childGroups=(20,21,22) | Group 20: 2-of-14, parent=19, signers=14 | Group 21: 2-of-12, parent=19, signers=12 | Group 22: 2-of-5, parent=19, signers=5]. The owner can rotate the entire signer tree."
      fieldMeta:
+        {"config":{"description":"Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups)."},"summary":{"description":"One-line readable form of the full tree-quorum, e.g. \"Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...\". Exposed as a top-level field so it can be interpolated into the entry's description."},"summaryRoot":{"description":"Just the root-group line of the tree summary (e.g. \"Root: 2-of-4, childGroups=(1,2,3,4)\"). Always-visible head of the description."},"summaryGroups":{"description":"The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description."},"$threshold":{"description":"Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading."},"$members":{"description":"Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list."},"minSigs":{"description":"Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected."},"memberCount":{"description":"Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule."},"getRoot":{"description":"Currently active Merkle root of pending operations and its expiry timestamp."},"getRootMetadata":{"description":"Metadata of the active root: target chainId and multisig, pre/post op counts, and whether it overrode the previous root."},"getOpCount":{"description":"Monotonic counter of ops executed across all roots. Used to detect skipped ops from the previous root."},"owner":{"severity":"HIGH","type":"PERMISSION"}}
      category:
+        {"name":"Governance","priority":3}
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","role":".bypasserRoleMembers"}]
    }
```

```diff
    contract EthereumToArbitrumOnRampTokenLimitAdmin (eth:0x2F2A3e36CE5Fb0924C414BEB1D98B531Cdf17e0B) [transporter/ManyChainMultiSig] {
    +++ description: Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 4 signatures across 9 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 4-of-9 multisig and is strictly more constrained. Root: 1-of-1, childGroups=(1). [click for per-group breakdown: Group 1: 4-of-9, parent=0, signers=9]. The owner can rotate the entire signer tree.
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"change the aggregate outbound value rate limit for Ethereum-to-Arbitrum sends.","role":".getTokenLimitAdmin"}
      receivedPermissions.1.role:
-        ".getTokenLimitAdmin"
+        ".owner"
      receivedPermissions.1.description:
-        "replace the token limit admin for this OnRamp."
+        "rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root."
      receivedPermissions.1.from:
-        "eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284"
+        "eth:0x2F2A3e36CE5Fb0924C414BEB1D98B531Cdf17e0B"
      values.getConfig:
-        {"signers":[{"addr":"eth:0x162A8E51E69D72a4bA462220aE9A2E94e44d753F","index":0,"group":1},{"addr":"eth:0x1c6460cfe32916196f6977b5442b0F98A826D880","index":1,"group":1},{"addr":"eth:0x31e16F375531F8d77E027ff935e1114eD62D797b","index":2,"group":1},{"addr":"eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","index":3,"group":1},{"addr":"eth:0x5A5A8C7E8448484Cf3458d7f426876E79c529f41","index":4,"group":1},{"addr":"eth:0x7052cB84079905400ea52B635cAb6a275fDA8823","index":5,"group":1},{"addr":"eth:0x745B9329ccF53556e3C5f1fD1E4e9D0E91Ad2514","index":6,"group":1},{"addr":"eth:0xAe735fd5e74887064DFf99C637f291caE5485A75","index":7,"group":1},{"addr":"eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","index":8,"group":1}],"groupQuorums":[1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"groupParents":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
      values.MAX_NUM_SIGNERS:
-        200
      values.NUM_GROUPS:
-        32
+++ description: Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list.
      values.$members:
+        ["eth:0x162A8E51E69D72a4bA462220aE9A2E94e44d753F","eth:0x1c6460cfe32916196f6977b5442b0F98A826D880","eth:0x31e16F375531F8d77E027ff935e1114eD62D797b","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x5A5A8C7E8448484Cf3458d7f426876E79c529f41","eth:0x7052cB84079905400ea52B635cAb6a275fDA8823","eth:0x745B9329ccF53556e3C5f1fD1E4e9D0E91Ad2514","eth:0xAe735fd5e74887064DFf99C637f291caE5485A75","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88"]
+++ description: Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading.
      values.$threshold:
+        4
+++ description: Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups).
      values.config:
+        {"summary":"Root: 1-of-1, childGroups=(1) | Group 1: 4-of-9, parent=0, signers=9","summaryRoot":"Root: 1-of-1, childGroups=(1)","summaryGroups":"Group 1: 4-of-9, parent=0, signers=9","rootQuorum":1,"minSigs":4,"allMembers":["eth:0x162A8E51E69D72a4bA462220aE9A2E94e44d753F","eth:0x1c6460cfe32916196f6977b5442b0F98A826D880","eth:0x31e16F375531F8d77E027ff935e1114eD62D797b","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x5A5A8C7E8448484Cf3458d7f426876E79c529f41","eth:0x7052cB84079905400ea52B635cAb6a275fDA8823","eth:0x745B9329ccF53556e3C5f1fD1E4e9D0E91Ad2514","eth:0xAe735fd5e74887064DFf99C637f291caE5485A75","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88"],"signerGroups":{"root":{"quorum":1,"parent":0,"childGroups":[1],"members":[]},"group1":{"quorum":4,"parent":0,"childGroups":[],"members":["eth:0x162A8E51E69D72a4bA462220aE9A2E94e44d753F","eth:0x1c6460cfe32916196f6977b5442b0F98A826D880","eth:0x31e16F375531F8d77E027ff935e1114eD62D797b","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x5A5A8C7E8448484Cf3458d7f426876E79c529f41","eth:0x7052cB84079905400ea52B635cAb6a275fDA8823","eth:0x745B9329ccF53556e3C5f1fD1E4e9D0E91Ad2514","eth:0xAe735fd5e74887064DFf99C637f291caE5485A75","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88"]}}}
+++ description: Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule.
      values.memberCount:
+        9
+++ description: Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected.
      values.minSigs:
+        4
+++ description: One-line readable form of the full tree-quorum, e.g. "Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...". Exposed as a top-level field so it can be interpolated into the entry's description.
      values.summary:
+        "Root: 1-of-1, childGroups=(1) | Group 1: 4-of-9, parent=0, signers=9"
+++ description: The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description.
      values.summaryGroups:
+        "Group 1: 4-of-9, parent=0, signers=9"
+++ description: Just the root-group line of the tree summary (e.g. "Root: 2-of-4, childGroups=(1,2,3,4)"). Always-visible head of the description.
      values.summaryRoot:
+        "Root: 1-of-1, childGroups=(1)"
      description:
+        "Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 4 signatures across 9 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 4-of-9 multisig and is strictly more constrained. Root: 1-of-1, childGroups=(1). [click for per-group breakdown: Group 1: 4-of-9, parent=0, signers=9]. The owner can rotate the entire signer tree."
      fieldMeta:
+        {"config":{"description":"Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups)."},"summary":{"description":"One-line readable form of the full tree-quorum, e.g. \"Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...\". Exposed as a top-level field so it can be interpolated into the entry's description."},"summaryRoot":{"description":"Just the root-group line of the tree summary (e.g. \"Root: 2-of-4, childGroups=(1,2,3,4)\"). Always-visible head of the description."},"summaryGroups":{"description":"The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description."},"$threshold":{"description":"Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading."},"$members":{"description":"Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list."},"minSigs":{"description":"Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected."},"memberCount":{"description":"Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule."},"getRoot":{"description":"Currently active Merkle root of pending operations and its expiry timestamp."},"getRootMetadata":{"description":"Metadata of the active root: target chainId and multisig, pre/post op counts, and whether it overrode the previous root."},"getOpCount":{"description":"Monotonic counter of ops executed across all roots. Used to detect skipped ops from the previous root."},"owner":{"severity":"HIGH","type":"PERMISSION"}}
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ARMProxy (eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81) [transporter/ARMProxy] {
    +++ description: Proxy pointing to the active ARM/RMN contract used by CCIP to report whether routes are cursed.
      description:
-        "ARM proxy used by the Router, OnRamp, CommitStore, OffRamp, and GHO token pool to read RMN curse and blessing state."
+        "Proxy pointing to the active ARM/RMN contract used by CCIP to report whether routes are cursed."
      directlyReceivedPermissions:
-        [{"permission":"interact","from":"eth:0x06179f7C1be40863405f374E7f5F8806c728660A","description":"block GHO pool operations when ARM/RMN marks the route or global subject as cursed.","role":".getRmnProxy"},{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"block routed messages when ARM/RMN reports the relevant subject as cursed.","role":".getArmProxy"},{"permission":"interact","from":"eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749","description":"define the trusted source OnRamp and ARM/RMN safety gate for commits accepted by this CommitStore.","role":".getStaticConfig"}]
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x06179f7C1be40863405f374E7f5F8806c728660A","description":"block token pool operations when ARM/RMN marks a route or global subject as cursed.","role":".getRmnProxy"},{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"block routed messages when ARM/RMN reports the relevant subject as cursed.","role":".getArmProxy"}]
    }
```

```diff
    contract ARMTimelock (eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449) [transporter/RBACTimelock] {
    +++ description: Role based timelock used to administer CCIP contracts.
      name:
-        "ARMProxyOwner"
+        "ARMTimelock"
      description:
-        "Timelock administering the CCIP Router, PriceRegistry, CommitStore, OffRamp, OnRamp, and ARM proxy."
+        "Role based timelock used to administer CCIP contracts."
      directlyReceivedPermissions.0:
+        {"permission":"interact","from":"eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner"}
      directlyReceivedPermissions.1:
-        {"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"grant or revoke roles on this timelock.","role":".AdminRoleGranted"}
      directlyReceivedPermissions.2:
-        {"permission":"interact","from":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","description":"grant or revoke roles on this timelock.","role":".AdminRoleGranted"}
      directlyReceivedPermissions.3:
-        {"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"add, remove, or reprice fee tokens accepted by this OnRamp.","role":".owner"}
      directlyReceivedPermissions.4:
-        {"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"change Router, PriceRegistry, message size, token count, gas limit, and fee parameters for outbound messages.","role":".owner"}
      directlyReceivedPermissions.5.role:
-        ".owner"
+        ".adminRoleMembers"
      directlyReceivedPermissions.5.description:
-        "change token transfer fee configuration and node operator fee weights."
+        "grant or revoke roles on this timelock."
      directlyReceivedPermissions.5.from:
-        "eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284"
+        "eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"
      directlyReceivedPermissions.6.role:
-        ".owner"
+        ".adminRoleMembers"
      directlyReceivedPermissions.6.description:
-        "withdraw accumulated non-LINK fee tokens."
+        "grant or revoke roles on this timelock."
      directlyReceivedPermissions.6.from:
-        "eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284"
+        "eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A"
      directlyReceivedPermissions.9:
-        {"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"recover tokens held by the Router.","role":".owner"}
      directlyReceivedPermissions.10:
-        {"permission":"interact","from":"eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad","description":"add or remove fee tokens accepted by CCIP pricing.","role":".owner"}
      directlyReceivedPermissions.11:
-        {"permission":"interact","from":"eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad","description":"add or remove price updater accounts.","role":".owner"}
      directlyReceivedPermissions.12.description:
-        "change the staleness threshold for token and gas prices."
+        "rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root."
      directlyReceivedPermissions.12.from:
-        "eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad"
+        "eth:0xAD97C0270a243270136E40278155C12ce7C7F87B"
      directlyReceivedPermissions.13.description:
-        "pause or unpause commits and change OCR, dynamic config, minimum sequence, and price epoch parameters."
+        "rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root."
      directlyReceivedPermissions.13.from:
-        "eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749"
+        "eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e"
      directlyReceivedPermissions.14.description:
-        "change the OffRamp admin, OCR config, rate limits, token pools, and execution parameters."
+        "rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root."
      directlyReceivedPermissions.14.from:
-        "eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d"
+        "eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F"
      values.AdminRoleGranted:
-        ["eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"]
      values.adminRoleMemberCount:
-        1
      values.BypasserRoleGranted:
-        ["eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc"]
      values.bypasserRoleMemberCount:
-        1
      values.CancellerRoleGranted:
-        ["eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F","eth:0xAD97C0270a243270136E40278155C12ce7C7F87B","eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf","eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc","eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e"]
      values.cancellerRoleMemberCount:
-        5
      values.ExecutorRoleGranted:
-        ["eth:0x82b8A19497fA25575f250a3DcFfCD2562B575A2e"]
      values.executorRoleMemberCount:
-        1
      values.ProposerRoleGranted:
-        ["eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F","eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf","eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e"]
      values.proposerRoleMemberCount:
-        3
      values.RolesRevoked:
-        [{"role":"0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1","account":"eth:0x7E5eb20ec4d57615267235e40eCFd270d55e919b","sender":"eth:0x61E5E1ea8fF9Dc840e0A549c752FA7BDe9224e99"},{"role":"0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775","account":"eth:0x61E5E1ea8fF9Dc840e0A549c752FA7BDe9224e99","sender":"eth:0x61E5E1ea8fF9Dc840e0A549c752FA7BDe9224e99"},{"role":"0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783","account":"eth:0xa8D5E1daA6D8B94f11D77B7E09DE846292ef69FF","sender":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}]
+++ description: Full role map: per-role admin role and current members.
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"ADMIN_ROLE":{"adminRole":"ADMIN_ROLE","members":["eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"]},"PROPOSER_ROLE":{"adminRole":"ADMIN_ROLE","members":["eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F","eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf","eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e"]},"EXECUTOR_ROLE":{"adminRole":"ADMIN_ROLE","members":["eth:0x82b8A19497fA25575f250a3DcFfCD2562B575A2e"]},"CANCELLER_ROLE":{"adminRole":"ADMIN_ROLE","members":["eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F","eth:0xAD97C0270a243270136E40278155C12ce7C7F87B","eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf","eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc","eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e"]},"BYPASSER_ROLE":{"adminRole":"ADMIN_ROLE","members":["eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc"]}}
+++ description: Current accounts granted the admin role.
      values.adminRoleMembers:
+        ["eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"]
+++ description: Current accounts granted permission to bypass the timelock delay.
      values.bypasserRoleMembers:
+        ["eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc"]
+++ description: Current accounts granted permission to cancel scheduled operations.
      values.cancellerRoleMembers:
+        ["eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F","eth:0xAD97C0270a243270136E40278155C12ce7C7F87B","eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf","eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc","eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e"]
+++ description: Current accounts granted permission to execute scheduled operations.
      values.executorRoleMembers:
+        ["eth:0x82b8A19497fA25575f250a3DcFfCD2562B575A2e"]
+++ description: Current accounts granted permission to schedule operations.
      values.proposerRoleMembers:
+        ["eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F","eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf","eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e"]
      fieldMeta.AdminRoleGranted:
-        {"description":"Current accounts granted the admin role."}
      fieldMeta.BypasserRoleGranted:
-        {"description":"Current accounts granted permission to bypass the timelock delay."}
      fieldMeta.CancellerRoleGranted:
-        {"description":"Current accounts granted permission to cancel scheduled operations."}
      fieldMeta.ExecutorRoleGranted:
-        {"description":"Current accounts granted permission to execute scheduled operations."}
      fieldMeta.ProposerRoleGranted:
-        {"description":"Current accounts granted permission to schedule operations."}
      fieldMeta.RolesRevoked:
-        {"description":"History of role revocations."}
      fieldMeta.accessControl:
+        {"description":"Full role map: per-role admin role and current members."}
      fieldMeta.adminRoleMembers:
+        {"description":"Current accounts granted the admin role."}
      fieldMeta.bypasserRoleMembers:
+        {"description":"Current accounts granted permission to bypass the timelock delay."}
      fieldMeta.cancellerRoleMembers:
+        {"description":"Current accounts granted permission to cancel scheduled operations."}
      fieldMeta.executorRoleMembers:
+        {"description":"Current accounts granted permission to execute scheduled operations."}
      fieldMeta.proposerRoleMembers:
+        {"description":"Current accounts granted permission to schedule operations."}
    }
```

```diff
    contract RMNCallProxy (eth:0x49edf594E698F406A15afEf44CE7a0Fd8d998610) [transporter/CallProxyWithTargetSet] {
    +++ description: Anyone can call this contract to execute scheduled transactions that have passed the delay.
      name:
-        "RMNRemoteOwnerExecutor"
+        "RMNCallProxy"
      description:
-        "Public call proxy that forwards any caller to RMNRemoteOwner, allowing anyone to execute already-scheduled RMNRemoteOwner operations after the timelock delay."
+        "Anyone can call this contract to execute scheduled transactions that have passed the delay."
      receivedPermissions.0.role:
-        ".ExecutorRoleGranted"
+        ".executorRoleMembers"
+++ description: Immutable target contract that every call to this proxy is forwarded to. Extracted from the TargetSet event emitted on deployment.
      values.target:
+        "eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A"
      template:
+        "transporter/CallProxyWithTargetSet"
      fieldMeta:
+        {"target":{"description":"Immutable target contract that every call to this proxy is forwarded to. Extracted from the TargetSet event emitted on deployment."}}
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
-   Status: DELETED
    contract Executor (eth:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A) [N/A]
    +++ description: Aave governance executor that owns the GHO Ethereum token pool.
```

```diff
    contract RMNTimelock (eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A) [transporter/RBACTimelock] {
    +++ description: Role based timelock used to administer CCIP contracts.
      name:
-        "RMNRemoteOwner"
+        "RMNTimelock"
      description:
-        "Timelock administering RMNRemote signer configuration and curse/blessing controls."
+        "Role based timelock used to administer CCIP contracts."
      directlyReceivedPermissions.0:
+        {"permission":"act","from":"eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20","role":".owner"}
      directlyReceivedPermissions.1:
+        {"permission":"interact","from":"eth:0x79bC82F3931A7d017719146A822e4AD8152b157e","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner"}
      directlyReceivedPermissions.2:
+        {"permission":"interact","from":"eth:0x806659842cFeEE3CBEF35F8ad2eA42460574b413","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner"}
      directlyReceivedPermissions.3:
+        {"permission":"interact","from":"eth:0x8C00Cc7cC37396e88BbFe66371341a59D1b5771F","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner"}
      directlyReceivedPermissions.4:
+        {"permission":"interact","from":"eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20","description":"curse or uncurse subjects (chains or the global subject), which halts CCIP operations gated by ARMProxy.isCursed checks.","role":".owner"}
      directlyReceivedPermissions.0.description:
-        "update the RMN signer set and fault threshold used to approve or block CCIP activity."
+        "rotate the RMN signer set, fSign threshold, and RMNHome config digest used to approve or block CCIP activity."
      values.AdminRoleGranted:
-        ["eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"]
      values.adminRoleMemberCount:
-        1
      values.BypasserRoleGranted:
-        ["eth:0x8C00Cc7cC37396e88BbFe66371341a59D1b5771F"]
      values.bypasserRoleMemberCount:
-        1
      values.CancellerRoleGranted:
-        ["eth:0x806659842cFeEE3CBEF35F8ad2eA42460574b413"]
      values.cancellerRoleMemberCount:
-        1
      values.ExecutorRoleGranted:
-        ["eth:0x49edf594E698F406A15afEf44CE7a0Fd8d998610"]
      values.executorRoleMemberCount:
-        1
      values.ProposerRoleGranted:
-        ["eth:0x79bC82F3931A7d017719146A822e4AD8152b157e"]
      values.proposerRoleMemberCount:
-        1
      values.RolesRevoked:
-        [{"role":"0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775","account":"eth:0x062f05CD6c835677B05a8658A351969476861316","sender":"eth:0x062f05CD6c835677B05a8658A351969476861316"}]
+++ description: Full role map: per-role admin role and current members.
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"ADMIN_ROLE":{"adminRole":"ADMIN_ROLE","members":["eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"]},"PROPOSER_ROLE":{"adminRole":"ADMIN_ROLE","members":["eth:0x79bC82F3931A7d017719146A822e4AD8152b157e"]},"EXECUTOR_ROLE":{"adminRole":"ADMIN_ROLE","members":["eth:0x49edf594E698F406A15afEf44CE7a0Fd8d998610"]},"CANCELLER_ROLE":{"adminRole":"ADMIN_ROLE","members":["eth:0x806659842cFeEE3CBEF35F8ad2eA42460574b413"]},"BYPASSER_ROLE":{"adminRole":"ADMIN_ROLE","members":["eth:0x8C00Cc7cC37396e88BbFe66371341a59D1b5771F"]}}
+++ description: Current accounts granted the admin role.
      values.adminRoleMembers:
+        ["eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"]
+++ description: Current accounts granted permission to bypass the timelock delay.
      values.bypasserRoleMembers:
+        ["eth:0x8C00Cc7cC37396e88BbFe66371341a59D1b5771F"]
+++ description: Current accounts granted permission to cancel scheduled operations.
      values.cancellerRoleMembers:
+        ["eth:0x806659842cFeEE3CBEF35F8ad2eA42460574b413"]
+++ description: Current accounts granted permission to execute scheduled operations.
      values.executorRoleMembers:
+        ["eth:0x49edf594E698F406A15afEf44CE7a0Fd8d998610"]
+++ description: Current accounts granted permission to schedule operations.
      values.proposerRoleMembers:
+        ["eth:0x79bC82F3931A7d017719146A822e4AD8152b157e"]
      fieldMeta.AdminRoleGranted:
-        {"description":"Current accounts granted the admin role."}
      fieldMeta.BypasserRoleGranted:
-        {"description":"Current accounts granted permission to bypass the timelock delay."}
      fieldMeta.CancellerRoleGranted:
-        {"description":"Current accounts granted permission to cancel scheduled operations."}
      fieldMeta.ExecutorRoleGranted:
-        {"description":"Current accounts granted permission to execute scheduled operations."}
      fieldMeta.ProposerRoleGranted:
-        {"description":"Current accounts granted permission to schedule operations."}
      fieldMeta.RolesRevoked:
-        {"description":"History of role revocations."}
      fieldMeta.accessControl:
+        {"description":"Full role map: per-role admin role and current members."}
      fieldMeta.adminRoleMembers:
+        {"description":"Current accounts granted the admin role."}
      fieldMeta.bypasserRoleMembers:
+        {"description":"Current accounts granted permission to bypass the timelock delay."}
      fieldMeta.cancellerRoleMembers:
+        {"description":"Current accounts granted permission to cancel scheduled operations."}
      fieldMeta.executorRoleMembers:
+        {"description":"Current accounts granted permission to execute scheduled operations."}
      fieldMeta.proposerRoleMembers:
+        {"description":"Current accounts granted permission to schedule operations."}
    }
```

```diff
    contract EVM2EVMOnRamp (eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284) [transporter/OnRampV3] {
    +++ description: None
      name:
-        "EthereumToArbitrumOnRamp"
+        "EVM2EVMOnRamp"
      description:
-        "Ethereum-to-Arbitrum OnRamp. It receives messages only from the Router, validates send limits and fees, locks or burns tokens through token pools, assigns sequence numbers and nonces, hashes the message, and emits CCIPSendRequested for the offchain DON (ccip consensus)."
+++ description: Current per-fee-token config (networkFee, gas/premium multipliers, enabled flag), reconstructed from FeeConfigSet event history. The s_feeTokenConfig mapping is internal and the only public getter is per-token, so the event log is replayed; if the same token has been reconfigured multiple times each distinct config emitted will appear as a separate entry.
      values.feeTokenConfig:
+        [{"token":"eth:0x514910771AF9Ca656af840dff83E8264EcF986CA","networkFeeUSDCents":50,"gasMultiplierWeiPerEth":"1100000000000000000","premiumMultiplierWeiPerEth":"900000000000000000","enabled":true},{"token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","networkFeeUSDCents":50,"gasMultiplierWeiPerEth":"1100000000000000000","premiumMultiplierWeiPerEth":"1000000000000000000","enabled":true},{"token":"eth:0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f","networkFeeUSDCents":50,"gasMultiplierWeiPerEth":"1100000000000000000","premiumMultiplierWeiPerEth":"1000000000000000000","enabled":true}]
      fieldMeta.getStaticConfig:
-        {"description":"Immutable lane config: Ethereum source selector, Arbitrum destination selector, previous OnRamp, RMN proxy, LINK token, and token admin registry."}
      fieldMeta.getDynamicConfig:
-        {"description":"Mutable outbound config: Router, PriceRegistry, message size and gas limits, token limits, destination gas overheads, fee defaults, and ordered-execution policy."}
      fieldMeta.feeTokenConfig:
+        {"description":"Current per-fee-token config (networkFee, gas/premium multipliers, enabled flag), reconstructed from FeeConfigSet event history. The s_feeTokenConfig mapping is internal and the only public getter is per-token, so the event log is replayed; if the same token has been reconfigured multiple times each distinct config emitted will appear as a separate entry."}
    }
```

```diff
    contract RMN_Multisig1 (eth:0x79bC82F3931A7d017719146A822e4AD8152b157e) [transporter/ManyChainMultiSig] {
    +++ description: Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 4 signatures across 41 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 4-of-41 multisig and is strictly more constrained. Root: 2-of-4, childGroups=(1,2,3,4). [click for per-group breakdown: Group 1: 2-of-15, parent=0, signers=15 | Group 2: 2-of-14, parent=0, signers=14 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7]. The owner can rotate the entire signer tree.
      name:
-        "RMNRemoteOwnerProposer"
+        "RMN_Multisig1"
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81","description":"block or allow CCIP activity by reporting whether global or route-specific subjects are cursed.","role":".getARM","via":[{"address":"eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20"},{"address":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","delay":10800}]}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","description":"schedule operations that can be executed after the configured timelock delay.","role":".proposerRoleMembers"}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x79bC82F3931A7d017719146A822e4AD8152b157e","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner","via":[{"address":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","delay":10800}]}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x806659842cFeEE3CBEF35F8ad2eA42460574b413","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner","via":[{"address":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","delay":10800}]}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x8C00Cc7cC37396e88BbFe66371341a59D1b5771F","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner","via":[{"address":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","delay":10800}]}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20","description":"curse or uncurse subjects (chains or the global subject), which halts CCIP operations gated by ARMProxy.isCursed checks.","role":".owner","via":[{"address":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","delay":10800}]}
      receivedPermissions.0.via:
+        [{"address":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","delay":10800}]
      receivedPermissions.0.role:
-        ".ProposerRoleGranted"
+        ".owner"
      receivedPermissions.0.description:
-        "schedule operations that can be executed after the configured timelock delay."
+        "rotate the RMN signer set, fSign threshold, and RMNHome config digest used to approve or block CCIP activity."
      receivedPermissions.0.from:
-        "eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A"
+        "eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20"
      values.getConfig:
-        {"signers":[{"addr":"eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","index":0,"group":4},{"addr":"eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","index":1,"group":4},{"addr":"eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","index":2,"group":2},{"addr":"eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","index":3,"group":4},{"addr":"eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","index":4,"group":2},{"addr":"eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","index":5,"group":2},{"addr":"eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","index":6,"group":1},{"addr":"eth:0x34e42200901133bdceb1195f2c5241cb03D06274","index":7,"group":1},{"addr":"eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","index":8,"group":1},{"addr":"eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","index":9,"group":1},{"addr":"eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","index":10,"group":1},{"addr":"eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","index":11,"group":2},{"addr":"eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","index":12,"group":2},{"addr":"eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","index":13,"group":1},{"addr":"eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","index":14,"group":2},{"addr":"eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","index":15,"group":3},{"addr":"eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","index":16,"group":3},{"addr":"eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","index":17,"group":3},{"addr":"eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","index":18,"group":2},{"addr":"eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","index":19,"group":4},{"addr":"eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","index":20,"group":2},{"addr":"eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","index":21,"group":2},{"addr":"eth:0x843742760078Df85609690D85827173A1A96D14a","index":22,"group":1},{"addr":"eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","index":23,"group":1},{"addr":"eth:0x8E0e08E8cbc324310550E195383b7aC200726639","index":24,"group":1},{"addr":"eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","index":25,"group":3},{"addr":"eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","index":26,"group":4},{"addr":"eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","index":27,"group":1},{"addr":"eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","index":28,"group":2},{"addr":"eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","index":29,"group":2},{"addr":"eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","index":30,"group":2},{"addr":"eth:0xd107276078c6605bE0CEC43D765733291B7102aF","index":31,"group":1},{"addr":"eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","index":32,"group":2},{"addr":"eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","index":33,"group":1},{"addr":"eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","index":34,"group":1},{"addr":"eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","index":35,"group":1},{"addr":"eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","index":36,"group":2},{"addr":"eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","index":37,"group":1},{"addr":"eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","index":38,"group":4},{"addr":"eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","index":39,"group":4},{"addr":"eth:0xFccD1128fc823dD78e76240dc206a7A26494F271","index":40,"group":3}],"groupQuorums":[2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"groupParents":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
      values.MAX_NUM_SIGNERS:
-        200
      values.NUM_GROUPS:
-        32
+++ description: Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list.
      values.$members:
+        ["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x8E0e08E8cbc324310550E195383b7aC200726639","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"]
+++ description: Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading.
      values.$threshold:
+        4
+++ description: Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups).
      values.config:
+        {"summary":"Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-15, parent=0, signers=15 | Group 2: 2-of-14, parent=0, signers=14 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7","summaryRoot":"Root: 2-of-4, childGroups=(1,2,3,4)","summaryGroups":"Group 1: 2-of-15, parent=0, signers=15 | Group 2: 2-of-14, parent=0, signers=14 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7","rootQuorum":2,"minSigs":4,"allMembers":["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x8E0e08E8cbc324310550E195383b7aC200726639","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"],"signerGroups":{"root":{"quorum":2,"parent":0,"childGroups":[1,2,3,4],"members":[]},"group1":{"quorum":2,"parent":0,"childGroups":[],"members":["eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x8E0e08E8cbc324310550E195383b7aC200726639","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6"]},"group2":{"quorum":2,"parent":0,"childGroups":[],"members":["eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6"]},"group3":{"quorum":2,"parent":0,"childGroups":[],"members":["eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"]},"group4":{"quorum":2,"parent":0,"childGroups":[],"members":["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29"]}}}
+++ description: Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule.
      values.memberCount:
+        41
+++ description: Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected.
      values.minSigs:
+        4
+++ description: One-line readable form of the full tree-quorum, e.g. "Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...". Exposed as a top-level field so it can be interpolated into the entry's description.
      values.summary:
+        "Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-15, parent=0, signers=15 | Group 2: 2-of-14, parent=0, signers=14 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7"
+++ description: The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description.
      values.summaryGroups:
+        "Group 1: 2-of-15, parent=0, signers=15 | Group 2: 2-of-14, parent=0, signers=14 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7"
+++ description: Just the root-group line of the tree summary (e.g. "Root: 2-of-4, childGroups=(1,2,3,4)"). Always-visible head of the description.
      values.summaryRoot:
+        "Root: 2-of-4, childGroups=(1,2,3,4)"
      description:
+        "Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 4 signatures across 41 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 4-of-41 multisig and is strictly more constrained. Root: 2-of-4, childGroups=(1,2,3,4). [click for per-group breakdown: Group 1: 2-of-15, parent=0, signers=15 | Group 2: 2-of-14, parent=0, signers=14 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7]. The owner can rotate the entire signer tree."
      fieldMeta:
+        {"config":{"description":"Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups)."},"summary":{"description":"One-line readable form of the full tree-quorum, e.g. \"Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...\". Exposed as a top-level field so it can be interpolated into the entry's description."},"summaryRoot":{"description":"Just the root-group line of the tree summary (e.g. \"Root: 2-of-4, childGroups=(1,2,3,4)\"). Always-visible head of the description."},"summaryGroups":{"description":"The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description."},"$threshold":{"description":"Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading."},"$members":{"description":"Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list."},"minSigs":{"description":"Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected."},"memberCount":{"description":"Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule."},"getRoot":{"description":"Currently active Merkle root of pending operations and its expiry timestamp."},"getRootMetadata":{"description":"Metadata of the active root: target chainId and multisig, pre/post op counts, and whether it overrode the previous root."},"getOpCount":{"description":"Monotonic counter of ops executed across all roots. Used to detect skipped ops from the previous root."},"owner":{"severity":"HIGH","type":"PERMISSION"}}
      category:
+        {"name":"Governance","priority":3}
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","delay":10800,"role":".proposerRoleMembers"}]
    }
```

```diff
    contract Router (eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) [transporter/RouterV1_2_0] {
    +++ description: Ethereum CCIP Router for this route. Users call it to send and receive messages from other chains. It dispatches to the appropriate OnRamp or OffRamp based on source or destination chain.
      description:
-        "Ethereum CCIP Router for this route. Users call it to send messages to Arbitrum; trusted Arbitrum OffRamps call it to deliver incoming messages to Ethereum receivers."
+        "Ethereum CCIP Router for this route. Users call it to send and receive messages from other chains. It dispatches to the appropriate OnRamp or OffRamp based on source or destination chain."
      directlyReceivedPermissions.0.description:
-        "route GHO token transfers into and out of this token pool."
+        "route token transfers into and out of this token pool."
      values.arbitrumOffRamp:
-        "eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d"
+++ description: Every Arbitrum-to-Ethereum OffRamp the Router accepts routeMessage() calls from. Multiple OffRamps can be active in parallel during a version migration, all are listed here.
      values.arbitrumOffRamps:
+        ["eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d","eth:0xdf615eF8D4C64d0ED8Fd7824BBEd2f6a10245aC9"]
+++ description: All OnRamp registrations the Router knows about, keyed by destination chain name. Each maps to the OnRamp contract address that ccipSend() will delegate to for that destination. Replayed from OnRampSet events. ignoreRelative is set because the v1.6 architecture uses a single per-chain OnRamp serving all destinations, already walked via arbitrumOnRamp.
      values.onRamps:
+        {"optimism":"eth:0x3455D8E039736944e66e19eAc77a42e8077B07bf","matic":"eth:0x15a9D79d6b3485F70bF82bC49dDD1fcB37A7149c","arbitrum":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","avalanche":"eth:0xaFd31C0C78785aDF53E4c185670bfd5376249d8A","bsc":"eth:0x948306C220Ac325fa9392A6E601042A3CD0b480d","base":"eth:0xb8a882f3B88bd52D1Ff56A873bfDB84b70431937","wemix":"eth:0xdEFeADd30D5BFD403d86245b43e39a73d76423cC","xdai":"eth:0xf50B9A46C394bD98491ce163d420222d8030F6F0","celo":"eth:0x741599d9a5a1bfC40A22f530fbCd85E2718e9F90","mode":"eth:0xeA6d4a24B262aB3e61a8A62f018A30beCD086f82","blast":"eth:0x6751cA96b769129dFE6eB8E349c310deCEDb4e36","andromeda":"eth:0x75d536eED32f4c8Bb39F4B0c992163f5BA49B84e","zksync":"eth:0x9B14AE850653dD0E30fBC93ab7f77D0d638a365B","linea":"eth:0x626189C882A80fF0D036d8D9f6447555e81F78E9","scroll":"eth:0x362A221C3cfd7F992DFE221687323F0BA9BA8187","xlayer":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","polygonzkevm":"eth:0x33417f13DFBC2FfB9e1B43051c3737370F3691a4","astar":"eth:0xD8E8720709a3d9A18a9B281E6148E94149B2E252","zircuit":"eth:0x4Cc3D95d9384D3287724B83099f01BC3025702c0","mantle":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","ronin":"eth:0xdC5b578ff3AFcC4A4a6E149892b9472390b50844","bsquared":"eth:0xddF4b4aF7A9603869C90189EFa8826683D0D234b","worldchain":"eth:0xdB6ebB3ea15595E516dEf4a9875479573a4F19b6","bob":"eth:0x1B960560324c03db5565545B353198fdd07A195d","shibarium":"eth:0x3Ac0D8fe5b4e8d0a95C507CCd83F6A8d73A8c6b1","bitlayer":"eth:0x4FB5407d6911DaA0B8bde58A754E7D01CB8b05c5","corn":"eth:0x7B78f8D16C4ae6E51c29295D58f05dCC67180A2b","soneium":"eth:0x093844Bd4b26792791cD4038e94Bec70f88CaD63","sonic":"eth:0x4fdAaDe22bd05537EeaB204cF7319589CE595D6a","ink":"eth:0xEEe2AE1d0Fa6D1D38BBBa555A7C7B90C8734a8e2","hashkey":"eth:0x61B4B85364a2609177D2C498ff864E01a63148a5","sei":"eth:0x5739E5376702AAc79a53B375ca160EE3C12025E0","treasure":"eth:0x0000000000000000000000000000000000000000","bitcoin-merlin":"eth:0x20fD5ab74D519df395f41c958D982BecB6b64432","berachain":"eth:0xBeFfEF56Cd6FA063d2e04E126cF1b93269886c42","fraxtal":"eth:0x31ee106a4585a796caacC645172B9F7e9c2f8D37","unichain":"eth:0x5E7397CA539C94185BBD950706F0Dd8628587E04","core":"eth:0xa6D806e4EB8726542cf536518fC47f39d68cCb48","hedera":"eth:0x08C798376AfA295C047bDb5c011097865895672d","mind":"eth:0x9cb0FF2Ea9110dc8831b39F620811a0da09747D3","cronos":"eth:0x03CB4C67D01a78F44289541281E57C33E6b834d9","cronos-zkevm":"eth:0x8b858ED23502611aB86109717C8842A7A8f117ec","apechain":"eth:0x48F836a7697c0082B2Ecb4B2639f6da79de21980","lens":"eth:0x6715EA73EcAf1CaE1c736731129637B2E94a6B49","hyperliquid":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","hemi":"eth:0x7d7C4933f17B414f50C97d1a8862A1ace82557B3","abstract":"eth:0x266e520E272FCca3cE46A379a06Dc5ba62717b8F","metal":"eth:0xDAa386621aB173C4E788ecebC4F8c2E6EB016819","lisk":"eth:0x74Cb66502D855992137c5dC8A502c396A6E77931","mint":"eth:0x1Fa3aF677DC1b627f8A57e26b2a55d5F7945F06b","plume":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","superseed":"eth:0x486170Bca7fE5126AFeaF171d3a60A211bF2C44C","zora":"eth:0xc46e2F17c04f2C880Ea56a0c69c4520AdB4aBF88","taiko":"eth:0x5F6e7707DE5019E13BaFbD2f4569B2453F16eB3e","rootstock":"eth:0x34748FbeD8fD8468eD66D53A7D102ce793cB4094","tron":"eth:0x57da0fAD1CC3B98a8f04545A45Ba156e944db4DE","opbnb":"eth:0xffbEC42C001f0E54924078C6D36412128bBC4330","solana":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","botanix":"eth:0x86768e4e4B2E3C1CF812D5C8A7c7becFA4c8D486","neox":"eth:0x4109D281EB5C768556dFF78ba400cE2E3564d5B0","katana":"eth:0xc5Dbe2055Fa233ece44c99432526F3Fc46cA3FC2","etherlink":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","kaia":"eth:0x8469b5AbD81987F9347c0bAbd47b9eB11dA7d0dF","morph":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","aptos":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","monad":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","xdc":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","tac":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","memento":"eth:0x0000000000000000000000000000000000000000","plasma":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","0g":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","bittensor":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","everclear":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","ab":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","henesys":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","jovay":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","stable":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","megaeth":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","sui":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","pharos":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","edge":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","adi":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","ton":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","tempo":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa","creditcoin":"eth:0x913814782144864e523C3FdB78E3ca25D2c2aeCa"}
      fieldMeta.arbitrumOffRamp:
-        {"description":"Arbitrum-to-Ethereum OffRamp allowed to call routeMessage() and deliver messages to Ethereum receivers."}
      fieldMeta.onRamps:
+        {"description":"All OnRamp registrations the Router knows about, keyed by destination chain name. Each maps to the OnRamp contract address that ccipSend() will delegate to for that destination. Replayed from OnRampSet events. ignoreRelative is set because the v1.6 architecture uses a single per-chain OnRamp serving all destinations, already walked via arbitrumOnRamp."}
      fieldMeta.arbitrumOffRamps:
+        {"description":"Every Arbitrum-to-Ethereum OffRamp the Router accepts routeMessage() calls from. Multiple OffRamps can be active in parallel during a version migration, all are listed here."}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"4426351306075016396":"0g","4829375610284793157":"ab","3577778157919314504":"abstract","4059281736450291836":"adi","14894068710063348487":"apechain","4741433654826277614":"aptos","6433500567565415381":"avalanche","1294465214383781161":"berachain","465944652040885897":"opbnb","7937294810946806131":"bitlayer","3849287863852499584":"bob","4560701533377838164":"botanix","5406759801798337480":"bsquared","241851231317828981":"bitcoin-merlin","2135107236357186872":"bittensor","11344663589394136015":"bsc","1346049177634351622":"celo","1224752112135636129":"core","9043146809313071210":"corn","18240105181246962294":"creditcoin","1456215246176062136":"cronos","8788096068760390840":"cronos-zkevm","6325494908023253251":"edge","8805746078405598895":"andromeda","4949039107694359620":"arbitrum","15971525489660198786":"base","7613811247471741961":"hashkey","3461204551265785888":"ink","4627098889531055414":"linea","1556008542357238666":"mantle","7264351850409363825":"mode","3734403246176062136":"optimism","13204309965629103672":"scroll","16468599424800719238":"taiko","1923510103922296319":"unichain","2049429975587534727":"worldchain","3016212468291539606":"xlayer","17198166215261833993":"zircuit","1562403441176082196":"zksync","13624601974233774587":"etherlink","1462016016387883143":"fraxtal","3229138320728879060":"hedera","1804312132722180201":"hemi","2442541497099098535":"hyperliquid","1523760397290643893":"jovay","9813823125703490621":"kaia","5608378062013572713":"lens","15293031020466096408":"lisk","5009297550715157269":"ethereum","4051577828743386545":"matic","6093540873831549674":"megaeth","13447077090413146373":"metal","11690709103138290329":"mind","17164792800244661392":"mint","8481857512324358265":"monad","18164309074156128038":"morph","12657445206920369324":"henesys","7801139999541420232":"pharos","9335212494177455608":"plasma","17912061998839310979":"plume","6422105447186081193":"astar","2459028469735686113":"katana","6916147374840168594":"ronin","11964252391146578476":"rootstock","9027416829622342829":"sei","3993510008929295315":"shibarium","124615329519749607":"solana","12505351618335765396":"soneium","1673871237479749969":"sonic","16978377838628290997":"stable","470401360549526817":"superseed","5936861837188149645":"tac","7281642695469137430":"tempo","16448340667252469081":"ton","5142893604156789321":"wemix","465200170687744372":"xdai","17673274061779414707":"xdc","3555797439612589184":"zora","17529533435026248318":"sui","9762610643973837292":"sui-testnet","6473245816409426016":"memento","9723842205701363942":"everclear","1546563616611573946":"tron","4348158687435793198":"polygonzkevm","4411394078118774322":"blast","5214452172935136222":"treasure","7222032299962346917":"neox"}}]
    }
```

```diff
    contract RMN_Multisig2 (eth:0x806659842cFeEE3CBEF35F8ad2eA42460574b413) [transporter/ManyChainMultiSig] {
    +++ description: Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 2 signatures across 67 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 2-of-67 multisig and is strictly more constrained. Root: 1-of-2, childGroups=(1,2). [click for per-group breakdown: Group 1: 2-of-41, parent=0, signers=41 | Group 2: 6-of-16, parent=0, childGroups=(3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18) | Group 3: 1-of-2, parent=2, signers=2 | Group 4: 1-of-2, parent=2, signers=2 | Group 5: 1-of-2, parent=2, signers=2 | Group 6: 1-of-1, parent=2, signers=1 | Group 7: 1-of-2, parent=2, signers=2 | Group 8: 1-of-1, parent=2, signers=1 | Group 9: 1-of-3, parent=2, signers=3 | Group 10: 1-of-1, parent=2, signers=1 | Group 11: 1-of-1, parent=2, signers=1 | Group 12: 1-of-1, parent=2, signers=1 | Group 13: 1-of-1, parent=2, signers=1 | Group 14: 1-of-3, parent=2, signers=3 | Group 15: 1-of-1, parent=2, signers=1 | Group 16: 1-of-1, parent=2, signers=1 | Group 17: 1-of-2, parent=2, signers=2 | Group 18: 1-of-2, parent=2, signers=2]. The owner can rotate the entire signer tree.
      name:
-        "RMNRemoteOwnerCanceller"
+        "RMN_Multisig2"
      receivedPermissions.0.role:
-        ".CancellerRoleGranted"
+        ".cancellerRoleMembers"
      values.getConfig:
-        {"signers":[{"addr":"eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","index":0,"group":1},{"addr":"eth:0x04189A291cC7E497015B45D4bb046DC0A8258068","index":1,"group":18},{"addr":"eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","index":2,"group":1},{"addr":"eth:0x124BA7e2188074335A0e9b12B449AD5781A73D60","index":3,"group":17},{"addr":"eth:0x146CAe49Dbe1b1D1968fc4652814740706548952","index":4,"group":12},{"addr":"eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","index":5,"group":1},{"addr":"eth:0x180159135c9b93C59d16eA1A690e465D22c5EB67","index":6,"group":3},{"addr":"eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","index":7,"group":1},{"addr":"eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","index":8,"group":1},{"addr":"eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","index":9,"group":1},{"addr":"eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","index":10,"group":1},{"addr":"eth:0x2b73763722378AB2013CB0877946f69fC3727Fd8","index":11,"group":9},{"addr":"eth:0x2B88575011C5E11389ddB50D28d31C7d06B352A0","index":12,"group":16},{"addr":"eth:0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6","index":13,"group":11},{"addr":"eth:0x34e42200901133bdceb1195f2c5241cb03D06274","index":14,"group":1},{"addr":"eth:0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3","index":15,"group":7},{"addr":"eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","index":16,"group":1},{"addr":"eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","index":17,"group":1},{"addr":"eth:0x43640F208956c7D49e04F40FF95dF818643B76aA","index":18,"group":15},{"addr":"eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","index":19,"group":1},{"addr":"eth:0x48A094F7A354d8faD7263EA2a82391d105DF6628","index":20,"group":7},{"addr":"eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","index":21,"group":1},{"addr":"eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","index":22,"group":1},{"addr":"eth:0x4e509C60b3e916644dE441298595FeD12C4AC926","index":23,"group":13},{"addr":"eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","index":24,"group":1},{"addr":"eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","index":25,"group":1},{"addr":"eth:0x570F41d83b1031d382F641B9a532A8D7CBd7a695","index":26,"group":8},{"addr":"eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","index":27,"group":1},{"addr":"eth:0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6","index":28,"group":5},{"addr":"eth:0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8","index":29,"group":5},{"addr":"eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","index":30,"group":1},{"addr":"eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","index":31,"group":1},{"addr":"eth:0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7","index":32,"group":6},{"addr":"eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","index":33,"group":1},{"addr":"eth:0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae","index":34,"group":17},{"addr":"eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","index":35,"group":1},{"addr":"eth:0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5","index":36,"group":14},{"addr":"eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","index":37,"group":1},{"addr":"eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","index":38,"group":1},{"addr":"eth:0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374","index":39,"group":3},{"addr":"eth:0x843742760078Df85609690D85827173A1A96D14a","index":40,"group":1},{"addr":"eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","index":41,"group":1},{"addr":"eth:0x8E0e08E8cbc324310550E195383b7aC200726639","index":42,"group":1},{"addr":"eth:0x9079410666ED02725ee9d148398Cee26397c2A36","index":43,"group":4},{"addr":"eth:0x925d7Ea0ADe586DBFd56a942bb297286cE428C79","index":44,"group":18},{"addr":"eth:0x9453E18f03A36E2A2c70598De520bD24434D2d1D","index":45,"group":14},{"addr":"eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","index":46,"group":1},{"addr":"eth:0xA3177f64efE98422E782bC17BE7971F01187B7cF","index":47,"group":10},{"addr":"eth:0xa35B7219521134cAF52DccAD44d604335b64a4fB","index":48,"group":9},{"addr":"eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","index":49,"group":1},{"addr":"eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","index":50,"group":1},{"addr":"eth:0xb122347811e8E9C89cdbfd761fBc9929F52090B9","index":51,"group":4},{"addr":"eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","index":52,"group":1},{"addr":"eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","index":53,"group":1},{"addr":"eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","index":54,"group":1},{"addr":"eth:0xd107276078c6605bE0CEC43D765733291B7102aF","index":55,"group":1},{"addr":"eth:0xd3094f770579AFd66711847cE9E9C42D10BA2264","index":56,"group":9},{"addr":"eth:0xd3E2da792E806556517124f03F12e557045951E7","index":57,"group":14},{"addr":"eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","index":58,"group":1},{"addr":"eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","index":59,"group":1},{"addr":"eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","index":60,"group":1},{"addr":"eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","index":61,"group":1},{"addr":"eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","index":62,"group":1},{"addr":"eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","index":63,"group":1},{"addr":"eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","index":64,"group":1},{"addr":"eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","index":65,"group":1},{"addr":"eth:0xFccD1128fc823dD78e76240dc206a7A26494F271","index":66,"group":1}],"groupQuorums":[1,2,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],"groupParents":[0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0]}
      values.MAX_NUM_SIGNERS:
-        200
      values.NUM_GROUPS:
-        32
+++ description: Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list.
      values.$members:
+        ["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x04189A291cC7E497015B45D4bb046DC0A8258068","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x124BA7e2188074335A0e9b12B449AD5781A73D60","eth:0x146CAe49Dbe1b1D1968fc4652814740706548952","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x180159135c9b93C59d16eA1A690e465D22c5EB67","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x2b73763722378AB2013CB0877946f69fC3727Fd8","eth:0x2B88575011C5E11389ddB50D28d31C7d06B352A0","eth:0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x43640F208956c7D49e04F40FF95dF818643B76aA","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x48A094F7A354d8faD7263EA2a82391d105DF6628","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x4e509C60b3e916644dE441298595FeD12C4AC926","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x570F41d83b1031d382F641B9a532A8D7CBd7a695","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6","eth:0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x8E0e08E8cbc324310550E195383b7aC200726639","eth:0x9079410666ED02725ee9d148398Cee26397c2A36","eth:0x925d7Ea0ADe586DBFd56a942bb297286cE428C79","eth:0x9453E18f03A36E2A2c70598De520bD24434D2d1D","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xA3177f64efE98422E782bC17BE7971F01187B7cF","eth:0xa35B7219521134cAF52DccAD44d604335b64a4fB","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xb122347811e8E9C89cdbfd761fBc9929F52090B9","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xd3094f770579AFd66711847cE9E9C42D10BA2264","eth:0xd3E2da792E806556517124f03F12e557045951E7","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"]
+++ description: Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading.
      values.$threshold:
+        2
+++ description: Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups).
      values.config:
+        {"summary":"Root: 1-of-2, childGroups=(1,2) | Group 1: 2-of-41, parent=0, signers=41 | Group 2: 6-of-16, parent=0, childGroups=(3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18) | Group 3: 1-of-2, parent=2, signers=2 | Group 4: 1-of-2, parent=2, signers=2 | Group 5: 1-of-2, parent=2, signers=2 | Group 6: 1-of-1, parent=2, signers=1 | Group 7: 1-of-2, parent=2, signers=2 | Group 8: 1-of-1, parent=2, signers=1 | Group 9: 1-of-3, parent=2, signers=3 | Group 10: 1-of-1, parent=2, signers=1 | Group 11: 1-of-1, parent=2, signers=1 | Group 12: 1-of-1, parent=2, signers=1 | Group 13: 1-of-1, parent=2, signers=1 | Group 14: 1-of-3, parent=2, signers=3 | Group 15: 1-of-1, parent=2, signers=1 | Group 16: 1-of-1, parent=2, signers=1 | Group 17: 1-of-2, parent=2, signers=2 | Group 18: 1-of-2, parent=2, signers=2","summaryRoot":"Root: 1-of-2, childGroups=(1,2)","summaryGroups":"Group 1: 2-of-41, parent=0, signers=41 | Group 2: 6-of-16, parent=0, childGroups=(3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18) | Group 3: 1-of-2, parent=2, signers=2 | Group 4: 1-of-2, parent=2, signers=2 | Group 5: 1-of-2, parent=2, signers=2 | Group 6: 1-of-1, parent=2, signers=1 | Group 7: 1-of-2, parent=2, signers=2 | Group 8: 1-of-1, parent=2, signers=1 | Group 9: 1-of-3, parent=2, signers=3 | Group 10: 1-of-1, parent=2, signers=1 | Group 11: 1-of-1, parent=2, signers=1 | Group 12: 1-of-1, parent=2, signers=1 | Group 13: 1-of-1, parent=2, signers=1 | Group 14: 1-of-3, parent=2, signers=3 | Group 15: 1-of-1, parent=2, signers=1 | Group 16: 1-of-1, parent=2, signers=1 | Group 17: 1-of-2, parent=2, signers=2 | Group 18: 1-of-2, parent=2, signers=2","rootQuorum":1,"minSigs":2,"allMembers":["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x04189A291cC7E497015B45D4bb046DC0A8258068","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x124BA7e2188074335A0e9b12B449AD5781A73D60","eth:0x146CAe49Dbe1b1D1968fc4652814740706548952","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x180159135c9b93C59d16eA1A690e465D22c5EB67","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x2b73763722378AB2013CB0877946f69fC3727Fd8","eth:0x2B88575011C5E11389ddB50D28d31C7d06B352A0","eth:0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x43640F208956c7D49e04F40FF95dF818643B76aA","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x48A094F7A354d8faD7263EA2a82391d105DF6628","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x4e509C60b3e916644dE441298595FeD12C4AC926","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x570F41d83b1031d382F641B9a532A8D7CBd7a695","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6","eth:0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x8E0e08E8cbc324310550E195383b7aC200726639","eth:0x9079410666ED02725ee9d148398Cee26397c2A36","eth:0x925d7Ea0ADe586DBFd56a942bb297286cE428C79","eth:0x9453E18f03A36E2A2c70598De520bD24434D2d1D","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xA3177f64efE98422E782bC17BE7971F01187B7cF","eth:0xa35B7219521134cAF52DccAD44d604335b64a4fB","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xb122347811e8E9C89cdbfd761fBc9929F52090B9","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xd3094f770579AFd66711847cE9E9C42D10BA2264","eth:0xd3E2da792E806556517124f03F12e557045951E7","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"],"signerGroups":{"root":{"quorum":1,"parent":0,"childGroups":[1,2],"members":[]},"group1":{"quorum":2,"parent":0,"childGroups":[],"members":["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x8E0e08E8cbc324310550E195383b7aC200726639","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"]},"group2":{"quorum":6,"parent":0,"childGroups":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],"members":[]},"group3":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x180159135c9b93C59d16eA1A690e465D22c5EB67","eth:0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374"]},"group4":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x9079410666ED02725ee9d148398Cee26397c2A36","eth:0xb122347811e8E9C89cdbfd761fBc9929F52090B9"]},"group5":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6","eth:0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8"]},"group6":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7"]},"group7":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3","eth:0x48A094F7A354d8faD7263EA2a82391d105DF6628"]},"group8":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x570F41d83b1031d382F641B9a532A8D7CBd7a695"]},"group9":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x2b73763722378AB2013CB0877946f69fC3727Fd8","eth:0xa35B7219521134cAF52DccAD44d604335b64a4fB","eth:0xd3094f770579AFd66711847cE9E9C42D10BA2264"]},"group10":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0xA3177f64efE98422E782bC17BE7971F01187B7cF"]},"group11":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6"]},"group12":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x146CAe49Dbe1b1D1968fc4652814740706548952"]},"group13":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x4e509C60b3e916644dE441298595FeD12C4AC926"]},"group14":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5","eth:0x9453E18f03A36E2A2c70598De520bD24434D2d1D","eth:0xd3E2da792E806556517124f03F12e557045951E7"]},"group15":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x43640F208956c7D49e04F40FF95dF818643B76aA"]},"group16":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x2B88575011C5E11389ddB50D28d31C7d06B352A0"]},"group17":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x124BA7e2188074335A0e9b12B449AD5781A73D60","eth:0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae"]},"group18":{"quorum":1,"parent":2,"childGroups":[],"members":["eth:0x04189A291cC7E497015B45D4bb046DC0A8258068","eth:0x925d7Ea0ADe586DBFd56a942bb297286cE428C79"]}}}
+++ description: Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule.
      values.memberCount:
+        67
+++ description: Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected.
      values.minSigs:
+        2
+++ description: One-line readable form of the full tree-quorum, e.g. "Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...". Exposed as a top-level field so it can be interpolated into the entry's description.
      values.summary:
+        "Root: 1-of-2, childGroups=(1,2) | Group 1: 2-of-41, parent=0, signers=41 | Group 2: 6-of-16, parent=0, childGroups=(3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18) | Group 3: 1-of-2, parent=2, signers=2 | Group 4: 1-of-2, parent=2, signers=2 | Group 5: 1-of-2, parent=2, signers=2 | Group 6: 1-of-1, parent=2, signers=1 | Group 7: 1-of-2, parent=2, signers=2 | Group 8: 1-of-1, parent=2, signers=1 | Group 9: 1-of-3, parent=2, signers=3 | Group 10: 1-of-1, parent=2, signers=1 | Group 11: 1-of-1, parent=2, signers=1 | Group 12: 1-of-1, parent=2, signers=1 | Group 13: 1-of-1, parent=2, signers=1 | Group 14: 1-of-3, parent=2, signers=3 | Group 15: 1-of-1, parent=2, signers=1 | Group 16: 1-of-1, parent=2, signers=1 | Group 17: 1-of-2, parent=2, signers=2 | Group 18: 1-of-2, parent=2, signers=2"
+++ description: The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description.
      values.summaryGroups:
+        "Group 1: 2-of-41, parent=0, signers=41 | Group 2: 6-of-16, parent=0, childGroups=(3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18) | Group 3: 1-of-2, parent=2, signers=2 | Group 4: 1-of-2, parent=2, signers=2 | Group 5: 1-of-2, parent=2, signers=2 | Group 6: 1-of-1, parent=2, signers=1 | Group 7: 1-of-2, parent=2, signers=2 | Group 8: 1-of-1, parent=2, signers=1 | Group 9: 1-of-3, parent=2, signers=3 | Group 10: 1-of-1, parent=2, signers=1 | Group 11: 1-of-1, parent=2, signers=1 | Group 12: 1-of-1, parent=2, signers=1 | Group 13: 1-of-1, parent=2, signers=1 | Group 14: 1-of-3, parent=2, signers=3 | Group 15: 1-of-1, parent=2, signers=1 | Group 16: 1-of-1, parent=2, signers=1 | Group 17: 1-of-2, parent=2, signers=2 | Group 18: 1-of-2, parent=2, signers=2"
+++ description: Just the root-group line of the tree summary (e.g. "Root: 2-of-4, childGroups=(1,2,3,4)"). Always-visible head of the description.
      values.summaryRoot:
+        "Root: 1-of-2, childGroups=(1,2)"
      description:
+        "Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 2 signatures across 67 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 2-of-67 multisig and is strictly more constrained. Root: 1-of-2, childGroups=(1,2). [click for per-group breakdown: Group 1: 2-of-41, parent=0, signers=41 | Group 2: 6-of-16, parent=0, childGroups=(3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18) | Group 3: 1-of-2, parent=2, signers=2 | Group 4: 1-of-2, parent=2, signers=2 | Group 5: 1-of-2, parent=2, signers=2 | Group 6: 1-of-1, parent=2, signers=1 | Group 7: 1-of-2, parent=2, signers=2 | Group 8: 1-of-1, parent=2, signers=1 | Group 9: 1-of-3, parent=2, signers=3 | Group 10: 1-of-1, parent=2, signers=1 | Group 11: 1-of-1, parent=2, signers=1 | Group 12: 1-of-1, parent=2, signers=1 | Group 13: 1-of-1, parent=2, signers=1 | Group 14: 1-of-3, parent=2, signers=3 | Group 15: 1-of-1, parent=2, signers=1 | Group 16: 1-of-1, parent=2, signers=1 | Group 17: 1-of-2, parent=2, signers=2 | Group 18: 1-of-2, parent=2, signers=2]. The owner can rotate the entire signer tree."
      fieldMeta:
+        {"config":{"description":"Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups)."},"summary":{"description":"One-line readable form of the full tree-quorum, e.g. \"Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...\". Exposed as a top-level field so it can be interpolated into the entry's description."},"summaryRoot":{"description":"Just the root-group line of the tree summary (e.g. \"Root: 2-of-4, childGroups=(1,2,3,4)\"). Always-visible head of the description."},"summaryGroups":{"description":"The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description."},"$threshold":{"description":"Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading."},"$members":{"description":"Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list."},"minSigs":{"description":"Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected."},"memberCount":{"description":"Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule."},"getRoot":{"description":"Currently active Merkle root of pending operations and its expiry timestamp."},"getRootMetadata":{"description":"Metadata of the active root: target chainId and multisig, pre/post op counts, and whether it overrode the previous root."},"getOpCount":{"description":"Monotonic counter of ops executed across all roots. Used to detect skipped ops from the previous root."},"owner":{"severity":"HIGH","type":"PERMISSION"}}
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ARMCallProxy (eth:0x82b8A19497fA25575f250a3DcFfCD2562B575A2e) [transporter/CallProxy] {
    +++ description: Anyone can call this contract to execute scheduled transactions that have passed the delay.
      name:
-        "ARMProxyOwnerExecutor"
+        "ARMCallProxy"
      description:
-        "Public call proxy that forwards any caller to ARMProxyOwner, allowing anyone to execute already-scheduled ARMProxyOwner operations after the timelock delay."
+        "Anyone can call this contract to execute scheduled transactions that have passed the delay."
      receivedPermissions.0.role:
-        ".ExecutorRoleGranted"
+        ".executorRoleMembers"
      values.constructorArgs:
+        {"target":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"}
+++ description: Immutable target contract that every call to this proxy is forwarded to.
      values.target:
+        "eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"
      template:
+        "transporter/CallProxy"
      fieldMeta:
+        {"target":{"description":"Immutable target contract that every call to this proxy is forwarded to."}}
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract RMN_Multisig3 (eth:0x8C00Cc7cC37396e88BbFe66371341a59D1b5771F) [transporter/ManyChainMultiSig] {
    +++ description: Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 5 signatures across 40 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 5-of-40 multisig and is strictly more constrained. Root: 2-of-2, childGroups=(1,2). [click for per-group breakdown: Group 1: 1-of-7, parent=0, signers=7 | Group 2: 2-of-3, parent=0, childGroups=(3,4,5) | Group 3: 2-of-15, parent=2, signers=15 | Group 4: 2-of-13, parent=2, signers=13 | Group 5: 2-of-5, parent=2, signers=5]. The owner can rotate the entire signer tree.
      name:
-        "RMNRemoteOwnerBypasser"
+        "RMN_Multisig3"
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81","description":"block or allow CCIP activity by reporting whether global or route-specific subjects are cursed.","role":".getARM","via":[{"address":"eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20"},{"address":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A"}]}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","description":"execute calls through this timelock without waiting for the configured delay.","role":".bypasserRoleMembers"}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x79bC82F3931A7d017719146A822e4AD8152b157e","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner","via":[{"address":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A"}]}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x806659842cFeEE3CBEF35F8ad2eA42460574b413","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner","via":[{"address":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A"}]}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x8C00Cc7cC37396e88BbFe66371341a59D1b5771F","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner","via":[{"address":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A"}]}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20","description":"curse or uncurse subjects (chains or the global subject), which halts CCIP operations gated by ARMProxy.isCursed checks.","role":".owner","via":[{"address":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A"}]}
      receivedPermissions.0.via:
+        [{"address":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A"}]
      receivedPermissions.0.role:
-        ".BypasserRoleGranted"
+        ".owner"
      receivedPermissions.0.description:
-        "execute calls through this timelock without waiting for the configured delay."
+        "rotate the RMN signer set, fSign threshold, and RMNHome config digest used to approve or block CCIP activity."
      receivedPermissions.0.from:
-        "eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A"
+        "eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20"
      values.getConfig:
-        {"signers":[{"addr":"eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","index":0,"group":1},{"addr":"eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","index":1,"group":1},{"addr":"eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","index":2,"group":4},{"addr":"eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","index":3,"group":1},{"addr":"eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","index":4,"group":4},{"addr":"eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","index":5,"group":4},{"addr":"eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","index":6,"group":3},{"addr":"eth:0x34e42200901133bdceb1195f2c5241cb03D06274","index":7,"group":3},{"addr":"eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","index":8,"group":3},{"addr":"eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","index":9,"group":3},{"addr":"eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","index":10,"group":3},{"addr":"eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","index":11,"group":4},{"addr":"eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","index":12,"group":4},{"addr":"eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","index":13,"group":3},{"addr":"eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","index":14,"group":4},{"addr":"eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","index":15,"group":5},{"addr":"eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","index":16,"group":5},{"addr":"eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","index":17,"group":5},{"addr":"eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","index":18,"group":1},{"addr":"eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","index":19,"group":4},{"addr":"eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","index":20,"group":4},{"addr":"eth:0x843742760078Df85609690D85827173A1A96D14a","index":21,"group":3},{"addr":"eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","index":22,"group":3},{"addr":"eth:0x8E0e08E8cbc324310550E195383b7aC200726639","index":23,"group":3},{"addr":"eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","index":24,"group":5},{"addr":"eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","index":25,"group":1},{"addr":"eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","index":26,"group":3},{"addr":"eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","index":27,"group":4},{"addr":"eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","index":28,"group":4},{"addr":"eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","index":29,"group":4},{"addr":"eth:0xd107276078c6605bE0CEC43D765733291B7102aF","index":30,"group":3},{"addr":"eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","index":31,"group":4},{"addr":"eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","index":32,"group":3},{"addr":"eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","index":33,"group":3},{"addr":"eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","index":34,"group":3},{"addr":"eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","index":35,"group":4},{"addr":"eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","index":36,"group":3},{"addr":"eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","index":37,"group":1},{"addr":"eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","index":38,"group":1},{"addr":"eth:0xFccD1128fc823dD78e76240dc206a7A26494F271","index":39,"group":5}],"groupQuorums":[2,1,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"groupParents":[0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
      values.MAX_NUM_SIGNERS:
-        200
      values.NUM_GROUPS:
-        32
+++ description: Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list.
      values.$members:
+        ["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x8E0e08E8cbc324310550E195383b7aC200726639","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"]
+++ description: Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading.
      values.$threshold:
+        5
+++ description: Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups).
      values.config:
+        {"summary":"Root: 2-of-2, childGroups=(1,2) | Group 1: 1-of-7, parent=0, signers=7 | Group 2: 2-of-3, parent=0, childGroups=(3,4,5) | Group 3: 2-of-15, parent=2, signers=15 | Group 4: 2-of-13, parent=2, signers=13 | Group 5: 2-of-5, parent=2, signers=5","summaryRoot":"Root: 2-of-2, childGroups=(1,2)","summaryGroups":"Group 1: 1-of-7, parent=0, signers=7 | Group 2: 2-of-3, parent=0, childGroups=(3,4,5) | Group 3: 2-of-15, parent=2, signers=15 | Group 4: 2-of-13, parent=2, signers=13 | Group 5: 2-of-5, parent=2, signers=5","rootQuorum":2,"minSigs":5,"allMembers":["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x8E0e08E8cbc324310550E195383b7aC200726639","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"],"signerGroups":{"root":{"quorum":2,"parent":0,"childGroups":[1,2],"members":[]},"group1":{"quorum":1,"parent":0,"childGroups":[],"members":["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29"]},"group2":{"quorum":2,"parent":0,"childGroups":[3,4,5],"members":[]},"group3":{"quorum":2,"parent":2,"childGroups":[],"members":["eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x8E0e08E8cbc324310550E195383b7aC200726639","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6"]},"group4":{"quorum":2,"parent":2,"childGroups":[],"members":["eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6"]},"group5":{"quorum":2,"parent":2,"childGroups":[],"members":["eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"]}}}
+++ description: Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule.
      values.memberCount:
+        40
+++ description: Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected.
      values.minSigs:
+        5
+++ description: One-line readable form of the full tree-quorum, e.g. "Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...". Exposed as a top-level field so it can be interpolated into the entry's description.
      values.summary:
+        "Root: 2-of-2, childGroups=(1,2) | Group 1: 1-of-7, parent=0, signers=7 | Group 2: 2-of-3, parent=0, childGroups=(3,4,5) | Group 3: 2-of-15, parent=2, signers=15 | Group 4: 2-of-13, parent=2, signers=13 | Group 5: 2-of-5, parent=2, signers=5"
+++ description: The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description.
      values.summaryGroups:
+        "Group 1: 1-of-7, parent=0, signers=7 | Group 2: 2-of-3, parent=0, childGroups=(3,4,5) | Group 3: 2-of-15, parent=2, signers=15 | Group 4: 2-of-13, parent=2, signers=13 | Group 5: 2-of-5, parent=2, signers=5"
+++ description: Just the root-group line of the tree summary (e.g. "Root: 2-of-4, childGroups=(1,2,3,4)"). Always-visible head of the description.
      values.summaryRoot:
+        "Root: 2-of-2, childGroups=(1,2)"
      description:
+        "Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 5 signatures across 40 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 5-of-40 multisig and is strictly more constrained. Root: 2-of-2, childGroups=(1,2). [click for per-group breakdown: Group 1: 1-of-7, parent=0, signers=7 | Group 2: 2-of-3, parent=0, childGroups=(3,4,5) | Group 3: 2-of-15, parent=2, signers=15 | Group 4: 2-of-13, parent=2, signers=13 | Group 5: 2-of-5, parent=2, signers=5]. The owner can rotate the entire signer tree."
      fieldMeta:
+        {"config":{"description":"Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups)."},"summary":{"description":"One-line readable form of the full tree-quorum, e.g. \"Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...\". Exposed as a top-level field so it can be interpolated into the entry's description."},"summaryRoot":{"description":"Just the root-group line of the tree summary (e.g. \"Root: 2-of-4, childGroups=(1,2,3,4)\"). Always-visible head of the description."},"summaryGroups":{"description":"The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description."},"$threshold":{"description":"Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading."},"$members":{"description":"Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list."},"minSigs":{"description":"Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected."},"memberCount":{"description":"Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule."},"getRoot":{"description":"Currently active Merkle root of pending operations and its expiry timestamp."},"getRootMetadata":{"description":"Metadata of the active root: target chainId and multisig, pre/post op counts, and whether it overrode the previous root."},"getOpCount":{"description":"Monotonic counter of ops executed across all roots. Used to detect skipped ops from the previous root."},"owner":{"severity":"HIGH","type":"PERMISSION"}}
      category:
+        {"name":"Governance","priority":3}
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","role":".bypasserRoleMembers"}]
    }
```

```diff
-   Status: DELETED
    contract PriceRegistry (eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad) [transporter/PriceRegistry]
    +++ description: PriceRegistry used by the OnRamp and CommitStore to price fees, tokens, and gas for this route.
```

```diff
-   Status: DELETED
    contract ArbitrumToEthereumCommitStore (eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749) [transporter/CommitStoreV1]
    +++ description: Arbitrum-to-Ethereum CommitStore. Its OCR commit reports publish Merkle roots for source messages; execution is possible only for leaves under roots that are both committed here and blessed by RMN through the ARM proxy.
```

```diff
    contract ARM_Multisig3 (eth:0xAD97C0270a243270136E40278155C12ce7C7F87B) [transporter/ManyChainMultiSig] {
    +++ description: Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 2 signatures across 67 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 2-of-67 multisig and is strictly more constrained. Root: 1-of-3, childGroups=(1,2,3). [click for per-group breakdown: Group 1: 4-of-31, parent=0, signers=31 | Group 2: 2-of-7, parent=0, signers=7 | Group 3: 6-of-16, parent=0, childGroups=(4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19) | Group 4: 1-of-2, parent=3, signers=2 | Group 5: 1-of-2, parent=3, signers=2 | Group 6: 1-of-2, parent=3, signers=2 | Group 7: 1-of-1, parent=3, signers=1 | Group 8: 1-of-2, parent=3, signers=2 | Group 9: 1-of-2, parent=3, signers=2 | Group 10: 1-of-4, parent=3, signers=4 | Group 11: 1-of-1, parent=3, signers=1 | Group 12: 1-of-1, parent=3, signers=1 | Group 13: 1-of-1, parent=3, signers=1 | Group 14: 1-of-1, parent=3, signers=1 | Group 15: 1-of-3, parent=3, signers=3 | Group 16: 1-of-1, parent=3, signers=1 | Group 17: 1-of-1, parent=3, signers=1 | Group 18: 1-of-3, parent=3, signers=3 | Group 19: 1-of-2, parent=3, signers=2]. The owner can rotate the entire signer tree.
      name:
-        "ARMProxyOwnerCanceller"
+        "ARM_Multisig3"
      receivedPermissions.0.role:
-        ".CancellerRoleGranted"
+        ".cancellerRoleMembers"
      values.getConfig:
-        {"signers":[{"addr":"eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","index":0,"group":2},{"addr":"eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","index":1,"group":2},{"addr":"eth:0x124BA7e2188074335A0e9b12B449AD5781A73D60","index":2,"group":18},{"addr":"eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","index":3,"group":1},{"addr":"eth:0x1620E85235C124303d03671b5de5ca12249a16BF","index":4,"group":15},{"addr":"eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","index":5,"group":2},{"addr":"eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","index":6,"group":1},{"addr":"eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","index":7,"group":1},{"addr":"eth:0x266a433524AF2a471D381D8Ad4ad70DDAA5dC112","index":8,"group":9},{"addr":"eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","index":9,"group":1},{"addr":"eth:0x2b73763722378AB2013CB0877946f69fC3727Fd8","index":10,"group":10},{"addr":"eth:0x2B88575011C5E11389ddB50D28d31C7d06B352A0","index":11,"group":17},{"addr":"eth:0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6","index":12,"group":12},{"addr":"eth:0x34e42200901133bdceb1195f2c5241cb03D06274","index":13,"group":1},{"addr":"eth:0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3","index":14,"group":8},{"addr":"eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","index":15,"group":1},{"addr":"eth:0x4189a291cC7E497015B45D4bb046dC0A82580688","index":16,"group":19},{"addr":"eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","index":17,"group":1},{"addr":"eth:0x43640F208956c7D49e04F40FF95dF818643B76aA","index":18,"group":16},{"addr":"eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","index":19,"group":1},{"addr":"eth:0x48A094F7A354d8faD7263EA2a82391d105DF6628","index":20,"group":8},{"addr":"eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","index":21,"group":1},{"addr":"eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","index":22,"group":1},{"addr":"eth:0x4e509C60b3e916644dE441298595FeD12C4AC926","index":23,"group":14},{"addr":"eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","index":24,"group":1},{"addr":"eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","index":25,"group":1},{"addr":"eth:0x570F41d83b1031d382F641B9a532A8D7CBd7a695","index":26,"group":9},{"addr":"eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","index":27,"group":1},{"addr":"eth:0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6","index":28,"group":6},{"addr":"eth:0x5BF2821B248e85439B5d7c5a2bcB055Eb54Ad29F","index":29,"group":13},{"addr":"eth:0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8","index":30,"group":6},{"addr":"eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","index":31,"group":1},{"addr":"eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","index":32,"group":1},{"addr":"eth:0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7","index":33,"group":7},{"addr":"eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","index":34,"group":1},{"addr":"eth:0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae","index":35,"group":18},{"addr":"eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","index":36,"group":2},{"addr":"eth:0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5","index":37,"group":15},{"addr":"eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","index":38,"group":1},{"addr":"eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","index":39,"group":1},{"addr":"eth:0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374","index":40,"group":4},{"addr":"eth:0x843742760078Df85609690D85827173A1A96D14a","index":41,"group":1},{"addr":"eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","index":42,"group":1},{"addr":"eth:0x9079410666ED02725ee9d148398Cee26397c2A36","index":43,"group":5},{"addr":"eth:0x925d7Ea0ADe586DBFd56a942bb297286cE428C79","index":44,"group":19},{"addr":"eth:0x9453E18f03A36E2A2c70598De520bD24434D2d1D","index":45,"group":15},{"addr":"eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","index":46,"group":1},{"addr":"eth:0xA3177f64efE98422E782bC17BE7971F01187B7cF","index":47,"group":11},{"addr":"eth:0xa35B7219521134cAF52DccAD44d604335b64a4fB","index":48,"group":10},{"addr":"eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","index":49,"group":2},{"addr":"eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","index":50,"group":1},{"addr":"eth:0xa85936633588Fc7a120061CA973e65cE83839F87","index":51,"group":18},{"addr":"eth:0xb122347811e8E9C89cdbfd761fBc9929F52090B9","index":52,"group":5},{"addr":"eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","index":53,"group":1},{"addr":"eth:0xC6fA4C71F42dD1881E29DDe853FA5CcD18A59624","index":54,"group":10},{"addr":"eth:0xd107276078c6605bE0CEC43D765733291B7102aF","index":55,"group":1},{"addr":"eth:0xd3094f770579AFd66711847cE9E9C42D10BA2264","index":56,"group":10},{"addr":"eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","index":57,"group":1},{"addr":"eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","index":58,"group":1},{"addr":"eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","index":59,"group":1},{"addr":"eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","index":60,"group":1},{"addr":"eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","index":61,"group":1},{"addr":"eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","index":62,"group":1},{"addr":"eth:0xF721cEFDBD939Ba732E145817Dca810e6064c4b7","index":63,"group":4},{"addr":"eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","index":64,"group":2},{"addr":"eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","index":65,"group":2},{"addr":"eth:0xFccD1128fc823dD78e76240dc206a7A26494F271","index":66,"group":1}],"groupQuorums":[1,4,2,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],"groupParents":[0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0]}
      values.MAX_NUM_SIGNERS:
-        200
      values.NUM_GROUPS:
-        32
+++ description: Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list.
      values.$members:
+        ["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x124BA7e2188074335A0e9b12B449AD5781A73D60","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1620E85235C124303d03671b5de5ca12249a16BF","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x266a433524AF2a471D381D8Ad4ad70DDAA5dC112","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x2b73763722378AB2013CB0877946f69fC3727Fd8","eth:0x2B88575011C5E11389ddB50D28d31C7d06B352A0","eth:0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x4189a291cC7E497015B45D4bb046dC0A82580688","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x43640F208956c7D49e04F40FF95dF818643B76aA","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x48A094F7A354d8faD7263EA2a82391d105DF6628","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x4e509C60b3e916644dE441298595FeD12C4AC926","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x570F41d83b1031d382F641B9a532A8D7CBd7a695","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6","eth:0x5BF2821B248e85439B5d7c5a2bcB055Eb54Ad29F","eth:0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x9079410666ED02725ee9d148398Cee26397c2A36","eth:0x925d7Ea0ADe586DBFd56a942bb297286cE428C79","eth:0x9453E18f03A36E2A2c70598De520bD24434D2d1D","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xA3177f64efE98422E782bC17BE7971F01187B7cF","eth:0xa35B7219521134cAF52DccAD44d604335b64a4fB","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xa85936633588Fc7a120061CA973e65cE83839F87","eth:0xb122347811e8E9C89cdbfd761fBc9929F52090B9","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xC6fA4C71F42dD1881E29DDe853FA5CcD18A59624","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xd3094f770579AFd66711847cE9E9C42D10BA2264","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xF721cEFDBD939Ba732E145817Dca810e6064c4b7","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"]
+++ description: Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading.
      values.$threshold:
+        2
+++ description: Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups).
      values.config:
+        {"summary":"Root: 1-of-3, childGroups=(1,2,3) | Group 1: 4-of-31, parent=0, signers=31 | Group 2: 2-of-7, parent=0, signers=7 | Group 3: 6-of-16, parent=0, childGroups=(4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19) | Group 4: 1-of-2, parent=3, signers=2 | Group 5: 1-of-2, parent=3, signers=2 | Group 6: 1-of-2, parent=3, signers=2 | Group 7: 1-of-1, parent=3, signers=1 | Group 8: 1-of-2, parent=3, signers=2 | Group 9: 1-of-2, parent=3, signers=2 | Group 10: 1-of-4, parent=3, signers=4 | Group 11: 1-of-1, parent=3, signers=1 | Group 12: 1-of-1, parent=3, signers=1 | Group 13: 1-of-1, parent=3, signers=1 | Group 14: 1-of-1, parent=3, signers=1 | Group 15: 1-of-3, parent=3, signers=3 | Group 16: 1-of-1, parent=3, signers=1 | Group 17: 1-of-1, parent=3, signers=1 | Group 18: 1-of-3, parent=3, signers=3 | Group 19: 1-of-2, parent=3, signers=2","summaryRoot":"Root: 1-of-3, childGroups=(1,2,3)","summaryGroups":"Group 1: 4-of-31, parent=0, signers=31 | Group 2: 2-of-7, parent=0, signers=7 | Group 3: 6-of-16, parent=0, childGroups=(4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19) | Group 4: 1-of-2, parent=3, signers=2 | Group 5: 1-of-2, parent=3, signers=2 | Group 6: 1-of-2, parent=3, signers=2 | Group 7: 1-of-1, parent=3, signers=1 | Group 8: 1-of-2, parent=3, signers=2 | Group 9: 1-of-2, parent=3, signers=2 | Group 10: 1-of-4, parent=3, signers=4 | Group 11: 1-of-1, parent=3, signers=1 | Group 12: 1-of-1, parent=3, signers=1 | Group 13: 1-of-1, parent=3, signers=1 | Group 14: 1-of-1, parent=3, signers=1 | Group 15: 1-of-3, parent=3, signers=3 | Group 16: 1-of-1, parent=3, signers=1 | Group 17: 1-of-1, parent=3, signers=1 | Group 18: 1-of-3, parent=3, signers=3 | Group 19: 1-of-2, parent=3, signers=2","rootQuorum":1,"minSigs":2,"allMembers":["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x124BA7e2188074335A0e9b12B449AD5781A73D60","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1620E85235C124303d03671b5de5ca12249a16BF","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x266a433524AF2a471D381D8Ad4ad70DDAA5dC112","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x2b73763722378AB2013CB0877946f69fC3727Fd8","eth:0x2B88575011C5E11389ddB50D28d31C7d06B352A0","eth:0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x4189a291cC7E497015B45D4bb046dC0A82580688","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x43640F208956c7D49e04F40FF95dF818643B76aA","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x48A094F7A354d8faD7263EA2a82391d105DF6628","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x4e509C60b3e916644dE441298595FeD12C4AC926","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x570F41d83b1031d382F641B9a532A8D7CBd7a695","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6","eth:0x5BF2821B248e85439B5d7c5a2bcB055Eb54Ad29F","eth:0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x9079410666ED02725ee9d148398Cee26397c2A36","eth:0x925d7Ea0ADe586DBFd56a942bb297286cE428C79","eth:0x9453E18f03A36E2A2c70598De520bD24434D2d1D","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xA3177f64efE98422E782bC17BE7971F01187B7cF","eth:0xa35B7219521134cAF52DccAD44d604335b64a4fB","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xa85936633588Fc7a120061CA973e65cE83839F87","eth:0xb122347811e8E9C89cdbfd761fBc9929F52090B9","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xC6fA4C71F42dD1881E29DDe853FA5CcD18A59624","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xd3094f770579AFd66711847cE9E9C42D10BA2264","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xF721cEFDBD939Ba732E145817Dca810e6064c4b7","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"],"signerGroups":{"root":{"quorum":1,"parent":0,"childGroups":[1,2,3],"members":[]},"group1":{"quorum":4,"parent":0,"childGroups":[],"members":["eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"]},"group2":{"quorum":2,"parent":0,"childGroups":[],"members":["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29"]},"group3":{"quorum":6,"parent":0,"childGroups":[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"members":[]},"group4":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x7eFF312905DEdB38Bf8f07BEFaDfF96376154374","eth:0xF721cEFDBD939Ba732E145817Dca810e6064c4b7"]},"group5":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x9079410666ED02725ee9d148398Cee26397c2A36","eth:0xb122347811e8E9C89cdbfd761fBc9929F52090B9"]},"group6":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x5bD3a90E94bB8aA6fE6cCF494e292F5F707B92d6","eth:0x5C33Bf560f29e04dF8A666493aAD8E47eEa9B1c8"]},"group7":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x6924E54339C7f28730dBB4B842a7FE86ED01Ecf7"]},"group8":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x3C6cE61b611e3b41289c2FAFA5BC4e150dD88dE3","eth:0x48A094F7A354d8faD7263EA2a82391d105DF6628"]},"group9":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x266a433524AF2a471D381D8Ad4ad70DDAA5dC112","eth:0x570F41d83b1031d382F641B9a532A8D7CBd7a695"]},"group10":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x2b73763722378AB2013CB0877946f69fC3727Fd8","eth:0xa35B7219521134cAF52DccAD44d604335b64a4fB","eth:0xC6fA4C71F42dD1881E29DDe853FA5CcD18A59624","eth:0xd3094f770579AFd66711847cE9E9C42D10BA2264"]},"group11":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0xA3177f64efE98422E782bC17BE7971F01187B7cF"]},"group12":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x2bbB172cD88dCAD64CBE762dcC53E6f96a17d1D6"]},"group13":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x5BF2821B248e85439B5d7c5a2bcB055Eb54Ad29F"]},"group14":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x4e509C60b3e916644dE441298595FeD12C4AC926"]},"group15":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x1620E85235C124303d03671b5de5ca12249a16BF","eth:0x70C2Ddc97c4fAea760027d45E5de4D1E2ad2b9A5","eth:0x9453E18f03A36E2A2c70598De520bD24434D2d1D"]},"group16":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x43640F208956c7D49e04F40FF95dF818643B76aA"]},"group17":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x2B88575011C5E11389ddB50D28d31C7d06B352A0"]},"group18":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x124BA7e2188074335A0e9b12B449AD5781A73D60","eth:0x6B0f508B8cbeF970fAF9E8a28b9b4C6F1FD3afae","eth:0xa85936633588Fc7a120061CA973e65cE83839F87"]},"group19":{"quorum":1,"parent":3,"childGroups":[],"members":["eth:0x4189a291cC7E497015B45D4bb046dC0A82580688","eth:0x925d7Ea0ADe586DBFd56a942bb297286cE428C79"]}}}
+++ description: Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule.
      values.memberCount:
+        67
+++ description: Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected.
      values.minSigs:
+        2
+++ description: One-line readable form of the full tree-quorum, e.g. "Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...". Exposed as a top-level field so it can be interpolated into the entry's description.
      values.summary:
+        "Root: 1-of-3, childGroups=(1,2,3) | Group 1: 4-of-31, parent=0, signers=31 | Group 2: 2-of-7, parent=0, signers=7 | Group 3: 6-of-16, parent=0, childGroups=(4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19) | Group 4: 1-of-2, parent=3, signers=2 | Group 5: 1-of-2, parent=3, signers=2 | Group 6: 1-of-2, parent=3, signers=2 | Group 7: 1-of-1, parent=3, signers=1 | Group 8: 1-of-2, parent=3, signers=2 | Group 9: 1-of-2, parent=3, signers=2 | Group 10: 1-of-4, parent=3, signers=4 | Group 11: 1-of-1, parent=3, signers=1 | Group 12: 1-of-1, parent=3, signers=1 | Group 13: 1-of-1, parent=3, signers=1 | Group 14: 1-of-1, parent=3, signers=1 | Group 15: 1-of-3, parent=3, signers=3 | Group 16: 1-of-1, parent=3, signers=1 | Group 17: 1-of-1, parent=3, signers=1 | Group 18: 1-of-3, parent=3, signers=3 | Group 19: 1-of-2, parent=3, signers=2"
+++ description: The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description.
      values.summaryGroups:
+        "Group 1: 4-of-31, parent=0, signers=31 | Group 2: 2-of-7, parent=0, signers=7 | Group 3: 6-of-16, parent=0, childGroups=(4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19) | Group 4: 1-of-2, parent=3, signers=2 | Group 5: 1-of-2, parent=3, signers=2 | Group 6: 1-of-2, parent=3, signers=2 | Group 7: 1-of-1, parent=3, signers=1 | Group 8: 1-of-2, parent=3, signers=2 | Group 9: 1-of-2, parent=3, signers=2 | Group 10: 1-of-4, parent=3, signers=4 | Group 11: 1-of-1, parent=3, signers=1 | Group 12: 1-of-1, parent=3, signers=1 | Group 13: 1-of-1, parent=3, signers=1 | Group 14: 1-of-1, parent=3, signers=1 | Group 15: 1-of-3, parent=3, signers=3 | Group 16: 1-of-1, parent=3, signers=1 | Group 17: 1-of-1, parent=3, signers=1 | Group 18: 1-of-3, parent=3, signers=3 | Group 19: 1-of-2, parent=3, signers=2"
+++ description: Just the root-group line of the tree summary (e.g. "Root: 2-of-4, childGroups=(1,2,3,4)"). Always-visible head of the description.
      values.summaryRoot:
+        "Root: 1-of-3, childGroups=(1,2,3)"
      description:
+        "Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 2 signatures across 67 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 2-of-67 multisig and is strictly more constrained. Root: 1-of-3, childGroups=(1,2,3). [click for per-group breakdown: Group 1: 4-of-31, parent=0, signers=31 | Group 2: 2-of-7, parent=0, signers=7 | Group 3: 6-of-16, parent=0, childGroups=(4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19) | Group 4: 1-of-2, parent=3, signers=2 | Group 5: 1-of-2, parent=3, signers=2 | Group 6: 1-of-2, parent=3, signers=2 | Group 7: 1-of-1, parent=3, signers=1 | Group 8: 1-of-2, parent=3, signers=2 | Group 9: 1-of-2, parent=3, signers=2 | Group 10: 1-of-4, parent=3, signers=4 | Group 11: 1-of-1, parent=3, signers=1 | Group 12: 1-of-1, parent=3, signers=1 | Group 13: 1-of-1, parent=3, signers=1 | Group 14: 1-of-1, parent=3, signers=1 | Group 15: 1-of-3, parent=3, signers=3 | Group 16: 1-of-1, parent=3, signers=1 | Group 17: 1-of-1, parent=3, signers=1 | Group 18: 1-of-3, parent=3, signers=3 | Group 19: 1-of-2, parent=3, signers=2]. The owner can rotate the entire signer tree."
      fieldMeta:
+        {"config":{"description":"Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups)."},"summary":{"description":"One-line readable form of the full tree-quorum, e.g. \"Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...\". Exposed as a top-level field so it can be interpolated into the entry's description."},"summaryRoot":{"description":"Just the root-group line of the tree summary (e.g. \"Root: 2-of-4, childGroups=(1,2,3,4)\"). Always-visible head of the description."},"summaryGroups":{"description":"The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description."},"$threshold":{"description":"Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading."},"$members":{"description":"Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list."},"minSigs":{"description":"Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected."},"memberCount":{"description":"Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule."},"getRoot":{"description":"Currently active Merkle root of pending operations and its expiry timestamp."},"getRootMetadata":{"description":"Metadata of the active root: target chainId and multisig, pre/post op counts, and whether it overrode the previous root."},"getOpCount":{"description":"Monotonic counter of ops executed across all roots. Used to detect skipped ops from the previous root."},"owner":{"severity":"HIGH","type":"PERMISSION"}}
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
-   Status: DELETED
    contract GhoCcipSteward (eth:0xC5BcC58BE6172769ca1a78B8A45752E3C5059c39) [N/A]
    +++ description: Aave GHO CCIP steward. It can update bridge and rate limits for the GHO Ethereum token pool only when called by the Aave Risk Council.
```

```diff
    contract ARM_GnosisSafe (eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf) [GnosisSafe] {
    +++ description: None
      name:
-        "ARMProxyOwnerGnosisSafe"
+        "ARM_GnosisSafe"
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81","description":"replace the active ARM/RMN contract used for CCIP safety checks.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"cancel scheduled operations before they are executed.","role":".cancellerRoleMembers"}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"grant or revoke roles on this timelock.","role":".adminRoleMembers","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"schedule operations that can be executed after the configured timelock delay.","role":".proposerRoleMembers"}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","description":"grant or revoke roles on this timelock.","role":".adminRoleMembers","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.6:
+        {"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"add, remove, or replace OnRamps and OffRamps used by the Router.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.7:
+        {"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"change the wrapped native token used for native-fee payments.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.8:
+        {"permission":"interact","from":"eth:0xAD97C0270a243270136E40278155C12ce7C7F87B","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.0.via:
+        [{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]
      receivedPermissions.0.role:
-        ".CancellerRoleGranted"
+        ".owner"
      receivedPermissions.0.description:
-        "cancel scheduled operations before they are executed."
+        "rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root."
      receivedPermissions.0.from:
-        "eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"
+        "eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e"
      receivedPermissions.1.via:
+        [{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]
      receivedPermissions.1.role:
-        ".ProposerRoleGranted"
+        ".owner"
      receivedPermissions.1.description:
-        "schedule operations that can be executed after the configured timelock delay."
+        "rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root."
      receivedPermissions.1.from:
-        "eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"
+        "eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F"
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800,"role":".proposerRoleMembers"}]
    }
```

```diff
    contract ARM_Multisig1 (eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e) [transporter/ManyChainMultiSig] {
    +++ description: Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 4 signatures across 38 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 4-of-38 multisig and is strictly more constrained. Root: 2-of-4, childGroups=(1,2,3,4). [click for per-group breakdown: Group 1: 2-of-14, parent=0, signers=14 | Group 2: 2-of-12, parent=0, signers=12 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7]. The owner can rotate the entire signer tree.
      name:
-        "ARMProxyOwnerProposer"
+        "ARM_Multisig1"
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81","description":"replace the active ARM/RMN contract used for CCIP safety checks.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"cancel scheduled operations before they are executed.","role":".cancellerRoleMembers"}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"grant or revoke roles on this timelock.","role":".adminRoleMembers","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"schedule operations that can be executed after the configured timelock delay.","role":".proposerRoleMembers"}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","description":"grant or revoke roles on this timelock.","role":".adminRoleMembers","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.6:
+        {"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"add, remove, or replace OnRamps and OffRamps used by the Router.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.7:
+        {"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"change the wrapped native token used for native-fee payments.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.8:
+        {"permission":"interact","from":"eth:0xAD97C0270a243270136E40278155C12ce7C7F87B","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.0.via:
+        [{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]
      receivedPermissions.0.role:
-        ".CancellerRoleGranted"
+        ".owner"
      receivedPermissions.0.description:
-        "cancel scheduled operations before they are executed."
+        "rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root."
      receivedPermissions.0.from:
-        "eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"
+        "eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e"
      receivedPermissions.1.via:
+        [{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]
      receivedPermissions.1.role:
-        ".ProposerRoleGranted"
+        ".owner"
      receivedPermissions.1.description:
-        "schedule operations that can be executed after the configured timelock delay."
+        "rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root."
      receivedPermissions.1.from:
-        "eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"
+        "eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F"
      values.getConfig:
-        {"signers":[{"addr":"eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","index":0,"group":4},{"addr":"eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","index":1,"group":4},{"addr":"eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","index":2,"group":2},{"addr":"eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","index":3,"group":4},{"addr":"eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","index":4,"group":2},{"addr":"eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","index":5,"group":2},{"addr":"eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","index":6,"group":1},{"addr":"eth:0x34e42200901133bdceb1195f2c5241cb03D06274","index":7,"group":1},{"addr":"eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","index":8,"group":1},{"addr":"eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","index":9,"group":1},{"addr":"eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","index":10,"group":1},{"addr":"eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","index":11,"group":2},{"addr":"eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","index":12,"group":2},{"addr":"eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","index":13,"group":1},{"addr":"eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","index":14,"group":2},{"addr":"eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","index":15,"group":3},{"addr":"eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","index":16,"group":3},{"addr":"eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","index":17,"group":3},{"addr":"eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","index":18,"group":2},{"addr":"eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","index":19,"group":4},{"addr":"eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","index":20,"group":2},{"addr":"eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","index":21,"group":2},{"addr":"eth:0x843742760078Df85609690D85827173A1A96D14a","index":22,"group":1},{"addr":"eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","index":23,"group":1},{"addr":"eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","index":24,"group":3},{"addr":"eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","index":25,"group":4},{"addr":"eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","index":26,"group":1},{"addr":"eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","index":27,"group":2},{"addr":"eth:0xd107276078c6605bE0CEC43D765733291B7102aF","index":28,"group":1},{"addr":"eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","index":29,"group":2},{"addr":"eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","index":30,"group":1},{"addr":"eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","index":31,"group":1},{"addr":"eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","index":32,"group":1},{"addr":"eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","index":33,"group":2},{"addr":"eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","index":34,"group":1},{"addr":"eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","index":35,"group":4},{"addr":"eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","index":36,"group":4},{"addr":"eth:0xFccD1128fc823dD78e76240dc206a7A26494F271","index":37,"group":3}],"groupQuorums":[2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"groupParents":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
      values.MAX_NUM_SIGNERS:
-        200
      values.NUM_GROUPS:
-        32
+++ description: Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list.
      values.$members:
+        ["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"]
+++ description: Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading.
      values.$threshold:
+        4
+++ description: Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups).
      values.config:
+        {"summary":"Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, parent=0, signers=14 | Group 2: 2-of-12, parent=0, signers=12 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7","summaryRoot":"Root: 2-of-4, childGroups=(1,2,3,4)","summaryGroups":"Group 1: 2-of-14, parent=0, signers=14 | Group 2: 2-of-12, parent=0, signers=12 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7","rootQuorum":2,"minSigs":4,"allMembers":["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"],"signerGroups":{"root":{"quorum":2,"parent":0,"childGroups":[1,2,3,4],"members":[]},"group1":{"quorum":2,"parent":0,"childGroups":[],"members":["eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6"]},"group2":{"quorum":2,"parent":0,"childGroups":[],"members":["eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6"]},"group3":{"quorum":2,"parent":0,"childGroups":[],"members":["eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"]},"group4":{"quorum":2,"parent":0,"childGroups":[],"members":["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29"]}}}
+++ description: Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule.
      values.memberCount:
+        38
+++ description: Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected.
      values.minSigs:
+        4
+++ description: One-line readable form of the full tree-quorum, e.g. "Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...". Exposed as a top-level field so it can be interpolated into the entry's description.
      values.summary:
+        "Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, parent=0, signers=14 | Group 2: 2-of-12, parent=0, signers=12 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7"
+++ description: The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description.
      values.summaryGroups:
+        "Group 1: 2-of-14, parent=0, signers=14 | Group 2: 2-of-12, parent=0, signers=12 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7"
+++ description: Just the root-group line of the tree summary (e.g. "Root: 2-of-4, childGroups=(1,2,3,4)"). Always-visible head of the description.
      values.summaryRoot:
+        "Root: 2-of-4, childGroups=(1,2,3,4)"
      description:
+        "Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 4 signatures across 38 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 4-of-38 multisig and is strictly more constrained. Root: 2-of-4, childGroups=(1,2,3,4). [click for per-group breakdown: Group 1: 2-of-14, parent=0, signers=14 | Group 2: 2-of-12, parent=0, signers=12 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7]. The owner can rotate the entire signer tree."
      fieldMeta:
+        {"config":{"description":"Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups)."},"summary":{"description":"One-line readable form of the full tree-quorum, e.g. \"Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...\". Exposed as a top-level field so it can be interpolated into the entry's description."},"summaryRoot":{"description":"Just the root-group line of the tree summary (e.g. \"Root: 2-of-4, childGroups=(1,2,3,4)\"). Always-visible head of the description."},"summaryGroups":{"description":"The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description."},"$threshold":{"description":"Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading."},"$members":{"description":"Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list."},"minSigs":{"description":"Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected."},"memberCount":{"description":"Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule."},"getRoot":{"description":"Currently active Merkle root of pending operations and its expiry timestamp."},"getRootMetadata":{"description":"Metadata of the active root: target chainId and multisig, pre/post op counts, and whether it overrode the previous root."},"getOpCount":{"description":"Monotonic counter of ops executed across all roots. Used to detect skipped ops from the previous root."},"owner":{"severity":"HIGH","type":"PERMISSION"}}
      category:
+        {"name":"Governance","priority":3}
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800,"role":".proposerRoleMembers"}]
    }
```

```diff
    contract ARM_Multisig2 (eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F) [transporter/ManyChainMultiSig] {
    +++ description: Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 4 signatures across 41 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 4-of-41 multisig and is strictly more constrained. Root: 2-of-4, childGroups=(1,2,3,4). [click for per-group breakdown: Group 1: 2-of-15, parent=0, signers=15 | Group 2: 2-of-14, parent=0, signers=14 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7]. The owner can rotate the entire signer tree.
      name:
-        "ARMProxyOwnerProposer2"
+        "ARM_Multisig2"
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81","description":"replace the active ARM/RMN contract used for CCIP safety checks.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"cancel scheduled operations before they are executed.","role":".cancellerRoleMembers"}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"grant or revoke roles on this timelock.","role":".adminRoleMembers","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"schedule operations that can be executed after the configured timelock delay.","role":".proposerRoleMembers"}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","description":"grant or revoke roles on this timelock.","role":".adminRoleMembers","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.6:
+        {"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"add, remove, or replace OnRamps and OffRamps used by the Router.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.7:
+        {"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"change the wrapped native token used for native-fee payments.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.8:
+        {"permission":"interact","from":"eth:0xAD97C0270a243270136E40278155C12ce7C7F87B","description":"rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root.","role":".owner","via":[{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]}
      receivedPermissions.0.via:
+        [{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]
      receivedPermissions.0.role:
-        ".CancellerRoleGranted"
+        ".owner"
      receivedPermissions.0.description:
-        "cancel scheduled operations before they are executed."
+        "rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root."
      receivedPermissions.0.from:
-        "eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"
+        "eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e"
      receivedPermissions.1.via:
+        [{"address":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800}]
      receivedPermissions.1.role:
-        ".ProposerRoleGranted"
+        ".owner"
      receivedPermissions.1.description:
-        "schedule operations that can be executed after the configured timelock delay."
+        "rotate the signer tree (signers, group memberships, group quorums, group parents) and optionally clear the active root."
      receivedPermissions.1.from:
-        "eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449"
+        "eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F"
      values.getConfig:
-        {"signers":[{"addr":"eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","index":0,"group":4},{"addr":"eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","index":1,"group":4},{"addr":"eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","index":2,"group":2},{"addr":"eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","index":3,"group":4},{"addr":"eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","index":4,"group":2},{"addr":"eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","index":5,"group":2},{"addr":"eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","index":6,"group":1},{"addr":"eth:0x34e42200901133bdceb1195f2c5241cb03D06274","index":7,"group":1},{"addr":"eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","index":8,"group":1},{"addr":"eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","index":9,"group":1},{"addr":"eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","index":10,"group":1},{"addr":"eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","index":11,"group":2},{"addr":"eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","index":12,"group":2},{"addr":"eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","index":13,"group":1},{"addr":"eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","index":14,"group":2},{"addr":"eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","index":15,"group":3},{"addr":"eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","index":16,"group":3},{"addr":"eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","index":17,"group":3},{"addr":"eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","index":18,"group":2},{"addr":"eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","index":19,"group":4},{"addr":"eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","index":20,"group":2},{"addr":"eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","index":21,"group":2},{"addr":"eth:0x843742760078Df85609690D85827173A1A96D14a","index":22,"group":1},{"addr":"eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","index":23,"group":1},{"addr":"eth:0x8E0e08E8cbc324310550E195383b7aC200726639","index":24,"group":1},{"addr":"eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","index":25,"group":3},{"addr":"eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","index":26,"group":4},{"addr":"eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","index":27,"group":1},{"addr":"eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","index":28,"group":2},{"addr":"eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","index":29,"group":2},{"addr":"eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","index":30,"group":2},{"addr":"eth:0xd107276078c6605bE0CEC43D765733291B7102aF","index":31,"group":1},{"addr":"eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","index":32,"group":2},{"addr":"eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","index":33,"group":1},{"addr":"eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","index":34,"group":1},{"addr":"eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","index":35,"group":1},{"addr":"eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","index":36,"group":2},{"addr":"eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","index":37,"group":1},{"addr":"eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","index":38,"group":4},{"addr":"eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","index":39,"group":4},{"addr":"eth:0xFccD1128fc823dD78e76240dc206a7A26494F271","index":40,"group":3}],"groupQuorums":[2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"groupParents":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
      values.MAX_NUM_SIGNERS:
-        200
      values.NUM_GROUPS:
-        32
+++ description: Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list.
      values.$members:
+        ["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x8E0e08E8cbc324310550E195383b7aC200726639","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"]
+++ description: Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading.
      values.$threshold:
+        4
+++ description: Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups).
      values.config:
+        {"summary":"Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-15, parent=0, signers=15 | Group 2: 2-of-14, parent=0, signers=14 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7","summaryRoot":"Root: 2-of-4, childGroups=(1,2,3,4)","summaryGroups":"Group 1: 2-of-15, parent=0, signers=15 | Group 2: 2-of-14, parent=0, signers=14 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7","rootQuorum":2,"minSigs":4,"allMembers":["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x8E0e08E8cbc324310550E195383b7aC200726639","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"],"signerGroups":{"root":{"quorum":2,"parent":0,"childGroups":[1,2,3,4],"members":[]},"group1":{"quorum":2,"parent":0,"childGroups":[],"members":["eth:0x29c5f7aCfDea3F48486b282aF0FA797b0F04D845","eth:0x34e42200901133bdceb1195f2c5241cb03D06274","eth:0x3Ce065c714810e0b2a85Ed71f1582038823c75d8","eth:0x41eAdbc688797a02bfaBE48472995833489ce69D","eth:0x4833c0fcE02C92fF8D92903BAB14827ff1cBD4bf","eth:0x532657dDd472E9f9061963a44955acCCeE318B1c","eth:0x843742760078Df85609690D85827173A1A96D14a","eth:0x893234a5EbE7Ae1D5089Fe5936a05c6cd6fBaDE7","eth:0x8E0e08E8cbc324310550E195383b7aC200726639","eth:0xa53a14c85965734C875C91A6a145CFB5ff4624dD","eth:0xd107276078c6605bE0CEC43D765733291B7102aF","eth:0xE062e7D123AC8dF480C56147f911144F55C10f88","eth:0xE3fe08c2Ac10a690284EdeBf20A3820479277162","eth:0xE5e14e1FA005dB2DC05020b432942F2611279cc8","eth:0xF27805Fd4416cE6cB433c5a63A39B2bCc47a4BF6"]},"group2":{"quorum":2,"parent":0,"childGroups":[],"members":["eth:0x15C50aAdC2ff201FA0545996528082c9fC551eB0","eth:0x1BD478DB8E202A887440b2f89E854927651Ce142","eth:0x1E2cDb5Fe0461C3688E090B879fd1156ed32a887","eth:0x4c29a3a0ECe46F27417953b925fA9cC01BF99253","eth:0x4D12E3BaE007227CA63d55a8e3c4ddc3EbBFA2b6","eth:0x54081602645704EE2B76FEe30E8B4d4F2D82d4E0","eth:0x6943b0B1C63d3226B44853eEe8C2Bb6360fF3226","eth:0x70f498A0AD8a17fC853fcb8eDbE31Fbce71173E6","eth:0x7b404a74F7d78191F4359C6Cc75f895b5A44bdB2","eth:0xB89FC4d62344a77dD09159390f9283ae9e5150F2","eth:0xb8C1688807788A7F3FFc3Fb6F0c19E06889c051F","eth:0xBA778eaBa9E592B644344bC5fe9D0a89d5c24009","eth:0xD924A8A91c1406afaF55Be2Ad3Ee24Cc09D8814C","eth:0xEA6247A8565de25E7d1E31f3055911566A2Addc6"]},"group3":{"quorum":2,"parent":0,"childGroups":[],"members":["eth:0x5AA4D76f0CD8ea04fB3C4C4b771A0B9E03dC776C","eth:0x60Fead3745461393F9298228E19d6D720Db89F2e","eth:0x615B9b28B754Afd1fD03EbaB2BAE8b14A6Dc94Ee","eth:0x9B391a5179BdC59af9B3a49423Fe8F10b74aF3c6","eth:0xFccD1128fc823dD78e76240dc206a7A26494F271"]},"group4":{"quorum":2,"parent":0,"childGroups":[],"members":["eth:0x013D4A675Fd02359c3c35Abc514dafd97B127e34","eth:0x0D2730AD6D62A49907Fb9273cD4a59D1092cb472","eth:0x1A1981c347Cd352CdF4882c343fC9C24C4796e94","eth:0x6bfBf6BC4bc5CD20768dAA6F58f0743bAFf2e5f4","eth:0xa42c8570771240D1e2F3211064a7C7472Cc05b7D","eth:0xfBB1B9F0adFc8696e716CC8AD05a2fEbC1605028","eth:0xFc660abD73677bb4942f1bDDd1054a975D228d29"]}}}
+++ description: Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule.
      values.memberCount:
+        41
+++ description: Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected.
      values.minSigs:
+        4
+++ description: One-line readable form of the full tree-quorum, e.g. "Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...". Exposed as a top-level field so it can be interpolated into the entry's description.
      values.summary:
+        "Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-15, parent=0, signers=15 | Group 2: 2-of-14, parent=0, signers=14 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7"
+++ description: The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description.
      values.summaryGroups:
+        "Group 1: 2-of-15, parent=0, signers=15 | Group 2: 2-of-14, parent=0, signers=14 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7"
+++ description: Just the root-group line of the tree summary (e.g. "Root: 2-of-4, childGroups=(1,2,3,4)"). Always-visible head of the description.
      values.summaryRoot:
+        "Root: 2-of-4, childGroups=(1,2,3,4)"
      description:
+        "Tree-quorum multisig used to gate CCIP governance actions. Signers belong to leaf groups; each interior group has its own M-of-N quorum and counts how many of its children (signers or sub-groups) have succeeded. A call is accepted only if the root group reaches its quorum. Minimum 4 signatures across 41 total signers, but those signatures must come from the specific groups required by the tree; this is NOT equivalent to a flat 4-of-41 multisig and is strictly more constrained. Root: 2-of-4, childGroups=(1,2,3,4). [click for per-group breakdown: Group 1: 2-of-15, parent=0, signers=15 | Group 2: 2-of-14, parent=0, signers=14 | Group 3: 2-of-5, parent=0, signers=5 | Group 4: 2-of-7, parent=0, signers=7]. The owner can rotate the entire signer tree."
      fieldMeta:
+        {"config":{"description":"Decoded signer tree: root quorum, every active group with its quorum/parent/child-groups/members, and a one-line human summary. Disabled groups (slots 0..31 with quorum=0) are dropped. Also exposes minSigs (recursive minimum signatures required to satisfy the root) and allMembers (flat union of every signer across all groups)."},"summary":{"description":"One-line readable form of the full tree-quorum, e.g. \"Root: 2-of-4, childGroups=(1,2,3,4) | Group 1: 2-of-14, ...\". Exposed as a top-level field so it can be interpolated into the entry's description."},"summaryRoot":{"description":"Just the root-group line of the tree summary (e.g. \"Root: 2-of-4, childGroups=(1,2,3,4)\"). Always-visible head of the description."},"summaryGroups":{"description":"The per-sub-group lines of the tree summary, joined with ' | '. Empty when the root has no sub-groups. Hidden behind the [click for per-group breakdown] collapsible in the entry description."},"$threshold":{"description":"Lower-bound signature count required to satisfy the root tree-quorum. Wired through so the frontend lists this contract as a Multisig and renders the per-signer participants list (same pipeline used for Gnosis Safes). The badge is a lower bound only: not any minSigs-of-memberCount combination is valid, the signatures must come from the specific groups required by the tree. The entry's description explicitly disclaims the flat-M-of-N reading."},"$members":{"description":"Flat union of every signer address across all groups. Wired through so the frontend lists this contract as a Multisig and renders participants the same way Gnosis Safes do. The tree-quorum semantics are encoded in the description, not in this flat list."},"minSigs":{"description":"Recursively-computed minimum signature count to satisfy the root quorum. NOT equivalent to a flat M-of-N — those signatures must come from the specific groups dictated by the tree; the same number of signatures from a different distribution will be rejected."},"memberCount":{"description":"Total number of distinct signer addresses across all groups. NOT to be combined with minSigs as a flat M-of-N: see summary for the actual access-control rule."},"getRoot":{"description":"Currently active Merkle root of pending operations and its expiry timestamp."},"getRootMetadata":{"description":"Metadata of the active root: target chainId and multisig, pre/post op counts, and whether it overrode the previous root."},"getOpCount":{"description":"Monotonic counter of ops executed across all roots. Used to detect skipped ops from the previous root."},"owner":{"severity":"HIGH","type":"PERMISSION"}}
      category:
+        {"name":"Governance","priority":3}
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","delay":10800,"role":".proposerRoleMembers"}]
    }
```

```diff
    contract RMNRemote (eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20) [transporter/RMNRemote] {
    +++ description: Remote Risk Management Network contract used by CCIP to verify RMN reports and expose cursed subjects.
      description:
-        "RMNRemote contract behind the ARM proxy. It exposes RMN curse state and RMN 1.6 report verification. For pre-1.6 isBlessed() checks, it relays to the legacy RMN contract supplied in the constructor."
+        "Remote Risk Management Network contract used by CCIP to verify RMN reports and expose cursed subjects."
+++ description: Decoded view of getCursedSubjects: GLOBAL_CURSE if the global subject is set, otherwise the source-chain name from the CCIPChainName mapping (decimal selector when not in the mapping).
      values.cursedSubjects:
+        []
+++ description: RMN signers authorized to sign v1.6 commit reports for this chain. Each signer has a recoverable EVM-style public key; ECDSA recovery against report digests must yield one of these addresses. fSign+1 signatures are required for verify() to accept a report; total signers must be at least 2*fSign+1.
      values.rmnSigners:
+        ["eth:0x0100000000000000000000000000000000000000"]
      fieldMeta.getCursedSubjects.description:
-        "Subjects currently cursed by RMNRemote. An empty list means there is no active global or route-specific curse in this contract."
+        "Raw bytes16 subjects currently cursed by RMNRemote (s_cursedSubjects.values()). Each entry is either the special GLOBAL_CURSE_SUBJECT 0x01000000000000000000000000000001 (kills every CCIP path through this RMN) or bytes16(uint128(chainSelector)) (kills inbound traffic from that source chain). An empty list means no curse is active. See cursedSubjects for the decoded view."
      fieldMeta.rmnSigners:
+        {"description":"RMN signers authorized to sign v1.6 commit reports for this chain. Each signer has a recoverable EVM-style public key; ECDSA recovery against report digests must yield one of these addresses. fSign+1 signatures are required for verify() to accept a report; total signers must be at least 2*fSign+1."}
      fieldMeta.owner:
+        {"severity":"HIGH","type":"PERMISSION"}
      fieldMeta.cursedSubjects:
+        {"description":"Decoded view of getCursedSubjects: GLOBAL_CURSE if the global subject is set, otherwise the source-chain name from the CCIPChainName mapping (decimal selector when not in the mapping)."}
    }
```

```diff
-   Status: DELETED
    contract ArbitrumToEthereumOffRamp (eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d) [transporter/OffRampV1]
    +++ description: Arbitrum-to-Ethereum OffRamp. It accepts OCR execution reports, checks every message against a blessed committed Merkle root, enforces sequence and nonce rules, releases or mints tokens, and calls the Router to deliver ccipReceive() to the receiver.
```

```diff
+   Status: CREATED
    contract Gho Token (eth:0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f) [N/A]
    +++ description: Token accepted as fee token for sending outgoing messages.
```

```diff
+   Status: CREATED
    contract ChainLink Token (eth:0x514910771AF9Ca656af840dff83E8264EcF986CA) [N/A]
    +++ description: Token accepted as fee token for sending outgoing messages.
```

```diff
+   Status: CREATED
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) [N/A]
    +++ description: Token accepted as fee token for sending outgoing messages.
```

Generated with discovered.json: 0xbf06d64d74f8a96d44023635c14ffc4afa14299e

# Diff at Fri, 15 May 2026 12:35:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a5152b9ba7ad7f85f2af3d814f74630fcaa7c917 block: 1777388210
- current timestamp: 1777388210

## Description

Shape hashes update after flattener improvements

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777388210 (main branch discovery), not current.

```diff
    contract GHOEthereumTokenPool (eth:0x06179f7C1be40863405f374E7f5F8806c728660A) [transporter/TokenPool] {
    +++ description: GHO lock-and-release token pool on Ethereum. It trusts configured Arbitrum remote pools and only accepts inbound token releases routed through CCIP OffRamps.
      sourceHashes.1:
-        "0x39415a58cb2a072d97bd39f2f579e01c82ace7c06e80bf5619dc0be2bf2620e8"
+        "0x9c4424aa5c0675489f24e9cf8b9bf148ee3c51c282747bbf58f9bbba8bfd05d9"
    }
```

Generated with discovered.json: 0x30eee331d2405cf28886220483944dc18a02653e

# Diff at Fri, 08 May 2026 07:51:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1777388210
- current timestamp: 1777388210

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777388210 (main branch discovery), not current.

```diff
    contract GHOEthereumTokenPool (eth:0x06179f7C1be40863405f374E7f5F8806c728660A) [transporter/TokenPool] {
    +++ description: GHO lock-and-release token pool on Ethereum. It trusts configured Arbitrum remote pools and only accepts inbound token releases routed through CCIP OffRamps.
      sourceHashes.0:
-        "0x525b22d02f8b39d3432dfaf0061e3d91caa10d282e86ec7abeb4ca11790f6762"
+        "0xbda0929be0223e0b4c8c6cdb89dbe1fd3ef62e3aee028519d4c97c5dbab66e7f"
      sourceHashes.1:
-        "0x7612d95cd6518326945cfb5387b8a37c83d797ad268bd7d9d5695c45b59a579e"
+        "0x39415a58cb2a072d97bd39f2f579e01c82ace7c06e80bf5619dc0be2bf2620e8"
    }
```

```diff
    contract ARMProxyOwnerBypasser (eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc) [transporter/ManyChainMultiSig] {
    +++ description: None
      sourceHashes.0:
-        "0x15b33604a10bda5235da68c98629cc8246b96e86c931a23c296ae08f1eb691cb"
+        "0x0bfaa79275ffb76e161bfb96a564a2a4cd6e2ff1d915f2b667fb2698bce1cb80"
    }
```

```diff
    contract EthereumToArbitrumOnRampTokenLimitAdmin (eth:0x2F2A3e36CE5Fb0924C414BEB1D98B531Cdf17e0B) [transporter/ManyChainMultiSig] {
    +++ description: None
      sourceHashes.0:
-        "0x15b33604a10bda5235da68c98629cc8246b96e86c931a23c296ae08f1eb691cb"
+        "0x0bfaa79275ffb76e161bfb96a564a2a4cd6e2ff1d915f2b667fb2698bce1cb80"
    }
```

```diff
    contract ARMProxy (eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81) [transporter/ARMProxy] {
    +++ description: ARM proxy used by the Router, OnRamp, CommitStore, OffRamp, and GHO token pool to read RMN curse and blessing state.
      sourceHashes.0:
-        "0x3693b1f8ad16df4a5aaa5bfcfb070ead01c1ca6e49553832567f9710362a47ac"
+        "0xf745c9b3eca01e8c6767467ef71bb21afeb1caaf28b1def6d73cc2a98ef9e107"
    }
```

```diff
    contract ARMProxyOwner (eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449) [transporter/RBACTimelock] {
    +++ description: Timelock administering the CCIP Router, PriceRegistry, CommitStore, OffRamp, OnRamp, and ARM proxy.
      sourceHashes.0:
-        "0xd5b2b6b0153f0ac33437f0059e864bae869943a68c01d8626d43eb2abebb728d"
+        "0x7626f6b1eaf5b322ddcc5a798e7402c8d43fb8ae6f435b47d1d82df5c80af4aa"
    }
```

```diff
    contract Executor (eth:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A) [N/A] {
    +++ description: Aave governance executor that owns the GHO Ethereum token pool.
      sourceHashes.0:
-        "0x855bbd6c58ca4afabd099cd0fa12926ca20fd1820716d5f52dda1ae30a56ae45"
+        "0x65a423a76cbcee42a1c4cbb73e9fc30f6e4e4f1486f43a85805b0ec1efda8b3a"
    }
```

```diff
    contract RMNRemoteOwner (eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A) [transporter/RBACTimelock] {
    +++ description: Timelock administering RMNRemote signer configuration and curse/blessing controls.
      sourceHashes.0:
-        "0xd5b2b6b0153f0ac33437f0059e864bae869943a68c01d8626d43eb2abebb728d"
+        "0x7626f6b1eaf5b322ddcc5a798e7402c8d43fb8ae6f435b47d1d82df5c80af4aa"
    }
```

```diff
    contract EthereumToArbitrumOnRamp (eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284) [transporter/OnRampV3] {
    +++ description: Ethereum-to-Arbitrum OnRamp. It receives messages only from the Router, validates send limits and fees, locks or burns tokens through token pools, assigns sequence numbers and nonces, hashes the message, and emits CCIPSendRequested for the offchain DON (ccip consensus).
      sourceHashes.0:
-        "0x0ae770c7c5e476e676ed2fed06f93f96e0b4ed9b58b6a627483af05a17f92157"
+        "0xead790d7ae490d785045138f40f30e2660cc6efb72e1e84f23ba696c17c57674"
    }
```

```diff
    contract RMNRemoteOwnerProposer (eth:0x79bC82F3931A7d017719146A822e4AD8152b157e) [transporter/ManyChainMultiSig] {
    +++ description: None
      sourceHashes.0:
-        "0x4f59b9eb3c499a0ce481e88fbdca49583b553c9ae00db33bfcc9e38132a82b86"
+        "0x625c5a942ae3dc2e829b38f52d2d20899bcbb177a8be3624ae47485ba139cfc5"
    }
```

```diff
    contract Router (eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) [transporter/RouterV1_2_0] {
    +++ description: Ethereum CCIP Router for this route. Users call it to send messages to Arbitrum; trusted Arbitrum OffRamps call it to deliver incoming messages to Ethereum receivers.
      sourceHashes.0:
-        "0x56b28474b4daa9a8cbbe1a1ed1135d6881be21c0f343671e361b90eebf0b210d"
+        "0x1e8e8f875d0575ef62e454568f565aea573ef5e086c95be2cc20920d2f8dd272"
    }
```

```diff
    contract RMNRemoteOwnerCanceller (eth:0x806659842cFeEE3CBEF35F8ad2eA42460574b413) [transporter/ManyChainMultiSig] {
    +++ description: None
      sourceHashes.0:
-        "0x4f59b9eb3c499a0ce481e88fbdca49583b553c9ae00db33bfcc9e38132a82b86"
+        "0x625c5a942ae3dc2e829b38f52d2d20899bcbb177a8be3624ae47485ba139cfc5"
    }
```

```diff
    contract RMNRemoteOwnerBypasser (eth:0x8C00Cc7cC37396e88BbFe66371341a59D1b5771F) [transporter/ManyChainMultiSig] {
    +++ description: None
      sourceHashes.0:
-        "0x4f59b9eb3c499a0ce481e88fbdca49583b553c9ae00db33bfcc9e38132a82b86"
+        "0x625c5a942ae3dc2e829b38f52d2d20899bcbb177a8be3624ae47485ba139cfc5"
    }
```

```diff
    contract PriceRegistry (eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad) [transporter/PriceRegistry] {
    +++ description: PriceRegistry used by the OnRamp and CommitStore to price fees, tokens, and gas for this route.
      sourceHashes.0:
-        "0xb3ac732170b6c82e6eb8e400fac9618c85fcdce082a404030cee9be7bd700bdf"
+        "0xe2d2d1138a8f51623ec04d3b84ea21a16032de22b8c6c1775dc988b2d8c9a165"
    }
```

```diff
    contract ArbitrumToEthereumCommitStore (eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749) [transporter/CommitStoreV1] {
    +++ description: Arbitrum-to-Ethereum CommitStore. Its OCR commit reports publish Merkle roots for source messages; execution is possible only for leaves under roots that are both committed here and blessed by RMN through the ARM proxy.
      sourceHashes.0:
-        "0xd025e395362545e27f2685927e4952ec45f7414e89a22f0db36aa587b3741d69"
+        "0xa9b2be15e7f9adcc07f7a7c2ce2e50f384ccfa8b93a684edf49b580bf40a3aec"
    }
```

```diff
    contract ARMProxyOwnerCanceller (eth:0xAD97C0270a243270136E40278155C12ce7C7F87B) [transporter/ManyChainMultiSig] {
    +++ description: None
      sourceHashes.0:
-        "0x15b33604a10bda5235da68c98629cc8246b96e86c931a23c296ae08f1eb691cb"
+        "0x0bfaa79275ffb76e161bfb96a564a2a4cd6e2ff1d915f2b667fb2698bce1cb80"
    }
```

```diff
    contract GhoCcipSteward (eth:0xC5BcC58BE6172769ca1a78B8A45752E3C5059c39) [N/A] {
    +++ description: Aave GHO CCIP steward. It can update bridge and rate limits for the GHO Ethereum token pool only when called by the Aave Risk Council.
      sourceHashes.0:
-        "0xb2c79442b21e5fe7cc935a88ca894b959faf19445c69c6ab9f4751fd141a4c46"
+        "0xc6405b4381c2ea9fd594928e9d7f3967ff430a2669feb531936a405ce4571407"
    }
```

```diff
    contract ARMProxyOwnerGnosisSafe (eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd5e39124d6a5dcf27e7b56bfbb24569e89837dea5e334ef533c239e1497f1fee"
+        "0xac89801b8b4d85dcda1313c954a25adb42d9946d4f1e330fcd24a4ef85f4d61f"
    }
```

```diff
    contract ARMProxyOwnerProposer (eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e) [transporter/ManyChainMultiSig] {
    +++ description: None
      sourceHashes.0:
-        "0x4f59b9eb3c499a0ce481e88fbdca49583b553c9ae00db33bfcc9e38132a82b86"
+        "0x625c5a942ae3dc2e829b38f52d2d20899bcbb177a8be3624ae47485ba139cfc5"
    }
```

```diff
    contract ARMProxyOwnerProposer2 (eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F) [transporter/ManyChainMultiSig] {
    +++ description: None
      sourceHashes.0:
-        "0x15b33604a10bda5235da68c98629cc8246b96e86c931a23c296ae08f1eb691cb"
+        "0x0bfaa79275ffb76e161bfb96a564a2a4cd6e2ff1d915f2b667fb2698bce1cb80"
    }
```

```diff
    contract RMNRemote (eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20) [transporter/RMNRemote] {
    +++ description: RMNRemote contract behind the ARM proxy. It exposes RMN curse state and RMN 1.6 report verification. For pre-1.6 isBlessed() checks, it relays to the legacy RMN contract supplied in the constructor.
      sourceHashes.0:
-        "0x3664618ea06cf10d0f454add5b6c58096ae0a6b3f86d41ffaf228442727fd581"
+        "0xb3594b8c0cad34a7d31b26071ec4ed8905f9d0a796ca41f06163784b6605b9cd"
    }
```

```diff
    contract ArbitrumToEthereumOffRamp (eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d) [transporter/OffRampV1] {
    +++ description: Arbitrum-to-Ethereum OffRamp. It accepts OCR execution reports, checks every message against a blessed committed Merkle root, enforces sequence and nonce rules, releases or mints tokens, and calls the Router to deliver ccipReceive() to the receiver.
      sourceHashes.0:
-        "0x3338bd5c98f2d0c2daccf1d67f82534a0b6d6ffd4c6f9badb508924d8df24f09"
+        "0x6a89978af7e67cfca75bb193a00044fd19708ecfe3f6c1594af46be5a2a711c2"
    }
```

Generated with discovered.json: 0xec0e018630fd338c89265be8940f7135496b3925

# Diff at Tue, 05 May 2026 10:22:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1777388210
- current timestamp: 1777388210

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777388210 (main branch discovery), not current.

```diff
    contract GHOEthereumTokenPool (eth:0x06179f7C1be40863405f374E7f5F8806c728660A) {
    +++ description: GHO lock-and-release token pool on Ethereum. It trusts configured Arbitrum remote pools and only accepts inbound token releases routed through CCIP OffRamps.
      deployerAddress:
+        "eth:0x26D595DdDbAd81Bf976eF6f24686a12A800b141F"
    }
```

```diff
    contract ARMProxyOwnerBypasser (eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc) {
    +++ description: None
      deployerAddress:
+        "eth:0x61E5E1ea8fF9Dc840e0A549c752FA7BDe9224e99"
    }
```

```diff
    contract EthereumToArbitrumOnRampTokenLimitAdmin (eth:0x2F2A3e36CE5Fb0924C414BEB1D98B531Cdf17e0B) {
    +++ description: None
      deployerAddress:
+        "eth:0x289952Dec78C17DC5CC095FE6BCC3Aee1c63787f"
    }
```

```diff
    contract ARMProxy (eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81) {
    +++ description: ARM proxy used by the Router, OnRamp, CommitStore, OffRamp, and GHO token pool to read RMN curse and blessing state.
      deployerAddress:
+        "eth:0x5c19826E72A40cf73681f757D6bf90f5cDA89414"
    }
```

```diff
    contract ARMProxyOwner (eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449) {
    +++ description: Timelock administering the CCIP Router, PriceRegistry, CommitStore, OffRamp, OnRamp, and ARM proxy.
      deployerAddress:
+        "eth:0x61E5E1ea8fF9Dc840e0A549c752FA7BDe9224e99"
    }
```

```diff
    contract RMNRemoteOwnerExecutor (eth:0x49edf594E698F406A15afEf44CE7a0Fd8d998610) {
    +++ description: Public call proxy that forwards any caller to RMNRemoteOwner, allowing anyone to execute already-scheduled RMNRemoteOwner operations after the timelock delay.
      deployerAddress:
+        "eth:0x062f05CD6c835677B05a8658A351969476861316"
    }
```

```diff
    contract Executor (eth:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A) {
    +++ description: Aave governance executor that owns the GHO Ethereum token pool.
      deployerAddress:
+        "eth:0xEAF6183bAb3eFD3bF856Ac5C058431C8592394d6"
    }
```

```diff
    contract RMNRemoteOwner (eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A) {
    +++ description: Timelock administering RMNRemote signer configuration and curse/blessing controls.
      deployerAddress:
+        "eth:0x062f05CD6c835677B05a8658A351969476861316"
    }
```

```diff
    contract EthereumToArbitrumOnRamp (eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284) {
    +++ description: Ethereum-to-Arbitrum OnRamp. It receives messages only from the Router, validates send limits and fees, locks or burns tokens through token pools, assigns sequence numbers and nonces, hashes the message, and emits CCIPSendRequested for the offchain DON (ccip consensus).
      deployerAddress:
+        "eth:0x5c19826E72A40cf73681f757D6bf90f5cDA89414"
    }
```

```diff
    contract RMNRemoteOwnerProposer (eth:0x79bC82F3931A7d017719146A822e4AD8152b157e) {
    +++ description: None
      deployerAddress:
+        "eth:0x062f05CD6c835677B05a8658A351969476861316"
    }
```

```diff
    contract Router (eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) {
    +++ description: Ethereum CCIP Router for this route. Users call it to send messages to Arbitrum; trusted Arbitrum OffRamps call it to deliver incoming messages to Ethereum receivers.
      deployerAddress:
+        "eth:0x5c19826E72A40cf73681f757D6bf90f5cDA89414"
    }
```

```diff
    contract RMNRemoteOwnerCanceller (eth:0x806659842cFeEE3CBEF35F8ad2eA42460574b413) {
    +++ description: None
      deployerAddress:
+        "eth:0x062f05CD6c835677B05a8658A351969476861316"
    }
```

```diff
    contract ARMProxyOwnerExecutor (eth:0x82b8A19497fA25575f250a3DcFfCD2562B575A2e) {
    +++ description: Public call proxy that forwards any caller to ARMProxyOwner, allowing anyone to execute already-scheduled ARMProxyOwner operations after the timelock delay.
      deployerAddress:
+        "eth:0x61E5E1ea8fF9Dc840e0A549c752FA7BDe9224e99"
    }
```

```diff
    contract RMNRemoteOwnerBypasser (eth:0x8C00Cc7cC37396e88BbFe66371341a59D1b5771F) {
    +++ description: None
      deployerAddress:
+        "eth:0x062f05CD6c835677B05a8658A351969476861316"
    }
```

```diff
    contract PriceRegistry (eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad) {
    +++ description: PriceRegistry used by the OnRamp and CommitStore to price fees, tokens, and gas for this route.
      deployerAddress:
+        "eth:0x5c19826E72A40cf73681f757D6bf90f5cDA89414"
    }
```

```diff
    contract ArbitrumToEthereumCommitStore (eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749) {
    +++ description: Arbitrum-to-Ethereum CommitStore. Its OCR commit reports publish Merkle roots for source messages; execution is possible only for leaves under roots that are both committed here and blessed by RMN through the ARM proxy.
      deployerAddress:
+        "eth:0x5c19826E72A40cf73681f757D6bf90f5cDA89414"
    }
```

```diff
    contract ARMProxyOwnerCanceller (eth:0xAD97C0270a243270136E40278155C12ce7C7F87B) {
    +++ description: None
      deployerAddress:
+        "eth:0x61E5E1ea8fF9Dc840e0A549c752FA7BDe9224e99"
    }
```

```diff
    contract GhoCcipSteward (eth:0xC5BcC58BE6172769ca1a78B8A45752E3C5059c39) {
    +++ description: Aave GHO CCIP steward. It can update bridge and rate limits for the GHO Ethereum token pool only when called by the Aave Risk Council.
      deployerAddress:
+        "eth:0x26D595DdDbAd81Bf976eF6f24686a12A800b141F"
    }
```

```diff
    contract ARMProxyOwnerGnosisSafe (eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf) {
    +++ description: None
      deployerAddress:
+        "eth:0x61E5E1ea8fF9Dc840e0A549c752FA7BDe9224e99"
    }
```

```diff
    contract ARMProxyOwnerProposer (eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e) {
    +++ description: None
      deployerAddress:
+        "eth:0x062f05CD6c835677B05a8658A351969476861316"
    }
```

```diff
    contract ARMProxyOwnerProposer2 (eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F) {
    +++ description: None
      deployerAddress:
+        "eth:0x61E5E1ea8fF9Dc840e0A549c752FA7BDe9224e99"
    }
```

```diff
    contract RMNRemote (eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20) {
    +++ description: RMNRemote contract behind the ARM proxy. It exposes RMN curse state and RMN 1.6 report verification. For pre-1.6 isBlessed() checks, it relays to the legacy RMN contract supplied in the constructor.
      deployerAddress:
+        "eth:0x062f05CD6c835677B05a8658A351969476861316"
    }
```

```diff
    contract ArbitrumToEthereumOffRamp (eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d) {
    +++ description: Arbitrum-to-Ethereum OffRamp. It accepts OCR execution reports, checks every message against a blessed committed Merkle root, enforces sequence and nonce rules, releases or mints tokens, and calls the Router to deliver ccipReceive() to the receiver.
      deployerAddress:
+        "eth:0x5c19826E72A40cf73681f757D6bf90f5cDA89414"
    }
```

Generated with discovered.json: 0x848d15c3a02a7d31754eb3c8d95f747a94237469

# Diff at Tue, 28 Apr 2026 14:58:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b3166357735df5971a8c9b33b441d35484243908 block: 1777287134
- current timestamp: 1777388210

## Description

refine ccip disco config.

ccip validation stack:
  OCR (offchain reporting) Commit DON -> CommitStore stores Merkle root
  RMN -> blesses or curses root/route
  OCR Execution DON -> OffRamp submits messages + proofs
  OffRamp -> CommitStore.verify(...)
  Router -> only accepts configured OffRamp

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777287134 (main branch discovery), not current.

```diff
    EOA  (eth:0x0100000000000000000000000000000000000000) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign RMN reports that can approve or block CCIP activity for the local chain."
+        "sign RMNRemote reports; this is separate from CommitStoreV1's legacy isBlessed() passthrough."
    }
```

```diff
    contract GHOEthereumTokenPool (eth:0x06179f7C1be40863405f374E7f5F8806c728660A) {
    +++ description: GHO lock-and-release token pool on Ethereum. It trusts configured Arbitrum remote pools and only accepts inbound token releases routed through CCIP OffRamps.
      description:
+        "GHO lock-and-release token pool on Ethereum. It trusts configured Arbitrum remote pools and only accepts inbound token releases routed through CCIP OffRamps."
    }
```

```diff
    EOA  (eth:0x08eAEE68e44caae09aa94367181470d92946310e) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ARMProxyOwnerBypasser (eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "ARMProxyOwnerBypasser"
    }
```

```diff
    contract EthereumToArbitrumOnRampTokenLimitAdmin (eth:0x2F2A3e36CE5Fb0924C414BEB1D98B531Cdf17e0B) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "EthereumToArbitrumOnRampTokenLimitAdmin"
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"change the aggregate outbound value rate limit for Ethereum-to-Arbitrum sends.","role":".getTokenLimitAdmin"},{"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"replace the token limit admin for this OnRamp.","role":".getTokenLimitAdmin"}]
    }
```

```diff
    EOA  (eth:0x316D2E43270ff4091Ca5d269c0E5cD8363524C91) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0x31eD28c2549e0195c4A405B71e4f18EfB935bE6f) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ARMProxy (eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81) {
    +++ description: ARM proxy used by the Router, OnRamp, CommitStore, OffRamp, and GHO token pool to read RMN curse and blessing state.
      description:
-        "Proxy pointing to the active ARM/RMN contract used by CCIP to report whether routes are cursed."
+        "ARM proxy used by the Router, OnRamp, CommitStore, OffRamp, and GHO token pool to read RMN curse and blessing state."
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x06179f7C1be40863405f374E7f5F8806c728660A","description":"block GHO pool operations when ARM/RMN marks the route or global subject as cursed.","role":".getRmnProxy"},{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"block routed messages when ARM/RMN reports the relevant subject as cursed.","role":".getArmProxy"},{"permission":"interact","from":"eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749","description":"define the trusted source OnRamp and ARM/RMN safety gate for commits accepted by this CommitStore.","role":".getStaticConfig"}]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x06179f7C1be40863405f374E7f5F8806c728660A","description":"block GHO pool operations when ARM/RMN marks the route or global subject as cursed.","role":".getRmnProxy"},{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"block routed messages when ARM/RMN reports the relevant subject as cursed.","role":".getArmProxy"},{"permission":"interact","from":"eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749","description":"define the trusted source OnRamp and ARM/RMN safety gate for commits accepted by this CommitStore.","role":".getStaticConfig"}]
    }
```

```diff
    EOA  (eth:0x41fa7E165F7aD96feC5EeB2a715d18dd9a4681d3) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ARMProxyOwner (eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449) {
    +++ description: Timelock administering the CCIP Router, PriceRegistry, CommitStore, OffRamp, OnRamp, and ARM proxy.
      description:
-        "Role based timelock used to administer CCIP contracts."
+        "Timelock administering the CCIP Router, PriceRegistry, CommitStore, OffRamp, OnRamp, and ARM proxy."
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81","description":"replace the active ARM/RMN contract used for CCIP safety checks.","role":".owner"},{"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"grant or revoke roles on this timelock.","role":".AdminRoleGranted"},{"permission":"interact","from":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","description":"grant or revoke roles on this timelock.","role":".AdminRoleGranted"},{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"add or remove OnRamps and OffRamps and change the wrapped native token used by this Router.","role":".owner"},{"permission":"interact","from":"eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad","description":"add or remove fee tokens and price updaters used by CCIP pricing.","role":".owner"},{"permission":"interact","from":"eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749","description":"pause or unpause commits and change OCR, dynamic config, minimum sequence, and price epoch parameters.","role":".owner"},{"permission":"interact","from":"eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d","description":"change the OffRamp admin, OCR config, rate limits, token pools, and execution parameters.","role":".owner"}]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81","description":"replace the active ARM/RMN contract used for CCIP safety checks.","role":".owner"},{"permission":"interact","from":"eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449","description":"grant or revoke roles on this timelock.","role":".AdminRoleGranted"},{"permission":"interact","from":"eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A","description":"grant or revoke roles on this timelock.","role":".AdminRoleGranted"},{"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"add, remove, or reprice fee tokens accepted by this OnRamp.","role":".owner"},{"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"change Router, PriceRegistry, message size, token count, gas limit, and fee parameters for outbound messages.","role":".owner"},{"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"change token transfer fee configuration and node operator fee weights.","role":".owner"},{"permission":"interact","from":"eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284","description":"withdraw accumulated non-LINK fee tokens.","role":".owner"},{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"add, remove, or replace OnRamps and OffRamps used by the Router.","role":".owner"},{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"change the wrapped native token used for native-fee payments.","role":".owner"},{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"recover tokens held by the Router.","role":".owner"},{"permission":"interact","from":"eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad","description":"add or remove fee tokens accepted by CCIP pricing.","role":".owner"},{"permission":"interact","from":"eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad","description":"add or remove price updater accounts.","role":".owner"},{"permission":"interact","from":"eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad","description":"change the staleness threshold for token and gas prices.","role":".owner"},{"permission":"interact","from":"eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749","description":"pause or unpause commits and change OCR, dynamic config, minimum sequence, and price epoch parameters.","role":".owner"},{"permission":"interact","from":"eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d","description":"change the OffRamp admin, OCR config, rate limits, token pools, and execution parameters.","role":".owner"}]
    }
```

```diff
    EOA  (eth:0x465Cb88B0Bf2A984a7C6c053262C8137D667bEaE) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract RMNRemoteOwnerExecutor (eth:0x49edf594E698F406A15afEf44CE7a0Fd8d998610) {
    +++ description: Public call proxy that forwards any caller to RMNRemoteOwner, allowing anyone to execute already-scheduled RMNRemoteOwner operations after the timelock delay.
      name:
-        "CallProxy"
+        "RMNRemoteOwnerExecutor"
      description:
+        "Public call proxy that forwards any caller to RMNRemoteOwner, allowing anyone to execute already-scheduled RMNRemoteOwner operations after the timelock delay."
    }
```

```diff
    EOA  (eth:0x58f94e05e34F9319627FAfdb64bB01E8D590878C) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract RMNRemoteOwner (eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A) {
    +++ description: Timelock administering RMNRemote signer configuration and curse/blessing controls.
      description:
-        "Role based timelock used to administer CCIP contracts."
+        "Timelock administering RMNRemote signer configuration and curse/blessing controls."
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20","description":"update the RMN signer set and fault threshold used to approve or block CCIP activity.","role":".owner"}]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20","description":"update the RMN signer set and fault threshold used to approve or block CCIP activity.","role":".owner"}]
    }
```

```diff
    contract EthereumToArbitrumOnRamp (eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284) {
    +++ description: Ethereum-to-Arbitrum OnRamp. It receives messages only from the Router, validates send limits and fees, locks or burns tokens through token pools, assigns sequence numbers and nonces, hashes the message, and emits CCIPSendRequested for the offchain DON (ccip consensus).
      description:
+        "Ethereum-to-Arbitrum OnRamp. It receives messages only from the Router, validates send limits and fees, locks or burns tokens through token pools, assigns sequence numbers and nonces, hashes the message, and emits CCIPSendRequested for the offchain DON (ccip consensus)."
      fieldMeta:
+        {"getStaticConfig":{"description":"Immutable lane config: Ethereum source selector, Arbitrum destination selector, previous OnRamp, RMN proxy, LINK token, and token admin registry."},"getDynamicConfig":{"description":"Mutable outbound config: Router, PriceRegistry, message size and gas limits, token limits, destination gas overheads, fee defaults, and ordered-execution policy."}}
    }
```

```diff
    EOA  (eth:0x6A985273Db73f21D6a74Ee9f76725112819BD950) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract RMNRemoteOwnerProposer (eth:0x79bC82F3931A7d017719146A822e4AD8152b157e) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "RMNRemoteOwnerProposer"
    }
```

```diff
    EOA  (eth:0x7A3c53356AE7797284B3C8daC27115015A8744BC) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract Router (eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D) {
    +++ description: Ethereum CCIP Router for this route. Users call it to send messages to Arbitrum; trusted Arbitrum OffRamps call it to deliver incoming messages to Ethereum receivers.
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x06179f7C1be40863405f374E7f5F8806c728660A","description":"route GHO token transfers into and out of this token pool.","role":".getRouter"}]
      fieldMeta.arbitrumOnRamp.description:
-        "The OnRamp used by CCIP to send messages and tokens from Ethereum to Arbitrum One."
+        "Ethereum-to-Arbitrum OnRamp selected by the Router when users call ccipSend() for the Arbitrum chain selector."
      fieldMeta.arbitrumOffRamp.description:
-        "The OffRamp used by CCIP to deliver messages and tokens from Arbitrum One to Ethereum."
+        "Arbitrum-to-Ethereum OffRamp allowed to call routeMessage() and deliver messages to Ethereum receivers."
      description:
+        "Ethereum CCIP Router for this route. Users call it to send messages to Arbitrum; trusted Arbitrum OffRamps call it to deliver incoming messages to Ethereum receivers."
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x06179f7C1be40863405f374E7f5F8806c728660A","description":"route GHO token transfers into and out of this token pool.","role":".getRouter"}]
    }
```

```diff
    contract RMNRemoteOwnerCanceller (eth:0x806659842cFeEE3CBEF35F8ad2eA42460574b413) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "RMNRemoteOwnerCanceller"
    }
```

```diff
    contract ARMProxyOwnerExecutor (eth:0x82b8A19497fA25575f250a3DcFfCD2562B575A2e) {
    +++ description: Public call proxy that forwards any caller to ARMProxyOwner, allowing anyone to execute already-scheduled ARMProxyOwner operations after the timelock delay.
      name:
-        "CallProxy"
+        "ARMProxyOwnerExecutor"
      description:
+        "Public call proxy that forwards any caller to ARMProxyOwner, allowing anyone to execute already-scheduled ARMProxyOwner operations after the timelock delay."
    }
```

```diff
    contract RMNRemoteOwnerBypasser (eth:0x8C00Cc7cC37396e88BbFe66371341a59D1b5771F) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "RMNRemoteOwnerBypasser"
    }
```

```diff
    contract PriceRegistry (eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad) {
    +++ description: PriceRegistry used by the OnRamp and CommitStore to price fees, tokens, and gas for this route.
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749","description":"provide gas and token price data used when committing CCIP state.","role":".priceRegistry"}]
      description:
+        "PriceRegistry used by the OnRamp and CommitStore to price fees, tokens, and gas for this route."
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749","description":"provide gas and token price data used when committing CCIP state.","role":".priceRegistry"}]
    }
```

```diff
    EOA  (eth:0x90f91a0fFDC93a11c045b3155F0b3cc0D9fB9ef6) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0x925f08725819ED7FA98269A92A7c14093C4395c5) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0x96d1D86b1BEd64053410FdCc2E3585EB578DdE1f) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ArbitrumToEthereumCommitStore (eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749) {
    +++ description: Arbitrum-to-Ethereum CommitStore. Its OCR commit reports publish Merkle roots for source messages; execution is possible only for leaves under roots that are both committed here and blessed by RMN through the ARM proxy.
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d","description":"provide committed Merkle roots that this OffRamp requires before executing messages.","role":".commitStore"}]
      fieldMeta.ocrConfig.description:
-        "Latest OCR2 signer and transmitter config for committing Merkle roots on this CommitStore."
+        "Commit OCR config from ConfigSet. transmit() requires exactly f+1 valid OCR signer signatures, and msg.sender must be one of the transmitters."
      fieldMeta.getStaticConfig:
+        {"description":"Immutable commit lane config: Ethereum destination selector, Arbitrum source selector, trusted Arbitrum OnRamp, and ARM/RMN proxy used for blessing checks."}
      fieldMeta.getDynamicConfig:
+        {"description":"Mutable commit config: PriceRegistry used for price updates included in commit reports."}
      fieldMeta.latestConfigDetails:
+        {"description":"Digest and config count for the currently accepted commit OCR config. Commit reports must use this digest."}
      description:
+        "Arbitrum-to-Ethereum CommitStore. Its OCR commit reports publish Merkle roots for source messages; execution is possible only for leaves under roots that are both committed here and blessed by RMN through the ARM proxy."
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d","description":"provide committed Merkle roots that this OffRamp requires before executing messages.","role":".commitStore"}]
    }
```

```diff
    EOA  (eth:0x9CA9809476bE48b7A700D50B3d10A98D993dd8A5) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xA2B7C82d2B90A4e94F0C3027c0999e4f44f4Cc9F) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xA39B7c0f08e4727c8325b4ad043513AA5185a4E2) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xa616AEEa440ECfb1AA8065a19E6E55652743B3FB) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xA69d606205419F67a46d772c66cf685971d5ceed) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xa968cf59aB2BaE618f6eE0a80EcBd5b242ebE991) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ARMProxyOwnerCanceller (eth:0xAD97C0270a243270136E40278155C12ce7C7F87B) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "ARMProxyOwnerCanceller"
    }
```

```diff
    EOA  (eth:0xb4a378C2a17f4B8D4767616b4469807223f27a26) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xc333b76845bDF806369EF0F00134559988aa985C) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xc4fd363861673327BAcFa1AeE04B9A991459a1D2) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract GhoCcipSteward (eth:0xC5BcC58BE6172769ca1a78B8A45752E3C5059c39) {
    +++ description: Aave GHO CCIP steward. It can update bridge and rate limits for the GHO Ethereum token pool only when called by the Aave Risk Council.
      description:
-        "Aave GHO CCIP steward that can update bridge and rate limits for the GHO Ethereum token pool."
+        "Aave GHO CCIP steward. It can update bridge and rate limits for the GHO Ethereum token pool only when called by the Aave Risk Council."
    }
```

```diff
    EOA  (eth:0xCbF79800f67af0f5391D49B98C63EE4E3c976E2D) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xCEED45aD0f1c8E621eef28a4643B06AF04A6dEB0) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xD29971a9eac66b42Ba5B1472204C0bcca8E15c6e) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ARMProxyOwnerGnosisSafe (eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "ARMProxyOwnerGnosisSafe"
    }
```

```diff
    EOA  (eth:0xd7d7f77069aCEF3116B6D0eDBEA48e45aCc3562e) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ARMProxyOwnerProposer (eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "ARMProxyOwnerProposer"
    }
```

```diff
    EOA  (eth:0xe24eD7652Ba5bFa1b3E8CAED4bf6065B93b734a6) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xE336C8e4B6649c82A16a7c78577169A24Baa7fff) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract ARMProxyOwnerProposer2 (eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F) {
    +++ description: None
      name:
-        "ManyChainMultiSig"
+        "ARMProxyOwnerProposer2"
    }
```

```diff
    EOA  (eth:0xe79782642B9D6a9CC8a6619d30e27BE1d761BA44) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    contract RMNRemote (eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20) {
    +++ description: RMNRemote contract behind the ARM proxy. It exposes RMN curse state and RMN 1.6 report verification. For pre-1.6 isBlessed() checks, it relays to the legacy RMN contract supplied in the constructor.
      description:
-        "Remote Risk Management Network contract used by CCIP to verify RMN reports and expose cursed subjects."
+        "RMNRemote contract behind the ARM proxy. It exposes RMN curse state and RMN 1.6 report verification. For pre-1.6 isBlessed() checks, it relays to the legacy RMN contract supplied in the constructor."
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81","description":"block or allow CCIP activity by reporting whether global or route-specific subjects are cursed.","role":".getARM"}]
+++ description: Legacy RMN contract used by RMNRemote.isBlessed() for CommitStoreV1 root blessing. This immutable constructor arg is shown explicitly and kept as a leaf; its internal signer threshold is not decoded in this discovery.
      values.legacyRMN:
+        "eth:0xdCD48419bD5Cd9d1b097695F2af4Ee125aADF84F"
      fieldMeta:
+        {"getVersionedConfig":{"description":"RMNRemote.verify() requires fSign+1 valid RMN signature. This is separate from the legacy isBlessed() passthrough used by CommitStoreV1."},"legacyRMN":{"description":"Legacy RMN contract used by RMNRemote.isBlessed() for CommitStoreV1 root blessing. This immutable constructor arg is shown explicitly and kept as a leaf; its internal signer threshold is not decoded in this discovery."},"getCursedSubjects":{"description":"Subjects currently cursed by RMNRemote. An empty list means there is no active global or route-specific curse in this contract."},"isCursed":{"description":"True when RMNRemote has an active global or legacy curse."}}
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81","description":"block or allow CCIP activity by reporting whether global or route-specific subjects are cursed.","role":".getARM"}]
    }
```

```diff
    contract ArbitrumToEthereumOffRamp (eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d) {
    +++ description: Arbitrum-to-Ethereum OffRamp. It accepts OCR execution reports, checks every message against a blessed committed Merkle root, enforces sequence and nonce rules, releases or mints tokens, and calls the Router to deliver ccipReceive() to the receiver.
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"deliver Arbitrum-to-Ethereum CCIP messages and token transfers accepted by this Router.","role":".arbitrumOffRamp"}]
      fieldMeta.ocrConfig.description:
-        "Latest OCR2 signer and transmitter config for executing messages on this OffRamp."
+        "Execution OCR config from ConfigSet. usually f+1 signers must sign message that is committed by a transmitter. This OffRamp inherits OCR2BaseNoChecks, so transmit() does not verify OCR signer signatures onchain. Acceptance is one configured transmitter plus the matching config digest; message safety comes from the blessed CommitStore proof and OffRamp execution checks."
      fieldMeta.commitStore:
+        {"description":"CommitStore whose blessed Merkle roots must prove every message executed by this OffRamp."}
      fieldMeta.getStaticConfig:
+        {"description":"Immutable inbound lane config: Ethereum destination selector and Arbitrum source selector."}
      fieldMeta.getDynamicConfig:
+        {"description":"Mutable execution config: Router, PriceRegistry, permissionless execution delay, message size and token limits, and token pool gas limit."}
      fieldMeta.latestConfigDetails:
+        {"description":"Digest and config count for the currently accepted execution OCR config. Reports must use this digest, but this field is not itself a quorum."}
      description:
+        "Arbitrum-to-Ethereum OffRamp. It accepts OCR execution reports, checks every message against a blessed committed Merkle root, enforces sequence and nonce rules, releases or mints tokens, and calls the Router to deliver ccipReceive() to the receiver."
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D","description":"deliver Arbitrum-to-Ethereum CCIP messages and token transfers accepted by this Router.","role":".arbitrumOffRamp"}]
    }
```

```diff
    EOA  (eth:0xf2c04359575b08F71629CA89E9085B2d2076E286) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xf547696fF576aeA0D2C8e41D467daD4CeE904513) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xfc038715c79Ebcf7F9ee5723E466454B21434157) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xfc0A7B612CE625c10DEbC660cD67452EBDBeC207) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

```diff
    EOA  (eth:0xFc52B2196a94D08fc9614b8039821bcE03bF58E8) {
    +++ description: None
      receivedPermissions.0.description:
-        "sign and transmit commit reports that publish Merkle roots for messages accepted by this CommitStore."
+        "sign commit reports with at least f+1 sigs and transmit them through one of the transmitter addresses."
      receivedPermissions.1.description:
-        "sign and transmit execution reports that deliver messages and release or mint tokens through this OffRamp."
+        "transmit execution reports from one of the 16 configured transmitter addresses. This OffRamp does not verify OCR signer signatures onchain; execution still requires a blessed CommitStore proof."
    }
```

Generated with discovered.json: 0x8b5f2eb06dc592680deb6deb45426af4a8307f98

# Diff at Mon, 27 Apr 2026 12:25:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1777287134

## Description

Initial discovery after revive.

## Initial discovery

```diff
+   Status: CREATED
    contract GHOEthereumTokenPool (eth:0x06179f7C1be40863405f374E7f5F8806c728660A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0x117ec8aD107976e1dBCc21717ff78407Bc36aADc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0x2F2A3e36CE5Fb0924C414BEB1D98B531Cdf17e0B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ARMProxy (eth:0x411dE17f12D1A34ecC7F45f49844626267c75e81)
    +++ description: Proxy pointing to the active ARM/RMN contract used by CCIP to report whether routes are cursed.
```

```diff
+   Status: CREATED
    contract ARMProxyOwner (eth:0x44835bBBA9D40DEDa9b64858095EcFB2693c9449)
    +++ description: Role based timelock used to administer CCIP contracts.
```

```diff
+   Status: CREATED
    contract CallProxy (eth:0x49edf594E698F406A15afEf44CE7a0Fd8d998610)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Executor (eth:0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A)
    +++ description: Aave governance executor that owns the GHO Ethereum token pool.
```

```diff
+   Status: CREATED
    contract RMNRemoteOwner (eth:0x6608920e3F6b591EC3Cf15CA1DDf66fBE117F56A)
    +++ description: Role based timelock used to administer CCIP contracts.
```

```diff
+   Status: CREATED
    contract EthereumToArbitrumOnRamp (eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0x79bC82F3931A7d017719146A822e4AD8152b157e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Router (eth:0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0x806659842cFeEE3CBEF35F8ad2eA42460574b413)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CallProxy (eth:0x82b8A19497fA25575f250a3DcFfCD2562B575A2e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0x8C00Cc7cC37396e88BbFe66371341a59D1b5771F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PriceRegistry (eth:0x8c9b2Efb7c64C394119270bfecE7f54763b958Ad)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ArbitrumToEthereumCommitStore (eth:0x9B2EEd6A1e16cB50Ed4c876D2dD69468B21b7749)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0xAD97C0270a243270136E40278155C12ce7C7F87B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GhoCcipSteward (eth:0xC5BcC58BE6172769ca1a78B8A45752E3C5059c39)
    +++ description: Aave GHO CCIP steward that can update bridge and rate limits for the GHO Ethereum token pool.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xD6597750bf74DCAEC57e0F9aD2ec998D837005bf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0xD9757aA52907798d1aF2FDa7A6C0cC733E5aCf7e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ManyChainMultiSig (eth:0xE53289F32c8E690b7173aA33affE9B6B0CB0012F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RMNRemote (eth:0xe8464c353210Cc398A45dB2454FBc5BCd25fFf20)
    +++ description: Remote Risk Management Network contract used by CCIP to verify RMN reports and expose cursed subjects.
```

```diff
+   Status: CREATED
    contract ArbitrumToEthereumOffRamp (eth:0xeFC4a18af59398FF23bfe7325F2401aD44286F4d)
    +++ description: None
```
