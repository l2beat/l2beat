---
title: "Governance Review #93"
description: "From Hacks to Tracks, Governance Reacts."
publishedOn: "2026-04-29"
authorId: manuel-gonzalez
---

## **TL;DR**

*In* ***Optimism***, *governance is entering a new Security Council election cycle, with a structured nomination and approval process that continues to emphasize delegate participation and operational responsibility.*

*In* ***Arbitrum***, *the focus is on crisis management and infrastructure transitions. Following the rsETH exploit, the DAO is deciding whether to deploy frozen funds toward recovery, while also replacing core governance tooling after Tally’s shutdown and expanding transparency through new analytics dashboards.*

***Elsewhere***, *ecosystems are pushing forward on both protocol upgrades and governance experimentation. ZKsync is advancing interoperability with a major v31 upgrade, Starknet continues building out its BTCFi strategy, and Scroll is testing new coordination formats to improve proposal quality. At the same time, Uniswap is simplifying governance as participation matures, while Polygon prepares to sunset zkEVM Mainnet Beta, requiring users to actively migrate funds.*


---


## **Active votes**

**Arbitrum**



* [Transfer 6,000 ETH and Idle Stablecoins from the Treasury to the Treasury Management Portfolio](https://www.tally.xyz/gov/arbitrum/proposal/86654545843645364200491220873325841239317939837732580673532485559601859962180?govId=eip155:42161:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) - ends on May 7 at 16:27 UTC. 

**ZKsync**



* [[ZIP-15] Update ZKsync Security Council Parameters](https://www.tally.xyz/gov/zksync/proposal/38457812855457311077054202023053780960745243426690711582482794483162556902949?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f) - ends on April 30 at 17:21 UTC.


---


## **Optimism**


### **Season 9: Security Council Cohort B Elections**

Optimism [published](https://gov.optimism.io/t/season-9-security-council-cohort-b-elections/10656) an announcement that outlines the start of the Season 9 Security Council Cohort B election process, kicking off a new cycle to select members responsible for key protocol operations.

Candidates can self-nominate through OP Atlas until May 4, after which they must secure at least 8 approvals from top delegates to move forward. The election will run from May 7 to May 13 using approval voting, allowing delegates to support multiple candidates. Selected members will serve 12-month terms starting August 9 and will be responsible for executing governance-approved upgrades, managing keys, and coordinating during emergency situations. The process also includes eligibility screening, with a focus on reputation, technical expertise, and the avoidance of conflicts of interest.


---

## **Arbitrum**


### **Security Council Emergency Action – 21/04/2026**

Arbitrum [published](https://forum.arbitrum.foundation/t/security-council-emergency-action-21-04-2026/30803) an update outlining an emergency action taken by the Security Council to freeze funds linked to the KelpDAO exploit.

A total of ~30.7K ETH was frozen on Arbitrum One and moved to a designated holding address, preventing further movement of the exploiter’s funds. The action required a temporary contract upgrade and will require a follow-up governance decision to determine how and when the funds can be released.


### **AIP: Approve Release of Frozen ETH**

Aave Labs [created](https://forum.arbitrum.foundation/t/constitutional-aip-approve-release-of-frozen-eth/30825) a proposal that outlines the release of ~30.7K ETH previously frozen by the Arbitrum Security Council as part of the rsETH exploit response.

The proposal suggests transferring the funds to a coordinated recovery effort involving multiple ecosystem participants, with the goal of restoring rsETH’s backing and reducing losses across DeFi. As a Constitutional AIP, the final decision will be made through governance, determining whether the funds remain frozen or are deployed toward remediation.

**L2BEAT’s take:**

*Using the frozen funds to reduce the damage from the exploit feels like the most reasonable move. Letting them sit there while users and protocols take the hit doesn’t make much sense, especially when there’s a clear way to improve the situation.*

*At the same time, this isn’t a neutral situation. The funds were frozen by Arbitrum’s Security Council, so the DAO is already involved, whether it wants to be or not. Once that step is taken, choosing not to act further is also a decision.*

*This is also something new for Arbitrum. If governance steps in here, it naturally raises the question of how similar situations will be handled in the future. Why this case and not others is something the DAO will likely need to think through more carefully going forward.*

*On the execution side, the proposal relies on a coordinated recovery effort across multiple parties, but the exact mechanics of how funds will be distributed, prioritized, and verified are not fully defined at this stage. This introduces some reliance on off-chain coordination and decision-making, which makes transparency around the process and clear reporting on outcomes especially important.*


### **End of Arbitrum Support on Tally**

Dennison from Tally [shared](https://forum.arbitrum.foundation/t/end-of-arbitrum-support-on-tally/30801) an update outlining the end of support for Arbitrum as the platform winds down operations.

Support will continue only until the current Security Council election cycle concludes, after which Arbitrum will no longer be supported on Tally. The Arbitrum Foundation has opted not to license the software and is instead developing its own governance interface, marking a transition away from the existing tooling.


### **Arbitrum Launches New Governance UI After Tally Shutdown**

Arbitrum [shared](https://forum.arbitrum.foundation/t/governance-ui-update/30837) an update that outlines the launch of a new governance UI following Tally’s shutdown.

The interface, developed in collaboration with Offchain Labs, already supports voting and Security Council elections, with additional features like delegation and proposal creation planned. In parallel, the Foundation is also working with Snapshot to integrate Arbitrum’s Governor contracts into its UI, creating a backup interface and adding redundancy to the DAO’s governance infrastructure.


### **SEEDGov Stepdown processes**

SEEDGov [shared](https://forum.arbitrum.foundation/t/seedgov-delegate-communication-thread/28243/2?u=manugotsuka) an update that outlines its decision to step down from several formal roles within the Arbitrum ecosystem following an internal restructuring.

The team will transition responsibilities across programs such as Watchdog, RAD, Stylus Sprint, and the D.A.O. Grant Program to existing contributors already involved in those initiatives. While stepping away from service provider and committee roles, SEEDGov confirmed that it will continue to participate in governance as a delegate.


### **Watchdog Program Update**

Entropy [published](https://forum.arbitrum.foundation/t/watchdog-program-april-20th-update-scope-boundary-opco-transition-and-kyc-deadline/30800) an update that outlines changes to the Watchdog Program following its retrospective, focusing on narrowing scope, transitioning operations, and formalizing processes.

The update introduces a time-based boundary, limiting future investigations to programs launched after January 1, 2025, effectively closing the chapter on legacy incentive programs. It also begins the program's gradual transition to OpCo while adding a three-month KYC deadline for bounty recipients. Overall, the changes aim to reduce operational overhead and refocus the program on more actionable and recent cases.


### **ATM Council Update**

Entropy [shared](https://forum.arbitrum.foundation/t/atm-council-updates/29627/18?u=manugotsuka) updates outlining both a recent exploit affecting rsETH and the latest treasury performance for Arbitrum DAO.

The rsETH incident, caused by a LayerZero message exploit, resulted in ~116.5K unbacked tokens entering circulation, creating a ~17.5% shortfall across the system. While Arbitrum DeFi protocols were exposed, the DAO treasury and TM portfolio avoided losses through proactive risk management. In parallel, Entropy published its [Q1 2026](https://forum.arbitrum.foundation/t/atm-council-updates/29627/19?u=manugotsuka) treasury report, providing a detailed overview of the DAO's portfolio performance, allocations, and overall financial positioning.


### **arbdata Expands with New Governance Insights**

Entropy shared an update that outlines new governance analytics features added to arbdata.com. The platform now includes tracking for onchain proposals and Security Council elections, giving users access to Arbitrum’s governance history, including voting data, participation rates, delegated voting power, and funding allocations, with the goal of making DAO activity more transparent and easier to analyze.


---


## **ZKsync**


### **ZKsync Proposes v31 Upgrade with Native Interoperability Features**

0xValera [created a proposal](https://forum.zknation.io/t/zip-16-v31-interop-bundles-upgrade/979) that outlines the v31 protocol upgrade for ZKsync, introducing major improvements around interoperability and network design.

The upgrade adds a new system for cross-chain interactions using “calls and bundles,” enabling native token transfers and communication between ZKsync chains connected through its gateway. It also introduces a “Priority Mode” for certain chains to improve censorship resistance, along with broader compatibility updates for ZKsync OS. Overall, the proposal marks a significant step toward a more interconnected and flexible ZKsync ecosystem.


---


## **Starknet**


### **SNIP 39 - strkBTC as a Stakable Token on Starknet**

Robert Kodra and Natan Granit [created](https://community.starknet.io/t/snip-39-strkbtc-as-a-stakable-token-on-starknet/116180?_gl=1*g366kc*_up*MQ..*_ga*NTA4NDgzODY0LjE3NzcyOTgyMTU.*_ga_WY42TERK5P*czE3NzcyOTgyMTQkbzEkZzAkdDE3NzcyOTgyMTQkajYwJGwwJGgw) a proposal that outlines the addition of strkBTC as an eligible BTC wrapper for staking on Starknet.

The proposal builds on previously approved frameworks (SNIP-31 and SNIP-38) and focuses on enabling strkBTC to be used in Starknet’s Bitcoin staking system. If approved, strkBTC would join the list of supported wrappers, enabling holders to delegate it to validators and earn staking rewards. The design follows a structured onboarding process in which governance approval is required before the Monetary Committee can activate the wrapper on-chain, maintaining consistency with Starknet’s broader BTCFi roadmap.


### **SNIP 38 - strkBTC: Bitcoin on Starknet**

Henri Lieutaud [created](https://community.starknet.io/t/snip-38-strkbtc-bitcoin-on-starknet/116174?_gl=1*1r8licl*_up*MQ..*_ga*MTY2NTk4MDI4LjE3NzczMDEzMzI.*_ga_WY42TERK5P*czE3NzczMDEzMzIkbzEkZzAkdDE3NzczMDEzMzIkajYwJGwwJGgw) a proposal that outlines the introduction of strkBTC, a Bitcoin wrapper designed to bring BTC into Starknet’s DeFi ecosystem.

The proposal describes a federated multisig model in its initial phase, where a group of independent institutions manages BTC deposits and withdrawals, with a roadmap to move toward more trust-minimized designs over time. strkBTC is intended to enable use cases such as trading, lending, and staking, serving as a core building block for Starknet’s broader BTCFi strategy.



---
## **Uniswap**


### **[RFC] - Return 12.5M Delegated Tokens to the Governance Timelock**

Eek637 [created](https://gov.uniswap.org/t/rfc-return-12-5m-delegated-tokens-to-the-governance-timelock/26099) a proposal outlining the return of 12.5M UNI previously delegated through the Franchiser system to the Governance Timelock.

The delegation was originally implemented to bootstrap participation during periods of low governance activity, but the proposal argues that this is no longer necessary given the current level of engagement. With higher voter turnout and a more distributed delegate set, undelegating these tokens aims to remove potential misalignment between voting power and economic exposure, reflecting a shift toward a more organic governance structure.


---


## **Polygon**


### **Polygon zkEVM Mainnet Beta Sunset: Claim Your Funds**

Parvez03 from Polygon Labs [shared](https://forum.polygon.technology/t/polygon-zkevm-mainnet-beta-sunset-claim-your-funds/21856) an announcement that outlines the upcoming sunset of the Polygon zkEVM Mainnet Beta sequencer on July 1, 2026.

Users are encouraged to migrate their funds before the deadline, as only wallet-held assets will be automatically bridged to Ethereum and later claimable. Funds locked in DeFi protocols will not be recoverable unless users or teams take action beforehand, making early withdrawal and migration critical ahead of the shutdown.


---


## **Scroll**


### **Scroll Proposes “Signal Sessions” to Turn Research into Proposals**

Axia, coffee-crusher, and alexsotodigital [created](https://forum.scroll.io/t/scroll-signal-sessions-pilot/1472) a proposal that outlines Scroll Signal Sessions, a lightweight pilot designed to turn insights from the DCP “State of Scroll” research into more actionable governance proposals.

The initiative introduces small, structured working sessions where contributors present early ideas and refine them with delegates and stakeholders before entering formal governance. Acting as a pre-proposal step, it aims to improve proposal quality, reduce noise for delegates, and create a clearer path from ecosystem insights to execution, with the pilot expected to run for around 6–7 weeks.


---


## **Quiet Corner**

Some ecosystems saw no meaningful governance developments this week.



* **Everclear**
* **Hop**
* **Lisk**
* **Wormhole**

As always, if we missed something important, feel free to reach out. We’re happy to dig deeper.


---


## **Upcoming Events**

**Arbitrum**



* [OpCo Operations - Office Hours](https://meet.google.com/smt-yobq-oww) - on 28.04 at 15:30 UTC.
* [Open Discussion of Proposals Governance Call](https://meet.google.com/smt-yobq-oww) - on 28.04 at 16:00 UTC.
* [OpCo Monthly Update](https://meet.google.com/ety-prua-iei) - on 01.05 at 14:00 UTC.

**Scroll**



* [Weekly DAO & Governance Call](https://meet.google.com/fut-dgwp-tcn) - on 29.04 at 14:00 UTC.
* [Scroll DAO Office Hours](https://meet.google.com/dcv-rodm-dfd) - on 01.05 at 14:00 UTC.

**ZKsync**



* [Standing ZKsync Proposal Review Call](https://meet.google.com/qvr-txgr-vja) - on 29.04 at 15:30 UTC.

**Hop**



* [Hop Community Call](https://discord.com/channels/789310208413270078) - on 29.04 at 17:00 UTC.

**Uniswap**



* [DEF Community Call](https://meet.google.com/kjb-tgss-skw) - on 28.04 at 17:00 UTC.


---


## **Discuss with L2BEAT**

Join us every Friday at 3 pm UTC for our weekly [Governance Office Hours](https://meet.google.com/twm-jafw-esn) to discuss proposals, ecosystem direction, and high-level governance strategy.
