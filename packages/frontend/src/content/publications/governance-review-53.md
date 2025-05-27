---
title: "Governance Review #53"
description: "The Month is ending, but activity, votes, and governance discussions continue strong."
publishedOn: "2025-05-26"
authorId: manuel-gonzalez
---

## **Optimism**


### **The Future of the Anticapture Commission**

The Anti-Capture Commission [has published](https://gov.optimism.io/t/the-future-of-the-anticapture-commission/9934) an open discussion draft asking whether it still plays a helpful role, three seasons after its creation as Optimism’s meta-governance watchdog. The paper reviews the ACC’s original mandate (10 M OP delegated from the Governance Fund, a hotline to the Citizens’-House veto, and a brief to flag capture risk), traces how it has operated under successive leads, and itemises the handful of moments when it acted decisively—raising the alarm over an undisclosed governor-contract change, backing an upgrade despite fault-proof concerns, and declining to spearhead the “accelerated decentralisation” push. The authors note that today the 26-member body, plus its 11 M-OP safe, could single-handedly meet quorum if it voted in lock-step. Yet, it lacks formal tools or frameworks to spot or block capture, and its internal 10-of-26 snapshot threshold means barely 1.6 M OP could swing the Commission’s wallet. With over a billion OP tokens set to unlock in the next two years, the draft offers three broad paths: slim the ACC to a lighter, research-oriented group; give it explicit on-chain kill-switch powers alongside the Security Council; or sunset it entirely once more decentralised checks are in place. An open list of questions—ranging from whether the ACC should vote on every proposal to how it might coordinate with the Citizens’ House in a post-Foundation world—invites the Collective to weigh in before any charter rewrite or dissolution vote moves forward.

**Discuss with L2BEAT**

You can find us to discuss everything related to Optimism’s governance, from current initiatives to high-level conversations, during our [Optimism Office Hours](https://l2beat.com/governance/publications/meet.google.com/pem-jzrh-gkq) every Tuesday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Budget Board Community AMA](meet.google.com/bru-ttim-czz) - on 27.5 at 18:00.

[govNERDs Community Office Hours](meet.google.com/eqb-dfkk-mui) - on 27.5 at 19:00.


## **Arbitrum**


## **Active Votes**

**Onchain**

[AIP: ArbOS Version 40 Callisto](https://www.tally.xyz/gov/arbitrum/proposal/13108804573775967668959825241666341617107666532012387058509418598838035461528?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) - ends on May 29 at 19:14 UTC.

**Temp-check**

[AIP: Constitutional Quorum Threshold Reduction](https://v1.snapshot.box/#/arbitrumfoundation.eth/proposal/0x2d4089d72617eb137d6ee7ab9ae9efbe3cd1e0fcff48df24b926ce6259b734d3) - ends on May 29 at 15:00 UTC.


### **[RFC] Proposal to Adjust the Voting Power of the Arbitrum Community Pool & Ratifying the Agentic Governance Pivot**

We (L2BEAT) have [published](https://forum.arbitrum.foundation/t/rfc-proposal-to-adjust-the-voting-power-of-the-arbitrum-community-pool-ratifying-the-agentic-governance-pivot/29280) an RFC asking the DAO to adjust the VP of the Event Horizon’s Voter Enfranchisement Pool. The proposal mentions that almost all of the pool’s current voting weight still comes from that treasury delegation. Yet, the original goal of crowd-sourcing thousands of small holders into manual governance has morphed into an AI-agent experiment that was never formally authorized. L2BEAT praises Event Horizon’s willingness to iterate but argues the pivot should be ratified and the risk-free voting block shrunk until the community sees concrete results from the new “agentic” design.

The Snapshot voting will start  on 29 May with three choices: \
 A) Leave the full 7 million ARB in place and ratify the pivot; \
 B) Recognise the pivot but cut the delegation to 100,000 ARB, keeping the pool relevant yet unable to swing outcomes; \
 C) Unwind the programme entirely and return all 7 million ARB to the treasury.


### **Arbitrum Audit Program - Audit Firms Application Process**

Arbitrum Foundation [has published](https://forum.arbitrum.foundation/t/arbitrum-audit-program-audit-firms-application-process/29245) a call for applications that outlines how security firms can join the newly approved Arbitrum Audit Program. This year-long subsidy scheme will pay (in part or whole) for third-party smart-contract audits across the ecosystem. Interested vendors must show fresh references for Solidity—and ideally Stylus or Vyper—work, pass a document review and a 45-minute technical interview, and agree to transparent scoping, tool disclosure, and post-mortem participation. Pricing models, bandwidth, and individual auditor résumés will factor heavily in the selection; approval under the old ADPC subsidy does not guarantee a slot. Finalists will appear on a public roster and help the Audit Committee—composed of Foundation, Offchain Labs, DAO-elected experts, and (eventually) OpCo—match projects to the right reviewers. Applications are open until 30 May 12:00 UTC, with rolling evaluations thereafter.


### **Wind Down the MSS + Transfer Payment Responsibilities to the Arbitrum Foundation**

Entropy [has published](https://forum.arbitrum.foundation/t/wind-down-the-mss-transfer-payment-responsibilities-to-the-arbitrum-foundation/29279) a proposal formally discussing ending the Multisig Support Services (MSS)  experiment and handing every payment-processing duty to the Arbitrum Foundation.

When delegates approved MSS in April 2024, the DAO was running six program wallets; right now, there are eight. The 600k ARB budget that funds R3gen’s token-report contract, plus stipends for twelve signers, is projected to run dry before August because ARB’s price has halved. Over the past year, nearly every payroll action has already required Foundation sign-off for KYC and compliance, so the authors argue that keeping a separate, paid committee offers little benefit while adding delay and operational risk.

The plan is to transfer the seven active program safes—Delegate Incentives, Stylus Sprint, Hackathon Continuation, 2025 Events, Event Horizon, ADPC Subsidies, and ARDC-V2—to Foundation control by mid-June, with the Foundation splitting each pot into its wallet for continued transparency and pledging informal updates when needed. The sole wallet that would stay under MSS is its payroll safe, so it can settle the two remaining R3gen invoices and pay members half-month compensation for June; any excess ARB would be returned to the treasury, and the committee dissolved.

A Snapshot scheduled for 29 May will ask whether to proceed with this wind-down or send the authors back to redesign the MSS funding and structure.


### **Proposal for Optional Integration of Quack AI Governance Module on Arbitrum**

Quack _Intern [has published](https://forum.arbitrum.foundation/t/proposal-for-optional-integration-of-quack-ai-governance-module-on-arbitrum/29264) a post proposing letting projects and holders opt in to Quack AI, an application-layer governance assistant that would complement Snapshot and on-chain voting rather than replace them. The module would deliver auto-generated proposal digests, risk/benefit scoring, forum-thread sentiment maps, and a “smart delegation” panel where users can point their ARB to human delegates or Quack’s own AI agents— all fully transparent and revocable. Because the system lives off-chain and touches no core contracts, manual voting and Snapshot flows stay intact; if delegates want nothing to do with AI, nothing changes for them. Quack’s team asks only for API access to forum metadata and a green-light to run the pilot, arguing it could lift turnout, shrink quorum-miss risk and give the DAO richer, quicker context on every vote.


### **How BVP Benefits the Arbitrum DAO**

Brandon BVP [has introduced](https://forum.arbitrum.foundation/t/intro-big-vision-pictures-bvp-bringing-on-chain-film-infrastructure-to-arbitrum/29270) Big Vision Pictures (BVP), a studio-in-the-making that plans to launch a $BVP ERC-20 on Arbitrum One on 9 September and run all its film-finance rails on Orbit subchains. The team already has the token, staking contract, and gas router live on Arbitrum Sepolia; a private Orbit L2 is up for payroll, staking tiers, and fan-governance votes, and R&D sketches show future L3 modules for NFT ticketing, interactive story voting, and franchise-specific DAOs. A public, co-governed “Arbitrum DAO-aligned” subchain is also being drafted to let delegates steer IP decisions and bankroll on-chain productions. BVP argues that Orbit sovereignty, Nitro throughput, and ERC-4337 wallets make Arbitrum the natural home for cinema-grade fan economies and says an official proposal and grant request will follow once the first on-chain pilot rolls out later this year.


### **Incentive Program Assessments & Recommendations**

CastleCapital, writing as the Research Member of ARDC V2, [has published](https://forum.arbitrum.foundation/t/incentive-program-assessments-recommendations/29276) a deep report that audits every incentives programme the Arbitrum DAO has run so far and cross-checks them against schemes on Optimism, zkSync, Sonic, and Avalanche. Working with DefiLlama Research, the team lays out a “DAO Incentives Timeline,” clarifies initial reviews, and introduces a granular evaluation framework that scores design intent, implementation, effectiveness, and adaptability. Mini-sized internal and external tables give delegates a quick read on STIP, Backfund, Bridge, and LTIPP versus rival models; full appendices back that with protocol-level data, retention studies (a Compound-under-LTIPP case-study shows how sticky volume was post-subsidy), and survey feedback from builders. The Google Doc is fully tabbed for navigation, and collapsible copies of each section are embedded in the post. Key recommendations urge the DAO to anchor future emissions to measurable objectives, bake retention metrics into milestone payouts, and formalise an adaptable template so programmes can be paused or re-weighted mid-cycle instead of waiting for another governance vote. Delegates, builders, and Foundation staff are invited to mine the dataset and weigh in before the next incentive tranche is scoped.


### **Advancing Gaming on Arbitrum – AGV Strategic Report**

ArbitrumGaming [has published](https://forum.arbitrum.foundation/t/advancing-gaming-on-arbitrum-agv-strategic-report/29295) a strategic-ops primer for Arbitrum Gaming Ventures (AGV) – the DAO-backed fund charged with turning Arbitrum into a first-choice home for Web3 games while earning long-term upside for the treasury. 

The note goes through AGV’s plan: deal-sourcing channels (half of the early funnel now comes via AAEs), diligence gates, Investment-Committee sign-off, legal/KYC checks, and milestone-based post-investment oversight. A quarterly scoring framework grades every portfolio team on product progress, user retention, revenue, and ecosystem contribution; top performers can get pro-rata follow-ons and go-to-market help, laggards face pivot support or structured wind-downs.

**Discuss with L2BEAT**
You can find us to discuss everything related to Arbitrum’s governance, from current initiatives to high-level conversations, during our [Arbitrum Office Hours](https://l2beat.com/governance/publications/meet.google.com/jkj-nnop-arc) every Thursday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[DeFi Education Fund Community Call](meet.google.com/kjb-tgss-skw) - on 27.5 at 17:00.

[Treasury Management Committees Discussion #3](https://arbitrum.huddle01.app/room/kjz-xmhs-hcb) - on 28.5 at 16:00.

[Bi-Weekly ARDC Office Hours](https://huddle01.app/room/dvb-zlbw-yus) - on 29.5 at 16:00.


## **Uniswap**


## **Active Votes**

**Temp-check**

[Uniswap Accountability Committee S4 Elections](https://v1.snapshot.box/#/uniswapgovernance.eth/proposal/0xb9a79884fab779132907835d8c6360b781ed0a17c8a33ac41594a27f6c366ce4) - ends on May 27 at 00.00 UTC.


### **Uniswap Foundation: Summary Q1’2025 Financials**

Nataliara [has released](https://gov.uniswap.org/t/uniswap-foundation-summary-q1-2025-financials/25622/1) the Uniswap Foundation’s Q1 financial report that covers the period from 01 January to 31 March 2025, the first full report since the “Uniswap Unleashed” governance package passed. At quarter-end, the Foundation controlled roughly $95 million, split between $53.4 million in cash or stables, 15.8 million UNI, and 257 ETH; another five million UNI sat off-chain as collateral backing a $29 million loan that supplies additional fiat liquidity without forcing token sales. The budget mapped those resources through January 2027: about $115 million earmarked for grants (nearly $100 million to be committed in 2025-26 and $15 million reserved for previously approved awards) and $33 million for operating costs and employee token incentives.

During Q1, the team authorised $12.4 million of fresh grants but actually disbursed only $2.1 million. $9.9 million of the new commitments stretch out to 2026-29 and carry claw-back clauses that let Unichain Partners reimburse the treasury if specified growth targets are met. Strategy for the period centred on four tracks: catalysing liquidity via incentive programmes, expanding the developer/tooling moat, preparing sustainable revenue and governance structures (including potential legal-entity work and validator support), and recruiting protocol-aligned core contributors.

Operating spending for the quarter totalled $1.9 million, mainly salaries, legal and audit fees, travel and event costs, and software; an additional $0.1 million was booked as UNI-denominated employee awards. On the income side, the Foundation recognised $140.3 million in donations, dividends, and interest, the bulk stemming from the large UNI donation authorised in the Unleashed proposal.

The post includes a detailed breakdown of commitments, disbursements, and category-by-category operating outlays. The team promises a Q2 update next, followed by audited FY 2024 statements already available for public review.

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://l2beat.com/governance/publications/meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[DEF Community Call](meet.google.com/kjb-tgss-skw) - on 29.5 at 17:00.


## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://l2beat.com/governance/publications/meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Hop Community Call](https://discord.com/events/789310208413270078/1208466459312001169 ) - on 28.5 at 17:00.


## **Polygon**


### **PIP-66: Allow early block announcements on PoS**

Manav2401 [has drafted PIP-66](https://forum.polygon.technology/t/pip-66-allow-early-block-announcements-on-pos/20976), a core upgrade for Polygon PoS that would let the validator scheduled as primary broadcast its block as soon as it is built, often 500 ms after the previous block, rather than idling until the full two-second slot expires. The tweak amends Bor’s consensus logic so primary proposers subtract the standard “period” from “header.Time”, releasing the payload early. At the same time, verifiers accept that shorter leads only for succession 0 and reject any premature headers from backup signers. By cutting the network’s idle time, the authors expect faster propagation, fewer orphaned blocks, and lower re-org risk; non-primary validators keep the existing timetable, preserving fairness. The change alters consensus rules and therefore requires a hard fork, but the authors argue it adds no new attack surface because timing checks still bar future-dated blocks from secondary proposers.


### **Tesseract: S1 Impact Report**

Aztec [has published](https://forum.polygon.technology/t/tesseract-s1-impact-report/20968) Tesseract’s Season-1 impact report, detailing how the accelerator helped 9 Polygon-funded start-ups through its “Track & Funnel” playbook of tailored marketing audits, BD intros, and community campaigns. Over the quarter, the programme set project-specific road-maps, plugged teams into partners like QuickSwap, Cookie3, and Dabl Club, and racked up 122,000 social-media engagements through interactive cohort challenges.

The surveys show a 90% overall satisfaction rate, 86% of founders feeling ready to operate solo, and a unanimous willingness to recommend the course. Lessons for Season 2 include smoother onboarding docs, lighter-touch tracks for bandwidth-strained teams, and an internship scheme to embed up to 100 new community contributors across the Polygon builder pipeline. Aztec closes by urging tighter coordination among Polygon’s existing support nodes—from Thrive and Q/Acc through Tesseract, Dabl Club, and Hadron—so grant recipients find a “sticky home” instead of chain-hopping for the next subsidy.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://l2beat.com/governance/publications/meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Starknet**

Starknet’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://l2beat.com/governance/publications/meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Everclear**

Everclear’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Everclear Delegates Call](meet.google.com/zcv-aqph-pcj) - on 29.5 at 14:00.


## **Wormhole**


## Active Votes

[WIP-1: Ratification of Code of Conduct for Wormhole Governance](https://www.tally.xyz/gov/wormhole/proposal/69892078890661102806744763122017665457499503026694970277189718732036784909161?govId=eip155:1:0x239B1F17E6Efa75662cB87781025538babF1Cf6b) - ends on May 30 at 15:11 UTC.

[WIP-2: Ratification of Wormhole Governance Proposal Process](https://www.tally.xyz/gov/wormhole/proposal/85280369263780081188605485888774324166542416516834239378857741400139505237053?govId=eip155:1:0x239B1F17E6Efa75662cB87781025538babF1Cf6b) - ends on May 30 at 15:13 UTC.


### **WIP-1: Ratification of Code of Conduct for Wormhole Governance**

Wormhole Foundation [has published](https://forum.wormhole.com/t/wip-1-ratification-of-code-of-conduct-for-wormhole-governance/773) WIP-1, a draft proposal that asks the Wormhole community to ratify a formal Code of Conduct before on-chain governance begins. The document lays out nine plain-language rules—stay on topic, show respect, argue with evidence, keep discussions legal, protect privacy, encourage diverse viewpoints, follow the moderators’ guidance, and accept that repeat or serious breaches can lead to suspension or bans—together with a set of moderation principles focused on civility, inclusivity and lawful behaviour. Because the quorum for Wormhole’s inaugural Tally vote is pegged at 350 million W, the voting started on May 23 and needs that threshold to be reached for the code to become binding.


### **WIP-2: Ratification of Wormhole Governance Proposal Process**

Wormhole Foundation [has published](https://forum.wormhole.com/t/wip-2-ratification-of-wormhole-governance-proposal-process/774) WIP-2, a draft that asks token-holders to ratify the formal, seven-step workflow that every Wormhole governance proposal must follow. Ideas will move from open brainstorming to a detailed draft on the forum, through a five-day comment window, then to a three-day Snapshot “temperature-check” (quorum 115 million W). Successful drafts are reposted as final proposals, left for at least three days of last-look review, and then enter an on-chain Tally vote: a two-day voting delay, five-day voting window, 1 million W proposal threshold, and 350 million W quorum. Passed measures wait four days in time lock before execution; only off-chain actions are permitted. The Foundation may veto proposals that breach legal or compliance bounds, but authors can revise and resubmit after a 30-day cooling-off period. The voting started on May 23  and, like WIP-1, needs 350 million W cast to take effect.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://l2beat.com/governance/publications/meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Lisk**

Lisk’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://l2beat.com/governance/publications/meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **ZkSync**


## Active Votes

[[ZIP-10] Activate ZK Gateway as a Settlement Layer](https://www.tally.xyz/gov/zksync/proposal/97689115420129047109255183628089175185608660755000395855946331923921270505453?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f) - ends on May 26 at 14:31 UTC.

[[ZIP-11] V28 Precompile Upgrade](https://www.tally.xyz/gov/zksync/proposal/54063168049426383294336598998322383147338444177076559098597792110160570100155?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f) - ends on May 26 at 14:28 UTC


### **Standing Delegate Call May 27 - Thread**

Theshelb has opened a [new forum thread](https://forum.zknation.io/t/standing-delegate-call-may-27-thread/687/1) to crowd-source the agenda for ZKsync’s next Standing Delegate Call, set for Tuesday, 27 May. Delegates are invited to post topics they’d like covered—along with a short rationale—in the thread; other members can “like” suggestions to signal priority. On the morning of the call, Shelby will tally the most-liked items, circulate a draft agenda, and then use it to guide the session. A calendar link is provided so delegates can add the recurring meetings, and background on the call format is available in the earlier “Standing Delegates Call” explainer. The provisional agenda already lists quick proposal updates and a deeper look at “Key Benefits of Capped Minters,” but additional discussion points are actively solicited.


### **Trigger Mod: Building Permissionless Pathways by Extending the Capped Minter Framework**

Matt_FactoryLabs [has published](https://forum.zknation.io/t/trigger-mod-building-permissionless-pathways-by-extending-the-capped-minter-framework/689) a deep dive on “Trigger Mod,” an architectural extension to ZKsync’s Capped Minter framework to automate “mint-on-demand” token flows for future Token Programme Proposals. Working with Factory Labs’ Dr Nick, the post explains how a new contract—ZkMinterModTriggerV1.sol—sits between an authorised Capped Minter and any downstream contract, minting only when a target address calls for funds, approving those tokens, and passing them through in the same transaction. By removing multisig intermediaries, the design aims to cut custody risk and speed distributions and let programmes such as Merkle-tree airdrops, DeFi incentives, or service-provider payouts run on fully permissionless rails. The post walks through code structure, access-control rules, example integrations (including a MerkleDropFactory), and the broader goal of making these “trigger mods” a canonical pattern for future TPPs. Repository links and deployed addresses will be added once contracts are live.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://l2beat.com/governance/publications/meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Standing ZKsync Proposal Review Call](https://meet.google.com/txe-trwh-zha ) - on 27.5 at 16:30.


## **Scroll**


### **Korea Local Node - Regional Evaluation**

Pagoda [has posted](https://forum.scroll.io/t/korea-local-node-regional-evaluation/750) a sweeping “Korea Local Node – Regional Evaluation,” arguing that South Korea’s uniquely intense retail trading culture, rigid regulatory climate, and still-nascent on-chain builder scene make the country a high-leverage beachhead for Scroll’s next local-node expansion. The report notes that 6.5 million Koreans—roughly one in eight adults—trade crypto through KYC-heavy exchanges such as Upbit and Bithumb, creating daily volumes that push Upbit to #2 globally, yet DeFi usage remains negligible because capital controls, travel-rule wallet whitelists, and post-Terra political caution keep activity walled inside CEXs. Pagoda sketches a builder map that spans infrastructure outfits like LayerBank and Wallet projects such as WePin, highlights 13 active university clubs, recurring events from ETH Seoul to Korea Blockchain Week, and lists research houses (Xangle, Despread) that feed a teeming Telegram culture of airdrop hunters and retail traders. With presidential candidates suddenly touting a KRW stablecoin and institutions testing crypto allocations, Pagoda says the moment is ripe for a Scroll node that can seed Ethereum-aligned culture: dev-education, permissionless DeFi pathways, and community governance tools that move Koreans beyond “Kimchi-premium” speculation toward actual on-chain participation.


### **Argentina Local Node- Proposal**

SEED Latam asks Scroll DAO for $58,772 to run a six-month [Argentina Local Node](https://forum.scroll.io/t/argentina-local-node-proposal/735/2) that turns the country’s deep well of crypto talent into Scroll-native founders. Work is split into two three-month modules. On the builder side, SEED partners with Nerdconf, Aleph Hub, and Crecimiento’s “Founder School” to shepherd devs from small, bounty-driven hacks to polished MVPs; top teams will surface at a Nairobi-style demo day and be channelled into Open Zero. In parallel, the node sends a travelling “Gira SEED” road-show across Mendoza, Neuquén, and Chaco, layering morning co-working with afternoon Scroll workshops so that regional universities and dev clubs can plug straight into the L2.

Education and community support run the entire time. A Spanish Scroll track in SEED’s Gitbook and website will publish at least four deep-dive articles covering zk-basics, Ceno zkVM, product design, and tooling. At the same time, a dedicated Discord channel evolves into the local help desk. Success is framed as two Scroll deployments, three nationwide meet-ups, four educational releases, and a tangible uptick in Argentine mindshare; detailed Notion dashboards and monthly progress calls keep the DAO in the loop.


### **Kenya Scroll Node Founder Program Proposal**

Web3Clubs, Nairobi’s flagship Web3 incubator, [created a proposal](https://forum.scroll.io/t/kenya-scroll-node-founder-program-proposal/730) requesting $30,000 for a fast-paced, three-month founder factory to launch five to ten Scroll-powered prototypes and weave the chain into East Africa’s fintech rails. The sprint moves through three Swahili-themed phases—Msingi (foundation), Daraja (bridge), and Vuka (cross)—blending boot-camps at the group’s physical lab with mentor tracks covering DeFi liquidity, TradFi integrations, local-stablecoin design, and regulatory sand-box prep. The cohort then slots into Scroll’s global Open Zero curriculum for six weeks of MVP polishing, demo-day coaching, and growth planning.

Anchored by a 5,000-member builder community and plugged into partners such as the Nairobi Securities Exchange, ViFi, and the Capital Markets Authority, the programme sets hard KPIs: at least three TradFi pilots, three regulatory sandbox applications, and a seventy-strong Scroll developer audience. A lean US$17.4k personnel budget, US$8.6k for ten in-lab boot-camps plus demo day, and US$3k in builder bounties round out the spend. Progress will be tracked through CRM dashboards, on-chain analytics, and monthly public reports to ensure the DAO sees concrete traction in one of Africa’s quickest-growing crypto markets.


### **Brazil Local Node Proposal**

ModularCrypto is requesting $29,994 for a three-month “[Brazil Local Node](https://forum.scroll.io/t/brazil-local-node-proposal/737)” to seed a home-grown Scroll builder scene and feed promising teams into future editions of Open Zero. The plan's backbone is “Programa de Aceleração Scroll Brasil,” a one-month, Portuguese-language mini-accelerator that runs in June with live classes, weekly homework, and one-to-one mentorship. Top projects will receive cash prizes, travel support, and a guaranteed berth in subsequent Scroll programmes, while all educational material and recordings live on a public Notion hub.

To give these founders real-world visibility, the node adds three in-person meet-ups—in Florianópolis, São Paulo, and Rio de Janeiro—timed around Brazil’s main crypto gatherings. Each event combines Scroll workshops with open pitch sessions and is expected to draw 80–150 attendees. ModularCrypto will publish deep-dive research and seminars in Portuguese, grow the Scroll-PT Discord channel into an active support desk, and run targeted outreach to universities, dev clubs, and KOLs. Success will be measured by the number of Brazilian projects that stay on Scroll, community engagement metrics, and the quality of builders funneled into the broader Scroll ecosystem; monthly public reports and calls with the Foundation will track progress.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

**[Weekly DAO & Governance Call](meet.google.com/nug-uygx-hbd)**- on 28.5 at 11:30.

**[Weekly DAO & Governance Call](meet.google.com/pcm-nxzr-rig)**- on 28.5 at 17:00.