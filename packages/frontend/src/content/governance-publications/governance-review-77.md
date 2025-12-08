---
title: "Governance Review #77"
description: "As December slows the forums down, the important decisions get clearer."
publishedOn: "2025-12-08"
authorId: manuel-gonzalez
---

## **TL;DR**

*On **Optimism**, Paul Dowman disclosed two medium-severity permissionless fault-proof vulnerabilities (oversized accelerated precompile inputs) and confirmed no exploits, and that U17/Jovian fully fixes both. On the community side, Stephanschwab published a step-by-step Superchain beginner guide, while Alexsotodigital launched a short Season 8 → Season 9 Feedback Pulse (plus govNERD's office hours on Dec 8).*

*On **Arbitrum**, delegate incentives are the main story: JoJo + JamesKBH proposed a short DIP v1.7 bridge extension (Nov 2025–Feb 2026) as backup coverage, while the Foundation’s RAD vote (ends Dec 11) moves to a per-proposal reward model (vote + public rationale) with quarterly budgets set by OpCo. AGV also finalized its 2026 Council (3 elected + 2 reconfirmed) heading into verification.*

*On **ZKsync**, Cliffton.eth delayed the ZKnomics staking pilot to Q1 2026 (Season 1) and Q2 2026 (Season 2), citing timing, Devconnect, Q4 slowdown, and testing; discussion also continued around governance sustainability critiques and requests for a clearer Foundation treasury report.*

*Elsewhere, **Starknet** is deprecating RPC 0.6 (Dec 10, 2025) and 0.7 (Jan 1, 2026), proposed a more predictable voting cadence, and StarkWare kicked off a DeFi trading research initiative. **Scroll** pushed ahead on DAO 2.0 co-creation (including delegate design ideas), published the Delegate Accelerator final report/curriculum, and continued the Galileo upgrade path. **Uniswap** Foundation shared Q3’25 unaudited financials, **Everclear** outlined a redelegation strategy, **Polygon** floated an ERC-7575 vault extension to standardize staked POL liquidity, and **Lisk** published a (work-in-progress) Season 2 report.*


## **Optimism**


### **Disclosing two fault proof system vulnerabilities**

Paul Dowman [shared](https://gov.optimism.io/t/disclosing-two-fault-proof-system-vulnerabilities/10474) a post disclosing two medium-severity vulnerabilities affecting OP Stack chains running permissionless fault proofs. Neither was exploited, and both are fixed in Upgrade 17 (U17) / the Jovian hard fork, so upgraded chains don’t need to do anything else.

In both cases, the issue was oversized inputs to accelerated precompiles that could prevent the preimage oracle from providing data to the fault-proof VM: one centered on *ecrecover* (impacting Mainnet + Sepolia permissionless setups), and the other on Fusaka’s new per-transaction gas limit (impacting Sepolia only). Exploitation would be costly (~300 ETH in bonds) and is mitigated by monitoring and the ability to blacklist dispute games if needed.


### **Ultimate Beginner Guide: How to Start in the Optimism & Superchain Ecosystem**

Stephanschwab has [published](https://gov.optimism.io/t/ultimate-beginner-guide-how-to-start-in-the-optimism-superchain-ecosystem-step-by-step-with-examples/10468) an “Ultimate Beginner Guide” aimed at onboarding newcomers to Optimism and the Superchain, walking readers through the basics from first principles to first on-chain actions. The post explains what Optimism and OP Stack chains are, how to set up a wallet and make a test transaction, and how to bridge, swap, and interact with dApps across Superchain networks like Base, Mode, Zora, Lyra, and others. It also includes a plain-language primer on RetroPGF (impact over promises) and links to the author’s educational materials, an illustrated Optimism intro book, a separate “Build for Good” book translated into multiple languages, and visual NFT learning cards, plus a suggested step-by-step path for beginners to start contributing and eventually participate in programs like Atlas and RetroPGF.


### **Community Feedback Pulse**

Alexsotodigital [has launched](https://gov.optimism.io/t/community-feedback-pulse/10462) a short “Community Feedback Pulse” to gather quick input from builders, delegates, and users ahead of Optimism’s Season 8-to-Season 9 reflection period. The goal is to capture clear, actionable lessons from Season 8 and translate them into concrete improvements for Season 9, with responses accepted either anonymously or with a handle. Alongside the survey, the team says they will also incorporate “forum listening,” so written posts and public comments are reflected directly rather than loosely paraphrased, and they’ve invited contributors to share context via DM or synchronous conversations if preferred.

**Upcoming Events**

[govNERDs Office Hours](https://meet.google.com/sop-rehq-ifw) -on 8.12 at 13:00 UTC


## **Arbitrum**


## **Active Votes**

**Offchain**

[Rewarding Active Delegates (RAD) Program](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0xa06500740b56c647f25bd3edba80bf05b00140afe99d6b0d27c0f1dc93287901) - ends on December 11 at 23:30 UTC.

**Onchain**

[AIP: Activate ArbOS 51 (Dia) and Gas Pricing Updates](https://www.tally.xyz/gov/arbitrum/proposal/53154361738756237993090798888616593723057470462495169047773178676976253908001?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) - ends on December 18 at 22:05 UTC.


### **Temporary Extension of the Delegate Incentive Program (DIP) v1.7**

JoJo (with JamesKBH) [proposed](https://forum.arbitrum.foundation/t/non-constitutional-temporary-extension-of-the-delegate-incentive-program-dip-v1-7/30248) a temporary extension of Arbitrum’s Delegate Incentive Program (DIP) v1.7 for four months (1 November 2025 to 28 February 2026), with retroactive coverage for November. The intent is purely continuity—keeping delegate incentives running while the Arbitrum Foundation and other stakeholders finalize a successor framework (e.g., “DIP 2.0”)—and the extension would automatically sunset at the end of February or end earlier if a new program is approved and activated. The Snapshot would choose between reinstating the full DIP v1.7 (all tiers, scoring, disputes, ops) or reinstating only “Tier X” (for delegates with ≥500k ARB voting power, focused mainly on voting activity), with an option to do nothing and let incentives lapse; no compensation is requested for the proposers.

In a later comment, JoJo added that the extension was drafted quickly as a stopgap and that they do not want concurrent votes if the Foundation’s newer proposal is moving forward. They see the extension going to Snapshot only if the newer proposal fails in the expected 4–11 December 2025 voting window, or if it isn’t put to a vote before 11 December (the last workable date ahead of the DAO’s Christmas pause beginning 18 December). JoJo also notes the newer design seems to incorporate much delegate feedback, but could benefit from more published rationale and simulations to help delegates align on a confident vote.

**L2BEAT’s take**

Coordination and timing across this proposal and the RAD proposal were unfortunately messy, but keeping an explicit, short, and clearly scoped extension as a backup can still be valuable. It lowers the risk of an incentive gap if the RAD proposal slips or fails, while maintaining pressure to converge on a single, broadly supported successor program rather than fragmenting governance energy across competing frameworks.


### **Rewarding Active Delegates (RAD) Program**

The Arbitrum Foundation [posted](https://forum.arbitrum.foundation/t/rewarding-active-delegates-rad-program/30249) a proposal to launch a new “Rewarding Active Delegates” (RAD) program, positioned as the first piece of a broader “DIP 2.1.” The program would reward delegates strictly for objective participation: voting on proposals and posting a public rationale for their vote within 5 days, with an additional monthly requirement to vote on at least 75% of proposals. Eligibility also requires opting in, passing OpCo compliance checks, maintaining at least 200k ARB voting power, and (for payouts) meeting a defined quorum target, with a notable tweak: AGAINST votes would count toward the program’s quorum calculation, so delegates can vote freely without risking reward eligibility. 

Rewards are budgeted per proposal type on a quarterly cadence set by OpCo (initially run by the Arbitrum Foundation), with per-proposal incentive pools (e.g., $15k for on-chain constitutional votes, $5k for temperature checks), per-delegate payout caps, ARB-denominated payouts using a 7-day TWAP, and tracking in a public spreadsheet. The program draws from the existing DIP multisig balance (about 7M ARB), and OpCo retains discretion to set bespoke budgets or offer no rewards for certain votes to reduce abuse.

**L2BEAT’s take**
This feels like a solid, easy-to-audit step toward “pay for participation.” The rules are straightforward, the per-proposal budgets are easy to track, and requiring a short public rationale should make it clearer why things pass or fail. Letting OpCo reset budgets each quarter also gives the DAO a practical knob to turn as participation changes, and payout caps help avoid everything flowing to the biggest delegates, keeping smaller but consistent voters in the mix and supporting quorum during busy periods.

At the same time, there’s a real risk of incentivizing quantity over quality. If the reward is “vote + rationale,” some delegates will inevitably default to boilerplate explanations just to stay eligible, and the 200k ARB minimum plus compliance requirements could shrink the paid set and reinforce concentration. OpCo’s ability to tweak parameters, set bespoke budgets, or switch rewards off entirely provides flexibility, but it can also make the program feel less predictable unless decisions are consistently explained and backed by transparent, data-driven reviews.


### **AGV - 2026 Council Elections Results**

ArbitrumGaming [shared](https://forum.arbitrum.foundation/t/agv-2026-council-elections-results/30303) the results of the AGV 2026 Council elections: three members were elected (David Bolger, Greg Canessa, and JoJo), and two members were reconfirmed by DAO vote (Tim Chang and John Kennedy).

Next, OpCo runs an electee verification period (Dec 5–12, 2025) with reference checks, followed by a December transition, and the new Council term starts Jan 1, 2026.

**L2BEAT’s take**

Nice to see the AGV 2026 Council settled with a clear outcome. Now, the process is undergoing verification checks that will run until December 12. Suppose that process is handled transparently and the new Council starts Jan 1 with a crisp plan (priorities, decision process, reporting rhythm). In that case, AGV will be in a much better spot to move fast without creating confusion or governance drama.


### **BLAZE: Bootstrapping Loans for the Arbitrum Ecosystem**

Maxlomu [posted](https://forum.arbitrum.foundation/t/blaze-bootstrapping-loans-for-the-arbitrum-ecosystem/30300) a proposal for BLAZE, a 1-year experiment in which the Arbitrum DAO would offer short-term loans to early-stage builders, especially projects tied to the “Crypto Cities”/real-world economy thesis. The idea is to unblock a common early problem: projects have demand, but not enough liquidity to scale, and today the usual options can be expensive or misaligned.

They’re asking for $5M total ($4M USDC + $1M ARB), plus a minor ops budget and up to $100k for committee compensation (via OpCo, if members don’t waive it). Funds would be held and deployed through the ATMC, moved into project-specific vaults when loans are approved, and recycled as loans are repaid. The scope emphasizes stable-value positions only (no IL), prefers audited teams and verifiable or insured receivables, and includes a public tracking dashboard (starting as a Notion). OpCo would also retain the ability to revoke the multisig and recall funds if needed.

**L2BEAT’s take**

A lot of early teams don’t need another incentive program; they need a bit of clean liquidity to get through the awkward bootstrapping phase. The stable-in/stable-out rule, preference for audited teams, and the idea of recycling repaid capital into new loans all make this feel like a pragmatic experiment that could actually help builders without permanently draining the treasury.

That said, “DAO loan program” is where things get messy fast. Underwriting is complex, defaults happen, and off-chain enforcement is never as smooth as it looks in a forum post. A $5M pilot is also a chunky first bet if the program starts broadly, and a Notion dashboard doesn’t replace clear rules on who gets approved, how risk is scored, what terms look like, and what happens when someone can’t repay. If this goes forward, we’d really want tighter guardrails and a slow ramp (start small, publish terms + decision criteria, clear conflict rules, and real checkpoints) so it doesn’t turn into an expensive headache.


### **[Firestarters] Focus & Next Steps**

OpCo [posted](https://forum.arbitrum.foundation/t/firestarters-focus-next-steps/30305) an update on the Firestarters Fund, sharing a refreshed plan based on forum and Devconnect feedback and confirming it will run as an OpCo-funded pilot. Firestarters will support “spark” work across four tracks: 

1. New or expanded Arbitrum revenue streams,
2. Builder support beyond DeFi (RWAs/DePIN/AI),
3. Ecosystem/DAO unification initiatives, and 
4. An open track where OpCo can make discretionary grants with a stated justification.

They’ll review applications using a transparent but subjective matrix (planning/end goals, expertise/positioning, strategic relevance/timing, grant size vs impact), then work with grantees to define OKRs/KPIs and manage delivery like a lightweight project manager. All activity will be published on a public Notion dashboard, with monthly forum summaries, and a full pilot report by the end of Q1 2026 or once the $50k budget is fully deployed.


### **OpCo December 2025 Update**

Frisson [shared](https://forum.arbitrum.foundation/t/opco-december-2025-update/30311) OpCo’s December 2025 monthly update on behalf of the OpCo Oversight & Transparency Committee (OAT), recapping progress since October and inviting delegate feedback. They note that the monthly DAO call took place on Dec 5 and that the primary focus has been hiring, operationalizing OpCo, and executing DAO responsibilities.

On hiring, OpCo is still in the process of recruiting Legal Counsel and a Director of Finance & Treasury, and interviewing for a “Chief Chaos Coordinator” (Head of OpCo Foundation), with roles listed on Lever. On operations, OAT participated in Devconnect (including ArbiCasa), continued weekly meetings, and highlighted work by Tamara and Sinkas across AAE coordination, AGV election support, grants “one-stop hub” support with AF, delegate/builder outreach, a refreshed OpCo website (AAE map + initiatives), and the Firestarters initiative. On DAO workstreams, OAT is actively executing its role in Entropy’s TMC proposal (approving/denying allocation recommendations) and acting as Entropy’s counterparty under the exclusivity arrangement, including negotiating incentive mechanisms with a 10M ARB set-aside.

**Upcoming Events**

[OpCo Operations - Office Hours](https://meet.google.com/sxt-fdxr-qmo) - on 9.12 at 15:30 UTC.

[Open Discussion of Proposals Governance Call](https://meet.google.com/dfo-xora-ysp) - on 9.12 at 16:00 UTC.

[Arbitrum Reporting Governance Call (GRC)](https://meet.google.com/vgd-mmsj-kgk) - on 10.12 at 16:00 UTC.

[Firestarters Fund Call #2](https://meet.google.com/urr-zdxf-upe) - on 11.12 at 16:00 UTC.


## **ZKSync**


### **ZKnomics Token Staking Pilot - Update on Timelines**

Cliffton.eth [shared](https://forum.zknation.io/t/zknomics-token-staking-pilot-update-on-timelines/850) a short timeline update on the ZKnomics Token Staking Pilot, noting the team is about 1 month behind its original plan to draft and bring an on-chain TPP proposal to a vote. Citing Devconnect timing and the usual Q4 slowdown, they’ve coordinated with the ZKsync Association to shift the schedule: Season 1 is now targeted for Q1 2026, and Season 2 for Q2 2026.

They also link the sequencing delay to Alex’s broader ZK token utility/value-capture discussion, suggesting that the workstream will help shape how staking should be structured in later seasons. The post frames the extra time as necessary for additional testing ahead of deployment.


### **ZKsync Foundation - Treasury Report**

Demacia [posted](https://forum.zknation.io/t/zksync-foundation-treasury-report/856) a request urging the ZKsync Foundation to publish a treasury report alongside its recent operations/tokenomics update, arguing this is standard practice among major crypto foundations.

They ask for two things: (1) current balances as of end-2025 (ZK, ETH, stables, and other assets) and (2) a category-level historical spending breakdown since inception (e.g., ops/team, grants/investments, infrastructure). The post cites examples from the Arbitrum Foundation and Ethereum Foundation reports and notes that ~2.5B ZK have been minted per the capped minter, making treasury transparency especially important.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events**

[Standing ZKsync Proposal Review Call](https://meet.google.com/qvr-txgr-vja) - on 3.12 at 16:30 UTC.


## **Starknet**


### **Notice of Deprecation For RPC 0.6 and 0.7**

Eitan M. [published](https://community.starknet.io/t/notice-of-deprectation-for-rpc-0-6-and-0-7/116074?_gl=1*1cprrqb*_up*MQ..*_ga*NDYxMTc1NDI1LjE3NjQ3NTg4OTA.*_ga_WY42TERK5P*czE3NjQ3NTg4OTAkbzEkZzAkdDE3NjQ3NTg4OTAkajYwJGwwJGgw) a deprecation notice stating that Starknet JSON-RPC v0.6 and v0.7 are being phased out as the ecosystem standardizes on newer, spec-compliant RPC versions. RPC 0.6 will deprecate on Dec 10, 2025, and RPC 0.7 on Jan 1, 2026. After that, they won’t be maintained for new Starknet releases, and providers may remove support, so teams should upgrade to RPC 0.8+ (0.8/0.9/0.10 recommended) and review clients/SDKs/indexers for any hardcoded RPC version assumptions to avoid service interruptions.


### **New Proposal for StarkWare’s Delegation Program During v2**

Manor [shared](https://community.starknet.io/t/new-proposal-for-starkware-s-delegation-program-during-v2-feedback-request/116078?_gl=1*1cprrqb*_up*MQ..*_ga*NDYxMTc1NDI1LjE3NjQ3NTg4OTA.*_ga_WY42TERK5P*czE3NjQ3NTg4OTAkbzEkZzAkdDE3NjQ3NTg4OTAkajYwJGwwJGgw) a feedback request for an updated StarkWare delegation program tailored to Starknet Staking v2, arguing the validator set and delegator base have grown enough that the current model no longer fits, and that ahead of Staking v3 (targeted ~late 2026), the ecosystem should intentionally support not only new validators, but also a durable “mid-tier” of professional operators.

They outline four possible distribution designs: 

1. keep today’s equal allocation but tighten requirements (e.g., sustained 99% liveness + higher self-stake), 
2. a capped matching program with residual allocation rules, 
3. proportional delegation (simple but potentially concentration-amplifying), and, 
4. a two-track approach splitting delegation between established validators (strong history, higher self-stake, decentralization-friendly caps) and smaller/emerging validators (onboarding and growth). 

Manor leans toward Option D, with a promised transition period and coordination/complementarity with the Starknet Foundation’s separate delegation efforts.


### **Starknet Governance: Updated Voting Process**

Starknet_rafael [shared](https://community.starknet.io/t/starknet-governance-updated-voting-process/116081?_gl=1*1sa7iay*_up*MQ..*_ga*ODYwODEwNzQ1LjE3NjUxOTU1MzU.*_ga_WY42TERK5P*czE3NjUxOTU1MzUkbzEkZzAkdDE3NjUxOTU1MzUkajYwJGwwJGgw) an updated Starknet governance voting process, co-led by StarkWare and the Starknet Foundation, to make voting more predictable and inclusive through a fixed, rolling cadence.

The proposed timeline is as follows: SNIP submissions open until t-4 weeks; community deliberation runs from t-4 to t-2 (SNIP becomes final unless substantive remarks remain); the SNF finalizes and publishes a “marketing” post and queues the vote from t-2 to t-1; and voting happens from t-1 to t. An emergency upgrade can bypass this process.

### **Announcing StarkWare’s DeFi Trading Exploration Initiative**

BoazStark [announced](https://community.starknet.io/t/announcing-starkware-s-defi-trading-exploration-initiative/116082?_gl=1*1sa7iay*_up*MQ..*_ga*ODYwODEwNzQ1LjE3NjUxOTU1MzU.*_ga_WY42TERK5P*czE3NjUxOTU1MzUkbzEkZzAkdDE3NjUxOTU1MzUkajYwJGwwJGgw) that StarkWare is kicking off a DeFi Trading Exploration Initiative on Starknet: a research effort to understand better real trading behavior, liquidity dynamics, execution quality, and end-to-end UX across the ecosystem.

They plan to run small, controlled trading/yield bots, evaluate workflows across wallets, DEXs, lending, bridges, data tooling, and collect hands-on feedback via a small external “Starknet Trading Guild.” The initiative is explicitly not profit-seeking, and StarkWare says it will share high-level learnings over time and is inviting active traders/bot operators/power users to participate.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Everclear**


### **Everclear DAO - Redelegation Strategy**

SEEDGov [published](https://forum.connext.network/t/everclear-dao-redelegation-strategy/1419) an Everclear DAO redelegation strategy aimed at addressing low votable supply and delegate concentration (including 18.42M inactive CLEAR) by using the momentum of Executable CGP 33 to redelegate up to 20M CLEAR and strengthen quorum reliability.

The plan splits the delegation into three buckets: 60% to existing large, highly-active delegates (>250k CLEAR and >50% participation rate, measured through Nov 12), 20% to major non-governance contributors (community/marketing/BD/research), and 20% to aspirational delegates (with an open application thread). All cohorts must maintain a 75% participation rate, reviewed quarterly, or the delegation can be reclaimed/reallocated. The aspirational call runs until Nov 15, with selections targeted by the end of November.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Uniswap**


## **Active Votes**

[Strategic Renewal of Gnosis, Linea, and Mantle Deployments](https://snapshot.box/#/s:uniswapgovernance.eth/proposal/0x1086839122667be04c0eec25ba224fe4ac1b990383ddfe05b80ce201a06b4abf) - ends on December 7 at 15:47 UTC.


### **Uniswap Foundation: Summary Q3’2025 Financials**

The Uniswap Foundation [published](https://gov.uniswap.org/t/uniswap-foundation-summary-q3-2025-financials/25921) its unaudited Q3 2025 financial summary (quarter ended Sept 30, 2025) as part of its transparency series, noting the figures were compiled before the most recent Unification proposal.

As of Sept 30, the Foundation reported $54.4M in USD/stables on hand plus 15.3M UNI and 241 ETH (about $116.6M in token market value at quarter-close), with a projected runway through January 2027. Planned usage earmarked $108.3M for grants/incentives (including $92.4M expected commitments in 2025–26 and $15.8M reserved for previously committed grants to be disbursed) and $32.6M for operating expenses and employee token awards. In Q3, the Foundation committed $0.8M in new grants and disbursed $1.9M; YTD through Q3, it committed $18.8M and disbursed $8.9M. Operating expenses accrued were $2.5M in Q3 (excluding $0.15M in UNI employee token awards), with $0.5M in dividends/interest revenue; YTD revenue (donations + dividends + interest) was reported at $141.4M.

**Upcoming Events**

[Uniswap Community Call](https://meet.google.com/ivd-pihe-vnj) - on 9.12 at 15:00 UTC.


## **Scroll**


## **Active Votes**

[Proposal: Galileo Upgrade](https://gov.scroll.io/proposals/72907322044331380548190357610154468026012921395152333929550231764240959817459) - ends on December 10 at 18:06 UTC.


### **Proposal: Galileo Upgrade**

Ahmed Castro, Filbert Nicholas, and Péter Garamvölgyi [published](https://forum.scroll.io/t/proposal-galileo-upgrade/1315) a governance post to notify the Scroll DAO of the upcoming “Galileo” protocol upgrade and give builders, users, and node operators time to prepare. There’s no funding request; the focus is on a core upgrade that improves sequencer efficiency, updates Scroll with new Ethereum (Fusaka) EVM features, introduces a more resilient rollup-fee model, and delivers a reported ~50% reduction in prover zkVM cycle usage via caching and OpenVM upgrades.

Key stakeholder impacts include: node operators must upgrade l2geth and should plan for blob data availability changes (beacon “supernode” considerations + S3 fallback); users may see a different fee structure tied to blob fee dynamics; developers gain Fusaka-aligned EVM compatibility, but should note secp256r1 precompile gas cost is expected to double and adjust accordingly.


### **Co-Creation Sprint Q4 2025: Scroll DAO 2.0**

Juansito [announced](https://forum.scroll.io/t/co-creation-sprint-q4-2025-scroll-dao-2-0/1323) Scroll DAO 2.0’s Co-Creation Sprint (Q4 2025): a December working sprint where the community reviews and refines governance changes drafted by the Governance Council, to publish one consolidated governance proposal on Jan 1, 2026, for a DAO-wide vote.

The sprint focuses on five categories: delegate framework/requirements, governance mechanisms, org structure, ongoing programs, and an implementation roadmap. To keep it accessible, they’ll run four working sessions per week (Mon + Fri, AM/PM) via the Governance Calendar, aiming to reach alignment by Dec 31.


### **Co-Creation Sprint - Delegation Discussion Thread**

Juansito [posted](https://forum.scroll.io/t/co-creation-sprint-delegation-discussion-thread/1334) a Delegation Discussion Thread as part of Scroll’s Co-Creation Sprint, outlining how delegates could function in Scroll DAO 2.0 and inviting feedback ahead of a dedicated sprint session.

Key ideas include making staked SCR the basis for delegation and quorum, and exploring a future model where a portion of staking yield flows to delegates (proportional to delegated voting power) once staking matures. The post also proposes upgrading “Verified Delegate” from a label into a higher-responsibility role (priority in inactive delegation, eligibility for any future revenue-share, and preference for council/committee roles), plus tools to reduce inactive delegation (e.g., locking staking rewards unless users re-delegate, and an inactive VP pool that can help push proposals over quorum when support is clear).


### **Scroll Delegate Accelerator Program: Final Report & Open-Source Curriculum**

Nneoma_StableLab [published](https://forum.scroll.io/t/scroll-delegate-accelerator-program-final-report-open-source-curriculum/1330) the final report for Scroll’s Delegate Accelerator pilot and open-sourced the full curriculum. The 8-week program (Aug–Sep 2025) graduated 21 of 29 participants (72.4%), with 75.9% average attendance, 4.37/5 satisfaction, and 100,000 SCR set aside for delegation to graduates.

They also shared a public curriculum repository (8 weekly modules, exercises, facilitator guides, and grading rubrics). They noted that ScrollDAO is governance restructuring via a Co-Creation sprint, so they plan to extend delegate performance tracking once the new framework stabilizes.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events**

[CoCreation Sprint AM Session](https://meet.google.com/ung-vysq-vgm) - on 8.12 at 15:00 UTC.

[Carroll Mechanisms Community Working Session](https://meet.google.com/phu-drwp-jwt) - on 8.12 at 17:00 UTC.

[Weekly DAO & Governance Call](https://meet.google.com/fut-dgwp-tcn) - on 10.12 at 15:00 UTC.

[Scroll Delegate Proposal Bonanza](https://meet.google.com/zfd-asoc-rmx) - on 11.12 at 17:45 UTC.

[CoCreation Sprint AM Session](https://meet.google.com/crg-sqte-may) - on 12.12 at 15:00 UTC.


## **Polygon**


### **PIP: Extend PIP-69 to include an enshrined ERC-7575 vault to standardize staked POL on Polygon, Katana, or other chains**

Cupojoseph [posted](https://forum.polygon.technology/t/pip-extend-pip-69-to-include-an-enshrined-erc-7575-vault-to-standardize-staked-pol-on-polygon-katana-or-other-chains/21456) a temp-check proposing to extend PIP-69 by adding an ERC-7575 vault to unify staked POL liquidity into a single, standardized liquid staking token (potentially enshrined or left to competing third-party implementations).

The motivation is that PIP-69 would turn validator share positions into ~100 separate ERC-20s, which is better for composability but still fragments liquidity. An ERC-7575 vault could accept those different validator-share tokens and mint a single “staked POL” asset. Still, it would need explicit pricing/curation logic (since ERC-7575 doesn’t assume 1:1 parity) to account for validator-specific yield and potential slashing risk. The post also points to a later step: adding cross-chain messaging so the same LST can be minted on Polygon, Katana, or other aligned chains.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Lisk**

SuperchainEco [published](https://forum.lisk.com/t/lisk-dao-season-2-report/626) a work-in-progress Lisk DAO Season 2 Report (from May 14 until Dec 17, 2025), with the final version planned for later in December.

Season 2 directed 3,925,000 LSK total (including 3,750,000 LSK for ecosystem growth) across grants, incentives, ambassadors, and accelerators, approving 11 milestone-based grants out of 61+ applications. Highlights include launching LiskDAO.com, supporting Superchain integrations like Kyo Finance, a Quidax incentive to drive African on/off-ramp usage, and a Year-End Builder Reward Campaign (135,000 LSK) rewarding December activity based on usage metrics; a town hall is set for Dec 10.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.
