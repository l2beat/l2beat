Generated with discovered.json: 0xf7590484162a44dda4f05bdc6c99c5cb2783cd80

# Diff at Tue, 04 Mar 2025 11:26:11 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21637087
- current block number: 21637087

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637087 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
      values.opStackDA.isUsingCelestia:
+        true
    }
```

Generated with discovered.json: 0xe2dbab7f692079de5eb199f03af4395313f9e0f7

# Diff at Tue, 04 Mar 2025 10:39:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21637087
- current block number: 21637087

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637087 (main branch discovery), not current.

```diff
    contract AddressManager (0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        17672708
    }
```

```diff
    contract BalanceClaimer (0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21) {
    +++ description: Allows proving ERC20 and/or ETH balances of L2 accounts with a merkle proof and without having to trigger a withdrawal transaction on the L2. The merkle root is immutable and set upon creation of this contract.
      sinceBlock:
+        21382109
    }
```

```diff
    contract PgnMultisig (0x39E13D1AB040F6EA58CE19998edCe01B3C365f84) {
    +++ description: None
      sinceBlock:
+        17665783
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sinceBlock:
+        16990669
    }
```

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        17672715
    }
```

```diff
    contract L1CrossDomainMessenger (0x97BAf688E5d0465E149d1d5B497Ca99392a6760e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        17672711
    }
```

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        17672710
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        17672712
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      sinceBlock:
+        17672707
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        17672709
    }
```

Generated with discovered.json: 0xebffb4b862b650979062c652829368f341660ccd

# Diff at Wed, 26 Feb 2025 10:32:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21637087
- current block number: 21637087

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637087 (main branch discovery), not current.

```diff
    contract BalanceClaimer (0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21) {
    +++ description: Allows proving ERC20 and/or ETH balances of L2 accounts with a merkle proof and without having to trigger a withdrawal transaction on the L2. The merkle root is immutable and set upon creation of this contract.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x97BAf688E5d0465E149d1d5B497Ca99392a6760e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xade1a1fd6296de89d10137192d13bc9947447fc8

# Diff at Fri, 21 Feb 2025 14:10:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21637087
- current block number: 21637087

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637087 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xf9622074c4927906acfcec022043bdffc6044f0a

# Diff at Fri, 21 Feb 2025 08:59:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21637087
- current block number: 21637087

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637087 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x97BAf688E5d0465E149d1d5B497Ca99392a6760e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0xb8fe885ba59aaf3a244772a4b5a1435afd750ffb

# Diff at Mon, 10 Feb 2025 19:04:28 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21637087
- current block number: 21637087

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637087 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x45d422ea3c8d23efe346c5a36311d969ded1bd82

# Diff at Tue, 04 Feb 2025 12:31:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21637087
- current block number: 21637087

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637087 (main branch discovery), not current.

```diff
    contract AddressManager (0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract BalanceClaimer (0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21) {
    +++ description: Allows proving ERC20 and/or ETH balances of L2 accounts with a merkle proof and without having to trigger a withdrawal transaction on the L2. The merkle root is immutable and set upon creation of this contract.
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
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
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.permission:
-        "guard"
+        "interact"
      issuedPermissions.1.to:
-        "0x39E13D1AB040F6EA58CE19998edCe01B3C365f84"
+        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
      issuedPermissions.1.description:
+        "withdraw ETH escrowed in the OptimismPortal."
      issuedPermissions.0.permission:
-        "configure"
+        "guard"
      issuedPermissions.0.to:
-        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
+        "0x39E13D1AB040F6EA58CE19998edCe01B3C365f84"
      issuedPermissions.0.description:
-        "withdraw ETH escrowed in the OptimismPortal."
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x64073e2fedd4086b36057702af9b1381f6761ccf

# Diff at Mon, 20 Jan 2025 11:09:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637087
- current block number: 21637087

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637087 (main branch discovery), not current.

```diff
    contract AddressManager (0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract BalanceClaimer (0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21) {
    +++ description: Allows proving ERC20 and/or ETH balances of L2 accounts with a merkle proof and without having to trigger a withdrawal transaction on the L2. The merkle root is immutable and set upon creation of this contract.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      receivedPermissions.1.target:
-        "0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"
      receivedPermissions.1.from:
+        "0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"
      receivedPermissions.0.target:
-        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
      receivedPermissions.0.from:
+        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
    }
```

```diff
    contract PgnMultisig (0x39E13D1AB040F6EA58CE19998edCe01B3C365f84) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
      receivedPermissions.1.from:
+        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
      receivedPermissions.0.target:
-        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
      receivedPermissions.0.from:
+        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.6.target:
-        "0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"
      receivedPermissions.6.from:
+        "0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"
      receivedPermissions.5.target:
-        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
      receivedPermissions.5.from:
+        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
      receivedPermissions.4.target:
-        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
      receivedPermissions.4.from:
+        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
      receivedPermissions.3.target:
-        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
      receivedPermissions.3.from:
+        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
      receivedPermissions.2.target:
-        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
      receivedPermissions.2.from:
+        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
      receivedPermissions.1.target:
-        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
      receivedPermissions.1.from:
+        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
      receivedPermissions.0.target:
-        "0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e"
      receivedPermissions.0.from:
+        "0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e"
      directlyReceivedPermissions.0.target:
-        "0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"
      directlyReceivedPermissions.0.from:
+        "0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"
    }
```

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x99526b0e49A95833E734EB556A6aBaFFAb0Ee167"
      issuedPermissions.1.to:
+        "0x99526b0e49A95833E734EB556A6aBaFFAb0Ee167"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x69968Ce0E92d9c101BAd81de55EFbcb69603cFe3"
      issuedPermissions.1.to:
+        "0x69968Ce0E92d9c101BAd81de55EFbcb69603cFe3"
      issuedPermissions.0.target:
-        "0x39E13D1AB040F6EA58CE19998edCe01B3C365f84"
      issuedPermissions.0.to:
+        "0x39E13D1AB040F6EA58CE19998edCe01B3C365f84"
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x39E13D1AB040F6EA58CE19998edCe01B3C365f84"
      issuedPermissions.1.to:
+        "0x39E13D1AB040F6EA58CE19998edCe01B3C365f84"
      issuedPermissions.0.target:
-        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
      issuedPermissions.0.to:
+        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
      issuedPermissions.0.description:
+        "withdraw ETH escrowed in the OptimismPortal."
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      directlyReceivedPermissions.5.target:
-        "0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"
      directlyReceivedPermissions.5.from:
+        "0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"
      directlyReceivedPermissions.4.target:
-        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
      directlyReceivedPermissions.4.from:
+        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
      directlyReceivedPermissions.3.target:
-        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
      directlyReceivedPermissions.3.from:
+        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
      directlyReceivedPermissions.2.target:
-        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
      directlyReceivedPermissions.2.from:
+        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
      directlyReceivedPermissions.1.target:
-        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
      directlyReceivedPermissions.1.from:
+        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
      directlyReceivedPermissions.0.target:
-        "0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e"
      directlyReceivedPermissions.0.from:
+        "0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e"
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.target:
-        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
      issuedPermissions.0.to:
+        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
      issuedPermissions.0.description:
+        "withdraw ERC-20 tokens escrowed in the bridge."
    }
```

Generated with discovered.json: 0x4855bac05b03baa4d5d1bdbfc9459b74e341cc6c

# Diff at Thu, 16 Jan 2025 12:37:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21428894
- current block number: 21637087

## Description

ConduitMultisig signer changes.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.8:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.7:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.5:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.4:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.3:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.2:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.1:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.0:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0x64f7bd3bfe8a96b4ff88b306b9100f6c29c17653

# Diff at Wed, 08 Jan 2025 09:39:35 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@3870091bac574174d64874eed9f76e846e3c3c9e block: 21428894
- current block number: 21428894

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21428894 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xf2c34bb8ea00da0d45419dedffb6de0495deb57f

# Diff at Wed, 18 Dec 2024 10:43:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a44ef6747febdd9930ef05420e60556c20899f13 block: 21415736
- current block number: 21428894

## Description

OptiPortal unpaused, ready for claims through the BalanceClaimer added in the last upgrade.

## Watched changes

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.paused:
-        true
+        false
    }
```

Generated with discovered.json: 0x450ab2617c6d7c7826a6f90f48870b03e998d403

# Diff at Mon, 16 Dec 2024 14:40:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f33537d5b381f743921fc5e40006feb3f31e39a6 block: 21370693
- current block number: 21415736

## Description

Upgrade to a new version of OptimismPortal which adds an `IEthBalanceWithdrawer` that allows the `BALANCE_CLAIMER` address to withdraw ETH and bypass the usual OP stack proving of withdrawals.

A similar uprade is made to the L1StandardBridge regarding ERC20 tokens, and referencing the same privileged address which is the following SC:

### BalanceClaimer.sol

Allows proving ERC20 and/or ETH balances of L2 accounts with a merkle proof and without having to trigger a withdrawal tx on the L2.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"}]}
      receivedPermissions.5.target:
-        "0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"
+        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
      receivedPermissions.5.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.4.target:
-        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
+        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
      receivedPermissions.3.target:
-        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
+        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
      receivedPermissions.2.target:
-        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
+        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
-        "opstack/OptimismPortal"
+        "opstack/OptimismPortal_PGN_withdraw"
      sourceHashes.1:
-        "0x8d871731877bb6dfe48e64a821acb08680fe17b500908486a34315093c236d0b"
+        "0x18ba9f08d5c62bddd4131c2df38d760af4011869233e575569a52379ec8eee6a"
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x39E13D1AB040F6EA58CE19998edCe01B3C365f84"
      issuedPermissions.1.via.0:
-        {"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}
      issuedPermissions.0.permission:
-        "guard"
+        "configure"
      issuedPermissions.0.target:
-        "0x39E13D1AB040F6EA58CE19998edCe01B3C365f84"
+        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
      values.$implementation:
-        "0x436e9FC7894e26718637f086d42B4a06439C8ae0"
+        "0x75A2AAc09C8A51Bdde7303B06F1aD2fFFcCf8c09"
      values.$pastUpgrades.1:
+        ["2024-12-13T23:16:59.000Z","0x3fe74b8c72f294ff456a997ea43070350485d48cb96da3390ae02837cf626789",["0x75A2AAc09C8A51Bdde7303B06F1aD2fFFcCf8c09"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "1.6.0"
+        "1.7.0"
      values.BALANCE_CLAIMER:
+        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      directlyReceivedPermissions.5:
+        {"permission":"upgrade","target":"0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b","description":"upgrading the bridge implementation can give access to all funds escrowed therein."}
      directlyReceivedPermissions.4.target:
-        "0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"
+        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
      directlyReceivedPermissions.4.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.3.target:
-        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
+        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
      directlyReceivedPermissions.2.target:
-        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
+        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
      directlyReceivedPermissions.1.target:
-        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
+        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      template:
-        "opstack/L1StandardBridge"
+        "opstack/L1StandardBridge_PGN_withdraw"
      sourceHashes.1:
-        "0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"
+        "0x6e17f8c044cb5416af604d756bb7ab831395f1ea7638248701de78a55271e561"
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0,"description":"upgrading the bridge implementation can give access to all funds escrowed therein."}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
      issuedPermissions.0.via.0:
-        {"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0,"description":"upgrading the bridge implementation can give access to all funds escrowed therein."}
      values.$implementation:
-        "0x459bA3BD8fb18CCBf557Ae9Fab13ceD2542B0d8E"
+        "0xF5328094aE48F975CF588f361DDCC749F706aAF0"
      values.version:
-        "1.1.0"
+        "1.2.0"
      values.BALANCE_CLAIMER:
+        "0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21"
    }
```

```diff
+   Status: CREATED
    contract BalanceClaimer (0x0Ca4C7A370E0155c77a33e78443a54D749E0BC21)
    +++ description: Allows proving ERC20 and/or ETH balances of L2 accounts with a merkle proof and without having to trigger a withdrawal transaction on the L2. The merkle root is immutable and set upon creation of this contract.
```

## Source code changes

```diff
.../.flat/BalanceClaimer/BalanceClaimer.sol        | 437 +++++++++++++++++++++
 .../ethereum/.flat/BalanceClaimer/Proxy.p.sol      | 211 ++++++++++
 .../L1StandardBridge/L1StandardBridge.sol          | 145 ++++++-
 .../OptimismPortal/OptimismPortal.sol              |  45 ++-
 4 files changed, 813 insertions(+), 25 deletions(-)
```

Generated with discovered.json: 0x962172660b260c8e4757ea803798cee6b6258bdd

# Diff at Tue, 10 Dec 2024 07:45:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d01c69c8d162d3e9a035a25c270d68755988c138 block: 21279547
- current block number: 21370693

## Description

The OptimismPortal is paused. Added headerWarn.

## Watched changes

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.paused:
-        false
+        true
    }
```

Generated with discovered.json: 0x460884ac8fa58dba8bbb255ed7bb94bc81022108

# Diff at Wed, 27 Nov 2024 14:00:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3b9391cfe483e60a1853eeae6e47b4de475aac4e block: 21078677
- current block number: 21279547

## Description

Two signers added to PGN multisig, executed by a signer associated with Conduit. No other actions from this MS.

## Watched changes

```diff
    contract PgnMultisig (0x39E13D1AB040F6EA58CE19998edCe01B3C365f84) {
    +++ description: None
      values.$members.7:
+        "0xc2E2B715d9e302947Ec7e312fd2384b5a1296099"
      values.$members.6:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.5:
-        "0xc2E2B715d9e302947Ec7e312fd2384b5a1296099"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.4:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
      values.$members.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.2:
-        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.0:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 8 (38%)"
    }
```

Generated with discovered.json: 0x8229c8426a1a9e39d13779faa53aecfe2fc2299e

# Diff at Fri, 01 Nov 2024 12:10:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078677
- current block number: 21078677

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078677 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.5.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      directlyReceivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xdcfbb5e7a567583697633f2afad94ce153827335

# Diff at Wed, 30 Oct 2024 13:12:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20913652
- current block number: 21078677

## Description

Conduit MS: Signer added.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.7:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.6:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.5:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.4:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.3:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.2:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.1:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.0:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0xec17812be628d5892468779447df31c65742fd31

# Diff at Tue, 29 Oct 2024 13:16:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20913652
- current block number: 20913652

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20913652 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x33f1e7e08e5d6328c7b9e954d0502443dc7187c3

# Diff at Mon, 21 Oct 2024 12:47:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20913652
- current block number: 20913652

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20913652 (main branch discovery), not current.

```diff
    contract AddressManager (0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1CrossDomainMessenger (0x97BAf688E5d0465E149d1d5B497Ca99392a6760e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

Generated with discovered.json: 0x0c4042e63e812e06482b4bcc27e72d09929b8c53

# Diff at Mon, 21 Oct 2024 11:09:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20913652
- current block number: 20913652

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20913652 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x463B3777d3DD6a90234b594D1f94002267CE7948"]
      values.$pastUpgrades.0.1:
-        ["0x463B3777d3DD6a90234b594D1f94002267CE7948"]
+        "0x8dda57c861029983d272a1d027defd399f3f9e2f2583e727b108e485801500c3"
    }
```

```diff
    contract L1CrossDomainMessenger (0x97BAf688E5d0465E149d1d5B497Ca99392a6760e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.1.2:
+        ["0x1d8180D739D01dC97e837478af8d494215C5EF5e"]
      values.$pastUpgrades.1.1:
-        ["0x1d8180D739D01dC97e837478af8d494215C5EF5e"]
+        "0xb9822d59b3f66040b5283611a47e3ffaf597d522a7dc58fa41108dbf9594cd7a"
      values.$pastUpgrades.0.2:
+        ["0x0000000000000000000000000000000000000000"]
      values.$pastUpgrades.0.1:
-        ["0x0000000000000000000000000000000000000000"]
+        "0x8dda57c861029983d272a1d027defd399f3f9e2f2583e727b108e485801500c3"
    }
```

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0x76983dfED43C7ae7ebB592A92Be2BE972cAE4348"]
      values.$pastUpgrades.0.1:
-        ["0x76983dfED43C7ae7ebB592A92Be2BE972cAE4348"]
+        "0xb9822d59b3f66040b5283611a47e3ffaf597d522a7dc58fa41108dbf9594cd7a"
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x436e9FC7894e26718637f086d42B4a06439C8ae0"]
      values.$pastUpgrades.0.1:
-        ["0x436e9FC7894e26718637f086d42B4a06439C8ae0"]
+        "0xb9822d59b3f66040b5283611a47e3ffaf597d522a7dc58fa41108dbf9594cd7a"
    }
```

Generated with discovered.json: 0x588a75cdf289c673ef27a5fc9616eefaf13858c9

# Diff at Wed, 16 Oct 2024 11:39:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20913652
- current block number: 20913652

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20913652 (main branch discovery), not current.

```diff
    contract PgnMultisig (0x39E13D1AB040F6EA58CE19998edCe01B3C365f84) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions:
+        [{"permission":"challenge","target":"0xA38d0c4E6319F9045F20318BA5f04CDe94208608"},{"permission":"guard","target":"0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"}]
    }
```

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x99526b0e49A95833E734EB556A6aBaFFAb0Ee167"
      issuedPermissions.1.via.0:
-        {"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x69968Ce0E92d9c101BAd81de55EFbcb69603cFe3","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x39E13D1AB040F6EA58CE19998edCe01B3C365f84"
      issuedPermissions.0.via.0:
-        {"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x39E13D1AB040F6EA58CE19998edCe01B3C365f84"
      issuedPermissions.0.via.0:
-        {"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}
    }
```

Generated with discovered.json: 0x294a6f2b202692aa0c553338ab918fc83d2f869b

# Diff at Mon, 14 Oct 2024 10:54:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20913652
- current block number: 20913652

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20913652 (main branch discovery), not current.

```diff
    contract AddressManager (0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract PgnMultisig (0x39E13D1AB040F6EA58CE19998edCe01B3C365f84) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x97BAf688E5d0465E149d1d5B497Ca99392a6760e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"]
    }
```

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"]
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x8d871731877bb6dfe48e64a821acb08680fe17b500908486a34315093c236d0b"]
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"]
    }
```

Generated with discovered.json: 0x9debff109fd8d033d440fe9131d271840ff562f9

# Diff at Wed, 09 Oct 2024 13:10:33 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20913652
- current block number: 20913652

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20913652 (main branch discovery), not current.

```diff
    contract AddressManager (0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x5ecea20f79f5f4bc37b6227fca89c133704a4301

# Diff at Mon, 07 Oct 2024 12:22:23 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@efca92a29798cefefec67194c1af3e13a1fe40cc block: 20775939
- current block number: 20913652

## Description

Renamed GuardianMS to be local.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775939 (main branch discovery), not current.

```diff
    contract PgnMultisig (0x39E13D1AB040F6EA58CE19998edCe01B3C365f84) {
    +++ description: None
      name:
-        "GuardianMultisig"
+        "PgnMultisig"
      roles.1:
+        "Guardian"
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

Generated with discovered.json: 0xa5f73a58a3336d17518e73f66c20fb70569cb4ac

# Diff at Tue, 01 Oct 2024 10:54:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20775939
- current block number: 20775939

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775939 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2023-07-11T20:24:47.000Z",["0x463B3777d3DD6a90234b594D1f94002267CE7948"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x97BAf688E5d0465E149d1d5B497Ca99392a6760e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2023-07-11T20:24:47.000Z",["0x0000000000000000000000000000000000000000"]],["2023-07-11T20:25:23.000Z",["0x1d8180D739D01dC97e837478af8d494215C5EF5e"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2023-07-11T20:25:23.000Z",["0x76983dfED43C7ae7ebB592A92Be2BE972cAE4348"]]]
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-11T20:25:23.000Z",["0x436e9FC7894e26718637f086d42B4a06439C8ae0"]]]
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x69b989360f57d98c0664395498884623082c1d0f

# Diff at Wed, 18 Sep 2024 11:34:48 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@eb09774f0f9d9322f2117dfdfda7d4bb095f6c52 block: 19927728
- current block number: 20775939

## Description

Shape related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927728 (main branch discovery), not current.

```diff
    contract GuardianMultisig (0x39E13D1AB040F6EA58CE19998edCe01B3C365f84) {
    +++ description: None
      roles:
+        ["Challenger"]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"}]}
      receivedPermissions.4.target:
-        "0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"
+        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
      receivedPermissions.3.target:
-        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
+        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
      receivedPermissions.2.target:
-        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
+        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.via:
-        [{"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"}]
      receivedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract L1CrossDomainMessenger (0x97BAf688E5d0465E149d1d5B497Ca99392a6760e) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      directlyReceivedPermissions.4.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
    }
```

Generated with discovered.json: 0x94b5bc0ca795a295024e8abcf1e1c72aa66dd852

# Diff at Sun, 08 Sep 2024 17:19:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 19927728
- current block number: 19927728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927728 (main branch discovery), not current.

```diff
    contract AddressManager (0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4, inheriting its permissions."]
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b","via":[{"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0xb26Fd985c5959bBB382BAFdD0b879E149e48116c","via":[{"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0xA38d0c4E6319F9045F20318BA5f04CDe94208608","via":[{"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9","via":[{"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"}]}
      receivedPermissions.0.target:
-        "0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"
+        "0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e"
      receivedPermissions.0.via:
+        [{"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"}]
    }
```

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e"},{"permission":"upgrade","target":"0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"},{"permission":"upgrade","target":"0xA38d0c4E6319F9045F20318BA5f04CDe94208608"},{"permission":"upgrade","target":"0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"},{"permission":"upgrade","target":"0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e"},{"permission":"upgrade","target":"0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"},{"permission":"upgrade","target":"0xA38d0c4E6319F9045F20318BA5f04CDe94208608"},{"permission":"upgrade","target":"0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"},{"permission":"upgrade","target":"0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"}]
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","delay":0}
    }
```

Generated with discovered.json: 0x79706732aca64cb15250b825f8ca1de7058f06dc

# Diff at Fri, 30 Aug 2024 07:54:52 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19927728
- current block number: 19927728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927728 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
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

Generated with discovered.json: 0x26350be1f4dd7125f2b882747aae2f09a4f6485d

# Diff at Fri, 23 Aug 2024 09:54:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19927728
- current block number: 19927728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927728 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0x5f699be0a8d5eb5b06d9d59e455e8037f12fd2da

# Diff at Wed, 21 Aug 2024 10:05:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19927728
- current block number: 19927728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927728 (main branch discovery), not current.

```diff
    contract AddressManager (0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","via":[]}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","via":[]}]
    }
```

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","via":[]}]
    }
```

```diff
    contract OptimismPortal (0xb26Fd985c5959bBB382BAFdD0b879E149e48116c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9","0xA38d0c4E6319F9045F20318BA5f04CDe94208608","0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b","0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"],"configure":["0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e","via":[]},{"permission":"upgrade","target":"0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9","via":[]},{"permission":"upgrade","target":"0xA38d0c4E6319F9045F20318BA5f04CDe94208608","via":[]},{"permission":"upgrade","target":"0xb26Fd985c5959bBB382BAFdD0b879E149e48116c","via":[]},{"permission":"upgrade","target":"0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4","via":[]}]
    }
```

Generated with discovered.json: 0x0c82b153ac9329e004dc15fd4291b1a2d2eedb2e

# Diff at Fri, 09 Aug 2024 12:01:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19927728
- current block number: 19927728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927728 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      assignedPermissions.upgrade.3:
-        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
+        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
      assignedPermissions.upgrade.2:
-        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
+        "0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"
      assignedPermissions.upgrade.1:
-        "0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"
+        "0xA38d0c4E6319F9045F20318BA5f04CDe94208608"
      assignedPermissions.upgrade.0:
-        "0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"
+        "0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"
    }
```

Generated with discovered.json: 0x2dde3e18ce3318c8e84e469024888c3ce773e843

# Diff at Fri, 09 Aug 2024 10:11:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19927728
- current block number: 19927728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927728 (main branch discovery), not current.

```diff
    contract GuardianMultisig (0x39E13D1AB040F6EA58CE19998edCe01B3C365f84) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 6 (50%)"
      values.getOwners:
-        ["0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe","0xc2E2B715d9e302947Ec7e312fd2384b5a1296099"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe","0xc2E2B715d9e302947Ec7e312fd2384b5a1296099"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4, inheriting its permissions.
      assignedPermissions.owner:
-        ["0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"]
      assignedPermissions.configure:
+        ["0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4"]
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract ProxyAdmin (0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9","0xA38d0c4E6319F9045F20318BA5f04CDe94208608","0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b","0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"]
      assignedPermissions.owner:
-        ["0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e"]
      assignedPermissions.upgrade:
+        ["0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b","0xb26Fd985c5959bBB382BAFdD0b879E149e48116c","0xA38d0c4E6319F9045F20318BA5f04CDe94208608","0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9"]
      assignedPermissions.configure:
+        ["0x09d5DbA52F0ee2C4A5E94FD5C802bD74Ca9cAD3e"]
    }
```

Generated with discovered.json: 0xd5f006f56c4e046475e5e1ef80c9497d3e20979b

# Diff at Thu, 18 Jul 2024 10:32:47 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19927728
- current block number: 19927728

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927728 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0xc6A8d2c5d0F068BE745f6A770378F01ca1714cc4, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x9f89d7f2e2eea063f495cce35514380d49633a2d

# Diff at Wed, 22 May 2024 20:13:12 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918775
- current block number: 19927728

## Description

ConduitMultisig update.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 5 (60%)"
+        "4 of 7 (57%)"
      values.getOwners.6:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.5:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.4:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getOwners.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.getOwners.0:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.getThreshold:
-        3
+        4
    }
```

Generated with discovered.json: 0x6a8679c1d8f1ec1bdccf53951f97bb3436ba5889

# Diff at Tue, 21 May 2024 14:08:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19532103
- current block number: 19918775

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532103 (main branch discovery), not current.

```diff
    contract PGNMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "PGNMultisig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x3af74a028f093464bb45449bfbbc2725da130630

# Diff at Thu, 28 Mar 2024 10:46:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19412045
- current block number: 19532103

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19412045 (main branch discovery), not current.

```diff
    contract GuardianMultisig (0x39E13D1AB040F6EA58CE19998edCe01B3C365f84) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract PGNMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x5295b6a71b2ec6aa8e0b2c6b1e45e44d73aafded

# Diff at Mon, 11 Mar 2024 13:08:12 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176788
- current block number: 19412045

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176788 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x4910121fd83e64fa0992aec7f3e348c3682f484b

# Diff at Wed, 07 Feb 2024 14:04:28 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175197
- current block number: 19176788

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175197 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
      values.sequencerInbox:
+        "0xC1B90E1e459aBBDcEc4DCF90dA45ba077d83BFc5"
    }
```

Generated with discovered.json: 0xd087db262c876ac1e8569f8dfae22c3d82d65a41

# Diff at Wed, 07 Feb 2024 08:42:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19090323
- current block number: 19175197

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19090323 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        true
    }
```

Generated with discovered.json: 0x2ea26678bb8058c9f76cb5359240833a22025e41

# Diff at Fri, 26 Jan 2024 10:56:51 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bb037f7100968a00265a4787338e51ca81aafe9b block: 18927684
- current block number: 19090323

## Description

Added opStackDa handler

## Watched changes

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        false
+        true
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
+        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18927684 (main branch discovery), not current.

```diff
    contract SystemConfig (0x7Df716EAD1d83a2BF35B416B7BC84bd0700357C9) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":false,"isSomeTxsLengthEqualToCelestiaDAExample":false}
    }
```

Generated with discovered.json: 0x6aa5358cf6c02ec15a51221026873cf8df87d220

# Diff at Wed, 03 Jan 2024 15:21:30 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e8eb03b39061a86a8ec01e26d970e40d080ad225

## Description

One owner is removed and another is added to PGNMultiSig.

## Watched changes

```diff
    contract PGNMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
      values.getOwners.4:
-        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.3:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.2:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.1:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.0:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
    }
```

# Diff at Tue, 26 Sep 2023 09:36:43 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0xA38d0c4E6319F9045F20318BA5f04CDe94208608) {
      values.deletedOutputs:
+        []
    }
```
