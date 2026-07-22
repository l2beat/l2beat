---
title: "Security Councils in Practice: What They Get Right and Where They Fall Short"
shortTitle: "Security Councils in Practice"
description: "Security Councils are multisigs entrusted with critical powers over a rollup. At L2BEAT we have a first-hand view of how they operate day to day. Here we explore the different designs across Arbitrum, Optimism, Celo, Taiko, and Scroll: what they get right, and where they fall short."
publishedOn: "2026-07-22"
authorId: l2beat_research
tag: Research
---

Security Councils are multisigs entrusted with critical powers over a rollup - typically emergency upgrades, pausing, and vetoing or enforcing DAO decisions. At L2BEAT, we have a first-hand view of how Security Councils operate day to day, and here we'll explore the different designs: how members are selected, the scope of powers the council holds, the tooling and monitoring available to members, whether DAO decisions are enforced onchain or rely on the council to comply, and the process governing structural changes to the council itself.

From our experience, here's how some Security Councils work in practice, what they get right, and where they fall short.

## Table of Contents

- [Arbitrum](#arbitrum)
- [Optimism](#optimism)
- [Celo](#celo)
- [Taiko](#taiko)
- [A notable mention: Scroll](#a-notable-mention-scroll)
- [Summary](#summary)

<h2 id="arbitrum">Arbitrum</h2>

### How it works

The Security Council primarily serves two purposes:

- It can execute an "emergency upgrade" without DAO involvement
- It can veto an upgrade proposed by the DAO

The Security Council is comprised of 12 members divided into two "cohorts", each chosen by the DAO following an open process of choosing 6 members out of many candidates by the members of the DAO (i.e. $ARB holders). The tenure for each member is one year (they can re-apply for the next term). Onchain, the council operates through 9/12 multisigs: an emergency council that can upgrade all system contracts with no delay, and a proposer council whose actions go through the regular governance path, taking roughly 17 days in total.

### What's good

**Selection:** the process, in practice, means that members are publicly known, they are rotated, access to the Security Council is permissionless (anyone can apply for selection), and the risk of the SC forming a "cartel" of parties dependent on the operator is minimal. In fact, as seen in practice many times, the rollup operator cannot count on any Security Council member to "automatically" sign any proposal, as these are often highly debated.

**Capture resistance:** the most defining feature of this setup is that it is hard for any party to force the Security Council to "veto" a proposal that may be seen as harmful by the operator but favorably by the community. Such a proposal may be voted through by the DAO, while it takes only a minority of the Security Council to not show up for a voting period for the veto to not take place. Voting on any proposal by an SC member is an attributable action, but non-voting is not, it is unclear whether the SC member was against the proposal or simply not available during the voting period. This makes the rollup capture-resistant and DAO-run: in practice, all it takes for the DAO to ensure its proposals aren't vetoed is to elect a minority of the SC members.

**Verification:** due to feedback from the early cohorts, new members are primarily chosen for their technical ability to independently check proposals, almost all members are very technically savvy and run their own independent tooling. As a result, it is arguably infeasible to coerce SC members into blind-signing a malicious proposal.

### What could be improved

**Speed:** the downside of the technical, verification-heavy membership is speed: SC actions take, on average, at least 24 hours, typically more. In a real emergency, the SC may be too slow to act, especially considering that some members may not be comfortable signing under pressure. It is then recommended that a PAUSE button run by the staked operator is implemented as an additional security measure.

<h2 id="optimism">Optimism</h2>

### How it works

The Security Council primarily serves two purposes:

- It can execute emergency actions without DAO approval
- It signs regular upgrades that have been approved by the DAO

The current Security Council is a 10/13 multisig. The Security Council Charter defines two staggered cohorts, each lasting 12 months. Anyone can self-nominate, and if they receive at least 8 voter approvals from the top 100 delegates, they move to a vote.

Onchain, the Security Council owns the upgradability of all the contracts in a 2/2 setup with the OP Foundation, meaning it cannot unilaterally upgrade the contracts alone. On the other hand, it can independently pause the chain and disable the permissionless proof system.

### What's good

**Emergency response:** in case of an actual emergency, the OP Foundation retains a "deputy pauser" role that can promptly pause the chain without waiting for the 10 signatures needed for a Security Council-driven pause. The pause automatically expires after 6 months and the protocol cannot be re-paused without the Security Council's explicit approval. If used maliciously, the Security Council can unpause before the expiration date and revoke the deputy role.

**Tooling:** the Security Council is equipped with well-developed open source tools to inspect and simulate transactions before approval, including tools to simulate on airgapped devices. Procedures are described in the superchain-ops repo.

### What could be improved

**Elections:** the outcome of election voting is not enforced onchain, it's on the current Security Council to sign off the rotation to new members.

**Enforcement:** more importantly, there is no onchain enforcement of DAO decisions on regular upgrades: it's on Security Council members to align with what the DAO approved.

<h2 id="celo">Celo</h2>

The SC is similar to Optimism, with the following differences:

- Members are not elected and do not rotate on a fixed schedule
- The Security Council is a 6/8 multisig that sits in a 2/2 with cLabs
- Optimism's 2/2 can hit the superchain-wide pause (including the OPF deputy)

The lack of elections and a fixed rotation schedule removes the accountability and capture-resistance properties that DAO-driven selection provides elsewhere.

<h2 id="taiko">Taiko</h2>

### How it works

The SC serves two purposes:

- Execute emergency upgrades without a delay
- Sign standard upgrades, which remain subject to a delay and a token-holder veto before execution

The SC does not have permissions related to Treasury funds since this proposal was executed.

The Taiko Security Council is a 7/9 custom multisig using the Aragon DAO framework. Members were all chosen by the Taiko team and include Taiko Labs employees. It owns most of the upgradeable contracts of Taiko Alethia on Ethereum and the L2 with the exception of some permissions related to the proof system.

Standard upgrades require 5 signers of the Security Council to approve the onchain executable payload, can then be vetoed (via a TAIKO token threshold) during a delay phase, and can finally be executed. Emergency proposals require the full threshold of 7 signers to approve, are encrypted until executed, and have no delay. Council members can decrypt the emergency payload with a key they registered in advance.

### What's good

The standard proposal track is innovative in using an optimistic model where no regular voting participation is necessary unless something needs to be vetoed. Encrypted emergency proposals are nice for security-critical fixes, theoretically verifiable but not public. Each onchain proposal is usually accompanied by a git commit reference and a short summary of what it does. This allows the SC to protect Taiko Alethia against some bugs and openly malicious behavior. Standard upgrades are often communicated early in the SC chat, which helps prepare for swift signing.

### What could be improved

The team's tooling is limited (opsgenie/notifications, no self-verification tools, minimal voting frontend), and encrypted payloads in particular are hard to verify given that tooling, especially on hardware wallets. The Aragon DAO frontend used by Taiko is buggy. The SC would also benefit from basic monitoring tools flagging events like a bridge volume spike or a new bond and dispute. Members are not elected by a DAO, and the council includes Taiko employees.

<h2 id="a-notable-mention-scroll">A notable mention: Scroll</h2>

The Scroll SC already got dissolved, but worth explaining the design.

### How it works

The Security Council primarily served two purposes:

- **DAO enforcer:** a governor exists on the L2 but proposals have no transaction payload attached. The Scroll team prepared the payload and the SC was tasked to verify it matched what the DAO had approved before signing.
- **Emergency upgrades:** the SC reviewed and signed a few emergency upgrades, coming from the team, to patch ZK circuit vulnerabilities.

In the standard process, the Security Council quorum signed the upgrade and the team executed it when they saw fit through their executor role. Separately, the team retained parallel ops paths through their own multisigs to independently push operational updates (e.g., sequencer address management, tweaking gas scalars).

The structure was a 9/12 multisig, 75% threshold. Members were not DAO-elected but selected by Scroll itself, a mix of audit firms, independent individuals and organisations. All members are fairly technical. Addresses were mapped to members in internal docs but not to the public. A minority multisig (3/12) was also set up with the same members and granted a pauser role.

For both governance proposals and emergency ones, the Scroll team prepared guides on what the upgrade is, what contracts and parameters should change, and how to verify the tx payload matches them step by step, along with tools to facilitate faster verification.

### What's good

**Selection:** Security Council members were highly technical and independent. Diverse members (often using nested safes) made it very hard to socially engineer.

**Participation:** the vast majority performed verification on upgrades, typos and bugs were often found in the outlined guides, compatibility issues from members running tooling and clarification questions on upgrades were common. We once found an incorrect permission wiring that required a payload fix.

**Tooling:** the team providing the tooling and verification guides was very good, and we believe it contributed to more SC members actually verifying txs. Although the team cannot be trusted to provide honest tooling/guides, it made verification of team-provided info much faster (e.g., audit the tool code vs building your own custom tooling fitting the chain quirks; verify the guide steps vs coming up with your own).

### What could be improved

**Proposal process:** the DAO voted on something, and the SC was implicitly asked to enforce it with a payload prepared by the team. DAO proposals should carry payloads like in other DAOs.

**Scope:** leaving the team able to tweak operational parameters like the gas scalar proved consequential during the Ether.fi incident - over six days, the team raised the two L1 data-fee multipliers on the gas price oracle, which resulted in users paying a lot in excess fees. The changes went through the team's own multisig path; the Security Council was neither tasked nor equipped to monitor them, although it was formally responsible for intervening to protect users against abuse or manipulation.

**Removal:** the Security Council was removed by a decision from the team directly. In our view the Security Council served the users, and in turn the DAO, so this decision would ideally have followed the standard process with an onchain DAO vote. Members spent considerable time reviewing proposals for team honesty (e.g. backdoors, correct parameters, Stage 1 requirements); a proposal granting the team unilateral upgrade authority arguably warrants a more rigorous process, outlined in advance. The 7-day standard delay seems insufficient in this special case, and a minimum of 30 days would have been preferable.

<h2 id="summary">Summary</h2>

Across these designs, a few things clearly work.

1. When members are DAO-elected, rotating, publicly known, and technically capable, councils become genuinely capture-resistant and hard to socially engineer, the selection model does most of the heavy lifting here. Security councils have also proven to not be an easy target for key compromise: social engineering and malware often target multisig signers but have not been successful with security councils so far. In most councils there seems to be at least one person for every proposal who actually checks the payload in some depth; with AI help, this is actually quite effective as a mini-audit, and good tooling amplifies it.
2. Some practices are worth adopting more widely: onchain encrypted emergency proposals (privately verifiable with good tooling) or onchain proposals accompanied by a git commit reference and a short summary of what they do.

Going forward, we would like to also see a few things done better.

1. **Being clear about what a Security Council is for.** A useful scope is smart contract upgrades (e.g. by the DAO) that are audited and public, and instant emergency smart contract upgrades in situations where a pause does not help.
2. **DAO decisions should be enforced onchain** rather than relying on the council to comply, proposals should carry executable payloads, and election outcomes should bind directly instead of depending on the sitting council to hand over the keys.
3. **High-liveness responsibilities like pausing or operator-like duties are best separated from the council,** since verification-heavy bodies are inherently slow; a staked-operator pause button or a deputy pauser role with expiry and revocation fits that need better. What's not useful: pausing or other high-liveness responsibilities that could be done by a different party, and, arguably, running a Security Council at all for a Stage 0 project - if you already have other multisig trust assumptions, just use those until the project can be Stage 1.

   This matters most for live incident responses, like censoring an attacker. Emergency situations create time pressure that can impair members' ability to scrutinize a proposal and an adversary could manufacture that same urgency to pressure the Council into approving a malicious transaction.

   For this reason we strongly recommend emergency actions be initiated by the rollup operator itself: the sequencer can pause the system or selectively censor attacker transactions immediately, while forced transaction delays from L1 buy the Security Council time to assess the situation.

   A common misconception is that an operator-triggered system-wide pause is not compatible with Stage 1. As a reminder, the Stage 1 principle states that funds cannot be stolen or indefinitely frozen without Security Council approval. Therefore the operator can implement an automatically expiring (and reasonably bounded) pause, in a similar way selective censorship plus delayed forced transactions represent a temporary freeze.
4. **Internal tooling and monitoring are needed,** and councils should at minimum have visibility into the events they are formally responsible for. Scope should be drawn deliberately: operational parameters left to the team outside council oversight can create problems, so they belong either fully in scope with proper monitoring or explicitly outside it.
5. **Structural changes to a council should follow a pre-defined, DAO-driven process** with a longer-than-standard delay, rather than a unilateral team decision.
