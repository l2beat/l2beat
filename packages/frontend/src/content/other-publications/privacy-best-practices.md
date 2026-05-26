---
title: "Onchain privacy best practices"
description: "Basic tips for using privacy protocols on Ethereum without accidentally linking deposits, withdrawals, and offchain identity."
publishedOn: "2026-05-25"
authorId: l2beat_research
tag: Research
---

## Basic tips for using privacy protocols on Ethereum

### Blockchains are not like banks

Transactions on the Ethereum blockchain are **fully transparent by default**. In practice, one wallet (address) is used for multiple transactions and often linked to the personal identity (more or less publicly). This link can be **voluntary** (e.g. *yourFullName.eth* or *yourAlias.eth*), **mandatory** (scanning your passport for access to a centralized exchange) and/or **accidental** (sending an onchain social media post from the wrong wallet). From the TradFi and offchain world, we are used to a different form of transparency: our transactions are assumed to be private except for certain centralized parties that we cannot choose ourselves (credit card company, data resellers, bank, government, police, secret service).

The promise of privacy protocols is to enable the use of a wallet’s fungible assets without associating the wallet address and the attached identity (like your onchain history, name, passport,..). Current protocols build on top of or next to public blockchains and are often described as privacy ‘pools’.

![A privacy pool diagram showing deposits and withdrawals](/images/privacy/best-practices-pools.png)

The ‘pooling’ happens on the **address level**. Depositors send funds from their private addresses to a shared address (pool). This address is a smart contract that allows proving any deposit at a later point in time. Anyone who submits a proof of having deposited (sometimes called a ‘note’) can withdraw that amount. The privacy comes from the **withdrawal not being linked to a specific deposit**. But there are many ways to link withdrawals to their deposits, especially without some **minimum privacy pool hygiene** (or opsec).

### Privacy pool hygiene

These practices are aiming at uncompromised privacy which indirectly improves security, but many of them also benefit security directly.

- **Address privacy** - use different addresses for deposits and withdrawals. Most protocols allow you to use ‘relayers’ for the withdrawal: if used correctly, they cannot steal your funds and you can withdraw to a fresh address without the need for sending a transaction or gas.
- **Amount privacy** - use different amounts for deposits and withdrawals. Some protocols like tornado cash nudge you to ‘chunk’ your withdrawals to different addresses. ‘Merging’ (depositing from unrelated addresses, withdrawing into one address) or ‘dispersing’ (depositing from one address, withdrawing to multiple unrelated addresses) assets via a privacy pool help to disassociate your deposits and withdrawals.
- **Time privacy** - let time pass between deposit and withdrawal. During this time, the anonymity set of depositors can only grow. Do not withdraw during the same local time of day as the deposit(s). Active wallets of non-bots can be easily profiled as to their user’s timezone.
- **Software privacy** - use an open source, audited software stack. This includes primarily your wallet, but also your browser and your operating system. Some popular wallets are known to collect and sell the exact information you are aiming to hide with your use of a privacy pool: the association between your identity and your onchain addresses. If you do not fully trust your wallet for privacy, remove it after depositing and use a newly installed, different one for the withdrawal. You can do the same for your browser. Use an RPC you trust (preferably your own node) and run your own IPFS node if using any IPFS dApp frontends. Avoid ‘gateways’ for ENS and IPFS.
- **IP address privacy** - apply web2 best practices. Disassociating your deposit wallet from your withdrawal wallet onchain is useless if you associate both with identifying information offchain. This happens through web2 fingerprinting like your IP address or browser data. You can minimize your web2 fingerprint by using VPNs, removing cookies and other browser data regularly, and generally changing your digital environment between your deposit and your withdrawal.
- **Discipline** - always keep privacy in mind and use redundancy. A small mistake at any later point in time can doxx an address that was safe before. Most of these practices also minimize data harvesting in less sensitive areas of digital life so they are worth following habitually, because privacy should be normal.

### Case study

TornadoCash is the OG privacy protocol that was deployed before privacy became cool (2019). In fact, some governments, especially the Unites States one, found it so uncool ('notorious') that they [put the entire protocol on the OFAC list](https://home.treasury.gov/news/press-releases/jy0916) of sanctioned entities. This was likely due to cyber criminals trying to launder large amounts on funds on the simple privacy pool platform, which only features opt-in compliance and is immutable and radically permissionless. Although the main sanction was [subsequently removed](https://home.treasury.gov/news/press-releases/sb0057), this incident is a good example of what CROPS (Censorship Resistant, Open, Private, Secure) architecture on the blockchain really means.

Even before TornadoCash was put on the OFAC blacklist, it tried to comply with sanctions against user addresses with [a frontend update](https://x.com/TornadoCash/status/1514904975037669386). This blocked users whose addresses were sanctioned but it only worked on the tornado.cash web2 domain. Interacting with the smart contracts directly or using a local or ipfs-sourced frontend remained permissionless. The reasons are:
1. The smart contracts that actually implement the TornadoCash asset escrows are immutable (the contract logic cannot be changed)
2. The `tornadocash.eth` ENS stores an IPFS content hash in [an Ethereum smart contract](https://etherscan.io/address/0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41#readProxyContract#F5). From the TornadoCash side, this hash can only be changed by the DAO with an onchain proposal and TORN token voting. Each content hash can be permissionlessly retrieved through the IPFS network and locally verified. An onchain proposal to add sanction scanning to the frontend would likely not have passed the vote. The domain tornado.cash is centrally controlled and can thus be updated immediately without a DAO vote.
3. Users who audit the frontend code themselves or via trusted parties can just run this audited code locally to interact with the permissionless contracts.

![A schematic 'root of trust' image showing how information gets from the blockchain to the user](/images/privacy/best-practices-root.png)

Even the onchain root of trust for the frontend, the ipfs content hash in the ENS resolver contract, was compromised later, for ~2 months, by [a governance proposal](https://etherscan.io/tx/0xd0702bce5e0608d042c7673bc382a605f7eb94dd354c36c56220b4238c1ab0d1/advanced#eventlog) that hid a javascript snippet in the frontend code which would steal all private notes at deposit time. Since TornadoCash notes act like private keys for the deposited assets, trusting the onchain ipfs hash and the TORN DAO during those two months (even if using local nodes and some best practices) would have resulted in losing all deposited funds. The only protection against this attack vector would have been to deeply audit the frontend code before using it (which the governance system did not do) or developing a custom interface to interact with the smart contracts directly. The frontend code was rolled back to an uncompromised version [in a later proposal](https://etherscan.io/tx/0x4fb9cbe37f0f44a5f8da248649481c42607601b37b60fff1017fdebb0c85f1da/advanced#eventlog), but there have since been many proposals that changed the ipfs to newer versions...

This example illustrates that, even for a privacy app that has immutable smart contracts (not all do!), there remain unexpected attack vectors for both security and violation of privacy. We are listing some of them here:
- smart contracts: use immutable protocols, monitor governance and mutable dependencies (like the ipfs hash and routers), watch L2BEAT updates ;)
- RPC: run light client or full node
- wallet: use a popular, audited, freshly-installed, open-source wallet
- browser: similar to wallet
