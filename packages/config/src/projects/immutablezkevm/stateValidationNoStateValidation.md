Immutable zkEVM bridge makes use of Axelar network (a Cosmos chain) to transfer assets between Ethereum and Immutable zkEVM. As in any standard Cosmos chain, validators are bonded by staking tokens and can be slashed by social consensus for misbehaviour. 

A deposit starts by a user depositing tokens on the Bridge contract and then the tokens are minted on the destination chain.

Withdrawals to Ethereum can be delayed by a predefined time with a flow rate mechanism that controls outflows of the bridge escrow. The ProxyAdmin or an address with the rate_control role can define so-called buckets for each token: Each bucket has a capacity and a refill rate. All withdrawals that exceed the tokens bucket capacity trigger the withdrawal queue, which delays subsequent withdrawals of *any* of the bridges' assets for a time defined in withdrawalDelay (currently {{withdrawalDelay}}).
