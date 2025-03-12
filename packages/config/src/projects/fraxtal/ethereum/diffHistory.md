Generated with discovered.json: 0xb28637ff6a75d97460a645548295a3a9bbdede4d

# Diff at Tue, 04 Mar 2025 11:25:43 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21802913
- current block number: 21802913

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802913 (main branch discovery), not current.

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x53769cd25f8315a981f495e3732dbc301c9ee0cf

# Diff at Tue, 04 Mar 2025 10:39:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21802913
- current block number: 21802913

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802913 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        19135323
    }
```

```diff
    contract L1CrossDomainMessenger (0x126bcc31Bc076B3d515f60FBC81FddE0B0d542Ed) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        19135323
    }
```

```diff
    contract ProxyAdmin (0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA) {
    +++ description: None
      sinceBlock:
+        19135323
    }
```

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19135323
    }
```

```diff
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        19135323
    }
```

```diff
    contract OptimismPortal (0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19135323
    }
```

```diff
    contract EtherRouter (0x5acAf61d339dd123e60ba450Ea38fbC49445007C) {
    +++ description: ETH deposited by users via the FraxEtherMinter is forwarded to this contract and then routed further to either lending pools or AMOs.
      sinceBlock:
+        21404227
    }
```

```diff
    contract frxETH Token (0x5E8422345238F34275888049021821E8E08CAa1f) {
    +++ description: frxETH token contract. Fraxtal uses Frax Ether as the designated gas token, allowing users to pay for blockspace with frxETH.
      sinceBlock:
+        15686046
    }
```

```diff
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        19135323
    }
```

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19135323
    }
```

```diff
    contract frxETH Minter (0x7Bc6bad540453360F744666D625fec0ee1320cA3) {
    +++ description: Accepts user-supplied ETH to convert it to frxETH using auxiliary contracts like the EtherRouter.
      sinceBlock:
+        21404229
    }
```

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: None
      sinceBlock:
+        15691435
    }
```

```diff
    contract FrxEthTimelock (0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA) {
    +++ description: Allows for time-delayed execution of transactions. Current delay is 2d.
      sinceBlock:
+        11465576
    }
```

```diff
    contract AddressManager (0x8c5D64d10394cFa070066e70Ec19E67398b4dABE) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        19135323
    }
```

```diff
    contract L1ERC721Bridge (0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        19135323
    }
```

```diff
    contract sfrxETH (0xac3E018457B222d93114458476f3E3416Abbe38F) {
    +++ description: Vault token contract (ERC-4626) for staked frxETH. The smart contract receives frxETH tokens and mints sfrxETH tokens.
      sinceBlock:
+        15686046
    }
```

```diff
    contract FraxtalTimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      sinceBlock:
+        13077564
    }
```

```diff
    contract frxETH Minter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138) {
    +++ description: Accepts user-supplied ETH and converts it to frxETH.
      sinceBlock:
+        15686046
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      sinceBlock:
+        19135323
    }
```

Generated with discovered.json: 0xbb6a36353c27eb99ad1bd57e1c9fdfbe15adcac0

# Diff at Thu, 27 Feb 2025 11:45:42 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21802913
- current block number: 21802913

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802913 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      name:
-        "OptimismMintablePermitERC20Factory"
+        "OptimismMintableERC20Factory"
      displayName:
-        "OptimismMintableERC20Factory"
    }
```

```diff
    contract frxETH Token (0x5E8422345238F34275888049021821E8E08CAa1f) {
    +++ description: frxETH token contract. Fraxtal uses Frax Ether as the designated gas token, allowing users to pay for blockspace with frxETH.
      name:
-        "frxETH"
+        "frxETH Token"
      displayName:
-        "frxETH Token"
    }
```

```diff
    contract frxETH Minter (0x7Bc6bad540453360F744666D625fec0ee1320cA3) {
    +++ description: Accepts user-supplied ETH to convert it to frxETH using auxiliary contracts like the EtherRouter.
      name:
-        "FraxEtherMinter"
+        "frxETH Minter"
      displayName:
-        "frxETH Minter"
    }
```

```diff
    contract FrxEthTimelock (0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA) {
    +++ description: Allows for time-delayed execution of transactions. Current delay is 2d.
      name:
-        "Timelock"
+        "FrxEthTimelock"
      displayName:
-        "FrxEthTimelock"
    }
```

```diff
    contract frxETH Minter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138) {
    +++ description: Accepts user-supplied ETH and converts it to frxETH.
      name:
-        "frxETHMinter"
+        "frxETH Minter"
      displayName:
-        "frxETH Minter"
    }
```

Generated with discovered.json: 0xbd7faa97b639f68640256298b25e4555c4f02fb7

# Diff at Wed, 26 Feb 2025 10:32:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21802913
- current block number: 21802913

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802913 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x126bcc31Bc076B3d515f60FBC81FddE0B0d542Ed) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xc2cdfd168886823161342776c75965485cd842bc

# Diff at Fri, 21 Feb 2025 14:07:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21802913
- current block number: 21802913

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802913 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      severity:
+        "HIGH"
    }
```

Generated with discovered.json: 0xd783d5f663695449766d59a77ffa34713f49903f

# Diff at Fri, 21 Feb 2025 08:59:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21802913
- current block number: 21802913

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802913 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x126bcc31Bc076B3d515f60FBC81FddE0B0d542Ed) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

Generated with discovered.json: 0x2570b80d7d4fddb5bf341cb5e943d095c141a378

# Diff at Mon, 10 Feb 2025 19:03:58 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21802913
- current block number: 21802913

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802913 (main branch discovery), not current.

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x6a0a5416c31f1dc9e0b988cbbee2ba12a736a76c

# Diff at Sat, 08 Feb 2025 16:13:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21543769
- current block number: 21802913

## Description

Fraxtal MS single signer change.

## Watched changes

```diff
    contract FraxtalTimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      values.$members.4:
-        "0x05FB8eC3C41da95b26fCb85503DaF8B89B89A935"
+        "0x6e74053a3798e0fC9a9775F7995316b27f21c4D2"
    }
```

Generated with discovered.json: 0x361c16982e09de024bea226f48bddbb52b5617b0

# Diff at Tue, 04 Feb 2025 12:31:26 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21543769
- current block number: 21543769

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21543769 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract EtherRouter (0x5acAf61d339dd123e60ba450Ea38fbC49445007C) {
    +++ description: ETH deposited by users via the FraxEtherMinter is forwarded to this contract and then routed further to either lending pools or AMOs.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f) {
    +++ description: frxETH token contract. Fraxtal uses Frax Ether as the designated gas token, allowing users to pay for blockspace with frxETH.
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract FraxEtherMinter (0x7Bc6bad540453360F744666D625fec0ee1320cA3) {
    +++ description: Accepts user-supplied ETH to convert it to frxETH using auxiliary contracts like the EtherRouter.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: None
      receivedPermissions.3.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Timelock (0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA) {
    +++ description: Allows for time-delayed execution of transactions. Current delay is 2d.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x8c5D64d10394cFa070066e70Ec19E67398b4dABE) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract FraxtalTimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138) {
    +++ description: Accepts user-supplied ETH and converts it to frxETH.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      receivedPermissions.4.permission:
-        "guard"
+        "interact"
      receivedPermissions.4.from:
-        "0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"
+        "0x8c5D64d10394cFa070066e70Ec19E67398b4dABE"
      receivedPermissions.4.description:
+        "set and change address mappings."
      receivedPermissions.4.via:
+        [{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
+        "0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"
      receivedPermissions.3.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.permission:
-        "configure"
+        "guard"
      receivedPermissions.2.from:
-        "0x8c5D64d10394cFa070066e70Ec19E67398b4dABE"
+        "0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"
      receivedPermissions.2.description:
-        "set and change address mappings."
      receivedPermissions.2.via:
-        [{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"
+        "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0x108472c03d30acaf3d7892cbb5d351c8f99229cc

# Diff at Wed, 29 Jan 2025 09:51:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5741cb966172a3b26ba8279dd9fe4323805a53c2 block: 21543769
- current block number: 21543769

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21543769 (main branch discovery), not current.

```diff
    contract EtherRouter (0x5acAf61d339dd123e60ba450Ea38fbC49445007C) {
    +++ description: ETH deposited by users via the FraxEtherMinter is forwarded to this contract and then routed further to either lending pools or AMOs.
      issuedPermissions.1:
+        {"permission":"configure","to":"0x8306300ffd616049FD7e4b0354a64Da835c1A81C","description":"withdraw all escrowed ETH and ERC-20s and configure important addresses like the operator, AMO(s) or the lending pool(s).","via":[]}
      issuedPermissions.0.description:
-        "withdraw all escrowed ETH and ERC-20s and configure important addresses like the operator, AMO(s) or the lending pool(s)."
+        "set the default AMO and lending pool contracts among the registered ones and trigger the predefined rebalancing functions of the router."
    }
```

```diff
    contract FraxEtherMinter (0x7Bc6bad540453360F744666D625fec0ee1320cA3) {
    +++ description: Accepts user-supplied ETH to convert it to frxETH using auxiliary contracts like the EtherRouter.
      issuedPermissions.1:
+        {"permission":"configure","to":"0x8306300ffd616049FD7e4b0354a64Da835c1A81C","description":"pause ETH deposits / frxETH mints and withdraw ETH and ERC-20s from the contract (usually not escrowed here).","via":[]}
    }
```

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: None
      receivedPermissions.3:
+        {"permission":"configure","from":"0x7Bc6bad540453360F744666D625fec0ee1320cA3","description":"pause ETH deposits / frxETH mints and withdraw ETH and ERC-20s from the contract (usually not escrowed here)."}
      receivedPermissions.2:
+        {"permission":"configure","from":"0x7Bc6bad540453360F744666D625fec0ee1320cA3","description":"configure important addresses like the operator or the EtherRouter and withdraw ETH and ERC-20s from the contract (usually not escrowed here)."}
      receivedPermissions.1.from:
-        "0x7Bc6bad540453360F744666D625fec0ee1320cA3"
+        "0x5acAf61d339dd123e60ba450Ea38fbC49445007C"
      receivedPermissions.1.description:
-        "configure important addresses like the operator or the EtherRouter and withdraw ETH and ERC-20s from the contract (usually not escrowed here)."
+        "withdraw all escrowed ETH and ERC-20s and configure important addresses like the operator, AMO(s) or the lending pool(s)."
      receivedPermissions.0.description:
-        "withdraw all escrowed ETH and ERC-20s and configure important addresses like the operator, AMO(s) or the lending pool(s)."
+        "set the default AMO and lending pool contracts among the registered ones and trigger the predefined rebalancing functions of the router."
    }
```

Generated with discovered.json: 0x9394150e4a7b8235f3bc38e8c95c4a718638bc79

# Diff at Mon, 20 Jan 2025 11:09:31 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21543769
- current block number: 21543769

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21543769 (main branch discovery), not current.

```diff
    contract OptimismMintablePermitERC20Factory (0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
    }
```

```diff
    contract ProxyAdmin (0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5"
      directlyReceivedPermissions.7.from:
+        "0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5"
      directlyReceivedPermissions.6.target:
-        "0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4"
      directlyReceivedPermissions.6.from:
+        "0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4"
      directlyReceivedPermissions.5.target:
-        "0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"
      directlyReceivedPermissions.5.from:
+        "0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"
      directlyReceivedPermissions.4.target:
-        "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
      directlyReceivedPermissions.4.from:
+        "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
      directlyReceivedPermissions.3.target:
-        "0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2"
      directlyReceivedPermissions.3.from:
+        "0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2"
      directlyReceivedPermissions.2.target:
-        "0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"
      directlyReceivedPermissions.2.from:
+        "0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"
      directlyReceivedPermissions.1.target:
-        "0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc"
      directlyReceivedPermissions.1.from:
+        "0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc"
      directlyReceivedPermissions.0.target:
-        "0x8c5D64d10394cFa070066e70Ec19E67398b4dABE"
      directlyReceivedPermissions.0.from:
+        "0x8c5D64d10394cFa070066e70Ec19E67398b4dABE"
    }
```

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.1.target:
-        "0x6017f75108f251a488B045A7ce2a7C15b179d1f2"
      issuedPermissions.1.to:
+        "0x6017f75108f251a488B045A7ce2a7C15b179d1f2"
      issuedPermissions.0.target:
-        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.to:
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract OptimismPortal (0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.target:
-        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.to:
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
    }
```

```diff
    contract EtherRouter (0x5acAf61d339dd123e60ba450Ea38fbC49445007C) {
    +++ description: ETH deposited by users via the FraxEtherMinter is forwarded to this contract and then routed further to either lending pools or AMOs.
      issuedPermissions.0.target:
-        "0x8306300ffd616049FD7e4b0354a64Da835c1A81C"
      issuedPermissions.0.to:
+        "0x8306300ffd616049FD7e4b0354a64Da835c1A81C"
      issuedPermissions.0.description:
+        "withdraw all escrowed ETH and ERC-20s and configure important addresses like the operator, AMO(s) or the lending pool(s)."
    }
```

```diff
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f) {
    +++ description: frxETH token contract. Fraxtal uses Frax Ether as the designated gas token, allowing users to pay for blockspace with frxETH.
      issuedPermissions.2.target:
-        "0xbAFA44EFE7901E04E39Dad13167D089C559c1138"
      issuedPermissions.2.to:
+        "0xbAFA44EFE7901E04E39Dad13167D089C559c1138"
      issuedPermissions.2.description:
+        "can mint frxETH tokens."
      issuedPermissions.1.target:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      issuedPermissions.1.via.0.description:
-        "can add and remove frxETH minters and set a new timelock address."
      issuedPermissions.1.to:
+        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      issuedPermissions.1.description:
+        "can add and remove frxETH minters and set a new timelock address."
      issuedPermissions.0.target:
-        "0x7Bc6bad540453360F744666D625fec0ee1320cA3"
      issuedPermissions.0.to:
+        "0x7Bc6bad540453360F744666D625fec0ee1320cA3"
      issuedPermissions.0.description:
+        "can mint frxETH tokens."
    }
```

```diff
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.target:
-        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.to:
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
    }
```

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.1.target:
-        "0xFb90465f3064fF63FC460F01A6307eC73d64bc50"
      issuedPermissions.1.to:
+        "0xFb90465f3064fF63FC460F01A6307eC73d64bc50"
      issuedPermissions.0.target:
-        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.to:
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
    }
```

```diff
    contract FraxEtherMinter (0x7Bc6bad540453360F744666D625fec0ee1320cA3) {
    +++ description: Accepts user-supplied ETH to convert it to frxETH using auxiliary contracts like the EtherRouter.
      issuedPermissions.0.target:
-        "0x8306300ffd616049FD7e4b0354a64Da835c1A81C"
      issuedPermissions.0.to:
+        "0x8306300ffd616049FD7e4b0354a64Da835c1A81C"
      issuedPermissions.0.description:
+        "configure important addresses like the operator or the EtherRouter and withdraw ETH and ERC-20s from the contract (usually not escrowed here)."
      receivedPermissions.0.target:
-        "0x5E8422345238F34275888049021821E8E08CAa1f"
      receivedPermissions.0.from:
+        "0x5E8422345238F34275888049021821E8E08CAa1f"
    }
```

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x7Bc6bad540453360F744666D625fec0ee1320cA3"
      receivedPermissions.1.from:
+        "0x7Bc6bad540453360F744666D625fec0ee1320cA3"
      receivedPermissions.0.target:
-        "0x5acAf61d339dd123e60ba450Ea38fbC49445007C"
      receivedPermissions.0.from:
+        "0x5acAf61d339dd123e60ba450Ea38fbC49445007C"
    }
```

```diff
    contract Timelock (0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA) {
    +++ description: Allows for time-delayed execution of transactions. Current delay is 2d.
      directlyReceivedPermissions.1.target:
-        "0xbAFA44EFE7901E04E39Dad13167D089C559c1138"
      directlyReceivedPermissions.1.from:
+        "0xbAFA44EFE7901E04E39Dad13167D089C559c1138"
      directlyReceivedPermissions.0.target:
-        "0x5E8422345238F34275888049021821E8E08CAa1f"
      directlyReceivedPermissions.0.from:
+        "0x5E8422345238F34275888049021821E8E08CAa1f"
    }
```

```diff
    contract AddressManager (0x8c5D64d10394cFa070066e70Ec19E67398b4dABE) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract L1ERC721Bridge (0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
    }
```

```diff
    contract FraxtalTimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xbAFA44EFE7901E04E39Dad13167D089C559c1138"
      receivedPermissions.1.from:
+        "0xbAFA44EFE7901E04E39Dad13167D089C559c1138"
      receivedPermissions.0.target:
-        "0x5E8422345238F34275888049021821E8E08CAa1f"
      receivedPermissions.0.from:
+        "0x5E8422345238F34275888049021821E8E08CAa1f"
      directlyReceivedPermissions.0.target:
-        "0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA"
      directlyReceivedPermissions.0.from:
+        "0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA"
    }
```

```diff
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138) {
    +++ description: Accepts user-supplied ETH and converts it to frxETH.
      issuedPermissions.0.target:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      issuedPermissions.0.via.0.description:
-        "can withdraw all escrowed ETH, pause the contract and set user fees for minting frxETH (`submit()`)."
      issuedPermissions.0.to:
+        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      issuedPermissions.0.description:
+        "can withdraw all escrowed ETH, pause the contract and set user fees for minting frxETH (`submit()`)."
      receivedPermissions.0.target:
-        "0x5E8422345238F34275888049021821E8E08CAa1f"
      receivedPermissions.0.from:
+        "0x5E8422345238F34275888049021821E8E08CAa1f"
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      receivedPermissions.11.target:
-        "0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5"
      receivedPermissions.11.from:
+        "0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5"
      receivedPermissions.10.target:
-        "0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4"
      receivedPermissions.10.from:
+        "0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4"
      receivedPermissions.9.target:
-        "0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"
      receivedPermissions.9.from:
+        "0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"
      receivedPermissions.8.target:
-        "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
      receivedPermissions.8.from:
+        "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
      receivedPermissions.7.target:
-        "0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2"
      receivedPermissions.7.from:
+        "0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2"
      receivedPermissions.6.target:
-        "0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"
      receivedPermissions.6.from:
+        "0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"
      receivedPermissions.5.target:
-        "0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc"
      receivedPermissions.5.from:
+        "0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc"
      receivedPermissions.4.target:
-        "0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"
      receivedPermissions.4.from:
+        "0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"
      receivedPermissions.3.target:
-        "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
      receivedPermissions.3.from:
+        "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
      receivedPermissions.2.target:
-        "0x8c5D64d10394cFa070066e70Ec19E67398b4dABE"
      receivedPermissions.2.from:
+        "0x8c5D64d10394cFa070066e70Ec19E67398b4dABE"
      receivedPermissions.1.target:
-        "0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"
      receivedPermissions.1.from:
+        "0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"
      receivedPermissions.0.target:
-        "0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4"
      receivedPermissions.0.from:
+        "0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4"
      directlyReceivedPermissions.0.target:
-        "0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"
      directlyReceivedPermissions.0.from:
+        "0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"
    }
```

Generated with discovered.json: 0xfcf3630c0adc3bdae170b0ee842b10e4bbe10de4

# Diff at Wed, 08 Jan 2025 09:01:05 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21543769
- current block number: 21543769

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21543769 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x372dc254389c54acc724cb9f4708ea0424110454

# Diff at Fri, 03 Jan 2025 11:55:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f2f208ac8a91552305da5e03332108446838b892 block: 20927364
- current block number: 21543769

## Description

New minter added for frxETH: The FraxEtherMinter contract forwards ETH to an EtherRouter contract which in turn supports AMOs and lending pools modularly. Permissions are the same as before and the old minter is still operational.

## Watched changes

```diff
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f) {
    +++ description: frxETH token contract. Fraxtal uses Frax Ether as the designated gas token, allowing users to pay for blockspace with frxETH.
      issuedPermissions.2:
+        {"permission":"configure","target":"0xbAFA44EFE7901E04E39Dad13167D089C559c1138","via":[]}
      issuedPermissions.1.target:
-        "0xbAFA44EFE7901E04E39Dad13167D089C559c1138"
+        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      issuedPermissions.1.via.0:
+        {"address":"0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA","delay":172800,"description":"can add and remove frxETH minters and set a new timelock address."}
      issuedPermissions.0.target:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "0x7Bc6bad540453360F744666D625fec0ee1320cA3"
      issuedPermissions.0.via.0:
-        {"address":"0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA","delay":172800,"description":"can add and remove frxETH minters and set a new timelock address."}
      values.minters_array.2:
+        "0x7Bc6bad540453360F744666D625fec0ee1320cA3"
    }
```

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0x5acAf61d339dd123e60ba450Ea38fbC49445007C","description":"withdraw all escrowed ETH and ERC-20s and configure important addresses like the operator, AMO(s) or the lending pool(s)."},{"permission":"configure","target":"0x7Bc6bad540453360F744666D625fec0ee1320cA3","description":"configure important addresses like the operator or the EtherRouter and withdraw ETH and ERC-20s from the contract (usually not escrowed here)."}]
    }
```

```diff
+   Status: CREATED
    contract EtherRouter (0x5acAf61d339dd123e60ba450Ea38fbC49445007C)
    +++ description: ETH deposited by users via the FraxEtherMinter is forwarded to this contract and then routed further to either lending pools or AMOs.
```

```diff
+   Status: CREATED
    contract FraxEtherMinter (0x7Bc6bad540453360F744666D625fec0ee1320cA3)
    +++ description: Accepts user-supplied ETH to convert it to frxETH using auxiliary contracts like the EtherRouter.
```

## Source code changes

```diff
.../fraxtal/ethereum/.flat/EtherRouter.sol         | 1239 ++++++++++++++++++++
 .../fraxtal/ethereum/.flat/FraxEtherMinter.sol     |  510 ++++++++
 2 files changed, 1749 insertions(+)
```

Generated with discovered.json: 0xf8f41c681f2b61d2c6f78971b3eab30f17e78f5f

# Diff at Thu, 28 Nov 2024 11:02:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 20927364
- current block number: 20927364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20927364 (main branch discovery), not current.

```diff
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f) {
    +++ description: frxETH token contract. Fraxtal uses Frax Ether as the designated gas token, allowing users to pay for blockspace with frxETH.
      issuedPermissions.2:
-        {"permission":"configure","target":"0xbAFA44EFE7901E04E39Dad13167D089C559c1138","via":[]}
      issuedPermissions.1.target:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "0xbAFA44EFE7901E04E39Dad13167D089C559c1138"
      issuedPermissions.1.via.0:
-        {"address":"0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA","delay":172800,"description":"can add and remove frxETH minters and set a new timelock address."}
      issuedPermissions.0.target:
-        "0x0000000000000000000000000000000000000000"
+        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      issuedPermissions.0.via.0:
+        {"address":"0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA","delay":172800,"description":"can add and remove frxETH minters and set a new timelock address."}
    }
```

Generated with discovered.json: 0xd6de76886445e0fe91ef3388539f491f685e0518

# Diff at Fri, 01 Nov 2024 12:23:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 20927364
- current block number: 20927364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20927364 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA) {
    +++ description: None
      directlyReceivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      receivedPermissions.7.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x9be63cc6cb6eedeb2f85a31e92cccb06aed026f0

# Diff at Tue, 29 Oct 2024 13:07:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20927364
- current block number: 20927364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20927364 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0xb19c5b04780b0525262eca8152d3a5439fcc481f

# Diff at Mon, 21 Oct 2024 12:44:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20927364
- current block number: 20927364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20927364 (main branch discovery), not current.

```diff
    contract OptimismMintablePermitERC20Factory (0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract L1CrossDomainMessenger (0x126bcc31Bc076B3d515f60FBC81FddE0B0d542Ed) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract OptimismPortal (0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f) {
    +++ description: frxETH token contract. Fraxtal uses Frax Ether as the designated gas token, allowing users to pay for blockspace with frxETH.
      descriptions:
-        ["frxETH token contract. Fraxtal uses Frax Ether as the designated gas token, allowing users to pay for blockspace with frxETH."]
      description:
+        "frxETH token contract. Fraxtal uses Frax Ether as the designated gas token, allowing users to pay for blockspace with frxETH."
    }
```

```diff
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract Timelock (0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA) {
    +++ description: Allows for time-delayed execution of transactions. Current delay is 2d.
      descriptions:
-        ["Allows for time-delayed execution of transactions. Current delay is 2d."]
      description:
+        "Allows for time-delayed execution of transactions. Current delay is 2d."
    }
```

```diff
    contract AddressManager (0x8c5D64d10394cFa070066e70Ec19E67398b4dABE) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract L1ERC721Bridge (0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract sfrxETH (0xac3E018457B222d93114458476f3E3416Abbe38F) {
    +++ description: Vault token contract (ERC-4626) for staked frxETH. The smart contract receives frxETH tokens and mints sfrxETH tokens.
      descriptions:
-        ["Vault token contract (ERC-4626) for staked frxETH. The smart contract receives frxETH tokens and mints sfrxETH tokens."]
      description:
+        "Vault token contract (ERC-4626) for staked frxETH. The smart contract receives frxETH tokens and mints sfrxETH tokens."
    }
```

```diff
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138) {
    +++ description: Accepts user-supplied ETH and converts it to frxETH.
      descriptions:
-        ["Accepts user-supplied ETH and converts it to frxETH."]
      description:
+        "Accepts user-supplied ETH and converts it to frxETH."
    }
```

Generated with discovered.json: 0xf42f1630643a523fb274b6259ddca6ac7b26ccec

# Diff at Mon, 21 Oct 2024 11:06:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20927364
- current block number: 20927364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20927364 (main branch discovery), not current.

```diff
    contract OptimismMintablePermitERC20Factory (0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.1.2:
+        ["0x6cA98f43719231d38F6426DB64C7F3D5C7CE7876"]
      values.$pastUpgrades.1.1:
-        ["0x6cA98f43719231d38F6426DB64C7F3D5C7CE7876"]
+        "0x105f432213e819e064f46a07b935289add9f1139c9c91db7fd45d0f6fe213b1f"
      values.$pastUpgrades.0.2:
+        ["0x1120ef11d4C3dc90Aa6BDfce16Ab049dd5d18aE0"]
      values.$pastUpgrades.0.1:
-        ["0x1120ef11d4C3dc90Aa6BDfce16Ab049dd5d18aE0"]
+        "0x71e0cfe8fa79e241d5e216cd9956ad54c2952516293aec0b47b9a96d8ee2b061"
    }
```

```diff
    contract L1CrossDomainMessenger (0x126bcc31Bc076B3d515f60FBC81FddE0B0d542Ed) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.2.2:
+        ["0xC6e4ECE5576dC96846bb11eD8910f3dF3CE516b8"]
      values.$pastUpgrades.2.1:
-        ["0xC6e4ECE5576dC96846bb11eD8910f3dF3CE516b8"]
+        "0x25f146ab6043f07c95e3b314e0200d2b5a8a0cb590cbcd9f094f753efef7d669"
      values.$pastUpgrades.1.2:
+        ["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]
      values.$pastUpgrades.1.1:
-        ["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]
+        "0x25f146ab6043f07c95e3b314e0200d2b5a8a0cb590cbcd9f094f753efef7d669"
      values.$pastUpgrades.0.2:
+        ["0x31c25985E6b10CF335FC01cf9790aF4890d0505c"]
      values.$pastUpgrades.0.1:
-        ["0x31c25985E6b10CF335FC01cf9790aF4890d0505c"]
+        "0xc7e0611b207fc226dc0412ebae0cd464b62b341c49a10a83315d916cdf527753"
    }
```

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.2.2:
+        ["0x4D7A1a16d0DA89B50FBd8b524508FC393A6Dc367"]
      values.$pastUpgrades.2.1:
-        ["0x4D7A1a16d0DA89B50FBd8b524508FC393A6Dc367"]
+        "0x25f146ab6043f07c95e3b314e0200d2b5a8a0cb590cbcd9f094f753efef7d669"
      values.$pastUpgrades.1.2:
+        ["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]
      values.$pastUpgrades.1.1:
-        ["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]
+        "0x25f146ab6043f07c95e3b314e0200d2b5a8a0cb590cbcd9f094f753efef7d669"
      values.$pastUpgrades.0.2:
+        ["0x22052c592f763CA14a090D9974c5Bf9Fd3a44b8c"]
      values.$pastUpgrades.0.1:
-        ["0x22052c592f763CA14a090D9974c5Bf9Fd3a44b8c"]
+        "0xe7aacfcc1d50443042842246a38e54581e9dba154a9831660415e0fce5503e4d"
    }
```

```diff
    contract OptimismPortal (0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.2.2:
+        ["0x47Ec03B67ba4f3C71a4320D2947f2173E0B45a23"]
      values.$pastUpgrades.2.1:
-        ["0x47Ec03B67ba4f3C71a4320D2947f2173E0B45a23"]
+        "0x25f146ab6043f07c95e3b314e0200d2b5a8a0cb590cbcd9f094f753efef7d669"
      values.$pastUpgrades.1.2:
+        ["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]
      values.$pastUpgrades.1.1:
-        ["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]
+        "0x25f146ab6043f07c95e3b314e0200d2b5a8a0cb590cbcd9f094f753efef7d669"
      values.$pastUpgrades.0.2:
+        ["0x59B6903044Fa9439a5D621D3605789A6E654b1D6"]
      values.$pastUpgrades.0.1:
-        ["0x59B6903044Fa9439a5D621D3605789A6E654b1D6"]
+        "0xe7e33bcdd2dd085bcd43e933aefa52eeffb6a4656facdfae956eba8bfe2f537b"
    }
```

```diff
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.2.2:
+        ["0x0d9C39c64CF8eDA1EdFeBD78AFa895bAA797eFc4"]
      values.$pastUpgrades.2.1:
-        ["0x0d9C39c64CF8eDA1EdFeBD78AFa895bAA797eFc4"]
+        "0xedefc1fc192d3c59892b11660cf6dc47d120a7e895adc2cd4dba0d97efec9644"
      values.$pastUpgrades.1.2:
+        ["0xb851fc304fCa88EDC89C287687AF4F6d7810bc14"]
      values.$pastUpgrades.1.1:
-        ["0xb851fc304fCa88EDC89C287687AF4F6d7810bc14"]
+        "0xedefc1fc192d3c59892b11660cf6dc47d120a7e895adc2cd4dba0d97efec9644"
      values.$pastUpgrades.0.2:
+        ["0x0d9C39c64CF8eDA1EdFeBD78AFa895bAA797eFc4"]
      values.$pastUpgrades.0.1:
-        ["0x0d9C39c64CF8eDA1EdFeBD78AFa895bAA797eFc4"]
+        "0x4f8242b2a2b3b4bfda92b93111cb848902636f44a632d232cdd39509074009fa"
    }
```

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.3.2:
+        ["0x6f3CcC8C9DAf8B9b39aDe481213Ff7A626a42B65"]
      values.$pastUpgrades.3.1:
-        ["0x6f3CcC8C9DAf8B9b39aDe481213Ff7A626a42B65"]
+        "0x25f146ab6043f07c95e3b314e0200d2b5a8a0cb590cbcd9f094f753efef7d669"
      values.$pastUpgrades.2.2:
+        ["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]
      values.$pastUpgrades.2.1:
-        ["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]
+        "0x25f146ab6043f07c95e3b314e0200d2b5a8a0cb590cbcd9f094f753efef7d669"
      values.$pastUpgrades.1.2:
+        ["0x84c2f365733c6560bd49D8768d9c23B07A9DD630"]
      values.$pastUpgrades.1.1:
-        ["0x84c2f365733c6560bd49D8768d9c23B07A9DD630"]
+        "0x3b6b6b8395ca0242ffaf46aba40335b8dce65cab470d7a188a3afe13723ee3db"
      values.$pastUpgrades.0.2:
+        ["0xA30ADd78D5be6B2B55C934666bb4fF2C4429d800"]
      values.$pastUpgrades.0.1:
-        ["0xA30ADd78D5be6B2B55C934666bb4fF2C4429d800"]
+        "0xda02c330c54f6dc923beb0d9f720a4caaae75238f52d24902d56624b0410a65b"
    }
```

```diff
    contract L1ERC721Bridge (0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.2.2:
+        ["0x7eE1637C33Ed0DFEE6403f3301B6d404106018e4"]
      values.$pastUpgrades.2.1:
-        ["0x7eE1637C33Ed0DFEE6403f3301B6d404106018e4"]
+        "0x25f146ab6043f07c95e3b314e0200d2b5a8a0cb590cbcd9f094f753efef7d669"
      values.$pastUpgrades.1.2:
+        ["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]
      values.$pastUpgrades.1.1:
-        ["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]
+        "0x25f146ab6043f07c95e3b314e0200d2b5a8a0cb590cbcd9f094f753efef7d669"
      values.$pastUpgrades.0.2:
+        ["0x23A0478996241F9f966b7054c06FdeB96Ddf3475"]
      values.$pastUpgrades.0.1:
-        ["0x23A0478996241F9f966b7054c06FdeB96Ddf3475"]
+        "0x16fa9302027443ca036c06c75668cfa2bbe1d3466d67e3cf566c8227ae489bf9"
    }
```

Generated with discovered.json: 0x468b8b00b4b9e698df33639e5162dad5fdc43231

# Diff at Wed, 16 Oct 2024 11:36:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20927364
- current block number: 20927364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20927364 (main branch discovery), not current.

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xe0d7755252873c4eF5788f7f45764E0e17610508","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
+        "0x6017f75108f251a488B045A7ce2a7C15b179d1f2"
      issuedPermissions.1.via.0:
-        {"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0}
    }
```

```diff
    contract OptimismPortal (0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xe0d7755252873c4eF5788f7f45764E0e17610508","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.0:
-        {"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0}
    }
```

```diff
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xe0d7755252873c4eF5788f7f45764E0e17610508","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.0:
-        {"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xe0d7755252873c4eF5788f7f45764E0e17610508","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0xFb90465f3064fF63FC460F01A6307eC73d64bc50","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.via.0:
-        {"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0}
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions.11:
+        {"permission":"upgrade","target":"0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]}
      receivedPermissions.8.target:
-        "0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5"
+        "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
      receivedPermissions.7.target:
-        "0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4"
+        "0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2"
      receivedPermissions.7.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.6.target:
-        "0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"
+        "0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"
      receivedPermissions.5.target:
-        "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
+        "0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc"
      receivedPermissions.4.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.4.target:
-        "0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2"
+        "0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"
      receivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.4.via:
-        [{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]
      receivedPermissions.3.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.3.target:
-        "0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"
+        "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
      receivedPermissions.3.via:
-        [{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.target:
-        "0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc"
+        "0x8c5D64d10394cFa070066e70Ec19E67398b4dABE"
      receivedPermissions.2.description:
+        "set and change address mappings."
      receivedPermissions.1.target:
-        "0x8c5D64d10394cFa070066e70Ec19E67398b4dABE"
+        "0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"
      receivedPermissions.1.description:
-        "set and change address mappings."
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.via:
-        [{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"
+        "0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0xb1460f5f9e97d559ac65aca6f13f1755ecc9ccc2

# Diff at Mon, 14 Oct 2024 10:51:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20927364
- current block number: 20927364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20927364 (main branch discovery), not current.

```diff
    contract OptimismMintablePermitERC20Factory (0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x42f31c7757e8d3066477571abb4a04e8b817c654c63f6c9f12c96af2a3d000ca"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x126bcc31Bc076B3d515f60FBC81FddE0B0d542Ed) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"]
    }
```

```diff
    contract ProxyAdmin (0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x1d29007e3a6ea19186d632b4d79251aa21baae9b59fbc0b4c88ff3958b5c2730"]
    }
```

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"]
    }
```

```diff
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xe60978aadd7b7babd6a7af621f97d7f7e58f1e93f631dd66a13fe4eae9b14761","0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"]
    }
```

```diff
    contract OptimismPortal (0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xddf64101e7b6f558921307e9d122e69bbb712db51cff893729c03c588865838f"]
    }
```

```diff
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f) {
    +++ description: frxETH token contract. Fraxtal uses Frax Ether as the designated gas token, allowing users to pay for blockspace with frxETH.
      sourceHashes:
+        ["0x35d2793b796cde40be8f1ddaa988ae1c8fd2ad9f55b4b4d74946d35832703efa"]
    }
```

```diff
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"]
    }
```

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Timelock (0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA) {
    +++ description: Allows for time-delayed execution of transactions. Current delay is 2d.
      sourceHashes:
+        ["0xf74d5abe93255d485a607a353bb85161caf16d07541125865eb5fd9220bce6c7"]
    }
```

```diff
    contract AddressManager (0x8c5D64d10394cFa070066e70Ec19E67398b4dABE) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract L1ERC721Bridge (0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"]
    }
```

```diff
    contract sfrxETH (0xac3E018457B222d93114458476f3E3416Abbe38F) {
    +++ description: Vault token contract (ERC-4626) for staked frxETH. The smart contract receives frxETH tokens and mints sfrxETH tokens.
      sourceHashes:
+        ["0xfe65651a8179606cdf20c60070a93224cb7b8fd4e89fb0d668b795503e8da33c"]
    }
```

```diff
    contract FraxtalTimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138) {
    +++ description: Accepts user-supplied ETH and converts it to frxETH.
      sourceHashes:
+        ["0xeb2d3e06200c7350a7bcb0c3b1b64c466c15459f1119fb068ae8a69483c30d55"]
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x1e9ffc2647406b77234b9ffd656cabfb97a0d331

# Diff at Wed, 09 Oct 2024 13:09:22 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20460352
- current block number: 20927364

## Description

Move to discovery driven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20460352 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: None
```

```diff
    contract OptimismMintablePermitERC20Factory (0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      name:
-        "MintableERC20FactoryProxy"
+        "OptimismMintablePermitERC20Factory"
      issuedPermissions.0.target:
-        "0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.via.0:
+        {"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0}
      template:
+        "opstack/OptimismMintableERC20Factory"
      displayName:
+        "OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract ProxyAdmin (0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"configure","target":"0x8c5D64d10394cFa070066e70Ec19E67398b4dABE"},{"permission":"upgrade","target":"0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc"},{"permission":"upgrade","target":"0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"},{"permission":"upgrade","target":"0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"},{"permission":"upgrade","target":"0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"},{"permission":"upgrade","target":"0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4"},{"permission":"upgrade","target":"0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5"}]
      template:
+        "opstack/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x8c5D64d10394cFa070066e70Ec19E67398b4dABE","description":"set and change address mappings."},{"permission":"upgrade","target":"0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc"},{"permission":"upgrade","target":"0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"},{"permission":"upgrade","target":"0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"},{"permission":"upgrade","target":"0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"},{"permission":"upgrade","target":"0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4"},{"permission":"upgrade","target":"0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5"}]
    }
```

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.1.via.0:
+        {"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0}
    }
```

```diff
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.via.0:
+        {"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
      categories:
+        ["Gateways&Escrows"]
    }
```

```diff
    contract OptimismPortal (0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.via.0:
+        {"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0}
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f) {
    +++ description: frxETH token contract. Fraxtal uses Frax Ether as the designated gas token, allowing users to pay for blockspace with frxETH.
      template:
+        "fraxtal/frxETH"
      displayName:
+        "frxETH Token"
      descriptions:
+        ["frxETH token contract. Fraxtal uses Frax Ether as the designated gas token, allowing users to pay for blockspace with frxETH."]
      issuedPermissions:
+        [{"permission":"configure","target":"0x0000000000000000000000000000000000000000","via":[]},{"permission":"configure","target":"0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27","via":[{"address":"0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA","delay":172800,"description":"can add and remove frxETH minters and set a new timelock address."}]},{"permission":"configure","target":"0xbAFA44EFE7901E04E39Dad13167D089C559c1138","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      template:
-        "opstack/SuperchainConfig"
+        "opstack/SuperchainConfigFake"
      descriptions.0:
-        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
      issuedPermissions.0.target:
-        "0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.via.0:
+        {"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.via.0:
+        {"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0}
    }
```

```diff
    contract Timelock (0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA) {
    +++ description: Allows for time-delayed execution of transactions. Current delay is 2d.
      values.delayFormatted:
+        "2d"
      template:
+        "fraxtal/Timelock"
      displayName:
+        "FrxEthTimelock"
      descriptions:
+        ["Allows for time-delayed execution of transactions. Current delay is 2d."]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x5E8422345238F34275888049021821E8E08CAa1f","description":"can add and remove frxETH minters and set a new timelock address."},{"permission":"configure","target":"0xbAFA44EFE7901E04E39Dad13167D089C559c1138","description":"can withdraw all escrowed ETH, pause the contract and set user fees for minting frxETH (`submit()`)."}]
    }
```

```diff
    contract AddressManager (0x8c5D64d10394cFa070066e70Ec19E67398b4dABE) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.via.0:
+        {"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0,"description":"set and change address mappings."}
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract L1ERC721Bridge (0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"
+        "0xe0d7755252873c4eF5788f7f45764E0e17610508"
      issuedPermissions.0.via.0:
+        {"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","delay":0}
    }
```

```diff
    contract sfrxETH (0xac3E018457B222d93114458476f3E3416Abbe38F) {
    +++ description: Vault token contract (ERC-4626) for staked frxETH. The smart contract receives frxETH tokens and mints sfrxETH tokens.
      descriptions:
+        ["Vault token contract (ERC-4626) for staked frxETH. The smart contract receives frxETH tokens and mints sfrxETH tokens."]
    }
```

```diff
    contract FraxtalTimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      name:
-        "TimelockMultisig"
+        "FraxtalTimelockMultisig"
      receivedPermissions:
+        [{"permission":"configure","target":"0x5E8422345238F34275888049021821E8E08CAa1f","description":"can add and remove frxETH minters and set a new timelock address.","via":[{"address":"0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA","delay":172800}]},{"permission":"configure","target":"0xbAFA44EFE7901E04E39Dad13167D089C559c1138","description":"can withdraw all escrowed ETH, pause the contract and set user fees for minting frxETH (`submit()`).","via":[{"address":"0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA","delay":172800}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA","delay":172800}]
    }
```

```diff
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138) {
    +++ description: Accepts user-supplied ETH and converts it to frxETH.
      template:
+        "fraxtal/FrxEthMinter"
      displayName:
+        "frxETH Minter"
      descriptions:
+        ["Accepts user-supplied ETH and converts it to frxETH."]
      issuedPermissions:
+        [{"permission":"configure","target":"0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27","via":[{"address":"0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA","delay":172800,"description":"can withdraw all escrowed ETH, pause the contract and set user fees for minting frxETH (`submit()`)."}]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x5E8422345238F34275888049021821E8E08CAa1f","description":"can mint frxETH tokens."}]
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x34a9f273cbD847d49c3De015FC26c3E66825f8b2","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]}
      receivedPermissions.1:
+        {"permission":"configure","target":"0x8c5D64d10394cFa070066e70Ec19E67398b4dABE","description":"set and change address mappings.","via":[{"address":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]}
      fieldMeta:
-        {"getOwners":{"severity":"LOW","description":"Signers of the multisig, high severity if threshold changes"},"getThreshold":{"severity":"HIGH","description":"Multisig threshold"}}
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA"}]
    }
```

Generated with discovered.json: 0x1ae5470c03aafe40419de58bbffee6cafb6a5ed3

# Diff at Tue, 01 Oct 2024 10:51:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20460352
- current block number: 20460352

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20460352 (main branch discovery), not current.

```diff
    contract MintableERC20FactoryProxy (0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-01T18:20:11.000Z",["0x1120ef11d4C3dc90Aa6BDfce16Ab049dd5d18aE0"]],["2024-02-19T16:52:35.000Z",["0x6cA98f43719231d38F6426DB64C7F3D5C7CE7876"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x126bcc31Bc076B3d515f60FBC81FddE0B0d542Ed) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-02-01T18:20:11.000Z",["0x31c25985E6b10CF335FC01cf9790aF4890d0505c"]],["2024-05-14T20:13:47.000Z",["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]],["2024-05-14T20:13:47.000Z",["0xC6e4ECE5576dC96846bb11eD8910f3dF3CE516b8"]]]
      values.$upgradeCount:
+        3
    }
```

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-02-01T18:20:11.000Z",["0x22052c592f763CA14a090D9974c5Bf9Fd3a44b8c"]],["2024-05-14T20:13:47.000Z",["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]],["2024-05-14T20:13:47.000Z",["0x4D7A1a16d0DA89B50FBd8b524508FC393A6Dc367"]]]
    }
```

```diff
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-01T18:20:23.000Z",["0x59B6903044Fa9439a5D621D3605789A6E654b1D6"]],["2024-05-14T20:13:47.000Z",["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]],["2024-05-14T20:13:47.000Z",["0x47Ec03B67ba4f3C71a4320D2947f2173E0B45a23"]]]
    }
```

```diff
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-02-01T18:19:59.000Z",["0x0d9C39c64CF8eDA1EdFeBD78AFa895bAA797eFc4"]],["2024-02-02T23:44:11.000Z",["0xb851fc304fCa88EDC89C287687AF4F6d7810bc14"]],["2024-02-02T23:44:11.000Z",["0x0d9C39c64CF8eDA1EdFeBD78AFa895bAA797eFc4"]]]
    }
```

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-02-01T18:20:23.000Z",["0xA30ADd78D5be6B2B55C934666bb4fF2C4429d800"]],["2024-02-02T23:44:11.000Z",["0x84c2f365733c6560bd49D8768d9c23B07A9DD630"]],["2024-05-14T20:13:47.000Z",["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]],["2024-05-14T20:13:47.000Z",["0x6f3CcC8C9DAf8B9b39aDe481213Ff7A626a42B65"]]]
    }
```

```diff
    contract L1ERC721Bridge (0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-02-01T18:20:11.000Z",["0x23A0478996241F9f966b7054c06FdeB96Ddf3475"]],["2024-05-14T20:13:47.000Z",["0x7a6b7F35D032c9b122C69F01EA4523e028f6ef4A"]],["2024-05-14T20:13:47.000Z",["0x7eE1637C33Ed0DFEE6403f3301B6d404106018e4"]]]
    }
```

Generated with discovered.json: 0xbfc6c834494fb0269111ffaaaa7db04f1ce9acf9

# Diff at Thu, 12 Sep 2024 15:36:07 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@e6761599b8d9e0b597372bb0e9ca885e08af7101 block: 20460352
- current block number: 20460352

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20460352 (main branch discovery), not current.

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      roles.1:
+        "Guardian"
      roles.0:
-        "Guardian"
+        "Challenger"
    }
```

Generated with discovered.json: 0xe4bb44a4613bca6eae7a08874ec51d990de86fd4

# Diff at Sun, 08 Sep 2024 17:24:26 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20460352
- current block number: 20460352

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20460352 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      receivedPermissions.3.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      descriptions:
-        ["It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0x512050dfd43ba80106644332c022f28bf9d74318

# Diff at Fri, 30 Aug 2024 07:52:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20460352
- current block number: 20460352

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20460352 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xdd6d64bb081a71eb004253744138350a9eaf2445

# Diff at Fri, 23 Aug 2024 09:52:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20460352
- current block number: 20460352

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20460352 (main branch discovery), not current.

```diff
    contract MintableERC20FactoryProxy (0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        4
    }
```

```diff
    contract L1ERC721Bridge (0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0xb4ede38fc76355d5b3a643b1dfda4a5dcf355e48

# Diff at Wed, 21 Aug 2024 10:03:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20460352
- current block number: 20460352

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20460352 (main branch discovery), not current.

```diff
    contract MintableERC20FactoryProxy (0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"configure":["0x8c5D64d10394cFa070066e70Ec19E67398b4dABE"],"upgrade":["0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc","0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2","0x34a9f273cbD847d49c3De015FC26c3E66825f8b2","0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D","0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4","0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4","0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x8c5D64d10394cFa070066e70Ec19E67398b4dABE","via":[]},{"permission":"upgrade","target":"0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc","via":[]},{"permission":"upgrade","target":"0x34a9f273cbD847d49c3De015FC26c3E66825f8b2","via":[]},{"permission":"upgrade","target":"0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2","via":[]},{"permission":"upgrade","target":"0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D","via":[]},{"permission":"upgrade","target":"0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4","via":[]},{"permission":"upgrade","target":"0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4","via":[]},{"permission":"upgrade","target":"0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5","via":[]}]
    }
```

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0xe0d7755252873c4eF5788f7f45764E0e17610508","via":[]},{"permission":"upgrade","target":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","via":[]}]
    }
```

```diff
    contract AddressManager (0x8c5D64d10394cFa070066e70Ec19E67398b4dABE) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA","via":[]}]
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x34a9f273cbD847d49c3De015FC26c3E66825f8b2","via":[]}]
    }
```

Generated with discovered.json: 0xb28d11642d4e4adcc6fa7246d54c36430e1c4126

# Diff at Fri, 09 Aug 2024 11:59:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20460352
- current block number: 20460352

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20460352 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.6:
-        "0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"
+        "0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5"
      assignedPermissions.upgrade.5:
-        "0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"
+        "0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4"
      assignedPermissions.upgrade.4:
-        "0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5"
+        "0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"
      assignedPermissions.upgrade.3:
-        "0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc"
+        "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
      assignedPermissions.upgrade.2:
-        "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
+        "0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"
      assignedPermissions.upgrade.0:
-        "0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4"
+        "0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc"
    }
```

Generated with discovered.json: 0x521467e3949ad399abef5c1b0575ffbba44d721d

# Diff at Fri, 09 Aug 2024 10:09:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20460352
- current block number: 20460352

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20460352 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc","0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2","0x34a9f273cbD847d49c3De015FC26c3E66825f8b2","0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D","0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4","0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4","0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5"]
      assignedPermissions.owner:
-        ["0x8c5D64d10394cFa070066e70Ec19E67398b4dABE"]
      assignedPermissions.configure:
+        ["0x8c5D64d10394cFa070066e70Ec19E67398b4dABE"]
      assignedPermissions.upgrade:
+        ["0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4","0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2","0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D","0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc","0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5","0x34a9f273cbD847d49c3De015FC26c3E66825f8b2","0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4"]
    }
```

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0x381e2495e683868F693AA5B1414F712f21d34b40","0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228","0xcbc616D595D38483e6AdC45C7E426f44bF230928","0xc28339c70054bC22255A74E927a0B9e9A475F224","0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2","0x8da4E997e051605878c9C0B793c496556EACC2C0","0x6e74053a3798e0fC9a9775F7995316b27f21c4D2"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x381e2495e683868F693AA5B1414F712f21d34b40","0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228","0xcbc616D595D38483e6AdC45C7E426f44bF230928","0xc28339c70054bC22255A74E927a0B9e9A475F224","0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2","0x8da4E997e051605878c9C0B793c496556EACC2C0","0x6e74053a3798e0fC9a9775F7995316b27f21c4D2"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract TimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2","0xcbc616D595D38483e6AdC45C7E426f44bF230928","0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e","0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228","0x05FB8eC3C41da95b26fCb85503DaF8B89B89A935"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2","0xcbc616D595D38483e6AdC45C7E426f44bF230928","0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e","0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228","0x05FB8eC3C41da95b26fCb85503DaF8B89B89A935"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.owner:
-        ["0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"]
      assignedPermissions.configure:
+        ["0x34a9f273cbD847d49c3De015FC26c3E66825f8b2"]
      values.$multisigThreshold:
-        "3 of 5 (60%)"
+++ description: Signers of the multisig, high severity if threshold changes
+++ severity: LOW
      values.getOwners:
-        ["0x8da4E997e051605878c9C0B793c496556EACC2C0","0x6e74053a3798e0fC9a9775F7995316b27f21c4D2","0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2","0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e","0xcbc616D595D38483e6AdC45C7E426f44bF230928"]
+++ description: Multisig threshold
+++ severity: HIGH
      values.getThreshold:
-        3
      values.$members:
+        ["0x8da4E997e051605878c9C0B793c496556EACC2C0","0x6e74053a3798e0fC9a9775F7995316b27f21c4D2","0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2","0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e","0xcbc616D595D38483e6AdC45C7E426f44bF230928"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xc3e8941178b3803db5522df6ac9a70c1c4868b70

# Diff at Mon, 05 Aug 2024 05:44:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14945a4ebc63b3db3867f33067f31f159fedd9a9 block: 20432632
- current block number: 20460352

## Description

frxETH owner transfered to a 2-day timelock.

## Watched changes

```diff
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f) {
    +++ description: None
      values.nominatedOwner:
-        "0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA"
+        "0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x8306300ffd616049FD7e4b0354a64Da835c1A81C"
+        "0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA"
    }
```

Generated with discovered.json: 0xd0c7f2c911c60be8d297499da7cd55c0e393e1bf

# Diff at Thu, 01 Aug 2024 08:54:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@295430f331b68784c13ccda9222bc78df1e833c5 block: 20032836
- current block number: 20432632

## Description

Two signers are added to frxETHMultisig. 
One minter is removed from frxETH, leaving frxETHMinter as the only minter. A new owner is nominated for frxETH (would transfer the ownership from frxETHMultisig to a timelock)

## Watched changes

```diff
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f) {
    +++ description: None
      values.minters_array.1:
-        "0x8306300ffd616049FD7e4b0354a64Da835c1A81C"
+        "0x0000000000000000000000000000000000000000"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA"
    }
```

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
+        "4 of 7 (57%)"
      values.getOwners.6:
+        "0x6e74053a3798e0fC9a9775F7995316b27f21c4D2"
      values.getOwners.5:
+        "0x8da4E997e051605878c9C0B793c496556EACC2C0"
      values.getOwners.4:
-        "0x6e74053a3798e0fC9a9775F7995316b27f21c4D2"
+        "0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2"
      values.getOwners.3:
-        "0x8da4E997e051605878c9C0B793c496556EACC2C0"
+        "0xc28339c70054bC22255A74E927a0B9e9A475F224"
      values.getOwners.2:
-        "0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2"
+        "0xcbc616D595D38483e6AdC45C7E426f44bF230928"
      values.getOwners.1:
-        "0xc28339c70054bC22255A74E927a0B9e9A475F224"
+        "0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228"
      values.getOwners.0:
-        "0xcbc616D595D38483e6AdC45C7E426f44bF230928"
+        "0x381e2495e683868F693AA5B1414F712f21d34b40"
      values.getThreshold:
-        3
+        4
    }
```

Generated with discovered.json: 0x14e4842c3a4c9f8badeee84a257038d6be144f50

# Diff at Tue, 30 Jul 2024 11:11:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20032836
- current block number: 20032836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032836 (main branch discovery), not current.

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      fieldMeta:
+        {"getOwners":{"severity":"LOW","description":"Signers of the multisig, high severity if threshold changes"},"getThreshold":{"severity":"HIGH","description":"Multisig threshold"}}
    }
```

Generated with discovered.json: 0x6002e87a118db1246bf48b3a23039cc57a2034cb

# Diff at Thu, 18 Jul 2024 10:30:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20032836
- current block number: 20032836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032836 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x126bcc31Bc076B3d515f60FBC81FddE0B0d542Ed) {
    +++ description: None
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract ProxyAdmin (0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA) {
    +++ description: None
      descriptions:
+        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
    }
```

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions.0:
-        "Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address."
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2) {
    +++ description: None
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
    }
```

```diff
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4) {
    +++ description: None
      template:
+        "opstack/SuperchainConfig"
      descriptions:
+        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      categories:
+        ["Upgrades&Governance"]
    }
```

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: None
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract L1ERC721Bridge (0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5) {
    +++ description: None
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      descriptions:
+        ["It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
      roles:
+        ["Guardian"]
    }
```

Generated with discovered.json: 0xf2c582e2f7128402eccf6eb72a839212520d0b9e

# Diff at Thu, 06 Jun 2024 12:39:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@5302ef2899ddfb7175df497ceaa47fba4e383655 block: 19982475
- current block number: 20032836

## Description

Discovery output now includes names of templates used for contract analysis.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19982475 (main branch discovery), not current.

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
      template:
+        "opstack/SystemConfig"
    }
```

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

```diff
    contract TimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0xf0c97ee110e8ec5c671f43cd04bf06c74a0ebd67

# Diff at Thu, 30 May 2024 11:50:41 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@3fadb11e3d19143a19dce8628dd550d0213d6c9b block: 19875788
- current block number: 19982475

## Description

One signer of fraxtal Multisig is replaced and L2 fee calculation is switched to [post-Ecotone encoding](https://specs.optimism.io/protocol/system-config.html#ecotone-scalar-overhead-uint256uint256-change).

## Watched changes

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
+++ description: Signers of the multisig, high severity if threshold changes
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.0:
-        "0x892D3076fb9Ac7Cb2B9cF25F051A275E69D460e3"
+        "0x8da4E997e051605878c9C0B793c496556EACC2C0"
    }
```

Generated with discovered.json: 0xb4e392b5d9341f4a7fce949f64679f35dd02550b

# Diff at Wed, 15 May 2024 13:50:16 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@2a68252776877f0b82e9f7cf6261b744952be771 block: 19859844
- current block number: 19875788

## Description

### Immutables now variable

This upgrade is touching all major contracts of the rollup system, with only minor changes to immutables, identical to the [Optimism Upgrade Proposal #6: Multi-Chain Prep (MCP) L1](https://gov.optimism.io/t/upgrade-proposal-6-multi-chain-prep-mcp-l1/7677)

The new implementations are code-identical to the optimism upgrade on which comments can be found in optimisms diffHistory.md under 'Diff at Fri, 12 Apr 2024 12:08:01 GMT'. Only exception is the customized OptimismPortal (FraxchainPortal) by Fraxtal. But that one has again the optimism changes, just merged.

## Watched changes

```diff
    contract L1CrossDomainMessenger (0x126bcc31Bc076B3d515f60FBC81FddE0B0d542Ed) {
    +++ description: None
      upgradeability.implementation:
-        "0x31c25985E6b10CF335FC01cf9790aF4890d0505c"
+        "0xC6e4ECE5576dC96846bb11eD8910f3dF3CE516b8"
      implementations.0:
-        "0x31c25985E6b10CF335FC01cf9790aF4890d0505c"
+        "0xC6e4ECE5576dC96846bb11eD8910f3dF3CE516b8"
      values.version:
-        "2.2.0"
+        "2.3.0"
      values.otherMessenger:
+        "0x4200000000000000000000000000000000000007"
    }
```

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: None
      upgradeability.implementation:
-        "0x22052c592f763CA14a090D9974c5Bf9Fd3a44b8c"
+        "0x4D7A1a16d0DA89B50FBd8b524508FC393A6Dc367"
      implementations.0:
-        "0x22052c592f763CA14a090D9974c5Bf9Fd3a44b8c"
+        "0x4D7A1a16d0DA89B50FBd8b524508FC393A6Dc367"
      values.version:
-        "1.11.0"
+        "1.12.0"
      values.BATCH_INBOX_SLOT:
+        "0x71ac12829d66ee73d8d95bff50b3589745ce57edae70a3fb111a2342464dc597"
      values.batchInbox:
+        "0xfF000000000000000000000000000000000420fC"
      values.L1_CROSS_DOMAIN_MESSENGER_SLOT:
+        "0x383f291819e6d54073bc9a648251d97421076bdd101933c0c022219ce9580636"
      values.L1_ERC_721_BRIDGE_SLOT:
+        "0x46adcbebc6be8ce551740c29c47c8798210f23f7f4086c41752944352568d5a7"
      values.L1_STANDARD_BRIDGE_SLOT:
+        "0x9904ba90dde5696cda05c9e0dab5cbaa0fea005ace4d11218a02ac668dad6376"
      values.l1CrossDomainMessenger:
+        "0x126bcc31Bc076B3d515f60FBC81FddE0B0d542Ed"
      values.l1ERC721Bridge:
+        "0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5"
      values.l1StandardBridge:
+        "0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2"
      values.L2_OUTPUT_ORACLE_SLOT:
+        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
+        "0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4"
      values.OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT:
+        "0xa04c5bb938ca6fc46d95553abf0a76345ce3e722a30bf4f74928b8e7d852320c"
      values.OPTIMISM_PORTAL_SLOT:
+        "0x4b6c74f9e688cb39801f2112c14a8c57232a3fc5202e1444126d4bce86eb19ac"
      values.optimismMintableERC20Factory:
+        "0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc"
      values.optimismPortal:
+        "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
      values.START_BLOCK_SLOT:
+        "0xa11ee3ab75b40e88a0105e935d17cd36c8faee0138320d776c411291bdbbb19f"
      values.startBlock:
+        19135324
    }
```

```diff
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2) {
    +++ description: None
      upgradeability.implementation:
-        "0xCC26248B71284B812Ff7825e005560DB01a874C7"
+        "0x30Cd695249394eED44C576f2caEC5304be6455F9"
      implementations.0:
-        "0xCC26248B71284B812Ff7825e005560DB01a874C7"
+        "0x30Cd695249394eED44C576f2caEC5304be6455F9"
      values.version:
-        "2.0.0"
+        "2.1.0"
    }
```

```diff
    contract OptimismPortal (0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D) {
    +++ description: None
      upgradeability.implementation:
-        "0x59B6903044Fa9439a5D621D3605789A6E654b1D6"
+        "0x47Ec03B67ba4f3C71a4320D2947f2173E0B45a23"
      implementations.0:
-        "0x59B6903044Fa9439a5D621D3605789A6E654b1D6"
+        "0x47Ec03B67ba4f3C71a4320D2947f2173E0B45a23"
      values.version:
-        "2.4.0"
+        "2.5.0"
    }
```

```diff
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4) {
    +++ description: None
      upgradeability.implementation:
-        "0x84c2f365733c6560bd49D8768d9c23B07A9DD630"
+        "0x6f3CcC8C9DAf8B9b39aDe481213Ff7A626a42B65"
      implementations.0:
-        "0x84c2f365733c6560bd49D8768d9c23B07A9DD630"
+        "0x6f3CcC8C9DAf8B9b39aDe481213Ff7A626a42B65"
      values.version:
-        "1.7.0"
+        "1.8.0"
    }
```

```diff
    contract L1ERC721Bridge (0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5) {
    +++ description: None
      upgradeability.implementation:
-        "0x23A0478996241F9f966b7054c06FdeB96Ddf3475"
+        "0x7eE1637C33Ed0DFEE6403f3301B6d404106018e4"
      implementations.0:
-        "0x23A0478996241F9f966b7054c06FdeB96Ddf3475"
+        "0x7eE1637C33Ed0DFEE6403f3301B6d404106018e4"
      values.version:
-        "2.0.0"
+        "2.1.0"
    }
```

## Source code changes

```diff
.../L1CrossDomainMessenger.sol                     | 201 +++++++++++++++----
 .../L1ERC721Bridge/L1ERC721Bridge.sol              | 190 ++++++++++++++----
 .../L1StandardBridge/L1StandardBridge.sol          | 213 ++++++++++++++++-----
 .../L2OutputOracle/L2OutputOracle.sol              | 151 ++++++++-------
 .../OptimismPortal/FraxchainPortal.sol             |  95 +++++----
 .../SystemConfig/SystemConfig.sol                  | 166 +++++++++++++---
 6 files changed, 769 insertions(+), 247 deletions(-)
```

Generated with discovered.json: 0x1be769dd7c57d040bbbab89bd20d2c7b751d5419

# Diff at Mon, 13 May 2024 08:17:32 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@142cacbaef1c026127ab0d88f45c576741b3a345 block: 19573574
- current block number: 19859844

## Description

One signer of the frxETH Multisig is changed.

## Watched changes

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: This address is the owner of the gas token contract frxETH, and the frxETHMinter contract. It can pause and unpause ETH deposits, and change how much ETH is withheld from each submit() transaction.
      values.getOwners.3:
-        "0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228"
+        "0x8da4E997e051605878c9C0B793c496556EACC2C0"
    }
```

Generated with discovered.json: 0x8b040a76aba80d05b354d6a3599890e6aefd6263

# Diff at Wed, 03 Apr 2024 06:51:43 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b58073d6e00a407c2aba3b43af1c68de0726a85a block: 19532850
- current block number: 19573574

## Description

One signer of frxETH Multisig is changed.

## Watched changes

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: This address is the owner of the gas token contract frxETH, and the frxETHMinter contract. It can pause and unpause ETH deposits, and change how much ETH is withheld from each submit() transaction.
      values.getOwners.3:
-        "0x05FB8eC3C41da95b26fCb85503DaF8B89B89A935"
+        "0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228"
    }
```

Generated with discovered.json: 0xf2ca2b1fecb97feb06e36aecc6f50407d20055c1

# Diff at Thu, 28 Mar 2024 13:17:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@d6dd20a306b268b851f83df5487b048c1253bb51 block: 19531830
- current block number: 19532850

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531830 (main branch discovery), not current.

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract TimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x0f8dee218ea3b0b3545bdbcadcdc249d145a3a03

# Diff at Fri, 15 Mar 2024 10:25:21 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6a294996c13c1a3ad00c7c4d72e651e8fbd4fa1c block: 19412037
- current block number: 19439733

## Description

One signer in the multisig is changed.

## Watched changes

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
+++ description: Signers of the multisig, high severity if threshold changes
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.4:
-        "0xf4E1d185666a624099298FcC42C50ba662DC7e52"
+        "0xcbc616D595D38483e6AdC45C7E426f44bF230928"
    }
```

Generated with discovered.json: 0xc7d883541dcc997f1ca9944846e1b7ddd7675f47

# Diff at Mon, 11 Mar 2024 13:05:47 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19384276
- current block number: 19412037

## Description

Update discovery to include the multisig threshold.

## Watched changes

```diff
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138) {
    +++ description: None
      values.withholdRatio:
-        920000
+        980000
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19384276 (main branch discovery), not current.

```diff
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0xc776573184b74c22a61dc03318859dd4c0928cea

# Diff at Thu, 07 Mar 2024 15:46:08 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@b0c42602239073a6821d73af2ad55522306d8622 block: 19374912
- current block number: 19384276

## Description

Ignored nonces, totalSupply and deposit count/root methods.

## Watched changes

```diff
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C) {
    +++ description: None
      values.getOwners.0:
-        "0xf4E1d185666a624099298FcC42C50ba662DC7e52"
+        "0xcbc616D595D38483e6AdC45C7E426f44bF230928"
    }
```

```diff
    contract TimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      values.getOwners.1:
-        "0xf4E1d185666a624099298FcC42C50ba662DC7e52"
+        "0xcbc616D595D38483e6AdC45C7E426f44bF230928"
    }
```

```diff
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138) {
    +++ description: None
      values.numValidators:
-        212
+        211
    }
```

```diff
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508) {
    +++ description: None
      values.getOwners[5]:
-        "0xE7c147CD1A7c05a6e73217645547582024E87a9B"
    }
```

Generated with discovered.json: 0xa0e7c3cc5c7b0345b997f268444feac8ada39a1b

# Diff at Wed, 06 Mar 2024 08:24:18 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19374912

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintableERC20FactoryProxy (0x11FE3be54aC01C13Dd985cE2BdD10eD77e1376cc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x126bcc31Bc076B3d515f60FBC81FddE0B0d542Ed)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x13Fe62cB24aEa5afd179F20D362c056c3881ABcA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x34a9f273cbD847d49c3De015FC26c3E66825f8b2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x61ca43CB037aC9181d8Fa5CD0073dC314065Ccc4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x8c5D64d10394cFa070066e70Ec19E67398b4dABE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xa9B5Fb84B7aeAF0D51C95DB04a76B1D4738D0eC5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH (0xac3E018457B222d93114458476f3E3416Abbe38F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FraxtalMultisig (0xe0d7755252873c4eF5788f7f45764E0e17610508)
    +++ description: None
```
