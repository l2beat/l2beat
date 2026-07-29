Generated with discovered.json: 0x479d6b65bb1111ff43d5e53f296377575a5a2e4d

# Diff at Thu, 23 Jul 2026 13:56:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@efd03446560a8d585747f124c71622cbfa33fca4 block: 1784274500
- current timestamp: 1784814910

## Description

One Safe signer was rotated.

## Watched changes

```diff
    contract GnosisSafe (eth:0xCbcdd778AA25476F203814214dD3E9b9c46829A1) [GnosisSafe] {
    +++ description: None
      values.$members.3:
-        "eth:0x86CbBAEB08861D005fD2147A5123E43e558db167"
+        "eth:0xb859DD2Cb50F19a53Ad25b279750ba5DEC76D306"
    }
```

Generated with discovered.json: 0x15dc33d0d7a05c4ded07820ef7b4984f3277674b

# Diff at Fri, 17 Jul 2026 07:49:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5a5b552776f13efe49c744667945e52e0a8f9718 block: 1781603942
- current timestamp: 1784274500

## Description

Single signer change.

## Watched changes

```diff
    contract GnosisSafe (eth:0xCbcdd778AA25476F203814214dD3E9b9c46829A1) [GnosisSafe] {
    +++ description: None
      values.$members.5:
-        "eth:0xFbF8084Fb81da2e24f9EdD821172efef1b74F218"
+        "eth:0xa85B57bD7433dCC4679d638b87d80F155A689Fc1"
    }
```

Generated with discovered.json: 0x4a58a3500fa2244c29fda481586d2a127c8f7207

# Diff at Tue, 16 Jun 2026 10:00:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b8fe7ad12211d67626f7d23839b5be1f7ba15bb5 block: 1777285916
- current timestamp: 1781603942

## Description

Unichain peer blocked in ethereum rsETH OApp.

## Watched changes

```diff
    contract RsETHOFTAdapter (eth:0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3) [layerzero/OFTAdapter] {
    +++ description: An OApp in the LayerZero protocol that adapts an existing ERC20 token into the OFT standard. Its owner can configure peers and LayerZero security settings for connected routes.
+++ description: The configured peer for the rsETH OFT route from Unichain.
      values.peerUnichain:
-        "unichain:0xc3eACf0612346366Db554C991D7858716db09f58"
+        "unichain:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x9921aa9eaabd740f707a49d2755d084d0b189441

# Diff at Fri, 12 Jun 2026 10:18:53 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6a183e6009109d4e62087499f44eca4aceea9086 block: 1777285916
- current timestamp: 1777285916

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777285916 (main branch discovery), not current.

```diff
    EOA  (eth:0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
      eoaWithUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0xfcde0409fb986436d88dc3c24c25b3f1d0cff1fd

# Diff at Mon, 11 May 2026 11:10:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@16c27951daab8bc6e3065fb400714a6b714e9f73 block: 1777285916
- current timestamp: 1777285916

## Description

Config: some adjustments before publishing to FE.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777285916 (main branch discovery), not current.

```diff
    contract Executor (eth:0x173272739Bd7Aa6e4e214714048a9fE699453059) [layerzero/LayerZeroExecutor] {
    +++ description: Contract that can be used to execute LayerZero message payloads at the destination. Also manages fee logic, gas drop and permissioned addresses who can call this contract.
      description:
-        "Used to execute LayerZero message payloads at the destination. Also manages fee logic, gas drop and access control."
+        "Contract that can be used to execute LayerZero message payloads at the destination. Also manages fee logic, gas drop and permissioned addresses who can call this contract."
      receivedPermissions.0.description:
-        "execute rsETH OFT messages sent to Unichain through LayerZero."
+        "receive execution fees for rsETH OFT messages sent to Unichain through LayerZero."
    }
```

```diff
    contract EndpointV2 (eth:0x1a44076050125825900e736c501f859c50fE728c) [layerzero/EndpointV2] {
    +++ description: Part of the LayerZero messaging protocol. OApp owners or their delegates can configure custom verification- (message libraries) and execution settings here.
      description:
-        "Part of the LayerZero messaging protocol. The rsETH OFT adapter owner can configure custom receive libraries and verification settings here."
+        "Part of the LayerZero messaging protocol. OApp owners or their delegates can configure custom verification- (message libraries) and execution settings here."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract BlockedMessageLib (eth:0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) [layerzero/BlockedMessageLib] {
    +++ description: Simple LayerZero library that blocks all messages if selected.
      description:
-        "Simple LayerZero library that blocks all messages if configured."
+        "Simple LayerZero library that blocks all messages if selected."
    }
```

```diff
    contract Horizen DVN (eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D) [layerzero/DVN] {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      receivedPermissions.0.description:
-        "verify rsETH OFT messages sent to Unichain through LayerZero."
+        "receive validation fees for rsETH OFT messages sent to Unichain through LayerZero (the incoming vaidating DVN is defined on Unichain)."
    }
```

```diff
    contract LayerZero DVN (eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b) [layerzero/DVN] {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      receivedPermissions.0.description:
-        "verify rsETH OFT messages sent to Unichain through LayerZero."
+        "receive validation fees for rsETH OFT messages sent to Unichain through LayerZero (the incoming vaidating DVN is defined on Unichain)."
    }
```

```diff
    EOA  (eth:0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
      receivedPermissions:
+        [{"permission":"upgrade","from":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059","role":"admin","via":[{"address":"eth:0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3","role":".owner"}]
    }
```

```diff
    contract RsETHOFTAdapter (eth:0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3) [layerzero/OFTAdapter] {
    +++ description: An OApp in the LayerZero protocol that adapts an existing ERC20 token into the OFT standard. Its owner can configure peers and LayerZero security settings for connected routes.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract ProxyAdmin (eth:0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) [global/ProxyAdmin] {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059","role":"admin"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059","role":"admin"}]
    }
```

```diff
    contract Canary DVN (eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd) [layerzero/DVN] {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      receivedPermissions.0.description:
-        "verify rsETH OFT messages sent to Unichain through LayerZero."
+        "receive validation fees for rsETH OFT messages sent to Unichain through LayerZero (the incoming vaidating DVN is defined on Unichain)."
    }
```

```diff
    contract Netherming DVN (eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5) [layerzero/DVN] {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      receivedPermissions.0.description:
-        "verify rsETH OFT messages sent to Unichain through LayerZero."
+        "receive validation fees for rsETH OFT messages sent to Unichain through LayerZero (the incoming vaidating DVN is defined on Unichain)."
    }
```

```diff
    contract ReceiveUln302 (eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2) [layerzero/ReceiveUln302] {
    +++ description: LayerZero-deployed receive library, defining the validation of received messages.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x9c1f5c9c507af35f5cc76855285ee1d66e8277b5

# Diff at Fri, 08 May 2026 07:51:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1777285916
- current timestamp: 1777285916

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777285916 (main branch discovery), not current.

```diff
    contract Executor (eth:0x173272739Bd7Aa6e4e214714048a9fE699453059) [layerzero/LayerZeroExecutor] {
    +++ description: Used to execute LayerZero message payloads at the destination. Also manages fee logic, gas drop and access control.
      sourceHashes.1:
-        "0x6e8f82f43688d48f99f42fc176fd1250c7e5b217d551c5482e0dd168744017bf"
+        "0x914fbceaba4b6418a09bd2104433bfcb47eed119a783154a8f7f6301c06a6d2b"
    }
```

```diff
    contract EndpointV2 (eth:0x1a44076050125825900e736c501f859c50fE728c) [layerzero/EndpointV2] {
    +++ description: Part of the LayerZero messaging protocol. The rsETH OFT adapter owner can configure custom receive libraries and verification settings here.
      sourceHashes.0:
-        "0x399160e7d36a21fca31097d7875daed8f421f788b77f2a71974d51938c3ea520"
+        "0x48b52fa395fcfec46c79e54baead635a6ab7d473cd9194eb5085ae4c92dc3b56"
    }
```

```diff
    contract BlockedMessageLib (eth:0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) [layerzero/BlockedMessageLib] {
    +++ description: Simple LayerZero library that blocks all messages if configured.
      sourceHashes.0:
-        "0xf00c4e5b1b0f8da8f50ec8b06aa9f6c7275c5f03398e8b607c0ed093e7c4fe40"
+        "0x75d37f7b316a2accab28129969c0434143f38f945ef4dc05ae6e2d32a2253567"
    }
```

```diff
    contract Horizen DVN (eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D) [layerzero/DVN] {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      sourceHashes.0:
-        "0x67b975b3ef00e71be27727f49933e41872aa848504565806e3e3482a2245f99c"
+        "0xe14c8b49fee1ac4a89c3a3335072e4e7713ef67747686d0d8a5a70b1297ef7e8"
    }
```

```diff
    contract LayerZero DVN (eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b) [layerzero/DVN] {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      sourceHashes.0:
-        "0x67b975b3ef00e71be27727f49933e41872aa848504565806e3e3482a2245f99c"
+        "0xe14c8b49fee1ac4a89c3a3335072e4e7713ef67747686d0d8a5a70b1297ef7e8"
    }
```

```diff
    contract ReadLib1002 (eth:0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D) [layerzero/ReadLib1002] {
    +++ description: LayerZero library used to read state from remote blockchains.
      sourceHashes.0:
-        "0xf7800be6fd99520201da1404c35bac8a1ed826bbc2134f0a77547e0d7a74c9c1"
+        "0x63667c2b85a023336c85af02869d5f3dbf9f789566540354555921e0c204c589"
    }
```

```diff
    contract RsETHOFTAdapter (eth:0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3) [layerzero/OFTAdapter] {
    +++ description: An OApp in the LayerZero protocol that adapts an existing ERC20 token into the OFT standard. Its owner can configure peers and LayerZero security settings for connected routes.
      sourceHashes.0:
-        "0x846cd86e3fbb7c7164e6107fcf83b92b24b0f4cf399c4b7b39e01cc88f44c91a"
+        "0x8e747ea537f6ad5dadfeed406255d8ac95c47880198374a17bd470328a673974"
    }
```

```diff
    contract Canary DVN (eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd) [layerzero/DVN] {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      sourceHashes.0:
-        "0x6891d5860b39102382c883ddfe5fb9bce9b432c06b70c867ea830ab74e5755a5"
+        "0x15af06d40884e87fb02496ccba2e672b9d7029e4a65d508bc519c657981216f9"
    }
```

```diff
    contract Netherming DVN (eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5) [layerzero/DVN] {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      sourceHashes.0:
-        "0x67b975b3ef00e71be27727f49933e41872aa848504565806e3e3482a2245f99c"
+        "0xe14c8b49fee1ac4a89c3a3335072e4e7713ef67747686d0d8a5a70b1297ef7e8"
    }
```

```diff
    contract SendUln302 (eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) [layerzero/SendUln302] {
    +++ description: Send Library used by LayerZero, defining the protocol/execution of sent messages.
      sourceHashes.0:
-        "0x159d8f84a5100285a7401e1ccb3d40a64fe944d9beb951c81749de40279a5876"
+        "0xed0d939d416a37a8dd5608191bbb9c6ae79642d6a707cbaa8ae0ed3877499037"
    }
```

```diff
    contract LayerZero Multisig (eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478) [layerzero/OneSigMultisig] {
    +++ description: Custom multisignature contract allowing offchain signing and execution on multiple target chains.
      sourceHashes.0:
-        "0x6a2feeb0055614ee29c746b6052e64dc677ffa602b25dfeb74cbf948bc6d9b74"
+        "0x412a3c42c1e7d8239049258ff828a77b62ab1822711221e5a276d4572edbfe49"
    }
```

```diff
    contract ReceiveUln302 (eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2) [layerzero/ReceiveUln302] {
    +++ description: LayerZero-deployed receive library, defining the validation of received messages.
      sourceHashes.0:
-        "0x3904c78c7b0abf91f9544ebb9f08f2d2bc83028df65c912a7f7a6ca1ca109dde"
+        "0xc8412ab2ff002dd3b40a167c6532c54e7cb46c1f0718bfaf038f211e3a333a07"
    }
```

```diff
    contract GnosisSafe (eth:0xCbcdd778AA25476F203814214dD3E9b9c46829A1) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

Generated with discovered.json: 0xda3ab97bf056cfe55e85d7721b344b77a1e81ba6

# Diff at Tue, 05 May 2026 10:22:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1777285916
- current timestamp: 1777285916

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777285916 (main branch discovery), not current.

```diff
    contract Executor (eth:0x173272739Bd7Aa6e4e214714048a9fE699453059) {
    +++ description: Used to execute LayerZero message payloads at the destination. Also manages fee logic, gas drop and access control.
      deployerAddress:
+        "eth:0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
    }
```

```diff
    contract EndpointV2 (eth:0x1a44076050125825900e736c501f859c50fE728c) {
    +++ description: Part of the LayerZero messaging protocol. The rsETH OFT adapter owner can configure custom receive libraries and verification settings here.
      deployerAddress:
+        "eth:0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
    }
```

```diff
    contract BlockedMessageLib (eth:0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862) {
    +++ description: Simple LayerZero library that blocks all messages if configured.
      deployerAddress:
+        "eth:0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
    }
```

```diff
    contract Horizen DVN (eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D) {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      deployerAddress:
+        "eth:0xB52Fa54FC261398058c3Ac7B8dD442D7d8B9F0B6"
    }
```

```diff
    contract LayerZero DVN (eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b) {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      deployerAddress:
+        "eth:0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
    }
```

```diff
    contract ReadLib1002 (eth:0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D) {
    +++ description: LayerZero library used to read state from remote blockchains.
      deployerAddress:
+        "eth:0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
    }
```

```diff
    contract RsETHOFTAdapter (eth:0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3) {
    +++ description: An OApp in the LayerZero protocol that adapts an existing ERC20 token into the OFT standard. Its owner can configure peers and LayerZero security settings for connected routes.
      deployerAddress:
+        "eth:0x1f7A03b70C5448DFd0a2C5a7865169253c2C769b"
    }
```

```diff
    contract ProxyAdmin (eth:0xa36797bA947b378AefE5f726Cd87766CD3c25Ee3) {
    +++ description: None
      deployerAddress:
+        "eth:0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
    }
```

```diff
    contract Canary DVN (eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd) {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      deployerAddress:
+        "eth:0xB52Fa54FC261398058c3Ac7B8dD442D7d8B9F0B6"
    }
```

```diff
    contract Netherming DVN (eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5) {
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
      deployerAddress:
+        "eth:0xB52Fa54FC261398058c3Ac7B8dD442D7d8B9F0B6"
    }
```

```diff
    contract SendUln302 (eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1) {
    +++ description: Send Library used by LayerZero, defining the protocol/execution of sent messages.
      deployerAddress:
+        "eth:0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
    }
```

```diff
    contract LayerZero Multisig (eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478) {
    +++ description: Custom multisignature contract allowing offchain signing and execution on multiple target chains.
      deployerAddress:
+        "eth:0x39f86ECef62c5bcE23428d6b7c7050D9Ecb0e346"
    }
```

```diff
    contract ReceiveUln302 (eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2) {
    +++ description: LayerZero-deployed receive library, defining the validation of received messages.
      deployerAddress:
+        "eth:0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
    }
```

```diff
    contract GnosisSafe (eth:0xCbcdd778AA25476F203814214dD3E9b9c46829A1) {
    +++ description: None
      deployerAddress:
+        "eth:0x7AAd74b7f0d60D5867B59dbD377a71783425af47"
    }
```

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
