# Submit your protocol — The Infinite Garden

Answer what applies and send it back to us. Partial answers are fine: anything
left blank becomes a caveat in the write-up rather than a reason to reject.
Everything you send is public.

Multiple-choice questions are marked `[choose one]` or `[choose all]`.

---

## 1. The basics

1. Project name.
2. What is it, in a few sentences?
3. Website, docs and source repository.
4. Is it live on mainnet, with real users and real funds? `[choose one]` yes / no
5. Which chains is it deployed on, and at which addresses?

## 2. Censorship resistance

*Can anyone use it, and can everyone leave?*

6. Can anyone use it without permission? `[choose one]`
   fully permissionless / allowlist or KYC gate / an operator must approve
7. Can anything be paused or frozen? If so, what, and by whom?
8. With the team, the frontend and every relayer gone, can users still
    withdraw? 
9. Do users depend on relayers or operators? How many are active, can users
    bypass them, and are there independent alternatives?

## 3. Open source

*Can we read it, rebuild it, and run it ourselves?*

10. Which license? `[choose one]`
    MIT / Apache 2.0 / GPL / source-available with restrictions / no license /
    closed source
11. Are all deployed contracts verified against published source?
    `[choose one]` yes / partly / no
12. Which components are published? `[choose all]`
    contracts / node / prover / interface / indexer / relayer
13. If there is a ZK, TEE or wasm program hash, can it be reproduced from
    source? Please share links to sources.
14. Can someone build and run the interface locally?
    `[choose one]` yes / no

## 4. Privacy

*Does using it cost you your privacy?* Skip this section if the protocol makes
no privacy claim — say so and move on.

15. What is hidden, and what stays public?
16. What enforces it? `[choose all]`
    zk proofs / encrypted state / stealth addresses / trusted hardware / other
17. Can anyone deanonymize a user — a view key, an admin power, a compliance
    provider? `[choose one]` no / yes — and say who.
18. Is there address screening, KYC, or blacklisting anywhere in the stack?
    `[choose one]` no / yes — and say where.
19. Is privacy the default, or opt-in? `[choose one]` default / opt-in

## 5. Security

*What has to go right for your funds to stay yours?*

20. Which audits have been done — by whom, when, and where can we read them?
21. Is there a trusted setup? `[choose one]` no / yes — and say which ceremony.
22. Are there circuit breakers or rate limits? What do they bound?
23. What are the known caveats, including any that cannot be patched?
24. Who monitors for incidents, and what happens when one is detected?

## 6. Anything else

25. Any other comments you'd like to leave?
