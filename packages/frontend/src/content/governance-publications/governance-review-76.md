---
title: "Governance Review #76"
description: "Networks tune fees, councils reset, treasuries get to work."
publishedOn: "2025-11-11"
authorId: manuel-gonzalez
---

## **TL;DR**

***On Optimism, Onchain Controls MVP goes to a Nov 12 vote. Upgrade 17 combines fee response improvements with Fusaka readiness, targeting mainnet execution on Nov 26 and activation on Dec 2 ahead of L1 on Dec 3. The Liquid Staking RFP opens OP native proposals with review on Nov 21 and decisions around Dec 5, allocating about 40% of treasury ETH toward yield and on-chain liquidity.***

***On Arbitrum, AGV seeks reconfirmation of Tim Chang and John Kennedy while the 2026 election runs Nov 7 through Dec 4. Offchain Labs proposes multi-target gas pricing and a bounded two-year mandate to tune within DAO limits to reduce fee spikes. Almanax requests 100k ARB for AI code audits across 100 projects and looks well-suited for the Domain Allocator track. DRIP leans into USD markets as lending size and total loans rise despite lower TVS.***

***On ZKsync, TPP 13 fixes the missed minter role from TPP 11. ScopeLift’s TPP 14 and GAP 4 shorten vote delay and late quorum extensions to three days and two days, mirroring ZIP settings. Matter Labs reports 200 ms block times, interop messaging, fast subjective finality, solx beta gains, and Era settling via Gateway. A token utility draft would route interop fees and enterprise licensing into ZK buybacks, with allocations for burning, staking, and treasury under governance.***

***Elsewhere, Polygon prepares the Madhugiri hard fork and a one-second consensus period with sub-second producer tuning. A Starknet brief highlights participation and treasury concentration risks along with suggestions for transparency and diversification. Protofire requests that Uniswap recognize Flow as a canonical v3 deployment via Flow Swap, utilizing Axelar bridging. Scroll advances an auto abstain wallet extension vote and hosts governance calls.***


## **Optimism**


## **Active Votes**

[Governor Upgrade Proposal: Onchain Controls MVP](https://vote.optimism.io/proposals/98514033075828457515265808158613519042911506455163747732265774291262567775647) - ends on November 12 at 19:54 UTC.


### **Upgrade 17 - Jovian Hardfork and Fusaka Readiness**

Geoknee [created a proposal](https://gov.optimism.io/t/upgrade-17-jovian-hardfork-and-fusaka-readiness/10400/1) that upgrades OP Stack chains with “Upgrade 17: Jovian Hardfork and Fusaka Readiness,” running off-cycle to integrate fee-mechanism improvements and L1 Fusaka compatibility into a single release. Jovian updates Cannon to Go 1.24, introduces a minimum base fee, and a data-availability footprint block limit. Hence, L2 fees react faster to block composition and refine the optional operator fee path. At the same time, Fusaka Readiness adapts op-geth, op-node, op-program, and specifications to Ethereum’s PeerDAS and BPO changes, ensuring that OP Stack chains do not halt or misprice blobs when L1 activates. The upgrade ships new contracts and an absolute prestate for chains with permissionless fault proofs, requires node operators and fault-proof infra to update, and is slated for mainnet execution on November 26 with activation on December 2, ahead of L1 Fusaka on December 3 and subsequent BPO fork increases in blob capacity.

**L2BEAT’s take**

We welcome the aim of keeping OP Stack chains aligned with Fusaka while improving fee response speed. We will review the proposal in depth with our Research Team before stating a final position.


### **Liquid Staking RFP**

Budget_Board [published an RFP](https://gov.optimism.io/t/liquid-staking-rfp/10365) to deploy roughly 40% of the Collective’s ETH treasury into liquid staking on OP Mainnet, targeting sustainable yield, deeper on-chain liquidity, and ecosystem growth while the remaining reserves and previously approved institutional staking continue separately. The call invites teams to propose OP-native LST solutions and detail architecture, audits, governance, and upgrade paths, as well as liquidity and regulatory risks, historical and projected yields, fee schedules, and concrete plans to grow OP Mainnet integrations, ensuring that all benefits route back to the Collective. Submissions will be scored on strategic impact, risk profile, and transparent reporting, with a simple risk-adjusted framework that weighs liquidity, net yield, and ecosystem benefit against an explicit risk score, and with a preference for mature, well-audited, formally verified, bug-bountied protocols with clean slashing records and at least a year of incident-free mainnet operation. The process runs as follows: submissions are received on November 7, reviewed, and feedback is provided by November 21, and final approvals are expected around December 5. The Foundation retains custody via a third party, with the ability to withdraw or reallocate funds, and requires that all yield and incentives accrue back to the treasury.


## **Arbitrum**


## **Active Votes**

[AGV Council Compensation Calibration: Startup-Phase Bonus for Current Council Members](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0x23702e34d0ffdabe6e17315f81daaf4119a36d108326473a6e063a35da5ba281) - ends on November 13 at 11:00 UTC.


### **2026 AGV Council Elections: 2-Seat Council Nominations for Reconfirmation**

ArbitrumGaming [asks](https://forum.arbitrum.foundation/t/2026-agv-council-elections-2-seat-council-nominations-for-reconfirmation/30196) the DAO to reconfirm two continuity seats for the 2026 AGV Council, nominating Tim Chang for venture and investment expertise and John Kennedy for game development and go-to-market leadership, to preserve institutional knowledge and consistent oversight while other seats refresh through the broader election.

**L2BEAT’s take**

Tim Chang and John Kennedy bring relevant experience and seem well placed to provide continuity; our recommendations are to accompany reconfirmation with clearer KPIs linked to 2025 outcomes and forward targets, more regular public reporting on pipeline and post-investment performance, and lightweight guidelines that clarify accountability and conflicts for continuity seats.


### **2026 AGV Council Elections: Timeline**

ArbitrumGaming [opened applications](https://forum.arbitrum.foundation/t/2026-agv-council-elections-timeline-and-process-overview/30195) for the 2026 AGV Council, with a hybrid process that reconfirms two continuity seats in parallel while electing three additional seats. Candidates apply for one core competency only (venture, BD/growth, governance & policy, strategy/ops, or game dev/GT-M) and must meet KYC and conflict-of-interest requirements. Key dates: applications run Nov 7–23 (UTC), reconfirmation votes for the two nominated continuity seats run Nov 13–20, applicant verification is Nov 24–27, the DAO election runs Nov 27–Dec 4, electee verification is Dec 5–12, and the new term begins Jan 1, 2026, with a December transition. The council’s mandate is strategic oversight of AGV’s investments, grants, and partnerships to advance Arbitrum gaming, with 12-month terms and annual re-elections.


### **AIP: Raise the gas target & implement improvements to the pricing algorithm**

Offchain Labs [proposes](https://forum.arbitrum.foundation/t/aip-raise-the-gas-target-implement-improvements-to-the-pricing-algorithm/30182) a constitutional AIP for Arbitrum One and Nova that replaces the single 7 Mgas/s, 102-second EIP-1559-style target with multiple overlapping gas targets and long adjustment windows to dampen price spikes during demand surges. The initial configuration introduces six targets from 60 to 10 Mgas/s with windows from 9 seconds to 86,400 seconds, making 10 Mgas/s the long-term effective target; Offchain Labs also requests a two-year, DAO-bounded delegation to add or modify up to 10 targets within 7–100 Mgas/s and 5–86,400 seconds via a new, audited ResourceConstraintManager contract. The change aims to reduce peak L2 gas volatility without overcommitting capacity, acknowledges tradeoffs like faster state growth and higher node specs (raising Nitro full-node minimums to 64 GB RAM, 8 CPUs, NVMe), and commits to audits, on-chain activation, continuous monitoring, and iterative parameter tuning at no additional DAO cost.

**L2BEAT’s take**

We think the objective of smoothing L2 fee volatility is directionally valuable, and we will have our Research Team review the modelling, safety margins, hardware assumptions, delegation bounds, and observability before forming a position; as part of that review we suggest clarifying the monitoring plan, rollback criteria, and reporting cadence, publishing reproducible simulations and the Trail of Bits report alongside clear KPIs.


### **[Non-Constitutional] Partnering with Almanax to provide 100 ecosystem projects with subscriptions for regular AI code audits as well as continuous security review through CI/CD integration**

Almanax [proposes](https://forum.arbitrum.foundation/t/non-constitutional-partnering-with-almanax-to-provide-100-ecosystem-projects-with-subscriptions-for-regular-ai-code-audits-as-well-as-continuous-security-review-through-ci-cd-integration/30185) a non-constitutional grant of $100,000 in ARB to fund one-year premium subscriptions for 100 Arbitrum ecosystem projects, giving them on-demand AI code audits plus continuous CI/CD scanning, triage, and auto-patch suggestions across smart contracts and broader software stacks; an optional $25,000 add-on would fund a custom Arbitrum-tuned agent built on a benchmark dataset, with training, deployment, and maintenance over months one to twelve. The pitch argues for lower false positives and higher recall than legacy static analyzers, coverage that extends beyond Solidity into Go and Rust, and ecosystem-wide risk reduction by shifting detection left without excluding smaller teams.

**L2BEAT’s take**

We see clear potential in expanding baseline security with CI-integrated analysis; given the scope and delivery model, this looks like a strong fit for the DAO’s Domain Allocator program, so we recommend contacting the program leads to submit a formal application and align milestones and oversight.


### **DRIP October 2025 Update**

Season One’s performance phase [kicked off](https://forum.arbitrum.foundation/t/drip-october-2025-update/30187) with USD-denominated markets prioritized and Aave incentives paused and banked. Across epochs 3–5, 3.58M ARB from the base budget and 325k ARB from the discretionary budget were directed mainly to Morpho and Fluid syrupUSDC markets, with Euler, Silo, and Dolomite also funded, bringing totals to 5.18M of 16M ARB allocated plus 405k ARB discretionary. Despite a 14% MoM drop in Arbitrum TVS, lending market size grew 5.7% and total loans rose 4.9% to $1.37B; eligible stablecoin cap reached ~$1B, yield-bearing stables neared $600M, ETH loans hit 163k ETH, and reported cost-effectiveness stands at +$129 (+$314 adjusted). Morpho set a market-size ATH with USDC-led borrowing, Fluid expanded via syrupUSDC, and Euler’s USDC loans climbed; Entropy flags Stream Finance losses, noting xUSD markets on Morpho and Silo may contract in epoch 5. Dashboards and weekly comms remain active, and re-incentivizing ETH loops is under consideration if cost-effective.

**Upcoming Events**

[Introducing Bleap Finance to Arbitrum DAO](https://meet.google.com/ovh-eehi-zem) - on 10.11 at 14:00 UTC.

[OpCo Operations - Office Hours](https://meet.google.com/sxt-fdxr-qmo) - on 11.11 at  15:30 UTC.

[Open Discussion of Proposals Governance Call](https://meet.google.com/dfo-xora-ysp) - on 11.11 at 16:00 UTC.


## **ZkSync**


## **Active Votes**

[[TPP-13] Assign Minter Role to Gov Infra Capped Minter](https://www.tally.xyz/gov/zksync/proposal/59956436467786828609747327435664724459335730934530897411573906572229159062327?govId=eip155:324:0xb83FF6501214ddF40C91C9565d095400f3F45746) - ends on November 19 at 09:55 UTC


### **TPP-11 Calldata: Review and Recommendations**

Shelby [reported](https://forum.zknation.io/t/tpp-11-calldata-review-and-recommendations/825) that post-execution checks of TPP-11 uncovered a single omission: the Zk_Governance_Operations_2025 capped minter wasn’t granted the minter role from the TPP-11 Rate Limiter, blocking mints; all other calls executed correctly, and active token mechanics are confirmed good. A fix is already on-chain, as TPP-13, to assign the missing role. The team proposes a process upgrade, including clearer TPP templates, a review checklist, and optional end-to-end testnet dry runs before final submission.

**L2BEAT take**

We’re supportive of the quick diagnosis and clean rollback path via TPP-13, and the shift toward clearer templates, checklists, and pre-flight testnet runs is exactly the kind of hygiene that prevents these slips.


### **[TPP-14] Adjust TokenGovernor Parameters for TPPs**

ScopeLift [proposed](https://forum.zknation.io/t/tpp-14-adjust-tokengovernor-parameters-for-tpps/828) TPP-14 to shorten ZKsync’s TokenGovernor timing for Token Program Proposals, reducing the vote delay from 7 to 3 days and the late-quorum extension from 7 to 2 days, mirroring the ZIP-5 changes that accelerated ZIP governance without new contracts or security tradeoffs, while maintaining Guardian veto coverage.

**L2BEAT’s take**

This aligns TPP timelines with already-proven ZIP parameters, which should improve agility. We suggest monitoring participation and veto-window efficacy after rollout and publishing a brief post-implementation review with turnout and quorum timing data.


### **[GAP-4] Adjust GovOpsGovernor Parameters for GAPs**

ScopeLift [proposed](https://forum.zknation.io/t/gap-4-adjust-govopsgovernor-parameters-for-gaps/832) GAP-4 to speed up ZKsync’s GovOpsGovernor flow for Governance Advisory Proposals by cutting the vote delay from 7 to 3 days and the late-quorum extension from 7 to 2 days, matching the already-adopted ZIP settings and the TPP-14 proposal, with no contract redeploys and Guardian veto coverage unchanged.

**L2BEAT’s take**

The change should improve responsiveness for procedural governance; we recommend tracking participation, late-quorum frequency, and any effects on the Guardian veto window, then sharing a short post-implementation metrics review.


### **Matter Labs | Q3 2025 Deliverables Report**

Matter Labs [reported](https://forum.zknation.io/t/matter-labs-q3-2025-deliverables-report/834) strong Q3 progress toward the Elastic Network vision, completing the first institutional pilot of interoperable Prividiums, adding selective disclosure and a new permissioning system for Prividium, shipping ZKsync OS v0.0.5 with correctness testing and audit integration, releasing a new Airbender prover, advancing the solx compiler to v0.1.2 beta with notable size optimizations, introducing 200 ms block times in v29, enabling interop messaging and fast subjective finality on mainnet, and migrating Era to settle via ZKsync Gateway, collectively pushing toward sub-second UX, trustless cross-chain messaging, and enterprise-ready privacy.


### **From Governance to Utility: $ZK Token Proposal, Part I**

Luk64 [proposed](https://forum.zknation.io/t/from-governance-to-utility-zk-token-proposal-part-i/822/3) evolving ZK from pure governance to economic utility by routing two value streams, on-chain interoperability fees across ZKsync and Prividiums, and off-chain enterprise licensing for advanced modules, into a governance-controlled mechanism that buys ZK and then allocates it among staking rewards, token burn, and ecosystem funding to align network usage with value capture and sustain decentralization.

**L2BEAT’s take**

This is a meaningful shift that could link protocol activity to token economics, and we will review it in depth with our research team, focusing on fee setting and governance design, compliant routing of off-chain revenues on-chain, the allocation formula between burn staking and treasury, safeguards for credible neutrality, and clear reporting to assess impact over time.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Polygon**


### **PIP-76: Madhugiri Hardfork**

Polygon Labs [proposed](https://forum.polygon.technology/t/pip-76-madhugiri-hardfork/21377) the Madhugiri hardfork, adding canonical inclusion of StateSync transactions and moving consensus time to 1 second while adopting EIP 7883 ModExp gas cost increase, EIP 7823 upper bounds for MODEXP, and EIP 7825 transaction gas limit cap with activation set at Amoy block 28,899,616 and mainnet timing to be confirmed to preempt DoS vectors and strengthen network security.


### **PIP-75: Change consensus time to 1 second**

Polygon Labs [proposed](https://forum.polygon.technology/t/pip-75-change-consensus-time-to-1-second/21376) PIP 75 to enable sub-second producer timing and set the consensus period to 1 second so operators can fine-tune block cadence without future hardforks while preserving header semantics with the producer enforcing a safety floor at the consensus period, header timestamps remaining Unix seconds, an activation at a specific height that changes only the consensus parameter, legacy clients needing to upgrade to avoid divergence, and operational notes that shorter intervals demand solid time sync, peer connectivity, and IO capacity.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Starknet**


### **Starknet DAO Governance and Tokenomics: Relational Sustainability Brief**

INCA [published](https://community.starknet.io/t/starknet-dao-governance-and-tokenomics-relational-sustainability-brief/116063?_gl=1*1ut0pfg*_up*MQ..*_ga*MTMwNjc2MjI3OC4xNzYyNzg3MTc3*_ga_WY42TERK5P*czE3NjI3ODcxNzYkbzEkZzAkdDE3NjI3ODcxNzYkajYwJGwwJGgw) a sustainability brief arguing Starknet DAO is progressing toward decentralized self-sufficiency with BTCFi, ZK tech, and multi-chain staking but still faces concentrated voting power, opaque emergency controls, low participation, inflationary emissions outpacing revenue, heavy treasury reliance on the native token, and limited public transparency, recommending stronger reporting, treasury diversification, clearer accountability, and optional commissioned due diligence to bolster long-term resilience.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Everclear**


## **Active Votes**

[[Redo] Social EGP 34 - Everclear Security Council Regular Members Elections](https://snapshot.box/#/s:dao.connext.eth/proposal/0x16d29f8fd1347f7adfc086f39f33cd843020fbdbb6f8c18f07f6874856896da4) - ends on November 12 at 22:37 UTC.

Everclear’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Everclear’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Uniswap**


## **Active Votes**

[Uniswap Community Proposal Factory](https://snapshot.box/#/s:uniswapgovernance.eth/proposal/0x3836142b24294e065fc9f26e24c70732dce53f15361f50261297bc206acda441) - ends on November 11 at 20:01 UTC


### **[RFC] Flow Application for Canonical Uniswap V3 Deployment**

Protofire [requests](https://gov.uniswap.org/t/rfc-flow-application-for-canonical-uniswap-v3-deployment/25876) recognizing Flow as a canonical Uniswap v3 chain, proposing a live standalone deployment called Flow Swap with Axelar bridging, citing Flow’s high-throughput L1 with sub-second blocks, low fees, EVM-equivalence, MEV-resilience, and consumer app traction, aiming to attract NFT and gaming users to DeFi; current KPIs show about $111M DeFi TVL, $473K daily DEX volume, and $62.8M bridged TVL, contracts are deployed, and the production frontend is operational at flowswap.io.

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events**

[Uniswap Community Call](https://meet.google.com/ivd-pihe-vnj) - on 11.12 at 18:00.


## **Scroll**


## **Active Votes**

[Auto-Abstaining Wallet extension](https://gov.scroll.io/proposals/98674292474488922780078349379792289085836876383512254197721386049065589813499) - ends on November 13 at 01:22 UTC.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](http://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events**

[Carroll Mechanisms Community Working Session](https://meet.google.com/phu-drwp-jwt) - on 10.11 at 17:00 UTC.

[Weekly DAO & Governance Call](https://meet.google.com/fut-dgwp-tcn) - on 11.11 at 14:00 UTC.

[Scroll Delegate Proposal Bonanza](https://meet.google.com/zfd-asoc-rmx) - on 12.11 at 17:45 UTC.


## **Hop**

Hop’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Upcoming Events**

[Hop Community Call](https://discord.com/channels/789310208413270078) - on 11.12 at 18:00.


## **Lisk**

Lisk’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

Join us every Friday at 3 pm UTC for L2BEAT Governance Office Hours, where we discuss everything related to Lisk’s governance, from current initiatives to high-level conversations.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.


## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.
