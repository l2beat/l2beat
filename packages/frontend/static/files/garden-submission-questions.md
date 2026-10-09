# Submit your protocol for a CROPS review

Answer what applies and publish as a forum post. The criteria for each
property are listed on https://l2beat.com/garden.

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
10. Does any admin keep power over users, such as setting fees or limits? What
    can it change, and does it apply to every user equally?

## 3. Open source

*Can we read it, rebuild it, and run it ourselves?*

11. Which license? `[choose one]`
    MIT / Apache 2.0 / GPL / another OSI-approved license (name it) /
    source-available with restrictions / no license / closed source
12. Are all deployed contracts verified against published source?
    `[choose one]` yes / partly / no
13. Which components are published? `[choose all]`
    contracts / node / prover / interface / indexer / relayer
14. If there is a ZK, TEE or wasm program hash, can it be reproduced from
    source? Please share links to sources.
15. Can someone build and run the interface locally?
    `[choose one]` yes / no

## 4. Privacy

*Does using it cost you your privacy?* If the protocol makes no privacy claim,
say so and skip this section.

16. What is hidden, and what stays public?
17. What enforces it? `[choose all]`
    ZK proofs / encrypted state / stealth addresses / trusted hardware / other
18. Can anyone deanonymize a user, for example through a viewing key, an admin
    power or a compliance provider? `[choose one]` no / yes (say who)
19. Is there address screening, KYC, or blacklisting anywhere in the stack?
    `[choose one]` no / yes (say where)
20. Is privacy the default, or opt-in? `[choose one]` default / opt-in
21. How large is the anonymity set, and where is it published?

## 5. Security

*Can users lose their funds?*

22. Can the contracts holding user funds be upgraded? If so, by whom, and how
    long does an upgrade wait before it takes effect?
23. Which multisigs or admin keys exist, and what can each of them do?
24. If the system posts state to L1, how is that state validated?
25. Which external dependencies does it rely on, such as oracles, bridges or
    offchain services?
26. When were the critical contracts last upgraded, or last changed hands?
27. Which audits have been done: by whom, when, and where can we read them?
28. Is there a trusted setup? `[choose one]` no / yes (say which ceremony)
29. Are there circuit breakers or rate limits? What do they bound?
30. What are the known caveats, including any that cannot be patched?
31. Who monitors for incidents, and what happens when one is detected?

## 6. Anything else

32. Any other comments you'd like to leave?
