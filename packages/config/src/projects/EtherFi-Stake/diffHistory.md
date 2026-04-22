Generated with discovered.json: 0x2344663d41b1d5d68e9aa03af2af09eeaefc44be

# Diff at Wed, 22 Apr 2026 11:44:22 GMT:

- author: emduc (<emilien.duc@gmail.com>)
- comparing to: main@9f6ef61ffbc1570472cddaaa628cad0c781ce23e block: 1776762035
- current timestamp: 1776858023

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract GnosisSafe (eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC) {
    +++ description: None
      values.$members.0:
+        "eth:0xDE3bf1FA3B3829342bC4356592Bb7CF3BAAD8264"
      values.$members.1:
+        "eth:0xE63794CF405678382764A4dEc1e56C43B45605C9"
      values.$threshold:
-        3
+        4
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "4 of 7 (57%)"
    }
```

```diff
    contract EtherfiOFTAdapterUpgradeable (eth:0xcd2eb13D6831d4602D80E5db9230A57596CDCA63) {
    +++ description: None
      values.layerZeroConfig.perEid.30102.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30106.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30111.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30165.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30183.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30184.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30214.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30243.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30260.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30320.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30322.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30332.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30335.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30339.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30362.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30367.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30383.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30390.receiveLibraryIsDefault:
-        true
+        false
      values.layerZeroConfig.perEid.30396.receiveLibraryIsDefault:
-        true
+        false
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1776762035 (main branch discovery), not current.

```diff
    contract AuctionManager (eth:0x00C452aFFee3a17d9Cecc1Bcd2B8d5C7635C4CB9) {
    +++ description: None
      values.admins.0:
+        "eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705"
      values.admins.1:
+        "eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"
      values.admins.2:
+        "eth:0x9f26d4C958fD811A1F59B01B86Be7dFFc9d20761"
    }
```

```diff
    contract EtherFiRestaker (eth:0x1B7a4C3797236A1C37f8741c0Be35c2c72736fFf) {
    +++ description: None
      values.admins.0:
+        "eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"
    }
```

```diff
    contract MembershipManager (eth:0x3d320286E014C3e1ce99Af6d6B00f0C1D63E3000) {
    +++ description: None
      values.admins.0:
+        "eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705"
      values.admins.1:
+        "eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"
      values.admins.2:
+        "eth:0x9f26d4C958fD811A1F59B01B86Be7dFFc9d20761"
    }
```

```diff
    contract EtherFiOracle (eth:0x57AaF0004C716388B21795431CD7D5f9D3Bb6a41) {
    +++ description: None
      values.admins.0:
+        "eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705"
      values.admins.1:
+        "eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"
      values.admins.2:
+        "eth:0x9f26d4C958fD811A1F59B01B86Be7dFFc9d20761"
    }
```

```diff
    contract RoleRegistry (eth:0x62247D29B4B9BECf4BB73E0c722cf6445cfC7cE9) {
    +++ description: None
      values.roles.0x0e8d94121b3383f03d9ae60b39295aa793469d7230d51a3f62cbf47cd45481d9:
-        ["eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705","eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a"]
      values.roles.0xf63b1ce674d2cec0dbfcdcc7e504ce31a335c457c363b9fafb6ca524addf1775:
-        ["eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a"]
      values.roles.0xdf341d2a9af804fa0099198f83a0a0611aa273a03b36d576993f914e695dff2a:
-        ["eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705","eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a"]
      values.roles.0x1fa5f863eb8a62c868fa7eb98a4e47ded14913e6885050cfd9090d04516345b0:
-        ["eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a"]
      values.roles.0xb72d40a29b0ca5ab6e0b32830618dfdcae56fae676396ff1f7c3fede659935c8:
-        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC","eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705"]
      values.roles.0xe6ff4398839854a2087720a46165c7be195bc9de6f7a3c5a977d3b6917b76af2:
-        ["eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705","eth:0x9AF1298993DC1f397973C62A5D47a284CF76844D","eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"]
      values.roles.0xe9d356a03911100a5418b1829f363128136c30112754cb3dbe73b1674abe2ac8:
-        ["eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.0x4fb62203ff7abbe51d8c53865ac09965620ebfa150bfb9e0d3c26869f5c43935:
-        ["eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.0xa9e662c125cda0e0d367a277c57f51ca0b3a9ddb823ca7717301532d10b2b0f8:
-        ["eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a","eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.0xa2a38b453c00b96e25a6611741c0fa71b17f9f21f28c0d5e77c008a31c1949ba:
-        ["eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a"]
      values.roles.0x25f713693dd3e84995d0d9964722b195ad1b60efe6253e8fa19b8e74f9a6602a:
-        ["eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a","eth:0x7835fB36A8143a014A2c381363cD1A4DeE586d2A"]
      values.roles.0x59182b0a43541702fc3e73f22a962f8f868277e76091a99c516d2982b9df2f90:
-        ["eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a","eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F","eth:0x25e821b7197B146F7713C3b89B6A4D83516B912d"]
      values.roles.0xc6ace799356a5a236ccaa6708c68b77b7de838b1700b6e0c40f48a1407a5eef0:
-        ["eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705"]
      values.roles.0x06b452e947f709c0549c7a2e857f0d57f53a00c27bb826a3340a48774a76512f:
-        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"]
      values.roles.0x140ee46da08400488949dfb48bdfc7c0502610f6a6203d169743d6b9e776a0be:
-        ["eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.0xf2c32172f8adc08057d18fb6422b871bd95592f20a6ab72ebf7963209047f50c:
-        ["eth:0x7835fB36A8143a014A2c381363cD1A4DeE586d2A"]
      values.roles.0xeb260b9ff913fc1877c5f4dad9a2de53d4add5c5bf95e630342a54ad228cdb5f:
-        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"]
      values.roles.0xb56db3e3aaf390cabc1ed5bc88c1fb620c033c618c569e3902254bcef71cf54c:
-        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"]
      values.roles.0x20e7d93f475a4a8dd621285797dd2d68da59e4450b89aea5ca9bf079e95c1db5:
-        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC","eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.0xcae8f60415c61e4b3a46975038089b058a1a802ec6912db2cb8b95d5d09dcb74:
-        ["eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.0x623ac534141a3de3d1e20f924b4a3b115aa68dc5b00452321cda0323932459ab:
-        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC","eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.0x8c7b9778e52066fde8fbd3e25c5180a9726e067622ca2cb96db1c1225b4c827b:
-        ["eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.0x756a7536f06e7e4456636342cf02e0825db97b9bbbcbe5142795cc76b4eeea14:
-        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"]
      values.roles.0x9fad9ee19c69fc6a5f3a9ebfef13b0ed2faeb808252a4bb01f970bb4012ffa15:
-        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"]
      values.roles.0x39730a843a472e74e79db13c62de74d1602801e7cfce5acb9837f64a50ff5f4b:
-        ["eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.LIQUIDITY_POOL_ADMIN_ROLE:
+        ["eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705","eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a"]
      values.roles.ETHERFI_ORACLE_EXECUTOR_ADMIN_ROLE:
+        ["eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a"]
      values.roles.WITHDRAW_REQUEST_NFT_ADMIN_ROLE:
+        ["eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705","eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a"]
      values.roles.ETHERFI_REDEMPTION_MANAGER_ADMIN_ROLE:
+        ["eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a"]
      values.roles.PROTOCOL_UNPAUSER:
+        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC","eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705"]
      values.roles.PROTOCOL_PAUSER:
+        ["eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705","eth:0x9AF1298993DC1f397973C62A5D47a284CF76844D","eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"]
      values.roles.ETHERFI_ORACLE_EXECUTOR_TASK_MANAGER_ROLE:
+        ["eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.IMPLICIT_FEE_CLAIMER_ROLE:
+        ["eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.STAKING_MANAGER_NODE_CREATOR_ROLE:
+        ["eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a","eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.ETHERFI_NODES_MANAGER_ADMIN_ROLE:
+        ["eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a"]
      values.roles.ETHERFI_NODES_MANAGER_CALL_FORWARDER_ROLE:
+        ["eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a","eth:0x7835fB36A8143a014A2c381363cD1A4DeE586d2A"]
      values.roles.ETHERFI_NODES_MANAGER_EIGENLAYER_ADMIN_ROLE:
+        ["eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a","eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F","eth:0x25e821b7197B146F7713C3b89B6A4D83516B912d"]
      values.roles.LIQUIDITY_POOL_VALIDATOR_APPROVER_ROLE:
+        ["eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705"]
      values.roles.EETH_OPERATING_ADMIN_ROLE:
+        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"]
      values.roles.ETHERFI_NODES_MANAGER_EL_TRIGGER_EXIT_ROLE:
+        ["eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.ETHERFI_NODES_MANAGER_POD_PROVER_ROLE:
+        ["eth:0x7835fB36A8143a014A2c381363cD1A4DeE586d2A"]
      values.roles.STAKING_MANAGER_ADMIN_ROLE:
+        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"]
      values.roles.ETHERFI_RATE_LIMITER_ADMIN_ROLE:
+        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"]
      values.roles.LIQUIDITY_POOL_VALIDATOR_CREATOR_ROLE:
+        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC","eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.STAKING_MANAGER_VALIDATOR_INVALIDATOR_ROLE:
+        ["eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.ETHERFI_NODES_MANAGER_EL_CONSOLIDATION_ROLE:
+        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC","eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.ETHERFI_NODES_MANAGER_LEGACY_LINKER_ROLE:
+        ["eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
      values.roles.PRIORITY_WITHDRAWAL_QUEUE_ADMIN_ROLE:
+        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"]
      values.roles.PRIORITY_WITHDRAWAL_QUEUE_WHITELIST_MANAGER_ROLE:
+        ["eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"]
      values.roles.PRIORITY_WITHDRAWAL_QUEUE_REQUEST_MANAGER_ROLE:
+        ["eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"]
    }
```

```diff
    contract Liquifier (eth:0x9FFDF407cDe9a93c47611799DA23924Af3EF764F) {
    +++ description: None
      values.admins.0:
+        "eth:0x12582A27E5e19492b4FcD194a60F8f5e1aa31B0F"
      values.admins.1:
+        "eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"
      values.admins.2:
+        "eth:0x9f26d4C958fD811A1F59B01B86Be7dFFc9d20761"
    }
```

```diff
    contract MembershipNFT (eth:0xb49e4420eA6e35F98060Cd133842DbeA9c27e479) {
    +++ description: None
      values.admins.0:
+        "eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"
      values.admins.1:
+        "eth:0x9f26d4C958fD811A1F59B01B86Be7dFFc9d20761"
    }
```

```diff
    contract EtherfiOFTAdapterUpgradeable (eth:0xcd2eb13D6831d4602D80E5db9230A57596CDCA63) {
    +++ description: None
      values.layerZeroConfig:
+        {"perEid":{"30102":{"peer":"0x00000000000000000000000004c0599ae5a44757c0af6f9ec3b93da8976c150a","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30106":{"peer":"0x000000000000000000000000a3d68b74bf0528fdd07263c60d6488749044914b","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30111":{"peer":"0x0000000000000000000000005a7facb970d094b6c7ff1df0ea68d99e6e73cbff","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30165":{"peer":"0x000000000000000000000000c1fa6e2e8667d9be0ca938a54c7e0285e9df924a","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30183":{"peer":"0x0000000000000000000000001bf74c010e6320bab11e2e5a532b5ac15e0b8aa6","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30184":{"peer":"0x00000000000000000000000004c0599ae5a44757c0af6f9ec3b93da8976c150a","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30214":{"peer":"0x00000000000000000000000001f0a31698c4d065659b9bdc21b3610292a1c506","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30243":{"peer":"0x00000000000000000000000004c0599ae5a44757c0af6f9ec3b93da8976c150a","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30260":{"peer":"0x00000000000000000000000004c0599ae5a44757c0af6f9ec3b93da8976c150a","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30320":{"peer":"0x0000000000000000000000007dcc39b4d1c53cb31e1abc0e358b43987fef80f7","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30322":{"peer":"0x0000000000000000000000007dcc39b4d1c53cb31e1abc0e358b43987fef80f7","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30332":{"peer":"0x000000000000000000000000a3d68b74bf0528fdd07263c60d6488749044914b","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30335":{"peer":"0x000000000000000000000000a6cb988942610f6731e664379d15ffcfbf282b44","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30339":{"peer":"0x000000000000000000000000a3d68b74bf0528fdd07263c60d6488749044914b","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30362":{"peer":"0x0000000000000000000000007dcc39b4d1c53cb31e1abc0e358b43987fef80f7","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30367":{"peer":"0x000000000000000000000000a3d68b74bf0528fdd07263c60d6488749044914b","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30383":{"peer":"0x000000000000000000000000a3d68b74bf0528fdd07263c60d6488749044914b","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30390":{"peer":"0x000000000000000000000000a3d68b74bf0528fdd07263c60d6488749044914b","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}},"30396":{"peer":"0x00000000000000000000000060a08269e5f3406d8fd7892567d53188c7f75009","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"45","requiredDVNCount":4,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D","eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"enforcedOptions":{"send":"0x00030100110100000000000000000000000000029810","sendAndCall":"0x00030100110100000000000000000000000000029810"}}},"delegate":"eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"}
    }
```

```diff
    contract NodeOperatorManager (eth:0xd5edf7730ABAd812247F6F54D7bd31a52554e35E) {
    +++ description: None
      values.admins.0:
+        "eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"
      values.admins.1:
+        "eth:0x9f26d4C958fD811A1F59B01B86Be7dFFc9d20761"
    }
```

```diff
    contract EtherfiL1SyncPoolETH (eth:0xD789870beA40D056A4d26055d0bEFcC8755DA146) {
    +++ description: None
      values.layerZeroConfig:
+        {"perEid":{"30111":{"peer":"0x000000000000000000000000c9475e18e2c5c26ea6adcd55fabe07920bea887e","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"15","requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"64","requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]}},"30183":{"peer":"0x000000000000000000000000823106e745a62d0c2fc4d27644c62ade946d9cca","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"10","requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"10","requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]}},"30184":{"peer":"0x000000000000000000000000c38e046dfdadf15f7f56853674242888301208a5","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"15","requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"10","requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc"],"optionalDVNs":[]}},"30214":{"peer":"0x000000000000000000000000750cf0fd3bc891d8d864b732bc4ad340096e5e68","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"15","requiredDVNCount":1,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x747C741496a507E4B404b50463e691A8d692f6Ac"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"64","requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]}},"30243":{"peer":"0x00000000000000000000000052c4221cb805479954cde5accff8c4dcaf96623b","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"64","requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"64","requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]}},"30362":{"peer":"0x000000000000000000000000c9475e18e2c5c26ea6adcd55fabe07920bea887e","sendLibrary":"eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1","sendUlnConfig":{"confirmations":"15","requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]},"executorConfig":{"maxMessageSize":10000,"executor":"eth:0x173272739Bd7Aa6e4e214714048a9fE699453059"},"receiveLibrary":"eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2","receiveLibraryIsDefault":true,"receiveUlnConfig":{"confirmations":"10","requiredDVNCount":2,"optionalDVNCount":0,"optionalDVNThreshold":0,"requiredDVNs":["eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b","eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5"],"optionalDVNs":[]}}},"delegate":"eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC"}
    }
```

```diff
+   Status: CREATED
    contract Executor (eth:0x173272739Bd7Aa6e4e214714048a9fE699453059)
    +++ description: Used to execute LayerZero message payloads at the destination. Also manages fee logic, gas drop and access control.
```

```diff
+   Status: CREATED
    contract DVN (eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

```diff
+   Status: CREATED
    contract DeadDVN (eth:0x747C741496a507E4B404b50463e691A8d692f6Ac)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DVN (eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

```diff
+   Status: CREATED
    contract SendUln302 (eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1)
    +++ description: Send Library used by LayerZero, defining the protocol/execution of sent messages.
```

```diff
+   Status: CREATED
    contract ReceiveUln302 (eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2)
    +++ description: Receive Library used by LayerZero, defining the validation of received messages.
```

```diff
+   Status: CREATED
    contract VerifierNetwork (eth:0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

Generated with discovered.json: 0x6c78b1de78b1595fd402dc4f78812956c5c84bda

# Diff at Wed, 08 Apr 2026 08:42:32 GMT:

- author: emduc (<emilien.duc@gmail.com>)
- comparing to: main@577ce5b9a22649eba768a89dcb26e9f40990df5b block: 1774688591
- current timestamp: 1775637579

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract Vyper_contract (eth:0xBfAb6FA95E0091ed66058ad493189D2cB29385E6) {
    +++ description: None
      values.admin_balances.0:
-        230599886829358
+        640232252197488
      values.admin_balances.1:
-        175730753603960
+        564090356065958
      values.balances.0:
-        "1009996162144526296"
+        "1081299693031029105"
      values.balances.1:
-        "2673432080092081850"
+        "2607705482615051985"
      values.ema_price:
-        "997255269302795731"
+        "997260620964330675"
      values.get_p:
-        "996678671783877696"
+        "997177654201818088"
      values.get_virtual_price:
-        "1123206674514993276"
+        "1124036046762176606"
      values.last_price:
-        "996678576133890041"
+        "997177642018571424"
      values.ma_last_time:
-        1774681811
+        1775620775
      values.price_oracle:
-        "996678805648417329"
+        "997177642018883209"
      values.stored_rates.1:
-        "1093916419794000000"
+        "1094745335904000000"
      values.totalSupply:
-        "3501840277358858692"
+        "3500842579678157661"
    }
```

```diff
    contract Wrapped eETH Token (eth:0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee) {
    +++ description: None
      values.getRate:
-        "1091302773638237919"
+        "1092138060780745155"
    }
```

```diff
    contract Vyper_contract (eth:0xDC24316b9AE028F1497c275EB9192a3Ea0f67022) {
    +++ description: None
      values.admin_balances.0:
-        223252274303102
+        1455485308969423
      values.admin_balances.1:
-        31076667760
+        184207308106862
      values.balances.0:
-        "20406727704996868123195"
+        "20312673687004847242325"
      values.balances.1:
-        "22240369202946360953451"
+        "22118579793448633802487"
      values.get_virtual_price:
-        "1134865705376828920"
+        "1135297347789166682"
    }
```

Generated with discovered.json: 0x9202854905bbe030a6d1f823f9fba4e3624d403a

# Diff at Sat, 28 Mar 2026 09:08:07 GMT:

- author: emduc (<emilien.duc@gmail.com>)
- comparing to: main@12dca86fcbb84744a19e33638cbd2a3b9188646c block: 1774516628
- current timestamp: 1774688591

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract MembershipManager (eth:0x3d320286E014C3e1ce99Af6d6B00f0C1D63E3000) {
    +++ description: None
      values.tierData.0.0:
-        "102205044889990335"
+        "102327262324949009"
      values.tierData.1.0:
-        "117808984591740188"
+        "117943423770194729"
      values.tierData.2.0:
-        "133030884834618645"
+        "133177545756569055"
      values.tierData.3.0:
-        "148703141264991049"
+        "148862023930437325"
    }
```

```diff
    contract Vyper_contract (eth:0x5FAE7E604FC3e24fd43A72867ceBaC94c65b404A) {
    +++ description: None
      values.balances.0:
-        "38586483013159999761"
+        "36731523905497758159"
      values.balances.1:
-        "33577374741548027410"
+        "35226766626301335817"
      values.D:
-        "76380942982012525846"
+        "76378764093039609057"
      values.fee:
-        3015047
+        3203043
      values.get_virtual_price:
-        "1021479862598704473"
+        "1021498322525891566"
      values.last_prices:
-        "1125360468795580931"
+        "1125608078751955185"
      values.last_prices_timestamp:
-        1774486139
+        1774590983
      values.lp_price:
-        "2167233138503743944"
+        "2167510720552377298"
      values.price_oracle:
-        "1125360468795580931"
+        "1125608078751955185"
      values.price_scale:
-        "1125593184427680035"
+        "1125488287189697913"
      values.virtual_price:
-        "1021479862598704473"
+        "1021498322525891566"
      values.xcp_profit:
-        "1042347068562471270"
+        "1042368951658173634"
    }
```

```diff
    contract WrapTokenV3ETH (eth:0xa2E3356610840701BDf5611a53974510Ae27E2e1) {
    +++ description: None
      values.exchangeRate:
-        "1093764042219000000"
+        "1093916419794000000"
      values.totalSupply:
-        "3174628961152101370001340"
+        "3174724814459507527278060"
    }
```

```diff
    contract Coinbase Wrapped Staked ETH Token (eth:0xBe9895146f7AF43049ca1c1AE358B0541Ea49704) {
    +++ description: None
      values.exchangeRate:
-        "1126211478475931415"
+        "1126366588197836311"
    }
```

```diff
    contract Vyper_contract (eth:0xBfAb6FA95E0091ed66058ad493189D2cB29385E6) {
    +++ description: None
      values.admin_balances.0:
-        59346707283019
+        230599886829358
      values.admin_balances.1:
-        7212156146719
+        175730753603960
      values.balances.0:
-        "946308661426324877"
+        "1009996162144526296"
      values.balances.1:
-        "2731572326547465602"
+        "2673432080092081850"
      values.ema_price:
-        "996150185406856707"
+        "997255269302795731"
      values.get_p:
-        "996139071468564969"
+        "996678671783877696"
      values.get_virtual_price:
-        "1122997851955903575"
+        "1123206674514993276"
      values.last_price:
-        "996139480955958014"
+        "996678576133890041"
      values.ma_last_time:
-        1774466147
+        1774681811
      values.price_oracle:
-        "996139480955958014"
+        "996678805648417329"
      values.stored_rates.1:
-        "1093764042219000000"
+        "1093916419794000000"
    }
```

```diff
    contract Wrapped eETH Token (eth:0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee) {
    +++ description: None
      values.getRate:
-        "1091151401246708947"
+        "1091302773638237919"
    }
```

```diff
    contract Vyper_contract (eth:0xDC24316b9AE028F1497c275EB9192a3Ea0f67022) {
    +++ description: None
      values.admin_balances.0:
-        21626406820857
+        223252274303102
      values.admin_balances.1:
-        989757010540
+        31076667760
      values.balances.0:
-        "20432103078695901676597"
+        "20406727704996868123195"
      values.balances.1:
-        "22220475825604192544129"
+        "22240369202946360953451"
      values.get_virtual_price:
-        "1134786036019072952"
+        "1134865705376828920"
    }
```

Generated with discovered.json: 0xac9de328d9afe5d57e46d3d0479f00c2bee9f4b8

# Diff at Thu, 26 Mar 2026 09:20:18 GMT:

- author: emduc (<emilien.duc@gmail.com>)
- comparing to: main@66560fd01f284a450c27e3896f8c11e0194eebac block: 1774349093
- current timestamp: 1774516628

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract LiquidityPool (eth:0x308861A430be4cce5502d0A12724771Fc6DaF216) {
    +++ description: None
      values.ethAmountLockedForWithdrawal:
-        "8292086068067913964648"
+        "15369820143341892140563"
      values.getTotalPooledEther:
-        "3057670619420143181720403"
+        "2938589837363846581950641"
    }
```

```diff
    contract PriorityWithdrawalQueue (eth:0x35e7D6feF6f72aDd3c3e39dEc6d9CCc29e3345FA) {
    +++ description: None
      values.getRemainderAmount:
-        113473700478464
+        113488236729631
    }
```

```diff
    contract MembershipManager (eth:0x3d320286E014C3e1ce99Af6d6B00f0C1D63E3000) {
    +++ description: None
      values.tierData.0.0:
-        "102092232945464311"
+        "102205044889990335"
      values.tierData.1.0:
-        "117684891452761559"
+        "117808984591740188"
      values.tierData.2.0:
-        "132895510501187413"
+        "133030884834618645"
      values.tierData.3.0:
-        "148556485737107213"
+        "148703141264991049"
      values.tierDeposits.0.1:
-        "14895713818876153181"
+        "14893805883978724071"
      values.tierDeposits.1.1:
-        "5244877678605362313"
+        "5244205882323731471"
      values.tierDeposits.2.1:
-        "50806351142969872386"
+        "50799843552159832033"
      values.tierDeposits.3.1:
-        "101523473971289857221"
+        "101510470218582645638"
      values.tierVaults.0.0:
-        "50142843039722971899"
+        "50141504476001725810"
      values.tierVaults.1.1:
-        "35243453393083737855"
+        "35145459911981314632"
      values.tierVaults.1.0:
-        "36310076078648084231"
+        "36208517298993728743"
      values.tierVaults.2.0:
-        "104404883477008297143"
+        "104404212918874918192"
      values.tierVaults.3.1:
-        "671132232807253754013"
+        "670534157521875028903"
      values.tierVaults.3.0:
-        "703259700901006927904"
+        "702635604748480492517"
    }
```

```diff
    contract EtherFiOracle (eth:0x57AaF0004C716388B21795431CD7D5f9D3Bb6a41) {
    +++ description: None
      values.blockStampForNextReport.slotFrom:
-        13958944
+        13973024
      values.blockStampForNextReport.slotTo:
-        13960223
+        13974303
      values.blockStampForNextReport.blockFrom:
-        24725401
+        24739430
      values.lastPublishedReportRefBlock:
-        24725400
+        24739429
      values.lastPublishedReportRefSlot:
-        13958943
+        13973023
      values.slotForNextReport:
-        13960223
+        13974303
    }
```

```diff
    contract Vyper_contract (eth:0x5FAE7E604FC3e24fd43A72867ceBaC94c65b404A) {
    +++ description: None
      values.balances.0:
-        "40463160717514606127"
+        "38586483013159999761"
      values.balances.1:
-        "31909828113254659361"
+        "33577374741548027410"
      values.D:
-        "76381422721752570796"
+        "76380942982012525846"
      values.fee:
-        3489841
+        3015047
      values.get_virtual_price:
-        "1021471702980289804"
+        "1021479862598704473"
      values.last_prices:
-        "1125636213624876000"
+        "1125360468795580931"
      values.last_prices_timestamp:
-        1774300727
+        1774486139
      values.lp_price:
-        "2167481324587699852"
+        "2167233138503743944"
      values.price_oracle:
-        "1125636213624876000"
+        "1125360468795580931"
      values.price_scale:
-        "1125625306909727423"
+        "1125593184427680035"
      values.virtual_price:
-        "1021471702980289804"
+        "1021479862598704473"
      values.xcp_profit:
-        "1042339126348069823"
+        "1042347068562471270"
    }
```

```diff
    contract RewardsCoordinator (eth:0x7750d328b314EfFa365A0402CcfD489B80B0adda) {
    +++ description: None
      values.currRewardsCalculationEndTimestamp:
-        1773532800
+        1774137600
      values.getCurrentClaimableDistributionRoot.root:
-        "0xf7b7b87814a6cd393f2d26fceaf8b6e7833d4ee9b83b39b4ab5d8a34f893f818"
+        "0x59f815285950f5e5deb56f89208eeb7697619003d619d7f845eaea6029fb96d5"
      values.getCurrentClaimableDistributionRoot.rewardsCalculationEndTimestamp:
-        1772928000
+        1773532800
      values.getCurrentClaimableDistributionRoot.activatedAt:
-        1773770963
+        1774375979
      values.getCurrentDistributionRoot.root:
-        "0x59f815285950f5e5deb56f89208eeb7697619003d619d7f845eaea6029fb96d5"
+        "0x50040912e263ba491b905095009fcc612ddc70ed5641a4e8f9eabfe2a673e517"
      values.getCurrentDistributionRoot.rewardsCalculationEndTimestamp:
-        1773532800
+        1774137600
      values.getCurrentDistributionRoot.activatedAt:
-        1774375979
+        1774982951
      values.getDistributionRootsLength:
-        89
+        90
    }
```

```diff
    contract WithdrawRequestNFT (eth:0x7d5706f6ef3F89B3951E23e557CDFBC3239D4E2c) {
    +++ description: None
      values.getEEthRemainderAmount:
-        "6205003253151626542"
+        "6629371627067528972"
      values.lastFinalizedRequestId:
-        75858
+        75927
      values.nextRequestId:
-        75933
+        75984
    }
```

```diff
    contract Liquifier (eth:0x9FFDF407cDe9a93c47611799DA23924Af3EF764F) {
    +++ description: None
      values.getTotalPooledEther:
-        "1128378614484366413215"
+        "1543508268886376693875"
    }
```

```diff
    contract WrapTokenV3ETH (eth:0xa2E3356610840701BDf5611a53974510Ae27E2e1) {
    +++ description: None
      values.exchangeRate:
-        "1093608164698000000"
+        "1093764042219000000"
      values.totalSupply:
-        "3174624764490473202176616"
+        "3174628961152101370001340"
    }
```

```diff
    contract MembershipNFT (eth:0xb49e4420eA6e35F98060Cd133842DbeA9c27e479) {
    +++ description: None
      values.accruedLoyaltyPointsOf.2:
-        80342
+        80541
      values.accruedLoyaltyPointsOf.3:
-        99780
+        99973
      values.accruedLoyaltyPointsOf.4:
-        99780
+        99973
      values.accruedStakingRewardsOf.2:
-        "10209223294546431"
+        "10220504488999033"
      values.accruedStakingRewardsOf.3:
-        "10209223294546431"
+        "10220504488999033"
      values.accruedTierPointsOf.2:
-        18780
+        18827
      values.accruedTierPointsOf.3:
-        23706
+        23753
      values.accruedTierPointsOf.4:
-        23706
+        23753
      values.allTimeHighDepositOf.2:
-        "112013997764819158"
+        "112027627503468440"
      values.allTimeHighDepositOf.3:
-        "110209223294546431"
+        "110220504488999033"
      values.allTimeHighDepositOf.4:
-        "110209223294546431"
+        "110220504488999033"
      values.loyaltyPointsOf.2:
-        100666
+        100865
      values.loyaltyPointsOf.3:
-        99780
+        99973
      values.loyaltyPointsOf.4:
-        99780
+        99973
      values.tierPointsOf.2:
-        23705
+        23752
      values.tierPointsOf.3:
-        23706
+        23753
      values.tierPointsOf.4:
-        23706
+        23753
      values.valueOf.2:
-        "112013997764819158"
+        "112027627503468440"
      values.valueOf.3:
-        "110209223294546431"
+        "110220504488999033"
      values.valueOf.4:
-        "110209223294546431"
+        "110220504488999033"
    }
```

```diff
    contract Coinbase Wrapped Staked ETH Token (eth:0xBe9895146f7AF43049ca1c1AE358B0541Ea49704) {
    +++ description: None
      values.exchangeRate:
-        "1126057768273084167"
+        "1126211478475931415"
    }
```

```diff
    contract Vyper_contract (eth:0xBfAb6FA95E0091ed66058ad493189D2cB29385E6) {
    +++ description: None
      values.admin_balances.0:
-        0
+        59346707283019
      values.admin_balances.1:
-        0
+        7212156146719
      values.balances.0:
-        "1203688878226061994"
+        "946308661426324877"
      values.balances.1:
-        "2495492534014989171"
+        "2731572326547465602"
      values.ema_price:
-        "997611196828771731"
+        "996150185406856707"
      values.get_p:
-        "997859760167851488"
+        "996139071468564969"
      values.get_virtual_price:
-        "1122862525732263739"
+        "1122997851955903575"
      values.last_price:
-        "997860337196259796"
+        "996139480955958014"
      values.ma_last_time:
-        1774206107
+        1774466147
      values.price_oracle:
-        "997860337196259796"
+        "996139480955958014"
      values.stored_rates.1:
-        "1093608164698000000"
+        "1093764042219000000"
    }
```

```diff
    contract Wrapped eETH Token (eth:0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee) {
    +++ description: None
      values.getRate:
-        "1091011640058349522"
+        "1091151401246708947"
    }
```

```diff
    contract EtherfiL1SyncPoolETH (eth:0xD789870beA40D056A4d26055d0bEFcC8755DA146) {
    +++ description: None
      values.getTotalUnbackedTokens:
-        "42257881423729879387"
+        "42301579113884500176"
    }
```

```diff
    contract Vyper_contract (eth:0xDC24316b9AE028F1497c275EB9192a3Ea0f67022) {
    +++ description: None
      values.admin_balances.0:
-        2173425003365373
+        21626406820857
      values.admin_balances.1:
-        95309641133897
+        989757010540
      values.balances.0:
-        "20324608161798058824899"
+        "20432103078695901676597"
      values.balances.1:
-        "22346269277747255638736"
+        "22220475825604192544129"
      values.get_virtual_price:
-        "1134705664739459439"
+        "1134786036019072952"
    }
```

Generated with discovered.json: 0x42f9650b49612b4c3dc18b32c9198c0d22089a19

# Diff at Tue, 24 Mar 2026 11:09:43 GMT:

- author: emduc (<emilien.duc@gmail.com>)
- current timestamp: 1774349093

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (eth:0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: Ethereum Beacon Chain deposit contract.
```

```diff
+   Status: CREATED
    contract AuctionManager (eth:0x00C452aFFee3a17d9Cecc1Bcd2B8d5C7635C4CB9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DummyTokenUpgradeable (eth:0x0295E0CE709723FB25A28b8f67C54a488BA5aE46)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0x0c83EAe1FE72c390A02E426572854931EefF93BA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherFiAdmin (eth:0x0EF8fa4760Db8f5Cd4d993f3e3416f30f942D705)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EndpointV2 (eth:0x1a44076050125825900e736c501f859c50fE728c)
    +++ description: Part of the LayerZero messaging protocol. OApp owners can configure custom verification (MessageLib) and execution settings here.
```

```diff
+   Status: CREATED
    contract EtherFiRestaker (eth:0x1B7a4C3797236A1C37f8741c0Be35c2c72736fFf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingManager (eth:0x25e821b7197B146F7713C3b89B6A4D83516B912d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0x2f5301a3D59388c509C65f8698f521377D41Fd0F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LiquidityPool (eth:0x308861A430be4cce5502d0A12724771Fc6DaF216)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PriorityWithdrawalQueue (eth:0x35e7D6feF6f72aDd3c3e39dEc6d9CCc29e3345FA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ether.fi ETH Token (eth:0x35fA164735182de50811E8e2E824cFb9B6118ac2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelegationManager (eth:0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A)
    +++ description: The DelegationManager contract is responsible for registering EigenLayer operators and managing the EigenLayer strategies delegations. The EigenDA StakeRegistry contract reads from the DelegationManager to track the total stake of each EigenDA operator.
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (eth:0x3c55986Cfee455E2533F4D29006634EcF9B7c03F)
    +++ description: A beacon with an upgradeable implementation currently set as eth:0xA91F8a52F0C1b4D3fDC256fC5bEBCA4D627da392. Beacon proxy contracts pointing to this beacon will all use its implementation.
```

```diff
+   Status: CREATED
    contract MembershipManager (eth:0x3d320286E014C3e1ce99Af6d6B00f0C1D63E3000)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x4B8DF85d5BE4DF1e4D89840E5c7bd3F9D6361D48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherFiOracle (eth:0x57AaF0004C716388B21795431CD7D5f9D3Bb6a41)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x5836152812568244760ba356B5f3838Aa5B672e0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x59a5518aCE8e3d60C740503639B94bD86F7CEDF0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Vyper_contract (eth:0x5FAE7E604FC3e24fd43A72867ceBaC94c65b404A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DummyTokenUpgradeable (eth:0x61Ff310aC15a517A846DA08ac9f9abf2A0f9A2bf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RoleRegistry (eth:0x62247D29B4B9BECf4BB73E0c722cf6445cfC7cE9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Treasury (eth:0x6329004E903B7F420245E7aF3f355186f2432466)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DummyTokenUpgradeable (eth:0x641B33A2e1e46F3af8f3f0F9249e9111F24A51B3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherFiNode (eth:0x670F3818Fe5B1144e361A9A44EcbEA8231cCD32a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherFiRateLimiter (eth:0x6C7c54cfC2225fA985cD25F04d923B93c60a02F8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RewardsCoordinator (eth:0x7750d328b314EfFa365A0402CcfD489B80B0adda)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TNFT (eth:0x7B5ae07E2AF1C861BcC4736D23f5f66A61E0cA5e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawRequestNFT (eth:0x7d5706f6ef3F89B3951E23e557CDFBC3239D4E2c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DummyTokenUpgradeable (eth:0x83998e169026136760bE6AF93e776C2F352D4b28)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyManager (eth:0x858646372CC42E1A627fcE94aa7A7033e7CF075A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalQueueERC721 (eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherFiNodesManager (eth:0x8B71140AD2e5d1E7018d2a7f8a288BD3CD38916F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x915B16B555872A084B3512169b1F1dC089C3ca9A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenPodManager (eth:0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x95E10c0978c2e5eC52e89e7E97e1B52FF3A13bcb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x96a226ad7c14870502f9794fB481EE102E595fFa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x977c26Ce24036FA66EE2bFAeAd9556BC2b8A9AeA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherFiTimelock (eth:0x9f26d4C958fD811A1F59B01B86Be7dFFc9d20761)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Liquifier (eth:0x9FFDF407cDe9a93c47611799DA23924Af3EF764F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WrapTokenV3ETH (eth:0xa2E3356610840701BDf5611a53974510Ae27E2e1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherFiNode (eth:0xA91F8a52F0C1b4D3fDC256fC5bEBCA4D627da392)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xaa249a01a3D73611a27B735130Ab77fd6b0f5a3e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Liquid staked Ether 2.0 Token (eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0xAfBD66706F90BC56D29c39A260930b34B2757ed8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MembershipNFT (eth:0xb49e4420eA6e35F98060Cd133842DbeA9c27e479)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xB6C9125584A1A28cCafd31056D4aF29014862536)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegulationsManager (eth:0xBd23fF26197Eda06a930641Ac13ED5F3dB35f4DE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Coinbase Wrapped Staked ETH Token (eth:0xBe9895146f7AF43049ca1c1AE358B0541Ea49704)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Vyper_contract (eth:0xBfAb6FA95E0091ed66058ad493189D2cB29385E6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xcD12F7F1747Aaca69C61b7Af23FB5D5691191562)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherfiOFTAdapterUpgradeable (eth:0xcd2eb13D6831d4602D80E5db9230A57596CDCA63)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherFiTimelock (eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Wrapped eETH Token (eth:0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xcdd57D11476c22d265722F68390b036f3DA48c21)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeOperatorManager (eth:0xd5edf7730ABAd812247F6F54D7bd31a52554e35E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherfiL1SyncPoolETH (eth:0xD789870beA40D056A4d26055d0bEFcC8755DA146)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherFiRedemptionManager (eth:0xDadEf1fFBFeaAB4f68A9fD181395F68b4e4E7Ae0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xDBf6bE120D4dc72f01534673a1223182D9F6261D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Vyper_contract (eth:0xDC24316b9AE028F1497c275EB9192a3Ea0f67022)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DummyTokenUpgradeable (eth:0xDc400f3da3ea5Df0B7B6C127aE2e54CE55644CF3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xdC8Ddd3416d101304072b5a6CedecA8fBedb6EF5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolRevenueManager (eth:0xfE8A8FC74B2fdD3D745AbFc4940DD858BA60696c)
    +++ description: None
```
