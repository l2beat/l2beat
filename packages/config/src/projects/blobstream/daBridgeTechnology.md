## Architecture
        
      ![Celestia blobstream architecture](/images/da-bridge-technology/celestia/blobstream/architecture.png#center)
      
       The Blobstream bridge is a data availability bridge that facilitates data availability commitments to be bridged between Celestia and Ethereum.
       The Blobstream bridge is composed of three main components: the **Blobstream** contract, the **Succinct Gateway** contracts, and the **Verifier** contracts.  <br /> 
       By default, Blobstream operates asynchronously, handling requests in a fulfillment-based manner. First, zero-knowledge proofs of Celestia block ranges are requested for proving. Requests can be submitted either off-chain through the Succinct API, or onchain through the requestCall() method of the Succinct Gateway smart contract.
       Alternatively, it is possible to run an SP1 Blobstream operator with local proving, allowing for self-generating the proofs.
       Once a proving request is received, the off-chain prover generates the proof and relays it to Blobstream contract. The Blobstream contract verifies the proof with the corresponding verifier contract and, if successful, stores the data commitment in storage. <br /> 
  
       Verifying a header range includes verifying tendermint consensus (header signatures are 2/3 of stake) and verifying the data commitment root.
        By default, Blobstream is updated by the Succinct operator at a regular cadence of 1 hour. Note that the update interval can vary across chains.
