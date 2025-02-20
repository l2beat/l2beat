Generated with discovered.json: 0x60bdddbca822d6bd327eb3c371358fba035c25fa

# Diff at Wed, 12 Feb 2025 15:49:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@99b931e3c906ad8727878e6db62973bf6f794d21 block: 21665575
- current block number: 21829713

## Description

OptimismPortal upgrade: Add function to 'freeze' specific withdrawals, which prevents finalization and withdrawal.

## Watched changes

```diff
    contract OptimismPortal (0x5A0702C7EbbEC83802b35DB737FCcDc5fc6c5E07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals. This version (originally from SOON) of the OptimismPortal is modified to support Solana addresses. It disallows ERC20 token deposits and L1->L2 transactions that would create a contract. Withdrawals can be frozen / blacklisted by a permissioned actor. Has a MIN_BRIDGE_VALUE set to 0.001 ETH.
      sourceHashes.1:
-        "0x59c5fe4b963d6487e129935b3a6f9f6340305c191ed4ed9d5623fe4dcd4b473c"
+        "0x8970317120da471aba019c65d0f23fec669b03ba35e9eceec59a50a85bb53201"
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701","via":[{"address":"0x90b2Da5f99C0ca658067D621E3694C2Ec49C233d"}]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0x7fFB604c57FAFbAeaE6587DF035a0DB032301593","description":"freeze specific withdrawals.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.to:
-        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
+        "0x7fFB604c57FAFbAeaE6587DF035a0DB032301593"
      issuedPermissions.0.via.0:
-        {"address":"0x90b2Da5f99C0ca658067D621E3694C2Ec49C233d"}
      values.$implementation:
-        "0x84Afee7709273060212BA3223F250a1E3EaEa317"
+        "0x24331B68bea70c2b086BC883EEEA551BAF80C2BA"
      values.$pastUpgrades.1:
+        ["2025-02-12T03:13:59.000Z","0x171143120577a3f09614a4054f56a007ccc92e1ab16a0dedb844b9559872a51b",["0x24331B68bea70c2b086BC883EEEA551BAF80C2BA"]]
      values.$upgradeCount:
-        1
+        2
      values.balance:
-        "251419500001000000000"
      values.isOutputFinalized:
-        [true,true,true,true,true]
+++ description: Minimum deposit value.
      values.MIN_BRIDGE_VALUE:
-        1000000000000000
+        "0.001"
+++ description: Lists all frozen withdrawals.
      values.frozenWithdrawals:
+        ["0x5783689b654645b28b467e821b79f6d159056b605f538188905e6d41c4c66fba","0x77c7fcaac9f6db1aaa8dabe8e1cd1b1c6969c556ad076c5d1f05b22f8d95cb2b"]
      errors:
-        {"isOutputFinalized":"Processing error occurred."}
      template:
+        "opstack/OptimismPortal_soon"
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals. This version (originally from SOON) of the OptimismPortal is modified to support Solana addresses. It disallows ERC20 token deposits and L1->L2 transactions that would create a contract. Withdrawals can be frozen / blacklisted by a permissioned actor. Has a MIN_BRIDGE_VALUE set to 0.001 ETH."
      fieldMeta:
+        {"MIN_BRIDGE_VALUE":{"description":"Minimum deposit value."},"frozenWithdrawals":{"description":"Lists all frozen withdrawals."}}
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
    }
```

## Source code changes

```diff
.../OptimismPortal/OptimismPortal.sol              | 31 +++++++++++++++++++---
 1 file changed, 27 insertions(+), 4 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21665575 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x5A0702C7EbbEC83802b35DB737FCcDc5fc6c5E07) {
    +++ description: None
      template:
-        "opstack/OptimismPortal_soon"
      description:
-        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals. This version (originally from SOON) of the OptimismPortal is modified to support Solana addresses. It also disallows ERC20 token deposits. Has a MIN_BRIDGE_VALUE set to 0.001 ETH."
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701","via":[{"address":"0x90b2Da5f99C0ca658067D621E3694C2Ec49C233d"}]}
      issuedPermissions.0.permission:
-        "guard"
+        "upgrade"
      issuedPermissions.0.to:
-        "0x7fFB604c57FAFbAeaE6587DF035a0DB032301593"
+        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
      issuedPermissions.0.via.0:
+        {"address":"0x90b2Da5f99C0ca658067D621E3694C2Ec49C233d"}
      values.MIN_BRIDGE_VALUE:
-        "0.001"
+        1000000000000000
      values.balance:
+        "251419500001000000000"
      values.isOutputFinalized:
+        [true,true,true,true,true]
      fieldMeta:
-        {"MIN_BRIDGE_VALUE":{"description":"Minimum deposit value."}}
      usedTypes:
-        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
      errors:
+        {"isOutputFinalized":"Processing error occurred."}
    }
```

Generated with discovered.json: 0xbbb501a0b90f5bcb1f5acc7cbdb00e4dc85f8a26

# Diff at Mon, 10 Feb 2025 19:04:48 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21665575
- current block number: 21665575

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21665575 (main branch discovery), not current.

```diff
    contract SystemConfig (0x1E69C2522Dc139c9fC74E6ecb89373d435E70Dd8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        true
    }
```

Generated with discovered.json: 0xc03fd57e105072e96976fe79c77c637d7db6e159

# Diff at Tue, 04 Feb 2025 12:32:46 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21665575
- current block number: 21665575

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21665575 (main branch discovery), not current.

```diff
    contract SystemConfig (0x1E69C2522Dc139c9fC74E6ecb89373d435E70Dd8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x90b2Da5f99C0ca658067D621E3694C2Ec49C233d) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xA131FB9Ac1D86651Cf863baaE9190A787Aef56dd) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SoonMultisig (0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x3ed747cb7d3919a315383dceaecd716fcd4a6878

# Diff at Mon, 20 Jan 2025 12:05:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@658eb33e9afd98eac45a3037d195357115d19a86 block: 21637371
- current block number: 21665575

## Description

Upgrade of the L1StandardBridge with a one-line change: ERC20SharedDecimals = 9 (was 12).

## Watched changes

```diff
    contract L1StandardBridge (0xe822c3d76ac133f7d9f12c39c1BF28a797624AA9) {
    +++ description: The main entry point to deposit ETH from host chain to this chain. This version (originally from SOON) is modified to support Solana addresses. It requires specifying the destination SOL address and removes support for ERC20 tokens.
      sourceHashes.1:
-        "0xe2afd35e21cefc5b6eda770f7082c3916b8353d50c158a857cfc2ada89027f5b"
+        "0x31171ab8eadf4234ec9b516f45a99b4ba57e9270edb7dd669d39db328abe95eb"
      values.$implementation:
-        "0x3d20b96e5635CfCFF58c9CE66017F2240313B47C"
+        "0xE6874d09046173911A5e2bD4B4e6148dBB1B4f8A"
      values.ERC20SharedDecimals:
-        12
+        9
    }
```

## Source code changes

```diff
.../{.flat@21637371 => .flat}/L1StandardBridge/L1StandardBridge.sol     | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x74ecb7d8e4aea3ba5765a37a91c823535f5096fd

# Diff at Mon, 20 Jan 2025 11:10:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637371
- current block number: 21637371

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637371 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x017A4D5A1F670F5a9dfEBD0F0cB25C2C44a82448) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
      issuedPermissions.1.target:
-        "0xe5EB57C3AaedaDf90fC7924D1fb88b551039464A"
      issuedPermissions.1.to:
+        "0xe5EB57C3AaedaDf90fC7924D1fb88b551039464A"
      issuedPermissions.0.target:
-        "0x854703cB4360ECe00a8C6010486997fa7d3cEF6D"
      issuedPermissions.0.to:
+        "0x854703cB4360ECe00a8C6010486997fa7d3cEF6D"
    }
```

```diff
    contract SystemConfig (0x1E69C2522Dc139c9fC74E6ecb89373d435E70Dd8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
      issuedPermissions.1.target:
-        "0x3fc806bAa8C15Ec8c3C9FA0c85a2B8d643053F95"
      issuedPermissions.1.to:
+        "0x3fc806bAa8C15Ec8c3C9FA0c85a2B8d643053F95"
      issuedPermissions.0.target:
-        "0xa657C403b17eBB9b03fC93568b09bb7E4b7343d1"
      issuedPermissions.0.to:
+        "0xa657C403b17eBB9b03fC93568b09bb7E4b7343d1"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismPortal (0x5A0702C7EbbEC83802b35DB737FCcDc5fc6c5E07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals. This version (originally from SOON) of the OptimismPortal is modified to support Solana addresses. It also disallows ERC20 token deposits. Has a MIN_BRIDGE_VALUE set to 0.001 ETH.
      issuedPermissions.1.target:
-        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
      issuedPermissions.0.target:
-        "0x7fFB604c57FAFbAeaE6587DF035a0DB032301593"
      issuedPermissions.0.to:
+        "0x7fFB604c57FAFbAeaE6587DF035a0DB032301593"
    }
```

```diff
    contract L1ERC721Bridge (0x7d34832fc0cc6ed718a993CAAb4c6CAdaE9763A2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
    }
```

```diff
    contract ProxyAdmin (0x90b2Da5f99C0ca658067D621E3694C2Ec49C233d) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xe822c3d76ac133f7d9f12c39c1BF28a797624AA9"
      directlyReceivedPermissions.6.from:
+        "0xe822c3d76ac133f7d9f12c39c1BF28a797624AA9"
      directlyReceivedPermissions.5.target:
-        "0xD02631b334FfDCD5674217e57fe524c44B341DD4"
      directlyReceivedPermissions.5.from:
+        "0xD02631b334FfDCD5674217e57fe524c44B341DD4"
      directlyReceivedPermissions.4.target:
-        "0x7d34832fc0cc6ed718a993CAAb4c6CAdaE9763A2"
      directlyReceivedPermissions.4.from:
+        "0x7d34832fc0cc6ed718a993CAAb4c6CAdaE9763A2"
      directlyReceivedPermissions.3.target:
-        "0x5A0702C7EbbEC83802b35DB737FCcDc5fc6c5E07"
      directlyReceivedPermissions.3.from:
+        "0x5A0702C7EbbEC83802b35DB737FCcDc5fc6c5E07"
      directlyReceivedPermissions.2.target:
-        "0x1E69C2522Dc139c9fC74E6ecb89373d435E70Dd8"
      directlyReceivedPermissions.2.from:
+        "0x1E69C2522Dc139c9fC74E6ecb89373d435E70Dd8"
      directlyReceivedPermissions.1.target:
-        "0x017A4D5A1F670F5a9dfEBD0F0cB25C2C44a82448"
      directlyReceivedPermissions.1.from:
+        "0x017A4D5A1F670F5a9dfEBD0F0cB25C2C44a82448"
      directlyReceivedPermissions.0.target:
-        "0xA131FB9Ac1D86651Cf863baaE9190A787Aef56dd"
      directlyReceivedPermissions.0.from:
+        "0xA131FB9Ac1D86651Cf863baaE9190A787Aef56dd"
    }
```

```diff
    contract AddressManager (0xA131FB9Ac1D86651Cf863baaE9190A787Aef56dd) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract SuperchainConfig (0xD02631b334FfDCD5674217e57fe524c44B341DD4) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
      issuedPermissions.0.target:
-        "0x7fFB604c57FAFbAeaE6587DF035a0DB032301593"
      issuedPermissions.0.to:
+        "0x7fFB604c57FAFbAeaE6587DF035a0DB032301593"
    }
```

```diff
    contract SoonMultisig (0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701) {
    +++ description: None
      receivedPermissions.6.target:
-        "0xe822c3d76ac133f7d9f12c39c1BF28a797624AA9"
      receivedPermissions.6.from:
+        "0xe822c3d76ac133f7d9f12c39c1BF28a797624AA9"
      receivedPermissions.5.target:
-        "0xD02631b334FfDCD5674217e57fe524c44B341DD4"
      receivedPermissions.5.from:
+        "0xD02631b334FfDCD5674217e57fe524c44B341DD4"
      receivedPermissions.4.target:
-        "0x7d34832fc0cc6ed718a993CAAb4c6CAdaE9763A2"
      receivedPermissions.4.from:
+        "0x7d34832fc0cc6ed718a993CAAb4c6CAdaE9763A2"
      receivedPermissions.3.target:
-        "0x5A0702C7EbbEC83802b35DB737FCcDc5fc6c5E07"
      receivedPermissions.3.from:
+        "0x5A0702C7EbbEC83802b35DB737FCcDc5fc6c5E07"
      receivedPermissions.2.target:
-        "0x1E69C2522Dc139c9fC74E6ecb89373d435E70Dd8"
      receivedPermissions.2.from:
+        "0x1E69C2522Dc139c9fC74E6ecb89373d435E70Dd8"
      receivedPermissions.1.target:
-        "0x017A4D5A1F670F5a9dfEBD0F0cB25C2C44a82448"
      receivedPermissions.1.from:
+        "0x017A4D5A1F670F5a9dfEBD0F0cB25C2C44a82448"
      receivedPermissions.0.target:
-        "0xA131FB9Ac1D86651Cf863baaE9190A787Aef56dd"
      receivedPermissions.0.from:
+        "0xA131FB9Ac1D86651Cf863baaE9190A787Aef56dd"
      directlyReceivedPermissions.0.target:
-        "0x90b2Da5f99C0ca658067D621E3694C2Ec49C233d"
      directlyReceivedPermissions.0.from:
+        "0x90b2Da5f99C0ca658067D621E3694C2Ec49C233d"
    }
```

```diff
    contract L1StandardBridge (0xe822c3d76ac133f7d9f12c39c1BF28a797624AA9) {
    +++ description: The main entry point to deposit ETH from host chain to this chain. This version (originally from SOON) is modified to support Solana addresses. It requires specifying the destination SOL address and removes support for ERC20 tokens.
      issuedPermissions.0.target:
-        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x9e9fe6f9db92e7647ecaa77bc7be57bb23217c32

# Diff at Thu, 16 Jan 2025 13:34:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21637371

## Description

Initial discovery.

    SOON is a fairly standard OP Stack (with no proofs) with SVM as the execution environment
    all EVM addresses are changed to SOL addresses (byte32)
    ERC20 token transfers are not allowed, only ETH
    they are using EigenDA for DA with no bridge (no trace of Service Manager)


## Initial discovery

```diff
+   Status: CREATED
    contract L2OutputOracle (0x017A4D5A1F670F5a9dfEBD0F0cB25C2C44a82448)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x1E69C2522Dc139c9fC74E6ecb89373d435E70Dd8)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x5A0702C7EbbEC83802b35DB737FCcDc5fc6c5E07)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals. This version (originally from SOON) of the OptimismPortal is modified to support Solana addresses. It also disallows ERC20 token deposits. Has a MIN_BRIDGE_VALUE set to 0.001 ETH.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x7d34832fc0cc6ed718a993CAAb4c6CAdaE9763A2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x90b2Da5f99C0ca658067D621E3694C2Ec49C233d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xA131FB9Ac1D86651Cf863baaE9190A787Aef56dd)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xbB138cE37870443d5b2B02a36619D3478738E0f6)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xD02631b334FfDCD5674217e57fe524c44B341DD4)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SoonMultisig (0xD686D498a67Bb96FAa4afA3b2b1Cf182f5c3A701)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xe822c3d76ac133f7d9f12c39c1BF28a797624AA9)
    +++ description: The main entry point to deposit ETH from host chain to this chain. This version (originally from SOON) is modified to support Solana addresses. It requires specifying the destination SOL address and removes support for ERC20 tokens.
```
