## Architecture
![gmnetworkDA layer](/images/da-layer-technology/gmnetworkda/architecture.png#center)

## Data Availability Challenges
Automata relies on DA challenges for data availability. 
The DA Provider submits an input commitment on Ethereum, and users can request the data behind the commitment off-chain from the DA Provider.
If a DA challenger finds that the data behind a tx data commitment is not available, they can submit a challenge which requires locking a bond within {{daChallengeWindow}}. 
A challenge can be resolved by publishing the preimage data within an additional {{daResolveWindow}}.
In such case, a portion of the challenger bond is burned, with the exact amount estimated as the cost incurred by the resolver to publish the full data, meaning that the resolver and challenger will approximately lose the same amount of funds.
The system is not secure if the malicious sequencer is able to outspend the altruistic challengers. 
If instead, after a challenge, the preimage data is not published, the chain reorgs to the last fully derivable state.

## DA Bridge
Only hashes of data batches are posted as DA commitments to an EOA on Ethereum.
However, there is a mechanism that allows users to challenge unavailability of data.
