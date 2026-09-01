## Architecture

![EigenDA architecture](/images/da-layer-technology/eigenda/architecture.png#center)

EigenDA is composed by three types of off-chain entities: node operators, a disperser and a retriever.
- EigenDA **operators** are node operators running the EigenDA node software and are registered to the EigenDA AVS in EigenLayer.
- The **disperser** is the entity responsible for collecting the blobs from the sequencer, erasure coding them and generating the encoded blob's KZG commitments for each chunk. Although the disperser could be rollup-operated, it is currently a centralised entity operated by Eigen Labs.
- Lastly, the **retriever** client is responsible for querying the EigenDA operators to retrieve blob chunks, verifying their integrity and reconstructing the original blob.

### Operators Registration
Operators register with the EigenDAServiceManager via the registerOperatorToAVS() function, enabling them to participate in the data availability network. They are responsible for holding and serving blobs data, and earn rewards for their participation in the network.

![EigenDA operator registration](/images/da-layer-technology/eigenda/registration.png#center)

### Operators Stake Update

EigenDA operators' stake for quorum verification is fetched from the EigenDA StakeRegistry contract. To keep the stake in sync with changes in share balances in the EigenLayer DelegationManager (e.g., due to tokens delegated/undelegated to operators), the permissionless updateOperators() function on the RegistryCoordinator contract needs to be called periodically. This function updates the operators' quorum weight in the StakeRegistry contract based on the operators' shares in the EigenLayer DelegationManager contract.
![EigenDA operator stake sync](/images/da-layer-technology/eigenda/stakesync.png#center)

### Operators Blob Storage and Retrieval

The process of storing a blob on EigenDA works as follows. A sequencer submits blobs to the EigenDA Disperser, which erasure codes the blobs into chunks and generates KZG commitments and proofs for each chunk, certifying the correctness of the data. The disperser then sends the chunks, KZG commitments, and KZG proofs to the operators.
Multiple operators are responsible for storing chunks of the encoded data blobs and their associated KZG commitment and proof.
Once the chunks, KZG commitments, and KZG proofs are sent to the operators, each of them generates a signature certifying that they have stored the data. These signatures are then sent to the Disperser which aggregates them and submits them to Ethereum by sending a transaction to the EigenDAServiceManager (the DA bridge).

![EigenDA storing/retrieving](/images/da-layer-technology/eigenda/storing-retrieving.png#center)

## Data Availability Certificates

EigenDA uses different certificate formats depending on the version, each with corresponding verifier contracts:

### Certificate Types
- **V1 Certificates**: Used in EigenDA V1, verified through the EigenDAServiceManager contract via the confirmBatch() function. These certificates contain batch headers with KZG commitments and BLS aggregated signatures from operators.

- **V2/V3 Certificates**: Used in EigenDA V2, which introduces significant architectural changes. The sequencer acts as the relayer and does not post batches to the service manager. Instead, certificates are verified through dedicated DACert Verifier contracts that correspond to different certificate versions.

### EigenDA V2
In EigenDA V2, the architecture has evolved to improve efficiency:
- **Sequencer as Relayer**: The sequencer now acts as the relayer, eliminating the need to post batches to the service manager
- **Direct Certificate Verification**: Certificates are verified directly through version-specific DACert Verifier contracts
- **Improved Throughput**: The new architecture supports higher throughput by removing bottlenecks in the batch confirmation process


## L2 Data Availability
The verification process differs between EigenDA versions:

**EigenDA V1**: The Disperser collects operators' signatures and submits them to the EigenDAServiceManager contract via the confirmBatch() function. This submission includes a call to the BLSRegistry contract to verify signatures and check whether the required quorum of operators' stake has been achieved.

**EigenDA V2**: Certificate verification is handled by dedicated DACert Verifier contracts. Each certificate version corresponds to a specific verifier that validates the certificate format and cryptographic proofs without requiring batch submissions to a central service manager.

Threshold BLS signatures are not used. Instead, the threshold check is performed on the signers' total stake fetched by the StakeRegistry, and the stake threshold percentage to reach is provided in the batch header input data.

The EigenDARollupUtils.sol library's verifyBlob() function can then be used by L2s to verify that a data blob is included within a confirmed batch in the EigenDAServiceManager (V1) or through the appropriate DACert Verifier contract (V2/V3).
This function is not used by the EigenDAServiceManager contract itself, but rather by L2 systems to prove inclusion of the blob and that their trust assumptions (i.e., batch confirmation threshold) were as expected.
