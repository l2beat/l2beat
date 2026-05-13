---
  lastUpdated: "2026-05-12"
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
- **IP address privacy** - apply web2 best practices. Disassociating your deposit wallet from your withdrawal wallet is useless if you associate both with your full identity. This happens through web2 fingerprinting. You can minimize your web2 fingerprint by using VPNs, removing cookies and other browser data regularly, and generally changing your environment between your deposit and your withdrawal.
- **Privacy discipline** - always keep privacy in mind and use redundancy. A small mistake at any later point in time can doxx an address that was safe before. Most of these practices also minimize data harvesting in less sensitive areas of digital life so they are worth following habitually.
