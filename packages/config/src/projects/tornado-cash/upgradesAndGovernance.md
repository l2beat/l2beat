Tornado cash has a TORN DAO, which does not have the authority to upgrade or modify existing pools in any way. However it controls a significant portion of the Tornado cash protocol and periphery, including:

1. **Default router for deposits and withdrawals and the official registry of supported pools**. Malicious upgrades of these components could lead to users losing deposited tokens.  
2. **Standard UI IPFS hash registered on ENS** ([link](https://app.ens.domains/tornadocash.eth)). Malicious upgrades of these components could lead to users losing deposited tokens.  
3. **TORN token itself**. Malicious upgrades of the token could lead to token transfers being frozen.  
4. **Registered relayers**. Malicious upgrades of these components could remove all registered relayers, disrupting user-relayer coordination and complicating private withdrawals.

### **Governance flow**

1. Users lock TORN token in the Governance contract ([0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce](https://etherscan.io/address/0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce)). After voting or proposing, staked tokens are locked for {{stakeLockPeriod}} after proposal ends, preventing governance hopping. The stake can be delegated to another address.  
2. Anyone with at least {{proposalThreshold}} TORN can create a proposal. The proposal spends {{votingDelay}} in the Pending state, where voting is still disabled, followed by {{votingPeriod}} of Active state, when votes are cast. If the vote outcome changes in the last {{closingPeriod}}, the voting period is extended by another {{voteExtendTime}}.  
3. Proposal is accepted by the simple majority with a required quorum of {{quorumVotes}} TORN. Once accepted, {{executionDelay}} of Timelocked state allow exiting the protocol to everyone who disagrees with the proposal. Afterwards, the proposal can be permissionlessly executed within {{executionExpiration}}.
