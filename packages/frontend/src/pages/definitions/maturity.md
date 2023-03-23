## Maturitys - milestones for rollups

### Challenge

There are currently a large number of (optimistic and ZK) rollup projects, at various stages of development. One pattern that is common to almost all of them is the use of temporary training wheels: while a project’s tech is still immature, the project launches early anyway to allow the ecosystem to start forming, but instead of relying fully on its fraud proofs or ZK proofs, there is some kind of multisig that has the ability to force a particular outcome in case there are bugs in the code.

### Solution: A milestone-based schema

A simple milestone-based schema to help us categorize rollups into three different stages, depending on how heavily they rely on their training wheels. **This is intended to achieve a few goals:**

1. Make it easier for users to identify the extent to which a particular rollup depends on “trust in a specific group of humans” vs “trust in code”
2. Help motivate rollup projects to improve on their trust models, reducing the risk that trust minimization gets deprioritized because it is “less visible” than eg. flashy UX improvements
3. Give the ecosystem some precise milestones to coordinate around and celebrate, letting us say when “The Surge” is half-complete or fully complete, paralleling “The Merge”

This schema is NOT intended to imply a moral judgement that movement to maximum trust in code as quickly as possible is the only correct course of action. **Rollups absolutely should have a clear roadmap to taking off training wheels, but they should take training wheels off only when they are ready.**

### The classification schema

<h4>
  <span class='flex items-center gap-2'>
  <span class='bg-red-400 text-white w-8 rounded-md text-center leading-tight text-xl font-medium'>D</span>
  Under construction
  </span>
</h4>

Requirements:

- The project should call itself a rollup.
- All rollup transactions should go on-chain.
- There should exist a “rollup full node”: an independently runnable software package that can read the L1 chain, extract and the rollup chain, and compute the current state of the rollup chain. If it disagrees with a rollup state root posted into the contract, it should give an alarm.
- There should be machinery that allows users to either post rollup transactions or at least ensure a withdrawal of their assets with no cooperation from the operator. That is, the operator cannot freeze or steal users’ assets by censoring users; their only possible tool for doing so must be to post a false state root.
- It’s okay if the on-chain mechanism for posting new state roots is simply a multisig, with no active fraud proof or validity proof whatsoever.

<h4>
  <span class='flex items-center gap-2'>
  <span class='bg-yellow-100 text-black w-8 rounded-md text-center leading-tight text-xl font-medium'>B</span>
  Limited security
  </span>
</h4>

Requirements:

- There must be a **running fraud proof or validity proof scheme**, which has the practical authority to accept or reject which state roots get accepted by the rollup contract.
- There can exist a multisig-based override mechanism (“security council”) that can override the fraud proof or validity proof system’s outputs and post state roots, to be used in case the proof system code is bugged. However:
  - The multisig must be **6 of 8** or stricter (that is, >= 8 participants AND >= 75% threshold)',
  - At least a **quorum-blocking** group (that is, enough participants to prevent the multisig from acting) **must be outside the organization** that is running the rollup.
- There can exist an upgrade mechanism, but if it has a lower threshold than the multisig, upgrades must have a mandatory activation delay of at least 7 days or the maximum length of the fraud proof game, whichever is longer. The goal of this rule is to ensure that the upgrade mechanism cannot be used to intervene in real-time disputes.
