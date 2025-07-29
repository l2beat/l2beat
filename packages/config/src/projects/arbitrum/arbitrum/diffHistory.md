Generated with discovered.json: 0xaff7f1629d850a2277220a39cb3a7129674d0bd9

# Diff at Tue, 22 Jul 2025 16:13:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@83bf55f537ce86d3d1dac9f1a98f31f9169b801f block: 348602301
- current block number: 360431467

## Description

[AIP: Constitutional Quorum Threshold Reduction](https://www.tally.xyz/gov/arbitrum/proposal/94423886836435773843507976898262621297544156552971145658873213763398017341229?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) executed.

## Watched changes

```diff
    contract ConstitutionHash (0x1D62fFeB72e4c360CcBbacf7c965153b00260417) {
    +++ description: Keeps the current hash of the ArbitrumDAO Constitution. Settable by the L2UpgradeExecutor.
      values.constitutionHash:
-        "0x28faf2acba9b3ff80ec484e3d5646931eeef40568b1b7c38dbe52b890bfd7938"
+        "0xaab5f245cfb0475d03f6a323db09181ec9c25e5d95c6c6d660660242cfed8630"
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: Token governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 4.5% quorum for proposals.
      description:
-        "Token governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals."
+        "Token governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 4.5% quorum for proposals."
+++ description: The percentage of the total supply that is required to pass a proposal.
      values.l2CoreQuorumPercent:
-        "5"
+        "4.5"
      values.quorumNumerator:
-        500
+        450
    }
```

Generated with discovered.json: 0x7bd19fed2011e654cbba3eec59e233c6a3d6c586

# Diff at Mon, 14 Jul 2025 13:11:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 348602301
- current block number: 348602301

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 348602301 (main branch discovery), not current.

```diff
    EOA  (0x0000000000000000000000000000000000000001) {
    +++ description: None
      address:
-        "0x0000000000000000000000000000000000000001"
+        "arb1:0x0000000000000000000000000000000000000001"
    }
```

```diff
    EOA  (0x00000000000000000000000000000000000A4B86) {
    +++ description: None
      address:
-        "0x00000000000000000000000000000000000A4B86"
+        "arb1:0x00000000000000000000000000000000000A4B86"
    }
```

```diff
    EOA bartek.eth-L2BEAT (0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae) {
    +++ description: None
      address:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "arb1:0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
    }
```

```diff
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    +++ description: Counterpart to the L1ERC20Gateway. Can mint (deposit to L2) and burn (withdraw to L1) ERC20 tokens on L2.
      address:
-        "0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
+        "arb1:0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
      values.$admin:
-        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "arb1:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      values.$implementation:
-        "0x1DCf7D03574fbC7C205F41f2e116eE094a652e93"
+        "arb1:0x1DCf7D03574fbC7C205F41f2e116eE094a652e93"
      values.$pastUpgrades.0.2.0:
-        "0x4bF6365278F340E759e7BB4732fE8B507784eAEB"
+        "arb1:0x4bF6365278F340E759e7BB4732fE8B507784eAEB"
      values.$pastUpgrades.1.2.0:
-        "0x370ED500E9FEBC1ab05aC0A1617F8775aB80c48e"
+        "arb1:0x370ED500E9FEBC1ab05aC0A1617F8775aB80c48e"
      values.$pastUpgrades.2.2.0:
-        "0xEdE95739749BfA021134E41F520d784c99323D6B"
+        "arb1:0xEdE95739749BfA021134E41F520d784c99323D6B"
      values.$pastUpgrades.3.2.0:
-        "0x1DCf7D03574fbC7C205F41f2e116eE094a652e93"
+        "arb1:0x1DCf7D03574fbC7C205F41f2e116eE094a652e93"
      values.beaconProxyFactory:
-        "0x3fE38087A94903A9D946fa1915e1772fe611000f"
+        "arb1:0x3fE38087A94903A9D946fa1915e1772fe611000f"
      values.counterpartGateway:
-        "0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"
+        "arb1:0xa3A7B6F88361F48403514059F1F16C8E78d60EeC"
      values.router:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "arb1:0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      implementationNames.0x09e9222E96E7B4AE2a407B98d48e330053351EEe:
-        "TransparentUpgradeableProxy"
      implementationNames.0x1DCf7D03574fbC7C205F41f2e116eE094a652e93:
-        "L2ERC20Gateway"
      implementationNames.arb1:0x09e9222E96E7B4AE2a407B98d48e330053351EEe:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x1DCf7D03574fbC7C205F41f2e116eE094a652e93:
+        "L2ERC20Gateway"
    }
```

```diff
    EOA  (0x0adc7D8eB4C01219858a579C9539780CD9575035) {
    +++ description: None
      address:
-        "0x0adc7D8eB4C01219858a579C9539780CD9575035"
+        "arb1:0x0adc7D8eB4C01219858a579C9539780CD9575035"
    }
```

```diff
    contract ConstitutionHash (0x1D62fFeB72e4c360CcBbacf7c965153b00260417) {
    +++ description: Keeps the current hash of the ArbitrumDAO Constitution. Settable by the L2UpgradeExecutor.
      address:
-        "0x1D62fFeB72e4c360CcBbacf7c965153b00260417"
+        "arb1:0x1D62fFeB72e4c360CcBbacf7c965153b00260417"
      values.owner:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      implementationNames.0x1D62fFeB72e4c360CcBbacf7c965153b00260417:
-        "ArbitrumDAOConstitution"
      implementationNames.arb1:0x1D62fFeB72e4c360CcBbacf7c965153b00260417:
+        "ArbitrumDAOConstitution"
    }
```

```diff
    contract L2SurplusFee (0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d) {
    +++ description: This contract receives all SurplusFees: Transaction fee component that covers the cost beyond that covered by the L2 Base Fee during chain congestion. They are withdrawable to a configurable set of recipients.
      address:
-        "0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d"
+        "arb1:0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d"
      values.owner:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      values.recipientsData.0.recipients.0:
-        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "arb1:0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      implementationNames.0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d:
-        "RewardDistributor"
      implementationNames.arb1:0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d:
+        "RewardDistributor"
    }
```

```diff
    EOA EmilianoBonassi-Conduit (0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93) {
    +++ description: None
      address:
-        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
+        "arb1:0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: Delays constitutional AIPs from the CoreGovernor by 8d.
      address:
-        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      values.$admin:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      values.$implementation:
-        "0x41740588b86B4e0629b83A4e28786FF94361c3A3"
+        "arb1:0x41740588b86B4e0629b83A4e28786FF94361c3A3"
      values.$pastUpgrades.0.2.0:
-        "0x41740588b86B4e0629b83A4e28786FF94361c3A3"
+        "arb1:0x41740588b86B4e0629b83A4e28786FF94361c3A3"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "arb1:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      values.accessControl.PROPOSER_ROLE.members.1:
-        "0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
+        "arb1:0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
      values.accessControl.PROPOSER_ROLE.members.2:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "arb1:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      values.Canceller.0:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "arb1:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.0:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.Proposer.0:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "arb1:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      values.Proposer.1:
-        "0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
+        "arb1:0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
      values.Proposer.2:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      values.timelockAdminAC.0:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      implementationNames.0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0:
-        "TransparentUpgradeableProxy"
      implementationNames.0x41740588b86B4e0629b83A4e28786FF94361c3A3:
-        "ArbitrumTimelock"
      implementationNames.arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x41740588b86B4e0629b83A4e28786FF94361c3A3:
+        "ArbitrumTimelock"
    }
```

```diff
    contract StandardArbERC20 (0x3f770Ac673856F105b586bb393d122721265aD46) {
    +++ description: None
      address:
-        "0x3f770Ac673856F105b586bb393d122721265aD46"
+        "arb1:0x3f770Ac673856F105b586bb393d122721265aD46"
      values.l1Address:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.l2Gateway:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      implementationNames.0x3f770Ac673856F105b586bb393d122721265aD46:
-        "StandardArbERC20"
      implementationNames.arb1:0x3f770Ac673856F105b586bb393d122721265aD46:
+        "StandardArbERC20"
    }
```

```diff
    contract BeaconProxyFactory (0x3fE38087A94903A9D946fa1915e1772fe611000f) {
    +++ description: None
      address:
-        "0x3fE38087A94903A9D946fa1915e1772fe611000f"
+        "arb1:0x3fE38087A94903A9D946fa1915e1772fe611000f"
      values.beacon:
-        "0xE72ba9418b5f2Ce0A6a40501Fe77c6839Aa37333"
+        "arb1:0xE72ba9418b5f2Ce0A6a40501Fe77c6839Aa37333"
      implementationNames.0x3fE38087A94903A9D946fa1915e1772fe611000f:
-        "BeaconProxyFactory"
      implementationNames.arb1:0x3fE38087A94903A9D946fa1915e1772fe611000f:
+        "BeaconProxyFactory"
    }
```

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      address:
-        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
+        "arb1:0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E"
+        "arb1:0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E"
      values.$members.1:
-        "0xBBD2E01eFB88ce00F8f5b6B9a696966070089392"
+        "arb1:0xBBD2E01eFB88ce00F8f5b6B9a696966070089392"
      values.$members.2:
-        "0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D"
+        "arb1:0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D"
      values.$members.3:
-        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
+        "arb1:0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
      values.$members.4:
-        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
+        "arb1:0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
      values.$members.5:
-        "0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
+        "arb1:0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
      values.$members.6:
-        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
+        "arb1:0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
      values.$members.7:
-        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
+        "arb1:0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
      values.$members.8:
-        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
+        "arb1:0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
      values.$members.9:
-        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+        "arb1:0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
      values.$members.10:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "arb1:0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.$members.11:
-        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+        "arb1:0x475816ca2a31D601B4e336f5c2418A67978aBf09"
      values.GnosisSafe_modules.0:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      implementationNames.0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.arb1:0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641:
+        "GnosisSafeProxy"
      implementationNames.arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    contract L2DAIGateway (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) {
    +++ description: Counterpart to the L1DaiGateway. Can mint (deposit to L2) and burn (withdraw to L1) DAI tokens on L2.
      address:
-        "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65"
+        "arb1:0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65"
      values.counterpartGateway:
-        "0xD3B5b60020504bc3489D6949d545893982BA3011"
+        "arb1:0xD3B5b60020504bc3489D6949d545893982BA3011"
      values.l1Counterpart:
-        "0xD3B5b60020504bc3489D6949d545893982BA3011"
+        "arb1:0xD3B5b60020504bc3489D6949d545893982BA3011"
      values.l1Dai:
-        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
+        "arb1:0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.l2Dai:
-        "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
+        "arb1:0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
      values.l2Router:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "arb1:0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      implementationNames.0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65:
-        "L2DaiGateway"
      implementationNames.arb1:0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65:
+        "L2DaiGateway"
    }
```

```diff
    contract SecurityCouncilMemberElectionGovernor (0x467923B9AE90BDB36BA88eCA11604D45F13b712C) {
    +++ description: Token governance contract for the Security Council member elections.
      address:
-        "0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
+        "arb1:0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
      values.$admin:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      values.$implementation:
-        "0xbD5016a7946a82b938242573ED63ccB8962A4acB"
+        "arb1:0xbD5016a7946a82b938242573ED63ccB8962A4acB"
      values.$pastUpgrades.0.2.0:
-        "0xbD5016a7946a82b938242573ED63ccB8962A4acB"
+        "arb1:0xbD5016a7946a82b938242573ED63ccB8962A4acB"
      values.nomineeElectionGovernor:
-        "0x8a1cDA8dee421cD06023470608605934c16A05a0"
+        "arb1:0x8a1cDA8dee421cD06023470608605934c16A05a0"
      values.owner:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      values.securityCouncilManager:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      values.token:
-        "0x912CE59144191C1204E64559FE8253a0e49E6548"
+        "arb1:0x912CE59144191C1204E64559FE8253a0e49E6548"
      implementationNames.0x467923B9AE90BDB36BA88eCA11604D45F13b712C:
-        "TransparentUpgradeableProxy"
      implementationNames.0xbD5016a7946a82b938242573ED63ccB8962A4acB:
-        "SecurityCouncilMemberElectionGovernor"
      implementationNames.arb1:0x467923B9AE90BDB36BA88eCA11604D45F13b712C:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xbD5016a7946a82b938242573ED63ccB8962A4acB:
+        "SecurityCouncilMemberElectionGovernor"
    }
```

```diff
    EOA yoav.eth-EF (0x475816ca2a31D601B4e336f5c2418A67978aBf09) {
    +++ description: None
      address:
-        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+        "arb1:0x475816ca2a31D601B4e336f5c2418A67978aBf09"
    }
```

```diff
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    +++ description: Router managing token <–> gateway mapping on L2.
      address:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "arb1:0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      values.$admin:
-        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "arb1:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      values.$implementation:
-        "0xe80eb0238029333e368e0bDDB7acDf1b9cb28278"
+        "arb1:0xe80eb0238029333e368e0bDDB7acDf1b9cb28278"
      values.$pastUpgrades.0.2.0:
-        "0xb30751052797AdBDdbF4847045E51E65e48BAF9c"
+        "arb1:0xb30751052797AdBDdbF4847045E51E65e48BAF9c"
      values.$pastUpgrades.1.2.0:
-        "0x176a9d89d235512Ad5CB4b6A0879D704D8315eF8"
+        "arb1:0x176a9d89d235512Ad5CB4b6A0879D704D8315eF8"
      values.$pastUpgrades.2.2.0:
-        "0xe80eb0238029333e368e0bDDB7acDf1b9cb28278"
+        "arb1:0xe80eb0238029333e368e0bDDB7acDf1b9cb28278"
      values.counterpartGateway:
-        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
+        "arb1:0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
      values.defaultGateway:
-        "0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
+        "arb1:0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      implementationNames.0x5288c571Fd7aD117beA99bF60FE0846C4E84F933:
-        "TransparentUpgradeableProxy"
      implementationNames.0xe80eb0238029333e368e0bDDB7acDf1b9cb28278:
-        "L2GatewayRouter"
      implementationNames.arb1:0x5288c571Fd7aD117beA99bF60FE0846C4E84F933:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xe80eb0238029333e368e0bDDB7acDf1b9cb28278:
+        "L2GatewayRouter"
    }
```

```diff
    EOA DennisonBertram-Tally (0x59c8535419BbCb8AdFFDB3C835435E907e3B183B) {
    +++ description: None
      address:
-        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
+        "arb1:0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
    }
```

```diff
    EOA  (0x6142f1C8bBF02E6A6bd074E8d564c9A5420a0676) {
    +++ description: None
      address:
-        "0x6142f1C8bBF02E6A6bd074E8d564c9A5420a0676"
+        "arb1:0x6142f1C8bBF02E6A6bd074E8d564c9A5420a0676"
    }
```

```diff
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B) {
    +++ description: Counterpart to the Bridge on L1. Mints and burns WETH on L2.
      address:
-        "0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
+        "arb1:0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
      values.$admin:
-        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "arb1:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      values.$implementation:
-        "0x806421D09cDb253aa9d128a658e60c0B95eFFA01"
+        "arb1:0x806421D09cDb253aa9d128a658e60c0B95eFFA01"
      values.$pastUpgrades.0.2.0:
-        "0xb01dB0529B80B73a86ecD75Ae3559844319575E5"
+        "arb1:0xb01dB0529B80B73a86ecD75Ae3559844319575E5"
      values.$pastUpgrades.1.2.0:
-        "0xc4940069140142236D4065b866018f7b2BeC77fD"
+        "arb1:0xc4940069140142236D4065b866018f7b2BeC77fD"
      values.$pastUpgrades.2.2.0:
-        "0x0db4f16c99B0aE9b00fc09bF69b36c7d73c45CBE"
+        "arb1:0x0db4f16c99B0aE9b00fc09bF69b36c7d73c45CBE"
      values.$pastUpgrades.3.2.0:
-        "0xB642058A41D414D9De3F36D14051623e557f1052"
+        "arb1:0xB642058A41D414D9De3F36D14051623e557f1052"
      values.$pastUpgrades.4.2.0:
-        "0x806421D09cDb253aa9d128a658e60c0B95eFFA01"
+        "arb1:0x806421D09cDb253aa9d128a658e60c0B95eFFA01"
      values.counterpartGateway:
-        "0xd92023E9d9911199a6711321D1277285e6d4e2db"
+        "arb1:0xd92023E9d9911199a6711321D1277285e6d4e2db"
      values.l1Weth:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "arb1:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.l2Weth:
-        "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
+        "arb1:0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
      values.router:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "arb1:0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      implementationNames.0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B:
-        "TransparentUpgradeableProxy"
      implementationNames.0x806421D09cDb253aa9d128a658e60c0B95eFFA01:
-        "L2WethGateway"
      implementationNames.arb1:0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x806421D09cDb253aa9d128a658e60c0B95eFFA01:
+        "L2WethGateway"
    }
```

```diff
    contract L2LPTGateway (0x6D2457a4ad276000A615295f7A80F79E48CcD318) {
    +++ description: Counterpart to the L1LPTGateway. Can mint (deposit to L2) and burn (withdraw to L1) LPT on L2.
      address:
-        "0x6D2457a4ad276000A615295f7A80F79E48CcD318"
+        "arb1:0x6D2457a4ad276000A615295f7A80F79E48CcD318"
      values.counterpartGateway:
-        "0x6142f1C8bBF02E6A6bd074E8d564c9A5420a0676"
+        "arb1:0x6142f1C8bBF02E6A6bd074E8d564c9A5420a0676"
      values.l1Counterpart:
-        "0x6142f1C8bBF02E6A6bd074E8d564c9A5420a0676"
+        "arb1:0x6142f1C8bBF02E6A6bd074E8d564c9A5420a0676"
      values.l1Lpt:
-        "0x58b6A8A3302369DAEc383334672404Ee733aB239"
+        "arb1:0x58b6A8A3302369DAEc383334672404Ee733aB239"
      values.l2Lpt:
-        "0x289ba1701C2F088cf0faf8B3705246331cB8A839"
+        "arb1:0x289ba1701C2F088cf0faf8B3705246331cB8A839"
      values.l2Router:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "arb1:0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      implementationNames.0x6D2457a4ad276000A615295f7A80F79E48CcD318:
-        "L2LPTGateway"
      implementationNames.arb1:0x6D2457a4ad276000A615295f7A80F79E48CcD318:
+        "L2LPTGateway"
    }
```

```diff
    contract SecurityCouncilMemberRemovalGovernor (0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad) {
    +++ description: Token governance contract for the Security Council member removals.
      address:
-        "0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad"
+        "arb1:0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad"
      values.$admin:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      values.$implementation:
-        "0x2F06643fc2CC18585Ae790b546388F0DE4Ec6635"
+        "arb1:0x2F06643fc2CC18585Ae790b546388F0DE4Ec6635"
      values.$pastUpgrades.0.2.0:
-        "0x2F06643fc2CC18585Ae790b546388F0DE4Ec6635"
+        "arb1:0x2F06643fc2CC18585Ae790b546388F0DE4Ec6635"
      values.EXCLUDE_ADDRESS:
-        "0x00000000000000000000000000000000000A4B86"
+        "arb1:0x00000000000000000000000000000000000A4B86"
      values.owner:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      values.securityCouncilManager:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      values.token:
-        "0x912CE59144191C1204E64559FE8253a0e49E6548"
+        "arb1:0x912CE59144191C1204E64559FE8253a0e49E6548"
      implementationNames.0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad:
-        "TransparentUpgradeableProxy"
      implementationNames.0x2F06643fc2CC18585Ae790b546388F0DE4Ec6635:
-        "SecurityCouncilMemberRemovalGovernor"
      implementationNames.arb1:0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x2F06643fc2CC18585Ae790b546388F0DE4Ec6635:
+        "SecurityCouncilMemberRemovalGovernor"
    }
```

```diff
    contract UpgradeExecRouteBuilder (0x7481716f05E315Fc4C4a64E56DcD9bc1D6F24C0a) {
    +++ description: None
      address:
-        "0x7481716f05E315Fc4C4a64E56DcD9bc1D6F24C0a"
+        "arb1:0x7481716f05E315Fc4C4a64E56DcD9bc1D6F24C0a"
      values.l1TimelockAddr:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "arb1:0xE6841D92B0C345144506576eC13ECf5103aC7f49"
      values.RETRYABLE_TICKET_MAGIC:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
+        "arb1:0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      implementationNames.0x7481716f05E315Fc4C4a64E56DcD9bc1D6F24C0a:
-        "UpgradeExecRouteBuilder"
      implementationNames.arb1:0x7481716f05E315Fc4C4a64E56DcD9bc1D6F24C0a:
+        "UpgradeExecRouteBuilder"
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: Token governance contract used for creating non-constitutional AIPs, or “treasury proposals”, e.g., transferring founds out of the DAO Treasury. Also enforces the 3% quorum for proposals.
      address:
-        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
+        "arb1:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      values.$admin:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      values.$implementation:
-        "0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9"
+        "arb1:0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9"
      values.$pastUpgrades.0.2.0:
-        "0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9"
+        "arb1:0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9"
      values.EXCLUDE_ADDRESS:
-        "0x00000000000000000000000000000000000A4B86"
+        "arb1:0x00000000000000000000000000000000000A4B86"
      values.owner:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      values.timelock:
-        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "arb1:0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      values.token:
-        "0x912CE59144191C1204E64559FE8253a0e49E6548"
+        "arb1:0x912CE59144191C1204E64559FE8253a0e49E6548"
      implementationNames.0x789fC99093B09aD01C34DC7251D0C89ce743e5a4:
-        "TransparentUpgradeableProxy"
      implementationNames.0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9:
-        "L2ArbitrumGovernor"
      implementationNames.arb1:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9:
+        "L2ArbitrumGovernor"
    }
```

```diff
    EOA JohnMorrow-Gauntlet (0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67) {
    +++ description: None
      address:
-        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
+        "arb1:0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
    }
```

```diff
    EOA GriffGreen-Giveth (0x882c6FCb3D358b9d70B97c6999159cea64168B6F) {
    +++ description: None
      address:
-        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
+        "arb1:0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
    }
```

```diff
    contract SecurityCouncilNomineeElectionGovernor (0x8a1cDA8dee421cD06023470608605934c16A05a0) {
    +++ description: Token governance contract for the Security Council nominee elections.
      address:
-        "0x8a1cDA8dee421cD06023470608605934c16A05a0"
+        "arb1:0x8a1cDA8dee421cD06023470608605934c16A05a0"
      values.$admin:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      values.$implementation:
-        "0xd3Ae921B220bedC2f94a5968E25535a476A9518C"
+        "arb1:0xd3Ae921B220bedC2f94a5968E25535a476A9518C"
      values.$pastUpgrades.0.2.0:
-        "0x8436A1bc9f9f9EB0cF1B51942C5657b60A40CCDD"
+        "arb1:0x8436A1bc9f9f9EB0cF1B51942C5657b60A40CCDD"
      values.$pastUpgrades.1.2.0:
-        "0xd3Ae921B220bedC2f94a5968E25535a476A9518C"
+        "arb1:0xd3Ae921B220bedC2f94a5968E25535a476A9518C"
      values.EXCLUDE_ADDRESS:
-        "0x00000000000000000000000000000000000A4B86"
+        "arb1:0x00000000000000000000000000000000000A4B86"
      values.nomineeVetter:
-        "0xc610984d9C96a7CE54Bcd335CEee9b0e3874380C"
+        "arb1:0xc610984d9C96a7CE54Bcd335CEee9b0e3874380C"
      values.owner:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      values.securityCouncilManager:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      values.securityCouncilMemberElectionGovernor:
-        "0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
+        "arb1:0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
      values.token:
-        "0x912CE59144191C1204E64559FE8253a0e49E6548"
+        "arb1:0x912CE59144191C1204E64559FE8253a0e49E6548"
      implementationNames.0x8a1cDA8dee421cD06023470608605934c16A05a0:
-        "TransparentUpgradeableProxy"
      implementationNames.0xd3Ae921B220bedC2f94a5968E25535a476A9518C:
-        "SecurityCouncilNomineeElectionGovernor"
      implementationNames.arb1:0x8a1cDA8dee421cD06023470608605934c16A05a0:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xd3Ae921B220bedC2f94a5968E25535a476A9518C:
+        "SecurityCouncilNomineeElectionGovernor"
    }
```

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: The ARB token contract. Supply can be increased by the owner once per year by a maximum of 2%.
      address:
-        "0x912CE59144191C1204E64559FE8253a0e49E6548"
+        "arb1:0x912CE59144191C1204E64559FE8253a0e49E6548"
      values.$admin:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      values.$implementation:
-        "0xC4ed0A9Ea70d5bCC69f748547650d32cC219D882"
+        "arb1:0xC4ed0A9Ea70d5bCC69f748547650d32cC219D882"
      values.$pastUpgrades.0.2.0:
-        "0xC4ed0A9Ea70d5bCC69f748547650d32cC219D882"
+        "arb1:0xC4ed0A9Ea70d5bCC69f748547650d32cC219D882"
      values.l1Address:
-        "0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1"
+        "arb1:0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1"
      values.owner:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      implementationNames.0x912CE59144191C1204E64559FE8253a0e49E6548:
-        "TransparentUpgradeableProxy"
      implementationNames.0xC4ed0A9Ea70d5bCC69f748547650d32cC219D882:
-        "L2ArbitrumToken"
      implementationNames.arb1:0x912CE59144191C1204E64559FE8253a0e49E6548:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xC4ed0A9Ea70d5bCC69f748547650d32cC219D882:
+        "L2ArbitrumToken"
    }
```

```diff
    EOA StevenThornton-OpenZeppelin (0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC) {
    +++ description: None
      address:
-        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+        "arb1:0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
    }
```

```diff
    EOA GoncaloMagalhaes-Immunefi (0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8) {
    +++ description: None
      address:
-        "0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
+        "arb1:0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
    }
```

```diff
    contract SecurityCouncilMemberSyncAction (0x9BF7b8884Fa381a45f8CB2525905fb36C996297a) {
    +++ description: Contract used by the security council management system to sync SecurityCouncil members between the L1 and the L2.
      address:
-        "0x9BF7b8884Fa381a45f8CB2525905fb36C996297a"
+        "arb1:0x9BF7b8884Fa381a45f8CB2525905fb36C996297a"
      values.SENTINEL_OWNERS:
-        "0x0000000000000000000000000000000000000001"
+        "arb1:0x0000000000000000000000000000000000000001"
      values.store:
-        "0xd343Fd9ba453D3AD0f868c24734808FB73f5F52B"
+        "arb1:0xd343Fd9ba453D3AD0f868c24734808FB73f5F52B"
      implementationNames.0x9BF7b8884Fa381a45f8CB2525905fb36C996297a:
-        "SecurityCouncilMemberSyncAction"
      implementationNames.arb1:0x9BF7b8884Fa381a45f8CB2525905fb36C996297a:
+        "SecurityCouncilMemberSyncAction"
    }
```

```diff
    EOA  (0xa723C008e76E379c55599D2E4d93879BeaFDa79C) {
    +++ description: None
      address:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
+        "arb1:0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
    }
```

```diff
    EOA  (0xa98290a7A282d8249544D35b288E160A5580D57E) {
    +++ description: None
      address:
-        "0xa98290a7A282d8249544D35b288E160A5580D57E"
+        "arb1:0xa98290a7A282d8249544D35b288E160A5580D57E"
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      address:
-        "0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
+        "arb1:0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E"
+        "arb1:0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E"
      values.$members.1:
-        "0xBBD2E01eFB88ce00F8f5b6B9a696966070089392"
+        "arb1:0xBBD2E01eFB88ce00F8f5b6B9a696966070089392"
      values.$members.2:
-        "0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D"
+        "arb1:0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D"
      values.$members.3:
-        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
+        "arb1:0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
      values.$members.4:
-        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
+        "arb1:0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
      values.$members.5:
-        "0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
+        "arb1:0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
      values.$members.6:
-        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
+        "arb1:0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
      values.$members.7:
-        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
+        "arb1:0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
      values.$members.8:
-        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
+        "arb1:0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
      values.$members.9:
-        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+        "arb1:0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
      values.$members.10:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "arb1:0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.$members.11:
-        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+        "arb1:0x475816ca2a31D601B4e336f5c2418A67978aBf09"
      values.GnosisSafe_modules.0:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      implementationNames.0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.arb1:0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941:
+        "GnosisSafeProxy"
      implementationNames.arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1) {
    +++ description: None
      address:
-        "0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1"
+        "arb1:0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1"
    }
```

```diff
    EOA Michael Lewellen - blockaid (0xBBD2E01eFB88ce00F8f5b6B9a696966070089392) {
    +++ description: None
      address:
-        "0xBBD2E01eFB88ce00F8f5b6B9a696966070089392"
+        "arb1:0xBBD2E01eFB88ce00F8f5b6B9a696966070089392"
    }
```

```diff
    contract L2BaseFee (0xbF5041Fc07E1c866D15c749156657B8eEd0fb649) {
    +++ description: This contract receives all BaseFees: The transaction fee component that covers the minimum cost of Arbitrum transaction execution. They are withdrawable to a configurable set of recipients.
      address:
-        "0xbF5041Fc07E1c866D15c749156657B8eEd0fb649"
+        "arb1:0xbF5041Fc07E1c866D15c749156657B8eEd0fb649"
      values.owner:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      values.recipientsData.0.recipients.0:
-        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "arb1:0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      implementationNames.0xbF5041Fc07E1c866D15c749156657B8eEd0fb649:
-        "RewardDistributor"
      implementationNames.arb1:0xbF5041Fc07E1c866D15c749156657B8eEd0fb649:
+        "RewardDistributor"
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: Delays treasury proposals from the TreasuryGovernor by 259200 seconds. Is used as the main recipient for the ETH from L2SurplusFee and L2BaseFee contracts.
      address:
-        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "arb1:0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      values.$admin:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      values.$implementation:
-        "0x41740588b86B4e0629b83A4e28786FF94361c3A3"
+        "arb1:0x41740588b86B4e0629b83A4e28786FF94361c3A3"
      values.$pastUpgrades.0.2.0:
-        "0x41740588b86B4e0629b83A4e28786FF94361c3A3"
+        "arb1:0x41740588b86B4e0629b83A4e28786FF94361c3A3"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
+        "arb1:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
+        "arb1:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      implementationNames.0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58:
-        "TransparentUpgradeableProxy"
      implementationNames.0x41740588b86B4e0629b83A4e28786FF94361c3A3:
-        "ArbitrumTimelock"
      implementationNames.arb1:0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x41740588b86B4e0629b83A4e28786FF94361c3A3:
+        "ArbitrumTimelock"
    }
```

```diff
    EOA  (0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3) {
    +++ description: None
      address:
-        "0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
+        "arb1:0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
    }
```

```diff
    EOA  (0xc43a77b64b34551beA865C9E85A116B444EF44B1) {
    +++ description: None
      address:
-        "0xc43a77b64b34551beA865C9E85A116B444EF44B1"
+        "arb1:0xc43a77b64b34551beA865C9E85A116B444EF44B1"
    }
```

```diff
    contract GnosisSafeL2 (0xc610984d9C96a7CE54Bcd335CEee9b0e3874380C) {
    +++ description: None
      address:
-        "0xc610984d9C96a7CE54Bcd335CEee9b0e3874380C"
+        "arb1:0xc610984d9C96a7CE54Bcd335CEee9b0e3874380C"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0xf3b0B40e54Be009C852dBD3577F34D1D27bC07F6"
+        "arb1:0xf3b0B40e54Be009C852dBD3577F34D1D27bC07F6"
      values.$members.1:
-        "0xa98290a7A282d8249544D35b288E160A5580D57E"
+        "arb1:0xa98290a7A282d8249544D35b288E160A5580D57E"
      values.$members.2:
-        "0xc43a77b64b34551beA865C9E85A116B444EF44B1"
+        "arb1:0xc43a77b64b34551beA865C9E85A116B444EF44B1"
      values.$members.3:
-        "0x0adc7D8eB4C01219858a579C9539780CD9575035"
+        "arb1:0x0adc7D8eB4C01219858a579C9539780CD9575035"
      values.$members.4:
-        "0xdE82B19aA75d93EB9Fca9a284dD0EB643d5e35C2"
+        "arb1:0xdE82B19aA75d93EB9Fca9a284dD0EB643d5e35C2"
      implementationNames.0xc610984d9C96a7CE54Bcd335CEee9b0e3874380C:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.arb1:0xc610984d9C96a7CE54Bcd335CEee9b0e3874380C:
+        "GnosisSafeProxy"
      implementationNames.arb1:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: ARB sent from L2 to L1 is escrowed in this contract and minted on L1.
      address:
-        "0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
+        "arb1:0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
      values.$admin:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      values.$implementation:
-        "0x5D96786d3Eb13CAd05c9Fd7d0f7bb9560b4E5056"
+        "arb1:0x5D96786d3Eb13CAd05c9Fd7d0f7bb9560b4E5056"
      values.$pastUpgrades.0.2.0:
-        "0x5D96786d3Eb13CAd05c9Fd7d0f7bb9560b4E5056"
+        "arb1:0x5D96786d3Eb13CAd05c9Fd7d0f7bb9560b4E5056"
      values.counterpartGateway:
-        "0xbbcE8aA77782F13D4202a230d978F361B011dB27"
+        "arb1:0xbbcE8aA77782F13D4202a230d978F361B011dB27"
      values.router:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "arb1:0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      implementationNames.0xCaD7828a19b363A2B44717AFB1786B5196974D8E:
-        "TransparentUpgradeableProxy"
      implementationNames.0x5D96786d3Eb13CAd05c9Fd7d0f7bb9560b4E5056:
-        "L2ReverseCustomGateway"
      implementationNames.arb1:0xCaD7828a19b363A2B44717AFB1786B5196974D8E:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x5D96786d3Eb13CAd05c9Fd7d0f7bb9560b4E5056:
+        "L2ReverseCustomGateway"
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2).
      address:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      values.$admin:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      values.$implementation:
-        "0x7A013834D54e9B22d1978aAe3aaDDC909Aa79115"
+        "arb1:0x7A013834D54e9B22d1978aAe3aaDDC909Aa79115"
      values.$pastUpgrades.0.2.0:
-        "0x7A013834D54e9B22d1978aAe3aaDDC909Aa79115"
+        "arb1:0x7A013834D54e9B22d1978aAe3aaDDC909Aa79115"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "arb1:0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
+        "arb1:0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      values.executors.0:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "arb1:0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      values.executors.1:
-        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
+        "arb1:0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      implementationNames.0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827:
-        "TransparentUpgradeableProxy"
      implementationNames.0x7A013834D54e9B22d1978aAe3aaDDC909Aa79115:
-        "UpgradeExecutor"
      implementationNames.arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x7A013834D54e9B22d1978aAe3aaDDC909Aa79115:
+        "UpgradeExecutor"
    }
```

```diff
    EOA  (0xD3B5b60020504bc3489D6949d545893982BA3011) {
    +++ description: None
      address:
-        "0xD3B5b60020504bc3489D6949d545893982BA3011"
+        "arb1:0xD3B5b60020504bc3489D6949d545893982BA3011"
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
      address:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      values.$admin:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      values.$implementation:
-        "0x468dA0eE5570Bdb1Dd81bFd925BAf028A93Dce64"
+        "arb1:0x468dA0eE5570Bdb1Dd81bFd925BAf028A93Dce64"
      values.$pastUpgrades.0.2.0:
-        "0x468dA0eE5570Bdb1Dd81bFd925BAf028A93Dce64"
+        "arb1:0x468dA0eE5570Bdb1Dd81bFd925BAf028A93Dce64"
      values.cohortReplacerAC.0:
-        "0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
+        "arb1:0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
      values.defaultAdminAC.0:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: LOW
      values.getBothCohorts.0:
-        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
+        "arb1:0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: LOW
      values.getBothCohorts.1:
-        "0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
+        "arb1:0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: LOW
      values.getBothCohorts.2:
-        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
+        "arb1:0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: LOW
      values.getBothCohorts.3:
-        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
+        "arb1:0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: LOW
      values.getBothCohorts.4:
-        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
+        "arb1:0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: LOW
      values.getBothCohorts.5:
-        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
+        "arb1:0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: LOW
      values.getBothCohorts.6:
-        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+        "arb1:0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: LOW
      values.getBothCohorts.7:
-        "0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D"
+        "arb1:0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: LOW
      values.getBothCohorts.8:
-        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+        "arb1:0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: LOW
      values.getBothCohorts.9:
-        "0xBBD2E01eFB88ce00F8f5b6B9a696966070089392"
+        "arb1:0xBBD2E01eFB88ce00F8f5b6B9a696966070089392"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: LOW
      values.getBothCohorts.10:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "arb1:0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: LOW
      values.getBothCohorts.11:
-        "0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E"
+        "arb1:0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E"
      values.getFirstCohort.0:
-        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
+        "arb1:0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
      values.getFirstCohort.1:
-        "0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
+        "arb1:0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
      values.getFirstCohort.2:
-        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
+        "arb1:0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
      values.getFirstCohort.3:
-        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
+        "arb1:0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
      values.getFirstCohort.4:
-        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
+        "arb1:0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
      values.getFirstCohort.5:
-        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
+        "arb1:0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
      values.getSecondCohort.0:
-        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+        "arb1:0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
      values.getSecondCohort.1:
-        "0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D"
+        "arb1:0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D"
      values.getSecondCohort.2:
-        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+        "arb1:0x475816ca2a31D601B4e336f5c2418A67978aBf09"
      values.getSecondCohort.3:
-        "0xBBD2E01eFB88ce00F8f5b6B9a696966070089392"
+        "arb1:0xBBD2E01eFB88ce00F8f5b6B9a696966070089392"
      values.getSecondCohort.4:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "arb1:0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getSecondCohort.5:
-        "0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E"
+        "arb1:0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E"
      values.l2CoreGovTimelock:
-        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      values.memberAdderAC.0:
-        "0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
+        "arb1:0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
      values.memberRemoverAC.0:
-        "0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad"
+        "arb1:0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad"
      values.memberRemoverAC.1:
-        "0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
+        "arb1:0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
      values.memberReplacerAC.0:
-        "0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
+        "arb1:0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
      values.memberRotatorAC.0:
-        "0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
+        "arb1:0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
      values.RETRYABLE_TICKET_MAGIC:
-        "0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
+        "arb1:0xa723C008e76E379c55599D2E4d93879BeaFDa79C"
      values.router:
-        "0x7481716f05E315Fc4C4a64E56DcD9bc1D6F24C0a"
+        "arb1:0x7481716f05E315Fc4C4a64E56DcD9bc1D6F24C0a"
      values.securityCouncils.0.1:
-        "0x9BF7b8884Fa381a45f8CB2525905fb36C996297a"
+        "arb1:0x9BF7b8884Fa381a45f8CB2525905fb36C996297a"
      values.securityCouncils.0.0:
-        "0xF06E95eF589D9c38af242a8AAee8375f14023F85"
+        "arb1:0xF06E95eF589D9c38af242a8AAee8375f14023F85"
      values.securityCouncils.1.1:
-        "0x9BF7b8884Fa381a45f8CB2525905fb36C996297a"
+        "arb1:0x9BF7b8884Fa381a45f8CB2525905fb36C996297a"
      values.securityCouncils.1.0:
-        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
+        "arb1:0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      values.securityCouncils.2.1:
-        "0x9BF7b8884Fa381a45f8CB2525905fb36C996297a"
+        "arb1:0x9BF7b8884Fa381a45f8CB2525905fb36C996297a"
      values.securityCouncils.2.0:
-        "0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
+        "arb1:0xc232ee726E3C51B86778BB4dBe61C52cC07A60F3"
      values.securityCouncils.3.1:
-        "0x9BF7b8884Fa381a45f8CB2525905fb36C996297a"
+        "arb1:0x9BF7b8884Fa381a45f8CB2525905fb36C996297a"
      values.securityCouncils.3.0:
-        "0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
+        "arb1:0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
      implementationNames.0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC:
-        "TransparentUpgradeableProxy"
      implementationNames.0x468dA0eE5570Bdb1Dd81bFd925BAf028A93Dce64:
-        "SecurityCouncilManager"
      implementationNames.arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x468dA0eE5570Bdb1Dd81bFd925BAf028A93Dce64:
+        "SecurityCouncilManager"
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      address:
-        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "arb1:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      values.owner:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      implementationNames.0xd570aCE65C43af47101fC6250FD6fC63D1c22a86:
-        "ProxyAdmin"
      implementationNames.arb1:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86:
+        "ProxyAdmin"
    }
```

```diff
    EOA fred - Arbitrum 2 (0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E) {
    +++ description: None
      address:
-        "0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E"
+        "arb1:0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E"
    }
```

```diff
    EOA  (0xd92023E9d9911199a6711321D1277285e6d4e2db) {
    +++ description: None
      address:
-        "0xd92023E9d9911199a6711321D1277285e6d4e2db"
+        "arb1:0xd92023E9d9911199a6711321D1277285e6d4e2db"
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      address:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      values.owner:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      implementationNames.0xdb216562328215E010F819B5aBe947bad4ca961e:
-        "ProxyAdmin"
      implementationNames.arb1:0xdb216562328215E010F819B5aBe947bad4ca961e:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xdE82B19aA75d93EB9Fca9a284dD0EB643d5e35C2) {
    +++ description: None
      address:
-        "0xdE82B19aA75d93EB9Fca9a284dD0EB643d5e35C2"
+        "arb1:0xdE82B19aA75d93EB9Fca9a284dD0EB643d5e35C2"
    }
```

```diff
    EOA gzeon-OffchainLabs (0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33) {
    +++ description: None
      address:
-        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
+        "arb1:0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
    }
```

```diff
    EOA  (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
    +++ description: None
      address:
-        "0xE6841D92B0C345144506576eC13ECf5103aC7f49"
+        "arb1:0xE6841D92B0C345144506576eC13ECf5103aC7f49"
    }
```

```diff
    contract UpgradeableBeacon (0xE72ba9418b5f2Ce0A6a40501Fe77c6839Aa37333) {
    +++ description: None
      address:
-        "0xE72ba9418b5f2Ce0A6a40501Fe77c6839Aa37333"
+        "arb1:0xE72ba9418b5f2Ce0A6a40501Fe77c6839Aa37333"
      values.implementation:
-        "0x3f770Ac673856F105b586bb393d122721265aD46"
+        "arb1:0x3f770Ac673856F105b586bb393d122721265aD46"
      values.owner:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      implementationNames.0xE72ba9418b5f2Ce0A6a40501Fe77c6839Aa37333:
-        "UpgradeableBeacon"
      implementationNames.arb1:0xE72ba9418b5f2Ce0A6a40501Fe77c6839Aa37333:
+        "UpgradeableBeacon"
    }
```

```diff
    EOA Certora 2 (0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D) {
    +++ description: None
      address:
-        "0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D"
+        "arb1:0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D"
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: Token governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals.
      address:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "arb1:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      values.$admin:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      values.$implementation:
-        "0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9"
+        "arb1:0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9"
      values.$pastUpgrades.0.2.0:
-        "0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9"
+        "arb1:0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9"
      values.EXCLUDE_ADDRESS:
-        "0x00000000000000000000000000000000000A4B86"
+        "arb1:0x00000000000000000000000000000000000A4B86"
      values.owner:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      values.timelock:
-        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      values.token:
-        "0x912CE59144191C1204E64559FE8253a0e49E6548"
+        "arb1:0x912CE59144191C1204E64559FE8253a0e49E6548"
      implementationNames.0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9:
-        "TransparentUpgradeableProxy"
      implementationNames.0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9:
-        "L2ArbitrumGovernor"
      implementationNames.arb1:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9:
+        "L2ArbitrumGovernor"
    }
```

```diff
    EOA  (0xf3b0B40e54Be009C852dBD3577F34D1D27bC07F6) {
    +++ description: None
      address:
-        "0xf3b0B40e54Be009C852dBD3577F34D1D27bC07F6"
+        "arb1:0xf3b0B40e54Be009C852dBD3577F34D1D27bC07F6"
    }
```

```diff
    EOA L1Timelock_l2alias (0xf7951D92B0C345144506576eC13Ecf5103aC905a) {
    +++ description: None
      address:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "arb1:0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

```diff
+   Status: CREATED
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe)
    +++ description: Counterpart to the L1ERC20Gateway. Can mint (deposit to L2) and burn (withdraw to L1) ERC20 tokens on L2.
```

```diff
+   Status: CREATED
    contract ConstitutionHash (0x1D62fFeB72e4c360CcBbacf7c965153b00260417)
    +++ description: Keeps the current hash of the ArbitrumDAO Constitution. Settable by the L2UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract L2SurplusFee (0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d)
    +++ description: This contract receives all SurplusFees: Transaction fee component that covers the cost beyond that covered by the L2 Base Fee during chain congestion. They are withdrawable to a configurable set of recipients.
```

```diff
+   Status: CREATED
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0)
    +++ description: Delays constitutional AIPs from the CoreGovernor by 8d.
```

```diff
+   Status: CREATED
    contract StandardArbERC20 (0x3f770Ac673856F105b586bb393d122721265aD46)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BeaconProxyFactory (0x3fE38087A94903A9D946fa1915e1772fe611000f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2DAIGateway (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65)
    +++ description: Counterpart to the L1DaiGateway. Can mint (deposit to L2) and burn (withdraw to L1) DAI tokens on L2.
```

```diff
+   Status: CREATED
    contract SecurityCouncilMemberElectionGovernor (0x467923B9AE90BDB36BA88eCA11604D45F13b712C)
    +++ description: Token governance contract for the Security Council member elections.
```

```diff
+   Status: CREATED
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933)
    +++ description: Router managing token <–> gateway mapping on L2.
```

```diff
+   Status: CREATED
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B)
    +++ description: Counterpart to the Bridge on L1. Mints and burns WETH on L2.
```

```diff
+   Status: CREATED
    contract L2LPTGateway (0x6D2457a4ad276000A615295f7A80F79E48CcD318)
    +++ description: Counterpart to the L1LPTGateway. Can mint (deposit to L2) and burn (withdraw to L1) LPT on L2.
```

```diff
+   Status: CREATED
    contract SecurityCouncilMemberRemovalGovernor (0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad)
    +++ description: Token governance contract for the Security Council member removals.
```

```diff
+   Status: CREATED
    contract UpgradeExecRouteBuilder (0x7481716f05E315Fc4C4a64E56DcD9bc1D6F24C0a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4)
    +++ description: Token governance contract used for creating non-constitutional AIPs, or “treasury proposals”, e.g., transferring founds out of the DAO Treasury. Also enforces the 3% quorum for proposals.
```

```diff
+   Status: CREATED
    contract SecurityCouncilNomineeElectionGovernor (0x8a1cDA8dee421cD06023470608605934c16A05a0)
    +++ description: Token governance contract for the Security Council nominee elections.
```

```diff
+   Status: CREATED
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548)
    +++ description: The ARB token contract. Supply can be increased by the owner once per year by a maximum of 2%.
```

```diff
+   Status: CREATED
    contract SecurityCouncilMemberSyncAction (0x9BF7b8884Fa381a45f8CB2525905fb36C996297a)
    +++ description: Contract used by the security council management system to sync SecurityCouncil members between the L1 and the L2.
```

```diff
+   Status: CREATED
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2BaseFee (0xbF5041Fc07E1c866D15c749156657B8eEd0fb649)
    +++ description: This contract receives all BaseFees: The transaction fee component that covers the minimum cost of Arbitrum transaction execution. They are withdrawable to a configurable set of recipients.
```

```diff
+   Status: CREATED
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58)
    +++ description: Delays treasury proposals from the TreasuryGovernor by 259200 seconds. Is used as the main recipient for the ETH from L2SurplusFee and L2BaseFee contracts.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xc610984d9C96a7CE54Bcd335CEee9b0e3874380C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E)
    +++ description: ARB sent from L2 to L1 is escrowed in this contract and minted on L1.
```

```diff
+   Status: CREATED
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827)
    +++ description: This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2).
```

```diff
+   Status: CREATED
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC)
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
```

```diff
+   Status: CREATED
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (0xE72ba9418b5f2Ce0A6a40501Fe77c6839Aa37333)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9)
    +++ description: Token governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals.
```

Generated with discovered.json: 0xc695f6c8c337a92da19f33d78a888ac4ad8925c6

# Diff at Mon, 14 Jul 2025 08:38:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 348602301
- current block number: 348602301

## Description

Added model.lp to orbitstack/Outbox L1 template that connects it via 'act' permission to L2 Timelock, thus creating a cross-chain permission.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 348602301 (main branch discovery), not current.

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: Delays constitutional AIPs from the CoreGovernor by 8d.
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816}]
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","role":".owner","via":[{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.6:
+        {"permission":"interact","from":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"cancel queued transactions.","role":".Canceller","via":[{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.7:
+        {"permission":"interact","from":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"propose transactions.","role":".Proposer","via":[{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.8:
+        {"permission":"interact","from":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"update the minimum delay and manage all access control roles of the timelock.","role":".timelockAdminAC","via":[{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","role":"admin","via":[{"address":"eth:0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.12:
+        {"permission":"upgrade","from":"eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.13:
+        {"permission":"upgrade","from":"eth:0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0","role":"admin","via":[{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.14:
+        {"permission":"upgrade","from":"eth:0x57Bd336d579A51938619271a7Cc137a46D0501B1","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.15:
+        {"permission":"upgrade","from":"eth:0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.16:
+        {"permission":"upgrade","from":"eth:0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef","role":"admin","via":[{"address":"eth:0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.17:
+        {"permission":"upgrade","from":"eth:0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.18:
+        {"permission":"upgrade","from":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.19:
+        {"permission":"upgrade","from":"eth:0xa3A7B6F88361F48403514059F1F16C8E78d60EeC","role":"admin","via":[{"address":"eth:0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.20:
+        {"permission":"upgrade","from":"eth:0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.21:
+        {"permission":"upgrade","from":"eth:0xcEe284F754E854890e311e3280b767F80797180d","role":"admin","via":[{"address":"eth:0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.22:
+        {"permission":"upgrade","from":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","role":"admin","via":[{"address":"eth:0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: Token governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals.
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","role":".owner","via":[{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"cancel queued transactions.","role":".Canceller","via":[{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"propose transactions.","role":".Proposer","via":[{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.5:
+        {"permission":"interact","from":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","description":"update the minimum delay and manage all access control roles of the timelock.","role":".timelockAdminAC","via":[{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd","role":"admin","via":[{"address":"eth:0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0x4DCeB440657f21083db8aDd07665f8ddBe1DCfc0","role":"admin","via":[{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0x57Bd336d579A51938619271a7Cc137a46D0501B1","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.12:
+        {"permission":"upgrade","from":"eth:0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.13:
+        {"permission":"upgrade","from":"eth:0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef","role":"admin","via":[{"address":"eth:0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.14:
+        {"permission":"upgrade","from":"eth:0x760723CD2e632826c38Fef8CD438A4CC7E7E1A40","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.15:
+        {"permission":"upgrade","from":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.16:
+        {"permission":"upgrade","from":"eth:0xa3A7B6F88361F48403514059F1F16C8E78d60EeC","role":"admin","via":[{"address":"eth:0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.17:
+        {"permission":"upgrade","from":"eth:0xA5565d266c3c3Ee90B16Be8A5b13d587ef559fB0","role":"admin","via":[{"address":"eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.18:
+        {"permission":"upgrade","from":"eth:0xcEe284F754E854890e311e3280b767F80797180d","role":"admin","via":[{"address":"eth:0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
      receivedPermissions.19:
+        {"permission":"upgrade","from":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","role":"admin","via":[{"address":"eth:0x5613AF0474EB9c528A34701A5b1662E3C8FA0678"},{"address":"eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd"},{"address":"eth:0xE6841D92B0C345144506576eC13ECf5103aC7f49","delay":259200},{"address":"eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a"},{"address":"eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840","delay":549816},{"address":"arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]}
    }
```

Generated with discovered.json: 0xc64afc992d8b42deb93155deb21dbf668085e417

# Diff at Fri, 04 Jul 2025 12:18:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 348602301
- current block number: 348602301

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 348602301 (main branch discovery), not current.

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.0.from:
-        "arbitrum:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      receivedPermissions.1.via.0.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.1.from:
-        "arbitrum:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      receivedPermissions.2.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.2.via.0.address:
-        "arbitrum:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "arb1:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      receivedPermissions.2.from:
-        "arbitrum:0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
+        "arb1:0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
      receivedPermissions.3.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.3.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.3.from:
-        "arbitrum:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      receivedPermissions.4.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.4.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.4.from:
-        "arbitrum:0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
+        "arb1:0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
      receivedPermissions.5.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.5.via.0.address:
-        "arbitrum:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "arb1:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      receivedPermissions.5.from:
-        "arbitrum:0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "arb1:0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      receivedPermissions.6.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.6.via.0.address:
-        "arbitrum:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "arb1:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      receivedPermissions.6.from:
-        "arbitrum:0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
+        "arb1:0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
      receivedPermissions.7.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.7.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.7.from:
-        "arbitrum:0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad"
+        "arb1:0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad"
      receivedPermissions.8.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.8.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.8.from:
-        "arbitrum:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
+        "arb1:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      receivedPermissions.9.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.9.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.9.from:
-        "arbitrum:0x8a1cDA8dee421cD06023470608605934c16A05a0"
+        "arb1:0x8a1cDA8dee421cD06023470608605934c16A05a0"
      receivedPermissions.10.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.10.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.10.from:
-        "arbitrum:0x912CE59144191C1204E64559FE8253a0e49E6548"
+        "arb1:0x912CE59144191C1204E64559FE8253a0e49E6548"
      receivedPermissions.11.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.11.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.11.from:
-        "arbitrum:0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "arb1:0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      receivedPermissions.12.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.12.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.12.from:
-        "arbitrum:0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
+        "arb1:0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
      receivedPermissions.13.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.13.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.13.from:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.14.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.14.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.14.from:
-        "arbitrum:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      receivedPermissions.15.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.15.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.15.from:
-        "arbitrum:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "arb1:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      directlyReceivedPermissions.0.from:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
    }
```

```diff
    contract SecurityCouncilMemberElectionGovernor (0x467923B9AE90BDB36BA88eCA11604D45F13b712C) {
    +++ description: Token governance contract for the Security Council member elections.
      receivedPermissions.0.from:
-        "arbitrum:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
    }
```

```diff
    contract SecurityCouncilMemberRemovalGovernor (0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad) {
    +++ description: Token governance contract for the Security Council member removals.
      receivedPermissions.0.from:
-        "arbitrum:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      receivedPermissions.1.from:
-        "arbitrum:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      receivedPermissions.2.from:
-        "arbitrum:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      receivedPermissions.3.from:
-        "arbitrum:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      receivedPermissions.4.from:
-        "arbitrum:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2).
      directlyReceivedPermissions.0.from:
-        "arbitrum:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "arb1:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      directlyReceivedPermissions.3.from:
-        "arbitrum:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
+        "arb1:0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "arb1:0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
+        "arb1:0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
+        "arb1:0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad"
+        "arb1:0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad"
      directlyReceivedPermissions.3.from:
-        "arbitrum:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
+        "arb1:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      directlyReceivedPermissions.4.from:
-        "arbitrum:0x8a1cDA8dee421cD06023470608605934c16A05a0"
+        "arb1:0x8a1cDA8dee421cD06023470608605934c16A05a0"
      directlyReceivedPermissions.5.from:
-        "arbitrum:0x912CE59144191C1204E64559FE8253a0e49E6548"
+        "arb1:0x912CE59144191C1204E64559FE8253a0e49E6548"
      directlyReceivedPermissions.6.from:
-        "arbitrum:0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "arb1:0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      directlyReceivedPermissions.7.from:
-        "arbitrum:0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
+        "arb1:0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
      directlyReceivedPermissions.8.from:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      directlyReceivedPermissions.9.from:
-        "arbitrum:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      directlyReceivedPermissions.10.from:
-        "arbitrum:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "arb1:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: Token governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals.
      receivedPermissions.0.from:
-        "arbitrum:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      receivedPermissions.1.from:
-        "arbitrum:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
    }
```

```diff
    EOA L1Timelock_l2alias (0xf7951D92B0C345144506576eC13Ecf5103aC905a) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.0.from:
-        "arbitrum:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      receivedPermissions.1.via.0.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.1.from:
-        "arbitrum:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      receivedPermissions.2.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.2.via.0.address:
-        "arbitrum:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "arb1:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      receivedPermissions.2.from:
-        "arbitrum:0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
+        "arb1:0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
      receivedPermissions.3.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.3.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.3.from:
-        "arbitrum:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "arb1:0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      receivedPermissions.4.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.4.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.4.from:
-        "arbitrum:0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
+        "arb1:0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
      receivedPermissions.5.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.5.via.0.address:
-        "arbitrum:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "arb1:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      receivedPermissions.5.from:
-        "arbitrum:0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "arb1:0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      receivedPermissions.6.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.6.via.0.address:
-        "arbitrum:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "arb1:0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      receivedPermissions.6.from:
-        "arbitrum:0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
+        "arb1:0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
      receivedPermissions.7.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.7.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.7.from:
-        "arbitrum:0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad"
+        "arb1:0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad"
      receivedPermissions.8.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.8.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.8.from:
-        "arbitrum:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
+        "arb1:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      receivedPermissions.9.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.9.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.9.from:
-        "arbitrum:0x8a1cDA8dee421cD06023470608605934c16A05a0"
+        "arb1:0x8a1cDA8dee421cD06023470608605934c16A05a0"
      receivedPermissions.10.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.10.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.10.from:
-        "arbitrum:0x912CE59144191C1204E64559FE8253a0e49E6548"
+        "arb1:0x912CE59144191C1204E64559FE8253a0e49E6548"
      receivedPermissions.11.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.11.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.11.from:
-        "arbitrum:0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "arb1:0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      receivedPermissions.12.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.12.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.12.from:
-        "arbitrum:0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
+        "arb1:0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
      receivedPermissions.13.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.13.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.13.from:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.14.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.14.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.14.from:
-        "arbitrum:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "arb1:0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      receivedPermissions.15.via.1.address:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.15.via.0.address:
-        "arbitrum:0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "arb1:0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.15.from:
-        "arbitrum:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "arb1:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      directlyReceivedPermissions.0.from:
-        "arbitrum:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "arb1:0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
    }
```

Generated with discovered.json: 0xc692917dd7ed14bfabfb49bbb9c134bc60529a32

# Diff at Tue, 27 May 2025 08:31:02 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 340727816
- current block number: 340727816

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 340727816 (main branch discovery), not current.

```diff
    EOA L1Timelock_l2alias (0xf7951D92B0C345144506576eC13Ecf5103aC905a) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x7bd7aaf8927b43bae62ca4850d3db3d9445609e1

# Diff at Mon, 26 May 2025 13:34:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d675d0bd208eadc685b2cb489512b83f62c0890e block: 337288646
- current block number: 340727816

## Description

two signers rotated in: 0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D (Certora) and 0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E (fred) (SC elections).

## Watched changes

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      values.$members.8:
-        "0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"
+        "0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D"
      values.$members.7:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0xBBD2E01eFB88ce00F8f5b6B9a696966070089392"
      values.$members.6:
-        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.$members.5:
-        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
+        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
      values.$members.4:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
      values.$members.3:
-        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
+        "0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E"
      values.$members.2:
-        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
+        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      values.$members.8:
-        "0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"
+        "0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D"
      values.$members.7:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0xBBD2E01eFB88ce00F8f5b6B9a696966070089392"
      values.$members.6:
-        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.$members.5:
-        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
+        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
      values.$members.4:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
      values.$members.3:
-        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
+        "0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E"
      values.$members.2:
-        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
+        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 337288646 (main branch discovery), not current.

```diff
    EOA fred - Arbitrum 1 (0x5DD2205C3aac13E592F0a3D85188c948D1781df1) {
    +++ description: None
      name:
-        "fred-Arbitrum"
+        "fred - Arbitrum 1"
    }
```

```diff
    EOA Michael Lewellen - blockaid (0xBBD2E01eFB88ce00F8f5b6B9a696966070089392) {
    +++ description: None
      name:
+        "Michael Lewellen - blockaid"
    }
```

```diff
    EOA fred - Arbitrum 2 (0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E) {
    +++ description: None
      name:
+        "fred - Arbitrum 2"
    }
```

```diff
    EOA Certora 2 (0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D) {
    +++ description: None
      name:
+        "Certora 2"
    }
```

```diff
    EOA L1Timelock_l2alias (0xf7951D92B0C345144506576eC13Ecf5103aC905a) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

Generated with discovered.json: 0x2d6d283cac6fca1e0e1ce550b0c3c6bdc173156f

# Diff at Fri, 23 May 2025 09:41:11 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 337288646
- current block number: 337288646

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 337288646 (main branch discovery), not current.

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      receivedPermissions.15.role:
+        "admin"
      receivedPermissions.14.role:
+        "admin"
      receivedPermissions.13.role:
+        "admin"
      receivedPermissions.12.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.12.from:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      receivedPermissions.12.description:
-        "manage all access control roles."
      receivedPermissions.12.via.1:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      receivedPermissions.12.via.0.address:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.12.role:
+        "admin"
      receivedPermissions.11.from:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.from:
-        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.from:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0x8a1cDA8dee421cD06023470608605934c16A05a0"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.from:
-        "0x8a1cDA8dee421cD06023470608605934c16A05a0"
+        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.from:
-        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
+        "0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.from:
-        "0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
+        "0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.from:
-        "0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
+        "0x912CE59144191C1204E64559FE8253a0e49E6548"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0x912CE59144191C1204E64559FE8253a0e49E6548"
+        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      receivedPermissions.3.via.1:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      receivedPermissions.3.via.0.address:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.3.description:
+        "manage all access control roles."
      receivedPermissions.3.role:
+        ".defaultAdminAC"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".executors"
    }
```

```diff
    contract SecurityCouncilMemberElectionGovernor (0x467923B9AE90BDB36BA88eCA11604D45F13b712C) {
    +++ description: Token governance contract for the Security Council member elections.
      receivedPermissions.0.role:
+        ".cohortReplacerAC"
    }
```

```diff
    contract SecurityCouncilMemberRemovalGovernor (0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad) {
    +++ description: Token governance contract for the Security Council member removals.
      receivedPermissions.0.role:
+        ".memberRemoverAC"
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      receivedPermissions.4.role:
+        ".memberAdderAC"
      receivedPermissions.3.description:
-        "schedule a proposal to rotate a Security Council member (same member, new address)."
+        "schedule a proposal to replace a Security Council member."
      receivedPermissions.3.role:
+        ".memberReplacerAC"
      receivedPermissions.2.role:
+        ".memberRemoverAC"
      receivedPermissions.1.description:
-        "schedule a proposal to replace a Security Council member."
+        "schedule a proposal to rotate a Security Council member (same member, new address)."
      receivedPermissions.1.role:
+        ".memberRotatorAC"
      receivedPermissions.0.role:
+        ".Proposer"
      directlyReceivedPermissions.0.role:
+        ".Proposer"
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2).
      directlyReceivedPermissions.3.role:
+        ".defaultAdminAC"
      directlyReceivedPermissions.2.role:
+        ".owner"
      directlyReceivedPermissions.1.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
      directlyReceivedPermissions.1.role:
+        ".Proposer"
      directlyReceivedPermissions.0.role:
+        ".Proposer"
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      directlyReceivedPermissions.10.role:
+        "admin"
      directlyReceivedPermissions.9.role:
+        "admin"
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: Token governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals.
      receivedPermissions.1.role:
+        ".Proposer"
      receivedPermissions.0.role:
+        ".Canceller"
      directlyReceivedPermissions.0.role:
+        ".Proposer"
    }
```

```diff
    EOA L1Timelock_l2alias (0xf7951D92B0C345144506576eC13Ecf5103aC905a) {
    +++ description: None
      receivedPermissions.15.role:
+        "admin"
      receivedPermissions.14.role:
+        "admin"
      receivedPermissions.13.role:
+        "admin"
      receivedPermissions.12.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.12.from:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      receivedPermissions.12.description:
-        "manage all access control roles."
      receivedPermissions.12.via.1:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      receivedPermissions.12.via.0.address:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.12.role:
+        "admin"
      receivedPermissions.11.from:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.from:
-        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.from:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0x8a1cDA8dee421cD06023470608605934c16A05a0"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.from:
-        "0x8a1cDA8dee421cD06023470608605934c16A05a0"
+        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.from:
-        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
+        "0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.from:
-        "0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
+        "0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.from:
-        "0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
+        "0x912CE59144191C1204E64559FE8253a0e49E6548"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0x912CE59144191C1204E64559FE8253a0e49E6548"
+        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      receivedPermissions.3.via.1:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      receivedPermissions.3.via.0.address:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.3.description:
+        "manage all access control roles."
      receivedPermissions.3.role:
+        ".defaultAdminAC"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".executors"
    }
```

Generated with discovered.json: 0x7deef8de17c285c0f615b0b914edf9dcf96c8e46

# Diff at Fri, 16 May 2025 13:00:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9912083f7b773804513e08ee765f8ba71a92980b block: 333894848
- current block number: 337288646

## Description

MS member change (l2 nominee vetter).

## Watched changes

```diff
    contract GnosisSafeL2 (0xc610984d9C96a7CE54Bcd335CEee9b0e3874380C) {
    +++ description: None
      values.$members.3:
-        "0xc43a77b64b34551beA865C9E85A116B444EF44B1"
+        "0xf3b0B40e54Be009C852dBD3577F34D1D27bC07F6"
      values.$members.2:
-        "0xa98290a7A282d8249544D35b288E160A5580D57E"
+        "0xc43a77b64b34551beA865C9E85A116B444EF44B1"
      values.$members.1:
-        "0x25032D068633cfbe52c134EBdD965b2C2B4C2710"
+        "0xa98290a7A282d8249544D35b288E160A5580D57E"
    }
```

Generated with discovered.json: 0xad1d0d3dcd1f3a6cdbd9c3acf8d45af766f85290

# Diff at Mon, 12 May 2025 13:18:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e25d362b71032c18a3417a2307d6923e1b5a519 block: 333894848
- current block number: 333894848

## Description

replace medium severity everywhere.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 333894848 (main branch discovery), not current.

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
      fieldMeta.getBothCohorts.severity:
-        "MEDIUM"
+        "LOW"
    }
```

Generated with discovered.json: 0x8fb6bd77def2bce4e1a64221a4584b2b177855ae

# Diff at Tue, 06 May 2025 15:56:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e14d6ca6cfb9c51927744033947048a6b7efb278 block: 331086890
- current block number: 333894848

## Description

SC member elections have concluded.

## Watched changes

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.8:
-        "0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"
+        "0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.7:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0xBBD2E01eFB88ce00F8f5b6B9a696966070089392"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.6:
-        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.5:
-        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
+        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.4:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.3:
-        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
+        "0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.2:
-        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
+        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
      values.getSecondCohort.4:
-        "0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"
+        "0xeEe3Fb3B792C7DDbB6aEF0C440FBC621f4d6fe2D"
      values.getSecondCohort.3:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0xBBD2E01eFB88ce00F8f5b6B9a696966070089392"
      values.getSecondCohort.2:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getSecondCohort.1:
-        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
+        "0xD8D4cEC103c0B6d7166405F0EbD7087C75a1528E"
      values.updateNonce:
-        12
+        13
    }
```

Generated with discovered.json: 0x71c0fc49fd6a584890abfb77d53ac9733390af7b

# Diff at Tue, 06 May 2025 10:57:02 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 331086890
- current block number: 331086890

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331086890 (main branch discovery), not current.

```diff
    EOA L1Timelock_l2alias (0xf7951D92B0C345144506576eC13Ecf5103aC905a) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0xeed621ab829e178730af08232cb0938c21c4567f

# Diff at Tue, 29 Apr 2025 09:36:52 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 331086890
- current block number: 331086890

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 331086890 (main branch discovery), not current.

```diff
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    +++ description: Counterpart to the L1ERC20Gateway. Can mint (deposit to L2) and burn (withdraw to L1) ERC20 tokens on L2.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"}]},{"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"}]}]
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: Delays constitutional AIPs from the CoreGovernor by 8d.
      issuedPermissions:
-        [{"permission":"interact","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","delay":691200,"description":"manage all access control roles and change the minimum delay.","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]},{"permission":"interact","to":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941","description":"propose transactions.","via":[]},{"permission":"interact","to":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9","description":"propose transactions.","via":[]},{"permission":"interact","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","delay":691200,"description":"manage all access control roles and change the minimum delay.","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]},{"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}]
    }
```

```diff
    contract SecurityCouncilMemberElectionGovernor (0x467923B9AE90BDB36BA88eCA11604D45F13b712C) {
    +++ description: Token governance contract for the Security Council member elections.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}]
    }
```

```diff
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    +++ description: Router managing token <–> gateway mapping on L2.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"}]},{"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"}]}]
    }
```

```diff
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B) {
    +++ description: Counterpart to the Bridge on L1. Mints and burns WETH on L2.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"}]},{"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"}]}]
    }
```

```diff
    contract SecurityCouncilMemberRemovalGovernor (0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad) {
    +++ description: Token governance contract for the Security Council member removals.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}]
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: Token governance contract used for creating non-constitutional AIPs, or “treasury proposals”, e.g., transferring founds out of the DAO Treasury. Also enforces the 3% quorum for proposals.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}]
    }
```

```diff
    contract SecurityCouncilNomineeElectionGovernor (0x8a1cDA8dee421cD06023470608605934c16A05a0) {
    +++ description: Token governance contract for the Security Council nominee elections.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}]
    }
```

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: The ARB token contract. Supply can be increased by the owner once per year by a maximum of 2%.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}]
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: Delays treasury proposals from the TreasuryGovernor by 259200 seconds. Is used as the main recipient for the ETH from L2SurplusFee and L2BaseFee contracts.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}]
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: ARB sent from L2 to L1 is escrowed in this contract and minted on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}]
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2).
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}]
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
      issuedPermissions:
-        [{"permission":"interact","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","description":"manage all access control roles.","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]},{"permission":"interact","to":"0x467923B9AE90BDB36BA88eCA11604D45F13b712C","description":"schedule a proposal to replace a Security Council member cohort.","via":[]},{"permission":"interact","to":"0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad","description":"schedule a proposal to remove a Security Council member.","via":[]},{"permission":"interact","to":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941","description":"schedule a proposal to add a new member to the Security Council.","via":[]},{"permission":"interact","to":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941","description":"schedule a proposal to remove a Security Council member.","via":[]},{"permission":"interact","to":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941","description":"schedule a proposal to replace a Security Council member.","via":[]},{"permission":"interact","to":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941","description":"schedule a proposal to rotate a Security Council member (same member, new address).","via":[]},{"permission":"interact","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","description":"manage all access control roles.","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]},{"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}]
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: Token governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}]
    }
```

Generated with discovered.json: 0x847d08d9927e10af1d53d5c76eea0ce82f1d7e73

# Diff at Mon, 28 Apr 2025 11:54:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@640aad31846aa48203969768d234f58dfd9896e5 block: 329029286
- current block number: 331086890

## Description

config related (due to canActIndependently fix we merged).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 329029286 (main branch discovery), not current.

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: Delays constitutional AIPs from the CoreGovernor by 8d.
      issuedPermissions.7:
-        {"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}
      issuedPermissions.6.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      issuedPermissions.5.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.5.to:
-        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.5.delay:
-        691200
      issuedPermissions.5.description:
-        "manage all access control roles and change the minimum delay."
      issuedPermissions.5.via.1:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      issuedPermissions.5.via.0.address:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      issuedPermissions.4.to:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      issuedPermissions.4.description:
-        "propose transactions."
+        "manage all access control roles and change the minimum delay."
      issuedPermissions.4.via.0:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      issuedPermissions.4.delay:
+        691200
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
      receivedPermissions:
-        [{"permission":"interact","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","description":"propose transactions."}]
      directlyReceivedPermissions.1:
+        {"permission":"act","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}
      directlyReceivedPermissions.0.permission:
-        "act"
+        "interact"
      directlyReceivedPermissions.0.delay:
-        691200
      directlyReceivedPermissions.0.description:
+        "propose transactions."
    }
```

Generated with discovered.json: 0x651e65c40fdb19782c59666767006705c59ca8c8

# Diff at Tue, 22 Apr 2025 12:26:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@60b07eece04f1a17d258d39ff1adffbef4174f23 block: 316974509
- current block number: 329029286

## Description

signer changes in a MS designated the nominee vetter for SC elections.

## Watched changes

```diff
    contract GnosisSafeL2 (0xc610984d9C96a7CE54Bcd335CEee9b0e3874380C) {
    +++ description: None
      values.$members.5:
-        "0xdE82B19aA75d93EB9Fca9a284dD0EB643d5e35C2"
      values.$members.4:
-        "0xc43a77b64b34551beA865C9E85A116B444EF44B1"
+        "0xdE82B19aA75d93EB9Fca9a284dD0EB643d5e35C2"
      values.$members.3:
-        "0xa98290a7A282d8249544D35b288E160A5580D57E"
+        "0xc43a77b64b34551beA865C9E85A116B444EF44B1"
      values.$members.2:
-        "0x25032D068633cfbe52c134EBdD965b2C2B4C2710"
+        "0xa98290a7A282d8249544D35b288E160A5580D57E"
      values.$members.1:
-        "0x0adc7D8eB4C01219858a579C9539780CD9575035"
+        "0x25032D068633cfbe52c134EBdD965b2C2B4C2710"
      values.$members.0:
-        "0xC3514C143Df27eB29AC4c56c59A260713B841BDd"
+        "0x0adc7D8eB4C01219858a579C9539780CD9575035"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x823619ec8bd720017887d3c7717c07e43b75469f

# Diff at Thu, 10 Apr 2025 14:43:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 316974509
- current block number: 316974509

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 316974509 (main branch discovery), not current.

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: Delays constitutional AIPs from the CoreGovernor by 8d.
      issuedPermissions.7:
+        {"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}
      issuedPermissions.6.to:
-        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.5.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.5.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      issuedPermissions.5.via.1:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      issuedPermissions.5.via.0.address:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      issuedPermissions.5.delay:
+        691200
      issuedPermissions.5.description:
+        "manage all access control roles and change the minimum delay."
      issuedPermissions.4.to:
-        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
+        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      issuedPermissions.4.delay:
-        691200
      issuedPermissions.4.description:
-        "manage all access control roles and change the minimum delay."
+        "propose transactions."
      issuedPermissions.4.via.0:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
      directlyReceivedPermissions.1:
-        {"permission":"act","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}
      directlyReceivedPermissions.0.permission:
-        "interact"
+        "act"
      directlyReceivedPermissions.0.description:
-        "propose transactions."
      directlyReceivedPermissions.0.delay:
+        691200
      receivedPermissions:
+        [{"permission":"interact","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","description":"propose transactions."}]
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      displayName:
-        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xe362c1f87db1447d8733b0a454dc3df288ca0e18

# Diff at Thu, 20 Mar 2025 16:31:42 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2783d2ac352634f1b31c1da67316be8c3bcdecc9 block: 316974509
- current block number: 316974509

## Description

Discovery rerun on the same block number with only config-related changes.

Due to a fix in permissions solver, canActIndependently on SecurityCouncilManager
flag got processed correctly, moving it to the contracts section and a permission
it received got removed.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 316974509 (main branch discovery), not current.

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: Delays constitutional AIPs from the CoreGovernor by 8d.
      issuedPermissions.7:
-        {"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}
      issuedPermissions.6.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      issuedPermissions.5.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.5.to:
-        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.5.delay:
-        691200
      issuedPermissions.5.description:
-        "manage all access control roles and change the minimum delay."
      issuedPermissions.5.via.1:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      issuedPermissions.5.via.0.address:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      issuedPermissions.4.to:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      issuedPermissions.4.description:
-        "propose transactions."
+        "manage all access control roles and change the minimum delay."
      issuedPermissions.4.via.0:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      issuedPermissions.4.delay:
+        691200
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
      receivedPermissions:
-        [{"permission":"interact","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","description":"propose transactions."}]
      directlyReceivedPermissions.1:
+        {"permission":"act","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}
      directlyReceivedPermissions.0.permission:
-        "act"
+        "interact"
      directlyReceivedPermissions.0.delay:
-        691200
      directlyReceivedPermissions.0.description:
+        "propose transactions."
    }
```

Generated with discovered.json: 0x4f362ae5a39bf826880ca3a4f855492857d6632d

# Diff at Tue, 18 Mar 2025 15:06:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@85c86c036912da555630153ffacb09241c07a7c2 block: 316974509
- current block number: 316974509

## Description

Discovery rerun on the same block number with only config-related changes.
Removed "target" scoping in template jsons of SecurityCouncilManager on L2.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 316974509 (main branch discovery), not current.

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      receivedPermissions.15:
+        {"permission":"upgrade","from":"0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.14.from:
-        "0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad"
+        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      receivedPermissions.13.from:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      receivedPermissions.13.via.0.address:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      receivedPermissions.12.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.12.from:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      receivedPermissions.12.via.1:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      receivedPermissions.12.via.0.address:
-        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.12.description:
+        "manage all access control roles."
    }
```

```diff
    contract SecurityCouncilMemberElectionGovernor (0x467923B9AE90BDB36BA88eCA11604D45F13b712C) {
    +++ description: Token governance contract for the Security Council member elections.
      receivedPermissions:
+        [{"permission":"interact","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","description":"schedule a proposal to replace a Security Council member cohort."}]
    }
```

```diff
    contract SecurityCouncilMemberRemovalGovernor (0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad) {
    +++ description: Token governance contract for the Security Council member removals.
      receivedPermissions:
+        [{"permission":"interact","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","description":"schedule a proposal to remove a Security Council member."}]
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      receivedPermissions.4:
+        {"permission":"interact","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","description":"schedule a proposal to add a new member to the Security Council."}
      receivedPermissions.3:
+        {"permission":"interact","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","description":"schedule a proposal to rotate a Security Council member (same member, new address)."}
      receivedPermissions.2:
+        {"permission":"interact","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","description":"schedule a proposal to remove a Security Council member."}
      receivedPermissions.1:
+        {"permission":"interact","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","description":"schedule a proposal to replace a Security Council member."}
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2).
      directlyReceivedPermissions.3:
+        {"permission":"interact","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","description":"manage all access control roles."}
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
      issuedPermissions.9:
+        {"permission":"upgrade","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}
      issuedPermissions.8:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}
      issuedPermissions.7:
+        {"permission":"interact","to":"0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641","description":"manage all access control roles.","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      issuedPermissions.6:
+        {"permission":"interact","to":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941","description":"schedule a proposal to add a new member to the Security Council.","via":[]}
      issuedPermissions.5:
+        {"permission":"interact","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","description":"manage all access control roles.","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      issuedPermissions.4:
+        {"permission":"interact","to":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941","description":"schedule a proposal to rotate a Security Council member (same member, new address).","via":[]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0x467923B9AE90BDB36BA88eCA11604D45F13b712C","description":"schedule a proposal to replace a Security Council member cohort.","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941","description":"schedule a proposal to remove a Security Council member.","via":[]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.1.to:
-        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
+        "0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
      issuedPermissions.1.via.1:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      issuedPermissions.1.via.0:
-        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.1.description:
+        "schedule a proposal to replace a Security Council member."
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad"
      issuedPermissions.0.via.1:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      issuedPermissions.0.via.0:
-        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.description:
+        "schedule a proposal to remove a Security Council member."
    }
```

```diff
    contract L1Timelock_l2alias (0xf7951D92B0C345144506576eC13Ecf5103aC905a) {
    +++ description: None
      receivedPermissions.15:
+        {"permission":"upgrade","from":"0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.14.from:
-        "0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad"
+        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      receivedPermissions.13.from:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      receivedPermissions.13.via.0.address:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      receivedPermissions.12.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.12.from:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      receivedPermissions.12.via.1:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      receivedPermissions.12.via.0.address:
-        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.12.description:
+        "manage all access control roles."
    }
```

Generated with discovered.json: 0xa9aebe8a6bec0256b8a98116a61333aeba281a29

# Diff at Tue, 18 Mar 2025 12:20:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8a389387016e20fe96cd5cb775e4b943b3aaa832 block: 314982694
- current block number: 316974509

## Description

Config: Security Council manager cannot act independently, access control permissions defined.

## Watched changes

```diff
    contract SecurityCouncilNomineeElectionGovernor (0x8a1cDA8dee421cD06023470608605934c16A05a0) {
    +++ description: Token governance contract for the Security Council nominee elections.
      values.currentCohort:
-        0
+        1
      values.electionCount:
-        3
+        4
      values.otherCohort:
-        1
+        0
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 314982694 (main branch discovery), not current.

```diff
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    +++ description: Counterpart to the L1ERC20Gateway. Can mint (deposit to L2) and burn (withdraw to L1) ERC20 tokens on L2.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: Delays constitutional AIPs from the CoreGovernor by 8d.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      receivedPermissions.14:
+        {"permission":"upgrade","from":"0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.13:
+        {"permission":"upgrade","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.12:
+        {"permission":"upgrade","from":"0x5288c571Fd7aD117beA99bF60FE0846C4E84F933","via":[{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.11.from:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      receivedPermissions.10.from:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      receivedPermissions.10.via.0.address:
-        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.9.from:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.8.from:
-        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "0x8a1cDA8dee421cD06023470608605934c16A05a0"
      receivedPermissions.7.from:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      receivedPermissions.6.from:
-        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      receivedPermissions.5.from:
-        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
+        "0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
    }
```

```diff
    contract L2DAIGateway (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) {
    +++ description: Counterpart to the L1DaiGateway. Can mint (deposit to L2) and burn (withdraw to L1) DAI tokens on L2.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    +++ description: Router managing token <–> gateway mapping on L2.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B) {
    +++ description: Counterpart to the Bridge on L1. Mints and burns WETH on L2.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2LPTGateway (0x6D2457a4ad276000A615295f7A80F79E48CcD318) {
    +++ description: Counterpart to the L1LPTGateway. Can mint (deposit to L2) and burn (withdraw to L1) LPT on L2.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: Token governance contract used for creating non-constitutional AIPs, or “treasury proposals”, e.g., transferring founds out of the DAO Treasury. Also enforces the 3% quorum for proposals.
      description:
-        "Governance contract used for creating non-constitutional AIPs, or “treasury proposals”, e.g., transferring founds out of the DAO Treasury. Also enforces the 3% quorum for proposals."
+        "Token governance contract used for creating non-constitutional AIPs, or “treasury proposals”, e.g., transferring founds out of the DAO Treasury. Also enforces the 3% quorum for proposals."
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: Delays treasury proposals from the TreasuryGovernor by 259200 seconds. Is used as the main recipient for the ETH from L2SurplusFee and L2BaseFee contracts.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: ARB sent from L2 to L1 is escrowed in this contract and minted on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2).
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
      values.cohortReplacerAC:
+        ["0x467923B9AE90BDB36BA88eCA11604D45F13b712C"]
      values.defaultAdminAC:
+        ["0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"]
      values.memberAdderAC:
+        ["0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"]
      values.memberRemoverAC:
+        ["0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad","0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"]
      values.memberReplacerAC:
+        ["0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"]
      values.memberRotatorAC:
+        ["0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"]
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      directlyReceivedPermissions.10:
+        {"permission":"upgrade","from":"0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad"}
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"}
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"}
      directlyReceivedPermissions.7.from:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      directlyReceivedPermissions.6.from:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      directlyReceivedPermissions.5.from:
-        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "0x8a1cDA8dee421cD06023470608605934c16A05a0"
      directlyReceivedPermissions.4.from:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      directlyReceivedPermissions.3.from:
-        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      directlyReceivedPermissions.2.from:
-        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
+        "0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: Token governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals.
      description:
-        "Governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals."
+        "Token governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals."
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L1Timelock_l2alias (0xf7951D92B0C345144506576eC13Ecf5103aC905a) {
    +++ description: None
      receivedPermissions.14:
+        {"permission":"upgrade","from":"0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.13:
+        {"permission":"upgrade","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.12:
+        {"permission":"upgrade","from":"0x5288c571Fd7aD117beA99bF60FE0846C4E84F933","via":[{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.11.from:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      receivedPermissions.10.from:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      receivedPermissions.10.via.0.address:
-        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      receivedPermissions.9.from:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions.8.from:
-        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "0x8a1cDA8dee421cD06023470608605934c16A05a0"
      receivedPermissions.7.from:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      receivedPermissions.6.from:
-        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      receivedPermissions.5.from:
-        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
+        "0x467923B9AE90BDB36BA88eCA11604D45F13b712C"
    }
```

```diff
+   Status: CREATED
    contract SecurityCouncilMemberElectionGovernor (0x467923B9AE90BDB36BA88eCA11604D45F13b712C)
    +++ description: Token governance contract for the Security Council member elections.
```

```diff
+   Status: CREATED
    contract SecurityCouncilMemberRemovalGovernor (0x6f3a242cA91A119F872f0073BC14BC8a74a315Ad)
    +++ description: Token governance contract for the Security Council member removals.
```

```diff
+   Status: CREATED
    contract SecurityCouncilNomineeElectionGovernor (0x8a1cDA8dee421cD06023470608605934c16A05a0)
    +++ description: Token governance contract for the Security Council nominee elections.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xc610984d9C96a7CE54Bcd335CEee9b0e3874380C)
    +++ description: None
```

Generated with discovered.json: 0x6dc622892d36c31d9cc33318b5305a0613b1a777

# Diff at Thu, 06 Mar 2025 15:34:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 308283361
- current block number: 308283361

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308283361 (main branch discovery), not current.

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: Delays constitutional AIPs from the CoreGovernor by 8d.
      issuedPermissions.5.description:
-        "update the minimum delay of the timelock."
+        "manage all access control roles and change the minimum delay."
      issuedPermissions.5.delay:
+        691200
      issuedPermissions.0.description:
-        "update the minimum delay of the timelock."
+        "manage all access control roles and change the minimum delay."
      issuedPermissions.0.delay:
+        691200
    }
```

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      receivedPermissions.0.description:
-        "update the minimum delay of the timelock."
+        "manage all access control roles and change the minimum delay."
      receivedPermissions.0.delay:
+        691200
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2).
      directlyReceivedPermissions.2.description:
-        "update the minimum delay of the timelock."
+        "manage all access control roles and change the minimum delay."
      directlyReceivedPermissions.2.delay:
+        691200
    }
```

Generated with discovered.json: 0xe9e6a4d3f0c7642dfbb8fd12872613c951ba11ac

# Diff at Tue, 04 Mar 2025 10:40:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 308283361
- current block number: 308283361

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 308283361 (main branch discovery), not current.

```diff
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    +++ description: Counterpart to the L1ERC20Gateway. Can mint (deposit to L2) and burn (withdraw to L1) ERC20 tokens on L2.
      sinceBlock:
+        2107
    }
```

```diff
    contract ConstitutionHash (0x1D62fFeB72e4c360CcBbacf7c965153b00260417) {
    +++ description: Keeps the current hash of the ArbitrumDAO Constitution. Settable by the L2UpgradeExecutor.
      sinceBlock:
+        70398215
    }
```

```diff
    contract L2SurplusFee (0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d) {
    +++ description: This contract receives all SurplusFees: Transaction fee component that covers the cost beyond that covered by the L2 Base Fee during chain congestion. They are withdrawable to a configurable set of recipients.
      sinceBlock:
+        70483363
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: Delays constitutional AIPs from the CoreGovernor by 8d.
      sinceBlock:
+        70398215
    }
```

```diff
    contract StandardArbERC20 (0x3f770Ac673856F105b586bb393d122721265aD46) {
    +++ description: None
      sinceBlock:
+        2454760
    }
```

```diff
    contract BeaconProxyFactory (0x3fE38087A94903A9D946fa1915e1772fe611000f) {
    +++ description: None
      sinceBlock:
+        2103
    }
```

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      sinceBlock:
+        121762709
    }
```

```diff
    contract L2DAIGateway (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) {
    +++ description: Counterpart to the L1DaiGateway. Can mint (deposit to L2) and burn (withdraw to L1) DAI tokens on L2.
      sinceBlock:
+        1336834
    }
```

```diff
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    +++ description: Router managing token <–> gateway mapping on L2.
      sinceBlock:
+        2108
    }
```

```diff
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B) {
    +++ description: Counterpart to the Bridge on L1. Mints and burns WETH on L2.
      sinceBlock:
+        38495
    }
```

```diff
    contract L2LPTGateway (0x6D2457a4ad276000A615295f7A80F79E48CcD318) {
    +++ description: Counterpart to the L1LPTGateway. Can mint (deposit to L2) and burn (withdraw to L1) LPT on L2.
      sinceBlock:
+        5864786
    }
```

```diff
    contract UpgradeExecRouteBuilder (0x7481716f05E315Fc4C4a64E56DcD9bc1D6F24C0a) {
    +++ description: None
      sinceBlock:
+        121763102
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: Governance contract used for creating non-constitutional AIPs, or “treasury proposals”, e.g., transferring founds out of the DAO Treasury. Also enforces the 3% quorum for proposals.
      sinceBlock:
+        70398215
    }
```

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: The ARB token contract. Supply can be increased by the owner once per year by a maximum of 2%.
      sinceBlock:
+        70398215
    }
```

```diff
    contract SecurityCouncilMemberSyncAction (0x9BF7b8884Fa381a45f8CB2525905fb36C996297a) {
    +++ description: Contract used by the security council management system to sync SecurityCouncil members between the L1 and the L2.
      sinceBlock:
+        121762383
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      sinceBlock:
+        121762420
    }
```

```diff
    contract L2BaseFee (0xbF5041Fc07E1c866D15c749156657B8eEd0fb649) {
    +++ description: This contract receives all BaseFees: The transaction fee component that covers the minimum cost of Arbitrum transaction execution. They are withdrawable to a configurable set of recipients.
      sinceBlock:
+        70483310
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: Delays treasury proposals from the TreasuryGovernor by 259200 seconds. Is used as the main recipient for the ETH from L2SurplusFee and L2BaseFee contracts.
      sinceBlock:
+        70398215
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: ARB sent from L2 to L1 is escrowed in this contract and minted on L1.
      sinceBlock:
+        70397931
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2).
      sinceBlock:
+        70398215
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
      sinceBlock:
+        121763102
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      sinceBlock:
+        2106
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      sinceBlock:
+        70397784
    }
```

```diff
    contract UpgradeableBeacon (0xE72ba9418b5f2Ce0A6a40501Fe77c6839Aa37333) {
    +++ description: None
      sinceBlock:
+        2102
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: Governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals.
      sinceBlock:
+        70398215
    }
```

Generated with discovered.json: 0x920eb76415377917efa5e5983c0de2d7cb5fccea

# Diff at Fri, 21 Feb 2025 06:03:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@72fe705e53307d22cfc60842c4313d545aee913e block: 305003923
- current block number: 308283361

## Description

Config related: remove faulty L2ProxyAdmin template to resolve permissions correctly.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305003923 (main branch discovery), not current.

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: Delays constitutional AIPs from the CoreGovernor by 8d.
      issuedPermissions.7:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}
      issuedPermissions.6.to:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      issuedPermissions.6.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.6.via.0:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
    }
```

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0xCaD7828a19b363A2B44717AFB1786B5196974D8E","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"0x912CE59144191C1204E64559FE8253a0e49E6548","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","from":"0x789fC99093B09aD01C34DC7251D0C89ce743e5a4","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","from":"0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B","via":[{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      receivedPermissions.3.from:
-        "0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
+        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      receivedPermissions.2.from:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      receivedPermissions.2.via.0.address:
-        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: Governance contract used for creating non-constitutional AIPs, or “treasury proposals”, e.g., transferring founds out of the DAO Treasury. Also enforces the 3% quorum for proposals.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}
      issuedPermissions.0.to:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.via.0:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
    }
```

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: The ARB token contract. Supply can be increased by the owner once per year by a maximum of 2%.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}
      issuedPermissions.0.to:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.via.0:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: Delays treasury proposals from the TreasuryGovernor by 259200 seconds. Is used as the main recipient for the ETH from L2SurplusFee and L2BaseFee contracts.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}
      issuedPermissions.0.to:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.via.0:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: ARB sent from L2 to L1 is escrowed in this contract and minted on L1.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}
      issuedPermissions.0.to:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.via.0:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2).
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}
      issuedPermissions.0.to:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.via.0:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      directlyReceivedPermissions.2:
+        {"permission":"interact","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","description":"update the minimum delay of the timelock."}
      directlyReceivedPermissions.1.permission:
-        "interact"
+        "act"
      directlyReceivedPermissions.1.from:
-        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      directlyReceivedPermissions.1.description:
-        "update the minimum delay of the timelock."
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}
      issuedPermissions.0.to:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.via.0:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      template:
-        "orbitstack/layer2/L2ProxyAdmin"
+        "global/ProxyAdmin"
      description:
-        "The owner (UpgradeExecutor) can upgrade proxies' implementations of all L2 system contracts through this contract."
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"},{"permission":"upgrade","from":"0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"},{"permission":"upgrade","from":"0x912CE59144191C1204E64559FE8253a0e49E6548"},{"permission":"upgrade","from":"0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"},{"permission":"upgrade","from":"0xCaD7828a19b363A2B44717AFB1786B5196974D8E"},{"permission":"upgrade","from":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"permission":"upgrade","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"},{"permission":"upgrade","from":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"}]
      displayName:
+        "ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"},{"permission":"upgrade","from":"0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"},{"permission":"upgrade","from":"0x912CE59144191C1204E64559FE8253a0e49E6548"},{"permission":"upgrade","from":"0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"},{"permission":"upgrade","from":"0xCaD7828a19b363A2B44717AFB1786B5196974D8E"},{"permission":"upgrade","from":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"permission":"upgrade","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"},{"permission":"upgrade","from":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"}]
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: Governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}
      issuedPermissions.0.to:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.via.0:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
    }
```

Generated with discovered.json: 0x5896a873cd8b51113d0474fa4c7fac2d45b7ccfd

# Diff at Thu, 20 Feb 2025 12:22:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2b8072d8f4ddd728fac7a5e6cf8717962af378f block: 305003923
- current block number: 305003923

## Description

Config related: Bold templates added

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 305003923 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract GnosisSafe (0xF06E95eF589D9c38af242a8AAee8375f14023F85)
    +++ description: None
```

Generated with discovered.json: 0x29e97c700d703b45fc915b7e9c5b0299c2b6abac

# Diff at Wed, 12 Feb 2025 18:43:35 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@2b0c549e9be2ec1627969531e2ff05c01d31a788 block: 295612328
- current block number: 305003923

## Description

Make Arbitrum discovery driven.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 295612328 (main branch discovery), not current.

```diff
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    +++ description: Counterpart to the L1ERC20Gateway. Can mint (deposit to L2) and burn (withdraw to L1) ERC20 tokens on L2.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"}]}
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      template:
+        "orbitstack/layer2/L2ERC20Gateway"
      description:
+        "Counterpart to the L1ERC20Gateway. Can mint (deposit to L2) and burn (withdraw to L1) ERC20 tokens on L2."
    }
```

```diff
    contract ConstitutionHash (0x1D62fFeB72e4c360CcBbacf7c965153b00260417) {
    +++ description: Keeps the current hash of the ArbitrumDAO Constitution. Settable by the L2UpgradeExecutor.
      template:
+        "orbitstack/layer2/ConstitutionHash"
      description:
+        "Keeps the current hash of the ArbitrumDAO Constitution. Settable by the L2UpgradeExecutor."
    }
```

```diff
    contract L2SurplusFee (0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d) {
    +++ description: This contract receives all SurplusFees: Transaction fee component that covers the cost beyond that covered by the L2 Base Fee during chain congestion. They are withdrawable to a configurable set of recipients.
      template:
+        "orbitstack/layer2/L2SurplusFee"
      description:
+        "This contract receives all SurplusFees: Transaction fee component that covers the cost beyond that covered by the L2 Base Fee during chain congestion. They are withdrawable to a configurable set of recipients."
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: Delays constitutional AIPs from the CoreGovernor by 8d.
      issuedPermissions.6:
+        {"permission":"upgrade","to":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}
      issuedPermissions.5:
+        {"permission":"interact","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","description":"update the minimum delay of the timelock.","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}
      issuedPermissions.4:
+        {"permission":"interact","to":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9","description":"propose transactions.","via":[]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9","description":"cancel queued transactions.","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","description":"propose transactions.","via":[]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941","description":"propose transactions.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      issuedPermissions.0.via.1:
-        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.description:
+        "update the minimum delay of the timelock."
      values.Canceller:
+        ["0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"]
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor:
+        ["0x0000000000000000000000000000000000000000"]
      values.getMinDelayFormatted:
+        "8d"
      values.Proposer:
+        ["0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9","0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941","0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"]
      values.timelockAdminAC:
+        ["0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"]
      template:
+        "orbitstack/layer2/L2Timelock"
      description:
+        "Delays constitutional AIPs from the CoreGovernor by 8d."
      fieldMeta:
+        {"Executor":{"severity":"HIGH","description":"Executing proposals is only open to all addresses if this resolves to the 0x0 address"}}
    }
```

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      template:
-        "GnosisSafe"
+        "orbitstack/layer2/L2SecurityCouncilEmergency"
      receivedPermissions:
+        [{"permission":"interact","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","description":"update the minimum delay of the timelock.","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]},{"permission":"upgrade","from":"0x09e9222E96E7B4AE2a407B98d48e330053351EEe","via":[{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]},{"permission":"upgrade","from":"0x5288c571Fd7aD117beA99bF60FE0846C4E84F933","via":[{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]},{"permission":"upgrade","from":"0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B","via":[{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"},{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]}]
    }
```

```diff
    contract L2DAIGateway (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) {
    +++ description: Counterpart to the L1DaiGateway. Can mint (deposit to L2) and burn (withdraw to L1) DAI tokens on L2.
      template:
+        "orbitstack/layer2/L2DAIGateway"
      description:
+        "Counterpart to the L1DaiGateway. Can mint (deposit to L2) and burn (withdraw to L1) DAI tokens on L2."
    }
```

```diff
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    +++ description: Router managing token <–> gateway mapping on L2.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"}]}
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      template:
+        "orbitstack/layer2/L2GatewayRouter"
      description:
+        "Router managing token <–> gateway mapping on L2."
    }
```

```diff
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B) {
    +++ description: Counterpart to the Bridge on L1. Mints and burns WETH on L2.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xf7951D92B0C345144506576eC13Ecf5103aC905a","via":[{"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"}]}
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      template:
+        "orbitstack/layer2/L2WethGateway"
      description:
+        "Counterpart to the Bridge on L1. Mints and burns WETH on L2."
    }
```

```diff
    contract L2LPTGateway (0x6D2457a4ad276000A615295f7A80F79E48CcD318) {
    +++ description: Counterpart to the L1LPTGateway. Can mint (deposit to L2) and burn (withdraw to L1) LPT on L2.
      template:
+        "orbitstack/layer2/L2LPTGateway"
      description:
+        "Counterpart to the L1LPTGateway. Can mint (deposit to L2) and burn (withdraw to L1) LPT on L2."
    }
```

```diff
    contract UpgradeExecRouteBuilder (0x7481716f05E315Fc4C4a64E56DcD9bc1D6F24C0a) {
    +++ description: None
      template:
+        "orbitstack/layer2/UpgradeExecRouteBuilder"
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: Governance contract used for creating non-constitutional AIPs, or “treasury proposals”, e.g., transferring founds out of the DAO Treasury. Also enforces the 3% quorum for proposals.
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      issuedPermissions.0.via.1:
-        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.via.0:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
+++ description: The percentage of the total supply that is required to pass a proposal.
      values.l2TreasuryQuorumPercent:
+        "3"
      template:
+        "orbitstack/layer2/TreasuryGovernor"
      description:
+        "Governance contract used for creating non-constitutional AIPs, or “treasury proposals”, e.g., transferring founds out of the DAO Treasury. Also enforces the 3% quorum for proposals."
      fieldMeta:
+        {"l2TreasuryQuorumPercent":{"description":"The percentage of the total supply that is required to pass a proposal."}}
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":2}}]
    }
```

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: The ARB token contract. Supply can be increased by the owner once per year by a maximum of 2%.
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      issuedPermissions.0.via.1:
-        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.via.0:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
+++ description: The percentage of the total supply that can be minted by the owner once per year.
      values.mintCapPerYer:
+        "2"
      template:
+        "orbitstack/layer2/L2ArbitrumToken"
      description:
+        "The ARB token contract. Supply can be increased by the owner once per year by a maximum of 2%."
      fieldMeta:
+        {"mintCapPerYer":{"description":"The percentage of the total supply that can be minted by the owner once per year."}}
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":2}}]
    }
```

```diff
    contract SecurityCouncilMemberSyncAction (0x9BF7b8884Fa381a45f8CB2525905fb36C996297a) {
    +++ description: Contract used by the security council management system to sync SecurityCouncil members between the L1 and the L2.
      template:
+        "orbitstack/layer2/SecurityCouncilMemberSyncAction"
      description:
+        "Contract used by the security council management system to sync SecurityCouncil members between the L1 and the L2."
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      template:
-        "GnosisSafe"
+        "orbitstack/layer2/L2SecurityCouncilPropose"
      receivedPermissions:
+        [{"permission":"interact","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","description":"propose transactions."}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]
    }
```

```diff
    contract L2BaseFee (0xbF5041Fc07E1c866D15c749156657B8eEd0fb649) {
    +++ description: This contract receives all BaseFees: The transaction fee component that covers the minimum cost of Arbitrum transaction execution. They are withdrawable to a configurable set of recipients.
      template:
+        "orbitstack/layer2/L2BaseFee"
      description:
+        "This contract receives all BaseFees: The transaction fee component that covers the minimum cost of Arbitrum transaction execution. They are withdrawable to a configurable set of recipients."
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: Delays treasury proposals from the TreasuryGovernor by 259200 seconds. Is used as the main recipient for the ETH from L2SurplusFee and L2BaseFee contracts.
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      issuedPermissions.0.via.1:
-        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.via.0:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      values.getMinDelayFormatted:
+        259200
      template:
+        "orbitstack/layer2/TreasuryTimelock"
      description:
+        "Delays treasury proposals from the TreasuryGovernor by 259200 seconds. Is used as the main recipient for the ETH from L2SurplusFee and L2BaseFee contracts."
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: ARB sent from L2 to L1 is escrowed in this contract and minted on L1.
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      issuedPermissions.0.via.1:
-        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.via.0:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      template:
+        "orbitstack/layer2/L2ARBGateway"
      description:
+        "ARB sent from L2 to L1 is escrowed in this contract and minted on L1."
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2).
      template:
-        "orbitstack/UpgradeExecutor"
+        "orbitstack/layer2/L2UpgradeExecutor"
      displayName:
-        "UpgradeExecutor"
      description:
-        "Central contract defining the access control permissions for upgrading the system contract implementations."
+        "This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2)."
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      issuedPermissions.0.via.1:
-        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.via.0:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      directlyReceivedPermissions.3:
-        {"permission":"act","from":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      directlyReceivedPermissions.2:
-        {"permission":"act","from":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"}
      directlyReceivedPermissions.1.permission:
-        "act"
+        "interact"
      directlyReceivedPermissions.1.from:
-        "0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
+        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      directlyReceivedPermissions.1.description:
+        "update the minimum delay of the timelock."
      directlyReceivedPermissions.0.from:
-        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
+        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      issuedPermissions.0.via.1:
-        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.via.0:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
      template:
+        "orbitstack/layer2/SecurityCouncilManager"
      description:
+        "This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync."
      receivedPermissions:
+        [{"permission":"interact","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","description":"propose transactions."}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: The owner (UpgradeExecutor) can upgrade proxies' implementations of all L2 system contracts through this contract.
      template:
-        "global/ProxyAdmin"
+        "orbitstack/layer2/L2ProxyAdmin"
      displayName:
-        "ProxyAdmin"
      directlyReceivedPermissions:
-        [{"permission":"upgrade","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"},{"permission":"upgrade","from":"0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"},{"permission":"upgrade","from":"0x912CE59144191C1204E64559FE8253a0e49E6548"},{"permission":"upgrade","from":"0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"},{"permission":"upgrade","from":"0xCaD7828a19b363A2B44717AFB1786B5196974D8E"},{"permission":"upgrade","from":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"permission":"upgrade","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"},{"permission":"upgrade","from":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"}]
      description:
+        "The owner (UpgradeExecutor) can upgrade proxies' implementations of all L2 system contracts through this contract."
      receivedPermissions:
+        [{"permission":"upgrade","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"},{"permission":"upgrade","from":"0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"},{"permission":"upgrade","from":"0x912CE59144191C1204E64559FE8253a0e49E6548"},{"permission":"upgrade","from":"0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"},{"permission":"upgrade","from":"0xCaD7828a19b363A2B44717AFB1786B5196974D8E"},{"permission":"upgrade","from":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"permission":"upgrade","from":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"},{"permission":"upgrade","from":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"}]
    }
```

```diff
    contract GnosisSafe (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
    +++ description: None
      template:
-        "GnosisSafe"
+        "orbitstack/SecurityCouncil"
      references:
+        [{"text":"Security Council members - Arbitrum Foundation Docs","href":"https://docs.arbitrum.foundation/security-council-members"}]
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: Governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals.
      issuedPermissions.0.to:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      issuedPermissions.0.via.1:
-        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      issuedPermissions.0.via.0:
-        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}
+++ description: The percentage of the total supply that is required to pass a proposal.
      values.l2CoreQuorumPercent:
+        "5"
      template:
+        "orbitstack/layer2/CoreGovernor"
      description:
+        "Governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals."
      receivedPermissions:
+        [{"permission":"interact","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","description":"cancel queued transactions."},{"permission":"interact","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","description":"propose transactions."}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","delay":691200}]
      fieldMeta:
+        {"l2CoreQuorumPercent":{"description":"The percentage of the total supply that is required to pass a proposal."}}
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":2}}]
    }
```

Generated with discovered.json: 0xeba979cb10654403eba767f0a42cdb0b4828e203

# Diff at Mon, 20 Jan 2025 11:10:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 295612328
- current block number: 295612328

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 295612328 (main branch discovery), not current.

```diff
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      directlyReceivedPermissions.0.from:
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
    }
```

```diff
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

```diff
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      directlyReceivedPermissions.3.target:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      directlyReceivedPermissions.3.from:
+        "0xdb216562328215E010F819B5aBe947bad4ca961e"
      directlyReceivedPermissions.2.target:
-        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      directlyReceivedPermissions.2.from:
+        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      directlyReceivedPermissions.1.target:
-        "0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
      directlyReceivedPermissions.1.from:
+        "0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"
      directlyReceivedPermissions.0.target:
-        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
      directlyReceivedPermissions.0.from:
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      directlyReceivedPermissions.2.target:
-        "0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
      directlyReceivedPermissions.2.from:
+        "0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
      directlyReceivedPermissions.1.target:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      directlyReceivedPermissions.1.from:
+        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      directlyReceivedPermissions.0.target:
-        "0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
      directlyReceivedPermissions.0.from:
+        "0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      directlyReceivedPermissions.7.from:
+        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      directlyReceivedPermissions.6.target:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      directlyReceivedPermissions.6.from:
+        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      directlyReceivedPermissions.5.target:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      directlyReceivedPermissions.5.from:
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      directlyReceivedPermissions.4.target:
-        "0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
      directlyReceivedPermissions.4.from:
+        "0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
      directlyReceivedPermissions.3.target:
-        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      directlyReceivedPermissions.3.from:
+        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      directlyReceivedPermissions.2.target:
-        "0x912CE59144191C1204E64559FE8253a0e49E6548"
      directlyReceivedPermissions.2.from:
+        "0x912CE59144191C1204E64559FE8253a0e49E6548"
      directlyReceivedPermissions.1.target:
-        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      directlyReceivedPermissions.1.from:
+        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      directlyReceivedPermissions.0.target:
-        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
      directlyReceivedPermissions.0.from:
+        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
    }
```

Generated with discovered.json: 0x60ff5325afd5d04d0e25a627980a82dc19d7bb39

# Diff at Wed, 15 Jan 2025 07:51:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 293266550
- current block number: 295612328

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 293266550 (main branch discovery), not current.

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x75e39748f7cfc23b825f00304b15eee6f36c3a98

# Diff at Wed, 08 Jan 2025 12:09:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 287788297
- current block number: 293266550

## Description

Security council members sync.

## Watched changes

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      values.$members.9:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
      values.$members.8:
-        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
      values.$members.7:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
      values.$members.6:
-        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
      values.$members.5:
-        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
      values.$members.4:
-        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
+        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
      values.$members.3:
-        "0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5"
+        "0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
      values.$members.2:
-        "0x1716C1C037e4968D5A06d4d080904F9B7a6508f2"
+        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
      values.$members.1:
-        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
+        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
      values.$members.0:
-        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
+        "0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      values.$members.9:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
      values.$members.8:
-        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
      values.$members.7:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
      values.$members.6:
-        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
      values.$members.5:
-        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
      values.$members.4:
-        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
+        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
      values.$members.3:
-        "0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5"
+        "0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
      values.$members.2:
-        "0x1716C1C037e4968D5A06d4d080904F9B7a6508f2"
+        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
      values.$members.1:
-        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
+        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
      values.$members.0:
-        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
+        "0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"
    }
```

Generated with discovered.json: 0x6bfa062f69e6ae1d0871f4a90ab63bf065cbb481

# Diff at Mon, 23 Dec 2024 13:57:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 276714015
- current block number: 287788297

## Description

SC signers are changed in the SC manager contract. 3 from the first cohort, 1 from the second cohort.

## Watched changes

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.11:
-        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+        "0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.10:
-        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.5:
-        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
+        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.4:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.2:
-        "0x1716C1C037e4968D5A06d4d080904F9B7a6508f2"
+        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.1:
-        "0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5"
+        "0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
      values.getFirstCohort.5:
-        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
+        "0x59c8535419BbCb8AdFFDB3C835435E907e3B183B"
      values.getFirstCohort.4:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
      values.getFirstCohort.2:
-        "0x1716C1C037e4968D5A06d4d080904F9B7a6508f2"
+        "0x78bB97d2F3811256D7F0041E81Aaf4B426eF3b67"
      values.getFirstCohort.1:
-        "0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5"
+        "0x9A301de96b15Db3aB778E2969Bf6cAa909cA56E8"
      values.getSecondCohort.5:
-        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+        "0x444EDf8B90763bE7015F1F099a0dA0ef10250c71"
      values.getSecondCohort.4:
-        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
      values.updateNonce:
-        8
+        12
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xF06E95eF589D9c38af242a8AAee8375f14023F85)
    +++ description: None
```

## Source code changes

```diff
.../arbitrum/.flat/GnosisSafe/GnosisSafe.sol       | 953 +++++++++++++++++++++
 .../.flat/GnosisSafe/GnosisSafeProxy.p.sol         |  35 +
 2 files changed, 988 insertions(+)
```

Generated with discovered.json: 0xfaa17f7c6b6be9b6334a753ed96a0175a3e35b1e

# Diff at Fri, 29 Nov 2024 09:08:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 276714015
- current block number: 276714015

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 276714015 (main branch discovery), not current.

```diff
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86","delay":0}
      issuedPermissions.0.via.0:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","delay":0}
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
    }
```

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"}]
    }
```

```diff
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86","delay":0}
      issuedPermissions.0.via.0:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","delay":0}
    }
```

```diff
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86","delay":0}
      issuedPermissions.0.via.0:
+        {"address":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","delay":0}
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
    }
```

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","target":"0x789fC99093B09aD01C34DC7251D0C89ce743e5a4","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","target":"0x912CE59144191C1204E64559FE8253a0e49E6548","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","target":"0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","target":"0xCaD7828a19b363A2B44717AFB1786B5196974D8E","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","target":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","target":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","target":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}]
      directlyReceivedPermissions.3:
+        {"permission":"act","target":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      directlyReceivedPermissions.2.target:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xd570aCE65C43af47101fC6250FD6fC63D1c22a86"
      values.executors:
+        ["0xf7951D92B0C345144506576eC13Ecf5103aC905a","0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"]
      template:
+        "orbitstack/UpgradeExecutor"
      displayName:
+        "UpgradeExecutor"
      description:
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x09e9222E96E7B4AE2a407B98d48e330053351EEe"},{"permission":"upgrade","target":"0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"},{"permission":"upgrade","target":"0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x09e9222E96E7B4AE2a407B98d48e330053351EEe"},{"permission":"upgrade","target":"0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"},{"permission":"upgrade","target":"0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"}]
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0xf7951D92B0C345144506576eC13Ecf5103aC905a"
      issuedPermissions.0.via.1:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
    }
```

Generated with discovered.json: 0xaca6957750054787b1fb3da414f4c13bf5019472

# Diff at Thu, 21 Nov 2024 07:30:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@de1745323b367dd0fbb18ad6c862147dd90e90b0 block: 271335106
- current block number: 276714015

## Description

SC september cohort (6 members) are added/rotated.

## Watched changes

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      values.$members.9:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.$members.8:
-        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
      values.$members.7:
-        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
      values.$members.6:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
      values.$members.5:
-        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
+        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
      values.$members.4:
-        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
+        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
      values.$members.3:
-        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
+        "0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5"
      values.$members.2:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "0x1716C1C037e4968D5A06d4d080904F9B7a6508f2"
      values.$members.1:
-        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
      values.$members.0:
-        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      values.$members.9:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.$members.8:
-        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
      values.$members.7:
-        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
      values.$members.6:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
      values.$members.5:
-        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
+        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
      values.$members.4:
-        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
+        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
      values.$members.3:
-        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
+        "0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5"
      values.$members.2:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "0x1716C1C037e4968D5A06d4d080904F9B7a6508f2"
      values.$members.1:
-        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
      values.$members.0:
-        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
    }
```

Generated with discovered.json: 0xfc854af9990f892f2e5b8c5a51b8de156487bc1c

# Diff at Tue, 05 Nov 2024 15:46:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 269944713
- current block number: 271335106

## Description

Arbitrum SC first cohort replaced in the manager on L2 after the elections for the september cohort [have concluded](https://www.tally.xyz/gov/arbitrum/council/security-council/election/2/round-2).

## Watched changes

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.5:
-        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
+        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.4:
-        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.3:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.2:
-        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
+        "0x1716C1C037e4968D5A06d4d080904F9B7a6508f2"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.1:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.0:
-        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
+        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
      values.getFirstCohort.5:
-        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
+        "0xe2e9d5B97d8C0457B1cf80BC93802bce4DF03e33"
      values.getFirstCohort.4:
-        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getFirstCohort.3:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0x33ddb82e68940f0e4C1050885BcE8faF5Ddd1b93"
      values.getFirstCohort.2:
-        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
+        "0x1716C1C037e4968D5A06d4d080904F9B7a6508f2"
      values.getFirstCohort.1:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xeA4A4A886aCA47DD0167B4aEE5B1345e18D20Ee5"
      values.getFirstCohort.0:
-        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
+        "0x882c6FCb3D358b9d70B97c6999159cea64168B6F"
      values.updateNonce:
-        7
+        8
    }
```

Generated with discovered.json: 0xcc61b3b0ced6635fe8338a8f293d52208f2152cd

# Diff at Fri, 01 Nov 2024 14:44:43 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 267453071
- current block number: 269944713

## Description

Changed security council members. 

## Watched changes

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      values.$members.1:
-        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
      values.$members.0:
-        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      values.$members.1:
-        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
      values.$members.0:
-        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
    }
```

Generated with discovered.json: 0x6ff68a50e2e898ef57cdadae011ae82ed87712a5

# Diff at Fri, 25 Oct 2024 08:48:14 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bcba81a42870e55c451475b8615b372a538b8463 block: 264777898
- current block number: 267453071

## Description

Timelock extended to 8 days. Exit window is now 7 days.

## Watched changes

```diff
    contract ConstitutionHash (0x1D62fFeB72e4c360CcBbacf7c965153b00260417) {
    +++ description: None
      values.constitutionHash:
-        "0x7cc34e90dde73cfe0b4a041e79b5638e99f0d9547001e42b466c32a18ed6789d"
+        "0x28faf2acba9b3ff80ec484e3d5646931eeef40568b1b7c38dbe52b890bfd7938"
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: None
      values.getMinDelay:
-        259200
+        691200
    }
```

Generated with discovered.json: 0x9126898633ba31c4b13e0a40b10ec8a79f561861

# Diff at Mon, 21 Oct 2024 11:12:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 264777898
- current block number: 264777898

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264777898 (main branch discovery), not current.

```diff
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    +++ description: None
      values.$pastUpgrades.3.2:
+        ["0x1DCf7D03574fbC7C205F41f2e116eE094a652e93"]
      values.$pastUpgrades.3.1:
-        ["0x1DCf7D03574fbC7C205F41f2e116eE094a652e93"]
+        "0x1608ac4dc927c1b322d906419400226634fbf6e68e3fec72316d2e0a3b76c141"
      values.$pastUpgrades.2.2:
+        ["0xEdE95739749BfA021134E41F520d784c99323D6B"]
      values.$pastUpgrades.2.1:
-        ["0xEdE95739749BfA021134E41F520d784c99323D6B"]
+        "0xaa2a503ca6469c771da72d0f04e2afcbe342d9491f620c6b0f7a553c972602da"
      values.$pastUpgrades.1.2:
+        ["0x370ED500E9FEBC1ab05aC0A1617F8775aB80c48e"]
      values.$pastUpgrades.1.1:
-        ["0x370ED500E9FEBC1ab05aC0A1617F8775aB80c48e"]
+        "0x4493b489b9d332078d3dc0ead005a04be3be264a4f2bc32949c19529455804c6"
      values.$pastUpgrades.0.2:
+        ["0x4bF6365278F340E759e7BB4732fE8B507784eAEB"]
      values.$pastUpgrades.0.1:
-        ["0x4bF6365278F340E759e7BB4732fE8B507784eAEB"]
+        "0x4e12ef6c0cb9089632488f4796b6c46818908d29b4547432506dfd28e0e9017b"
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x41740588b86B4e0629b83A4e28786FF94361c3A3"]
      values.$pastUpgrades.0.1:
-        ["0x41740588b86B4e0629b83A4e28786FF94361c3A3"]
+        "0x9cdbb4672b549c26d97cac29f9cd73c1951656e0622ba4b9ed0abff2ee58698d"
    }
```

```diff
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xe80eb0238029333e368e0bDDB7acDf1b9cb28278"]
      values.$pastUpgrades.2.1:
-        ["0xe80eb0238029333e368e0bDDB7acDf1b9cb28278"]
+        "0x1608ac4dc927c1b322d906419400226634fbf6e68e3fec72316d2e0a3b76c141"
      values.$pastUpgrades.1.2:
+        ["0x176a9d89d235512Ad5CB4b6A0879D704D8315eF8"]
      values.$pastUpgrades.1.1:
-        ["0x176a9d89d235512Ad5CB4b6A0879D704D8315eF8"]
+        "0x3ced0ee009785e4b17f388a9da4d27fa77c77059c91e8349e8ddf6ba133ef62e"
      values.$pastUpgrades.0.2:
+        ["0xb30751052797AdBDdbF4847045E51E65e48BAF9c"]
      values.$pastUpgrades.0.1:
-        ["0xb30751052797AdBDdbF4847045E51E65e48BAF9c"]
+        "0x5eac0a26fe108aefb7fe582a4e496463befe69c8fccdb041de9fadbf72190662"
    }
```

```diff
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B) {
    +++ description: None
      values.$pastUpgrades.4.2:
+        ["0x806421D09cDb253aa9d128a658e60c0B95eFFA01"]
      values.$pastUpgrades.4.1:
-        ["0x806421D09cDb253aa9d128a658e60c0B95eFFA01"]
+        "0xb3f49dbe8f48978f618fe962cac91a0fb55a8ded4820702cec2aa305510c21c5"
      values.$pastUpgrades.3.2:
+        ["0xB642058A41D414D9De3F36D14051623e557f1052"]
      values.$pastUpgrades.3.1:
-        ["0xB642058A41D414D9De3F36D14051623e557f1052"]
+        "0x1608ac4dc927c1b322d906419400226634fbf6e68e3fec72316d2e0a3b76c141"
      values.$pastUpgrades.2.2:
+        ["0x0db4f16c99B0aE9b00fc09bF69b36c7d73c45CBE"]
      values.$pastUpgrades.2.1:
-        ["0x0db4f16c99B0aE9b00fc09bF69b36c7d73c45CBE"]
+        "0x87a0fbd51446cdc98fe4dd864d892af27f39d36bac20acbbb0441118e5adf1ba"
      values.$pastUpgrades.1.2:
+        ["0xc4940069140142236D4065b866018f7b2BeC77fD"]
      values.$pastUpgrades.1.1:
-        ["0xc4940069140142236D4065b866018f7b2BeC77fD"]
+        "0x6729e8a4103b6074233302df728b2651392cc833939ce1d97611e167241fe667"
      values.$pastUpgrades.0.2:
+        ["0xb01dB0529B80B73a86ecD75Ae3559844319575E5"]
      values.$pastUpgrades.0.1:
-        ["0xb01dB0529B80B73a86ecD75Ae3559844319575E5"]
+        "0x5a435697cadb8ffab0b4e0e9cb0405f4727be3af14c68305a7fb123f7f27bc2f"
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9"]
      values.$pastUpgrades.0.1:
-        ["0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9"]
+        "0x9cdbb4672b549c26d97cac29f9cd73c1951656e0622ba4b9ed0abff2ee58698d"
    }
```

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xC4ed0A9Ea70d5bCC69f748547650d32cC219D882"]
      values.$pastUpgrades.0.1:
-        ["0xC4ed0A9Ea70d5bCC69f748547650d32cC219D882"]
+        "0x9cdbb4672b549c26d97cac29f9cd73c1951656e0622ba4b9ed0abff2ee58698d"
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x41740588b86B4e0629b83A4e28786FF94361c3A3"]
      values.$pastUpgrades.0.1:
-        ["0x41740588b86B4e0629b83A4e28786FF94361c3A3"]
+        "0x9cdbb4672b549c26d97cac29f9cd73c1951656e0622ba4b9ed0abff2ee58698d"
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5D96786d3Eb13CAd05c9Fd7d0f7bb9560b4E5056"]
      values.$pastUpgrades.0.1:
-        ["0x5D96786d3Eb13CAd05c9Fd7d0f7bb9560b4E5056"]
+        "0xb0fe5622518dc102956d1c0fa83ae58287e4d379dc753ce88df018cbda823cad"
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7A013834D54e9B22d1978aAe3aaDDC909Aa79115"]
      values.$pastUpgrades.0.1:
-        ["0x7A013834D54e9B22d1978aAe3aaDDC909Aa79115"]
+        "0x9cdbb4672b549c26d97cac29f9cd73c1951656e0622ba4b9ed0abff2ee58698d"
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x468dA0eE5570Bdb1Dd81bFd925BAf028A93Dce64"]
      values.$pastUpgrades.0.1:
-        ["0x468dA0eE5570Bdb1Dd81bFd925BAf028A93Dce64"]
+        "0xb2e6f470d1e229cc4225234ae7df52ace563c7b0b9e3ad63a02f535f47e3ac6b"
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9"]
      values.$pastUpgrades.0.1:
-        ["0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9"]
+        "0x9cdbb4672b549c26d97cac29f9cd73c1951656e0622ba4b9ed0abff2ee58698d"
    }
```

Generated with discovered.json: 0xe9ed5a88909da1153b8e56ed2c5a4d6cdfb8052d

# Diff at Fri, 18 Oct 2024 11:03:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@0295165a89d86b7450439f24f100d1baa74381fc block: 264777898
- current block number: 264777898

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 264777898 (main branch discovery), not current.

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: None
      directlyReceivedPermissions.2:
+        {"permission":"act","target":"0xdb216562328215E010F819B5aBe947bad4ca961e"}
      directlyReceivedPermissions.1:
+        {"permission":"act","target":"0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941"}
      directlyReceivedPermissions.0.target:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641"
    }
```

Generated with discovered.json: 0xb016dee600b5b0b34d789a434312cbd165d812af

# Diff at Thu, 17 Oct 2024 14:09:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b22da46ad96e1d0cb3e7d83e3293eb7b76990953 block: 256572673
- current block number: 264777898

## Description

Schedule an update to the address of the current OpenZeppelin signer in the Arbitrum SC.

## Watched changes

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.11:
-        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.10:
-        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
      values.getSecondCohort.5:
-        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+        "0x9316ca66f5f936E3239e4fD2AAAEA5C7b6f3C4cC"
      values.getSecondCohort.4:
-        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
      values.updateNonce:
-        6
+        7
    }
```

Generated with discovered.json: 0x1b2580f6912a3df8d492b1fa2643003a158ade4e

# Diff at Mon, 14 Oct 2024 10:58:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 256572673
- current block number: 256572673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 256572673 (main branch discovery), not current.

```diff
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    +++ description: None
      sourceHashes:
+        ["0x26f6b72513d780b4c7f3855e9b8c63f3ea90b9d15ce1cf38534887619daaa18b","0x7ab56232b17ce06beb4a64963bb9e8d0c7fdef3c45ab8f1ae306699d7b80c637"]
    }
```

```diff
    contract ConstitutionHash (0x1D62fFeB72e4c360CcBbacf7c965153b00260417) {
    +++ description: None
      sourceHashes:
+        ["0xbef9d19875be92a7955c003ae08cc03e029249d8fb5b882ad8ed916d36d87490"]
    }
```

```diff
    contract L2SurplusFee (0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d) {
    +++ description: None
      sourceHashes:
+        ["0xef8d56213b60d676b88afce25cb17bb89c7c3fc10c4ec06f77fe4820529e409b"]
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      issuedPermissions.0.via.0:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      sourceHashes:
+        ["0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d","0x34c1cd41f1d2a210cfb4daa6921fc003239f0565c9c678999dcca010df526f55"]
    }
```

```diff
    contract StandardArbERC20 (0x3f770Ac673856F105b586bb393d122721265aD46) {
    +++ description: None
      sourceHashes:
+        ["0xf98882c836bb8026b07fe0c6af0e5fc52578e78078c523fcd7974fb69b833732"]
    }
```

```diff
    contract BeaconProxyFactory (0x3fE38087A94903A9D946fa1915e1772fe611000f) {
    +++ description: None
      sourceHashes:
+        ["0x4522be863ce454f4a528c27299d26dc69d407f11e5807129aaff93f36b44dd53"]
    }
```

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract L2DAIGateway (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) {
    +++ description: None
      sourceHashes:
+        ["0x88d1226b13a00325eaaf0822116a64fc4a6a5dc3b56c15fc942a24a6be815715"]
    }
```

```diff
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    +++ description: None
      sourceHashes:
+        ["0x26f6b72513d780b4c7f3855e9b8c63f3ea90b9d15ce1cf38534887619daaa18b","0x6b2f9c454049196975edab9674208890663911ceebf0cf2c64d3c26a32aa300c"]
    }
```

```diff
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B) {
    +++ description: None
      sourceHashes:
+        ["0x26f6b72513d780b4c7f3855e9b8c63f3ea90b9d15ce1cf38534887619daaa18b","0xadf7f548448c8cfc2273cb5feeb31bcdd088e2d60e9be8756da94535ef5667d7"]
    }
```

```diff
    contract L2LPTGateway (0x6D2457a4ad276000A615295f7A80F79E48CcD318) {
    +++ description: None
      sourceHashes:
+        ["0xed35d20c6e0ab17ec40fb3266b83c36153ce768a59b7b850e22dad1c84eb93b0"]
    }
```

```diff
    contract UpgradeExecRouteBuilder (0x7481716f05E315Fc4C4a64E56DcD9bc1D6F24C0a) {
    +++ description: None
      sourceHashes:
+        ["0x4ed0927cf3d1bda79c1506ba72809f27e5eca436a34b45c47d5e1fa221a685b3"]
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      issuedPermissions.0.via.0:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      sourceHashes:
+        ["0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d","0x11ca3427c1f5954198dc46a75aefa2f2e29b40a4e18f78ecaac06fd242502431"]
    }
```

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      issuedPermissions.0.via.0:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      sourceHashes:
+        ["0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d","0x637d7a1e879804c928473dab6d06d80f9fd85ea5d889c3d5fac43411f6e59346"]
    }
```

```diff
    contract SecurityCouncilMemberSyncAction (0x9BF7b8884Fa381a45f8CB2525905fb36C996297a) {
    +++ description: None
      sourceHashes:
+        ["0x91e27e9c4588835bc07a823b2eebf255b0ad88bf9f7dc94bd0d785e53a8f24a7"]
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract L2BaseFee (0xbF5041Fc07E1c866D15c749156657B8eEd0fb649) {
    +++ description: None
      sourceHashes:
+        ["0xef8d56213b60d676b88afce25cb17bb89c7c3fc10c4ec06f77fe4820529e409b"]
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      issuedPermissions.0.via.0:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      sourceHashes:
+        ["0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d","0x34c1cd41f1d2a210cfb4daa6921fc003239f0565c9c678999dcca010df526f55"]
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      issuedPermissions.0.via.0:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      sourceHashes:
+        ["0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d","0xc6750fc78a712b7df53681fe94fecdda2f06e26d6bc08a7742dbbc68c48c040b"]
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      issuedPermissions.0.via.0:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      sourceHashes:
+        ["0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d","0x17d2fa21e1bf7dff5e335a08bb2b6b996e34c00b1175c3711875720dde509401"]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","target":"0x789fC99093B09aD01C34DC7251D0C89ce743e5a4","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","target":"0x912CE59144191C1204E64559FE8253a0e49E6548","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","target":"0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","target":"0xCaD7828a19b363A2B44717AFB1786B5196974D8E","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","target":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","target":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]},{"permission":"upgrade","target":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9","via":[{"address":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xdb216562328215E010F819B5aBe947bad4ca961e"}]
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      issuedPermissions.0.via.0:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      sourceHashes:
+        ["0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d","0xad301a24e9bb35dd5c200ced58fcd66b9b9b8bdeb182b6d4243fe3339c632072"]
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      sourceHashes:
+        ["0x579c6df39480618101e39d5b997df14c347d7f8a880df6cf0e1ae526771a0444"]
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"},{"permission":"upgrade","target":"0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"},{"permission":"upgrade","target":"0x912CE59144191C1204E64559FE8253a0e49E6548"},{"permission":"upgrade","target":"0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"},{"permission":"upgrade","target":"0xCaD7828a19b363A2B44717AFB1786B5196974D8E"},{"permission":"upgrade","target":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"permission":"upgrade","target":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"},{"permission":"upgrade","target":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0xae641c7d7a83bba7fa913b9544f946dc23ca0527c2f4abb9c6a3496f49375218"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"},{"permission":"upgrade","target":"0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"},{"permission":"upgrade","target":"0x912CE59144191C1204E64559FE8253a0e49E6548"},{"permission":"upgrade","target":"0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"},{"permission":"upgrade","target":"0xCaD7828a19b363A2B44717AFB1786B5196974D8E"},{"permission":"upgrade","target":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"},{"permission":"upgrade","target":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"},{"permission":"upgrade","target":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"}]
    }
```

```diff
    contract UpgradeableBeacon (0xE72ba9418b5f2Ce0A6a40501Fe77c6839Aa37333) {
    +++ description: None
      sourceHashes:
+        ["0xc8db6bf1c1522e439ab4b7d52970913a9d905bb60e32473199eb4ad572932bad"]
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdb216562328215E010F819B5aBe947bad4ca961e"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      issuedPermissions.0.via.0:
+        {"address":"0xdb216562328215E010F819B5aBe947bad4ca961e","delay":0}
      sourceHashes:
+        ["0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d","0x11ca3427c1f5954198dc46a75aefa2f2e29b40a4e18f78ecaac06fd242502431"]
    }
```

Generated with discovered.json: 0x4f769d07b3f083da0b73d0d54abbbf8598d4070e

# Diff at Tue, 01 Oct 2024 11:12:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 256572673
- current block number: 256572673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 256572673 (main branch discovery), not current.

```diff
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-06-26T14:01:05.000Z",["0x4bF6365278F340E759e7BB4732fE8B507784eAEB"]],["2021-08-26T16:19:50.000Z",["0x370ED500E9FEBC1ab05aC0A1617F8775aB80c48e"]],["2021-08-30T17:47:17.000Z",["0xEdE95739749BfA021134E41F520d784c99323D6B"]],["2022-08-08T17:33:55.000Z",["0x1DCf7D03574fbC7C205F41f2e116eE094a652e93"]]]
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-16T12:08:28.000Z",["0x41740588b86B4e0629b83A4e28786FF94361c3A3"]]]
    }
```

```diff
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-08-26T16:19:50.000Z",["0xb30751052797AdBDdbF4847045E51E65e48BAF9c"]],["2021-08-30T17:47:17.000Z",["0x176a9d89d235512Ad5CB4b6A0879D704D8315eF8"]],["2022-08-08T17:33:55.000Z",["0xe80eb0238029333e368e0bDDB7acDf1b9cb28278"]]]
    }
```

```diff
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-06-28T22:19:37.000Z",["0xb01dB0529B80B73a86ecD75Ae3559844319575E5"]],["2021-08-26T16:19:50.000Z",["0xc4940069140142236D4065b866018f7b2BeC77fD"]],["2021-08-30T17:48:09.000Z",["0x0db4f16c99B0aE9b00fc09bF69b36c7d73c45CBE"]],["2022-08-08T17:33:55.000Z",["0xB642058A41D414D9De3F36D14051623e557f1052"]],["2023-02-10T03:20:53.000Z",["0x806421D09cDb253aa9d128a658e60c0B95eFFA01"]]]
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-16T12:08:28.000Z",["0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9"]]]
    }
```

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-16T12:08:28.000Z",["0xC4ed0A9Ea70d5bCC69f748547650d32cC219D882"]]]
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-16T12:08:28.000Z",["0x41740588b86B4e0629b83A4e28786FF94361c3A3"]]]
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-16T12:07:15.000Z",["0x5D96786d3Eb13CAd05c9Fd7d0f7bb9560b4E5056"]]]
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-16T12:08:28.000Z",["0x7A013834D54e9B22d1978aAe3aaDDC909Aa79115"]]]
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-15T22:36:05.000Z",["0x468dA0eE5570Bdb1Dd81bFd925BAf028A93Dce64"]]]
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-03-16T12:08:28.000Z",["0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9"]]]
    }
```

Generated with discovered.json: 0x05d95882cf858d5d7268d1c3f342a3c9caa5f530

# Diff at Mon, 23 Sep 2024 16:30:22 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3382cfb14234950671011f2a61630973cab3e07 block: 247630663
- current block number: 256572673

## Description

Minor totalSupply decrease. (burn tx: https://app.blocksec.com/explorer/tx/arbitrum/0xd2d26f3463e636c2aff495aaebb86ca44d6f27a38bafbf5e105eb22c4a940b18?line=43)

## Watched changes

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: None
      values.totalSupply:
-        "9999999998999999999999999996"
+        "9999998977630224104158908096"
    }
```

Generated with discovered.json: 0xad35b43ba5ab6554cb7c6f83235c64a99450a340

# Diff at Fri, 30 Aug 2024 08:06:04 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 247630663
- current block number: 247630663

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 247630663 (main branch discovery), not current.

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
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

Generated with discovered.json: 0xe0961daf072f569383382d19ac00c9b63b917e29

# Diff at Wed, 28 Aug 2024 15:10:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0fa673a678e6e769a295956285789968836b97a6 block: 237006565
- current block number: 247630663

## Description

Added fee recipient discovery.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 237006565 (main branch discovery), not current.

```diff
    contract L2SurplusFee (0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d) {
    +++ description: None
+++ description: Lists recipients and weights using events, while the latest represents the current state.
      values.recipientsData:
+        [{"recipients":["0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"],"weights":[10000]}]
      fieldMeta:
+        {"recipientsData":{"description":"Lists recipients and weights using events, while the latest represents the current state."}}
    }
```

```diff
    contract L2BaseFee (0xbF5041Fc07E1c866D15c749156657B8eEd0fb649) {
    +++ description: None
+++ description: Lists recipients and weights using events, while the latest represents the current state.
      values.recipientsData:
+        [{"recipients":["0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"],"weights":[10000]}]
      fieldMeta:
+        {"recipientsData":{"description":"Lists recipients and weights using events, while the latest represents the current state."}}
    }
```

Generated with discovered.json: 0x2593dc87344416c0224f9e4f83098789f8a60514

# Diff at Fri, 23 Aug 2024 09:56:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 237006565
- current block number: 237006565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 237006565 (main branch discovery), not current.

```diff
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B) {
    +++ description: None
      values.$upgradeCount:
+        5
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x7694a0d33ccd1f671fb640ab79a9862c94f81c34

# Diff at Wed, 21 Aug 2024 10:07:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 237006565
- current block number: 237006565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 237006565 (main branch discovery), not current.

```diff
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86","via":[]}]
    }
```

```diff
    contract L2Timelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

```diff
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86","via":[]}]
    }
```

```diff
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd570aCE65C43af47101fC6250FD6fC63D1c22a86","via":[]}]
    }
```

```diff
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

```diff
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

```diff
    contract TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

```diff
    contract L2ARBGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

```diff
    contract L2UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x09e9222E96E7B4AE2a407B98d48e330053351EEe","0x5288c571Fd7aD117beA99bF60FE0846C4E84F933","0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x09e9222E96E7B4AE2a407B98d48e330053351EEe","via":[]},{"permission":"upgrade","target":"0x5288c571Fd7aD117beA99bF60FE0846C4E84F933","via":[]},{"permission":"upgrade","target":"0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B","via":[]}]
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","0x789fC99093B09aD01C34DC7251D0C89ce743e5a4","0x912CE59144191C1204E64559FE8253a0e49E6548","0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","0xCaD7828a19b363A2B44717AFB1786B5196974D8E","0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58","0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","via":[]},{"permission":"upgrade","target":"0x789fC99093B09aD01C34DC7251D0C89ce743e5a4","via":[]},{"permission":"upgrade","target":"0x912CE59144191C1204E64559FE8253a0e49E6548","via":[]},{"permission":"upgrade","target":"0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58","via":[]},{"permission":"upgrade","target":"0xCaD7828a19b363A2B44717AFB1786B5196974D8E","via":[]},{"permission":"upgrade","target":"0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","via":[]},{"permission":"upgrade","target":"0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","via":[]},{"permission":"upgrade","target":"0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9","via":[]}]
    }
```

```diff
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdb216562328215E010F819B5aBe947bad4ca961e","via":[]}]
    }
```

Generated with discovered.json: 0xb7357e80451bbfab38288cf126db77fec786c401

# Diff at Fri, 09 Aug 2024 12:03:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 237006565
- current block number: 237006565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 237006565 (main branch discovery), not current.

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
+        "0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
      assignedPermissions.upgrade.1:
-        "0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
+        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      assignedPermissions.upgrade.0:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      assignedPermissions.upgrade.7:
-        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
+        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      assignedPermissions.upgrade.6:
-        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
+        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
      assignedPermissions.upgrade.5:
-        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"
      assignedPermissions.upgrade.4:
-        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
+        "0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
      assignedPermissions.upgrade.3:
-        "0x912CE59144191C1204E64559FE8253a0e49E6548"
+        "0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827"
      assignedPermissions.upgrade.2:
-        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
+        "0x912CE59144191C1204E64559FE8253a0e49E6548"
      assignedPermissions.upgrade.1:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
+        "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4"
      assignedPermissions.upgrade.0:
-        "0xCaD7828a19b363A2B44717AFB1786B5196974D8E"
+        "0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0"
    }
```

Generated with discovered.json: 0x8ecbf1b2d9964197c9a5576742acfe0ad01f8b5e

# Diff at Fri, 09 Aug 2024 10:13:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 237006565
- current block number: 237006565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 237006565 (main branch discovery), not current.

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      values.$multisigThreshold:
-        "9 of 12 (75%)"
      values.getOwners:
-        ["0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x5a09A94eE8198D3c474d723337aa58023810022C","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]
      values.getThreshold:
-        9
      values.$members:
+        ["0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x5a09A94eE8198D3c474d723337aa58023810022C","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]
      values.$threshold:
+        9
      values.multisigThreshold:
+        "9 of 12 (75%)"
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      values.$multisigThreshold:
-        "9 of 12 (75%)"
      values.getOwners:
-        ["0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x5a09A94eE8198D3c474d723337aa58023810022C","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]
      values.getThreshold:
-        9
      values.$members:
+        ["0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75","0xA821c8c245d1F3A257e3B0DEC99268cA05144422","0x5a09A94eE8198D3c474d723337aa58023810022C","0x5DD2205C3aac13E592F0a3D85188c948D1781df1","0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3","0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed","0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF","0xb07dc9103328A51128bC6Cc1049d1137035f5E28","0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23","0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd","0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae","0x475816ca2a31D601B4e336f5c2418A67978aBf09"]
      values.$threshold:
+        9
      values.multisigThreshold:
+        "9 of 12 (75%)"
    }
```

```diff
    contract L2GatewaysProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x09e9222E96E7B4AE2a407B98d48e330053351EEe","0x5288c571Fd7aD117beA99bF60FE0846C4E84F933","0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"]
      assignedPermissions.upgrade:
+        ["0x5288c571Fd7aD117beA99bF60FE0846C4E84F933","0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B","0x09e9222E96E7B4AE2a407B98d48e330053351EEe"]
    }
```

```diff
    contract L2ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","0x789fC99093B09aD01C34DC7251D0C89ce743e5a4","0x912CE59144191C1204E64559FE8253a0e49E6548","0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","0xCaD7828a19b363A2B44717AFB1786B5196974D8E","0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC","0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58","0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"]
      assignedPermissions.upgrade:
+        ["0xCaD7828a19b363A2B44717AFB1786B5196974D8E","0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9","0x789fC99093B09aD01C34DC7251D0C89ce743e5a4","0x912CE59144191C1204E64559FE8253a0e49E6548","0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827","0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58","0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0","0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC"]
    }
```

Generated with discovered.json: 0x1da008086226212b4461f46ca255667ebc909b04

# Diff at Tue, 30 Jul 2024 11:17:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 237006565
- current block number: 237006565

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 237006565 (main branch discovery), not current.

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
      fieldMeta:
+        {"getBothCohorts":{"severity":"MEDIUM","description":"All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)"}}
    }
```

Generated with discovered.json: 0xc72cf5f2281dbc063920bfc56809ba4a2c51b665

# Diff at Sun, 28 Jul 2024 17:31:45 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@04dc4c7d175d5f4d1388774094bdb962fe7b7423 block: 235552250
- current block number: 237006565

## Description

1) SecurityCouncil signer rotation completed
2) Changed timelock name in conf to be consistent with the new diagram

## Watched changes

```diff
    contract L2SecurityCouncilEmergency (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      values.getOwners.3:
-        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
      values.getOwners.2:
-        "0xB3b60932E598fe946169EC209A197184Bad760B7"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
      values.getOwners.1:
-        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
+        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
      values.getOwners.0:
-        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
    }
```

```diff
    contract L2SecurityCouncilPropose (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      values.getOwners.3:
-        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
      values.getOwners.2:
-        "0xB3b60932E598fe946169EC209A197184Bad760B7"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
      values.getOwners.1:
-        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
+        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
      values.getOwners.0:
-        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 235552250 (main branch discovery), not current.

```diff
    contract L2CoreTimelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    +++ description: None
      name:
-        "L2CoreTimelock"
+        "L2Timelock"
    }
```

```diff
    contract L2TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    +++ description: None
      name:
-        "L2TreasuryTimelock"
+        "TreasuryTimelock"
    }
```

Generated with discovered.json: 0xefe337070da8927bb9e6b78750ba44724e7ebcf8

# Diff at Wed, 24 Jul 2024 12:09:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f8d5c0ccc8d74a077f85a8dca4038e175812c389 block: 233533906
- current block number: 235552250

## Description

Add L2 contracts to discovery config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 233533906 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract L2CustomGateway (0x096760F208390250649E3e8763348E783AEF5562)
    +++ description: None
```

```diff
    contract SC9 (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      name:
-        "SC9"
+        "L2SecurityCouncilEmergency"
    }
```

```diff
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      name:
-        "SC7"
+        "L2SecurityCouncilPropose"
    }
```

```diff
    contract L2ReverseCustomGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    +++ description: None
      name:
-        "L2ReverseCustomGateway"
+        "L2ARBGateway"
    }
```

```diff
    contract UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    +++ description: None
      name:
-        "UpgradeExecutor"
+        "L2UpgradeExecutor"
    }
```

```diff
    contract ProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    +++ description: None
      name:
-        "ProxyAdmin"
+        "L2GatewaysProxyAdmin"
      assignedPermissions.admin.2:
-        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
+        "0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B"
      assignedPermissions.admin.1:
-        "0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
+        "0x5288c571Fd7aD117beA99bF60FE0846C4E84F933"
      assignedPermissions.admin.0:
-        "0x096760F208390250649E3e8763348E783AEF5562"
+        "0x09e9222E96E7B4AE2a407B98d48e330053351EEe"
    }
```

```diff
    contract ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    +++ description: None
      name:
-        "ProxyAdmin"
+        "L2ProxyAdmin"
      assignedPermissions.admin.8:
-        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      assignedPermissions.admin.7:
-        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
+        "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
      assignedPermissions.admin.6:
-        "0xF3FC178157fb3c87548bAA86F9d24BA38E649B58"
+        "0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58"
    }
```

```diff
-   Status: DELETED
    contract FixedDelegateErc20Wallet (0xF3FC178157fb3c87548bAA86F9d24BA38E649B58)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConstitutionHash (0x1D62fFeB72e4c360CcBbacf7c965153b00260417)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2SurplusFee (0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2DAIGateway (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2WethGateway (0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2LPTGateway (0x6D2457a4ad276000A615295f7A80F79E48CcD318)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2BaseFee (0xbF5041Fc07E1c866D15c749156657B8eEd0fb649)
    +++ description: None
```

Generated with discovered.json: 0x88694b18fb31b6808b8357614cdfb72568db8723

# Diff at Tue, 16 Jul 2024 07:37:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4cebc868d0be9a9868d2842c2670f1974594c48e block: 225188961
- current block number: 232735844

## Description

Four signers from the SC rotated their keys as planned. [ref](https://forum.arbitrum.foundation/t/non-emergency-actions-to-facilitate-key-rotation-of-security-council-june-2024/25140)

## Watched changes

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.11:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.10:
-        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
+        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.8:
-        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.7:
-        "0xB3b60932E598fe946169EC209A197184Bad760B7"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.6:
-        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getSecondCohort.5:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75"
      values.getSecondCohort.4:
-        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
+        "0xA821c8c245d1F3A257e3B0DEC99268cA05144422"
      values.getSecondCohort.2:
-        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
+        "0x5a09A94eE8198D3c474d723337aa58023810022C"
      values.getSecondCohort.1:
-        "0xB3b60932E598fe946169EC209A197184Bad760B7"
+        "0x5DD2205C3aac13E592F0a3D85188c948D1781df1"
      values.getSecondCohort.0:
-        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.updateNonce:
-        2
+        6
    }
```

Generated with discovered.json: 0x58ed1c3ec6e1eff2baa268268be3987fd746e7dc

# Diff at Mon, 24 Jun 2024 10:18:00 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b54e27671cccd831f2f6414fffe3bd374840c6b7 block: 213445891
- current block number: 225188961

## Description

Scheduled SC threshold increase is executed.

## Watched changes

```diff
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      upgradeability.threshold:
-        "7 of 12 (58%)"
+        "9 of 12 (75%)"
      values.getThreshold:
-        7
+        9
    }
```

Generated with discovered.json: 0xedcb031a30b4bdc43edf5e8acb9624b656a40898

# Diff at Tue, 21 May 2024 06:31:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@fb4c64221d00d53ed6ec1609ef10dc99f1842087 block: 208388457
- current block number: 213445891

## Description

Execution of the biannual security council elections referenced in the last update.

## Watched changes

```diff
    contract SC9 (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      values.getOwners.10:
-        "0xf6B6F07862A02C85628B3A9688beae07fEA9C863"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getOwners.9:
-        "0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.8:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.7:
-        "0x5280406912EB8Ec677Df66C326BE48f938DC2e44"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.6:
-        "0x566a07C3c932aE6AF74d77c29e5c30D8B1853710"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.5:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.4:
-        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.getOwners.3:
-        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
+        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
      values.getOwners.2:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0xB3b60932E598fe946169EC209A197184Bad760B7"
      values.getOwners.1:
-        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
+        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
      values.getOwners.0:
-        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
+        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
    }
```

```diff
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      values.getOwners.10:
-        "0xf6B6F07862A02C85628B3A9688beae07fEA9C863"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getOwners.9:
-        "0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.8:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.7:
-        "0x5280406912EB8Ec677Df66C326BE48f938DC2e44"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.6:
-        "0x566a07C3c932aE6AF74d77c29e5c30D8B1853710"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.5:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.4:
-        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.getOwners.3:
-        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
+        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
      values.getOwners.2:
-        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
+        "0xB3b60932E598fe946169EC209A197184Bad760B7"
      values.getOwners.1:
-        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
+        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
      values.getOwners.0:
-        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
+        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
    }
```

Generated with discovered.json: 0xe5a979cc7f1e23c4acc6a3510dc4a992f0ff176a

# Diff at Mon, 06 May 2024 09:22:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@22b41765601210ab9db53f4371a852edbfa067ea block: 195078255
- current block number: 208388457

## Description

The biannual security council elections are executed with a familiar figure (`0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae`) having been re-elected.

## Watched changes

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.11:
-        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.10:
-        "0xf6B6F07862A02C85628B3A9688beae07fEA9C863"
+        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.9:
-        "0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF"
+        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.8:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.7:
-        "0x5280406912EB8Ec677Df66C326BE48f938DC2e44"
+        "0xB3b60932E598fe946169EC209A197184Bad760B7"
+++ description: All 12 addresses of the 2 cohorts of the SecurityCouncil (2x6)
+++ severity: MEDIUM
      values.getBothCohorts.6:
-        "0x566a07C3c932aE6AF74d77c29e5c30D8B1853710"
+        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
      values.getSecondCohort.5:
-        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
+        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
      values.getSecondCohort.4:
-        "0xf6B6F07862A02C85628B3A9688beae07fEA9C863"
+        "0xa0683d725420e2F75415806352Cd9c3fE10Fa960"
      values.getSecondCohort.3:
-        "0x5A1FD562271aAC2Dadb51BAAb7760b949D9D81dF"
+        "0x475816ca2a31D601B4e336f5c2418A67978aBf09"
      values.getSecondCohort.2:
-        "0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae"
+        "0xee7Fb91D5b776C326a728dc70e917F82d6809E3C"
      values.getSecondCohort.1:
-        "0x5280406912EB8Ec677Df66C326BE48f938DC2e44"
+        "0xB3b60932E598fe946169EC209A197184Bad760B7"
      values.getSecondCohort.0:
-        "0x566a07C3c932aE6AF74d77c29e5c30D8B1853710"
+        "0xe40D80Bd58CEE55DCC2598724d7F1e03E206581D"
      values.updateNonce:
-        1
+        2
    }
```

Generated with discovered.json: 0x719eea4074a6b7d15e0c5fa005f4a80d040398ef

# Diff at Thu, 28 Mar 2024 11:36:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 189651036
- current block number: 195078255

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 189651036 (main branch discovery), not current.

```diff
    contract SC9 (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      upgradeability.threshold:
+        "9 of 12 (75%)"
    }
```

```diff
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      upgradeability.threshold:
+        "7 of 12 (58%)"
    }
```

Generated with discovered.json: 0x6cd94aaadac1762751f4e95ba2a134f51e1b436b

# Diff at Tue, 12 Mar 2024 14:47:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@28a94a6f03cba215bffdba08f227fba4f8d9ef95 block: 132779316
- current block number: 189651036

## Description

The security council is swapped for two new cohorts.
Context: First Arbitrum security council elections in september 2023.

## Watched changes

```diff
    contract SC9 (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    +++ description: None
      values.getOwners.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.3:
-        "0x8688515028955734350067695939423222009623"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.1:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
    }
```

```diff
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    +++ description: None
      values.getOwners.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.3:
-        "0x8688515028955734350067695939423222009623"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.1:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.nonce:
-        2
+        4
    }
```

```diff
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    +++ description: None
      values.getBothCohorts.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.getBothCohorts.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getBothCohorts.3:
-        "0x8688515028955734350067695939423222009623"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getBothCohorts.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getBothCohorts.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getFirstCohort.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
      values.getFirstCohort.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getFirstCohort.3:
-        "0x8688515028955734350067695939423222009623"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getFirstCohort.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getFirstCohort.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.updateNonce:
-        0
+        1
    }
```

Generated with discovered.json: 0x527a540ef29193002240152e1304597d1758aa55

# Diff at Wed, 20 Sep 2023 09:16:00 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@

## Watched changes

```diff
+   Status: CREATED
    contract L2CustomGateway (0x096760F208390250649E3e8763348E783AEF5562) {
    }
```

```diff
+   Status: CREATED
    contract L2ERC20Gateway (0x09e9222E96E7B4AE2a407B98d48e330053351EEe) {
    }
```

```diff
+   Status: CREATED
    contract L2CoreTimelock (0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0) {
    }
```

```diff
+   Status: CREATED
    contract StandardArbERC20 (0x3f770Ac673856F105b586bb393d122721265aD46) {
    }
```

```diff
+   Status: CREATED
    contract BeaconProxyFactory (0x3fE38087A94903A9D946fa1915e1772fe611000f) {
    }
```

```diff
+   Status: CREATED
    contract SC9 (0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641) {
    }
```

```diff
+   Status: CREATED
    contract L2GatewayRouter (0x5288c571Fd7aD117beA99bF60FE0846C4E84F933) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecRouteBuilder (0x7481716f05E315Fc4C4a64E56DcD9bc1D6F24C0a) {
    }
```

```diff
+   Status: CREATED
    contract TreasuryGovernor (0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) {
    }
```

```diff
+   Status: CREATED
    contract L2ArbitrumToken (0x912CE59144191C1204E64559FE8253a0e49E6548) {
    }
```

```diff
+   Status: CREATED
    contract SecurityCouncilMemberSyncAction (0x9BF7b8884Fa381a45f8CB2525905fb36C996297a) {
    }
```

```diff
+   Status: CREATED
    contract SC7 (0xADd68bCb0f66878aB9D37a447C7b9067C5dfa941) {
    }
```

```diff
+   Status: CREATED
    contract L2TreasuryTimelock (0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58) {
    }
```

```diff
+   Status: CREATED
    contract L2ReverseCustomGateway (0xCaD7828a19b363A2B44717AFB1786B5196974D8E) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827) {
    }
```

```diff
+   Status: CREATED
    contract SecurityCouncilManager (0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd570aCE65C43af47101fC6250FD6fC63D1c22a86) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xdb216562328215E010F819B5aBe947bad4ca961e) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (0xE72ba9418b5f2Ce0A6a40501Fe77c6839Aa37333) {
    }
```

```diff
+   Status: CREATED
    contract CoreGovernor (0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) {
    }
```

```diff
+   Status: CREATED
    contract FixedDelegateErc20Wallet (0xF3FC178157fb3c87548bAA86F9d24BA38E649B58) {
    }
```
