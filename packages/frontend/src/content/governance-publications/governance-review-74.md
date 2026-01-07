---
title: "Governance Review #74"
description: "Optimism grants advance, Arbitrum debates incentives and treasury policy, ZKsync accelerates activation; the rest keep shipping."
publishedOn: "2025-10-28"
authorId: manuel-gonzalez
---

## **TL;DR**

*Arbitrum DIP 2.0 is up for vote; L2BEAT voted against Triple DIP and DIP 2.0, asking for a simpler, impact-first design. Entropy’s draft IPS sets clear benchmarks and rules-based rebalancing.*

*Optimism Cycle 43: 8 approvals, 17 in review, 15 declined; 2M OP granted; remaining Season 8 budget 3.14M OP.*

*ZKsync Prividium prizes are first-come for the first 10 valid entries; active votes run through Oct 29–31.*

*Elsewhere, Polygon reports strong Q3 deal flow; Starknet v0.14.1 slated Nov 11/25; Everclear runs Security Council votes and budgets; Scroll eyes extending the 500k SCR auto-abstain wallet.*


## **Optimism**


### **Cycle 43 Grants Council Report**

Gonna has [posted](https://gov.optimism.io/t/cycle-43-grants-council-report/10363) a cycle 43 report showing that eight applications were approved, 17 moved to review, and 15 declined. Curve Lending’s approval from the prior cycle is now confirmed. Requests from Growth Apps totaled 17,853,285 OP this round, with 2,000,000 OP granted. Season 8’s budget sits at 6,290,000 OP, leaving 3,140,000 OP remaining. The council notes a spike of early submissions followed by a taper, which they read as better self-selection and readiness. For the first time, impact metrics from previous seasons were used to justify rejections, adding cross-cycle accountability. Notable motions include approvals for Tydro (Ink x Optimism Money Market), Oku’s user acquisition push, and several mid-sized pilots, alongside high-ask declines such as Aave’s 9M OP request and Velodrome’s 1M OP bid. Cycle 44 opens with firmer expectations and a continued emphasis on measurable growth.

**Upcoming Events**

[govNERDs Office Hours](https://meet.google.com/sop-rehq-ifw) - on 28.10 at 16:00 UTC

[Grants Council Office Hours](https://meet.google.com/pcq-tqpt-fcm) - on 29.10 at 16:30 UTC


## **Arbitrum**


## **Active Votes**

**Offchain**

[The DAO Incentive Program (DIP 2.0)](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0x44dedacbdae958904427db9ee93065917f57f50b71b4e87a94a318de18df399b) - ends on October 30 at 16:20 UTC

**Onchain**

[Transfer 8,500 ETH from the Treasury to ATMC’s ETH Treasury Strategies](https://www.tally.xyz/gov/arbitrum/proposal/57495998481040869152703890521939307107269690440073097268210566577740258992963?govId=eip155:42161:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4) - ends on October 31 at 01:16 UTC.


### **Summary of L2BEAT votes on Arbitrum proposals**

L2BEAT voted against both the [Arbitrum Triple DIP](https://forum.arbitrum.foundation/t/arbitrum-triple-dip-delegate-incentive-program/30054/41?u=manugotsuka) and the [DAO Incentive Program 2.0](https://forum.arbitrum.foundation/t/the-dao-incentive-program-dip-2-0/30080/31?u=manugotsuka).

For Triple Dip, we acknowledged the solid effort and liked the split between voting and contribution rewards with peer assessment, but it still did not define the concrete contributions the DAO should prioritize now, which in our view risked rewarding participation over impact; it also lacked visible pre-alignment with key operators and primary delegates, and would have benefited from a small neutral coordinator to keep timelines, inputs, and status updates on track. 

For DIP 2.0, our concerns were similar: it leaned on OpCo-defined objectives without making them explicit to voters, added complexity with a Peer Assembly and vouching despite low current activity, concentrated responsibility on the program manager in ways that have been costly in the past, and its peer reporting design risked favoring visibility over effectiveness. With two overlapping proposals progressing separately instead of converging, we preferred to vote no and encourage a joint, simplified redesign that starts from clear contribution goals and matches incentives to measurable outcomes.


### **Arbitrum Treasury Management: Investment Policy Statement [Q4 2025]**

Entropy [published](https://forum.arbitrum.foundation/t/arbitrum-treasury-management-investment-policy-statement-q4-2025/30117) a draft IPS that sets the playbook for managing the Arbitrum DAO treasury across assets, risks, and reporting. It defines roles for the DAO, Entropy, OAT, OpCo, and the Foundation, and aligns the portfolio with the DAO's long-term needs. 

Benchmarks are explicit by sleeve: Lido’s stETH staking rate for ETH, Aave V3 USDC supply APY on Arbitrum for stablecoins, and the 3-month UST yield minus 25 bps for RWAs. Target structure points to 30% ETH and correlated assets with a 60% cap, 35% cash and cash-like instruments, and 35% future or strategic initiatives such as BTC, tokenized equities, commodities, or private credit. Rebalancing is rules-based with quarterly and monthly triggers, yield strategies are measured against benchmarks, and growth deployments use pre-set KPIs with continue, reduce, or exit decisions. 

The IPS also codifies diversification limits, prohibits leverage and derivatives, standardizes incentive-token handling, and commits to monthly reporting plus real-time dashboards. Entropy is requesting community feedback on the draft.


### **Governance Security: blockful’s stress test, Using LobbyFi in the Security Council Election**

Blockful [conducted](https://forum.arbitrum.foundation/t/dao-discussion-governance-security-blockful-s-stress-test-using-lobbyfi-in-the-security-council-election/30106) a live “stress test” by purchasing votes via LobbyFi in the ongoing Arbitrum Security Council elections to demonstrate how easily economic attacks could influence outcomes. They stated upfront they would not serve and would resign if elected unless the DAO explicitly asked them to stay, aiming to spotlight an attack vector rather than hold a seat. That said, even a good-faith resignation can create real operational friction for a security-critical body. If a renunciation follows a win, the Council may temporarily run with 11 signers instead of 12, an on-chain signer update would be required, and Blockful could be an active signer for a short window before a DAO vote replaces them. Those transitions add overhead and small but meaningful risk for a committee that safeguards high-value systems. The constructive path forward is to discuss mitigations that let the DAO study these vectors without touching live keys: more explicit norms against mainnet experiments that alter Council composition, a pre-election mechanism to decline a seat before activation, a rapid replacement process with pre-vetted alternates, and documented incident playbooks so any unexpected outcome is handled quickly and predictably.

**L2BEAT’s take**

We appreciate the spirit of the test and the blockful work. Surfacing attack paths in the open is useful, and this exercise clearly highlighted a real vector rather than causing harm. Our only caution is process: live tests during elections can create coordination noise if objectives and guardrails aren’t explicit. 

Constructively, it would help to define a mitigation plan. This round was a test, but the next one might not be. To reduce the risk in future elections, the DAO should set more explicit norms and a concrete response plan. In parallel, publishing incident playbooks will improve resilience and make any future tests more informative with less collateral confusion.


### **AGV Invites You to the Next Level: Golden Tides - Exclusive Playtest for the Arbitrum DAO**

Arbitrum Gaming Ventures [has posted](https://forum.arbitrum.foundation/t/agv-invites-you-to-the-next-level-golden-tides-exclusive-playtest-for-the-arbitrum-dao/30109/4) an invitation to the DAO to participate in their quarterly playtest series, where they will present Golden Tides, a pirate-themed PVP adventure MOBA developed by Psychedelic Games (team alumni from League of Legends, Smite, Fortnite, PUBG, Warzone, ARK). The private session kicks off with a live intro and Q&A on the project’s Discord at 17:00 UTC, Nov 6, followed by a 60-minute hands-on playtest. Participants will receive a free Gen 1 Skins NFT for taking part. To join, reply “AHOY!” on the forum thread to get your referral code, install the Golden Tides client via Epic Games, enter your code to access the playtest server, and hop into Discord at start time. A quick-start guide is available to get you sailing fast.


**L2BEAT’s take:**

This series helps the DAO see tangible progress and give product feedback. Golden Tides and other presented game, Wildcard, look promising, but the gaming market is very competitive. We would like to understand the go-to-market plan in more detail: distribution, user acquisition, retention targets, and how web3 features translate into community growth and sustainable monetization.


### **Proposal: Zokyo as Security Partner for Arbitrum DAO**

Zokyo has [created a post](https://forum.arbitrum.foundation/t/proposal-zokyo-as-security-partner-for-arbitrum-dao/30115) offering to serve as a “native” audit and security partner to Arbitrum DAO. They’d provide smart contract and protocol audits, pentesting, fuzzing, threat modeling, token-econ reviews, and long-term advisory. Per the post, DAO builders and grantees would receive priority timelines, a 10% fee discount, one-on-one consultations, and co-marketing and network access.

**L2BEAT’s take:**

We appreciate vendors leaning in to support DAO builders, and Zokyo’s scope reads comprehensive. That said, Arbitrum already has security procurement tracks and allowlists in motion through the Audit Program. It would be better for proposals like this to run through those channels first, to ensure consistent vetting, pricing, and coordination with existing providers.

**Upcoming Events**

[OpCo Operations - Office Hours](https://meet.google.com/sxt-fdxr-qmo) - on 28.10 at 15:30 UTC

[Open Discussion of Proposals Governance Call](https://meet.google.com/hex-xumv-hga) - on 28.10 at 16:00 UTC

[The DAO Incentive Program (DIP 2.0): Open Discussion #3](https://meet.google.com/xpb-whoq-rsw) - on 29.10 at 16:00 UTC


## **ZkSync**


## **Active Votes**

[ZKsync Governance System Infrastructure Funding](https://www.tally.xyz/gov/zksync/proposal/8043865517871673466500920771587039178855876090726876272793935297016439640908?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746) - ends on October 31 at 19:26 UTC.

[ZKnomics Token Staking](https://www.tally.xyz/gov/zksync/proposal/97314764080859415498674952864578860560861880297360481348949362100730414449748?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746) - ends on October 29 at 08:50 UTC.


### **Clarification on Prividium Prize Selection Timing**

Be1garat, Director at ZKsync Foundation, has [posted](https://forum.zknation.io/t/clarification-on-prividium-prize-selection-timing/810) clarifications regarding the Privadium prize program. According to his words, prizes are awarded on a rolling, first-come basis to the first 10 qualifying Prividium submissions.

Each application is reviewed as it arrives; if valid, the prize is granted promptly rather than waiting for the program’s end date. Funds may be fully disbursed before the official expiration. If that happens, the team will review outcomes with the community and may propose an extension and larger budget.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Polygon**


### **Treasury Board Quarterly Report 2025Q3 (Season 3)**

Kb17 from  PolygonLabs [has shared](https://forum.polygon.technology/t/treasury-board-quarterly-report-2025q3-season-3/21348) the quarterly S3 treasury board report. About 80M POL in ecosystem deals were signed this quarter, with early traction across infra, liquidity, and founder support. Current framing: Liquidity & Incentives 25M POL (16.5M committed, 0.5M deployed), Capital & Infrastructure 40M POL (57M committed, 1M deployed), Founder Support 15M POL (6M committed, 0.3M deployed). Near-term focus is on Q4 activations for stablecoin liquidity, RWA integrations, and regional founder tracks.

Governance is tighter: 100% on-time program reports, ROI dashboards in progress with StableLab, and incoming tweaks to PFP-3 ahead of Season 4. Next full report lands in January.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Starknet**


### **Starknet v0.14.1 Prerelease Notes**

Eitanm-starkware [has shared](https://community.starknet.io/t/starknet-v0-14-1-prerelease-notes/116032) notes outlining Testnet on 11 Nov and Mainnet on 25 Nov. The release implements SNIP-34, switching CASM hash computation in DECLARE txs from Poseidon to BLAKE (breaking change). Blocks will close faster during quiet periods (about 2s) to stabilize EIP-1559 base-fee updates and keep utilization near the 80% gas target. It also introduces JSON-RPC v0.10.0 with a richer state diff (migrated_compiled_classes), lighter pre-confirmed updates, added transaction_index and event_index in getEvents, clearer errors and types, and reorg subscriptions that now trigger on new transactions and receipts. Further RPC refinements are being coordinated with node teams; feedback is welcome.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Everclear**


## **Active Votes**

[Social EGP-33 - Amarok Technical Upgrade Proposal (Asset Recovery & Withdrawal)](https://snapshot.box/#/s:dao.connext.eth/proposal/0xaa5c536d32bd3564f3fa21d4768da7145d2b15ac2c30a3cabd5420f7cbebca3b) - ends on October 31 at 13:59 UTC.

[Social EGP 34 - Everclear Security Council Regular Members Elections](https://snapshot.box/#/s:dao.connext.eth/proposal/0x707486a0b6af8592287244657e928fe3581b9faf7da4fc58adc51f4a21758bc8) - ends on November 3 at 13:59 UTC.

[Executable EGP 34 - Everclear Security Council Lead Elections](https://snapshot.box/#/s:dao.connext.eth/proposal/0xe7c5e606c58ac2c9d656c886b2006246d66e57f8a99edca76fb6205e5197df97) - ends on November 3 at 14:26 UTC.

[Executable EGP 35 - Everclear Security Council Regular Members Budget Request](https://snapshot.box/#/s:dao.connext.eth/proposal/0xdc713f4c9f73f6f9c63434743b1bb799e3a4023a0ef6d2e6fe5a690f0cbfd4ce) - ends on November 3 at 14:33 UTC.


### **Everclear Security Council election**

Everclear is running its Security Council process now: the DAO is asked to [ratify](https://snapshot.box/#/s:dao.connext.eth/proposal/0xe7c5e606c58ac2c9d656c886b2006246d66e57f8a99edca76fb6205e5197df97) Creed as Security Council Lead (regular yes/no vote) and to approve funding for the Lead and [eight regular](https://snapshot.box/#/s:dao.connext.eth/proposal/0xdc713f4c9f73f6f9c63434743b1bb799e3a4023a0ef6d2e6fe5a690f0cbfd4ce) members. 

The Lead request totals 3,619,128 CLEAR, covering $4,000/month for 12 months, a $4,000 retro payment for October 2025, and a 30% buffer using an average of $0.0205 per CLEAR; payments are monthly in CLEAR. The regular members' request totals 10,022,200 CLEAR to fund 8 seats at $1,500/month each for 12 months, also with a 30% buffer on the same CLEAR reference. Funds for both items route to the Security Council multisig, with legal agreements executed by the Foundation.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Scroll**


### **Proposal Title: Auto-Abstaining Wallet extension**

Juansito [proposes](https://forum.scroll.io/t/proposal-title-auto-abstaining-wallet-extension/1277) extending the Auto-Abstaining wallet through March 2026 to help secure quorum without lowering thresholds. The Foundation-managed wallet holds 500,000 SCR and auto-votes Abstain on every live proposal. Since its June 2025 rollout, it has participated in 8 proposals, contributing a cumulative 4M SCR of voting power; 5 of those votes would have missed quorum without it. The extension makes no operational, personnel, or budget changes and keeps the same criteria and custody. The rationale is simple: until broader participation improves, the mechanism remains a practical safeguard to ensure proposals can reach quorum and be decided.

**L2BEAT’s take:**

We continue to support the auto-abstain wallet as a pragmatic, low-risk backstop that keeps legitimate proposals from failing on quorum alone. Our original rationale still holds: a 500k SCR buffer, managed by the Foundation and returned at term, is a reasonable interim tool while the DAO grows real participation. 

That said, we’d like a few safeguards for this extension: publish a simple monthly note when the wallet was used and whether it was decisive for quorum; commit to a mid-term review before March 2026; and, in parallel, run efforts to lift organic turnout through delegation drives, voter reminders, and cheaper or gasless voting. Rather than fixing a sunset date now, we think that evaluating viable alternatives during the review and deciding then whether to retire, modify, or continue the mechanism is better.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events**

[Carroll Mechanisms Community Working Session](https://meet.google.com/phu-drwp-jwt) - on 27.10 at 17:00 UTC.

[Weekly DAO & Governance Call](https://meet.google.com/fut-dgwp-tcn) - on 29.10 at 14:00 UTC.

[Scroll Delegate Proposal Bonanza](https://meet.google.com/zfd-asoc-rmx) - on 30.10 at 17:45 UTC.


## **Lisk**


## **Active votes**

[Establish the Lisk DAO Fund and cover the 2026 budget](https://www.tally.xyz/gov/lisk/proposal/83414824676020462079171257236144094094307423861214558357020310400447570416569) - ends on October 29 at 13:22 UTC.

Lisk’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

Join us every Friday at 3 pm UTC for L2BEAT Governance Office Hours, where we discuss everything related to Lisk’s governance, from current initiatives to high-level conversations.


## **Uniswap**

Uniswap’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Upcoming Events**

[DEF Community Call](https://meet.google.com/kjb-tgss-skw) - on 29.10 at 17:00 UTC

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events**

[Hop Community Call](https://discord.com/channels/789310208413270078) - on 29.10 at 18:00.


## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.
