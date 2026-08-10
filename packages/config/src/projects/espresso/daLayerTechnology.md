## Architecture
![EspressoDA architecture](/images/da-layer-technology/espressoDA/architecture.png#center)

## Consensus

Espresso uses the HotShot consensus protocol, a communication-efficient proof-of-stake system that is Byzantine Fault Tolerant (BFT).
The validator set is permissionless: anyone can stake ESP tokens and the top 100 validators by total stake form the active consensus set, which is dynamically adjusted at epoch boundaries.
Built on HotStuff-2, it achieves linear communication complexity using a pacemaker module to synchronize views and ensures safety and liveness as long as over two-thirds of the stake is controlled by honest nodes.
Although validators are required to stake ESP to participate, there is currently no slashing mechanism in place for misbehaving nodes.

HotShot operates in a view-by-view manner, where each view designates a leader and an external builder. 
During a view, the consensus proposer finalizes a block with a certificate of availability by utilizing Espresso DA for data availability.

## Data Availability Certificate

Once the proposer sends data to HotShot node operators, they initiate Espresso DA's three layers of data availability:

- **VID Layer**: Disperses erasure-coded data to all nodes. VID layer nodes only store chunks of the data.
- **DA Committee Layer**: Uploads the data and commitment to a small DA committee. Every node in the committee stores the full data.
- **CDN Layer**: Uploads the full data to a content delivery network (CDN). 

Once nodes receive and store the data, they return votes to the proposer. DAVotes are votes from committee nodes storing the full data, while QuorumVotes are votes from nodes storing erasure-coded shares of the data.
A DA certificate consists of two components, the retrievability certificate and the optimistic DAC certificate:

- **Retrievability Certificate**: Formed when the DA leader collects 2/3 + 1 QuorumVotes.
- **Optimistic DAC Certificate**: Formed when the DA leader gathers 2/3 + 1 DAVotes from the DA committee. Currently, the committee size is 21 members, so the threshold is 15 signatures.


Once the DAC is formed, the DA leader stops broadcasting data to the nodes.

## L2s Data Availability

The life cycle of L2 transactions begins with users submitting transactions to the Espresso DA mempool through an RPC endpoint, or directly to the block builder private mempool, including a namespace ID to indicate the target L2 rollup. 
A DA leader collects and disperses these transactions across Espresso DA's layers to form a DA certificate. The leader then broadcasts a proposal with a vector commitment for the transactions to the HotShot consensus layer. 
The finalization of the block commitment in HotShot establishes data availability for the corresponding transactions.
After block finalization in HotShot, the relayer propagates the commitment and quorum certificates to the L1 Light Client contract, which verifies the certificate and the HotShot state SNARK proof via the verifyProof function. 

![EspressoDA architecture with L2s](/images/da-layer-technology/espressoDA/architectureL2.png#center)

Users can retrieve data by querying any of Espresso DA's layers, though the VID layer is slower due to the reconstruction of erasure-coded shares. L2s can also use a verifyInclusion function on an L1 light client smart contract to confirm a blob's inclusion in the Espresso DA HotShot chain.
