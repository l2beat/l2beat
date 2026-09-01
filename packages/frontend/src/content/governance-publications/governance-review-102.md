---
title: "Governance Review #102"
description: "Handoffs, Housekeeping, and Hooks."
publishedOn: "2026-07-27"
authorId: manuel-gonzalez
---

## **TL;DR**

*In* ***Optimism***, *governance focused on operational maintenance. Two proposals would transfer administrative ownership of the winding-down Swell chain to AltLayer and complete Ink Mainnet's migration to OP Enterprise through configuration updates and proposer rotation.*

*In* ***Arbitrum***, *OpCo published the first update on the AGV wind-down, returning more than 129M ARB and 7M USDC to the DAO. Meanwhile, the Security Council initiated a non-emergency action to correct the protocol's recorded Delegated Voting Power without affecting individual delegates.*

***Elsewhere***, *Uniswap began discussing an RFC that would introduce an optional "Swap Privately" feature through v4 Hooks or UniswapX, seeking community feedback before moving to a formal governance proposal.*



---
## **Active Votes**

**Optimism: 2 active vote**



* [Maintenance Upgrade Proposal: Ink Mainnet Fee Vault Config Update and Proposer Rotation](https://vote.optimism.io/proposals/98596515698156453044551125843803184999481750957062514239597457651661195220288) - ends on July 28 at 17:44 UTC.
* [Maintenance Upgrade Proposal: Swell Ownership Transfer to AltLayer](https://vote.optimism.io/proposals/55157120062626112833592164692393784963640643805353175342472662837980214398880) - ends on July 28 at 17:44 UTC.

**Arbitrum: 1 active vote**



* [ArbOS61 Elara Upgrade](https://alt.gov.arbitrum.foundation/proposal/7191014407719621170610709569285477750369874509305441081488686529382763374426?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) - ends on July 30 at 00:00 UTC.


---
## **Arbitrum**


### AGV Windown Process Updates

Following the approval of the AGV wind-down proposal earlier this month, Arbitrum's OpCo has [published](https://forum.arbitrum.foundation/t/agv-windown-process-updates/31084) its first progress update on the transition process. The team is coordinating with the AGV to transfer operational and financial responsibilities while returning the remaining assets to the DAO in line with the governance-approved plan.

As part of the process, 86.18M ARB held by the Arbitrum Foundation on behalf of the AGV and an additional 42.99M ARB coordinated by OpCo have been returned to the DAO treasury. OpCo also coordinated the transfer of 7M USDC to the ATMC portfolio, following the DAO's previously approved treasury management framework. Further updates will be shared as the wind-down progresses.


### Non-Emergency Security Action to Correct Total DVP

Arbitrum's Security Council [has initiated](https://forum.arbitrum.foundation/t/non-emergency-security-action-to-correct-total-dvp/31094) a non-emergency action to correct the total Delegated Voting Power (DVP) recorded by the ARB token contract. The adjustment addresses a discrepancy introduced when the DVP quorum system was activated, reducing the recorded total by approximately 51.17 million ARB to match the reconstructed delegation data.

The correction only affects the aggregate DVP value used for governance calculations and does not change users' ARB balances or the voting power delegated to individual delegates. Once completed, the update will also ensure that ARB delegated to the designated exclusion address is no longer counted in the total DVP calculation. The non-emergency execution process is expected to take approximately 14 days.


---
## **Optimism**


### Maintenance Upgrade: Swell Ownership Transfer to AltLayer

Optimism [has published](https://gov.optimism.io/t/maintenance-upgrade-swell-ownership-transfer-to-altlayer/10773) a maintenance upgrade proposal to transfer administrative ownership of the Swell chain from the Optimism-governed ProxyAdmin to AltLayer, the chain operator responsible for completing Swell's wind-down. The proposal would transfer ownership of both the L1 ProxyAdmin and the corresponding L2 ProxyAdmin owner, allowing AltLayer to independently manage the remaining shutdown process.

The proposal is administrative in nature and does not introduce protocol upgrades, parameter changes, or modifications affecting other OP Stack chains. If approved and not vetoed during the standard review period, the Optimism Security Council will execute the ownership transfer, formally handing control of Swell's infrastructure to AltLayer.


### Maintenance Upgrade Proposal: Ink Mainnet Fee Vault Config Update and Proposer Rotation

Optimism [has published](https://gov.optimism.io/t/maintenance-upgrade-proposal-ink-mainnet-fee-vault-config-update-and-proposer-rotation/10776) a maintenance upgrade proposal to complete the operational migration of Ink Mainnet from Gelato to OP Enterprise, the Optimism Foundation's chain servicing platform. While the migration itself does not require governance approval, the proposal requests authorization to update Ink's fee vault configuration and rotate the proposer for its dormant permissioned dispute game to reflect the new operator.

The proposal does not modify protocol behavior, bridge security, or dispute resolution for end users. Instead, it updates administrative configuration by redirecting certain operational fee flows to a new L1 cost recipient and replacing Gelato's proposer key with an OP Enterprise key on the fallback dispute game. If approved, the changes will be executed following the standard veto period as part of Ink's operator transition.



---
## **Uniswap**


### [RFC] Native Execution Privacy in the Uniswap Interface via v4 Hooks and UniswapX

The SilentSwap Core Development Team [has published](https://gov.uniswap.org/t/rfc-native-execution-privacy-in-the-uniswap-interface-via-v4-hooks-and-uniswapx/26208) an RFC proposing an optional "Swap Privately" feature in the Uniswap interface, allowing users to execute privacy-enhanced swaps through SilentSwap's infrastructure while continuing to use Uniswap liquidity. The proposal explores integrating the feature through Uniswap v4 Hooks or UniswapX, with privacy remaining entirely opt-in and without modifying Uniswap's core contracts, fee structure, or default swap experience.

The RFC does not request treasury funding or immediate implementation. Instead, it seeks community feedback on whether execution privacy should become a native interface feature and which technical approach should be prioritized for a proof of concept. If the community expresses support, the proposal would proceed through technical review, a publicly funded proof of concept, security audits, and the standard Uniswap governance process before any deployment is considered.



---
## **Quiet Corner**

Some ecosystems saw no meaningful governance developments this week.



* **Everclear**
* **Hop**
* **Lisk**
* **Scroll**
* **Wormhole**
* **Starknet**
* **Polygon**
* **ZKsync**

As always, if we missed something important, feel free to reach out. We’re happy to dig deeper.


---

## **Upcoming Events**

**Arbitrum**



* [Open Discussion of Proposals Governance Call](https://meet.google.com/yoz-qmrx-hdk) - on 28.07 at 16:00 UTC.

**Uniswap**



* [DEF Community Call](https://meet.google.com/kjb-tgss-skw) - on 28.07 at 17:00 UTC.


---

**Discuss with L2BEAT**

Join us every Friday at 3 pm UTC for our weekly [Governance Office Hours](https://meet.google.com/twm-jafw-esn) to discuss proposals, ecosystem direction, and high-level governance strategy.
