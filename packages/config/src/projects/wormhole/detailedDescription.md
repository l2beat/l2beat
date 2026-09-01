# Architecture
The Wormhole messaging protocol consists of a `WormholeCore` contract on each supported chain. Application contracts like the Token Bridge, the multichain token framework *NTT* ('native token transfers') and the Mayan intent framework contracts are each connected to it. The token bridge is a lock-minting token bridge, NTT is a customizable multichain token framework and Mayan supports stablecoin transfers and crosschain asset swaps of any kind as an intent protocol.

# Crosschain oracle and validation
Wormhole uses the same validators for its core messaging protocol on all supported chains. They are called *guardians* and validate crosschain messages with a 13/19 threshold. Guardians are external validator companies who are expected to run their own nodes of all chains they validate on, but they also delegate the running of full nodes to others for smaller chains.

# Upgradeability
The core protocol and token bridge contracts are upgradeable by the same *guardians* who validate crosschain messages. Application-level contracts can have custom upgradeability.

# Monitoring
Wormhole provides a [block explorer](https://wormholescan.io/) which is mostly intended for users and researchers tracking crosschain transactions and for aggregate metrics. As for [security and monitoring tools](https://wormhole-foundation.github.io/wormhole-dashboard/#/?endpoint=Mainnet), Wormhole offers *Governor* a global token flow monitoring layer that Guardians can use to identify suspicious transfers before signing them. *Global Accountant* tracks the circulating supply of *WTT* and *NTT* assets on all chains and alerts Guardians if a transaction would increase the supply.
