---
  title: "Governance Review #47"
  description: "A packed week in DAOs, with news, updates, proposals, and more."
  publishedOn: "2025-04-14"
  authorId: manuel-gonzalez
---

## **Optimism**

### **Season 8 & 9: Budget Board Charter**

The Optimism’s System account [has created a post](https://gov.optimism.io/t/season-8-9-budget-board-charter/9818) that outlines a 12-month plan for a newly formed Budget Board, which will help the Optimism Collective make data-driven, community-led financial decisions starting May 1, 2025. The Board comprises 7 members (3 each representing the Token House and Citizens’ House, plus a non-voting Lead). It focuses on four main goals: building and maintaining financial infrastructure and data systems, proposing annual Mission budgets (previously done by the Foundation), maintaining the Collective Reward Framework, and eventually transitioning ETH staking management from the Foundation. This Board has only advisory powers—its proposals still require governance approval. In exchange for their 12-month service, the Foundation will cover each participant’s stipend. The Board itself will operate without a multisig, relying on at least 4 member signatures (including at least one from each House) for proposals, and the Lead’s role is strictly procedural. Ultimately, this structure should enhance continuity, reduce reliance on the Foundation, and inform more transparent and coherent financial choices that align with Optimism’s move toward greater decentralization.

### **Season 8 and 9: Budget Board Member Ratification**

The Optimism Foundation [has created a post](https://gov.optimism.io/t/season-8-and-9-budget-board-member-ratification/9819) that nominates 7 individuals to the newly formed Budget Board, which aims to improve the Collective’s treasury and economic decision-making processes over a 12-month term (May 2025–May 2026). The Board will develop data-driven frameworks for token allocation, treasury management, and eventually reduce its involvement through public tooling and governance-approved algorithms. Each House (Token and Citizens) must ratify its respective 3 representatives, while the Board Lead is ratified by both Houses. Members were selected based on expertise in financial planning, portfolio management, data and automation, and governance experience. In particular, the proposed set includes Katie Garcia and Xochitl Cazador from the Token House side, and Carl Cervone and Divya Siddarth for the Citizens House, along with additional picks like Eva Beylin (Citizens House) and Michael Silberling (Token House). If approved, the Board members will serve until May 2026 and can be removed through the Representative Removal process if necessary.

### **Cycle 35 Grants Council final report**

Gonna.eth [announced the completion of Cycle 35](https://gov.optimism.io/t/cycle-35-grants-council-final-report/9831), the second round under Season 7 of the Governance Fund Missions. Out of the participating projects, six applications were approved for 2,050k OP allocated to TVL growth (e.g., Morpho, Uniswap on Superchain, Euler Finance), while six were pushed to Cycle 36, and nine were declined. The Council will avoid requesting further OP unless an exceptional proposal during Cycle 36 merits surpassing the remaining 386k OP budget. They also recognize the Developer Advisory Board’s support and plan to continue refining the grants process in the upcoming cycle. A detailed list of final outcomes reveals which proposals passed, deferred, or declined, concluding this cycle’s focus on TVL expansion.

### **Governance Update #10**

The Optimism Foundation [has created a post](https://gov.optimism.io/t/governance-update-10/9832) that provides a mid-Season 7 progress report on Optimism’s Decentralization Milestones and an outlook for Season 8. Key achievements so far include: successfully implementing Phase A’s technical milestones (Stage 1 readiness, multiple fault-proof systems on track), further developing data-driven grant processes (via the Milestones & Metrics Council and Futarchy experiments), and continuing to refine the social layer (developing joint house voting research, public R&D forums, and the CFC’s iterative selection). Despite some pending targets, the DAO has gained operational autonomy (e.g., transferring governance fund missions on-chain to the M&M Council), and Season 8 will see the newly established Budget Board manage budget planning – a major step toward fully decentralized financial decisions. Additional focuses for Season 8 include a new approach to selecting the M&M Council, establishing the Budget Board’s frameworks for treasury forecasting, and continuing the shift of responsibilities from the Foundation to community-run structures.

### **Vulnerability disclosure: incorrect blob preimages**

Pauldowman [created a post](https://gov.optimism.io/t/vulnerability-disclosure-incorrect-blob-preimages/9833) that reveals a medium-severity bug in Optimism’s fault-proof system, specifically in how L2 transaction data (stored in EIP-4844 blobs) is passed to the EVM during permissionless dispute games. Though user assets are safe due to multiple security layers, improperly loading preimages could allow an incorrect game outcome under particular conditions. A fix has been developed, audited, and is slated for deployment with op-program and op-challenger in an upcoming Upgrade 15. Because any exploit attempt would trigger existing incident response measures (including the Security Council’s ability to blacklist games), no emergency downgrade of the fault-proof system is recommended. Once governance approves the fix (including a new absolute prestate for dispute game contracts), chain operators and off-chain challenger deployments will apply the patched software to finalize the resolution.

**Discuss with L2BEAT**

You can find us to discuss everything related to Optimism’s governance, from current initiatives to high-level conversations, during our [Optimism Office Hours](https://meet.google.com/pem-jzrh-gkq) every Tuesday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[govNERDs Community Office Hours](https://meet.google.com/gag-guua-inr) - on 15.4 at 19:00.


## **Arbitrum**

## **Active Votes**

[Security Council Elections](https://www.tally.xyz/gov/arbitrum/council/security-council/election/3/round-2) - ends on May 3 at 15:31 UTC.


### **SOS Discussion Calls**

Currently, the Arbitrum DAO is going through a process to choose the Strategic Objective that will become the north star of the DAO for the next two years. Many users have created their own Arbitrum Strategic Objective Setting proposals (SOS) and followed the [guidelines and timeline](https://forum.arbitrum.foundation/t/arbitrum-strategic-objective-setting-sos-defining-the-dao-s-interim-goals/28102) expressed in the original proposal. Right now, we are in the “Feedback Period”, where interested parties can give their opinions on these proposals. In total, there are 9 SOS proposals:

* [[SOS Submission] Tempe Techie – Strategic Objectives](https://forum.arbitrum.foundation/t/sos-submission-tempe-techie-strategic-objectives/28673) (You can see a previous recording [here](https://forum.arbitrum.foundation/t/l2beat-delegate-communication-thread/15979/10?u=manugotsuka))
* [[SOS Submission] Max Lomu – Strategic Objectives](https://forum.arbitrum.foundation/t/sos-submission-max-lomu-strategic-objectives/28902)
* [[SOS Submission] 0xDonPepe & JuanRah – Strategic Objectives](https://forum.arbitrum.foundation/t/sos-submission-0xdonpepe-juanrah-strategic-objectives/28960)
* [[SOS Submission] 404 Gov - Strategic Objectives](https://forum.arbitrum.foundation/t/sos-submission-404-gov-strategic-objectives/28980)
* [[SOS Submission] Dragonawr - Strategic Objectives](https://forum.arbitrum.foundation/t/sos-submission-dragonawr-strategic-objectives/28983)
* [[SOS Submission] Gabriel – Strategic Objectives](https://forum.arbitrum.foundation/t/sos-submission-gabriel-strategic-objectives/28981)
* [[SOS Submission] SEEDGov – Strategic Objectives](https://forum.arbitrum.foundation/t/sos-submission-seedgov-strategic-objectives/28975)
* [[SOS Submission] Tnorm - Strategic Objectives](https://forum.arbitrum.foundation/t/sos-submission-tnorm-strategic-objectives/28977)
* [[SOS Submission] Entropy Advisors – Strategic Objectives](https://forum.arbitrum.foundation/t/sos-submission-entropy-advisors-strategic-objectives/28976)

L2BEAT has [created a series of calls](https://forum.arbitrum.foundation/t/sos-discussion-calls/29019) where the owners of these SOS proposals can explain their ideas and thoughts to the whole Arbitrum ecosystem. The list of calls for this week can be found in the upcoming call section right below.

### **A Vision for the Future of Arbitrum**

The Arbitrum Foundation [has presented an updated framework](https://forum.arbitrum.foundation/t/a-vision-for-the-future-of-arbitrum/28962) for how Arbitrum governance can operate more effectively, drawing on lessons from two years of DAO history. While acknowledging the DAO’s accomplishments – ranging from 57 on-chain proposals to ecosystem programs like the Gaming Catalyst and RWA acquisitions – the Foundation sees significant potential to streamline governance, address gridlock, ensure more cohesive proposal execution, and better align with critical ecosystem stakeholders. The plan calls for two main changes:

1. Operations: Transition daily strategic and discretionary decisions to “Arbitrum Aligned Entities” (AAEs), full-time teams or organizations whose success depends on Arbitrum thriving. Current AAEs include the Foundation itself, Offchain Labs, OpCo, the Gaming Catalyst Program, and Entropy Advisors. Instead of hiring numerous outside vendors on a per-proposal basis, the DAO would authorize these AAEs to handle negotiations, scope definition, vendor oversight, and budget decisions for each initiative. This structure aims to reduce overlap, quickly pivot or terminate underperforming programs, and maintain a uniform standard of high-caliber, mission-driven execution. \

2. Delegates: The DAO should remain the ultimate authority over treasury disbursements and technical upgrades, but the Foundation suggests focusing delegates on reviewing key proposals from these AAEs, rather than micro-managing all operations. Proposers from outside can still submit ideas, but they will work closely with OpCo and relevant AAEs for feedback, possibly adopting the AAE’s recommended changes before proceeding to a DAO vote. This should minimize friction for new initiatives and reduce the overhead that delegates currently face, ideally bringing more major ecosystem stakeholders to participate in or advise governance.

Coupled with the newly approved OpCo and OAT committee (Oversight and Transparency), the approach would enable professional, centralized management of day-to-day tasks, while letting the DAO preserve ultimate decision-making authority. The Foundation underscores that the underlying governance process remains unchanged, but they anticipate fewer proposals will require direct DAO votes, with most operational tasks handled by specialized entities. This shift seeks to strengthen accountability and agility, helping Arbitrum adapt quickly and strategically in an increasingly competitive blockchain environment.

### **ARDC V2 Communications role replacement**

Tamara has [created a post](https://forum.arbitrum.foundation/t/ardc-v2-communications-role-replacement/28982/1) that outlines a vacancy on the Arbitrum Research & Development Committee (ARDC) due to Frisson’s election to the OAT, leaving the Communications seat unfilled. The ARDC V2 term ends July 12, 2025; each Supervisory Council member earns 5,000 ARB monthly, paid through a Llama Vesting stream. Four solutions are proposed:

1. New Election: Though comprehensive, an official election could be lengthy, potentially leaving the role vacant for an extended period.

2. “Next in Line” Appointment: According to the November election results, Jameskbh, then pedrob, could be offered the seat if they are still available and pass KYC. This option is more direct but still requires time for formal processes.

3. Juanrah Takes On Both Roles: Juanrah, already on the Supervisory Council, could cover the Communications duties and collect compensation for both seats, though this might strain capacity.

4. Hybrid Approach: Juanrah serves temporarily (with full compensation) until a new member is installed via either a short election process or a direct next-in-line appointment.

A final decision is needed soon, as the ARDC continues to operate without Frisson’s replacement, and a timely resolution would prevent overburdening the remaining members.

### **Arbitrum Token Flow Report - March 2025**

r3gen_Finance [has delivered](https://forum.arbitrum.foundation/t/arbitrum-token-flow-report-march-2025/28985?u=manugotsuka) its monthly analysis of Arbitrum DAO’s finances for March 2025, highlighting net transaction fees of 509 ETH (95% of total fees, up from 93% in February) and total DAO expenditures of 4.5M ARB. Notably, 4M ARB was deployed for the Stylus Sprint Committee, with 3.1M of that spent by the Gaming Catalyst Program and 0.8M ARB for the Delegate Incentive Program. STEP 1.0 generated $113k in interest (~302k ARB), but after converting monthly income and outlays into ARB, the DAO recorded a net deficit of 1.4M ARB. Unused funds from Questbook Round 1 returned to a Questbook multisig in early April, and the MSS signers’ wallet remains underfunded, given the ARB price drop.

### **March 2025 Member Election Phase**

Arbitrum Foundation [has announced](https://forum.arbitrum.foundation/t/march-2025-member-election-phase/29013/1) the final voting round for the Security Council elections, running from April 12 (~15:20 UTC) to May 3, 2025, on Tally. 13 candidates – all of whom passed the 0.2% votable supply threshold and KYC – remain, and delegates may split their votes among them. During the first seven days (until April 19), voting power is at full weight; from April 19 onward, any uncast votes begin to decay linearly. The top six candidates will assume Security Council seats for the next six-month term. The Security Council’s authority encompasses rapid protocol responses to critical threats, making careful delegate participation in this election essential for Arbitrum’s ecosystem security. A recent AMA (April 11, 2025) offers insights from each candidate, and delegates can consult the Security Council Elections 101 or the Constitution for more guidance on evaluating and voting.

**Discuss with L2BEAT**

You can find us to discuss everything related to Arbitrum’s governance, from current initiatives to high-level conversations, during our [Arbitrum Office Hours](https://meet.google.com/jkj-nnop-arc) every Thursday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[SOS Discussion #1](https://meet.google.com/fod-ssgf-mrc) - on 14.4 at 16:00.

[SOS Discussion #2](https://meet.google.com/tyb-peog-gfv) - on 16.4 at 14:00.

[SOS Discussion #3](https://meet.google.com/izt-hizb-pyk) - on 18.4 at 09:00.


## **Uniswap**

## **Active Votes**

**Temp-check**

[[TEMP CHECK] BoB Uniswap v3 Incentives Package](https://snapshot.box/#/s:uniswapgovernance.eth/proposal/0xad0e29aa7bc8e783c15b959b92b02b871af879b8f36372e80fc5ff5fc189ed8f) - ends on April 15 at 16:00 UTC.

[[TEMP CHECK] Establish Uniswap v4 Licensing Process](https://snapshot.box/#/s:uniswapgovernance.eth/proposal/0xfbaf8a48bc110a815e6b8cfaaf6c73451cb0c6e5e3d48e10e72893bf95911740) - ends on April 16 at 09:01 UTC.

Uniswap’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Uniswap’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

## **Hop**

### **Announcing Hop Rails**

Cwhinfrey, from the Hop team, [introduces Hop Rails](https://forum.hop.exchange/t/announcing-hop-rails/1333?u=manugotsuka), a newly designed trustless and permissionless bridging protocol that aims to deliver better capital efficiency and user experience. Existing decentralized bridges often struggle with liquidity fragmentation and slow messaging, while “trusted” solutions may offer immediate settlement but compromise on decentralization. Rails leverages a “rolling asynchronous interchain liquidity settlement” approach, allowing users themselves to finalize cross-chain transactions and bypass typical liquidity constraints by employing a virtual AMM. An open, permissionless bonder network provides near-instant execution, and the Hop Hub – a dedicated rollup – serves as a central point for cross-chain routes, ultimately enabling frictionless bridging across chains and tokens. Hop’s roadmap includes an initial limited launch of Rails and the Hop Hub, followed by a gradual opening of all routes, a modular messaging layer for broader cross-chain applications, and further development of the Hop Hub as a site for advanced DeFi activity.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Hop Community Call](https://discord.gg/zb3U6sTCAv) - on 16.4 at 17:00.

## **Polygon**

### **Compound Blue on Polygon POS, $3M in User Incentives**

I0xmark, from Morpho, [has updated](https://forum.polygon.technology/t/compound-blue-on-polygon-pos-3m-in-user-incentives/20870) Compound Blue, a lending protocol recently deployed on Polygon PoS using Morpho’s infrastructure. Launched on March 13, Compound Blue has already attracted more than $70 million in deposits. Polygon and Compound offer $3 million in incentives via Merkl across several listed assets (USDC, USDT, ETH, WBTC, wstETH, MATICx, and POL) to bootstrap liquidity.

Paperclip Labs has developed a position migration tool that allows users to move lending/borrowing positions from Aave to Compound Blue. Upcoming features include streamlined bulk migration of multiple assets and automated leveraged positions. Built atop Morpho’s permissionless lending infrastructure, Compound Blue aims to deliver quicker asset listings, more efficient governance processes, and improved composability. Compound DAO retains ownership of the vaults, guided by Gauntlet’s parameter curation.

### **PIP-63: Bhilai Hardfork**

H_Rook and Sandeep Sreenath [propose the Bhilai Hardfork](https://forum.polygon.technology/t/pip-63-bhilai-hardfork/20872) for Polygon PoS, incorporating 3 main updates: PIP-60 (raising the gas limit to 45M), PIP-58 (increasing BaseFeeChangeDenominator to 64), and PIP-61 (support for various Pectra EIPs). The specific activation blocks for both Amoy and Mainnet will be determined later. The authors confirm there are no anticipated security concerns arising from these changes, and the work falls under the CC0 1.0 Universal waiver.

### **PIP-62: Heimdall v2 Migration**

Marcello Ardizzone and Harry Rook [created a post](https://forum.polygon.technology/t/pip-62-heimdall-v2-migration/20873) outlining the migration of Polygon PoS from Heimdall v1 to Heimdall v2, which replaces Tendermint with CometBFT and updates the Cosmos SDK to version 0.50.x. The switch will cause a chain halt at a future block height (for both Amoy and Mainnet), after which node operators must transition to Heimdall v2. Due to breaking changes, the previous block history won’t be preserved on v2; RPC providers wanting that data must keep v1 in read-only mode. Relevant on-chain data (e.g., checkpoints, milestones) will transfer via an export/import process. While the side chain’s execution layer remains functional, bridging and cross-chain operations will pause during the migration. Once v2 is live, Heimdall v1 is deprecated.

**Discuss with L2BEAT**

You can find us to discuss everything related to Polygon’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

## **Starknet**

### **Cairo DevEx: Panel Discussion & Open Feedback**

0xBeja announces a Starknet [governance call](https://lu.ma/starknet-governance) on April 17, 2025, at 14:00 UTC, focusing on the Cairo developer experience (DevEx). StarkWare engineers Ohad and Leo will join delegates for a panel discussion addressing current development challenges and future roadmap ideas, followed by an open floor for community feedback and Q&A. Starknet emphasizes that direct input from developers, delegates, and community members is critical to shaping Cairo’s evolution. Interested participants should register via the provided link and are encouraged to post questions or feedback in advance.

**Discuss with L2BEAT**

You can find us to discuss everything related to Starknet’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

## **Everclear**

## **Active Votes**

[Social EGP 28 - Increasing Liquidity for CLEAR via Mainnet Vault](https://snapshot.box/#/s:dao.connext.eth/proposal/0x2dddbe910c84f67d3949ce68cbb402468f39bddf8977b86510c1ccc920a78ec0) - ends on April 17 at 15:41 UTC.

[Social EGP 29 - Everclear DAO Code of Conduct](https://snapshot.box/#/s:dao.connext.eth/proposal/0x70dfe154c37f09b59f41de2fe97f002e464371b4bdb70342a9e968a9daae1cbb) - ends on April 17 at 16:02 UTC.


### **RFC - Increasing Liquidity for CLEAR via Mainnet Vault**

Rapha-Raffaelo [proposes](https://forum.connext.network/t/rfc-increasing-liquidity-for-clear-via-mainnet-vault/1368) moving 3.84 million CLEAR from the DAO’s Arbitrum Safe to Ethereum mainnet and depositing it into an Arrakis mainnet vault. The goal is to improve the buy-side liquidity for CLEAR, reduce slippage for would-be buyers, and gradually convert CLEAR to wETH over time, thereby strengthening the base asset liquidity. The plan involves bridging the 3.84M CLEAR to the mainnet and depositing the tokens into the Arrakis vault, with no additional costs beyond using the currently idle CLEAR in the DAO safe. This arrangement allows organic trading volume to steadily swap out some of the CLEAR for wETH without creating significant downward price pressure. It aims for a more robust trading environment for CLEAR.

### **Governance Metrics Report**

SEEDGov [has shared](https://forum.connext.network/t/governance-metrics-report/1319/4?u=manugotsuka) its second Governance Metrics report for Everclear, spanning Q4 2024 and Q1 2025. The attached Dune dashboard provides automated historical data going forward. Notably, Q1 2025 saw record activity, with 16 proposals (e.g., EverScale, the grants BORG, vbCLEAR Season 2) passing or failing, the highest in any quarter. Although voter participation rose by 108% from Q4, the average number of voters per proposal continued its downward trend, stabilizing around 25.5, while unique voters plateaued near 55 for three quarters. Q1 also saw an all-time high of 365,998,716 NEXT/CLEAR used in votes, mainly driven by large VP holders (≥200k) who accounted for ~30% of total voting power (up from ~7% in earlier quarters).

Additionally, oSnap integration—used for on-chain execution of passed proposals—has occasionally confused abstention, as its approval mechanism requires both quorum fulfillment and an outright majority, including abstain votes. Due to these technical rules, the system required resubmissions in two cases (the Retroactive Security Task Force Work and the GTF Budget Extension proposals). SEEDGov plans to adapt or clarify the tooling so delegates can use “Abstain” without unintended procedural side effects.

**Discuss with L2BEAT**

You can find us to discuss everything related to Hop’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

## **Wormhole**

Wormhole’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Wormhole’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

## **Lisk**

Lisk’s governance hasn’t seen any new developments over the last week. If you believe we might have missed something, please let us know.

**Discuss with L2BEAT**

You can find us to discuss everything related to Lisk’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

## **ZkSync**

## **Active Votes**

**On-chain**

[[ZIP-9] V27 EVM Emulation Upgrade](https://www.tally.xyz/gov/zksync/proposal/112142012854508751423955156601121618924383324119199970784935099214632480260394?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f) - ends on April 17 at 14:57 UTC.

### **[TPP-3] ZIP Audit Reimbursement Program (ZARP)**

Bendob, from the ZKsync Foundation, [has created a proposal](https://forum.zknation.io/t/tpp-3-zip-audit-reimbursement-program-zarp/636/1) that outlines a $5M (100M ZK) ZIP Audit Reimbursement Program to fund third-party security audits for successful protocol upgrades in 2025. The program features two capped minters, ZarpMain (for future audits from May–December 2025) and ZarpRetro (retroactive audits from January–April 2025). Prospective ZIP authors seeking reimbursement must deploy a “child” capped minter and include the audit report in their onchain proposal. If the proposal passes governance, developers can mint ZK tokens (after a 30-day buffer to allow Security Council verification) for direct audit cost reimbursement. The Security Council oversees eligibility, can pause suspicious distributions, and will publicly document reimbursements. This program aligns with GAP 001’s “Secure the Protocol” priority by removing the financial burden of security audits and incentivizing thorough code reviews for ZKsync improvements.

### **[ZIP-10] Activate ZK Gateway as a Settlement Layer**

StanislavBreadless from Matter Labs [proposes](https://forum.zknation.io/t/zip-10-activate-zk-gateway-as-a-settlement-layer/632) whitelisting ZK Gateway as an optional settlement layer for the Elastic Network. Building on ZIP-6 (V26), this ZIP-10 reduces batch settlement costs for ZK Chains, particularly those not reliant on Ethereum for data availability, and paves the way for future interoperability. The ZK Gateway, deployed as a standard ZK Chain that uses the ZK token and permanent rollup properties, will be whitelisted via governance actions, including ´Bridgehub.registerSettlementLayer´. Any ZK Chain’s admin can choose to adopt or decline ZK Gateway, which initially features a single Matter Labs–run sequencer pending a future decentralization.

**Discuss with L2BEAT**

You can find us to discuss everything related to ZkSync’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Standing ZKsync Proposal Review Call](https://meet.google.com/txe-trwh-zha) - on 15.4 at 16:00.

## **Scroll**

### **Q2 2025 Goals & Strategy**

Eugene from the Scroll governance team [has shared](https://forum.scroll.io/t/q2-2025-goals-strategy/591) high-level objectives for Q2 2025, categorized into operational, ecosystem growth, global community, and governance improvements. Operationally, the team aims to finalize a governance content plan, continue treasury diversification discussions, and refine the DAO’s organizational design (e.g., establishing a council). For ecosystem growth, the focus is on holding a second Co-Creation Cycle (CCC2) that yields a specific, growth-oriented proposal, plus launching a Foundation-led funding program for Scroll-based founders. Global community goals involve formalizing local nodes (seeking at least 3 proposals) and bridging local winners into upcoming “Scroll Open” events. Governance iteration targets include enacting delegate compensation, a plan to address the DAO’s low votable supply, scheduling a third Co-Creation Cycle (CCC3) in June, laying out a delegate engagement event plan for the remainder of 2025, and supporting the rollout of a Delegate Accelerator Proposal. The final priority is producing a public roadmap for future research topics, such as AI governance tools, preference signaling, or progressive decentralization.

**Discuss with L2BEAT**

You can find us to discuss everything related to Scroll’s governance, from current initiatives to high-level conversations, during our [L2BEAT Governance Office Hours](https://meet.google.com/twm-jafw-esn) every Friday at 3 pm UTC.

**Upcoming Events (Times in UTC):**

[Kenya Local Nodes](https://meet.google.com/mjv-tsiw-bny) - on 14.4 at 21:00.

[Ecosystem Growth Discussion](https://meet.google.com/nug-uygx-hbd) - on 16.4 at 11:30.

[Ecosystem Growth Call](https://meet.google.com/pcm-nxzr-rig) - on 16.4 at 17:00.
