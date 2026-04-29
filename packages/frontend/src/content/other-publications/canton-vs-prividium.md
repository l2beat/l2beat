---
title: "Canton vs Prividium: What Institutional Blockchains Actually Guarantee"
description: "The two systems compete for the same institutions. Both promise privacy, compliance, and enterprise-grade finality, and both have signed major banks. Read the marketing and they sound similar. Read the code and they don’t. But what guarantees do they actually give users?"
publishedOn: "2026-04-28"
authorId: l2beat_research
tag: Research
---

Canton Network routes encrypted messages between known institutions and tallies their votes. Prividium runs a private blockchain on operator-controlled infrastructure and posts a mathematical proof to Ethereum. One trusts the institutions. The other trusts the math. The question for each: which guarantees survive when the operator stops acting in your interest?

## Table of Contents

- [How Canton processes a transaction](#how-canton-processes-a-transaction)
- [Case Study: USDCx](#case-study-usdcx)
- [How Prividium processes a transaction](#how-prividium-processes-a-transaction)
- [The mediator problem](#the-mediator-problem)
- [The proof problem](#the-proof-problem)
- [When the operator turns hostile](#when-the-operator-turns-hostile)
- [What Canton does better](#what-canton-does-better)
- [What Prividium does better](#what-prividium-does-better)
- [The question neither system answers well](#the-question-neither-system-answers-well)
- [Summary table](#summary-table)

<h2 id="how-canton-processes-a-transaction">How Canton processes a transaction</h2>

![How a Canton transaction works](/images/publications/canton-vs-prividium-how-canton-works.png)

A Canton transaction moves through three roles. The participant is a bank's node - it holds the bank's keys, runs smart contract logic, and stores the bank's private sub-ledger. The sequencer is the message infrastructure - it timestamps, orders, and delivers messages between participants, but never reads them. The mediator is the vote counter - it collects signed approvals from participants and decides whether a transaction commits.

Smart contracts are written in DAML, Canton's functional contract language - the equivalent of Solidity for Ethereum. Each contract type is defined by a template, the DAML analog of a Solidity contract, that declares its signatories (parties whose authorization is required for any action on a contract of that type) and observers (parties allowed to see the contract but not authorize). The parties entitled to see any particular step of a transaction - its informees - are computed from these roles.

A participant proposes a transaction, splits it into encrypted fragments called "views" - one per counterparty - and sends the sealed package to the sequencer. The sequencer timestamps it, assigns it a position in the global order (so conflicting transactions have a clear sequence), and delivers each encrypted view to the right recipient. Each recipient decrypts its view, verifies its fragment against the contract logic, and sends a signed approval or rejection to the mediator. The mediator tallies the votes and issues a verdict: commit or rollback.

The sequencer never sees transaction contents. In the Canton codebase, every submission arrives as a `Batch[ClosedEnvelope]` - a collection of opaque byte arrays the sequencer cannot decrypt ([`SubmissionRequest.scala:50`](https://github.com/digital-asset/canton/blob/main/community/base/src/main/scala/com/digitalasset/canton/sequencing/protocol/SubmissionRequest.scala#L50)). The `ClosedEnvelope` type wraps raw `ByteString` and offers no method to access the underlying data ([`ClosedEnvelope.scala:21-24`](https://github.com/digital-asset/canton/blob/main/community/base/src/main/scala/com/digitalasset/canton/sequencing/protocol/ClosedEnvelope.scala#L21)). Decryption logic lives in a separate package - `ViewMessageDecrypter`, inside the participant module - using that participant's private key. Canton requires that synchronizer entities never learn what transactions contain ([`synchronizers.rst:350`](https://github.com/digital-asset/canton/blob/main/docs-open/src/sphinx/overview/explanations/canton/synchronizers.rst)).

Transaction contents stay encrypted - but the privacy is not total. The mediator receives a `FullInformeeTree` where every `ViewCommonData` is unblinded: it sees the full tree structure, the informees (party IDs) on every view, and the quorum thresholds ([`ViewCommonData.scala:24-25`](https://github.com/digital-asset/canton/blob/main/community/base/src/main/scala/com/digitalasset/canton/data/ViewCommonData.scala#L24)) - just not the contract data itself, which stays blinded in `ViewParticipantData` ([`FullInformeeTree.scala:22-27`](https://github.com/digital-asset/canton/blob/main/community/base/src/main/scala/com/digitalasset/canton/data/FullInformeeTree.scala#L22)). The mediator knows who is transacting with whom and the shape of every transaction. It does not know what the transaction does. Each participant receives only the views where they are informees - a signatory, observer, or controller on that specific step of a transaction. A multi-step transaction between three parties might produce three views; each party decrypts only the view containing their step - though all participants can see the hashes of every view in the Merkle tree, giving them structural information about the full transaction ([`requirements.rst:1392`](https://github.com/digital-asset/canton/blob/main/docs-open/src/sphinx/overview/explanations/canton/requirements.rst)). DAML's `informeesOfNode` function computes this split from the roles declared in the smart contract itself - who signed, who observes, who can act ([`Node.scala`](https://github.com/digital-asset/canton/blob/main/community/daml-lf/transaction/src/main/scala/com/digitalasset/daml/lf/transaction/Node.scala)).

What Canton does not have: a shared ledger visible to participants. The sequencer nodes do produce blocks internally - with block numbers, rotating leaders, and ISS-based BFT ordering ([`ConsensusSegment.scala`](https://github.com/digital-asset/canton/blob/main/community/synchronizer/src/main/scala/com/digitalasset/canton/synchronizer/sequencer/block/bftordering/framework/modules/ConsensusSegment.scala)) - but these blocks contain encrypted envelopes that no single node can fully read. Each participant maintains a private sub-ledger of contracts they are party to. The "virtual global ledger" is the theoretical composition of all these sub-ledgers, but it exists nowhere, and no third party can reconstruct or verify the complete state of the network.

<h2 id="case-study-usdcx">Case Study: USDCx</h2>

![USDCx transfer model](/images/publications/canton-vs-prividium-usdcx.png)

USDCx is Circle's USDC representation on Canton Network. Looking at how it is structured shows what the abstract properties above (content-blind synchronizer, template-level signatory enforcement, signatory-as-informee) actually look like in a deployed token.

So every Canton USDCx holding (i.e., UTXO-like) is jointly signed by 2 or more parties: token registrar, token owner, and any optional current lockers (a party that can set restrictions on certain actions). The registrar is the `decentralized-usdc-interchain-rep` party: Circle's multi-sig admin, the same entity that authorizes mints.

That signing rule determines what every operation on a holding requires. The `Holding_Transfer` choice, which moves ownership of a holding to a new party, has registrar, owner, newOwner as its controller set, so every user-to-user USDCx transfer requires the admin's signature alongside the sender's and the recipient's. The same admin who has to approve every mint also has to approve every transfer. In practice the `Holding_Transfer` choice does two things atomically:

- Consumes Alice's existing holding (whose signatories are `{registrar, Alice, ...}`).
- Creates a new holding for Bob (whose signatories will be `{registrar, Bob, ...}`).

DAML's authorization rule is that every created contract requires all its signatories to authorize its creation. The new holding will have Bob as a signatory, so Bob's (= newOwner) authorization is required to create it.

For other operations (`Holding_Merge` and `Holding_Split`), Circle is the only controller, so it can consolidate or fragment a user's holdings without that user acting. Because the admin is a signatory on every holding, it is also an informed party on every operation by construction: it sees every transfer, split, merge, lock, and archive, including the counterparties and amounts.

<h2 id="how-prividium-processes-a-transaction">How Prividium processes a transaction</h2>

![How a Prividium transaction works](/images/publications/canton-vs-prividium-how-prividium-works.png)

Prividium runs differently. It is a conventional blockchain - blocks, global state, a sequencer that executes every transaction - but operated inside a single institution's infrastructure and anchored to Ethereum.

Users submit transactions through a proxy that enforces identity and compliance rules. The institution's sequencer orders and executes them in an EVM-compatible environment. A prover generates a validity proof for each batch - internally a STARK, wrapped in a SNARK (`FFLONK/PLONK`) for cheaper onchain verification ([`EraDualVerifier.sol`](https://github.com/matter-labs/era-contracts/blob/draft-v31/l1-contracts/contracts/state-transition/verifiers/ZKsyncOSDualVerifier.sol)). The state root and proof go to Ethereum, where a smart contract verifies the proof's mathematical correctness.

The operator sees everything. The sequencer in processes every transaction in plaintext - tx hash, gas limit, initiator account, nonce, storage logs, events, and call traces ([`core/node/state_keeper/src/keeper.rs`](https://github.com/matter-labs/zksync-os-server)). No encrypted mempool exists. No homomorphic encryption. Prividium’s focus is on enabling user-level privacy, while the operator maintains full visibility over every transaction.

Privacy comes from what reaches the outside world. In validium mode, no transaction data, state diffs, addresses, or calldata are published to Ethereum. The L2 data availability validator returns zero as its output ([`ValidiumL2DAValidator.sol`](https://github.com/matter-labs/era-contracts/blob/main/l2-contracts/contracts/data-availability/ValidiumL2DAValidator.sol)). What does reach L1: a state root, an opaque 32-byte state diff hash (a commitment the operator provides, with no underlying data published or verified against it), and a validity proof. The outside world learns that a correct state transition happened. It learns nothing about what the transition contained.

<h2 id="the-mediator-problem">The mediator problem</h2>

Canton's most consequential design choice is the mediator. When a transaction is proposed, each institution involved decrypts and verifies only the view it received - its own fragment of the transaction. If the fragment checks out against the contract logic, the institution sends a signed approval. If not, a signed rejection. The mediator collects these responses and aggregates them into a final verdict (i.e., did enough parties approve?). The code that does this - `ResponseAggregation.progressView` - counts votes against quorum thresholds

([`ResponseAggregation.scala:145`](https://github.com/digital-asset/canton/blob/main/community/synchronizer/src/main/scala/com/digitalasset/canton/synchronizer/mediator/ResponseAggregation.scala)).It does not re-execute transactions, nor does it inspect their contents. It tallies votes, nothing more:

When all quorums are met, it returns `MediatorApprove`. When they cannot be met, `ParticipantReject`.

The verdict, the `ConfirmationResultMessage`, is sent to all participants and contains five fields: synchronizer ID, view type, request ID, root hash, and verdict ([`ConfirmationResultMessage.scala:31-36`](https://github.com/digital-asset/canton/blob/main/community/base/src/main/scala/com/digitalasset/canton/protocol/messages/ConfirmationResultMessage.scala#L31)). It does not include the underlying participant confirmations. The mediator signs this message with its own key, and the participants verify the signature and root hash. They have no mechanism to verify the approvals the mediator claims to have collected. The mediator is trusted to produce and distribute all results correctly ([`requirements.rst:67`](https://github.com/digital-asset/canton/blob/main/docs-open/src/sphinx/overview/explanations/canton/requirements.rst)).

This trust can be spread across multiple parties. Canton allows the mediator role to be run by a group of independent nodes - say, five separate institutions - with a threshold requiring a majority to agree before a verdict is delivered ([`VerdictSender.scala:309-312`](https://github.com/digital-asset/canton/blob/main/community/synchronizer/src/main/scala/com/digitalasset/canton/synchronizer/mediator/VerdictSender.scala#L309)). Forging a verdict then requires corrupting a majority rather than one. For the Global Synchronizer - Canton's shared public sync domain - this means corrupting more than a third of roughly forty institutional validators. For a private sync domain with a single mediator, it means corrupting one entity.

Beyond verdict forgery, there is a structural gap in what the mediator validates. The informee tree is built by the submitter's participant ([`TransactionConfirmationRequestFactory.scala:85-101`](https://github.com/digital-asset/canton/blob/main/community/participant/src/main/scala/com/digitalasset/canton/participant/protocol/submission/TransactionConfirmationRequestFactory.scala#L85)); the mediator reads the tree's informees and quorums but not the blinded `ViewParticipantData` carrying the contract and action. It cannot cross-check that declared signatories match the DAML templates - doing so would break the privacy property the blinding exists to protect. Template conformance falls to the submitter's own engine (honest by convention, not protocol) and to `ModelConformanceChecker.checkView` at each recipient ([`ModelConformanceChecker.scala:292`](https://github.com/digital-asset/canton/blob/main/community/participant/src/main/scala/com/digitalasset/canton/participant/protocol/validation/ModelConformanceChecker.scala#L292)). When neither catches a discrepancy - submitter is malicious and the real stakeholders aren't among the recipients - divergence surfaces only through periodic ACS commitment reconciliation ([`AcsCommitmentProcessor.scala:125`](https://github.com/digital-asset/canton/blob/main/community/participant/src/main/scala/com/digitalasset/canton/participant/pruning/AcsCommitmentProcessor.scala#L125)): a post-hoc alarm, not a synchronous rejection.

The consequence is that the mediator is a vote-counter, not an authorization authority. Canton's privacy property and its lack of template-layer enforcement are the same constraint: a synchronizer that never reads contract contents cannot also check that a proposed transaction's informees match the template's signatories. Template authorization collapses onto two assumptions that neither the mediator nor the sequencer can independently verify - every participant runs the standard DAML engine honestly, and every transaction reaches at least one honest informee who runs `checkView`. When those assumptions hold, Canton is safe; when they don't, the protocol has no in-band mechanism to catch it. The difference an institution gets

from running on Canton rather than a shared database is, at this layer, the ACS commitment alarm that eventually surfaces the divergence - not a protocol that prevents the divergence from being committed in the first place.

<h2 id="the-proof-problem">The proof problem</h2>

Prividium's equivalent design choice is the validity proof. Every batch produces a proof that the state transition was computed correctly. Ethereum's smart contract verifies it. If the operator fabricates a balance, moves unauthorized funds, or creates tokens from nothing, the proof fails verification. The state update is rejected.

This guarantee is narrow but absolute. It covers correctness of execution - nothing more. It does not prevent censorship (the operator chooses what to include). It does not guarantee data availability (all data stays in the operator's database). It does not ensure liveness (if the operator stops, the chain stops).

What it prevents is fraud - the operator cannot lie about the result of a computation. This holds as long as the proof system is sound and the verifier contract is not upgraded. The verifier is upgradeable ([`BaseZkSyncUpgrade.sol:179`](https://github.com/matter-labs/era-contracts/blob/main/l1-contracts/contracts/upgrades/BaseZkSyncUpgrade.sol#L179)), and the security council can execute upgrades instantly once an operation is pending ([`Governance.sol:199`](https://github.com/matter-labs/era-contracts/blob/main/l1-contracts/contracts/governance/Governance.sol#L199)). The mathematical guarantee is real, but it sits inside an upgradeable frame.

Canton's strongest counterargument: ZK proof systems have bugs, and when they fail, they fail silently. A soundness vulnerability - a bug that lets someone forge a valid-looking proof for an invalid computation - would be undetectable on-chain, and the verifier contract would accept it like any legitimate proof. This concern is legitimate. ZK circuit bugs have been found in production systems regularly.

However, Canton's own code reveals a similar blind spot. If a compromised mediator approves a transaction that a participant rejected, the participant's node logs a warning: "Mediator approved a request that has been locally rejected" ([`ProtocolProcessor.scala:1722-1726`](https://github.com/digital-asset/canton/blob/main/community/participant/src/main/scala/com/digitalasset/canton/participant/protocol/ProtocolProcessor.scala#L1722)), but the node commits the transaction anyway. It has to - Canton has no shared ledger, so finality depends on every participant accepting the mediator's verdict. If any party could refuse, no transaction would ever settle. The victim holds a signed rejection and a warning log - maybe evidence for a courtroom, but not a safeguard in the protocol. This is better than a ZK soundness bug, where a forged proof is indistinguishable from a valid one. It is not enforcement, though, and the fraudulent state still commits.

<h2 id="when-the-operator-turns-hostile">When the operator turns hostile</h2>

Strip away the marketing and test each system against the scenario they were built to handle: the operator stops acting in your interest.

Censorship. Both systems allow the operator to censor. In Canton, end users typically interact through their institution's participant node - the bank constructs the transaction and submits it to the sequencer. Running your own participant node is possible (the software is open source), but it is essentially permissioned (it requires onboarding to the synchronizer, which the domain governors control). Censorship can happen at two levels: the participant can refuse to submit your transaction, or the sequencer can refuse to include it. A message that never enters the ordering sequence never gets delivered, never gets voted on, and effectively doesn't exist.

A private domain may have a single sequencer - one entity decides what gets through. The Global Synchronizer runs multiple sequencer nodes, each also an ordering node, run by the same institutions. They agree on which messages to include and in what order through a BFT consensus protocol called ISS ([`bftordering/README.md`](https://github.com/digital-asset/canton/blob/main/community/synchronizer/src/main/scala/com/digitalasset/canton/synchronizer/sequencer/block/bftordering/README.md)). If more than a third of nodes fail or go silent, consensus halts for everyone - the domain stops, not just one participant. With currently about 40 participant nodes, that's 13 faulty (f) nodes tolerated. The standard mitigation is participants submitting the same request to f + 1 sequencer nodes, guaranteeing at least one honest node receives it. An honest node that receives a request will disseminate it and propose it for inclusion. With 40 nodes, submitting to 14 guarantees delivery. If a participant submits to fewer and all happen to be faulty, the request can be silently dropped. Beyond this submitting to multiple nodes and hoping one is honest, there is no forced inclusion mechanism. The participant's last recourse is to leave the domain - which requires counterparties to agree.

Prividium has an L1 priority queue. Users can submit transactions directly to Ethereum, bypassing the sequencer ([`Mailbox.sol:399-416`](https://github.com/matter-labs/era-contracts/blob/main/l1-contracts/contracts/state-transition/chain-deps/facets/Mailbox.sol#L399)). However, the `PrividiumTransactionFilterer` checks every priority transaction before it passes through. Allowlisted addresses get unrestricted access, while non-allowlisted addresses can only deposit funds to themselves - move assets from L1 to their own address on the Prividium chain. No transfers to others, no contract calls, no withdrawals. Moreover, the operator can disable even that with a single toggle (`depositsAllowed`) ([`PrividiumTransactionFilterer.sol`](https://github.com/matter-labs/era-contracts/blob/zksync-os-stable/l1-contracts/contracts/transactionFilterer/PrividiumTransactionFilterer.sol)). The chain admin can replace the entire filterer contract with no delay ([`Admin.sol:146-150`](https://github.com/matter-labs/era-contracts/blob/main/l1-contracts/contracts/state-transition/chain-deps/facets/Admin.sol#L146)).

The priority queue was designed with a deadline - a time limit for the sequencer to process queued transactions. In practice, this deadline is set to zero and no code enforces it ([`Config.sol:37`](https://github.com/matter-labs/era-contracts/blob/main/l1-contracts/contracts/common/Config.sol#L37)). The operator can ignore the queue indefinitely.

Essentially, neither system offers strong censorship resistance in its current design. Both are permissioned by design. The difference is that Prividium's fallback, however constrained, is a protocol-level mechanism anchored to Ethereum. Canton's fallback is a client-side retry strategy that depends on honest sequencers existing.

Fraud. This is where the architectures diverge. In Prividium, the operator cannot post a fraudulent state transition - the proof fails verification on Ethereum. This holds while the verifier contract remains unchanged; the security council can upgrade it with no delay. Funds cannot be stolen through invalid execution under current contracts. They can be frozen if the operator withholds data - a serious problem, but not theft.

In Canton, a compromised mediator with threshold one can issue a false verdict. A participant who voted to reject retains its own signed rejection message - proof of what it sent to the mediator. But that proof lives only on the participant's node. No external system witnessed the exchange or recorded what the mediator actually received, so the participant cannot independently demonstrate that the mediator ignored a valid rejection. The dispute reduces to competing signed messages between parties who no longer trust each other, with no neutral arbiter to reconstruct what happened. The mitigation to replicate the mediator across multiple institutions and raise the threshold only converts the trust assumption from one honest mediator to a majority of honest mediators; it does not eliminate the assumption.

Exit. Canton provides no unilateral exit mechanism. Assets exist inside Canton's infrastructure. A participant can disconnect from a domain and connect to another, but cannot force-withdraw to Ethereum or any public chain. There is no escape hatch.

Prividium has an L1 priority queue that theoretically enables forced withdrawals through Ethereum. In practice, withdrawals require a Merkle proof of the user's balance - and generating that proof requires access to transactions data (e.g., state diffs), which the operator controls. If the operator withholds data, the withdrawal cannot be constructed. The proof on Ethereum establishes that your balance exists. Without the operator's data, you cannot use that proof to claim it.

<h2 id="what-canton-does-better">What Canton does better</h2>

Canton's multi-party privacy is real but more constrained than the marketing frames it. The synchronizer infrastructure - sequencer and mediator - never reads view contents, so no single infrastructure node sees the full transaction. But the submitter's own participant (e.g., bank node) constructs the entire informee tree and therefore sees everything during submission. Moreover, any party declared as a signatory on a contract the transaction touches becomes a mandatory informee on every action against that contract - for a DAML Finance Holding, that is the token issuer, who in practice sees every transfer of the asset. What Canton does give you over Prividium is that no operator sits between counterparties reading everything in plaintext: the privacy partition runs between the infrastructure (sequencer + mediator) and the participants (e.g., bank nodes), not between the operator (sequencer) and the users.

Canton's DAML language eliminates some vulnerability classes that persist in EVM-based systems. Authorization is defined at the contract template level - signatories, observers, and

controllers are language constructs, rather than additional access control. The UTXO-based model makes reentrancy impossible by design. Deterministic execution removes an entire category of consensus bugs. These can be real advantages for multi-party financial agreements.

Canton's multi-domain architecture provides some isolation - each domain runs its own sequencer and mediator, and no shared smart contract holds assets across domains. But cross-domain transfers use a two-phase reassignment protocol: a contract is deactivated on the source domain and reactivated on the target ([`multi-synchronizer.rst`](https://github.com/digital-asset/canton/blob/main/docs-open/src/sphinx/overview/explanations/canton/multi-synchronizer.rst)). The target domain's participants verify the reassignment procedure, but do not re-validate the original transaction that created the contract on the source domain. A fraudulent contract committed via a corrupt mediator on one domain could propagate to another through a reassignment. Domains also share the same Canton software and may share operators, so correlated failures remain possible.

<h2 id="what-prividium-does-better">What Prividium does better</h2>

Prividium settles to Ethereum. Every state root is posted to a network of roughly one million permissionless validators with over a hundred billion dollars in staked collateral subject to slashing. Canton settles to its own infrastructure - approximately forty invited institutional validators with no staked collateral and no economic penalty for misbehavior.

Prividium creates an immutable external record. State roots on Ethereum cannot be altered, pruned, or deleted by any party. Canton supports data pruning for GDPR compliance - archived contracts can be deleted from participant nodes. Cryptographic commitments survive pruning and provide non-repudiation, but the underlying data does not. Whether this matters depends on the use case: regulatory compliance sometimes demands deletion; dispute resolution demands permanence.

Prividiums provides neutral dispute evidence. In litigation, a party can point to a state root and validity proof on Ethereum - verified by a decentralized network neither side controls. Canton disputes involve signed messages from the same trusted parties and infrastructure whose behavior is in question. The evidence and the system being challenged are the same thing.

Moreover, Prividiums can prove the rules are being followed. The verifier contract on Ethereum is public, deployed at a known address, and rejects any state transition that doesn't satisfy the protocol's rules. The operator could run modified offchain code but Ethereum would reject the resulting proofs. This enables enforcement of aggregate properties in a multi-lateral setting (e.g., token supply caps, liquidity pools, margin calls and automated liquidations, any form of Defi). There is no equivalent for Canton. The validators could be running a modified mediator with different aggregation logic, a sequencer that process a specific message differently, or a configuration different from the one in the public docs. The repository at `digital-asset/canton` is

open source, but no protocol-level mechanism verifies that the binaries running production are built from that source. You trust the validators' word, their audits, and their legal commitments. With Prividium, you can trust the smart contract on Ethereum.

<h2 id="the-question-neither-system-answers-well">The question neither system answers well</h2>

Both platforms struggle with data availability. Canton distributes the problem: each participant stores their own sub-ledger, and no one stores everything. If your counterparty's node goes down, contracts involving them become inaccessible. Prividium concentrates the problem: one operator stores all data. If that operator's database is lost or withheld, no one can reconstruct individual balances.

This is the fundamental cost of enterprise privacy. Publishing unencrypted data to Ethereum or a public DA layer would solve availability but destroy confidentiality. Both systems accept this tradeoff and leave data availability as an operational risk rather than a protocol guarantee.

<h2 id="summary-table">Summary table</h2>

The question institutions face is what guarantees matter for their specific use case, and whether those guarantees are enforced by protocol or by trust.

<div style="overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 1rem 0;">
  <table style="width: 100%; min-width: 760px; border-collapse: collapse; table-layout: fixed; font-size: 15px; line-height: 1.45;">
    <thead>
      <tr>
        <th style="width: 20%; border: 1px solid #9ca3af; padding: 10px; text-align: left; vertical-align: top;">Threat</th>
        <th style="width: 40%; border: 1px solid #9ca3af; padding: 10px; text-align: left; vertical-align: top;">Canton</th>
        <th style="width: 40%; border: 1px solid #9ca3af; padding: 10px; text-align: left; vertical-align: top;">Prividium</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;"><strong>Can the operator steal funds?</strong></td>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;">Mediator can approve despite an informee's local reject. Malicious submitter can omit real signatories from the informee tree and finalize a double-spend. Both are detected post-finalization by ACS commitment reconciliation.</td>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;">No. ZK circuit rejects invalid state transitions; Ethereum verifies the proof.</td>
      </tr>
      <tr>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;"><strong>Can the operator censor transactions?</strong></td>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;">Participant or sequencer can refuse. Submit to 14+ nodes to guarantee inclusion. No forced inclusion beyond that.</td>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;">Sequencer can refuse. L1 priority queue exists, but the operator controls the filterer and can disable it.</td>
      </tr>
      <tr>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;"><strong>Can a user exit without the operator?</strong></td>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;">No mechanism. Assets exist only inside Canton.</td>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;">Exists in theory. Requires Merkle proof from operator data, so it is blocked if operator withholds data.</td>
      </tr>
      <tr>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;"><strong>Who sees transaction data?</strong></td>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;">No single node sees everything. Sequencer handles sealed envelopes. Protocol-enforced encryption.</td>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;">Operator sees all transactions in plaintext. Privacy is from the outside world only.</td>
      </tr>
      <tr>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;"><strong>Can settlement be reversed?</strong></td>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;">Requires corrupting more than one-third of roughly 40 invited validators. No economic penalty for misbehavior.</td>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;">Requires destroying more than one-third of roughly $100B staked ETH.</td>
      </tr>
      <tr>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;"><strong>Do records survive?</strong></td>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;">Pruning supported for GDPR. Participants exchange hashes to verify they agree on shared state, but these live on participant nodes rather than a public chain. If data is pruned, hashes may be all that remains.</td>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;">State roots on Ethereum are permanent, although not transaction records. No party can alter or delete them.</td>
      </tr>
      <tr>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;"><strong>Can fraud spread across the system?</strong></td>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;">Fraudulent state can propagate through cross-domain reassignments. A single compromised signing key (for example, the issuer of an Instrument) can produce forged contracts that pass counter-participant validation, and propagation across domains is invisible off-chain.</td>
        <td style="border: 1px solid #9ca3af; padding: 10px; vertical-align: top;">If using a shared bridge contract across all ZK Stack chains, the Emergency Board can upgrade with zero delay, and those transactions are publicly visible.</td>
      </tr>
    </tbody>
  </table>
</div>

Canton optimizes for multi-party coordination between known institutions who need confidentiality from each other. Its guarantees rest on the reputation, legal liability, and regulatory obligations of the participants. This maps to how institutional finance already governs counterparty risk.

Prividium optimizes for single-institution autonomy with an external correctness anchor. Its core guarantee - that the operator cannot forge state transitions - holds regardless of the operator's intentions. This is the property that distinguishes a blockchain from a signed database.

Both systems are permissioned. Both are centrally operated. Currently, both have weak censorship resistance. Strip away the differences and one remains: when the operator lies about what happened, Prividium has a mathematical proof on a neutral network that says otherwise. Canton has signed messages from the parties in dispute.
