Tornado cash has a TORN DAO, which does not have the authority to upgrade or modify existing pools in any way. However it controls a significant portion of the Tornado cash protocol and periphery, including:

1. **Default router for deposits and withdrawals and the official registry of supported pools**. Malicious upgrades of these components could lead to users losing deposited tokens.  
2. **Standard UI IPFS hash registered on ENS** ([link](https://app.ens.domains/tornadocash.eth)). Malicious upgrades of these components could lead to users losing deposited tokens.  
3. **TORN token itself**. Malicious upgrades of the token could lead to token transfers being frozen.  
4. **Registered relayers**. Malicious upgrades of these components could remove all registered relayers, disrupting user-relayer coordination and complicating private withdrawals.

