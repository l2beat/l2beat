# Arbitrum Checker

This script checks the current deployment of Arbitrum Rollup

Arbitrum on L1 comprises several contracts. All of these are built using
TransparentUpgradableProxy

Inbox - contract used by users do depositETH. This ETH ends up in a bridge
SequencerInbox - contract used by Sequencer to post L2Transaction batchf
Bridge - contract responsible for L1 <--> L2 communication. Holds billions worth of ETH
Outbox - ????
Rollup - ????
RollupEventBridge

Additionally there's an interconnected System of Gateways
L1GatewayRouter
L1ERC20Gateway
L1CustomGateway

The script:

1. Checks if listed above Smart Contracts are still Proxies (TransparentUpgradableProxy)
2. Checks the implementation and when it was set (i.e. implemenation since Dec 2021)
3. Checks the owner of the Proxy (a contract that can change implementation/upgrade the contract)

4. If the owner is ProxyAdmin, checks the owner of the ProxyAdmin
5. If the owner is GnosisSafe, checks current threshold and list of owners (eg 2-4)
6. If the owner of MSig is another Msig, repeat 4-6 recursively

7. List important parameters of the Rollup (from user's perspective)
   - who can post tx batch
   - who can post state root
   - who can chellange state root (engage in the fraud proof verification game)
   - who can set up the above parameters ????
