Facet uses FCT as its native gas token, which is minted through L1 gas consumption rather than being pre-minted. FCT issuance is directly tied to the amount of L1 ETH burned to pay calldata gas in Ethereum transactions, calculated as:

FCT minted = ETH burned for calldata × mint rate

ETH burned for calldata = L1 base fee × (total L1 gas cost - 21,000)

The system targets issuing ~78,300 FCT every 500 Facet blocks. If less than the target is minted in 500 blocks, the mint rate increases proportionally (up to a maximum 4x increase). If the target is reached in fewer than 500 blocks, the mint rate decreases proportionally (up to a maximum 75% decrease).

The maximum supply of FCT is ~1.65B. Once 50% of the supply is minted, the per-period target (now ~78,300) will be halved. It will be halved again at 75%, then at 87.5%, and so forth. The period target and period length are selected so that halvings will occur approximately every 5,256,000 blocks.

This mechanism is similar to standard OP Stack guaranteed gas markets, where L1 gas is burned to purchase L2 gas for deposits through an EIP-1559-style fee market. However, on Facet, gas purchased in this way accrues to the purchaser's native balance on the L2, whereas in the OP Stack it can only be used for a single transaction.

![Facet Token Minting and Bridging](/images/other-considerations/facet.png#center).
