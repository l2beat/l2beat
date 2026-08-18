# Submit your protocol — The Infinite Garden

Answer what applies and send it back to us. Partial answers are fine: anything
left blank becomes a caveat in the write-up rather than a reason to reject.
Everything you send is public.

Multiple-choice questions are marked `[choose one]` or `[choose all]`.

---

## 1. The basics

1. Project name.
2. What is it, in two sentences?
3. Website, docs and source repository.
4. Is it live on mainnet, with real users and real funds? `[choose one]` yes / no
5. What kind of project is it? `[choose all]` L1 / L2 / L3 / privacy protocol /
   DeFi protocol / interop protocol / other
6. Which chains is it deployed on, and at which addresses?
7. Who can we ask follow-up questions?

## 2. Censorship resistance

*Can anyone use it, and can everyone leave?*

8. Can anyone use it without permission? `[choose one]`
   fully permissionless / allowlist or KYC gate / an operator must approve
9. Who can stop a user from transacting? `[choose one]`
   nobody / a DAO vote / a multisig / a single EOA / other
10. Can anything be paused or frozen? If so, what, and by whom?
11. Are the contracts upgradeable? If so, how long is the delay before an
    upgrade takes effect?
12. With the team, the frontend and every relayer gone, can users still
    withdraw? `[choose one]` yes / no — and describe how.
13. Do users depend on relayers or operators? How many are active, can users
    bypass them, and are there independent alternatives?

## 3. Open source

*Can we read it, rebuild it, and run it ourselves?*

14. Which license? `[choose one]`
    MIT / Apache 2.0 / GPL / source-available with restrictions / no license /
    closed source
15. Are all deployed contracts verified against published source?
    `[choose one]` yes / partly / no
16. Which components are published? `[choose all]`
    contracts / node / prover / interface / indexer / relayer
17. If there is a ZK, TEE or wasm program hash, can it be reproduced from
    source? `[choose one]` yes / no / not applicable — and describe how.
18. Can someone build and run the interface locally?
    `[choose one]` yes / no

## 4. Privacy

*Does using it cost you your privacy?* Skip this section if the protocol makes
no privacy claim — say so and move on.

19. What is hidden, and what stays public?
20. What enforces it? `[choose all]`
    zk proofs / encrypted state / stealth addresses / trusted hardware / other
21. Can anyone deanonymize a user — a view key, an admin power, a compliance
    provider? `[choose one]` no / yes — and say who.
22. Is there address screening, KYC, or blacklisting anywhere in the stack?
    `[choose one]` no / yes — and say where.
23. How large is the anonymity set, and how is it measured?
24. Is privacy the default, or opt-in? `[choose one]` default / opt-in

## 5. Security

*What has to go right for your funds to stay yours?*

25. Who can move or freeze user funds, and with how much warning?
26. Are the contracts holding user funds immutable?
    `[choose one]` immutable / upgradeable behind a delay / instantly upgradeable
27. Which audits have been done — by whom, when, and where can we read them?
28. Is there a trusted setup? `[choose one]` no / yes — and say which ceremony.
29. Are there circuit breakers or rate limits? What do they bound?
30. What are the known caveats, including any that cannot be patched?
31. Who monitors for incidents, and what happens when one is detected?

## 6. Anything else

32. If you were reviewing this yourself, what would you flag first?
