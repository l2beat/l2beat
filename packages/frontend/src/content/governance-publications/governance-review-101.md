---
title: "Governance Review #101"
description: "Research, Rotations, and Reforms."
publishedOn: "2026-07-20"
authorId: manuel-gonzalez
---

## **TL;DR**

*In* ***Arbitrum***, *governance centered on protocol infrastructure and operational security. Offchain Labs published an RFC exploring a new state representation to improve scalability and reduce node hardware requirements, while the Security Council completed a scheduled key rotation following changes to two council seats.*

*In* ***ZKsync***, *discussion focused on governance oversight. A community proposal calls for revoking the remaining token allocations authorized under TPP-18, arguing that future funding should be approved through milestone-based governance proposals reflecting Matter Labs' evolving roadmap and commercial strategy.*

***Elsewhere***, *Polygon announced it will migrate Bor and Heimdall container image distribution exclusively to GitHub Container Registry beginning in September, while Starknet saw a community proposal for a user-owned memory protocol designed to improve privacy and authorization for AI agents. Meanwhile, Uniswap continues voting on the expansion of protocol fees to Robinhood Chain and selected v4 pool families.*



---
## **Active Votes**

**Uniswap: 1 active vote**



* [Protocol Fee Expansion: Robinhood Chain](https://www.tally.xyz/gov/uniswap/proposal/99) - ends on July 25 at 18:48 UTC.
* [Activate v4 Protocol Fees (Part 1/2)](https://www.tally.xyz/gov/uniswap/proposal/100) - ends on July 25 at 19:02 UTC.

**ZKsync: 1 active vote**



* [ZKsync v31 Upgrade](https://alt.vote.zknation.io/proposal/8054264069412312387384959632741848913824409307726784174607045091780823317020) - ends on July 23 at 19:48 UTC.

**Arbitrum: 2 active votes**



* [ArbOS61 Elara Upgrade](https://alt.gov.arbitrum.foundation/proposal/7191014407719621170610709569285477750369874509305441081488686529382763374426?govId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9) - ends on July 30 at 18:40 UTC.
* [AIP: Ratification of Security Council Election Process Improvements](https://snapshot.box/#/s:arbitrumfoundation.eth/proposal/0xe9373b2226ab14005ae14075953e5755448d7ac7dc61a21a9c1d51dcae427e42) - ends on July 23 at 13:45 UTC.

---
## **Arbitrum**


### [RFC] New state representation for Arbitrum: proof-format change and request for feedback

Offchain Labs has [published](https://forum.arbitrum.foundation/t/rfc-new-state-representation-for-arbitrum-proof-format-change-and-request-for-feedback/31066) an RFC outlining early research into replacing Arbitrum's current Merkle-Patricia Trie (MPT) with a new verifiable state data structure. The proposed change aims to improve execution performance, reduce node hardware requirements, and better support future scaling, while preserving Arbitrum's security model and fraud-proof guarantees.

The proposal is still at the research stage and is intended to gather feedback from developers, infrastructure providers, and teams that rely on `eth_getProof`. While applications and end users are not expected to be affected, proof formats and verification logic would change, requiring updates for projects that verify Arbitrum state proofs. Any implementation would follow the standard governance process through an ArbOS upgrade and a Constitutional DAO vote.


### Key Rotation - July 2026

Arbitrum's Security Council [has completed](https://forum.arbitrum.foundation/t/key-rotation-july-2026/31081) a scheduled key rotation following the replacement of two council members. Patrick Collins (Cyfrin) has replaced John Morrow after Gauntlet resigned its seat, while Tigran (Certora) has taken over from Elad as Certora's representative. The changes were approved by the Security Council in accordance with the Arbitrum Constitution, which allows member replacements through a supermajority vote. 

---
## **Polygon**


### Announcement : GHCR Images And Docker Sunset

Polygon Labs [announced](https://forum.polygon.technology/t/announcement-ghcr-images-and-docker-sunset/22022) that Bor and Heimdall container images will be published to both Docker Hub and GitHub Container Registry (GHCR) until September 1, 2026, after which new releases will be available exclusively through GHCR.

Validators and infrastructure providers are encouraged to update their deployment pipelines before the transition deadline to ensure uninterrupted access to future client releases. The change affects the distribution channel only, with no modifications to the clients themselves.



---
## **Starknet**


### Proposal: UOMP as a user-owned memory layer for Starknet AI Agents

0xaicrypto [has introduced](https://community.starknet.io/t/uomp-call-for-feedbacks-an-open-protocol-draft-that-lets-users-keep-their-personal-memory-data-locally-and-grant-ai-agents-temporary-scoped-auditable-access-via-short-lived-capability-tokens/116282?_gl=1*umw53y*_up*MQ..*_ga*MTQ1ODMzMTcuMTc4NDU1NTU2Mw..*_ga_WY42TERK5P*czE3ODQ1NTU1NjIkbzEkZzAkdDE3ODQ1NTU1NjIkajYwJGwwJGgw) UOMP (User-Owned Memory Protocol), a draft standard designed to let users keep personal memory data locally while granting AI agents temporary, auditable access through short-lived authorization tokens. The proposal aims to provide an alternative to cloud-hosted data and long-lived API keys by giving users greater control over how AI agents access their information.

The proposal suggests Starknet as a potential settlement layer for identity verification, agent discovery, session revocation, and zero-knowledge proofs, leveraging the network's Account Abstraction and low transaction costs. Currently at the discussion stage, the author is seeking feedback from the Starknet community on potential integrations and alignment with existing AI and identity standards.

---
## **ZKsync**


### Revocation of Remaining TPP-18 Capped Minters

Anwar [has published](https://forum.zknation.io/t/tpp-draft-revocation-of-remaining-tpp-18-capped-minters/1057) a draft proposal asking the ZKsync Token Assembly to revoke the remaining monthly capped minters authorized under TPP-18. The proposal argues that the assumptions supporting the original 12-month funding commitment have changed, citing Matter Labs' evolving institutional strategy, commercial revenue generation, and the absence of a defined timeline for governance-controlled fee mechanisms. Previously distributed allocations would remain unaffected.

Rather than opposing future funding, the proposal argues that any additional treasury allocations should be requested through new governance proposals with updated budgets, milestones, reporting requirements, and justification. The draft is currently open for community feedback before any formal on-chain vote is proposed.

---
## **Quiet Corner**

Some ecosystems saw no meaningful governance developments this week.



* **Everclear**
* **Hop**
* **Lisk**
* **Scroll**
* **Wormhole**
* **Starknet**
* **Optimism**
* **Uniswap**

As always, if we missed something important, feel free to reach out. We’re happy to dig deeper.


---

## **Upcoming Events**

**ZKsync:**



* [Standing ZKsync Proposal Review Call](https://meet.google.com/qvr-txgr-vja) - on 22.07 at 15:30 UTC.


---

## **Discuss with L2BEAT**

Join us every Friday at 3 pm UTC for our weekly [Governance Office Hours](https://meet.google.com/twm-jafw-esn) to discuss proposals, ecosystem direction, and high-level governance strategy.
