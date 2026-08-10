Upgrades are managed by a Governance smart contract on L1. The owner of smart contract ({{govOwnerAddress}}) can schedule either transparent or shadow proposals.
Transparent proposals have full upgrade data onchain when scheduled. Shadow proposals post only the hash of the upgrade data onchain when proposed, and the full upgrade data during execution.

Scheduled proposals must wait a minimal delay before being executed (currently {{minGovUpgradeDelayS}}). Governance supports a 'securityCouncil' role ({{govSecurityCouncilAddress}}) that can execute proposals without any delay.

Currently, the governance process does not involve ADI token holders. See this link for more info: [https://docs.adi.foundation/appendix/appendix-b-governance](https://docs.adi.foundation/appendix/appendix-b-governance).
