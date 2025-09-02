---
title: "Governance Review #57"
description: "Another packed week of upgrades, proposals, and DAO housekeeping across every ecosystem that we are part of."
publishedOn: "2025-06-23"
authorId: manuel-gonzalez
---
## **L2BEAT is now on Substack!**

We’ve added a new home for our weekly governance newsletter: **[l2beatgov.substack.com](https://l2beatgov.substack.com/)**.

On top of the governance review, we will also be sharing our KYB (Know Your Builder) interviews, as well as unique content about L2BEAT’s presence in governance, so be sure to have a look and subscribe to start receiving updates in your email. 😉

👉 [Check it out and subscribe here](https://l2beatgov.substack.com/)

## **Optimism**

### **Evolution of Retro Funding in Season 8**

[Season 7’s](https://gov.optimism.io/t/evolution-of-retro-funding-in-season-8/10024) monthly, algorithm-driven Retro Funding was a success: builders loved the steady payouts and data-backed scoring. But letting Citizens vote on the scoring math flopped—most couldn’t decode the formulas, and it injected volatility. For Season 8, algorithms will remain open-source but will be tuned by the Open Source Observer (no longer requiring votes), while citizens retain budget veto power. Expect the same predictable monthly rewards, clearer impact dashboards on OP Atlas, and even smarter metrics thanks to upgraded EIP-4337 and dependency-graph tracking. Dive into the post to see how these tweaks aim to boost trust and keep Retro Funding fast, fair, and builder-friendly.


### **Upgrade 16 Proposal: Interop Contracts, Stage 1, and Go 1.23 Support in Cannon**

Kelvin has published  “[Upgrade 16](https://gov.optimism.io/t/upgrade-16-proposal-interop-contracts-stage-1-and-go-1-23-support-in-cannon/10037)”, a protocol upgrade proposal that quietly prepares every OP Stack chain for the upcoming Superchain interoperability. The patch swaps in new bridge contracts, removes the extra “Deputy Guardian” role so only the Security Council can pause withdrawals, and lifts the per-block gas ceiling from 200 m to 500 m. Cannon now supports Go 1.23 and a second proof system called Kona, broadening fault-proof diversity. Existing withdrawal proofs will need to be re-proved, but the team expects no downtime. Audit contests revealed only low-severity issues, all of which were fixed. If delegates approve, mainnet chains will upgrade on 24 July, setting the stage for the full interop “on” switch in Upgrade 17. Read Kelvin’s full post for the spec, runbook links, and the exact multisig payloads.

**Discuss with L2BEAT**

You can find us to discuss everything related to Optimism’s governance, from current initiatives to high-level conversations, during our [Optimism Office Hours](https://meet.google.com/pem-jzrh-gkq) every Tuesday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Season 8 Intent AMA](https://gov.optimism.io/t/season-8-intent-ama-questions-thread/10028) - on 24.6 at 18:30.

[govNERDs Community Office Hours](https://meet.google.com/eqb-dfkk-mui) - on 24.6 at 19:00.


## **Arbitrum**


## **Active Votes**

**Onchain**

[Register the Sky Custom Gateway contracts in the Router](https://www.tally.xyz/gov/arbitrum/proposal/71020107401388505040510993373598301285550678565865201408741893567942851985019?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) - ends on July 3 at 23:24 UTC.

[AIP: Constitutional Quorum Threshold Reduction](https://www.tally.xyz/gov/arbitrum/proposal/94423886836435773843507976898262621297544156552971145658873213763398017341229?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) - ends on July 4 at 00:37 UTC.

**Temp-check**

[Arbitrum Treasury Management Council - Consolidating Efforts](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0xfab795313df4ef1023c5f7f9027857637cc3841d62dc0b54796fbfa5f8096919) - ends on June 26 at 13:58 UTC.

[AIP: Remove Cost Cap on Arbitrum Nova](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0xeb044e3bdeba71e74dea02abeab4c33fe4bf5ab9def50082863702d5e2112b93) - ends June 26 at 16:20 UTC.


### **AIP: Update the Upgrade Executors**

The Arbitrum Foundation [has submitted](https://forum.arbitrum.foundation/t/constitutional-aip-update-the-upgrade-executors/29463/2) a constitutional AIP to swap in upgraded “Upgrade Executor” contracts across Arbitrum One, Nova, and the L1 bridge. The new executors introduce a handy executeCall() function, allowing future governance actions to interact directly with target contracts, thereby eliminating the need for extra delegate-call wrappers and one-off action contracts. Nothing else about upgrade powers changes—the DAO still owns the keys—but day-to-day upgrades should get faster and cheaper for devs. No new funding is requested, and the code has been tested and audited since January 2023.


### **Audit Committee Technical Expert Elections**

The Arbitrum Foundation [has opened](https://forum.arbitrum.foundation/t/audit-committee-technical-expert-elections/29474) elections for the single “Technical Expert” seat on the new Audit Committee and is asking the DAO to decide between two finalists. The role pays $5k a month for roughly one to two days of work each week and covers tasks like checking third-party audit reports and matching projects with the right security firm.

From a pool of 68 applicants, the Foundation has shortlisted Gustavo Grieco and Andrei Andonov. Both will introduce themselves on a community call on 24 June 14:00 UTC; a Snapshot vote opens on 26 June. Shielded voting rules apply, and the winner will start in early July to help spin up the Arbitrum Audit Program.


### **Entropy Advisors: Exclusively Working with the Arbitrum DAO, Y2-Y3**

Entropy Advisors [created a proposal](https://forum.arbitrum.foundation/t/entropy-advisors-exclusively-working-with-the-arbitrum-dao-y2-y3/29458/1) for a two-year renewal and an expanded mandate from the DAO. Founders Matt Fiebach and Sam Martin say their seven-person team spent Year 1 drafting key proposals (STEP II, DRIP, ARB staking group, and events budget), running “Delegate Days,” and building widely used Arbitrum data dashboards. Now they want to focus full-time on treasury strategy, incentive design, analytics, and BD support that turns Arbitrum into “the most effective capital-allocating DAO.”

The ask: $6 million in ARB over 24 months for salaries, plus 15 million ARB that vests over three years to keep the team’s incentives locked to Arbitrum’s success. Entropy pledges monthly public reports and gives the DAO a simple Snapshot path to end the deal if targets aren’t met. Full details, a candid Year-1 retrospective, and the planned Year-2/3 workstreams are in the forum post—worth a read before the discussion window closes.


### **Arbitrum Research and Development Collective V2 - Extension**

Immutablelawyer [has created](https://forum.arbitrum.foundation/t/arbitrum-research-and-development-collective-v2-extension/29476) a proposal that requests a six-month renewal for the Arbitrum Audit R&D Collective (ARDC), activating the second half of the ARDC V2 budget, allowing the research (DeFi Llama + Castle), risk (Nethermind), and security (OpenZeppelin) teams to continue their work through January 2026. The DAO can (A) extend as-is, (B) extend but re-elect working members, or (C) end the program and return the unused funds. The snapshot vote will decide.

**Discuss with L2BEAT**

You can find us to discuss everything related to Arbitrum’s governance, from current initiatives to high-level conversations, during our [Arbitrum Office Hours](https://meet.google.com/jkj-nnop-arc) every Thursday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Audit Committee Technical Expert Candidate Introductions](https://meet.google.com/iag-zcsk-hss) - on 24.6 at 14:00.

[DeFi Education Fund Community Call](https://meet.google.com/kjb-tgss-skw) - on 24.6 at 17:00.

[Arbitrum Data Workshop 1: DAO Financials](https://meet.google.com/ess-bkpr-mpe) - on 25.6 at 15:00.

[Bi-Weekly ARDC Office Hours](https://huddle01.app/room/dvb-zlbw-yus) - on 26.6 at 16:00.


## **Uniswap**


### **[RFC] Etherlink x Uniswap - Co-incentive Proposal**

Dtz_NL [has filed an RFC](https://gov.uniswap.org/t/rfc-etherlink-x-uniswap-co-incentive-proposal/25670) proposing a joint incentive program for Uniswap v3 on Etherlink, the Tezos-secured L2 that has seen its TVL increase from $1.5M to $40M this year. The Tezos Foundation will commit $300k in rewards and seed liquidity to WETH/USDC, WBTC/USDC, and LBTC/USDC pools during Apple Farm Season 2 (mid-July → mid-October). They’re asking the Uniswap DAO to contribute another $150k so Uniswap becomes the go-to venue for every new, uncorrelated token launching on Etherlink. 

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[DEF Community Call](https://meet.google.com/kjb-tgss-skw) - on 24.6 at 17:00.


## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Hop Community Call](https://discord.gg/zb3U6sTCAv) - on 25.6 at 17:00


## **Polygon**

Polygon’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Starknet**


### **Introducing SN 0.13.6**

Ohad-StarkWare [dropped](https://community.starknet.io/t/introducing-sn-0-13-6/115678) the SN 0.13.6, paving the way for the new “S-Two” prover.

The config-only patch lets Starknet switch from the current Stone prover to S-Two, a Circle-STARK system that cuts block proof time from ~24 min to &lt; 3 min and halves costs. Because S-Two’s field makes certain built-ins heavier, the release activates per-builtin resource caps and temporarily disables Cairo Native to prevent unprovable blocks. Fees remain the same, and Cairo Native will be updated once the extra counting logic is implemented (target: Q3). Faster, cheaper proofs and three-minute “push-to-L1” finality are now in sight.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Everclear**


### **Everclear DAO Financial Report 2025**

SEEDGov [posted](https://forum.connext.network/t/everclear-dao-financial-report-2025/1382) Everclear’s Jan-May 2025 treasury summary. The update shows $3.23M in assets (≈81 % CLEAR, 9 % NEXT, 9 % ETH) and details a hefty 75.4M CLEAR in grant outflows, offset by 6M CLEAR in claw-backs and buybacks. Net result: the main multisig’s balance slid from 175.6M to 106.1M CLEAR over five months, while smaller vaults still hold another 11M CLEAR plus assorted ETH and USDC. Revenue tracking is coming in the following report.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Everclear Delegates Call](https://meet.google.com/zcv-aqph-pcj) - 26.6 at 14:00.


## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Lisk**

Lisk’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **ZkSync**


### **ZKnomics Roadmap Vision**

Omar [posted](https://forum.zknation.io/t/zknomics-roadmap-vision/712) “ZK nomics,” a new roadmap for ZKsync’s token. The post outlines a four-step plan—permissionless staking, a burn-enabled token upgrade, fee switches for sequencer and interop, and on-chain allocation rules—that would route protocol fees into burns and staking rewards. Each stage comes as a separate ZIP voting and ties to infrastructure already rolling out (Gateway, EVM-equivalence, Prividium, solx). Read the vision to see how usage fees could start shrinking supply and paying stakers as soon as the tooling lands.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Scroll**


### **P2P Compensation System for Gov Retribution Compensation working group**

Goodstuff [pitches](https://forum.scroll.io/t/p2p-compensation-system-for-gov-retribution-compensation-working-group/876) “CollabBerry,” a peer-to-peer pay tool for Scroll’s new Gov Compensation WG. The post argues that DAO pay is still murky and proposes an on-chain, AI-assisted system where teammates rate each other each pay cycle; a transparent algorithm then splits funds and mints soul-bound proof-of-work tokens. CollabBerry is live on Arbitrum, and the author asks Scroll builders whether deploying it next could resolve unclear, token-only payouts and provide early contributors with fair retroactive rewards.


### **Proposal: Security Subsidy Program for Scroll Builders**

Samater [has submitted](https://forum.scroll.io/t/proposal-security-subsidy-program-for-scroll-builders/872) a $500k “Security Subsidy Program” pilot that aims to make professional audits and post-launch protection affordable for projects graduating from Scroll Open. Under the plan, the DAO would earmark $300k to cover up to 90 % of each team’s audit bill on Areta’s marketplace, plus $200k for Immunefi’s Magnus platform, which bundles discounted bug-bounty hosting, fuzzing, formal verification, PR reviews, and real-time monitoring. Eligibility will be determined by a rating sheet and investment-style agreements to discourage subsidy farming; any unused funds will be returned to the treasury.


### **Proposal: Nigeria Local Node**

Abidemi Adenle, Web3Bridge’s Ayodeji Awosika, and Web3Afrika’s Idris Olubisi have [submitted](https://forum.scroll.io/t/proposal-nigeria-local-node/864) a $30k, 12-week plan to test Scroll’s “Local Node” model in Nigeria. In weeks 1-2, the team will catalogue 50-plus crypto start-ups, interview founders, and score the clearest zk-EVM use-cases (think cheap remittances, privacy rails, and DePIN). A six-week virtual builders’ programme, run by Web3Bridge, will follow, pairing technical training with business-model mentoring and culminating in a demo day focused on Scroll Open. Parallel events—a founders’ round-table, an open Community Day run by Web3Afrika, and a post-programme feedback dinner—will gauge market fit, surface blockers, and cultivate local champions. Success targets: three high-energy events, at least ten graduates actively deploying to the Scroll testnet/mainnet, and five teams ready for Scroll Open. Findings, contact lists, and a “scale/pause” recommendation are presented to the DAO in week 12.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Weekly DAO & Governance Call](https://meet.google.com/nug-uygx-hbd) - 25.4 at 11:30.

[Weekly DAO & Governance Call](https://meet.google.com/pcm-nxzr-rig) - 25.4 at 17:00.
