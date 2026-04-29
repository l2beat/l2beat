Generated with discovered.json: 0x6f32a3a63a8285870da7dcd6e25b905ddb90b393

# Diff at Tue, 28 Apr 2026 10:00:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f7f6f213cad5e56b3adf52a416d571e104063136 block: 1777285916
- current timestamp: 1777285916

## Description

tidy up config after ai changes and make it FE-ready.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777285916 (main branch discovery), not current.

```diff
    contract EndpointV2 (eth:0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: Part of the LayerZero messaging protocol. The rsETH OFT adapter owner can configure custom receive libraries and verification settings here.
+++ description: The send MessageLib used by the Ethereum rsETH OFT adapter for messages to its Unichain peer.
      values.rsETHSendLibraryToUnichain:
+        "eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1"
      fieldMeta.rsETHSendLibraryToUnichain:
+        {"description":"The send MessageLib used by the Ethereum rsETH OFT adapter for messages to its Unichain peer."}
    }
```

```diff
    contract Horizen DVN (eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D) {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      name:
-        "DVN"
+        "Horizen DVN"
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","description":"verify rsETH OFT messages sent to Unichain through LayerZero.","role":".getUlnConfig"}
    }
```

```diff
    contract LayerZero DVN (eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b) {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      name:
-        "DVN"
+        "LayerZero DVN"
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","description":"verify rsETH OFT messages sent to Unichain through LayerZero.","role":".getUlnConfig"}
    }
```

```diff
    contract RsETHOFTAdapter (eth:0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3) {
    +++ description: An OApp in the LayerZero protocol that adapts an existing ERC20 token into the OFT standard. Its owner can configure peers and LayerZero security settings for connected routes.
      values.isUnichainPeer:
-        true
+++ description: The configured peer for the rsETH OFT route from Unichain.
      values.peerUnichain:
-        "0x000000000000000000000000c3eacf0612346366db554c991d7858716db09f58"
+        "unichain:0xc3eACf0612346366Db554C991D7858716db09f58"
      fieldMeta.isUnichainPeer:
-        {"description":"True if the configured Unichain rsETH OFT peer matches 0xc3eacf0612346366db554c991d7858716db09f58."}
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"unichain"}}]
    }
```

```diff
    contract Canary DVN (eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd) {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      name:
-        "DVN"
+        "Canary DVN"
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","description":"verify rsETH OFT messages sent to Unichain through LayerZero.","role":".getUlnConfig"}
    }
```

```diff
    contract Netherming DVN (eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5) {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      name:
-        "DVN"
+        "Netherming DVN"
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","description":"verify rsETH OFT messages sent to Unichain through LayerZero.","role":".getUlnConfig"}
    }
```

```diff
    contract LayerZero Multisig (eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478) {
    +++ description: Custom multisignature contract allowing offchain signing and execution on multiple target chains.
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D","description":"configure the settings of this library, affecting all OApps that have not set up a custom security config.","role":".owner"}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","description":"configure the settings of this library, affecting all OApps that have not set up a custom security config.","role":".owner"}
    }
```

```diff
    contract ReceiveUln302 (eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2) {
    +++ description: LayerZero-deployed receive library, defining the validation of received messages.
      description:
-        "Receive Library used by LayerZero, defining the validation of received messages."
+        "LayerZero-deployed receive library, defining the validation of received messages."
    }
```

```diff
    contract GnosisSafe (eth:0xCbcdd778AA25476F203814214dD3E9b9c46829A1) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x1a44076050125825900e736c501f859c50fE728c","description":"manage all settings of the LZ crosschain security stack for the respective OApp: change libraries, DVN configs etc.","role":".rsETHAdapterDelegate"}
    }
```

```diff
+   Status: CREATED
    contract Executor (eth:0x173272739Bd7Aa6e4e214714048a9fE699453059)
    +++ description: Used to execute LayerZero message payloads at the destination. Also manages fee logic, gas drop and access control.
```

```diff
+   Status: CREATED
    contract ReadLib1002 (eth:0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D)
    +++ description: LayerZero library used to read state from remote blockchains.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SendUln302 (eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1)
    +++ description: Send Library used by LayerZero, defining the protocol/execution of sent messages.
```

Generated with discovered.json: 0x2ffa2e0cfb0f905386edf2abd6df024d42aa356d

# Diff at Mon, 27 Apr 2026 10:38:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1777285916

## Description

initial ai-disco with skill after revive.

## Initial discovery

```diff
+   Status: CREATED
    contract EndpointV2 (eth:0x1a44076050125825900e736c501f859c50fE728c)
    +++ description: Part of the LayerZero messaging protocol. The rsETH OFT adapter owner can configure custom receive libraries and verification settings here.
```

```diff
+   Status: CREATED
    contract BlockedMessageLib (eth:0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862)
    +++ description: Simple LayerZero library that blocks all messages if configured.
```

```diff
+   Status: CREATED
    contract DVN (eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

```diff
+   Status: CREATED
    contract DVN (eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

```diff
+   Status: CREATED
    contract RsETHOFTAdapter (eth:0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3)
    +++ description: An OApp in the LayerZero protocol that adapts an existing ERC20 token into the OFT standard. Its owner can configure peers and LayerZero security settings for connected routes.
```

```diff
+   Status: CREATED
    contract DVN (eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

```diff
+   Status: CREATED
    contract DVN (eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

```diff
+   Status: CREATED
    contract LayerZero Multisig (eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478)
    +++ description: Custom multisignature contract allowing offchain signing and execution on multiple target chains.
```

```diff
+   Status: CREATED
    contract ReceiveUln302 (eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2)
    +++ description: Receive Library used by LayerZero, defining the validation of received messages.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xCbcdd778AA25476F203814214dD3E9b9c46829A1)
    +++ description: None
```
