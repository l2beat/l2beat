Generated with discovered.json: 0x9a56bb33abf4b8adff1c1796e48934ff37d663ad

# Diff at Wed, 08 Jan 2025 09:08:27 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21343022
- current block number: 21343022

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21343022 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x470458C91978D2d929704489Ad730DC3E3001113) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xe433c83297981013994bfd3c635714d66bbc7421

# Diff at Fri, 06 Dec 2024 11:02:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@da76f61d2c06d695d89e2429e2266a54932319a2 block: 21141719
- current block number: 21343022

## Description

External USDC escrow matches new template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21141719 (main branch discovery), not current.

```diff
    contract L1OpUSDCBridgeAdapter (0x153A69e4bb6fEDBbAaF463CB982416316c84B2dB) {
    +++ description: Escrow for USDC that uses the canonical bridge for messaging but is governed externally.
      description:
-        "Custom external escrow for USDC bridged to Worldchain."
+        "Escrow for USDC that uses the canonical bridge for messaging but is governed externally."
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x28fAb3A5b69711cc64B09240d2694d9F0f07eBf6","via":[]}]
      template:
+        "circle/L1OpUSDCBridgeAdapter"
    }
```

Generated with discovered.json: 0x7b7224b3c2477973744e2fdf24b3f0357f46ad74

# Diff at Fri, 08 Nov 2024 08:27:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@53988239f42edde0275ed92d8f3ada4279354f7d block: 21040685
- current block number: 21141719

## Description

Worldchain raises gasLimit to 150M. With 10x elasticity the block gas target is 15M. Current *daily* gas use on Worldchain is 160B, making the average block about 25% of the target.

## Watched changes

```diff
    contract SystemConfig (0x6ab0777fD0e609CE58F939a7F70Fe41F5Aa6300A) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        100000000
+        150000000
    }
```

Generated with discovered.json: 0x1c91991f2da9d43ee585be24af56a8cc07ec5492

# Diff at Fri, 01 Nov 2024 12:24:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21040685
- current block number: 21040685

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21040685 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x470458C91978D2d929704489Ad730DC3E3001113) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0xa231f8be37e583f276f93dF516D88a043bfe47E3) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract AlchemyMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      receivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D) {
    +++ description: None
      directlyReceivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xeca1df175948a5e01ae2f3f47f3f4e2e1e7677d9

# Diff at Tue, 29 Oct 2024 13:19:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21040685
- current block number: 21040685

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21040685 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x19A6d1E9034596196295CF148509796978343c5D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x94df63d6b202c679a5ef25a3acf56e3129badb8d

# Diff at Fri, 25 Oct 2024 05:58:15 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ae2c410e7fd6561c1946613ca693d2dc0322c23d block: 20995261
- current block number: 21040685

## Description

Renamed multisig to better show control.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20995261 (main branch discovery), not current.

```diff
    contract AlchemyMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      name:
-        "WorldchainMultisig"
+        "AlchemyMultisig"
    }
```

Generated with discovered.json: 0x147615e7e246e0558fe40f76a733c1703e82eec1

# Diff at Mon, 21 Oct 2024 12:50:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20995261
- current block number: 20995261

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20995261 (main branch discovery), not current.

```diff
    contract L1OpUSDCBridgeAdapter (0x153A69e4bb6fEDBbAaF463CB982416316c84B2dB) {
    +++ description: Custom external escrow for USDC bridged to Worldchain.
      descriptions:
-        ["Custom external escrow for USDC bridged to Worldchain."]
      description:
+        "Custom external escrow for USDC bridged to Worldchain."
    }
```

```diff
    contract L2OutputOracle (0x19A6d1E9034596196295CF148509796978343c5D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract L1ERC721Bridge (0x1Df436AfDb2fBB40F1fE8bEd4Fc89A0D0990a8E9) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract L1StandardBridge (0x470458C91978D2d929704489Ad730DC3E3001113) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract AddressManager (0x5891090d5085679714cb0e62f74950a3c19146a8) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract SystemConfig (0x6ab0777fD0e609CE58F939a7F70Fe41F5Aa6300A) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x82Cb528466cF22412d89bdBE9bCF04856790dD0e) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract SuperchainConfig (0xa231f8be37e583f276f93dF516D88a043bfe47E3) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract OptimismPortal (0xd5ec14a83B7d95BE1E2Ac12523e2dEE12Cbeea6C) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1CrossDomainMessenger (0xf931a81D18B1766d15695ffc7c1920a62b7e710a) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

Generated with discovered.json: 0x19d9efb9fec98140da6879d45ab20b6721e2d896

# Diff at Mon, 21 Oct 2024 11:12:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20995261
- current block number: 20995261

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20995261 (main branch discovery), not current.

```diff
    contract L1OpUSDCBridgeAdapter (0x153A69e4bb6fEDBbAaF463CB982416316c84B2dB) {
    +++ description: Custom external escrow for USDC bridged to Worldchain.
      values.$pastUpgrades.0.2:
+        ["0x62d45660505D7457e3ce9Cd87C0a0cf890fB38ff"]
      values.$pastUpgrades.0.1:
-        ["0x62d45660505D7457e3ce9Cd87C0a0cf890fB38ff"]
+        "0xbcd8e7e264c743a567f2f034945e8c9d1e4d5583f9efd0dbf2d89bbefe6cfd60"
    }
```

```diff
    contract L2OutputOracle (0x19A6d1E9034596196295CF148509796978343c5D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0x714d763CB676b97fA878d452dB70d81CBCb7D228"]
      values.$pastUpgrades.0.1:
-        ["0x714d763CB676b97fA878d452dB70d81CBCb7D228"]
+        "0xa3292232e0fcebd4b2054cc04323de93e1a7b681d5ff5824df81c396ec24f38c"
    }
```

```diff
    contract L1ERC721Bridge (0x1Df436AfDb2fBB40F1fE8bEd4Fc89A0D0990a8E9) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0x3c5bC88Fad9D35072213cD1FB5e83f9D150B3144"]
      values.$pastUpgrades.0.1:
-        ["0x3c5bC88Fad9D35072213cD1FB5e83f9D150B3144"]
+        "0x537a94f0aa146c63d9a65519e85b55f8c276349e9b6f2457fd0eb66331214e87"
    }
```

```diff
    contract SystemConfig (0x6ab0777fD0e609CE58F939a7F70Fe41F5Aa6300A) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x18fffcb31850795D919B6aDD4b16bEB3a5f5ECFB"]
      values.$pastUpgrades.0.1:
-        ["0x18fffcb31850795D919B6aDD4b16bEB3a5f5ECFB"]
+        "0x64c1939afb2e6f113ac5b917c740569ebb33001a3aa63eb912c97b1decd90f10"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x82Cb528466cF22412d89bdBE9bCF04856790dD0e) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0x73A793CdcF6F0f20e14e1835Eb1462b0376727cF"]
      values.$pastUpgrades.0.1:
-        ["0x73A793CdcF6F0f20e14e1835Eb1462b0376727cF"]
+        "0x5acb4bebe868d4883d26a6417436d21d856a1d3bd807b6c7eb02668390208a54"
    }
```

```diff
    contract SuperchainConfig (0xa231f8be37e583f276f93dF516D88a043bfe47E3) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.0.2:
+        ["0x76072B79Efc11E5C6c74A56560F8CE0B89D2966c"]
      values.$pastUpgrades.0.1:
-        ["0x76072B79Efc11E5C6c74A56560F8CE0B89D2966c"]
+        "0x1eac23e43252871e1fb140ce86cb1bd375f38aa4f38183f07b20a24cba51e26d"
    }
```

```diff
    contract OptimismPortal (0xd5ec14a83B7d95BE1E2Ac12523e2dEE12Cbeea6C) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0xB4BA75C87A48a233BC22678EfDa7d49CfD89ea5F"]
      values.$pastUpgrades.0.1:
-        ["0xB4BA75C87A48a233BC22678EfDa7d49CfD89ea5F"]
+        "0x9a74ce3bc48c7eeee3d5f36f4ebc628ca02aa9f392351bb4e98e06d6cf2b6044"
    }
```

```diff
    contract L1CrossDomainMessenger (0xf931a81D18B1766d15695ffc7c1920a62b7e710a) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.0.2:
+        ["0xE187FEF3AAe13137e6062B2634cCE43B599156F6"]
      values.$pastUpgrades.0.1:
-        ["0xE187FEF3AAe13137e6062B2634cCE43B599156F6"]
+        "0xe6ded05b39b296df87dfd33578f9dd897082d080120302622ba8ca158ad6bd38"
    }
```

Generated with discovered.json: 0xc086d10bc2e97164cd3bcc76f3c7fcdf70428204

# Diff at Fri, 18 Oct 2024 21:53:59 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa3c4b99c222d26df7f985211771efce84cdc134 block: 20986974
- current block number: 20995261

## Description

Discovery refresh, multisig updated.

## Watched changes

```diff
    contract L2OutputOracle (0x19A6d1E9034596196295CF148509796978343c5D) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0}
      issuedPermissions.2.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
    }
```

```diff
    contract L1ERC721Bridge (0x1Df436AfDb2fBB40F1fE8bEd4Fc89A0D0990a8E9) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
    }
```

```diff
    contract L1StandardBridge (0x470458C91978D2d929704489Ad730DC3E3001113) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
      issuedPermissions.0.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract AddressManager (0x5891090d5085679714cb0e62f74950a3c19146a8) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0,"description":"set and change address mappings."}
      issuedPermissions.0.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract SystemConfig (0x6ab0777fD0e609CE58F939a7F70Fe41F5Aa6300A) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.2.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0}
      issuedPermissions.2.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x82Cb528466cF22412d89bdBE9bCF04856790dD0e) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.0.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
    }
```

```diff
    contract SuperchainConfig (0xa231f8be37e583f276f93dF516D88a043bfe47E3) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
    }
```

```diff
    contract WorldchainMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d) {
    +++ description: None
      values.$members.5:
+        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
      values.$members.4:
+        "0x39CF304731099e756204219BF0a8cCc4738dE9dD"
      values.$members.3:
+        "0x3f0030b9Ca695Abd41b2B619F3298e172e4FCAD6"
      values.$members.2:
+        "0x2e42cEfC761e64Bf4442694220d31C2464a6EE21"
      values.$members.1:
+        "0x5EABE7f6673311EdD1Ad17A76ce148c2Bb56aF01"
      values.$members.0:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xaCEF7482b54a57F50b1CD8c99d1dC1964202A063"
      values.$threshold:
-        1
+        3
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "3 of 6 (50%)"
      receivedPermissions:
+        [{"permission":"configure","target":"0x5891090d5085679714cb0e62f74950a3c19146a8","description":"set and change address mappings.","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]},{"permission":"upgrade","target":"0x19A6d1E9034596196295CF148509796978343c5D","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]},{"permission":"upgrade","target":"0x1Df436AfDb2fBB40F1fE8bEd4Fc89A0D0990a8E9","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]},{"permission":"upgrade","target":"0x470458C91978D2d929704489Ad730DC3E3001113","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]},{"permission":"upgrade","target":"0x6ab0777fD0e609CE58F939a7F70Fe41F5Aa6300A","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]},{"permission":"upgrade","target":"0x82Cb528466cF22412d89bdBE9bCF04856790dD0e","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]},{"permission":"upgrade","target":"0xa231f8be37e583f276f93dF516D88a043bfe47E3","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]},{"permission":"upgrade","target":"0xd5ec14a83B7d95BE1E2Ac12523e2dEE12Cbeea6C","via":[{"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"}]}]
    }
```

```diff
    contract OptimismPortal (0xd5ec14a83B7d95BE1E2Ac12523e2dEE12Cbeea6C) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xB2aa0C2C4fD6BFCBF699d4c787CD6Cc0dC461a9d"
+        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
      issuedPermissions.1.via.1:
-        {"address":"0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d"
+        "0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D"
    }
```

Generated with discovered.json: 0xb7286d1c7f3af58d9fea1dbc040336779a05b583

# Diff at Thu, 17 Oct 2024 18:07:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20986974

## Description

Initial discovery: OP stack with old L2OutputOracle and unused, but deployed DisputeGame contracts. Two EOA admins: One for the USDC bridge, one for the Rollup.

## Initial discovery

```diff
+   Status: CREATED
    contract L1OpUSDCBridgeAdapter (0x153A69e4bb6fEDBbAaF463CB982416316c84B2dB)
    +++ description: Custom external escrow for USDC bridged to Worldchain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x19A6d1E9034596196295CF148509796978343c5D)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x1Df436AfDb2fBB40F1fE8bEd4Fc89A0D0990a8E9)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x470458C91978D2d929704489Ad730DC3E3001113)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract AddressManager (0x5891090d5085679714cb0e62f74950a3c19146a8)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x6ab0777fD0e609CE58F939a7F70Fe41F5Aa6300A)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x82Cb528466cF22412d89bdBE9bCF04856790dD0e)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xa231f8be37e583f276f93dF516D88a043bfe47E3)
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract WorldchainMultisig (0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xd5ec14a83B7d95BE1E2Ac12523e2dEE12Cbeea6C)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd7405BE7f3e63b094Af6C7C23D5eE33Fd82F872D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xf931a81D18B1766d15695ffc7c1920a62b7e710a)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```
