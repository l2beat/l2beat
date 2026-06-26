## Architecture
![Anytrust architecture](/images/da-layer-technology/anytrust/architecture{{membersCount}}.png#center)

The DAC uses a data availability solution built on the AnyTrust protocol. It is composed of the following components:
- **Sequencer Inbox**: Main entry point for the Sequencer submitting transaction batches.
- **Data Availability Committee (DAC)**: A group of members responsible for storing and providing data on demand.
- **Data Availability Certificate (DACert)**: A commitment ensuring that data blobs are available without needing full data posting on the L1 chain. 


Committee members run servers that support APIs for storing and retrieving data blobs. 
The Sequencer API allows the rollup Sequencer to submit data blobs for storage, while the REST API enables anyone to fetch data by hash. 
When the Sequencer produces a data batch, it sends the batch along with an expiration time to Committee members, who store it and sign it. 
Once enough signatures are collected, the Sequencer aggregates them into a valid DACert and posts it to the L1 chain inbox. 
If the Sequencer fails to collect enough signatures, it falls back to posting the full data to the L1 chain as calldata. 


A DACert includes a hash of the data block, an expiration time, and proof that the required threshold of Committee members have signed off on the data. 
The proof consists of a hash of the Keyset used in signing, a bitmap indicating which members signed, and a BLS aggregated signature. 
L2 nodes reading from the sequencer inbox verify the certificate’s validity by checking the number of signers, the aggregated signature, and that the expiration time is at least two weeks ahead of the L2 timestamp. 
If the DACert is valid, it provides a proof that the corresponding data is available from honest committee members.

## DA Bridge Architecture
![Anytrust bridge architecture](/images/da-bridge-technology/anytrust/architecture{{diagramType}}.png#center)

The DA commitments are posted to the destination chain through the sequencer inbox, using the inbox as a DA bridge.
The DA commitment consists of Data Availability Certificate (DACert), including a hash of the data block, an expiration time, and a proof that the required threshold of Committee members have signed off on the data.
The sequencer distributes the data and collects signatures from Committee members offchain. Only the DACert is posted by the sequencer to the destination chain inbox (the DA bridge), achieving destination chain transaction ordering finality in a single onchain transaction.
