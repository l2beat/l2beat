---
title: "Onchain privacy best practice"
description: "How to reveal only what you choose while onchain"
publishedOn: "2026-05-25"
authorId: l2beat_research
tag: Research
---

## Basic tips for using privacy protocols on Ethereum

[<-- back to Privacy Summary](/privacy/summary)

### Blockchains are not like banks

Transactions on the Ethereum blockchain are **fully transparent by default**. In practice, one wallet (address) is used for multiple transactions and often linked to personally identifiable information (more or less publicly). This link can be **voluntary** (e.g. *yourFullName.eth* or *yourAlias.eth*), **mandatory** (scanning your passport for access to a centralized exchange) and/or **accidental** (sending an onchain social media post from the wrong wallet). From the TradFi and offchain world, we are used to a different form of transparency: our transactions are assumed to be private except for certain centralized parties that we unfortunately cannot choose ourselves (credit card company, data resellers, bank, government, police, secret service).

The promise of current privacy protocols is to enable the use of a wallet’s fungible assets without associating the wallet address and the attached identity (like your onchain history, name, passport,..). The simplest ones build on top of or next to public blockchains and are often described as privacy ‘pools’. A nascent area is *programmable privacy*, which is not yet widely used, allows you to be private by default and to selectively disclose any information voluntarily.

![A privacy pool diagram showing deposits and withdrawals](/images/privacy/best-practices-pools.png)

The ‘pooling’ happens on the **address level**. Depositors send funds from their private addresses to a shared address (pool). This address is a smart contract that allows proving any deposit at a later point in time. Anyone who submits a proof of having deposited (sometimes called a ‘note’) can withdraw that amount. The privacy comes from the **withdrawal not being linked to a specific deposit**. But there are many ways to link withdrawals to their deposits, especially without some **minimum privacy pool hygiene** (or opsec).

### Privacy pool hygiene

These practices are aiming at uncompromised privacy which indirectly improves security, but many of them also benefit security directly.

- **Address privacy** - use different addresses for deposits and withdrawals. Most protocols allow you to use ‘relayers’ for the withdrawal: if used correctly, they cannot steal your funds and you can withdraw to a fresh address without the need for sending a transaction or gas. Address re-use in general is detrimental for your onchain privacy and can be avoided by some wallets automatically (e.g. with 'stealth addresses').
- **Amount privacy** - use different amounts for deposits and withdrawals. Some protocols like tornado cash nudge you to ‘chunk’ your withdrawals to different addresses. ‘Merging’ (depositing from unrelated addresses, withdrawing into one address) or ‘dispersing’ (depositing from one address, withdrawing to multiple unrelated addresses) assets via a privacy pool help to disassociate your deposits and withdrawals.
- **Time privacy** - let time pass between individual deposits and withdrawals. During this time, the anonymity set of depositors can only grow. Do not cluster transactions during the same local time of day. Active wallets of non-bots can be easily profiled as to their user’s timezone.
- **Software privacy** - use an open source, audited software stack. This includes primarily your wallet, but also your browser and your operating system. Some popular wallets are known to collect and sell the exact information you are aiming to hide with your use of a privacy tool: the association between your offchain identity and your onchain addresses. If you do not fully trust your wallet for privacy, remove it after depositing and use a newly installed, different one for the withdrawal. You can do the same for your browser. Use an RPC you trust (preferably your own node) and run your own IPFS node if using any IPFS dApp frontends. Avoid web2 ‘gateways’ for ENS and IPFS.
- **IP address privacy** - apply web2 best practice. Disassociating your deposit wallet from your withdrawal wallet onchain is useless if you associate both with identifying information offchain. This happens through web2 fingerprinting like your IP address or browser data. You can minimize your web2 fingerprint by using VPNs, removing cookies and other browser data regularly, and generally changing your digital environment between your deposit and your withdrawal.
- **Discipline** - always keep privacy in mind and use redundancy. A small mistake at any later point in time can doxx an address that was safe before. Most of these practices also minimize data harvesting in less sensitive areas of digital life so they are worth following habitually, because privacy should be normal.

### Anonymity set

An anonymity set is a group of possible entities who could be equally associated with a given transaction. It is the set of people you can hide among. Naively, a standard privacy pool's anonymity set includes all deposits, meaning a given withdrawal could have come from any of the deposits to the pool (you can also model a private blockchain like zcash as a 'privacy pool' by only looking at bridge deposits/withdrawals to that chain). In practice, things look very different: Every deposit that can be associated with another deposit and/or a withdrawal because of address re-use, timing analysis or any other information, is removed from the anonymity set. Experts like @zachxbt use [a combination of onchain and offchain information](https://x.com/zachxbt/status/1940392708104937827) to deanonymise most transactions. This significantly reduces the anonymity set out of the perspective of such an investigator and makes future deanonymisation easier. It can be assumed that state-sponsored actors, like secret services, have even more sources for personally identifiable information, like for example public RPC logs (IP addresses), general web traffic or data sold by wallets and web trackers who actively violate user privacy.

### Case study

TornadoCash is the OG Ethereum privacy protocol that was deployed at a time when privacy was not normal (2019). In fact, some governments, especially the Unites States one, found it so 'notorious' that they [put its smart contracts on the OFAC list](https://home.treasury.gov/news/press-releases/jy0916) of sanctioned entities. Their motivation likely came from cyber criminals trying to launder large amounts on funds on the simple mixer app, which only features opt-in compliance, is immutable, autonomous and radically open. Although the main sanction was [later removed](https://home.treasury.gov/news/press-releases/sb0057), this incident is a good example of what CROPS (Censorship Resistant, Open, Private, Secure) architecture on the blockchain really means.

Even before TornadoCash was put on the OFAC blacklist, it tried to comply with sanctions against user addresses with [a frontend update](https://x.com/TornadoCash/status/1514904975037669386) that included a centralised blocklist. This blocked users whose addresses were sanctioned but it only worked on the tornado.cash web2 domain. Interacting with the smart contracts directly or using a local or ipfs-sourced frontend remained permissionless. Why?
1. The smart contracts that actually implement the TornadoCash asset escrows are immutable (the contract logic cannot be changed)
2. The `tornadocash.eth` ENS stores an IPFS content hash in [an Ethereum smart contract](https://etherscan.io/address/0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41#readProxyContract#F5). From the TornadoCash side, this hash can only be changed by the DAO with an onchain proposal and TORN token voting. Each content hash can be permissionlessly retrieved through the IPFS network and locally verified. An onchain proposal to add sanction scanning to the frontend would likely not have passed the vote. The domain tornado.cash is centrally controlled and can thus be updated immediately without a DAO vote.
3. Users who audit the frontend code themselves or via trusted parties can just run this audited code locally to interact with the permissionless contracts.

![A schematic 'root of trust' image showing how information gets from the blockchain to the user](/images/privacy/best-practices-root.png)

Even the onchain root of trust for the frontend, the ipfs content hash in the ENS resolver contract, was compromised later, for ~2 months, by [a governance proposal](https://etherscan.io/tx/0xd0702bce5e0608d042c7673bc382a605f7eb94dd354c36c56220b4238c1ab0d1/advanced#eventlog) that hid a javascript snippet in the frontend code which would steal all private notes at deposit time. Since TornadoCash notes act like private keys for the deposited assets, trusting the onchain ipfs hash and the TORN DAO during those two months (even if using local nodes and best practice) would have resulted in losing all deposited funds. The only protection against this attack vector would have been to deeply audit the frontend code before using it (which the governance system did not do) or developing a custom interface to interact with the smart contracts directly. The frontend code was rolled back to an uncompromised version [in a later proposal](https://etherscan.io/tx/0x4fb9cbe37f0f44a5f8da248649481c42607601b37b60fff1017fdebb0c85f1da/advanced#eventlog), but there have since been many proposals that changed the ipfs to newer versions...

[<-- back to Privacy Summary](/privacy/summary)
