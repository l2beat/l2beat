## Architecture

![Avail vector architecture](/images/da-bridge-technology/avail/vector/architecture.png#center)

The Vector bridge is a data availability bridge that facilitates data availability commitments to be bridged between Avail and Ethereum.
The SP1 Vector bridge is composed of three main components: the **Vector** contract, the **Succinct Gateway** contracts, and the **Verifier** contracts.  <br /> 
By default, Vector operates asynchronously, handling requests in a fulfillment-based manner. First, zero-knowledge proofs of Avail block ranges are requested for proving. Requests can be submitted either off-chain through the Succinct API, or onchain through the requestCall() method of the Succinct Gateway smart contract.
Alternatively, it is possible to run an SP1 Vector operator with local proving, allowing for self-generating the proofs.
Once a proving request is received, the off-chain prover generates the proof and relays it to the Vector contract. The Vector contract verifies the proof with the corresponding verifier contract and, if successful, stores the data commitment in storage. <br /> 

By default, Vector on Ethereum is updated by the Succinct operator at a cadence of approximately 1.5 hours.
