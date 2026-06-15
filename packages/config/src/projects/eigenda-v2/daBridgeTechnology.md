## EigenDA V2 Architecture

EigenDA V2 introduces a more efficient architecture where the L2 sequencer acts as the relayer, eliminating the need for separate permissioned relayers:

- **Sequencer as Relayer**: The sequencer acts as the relayer, eliminating the need for separate permissioned relayers
- **Direct Certificate Verification**: Multiple DACert Verifier contracts handle different certificate versions (V2, V3). These contracts read operator/state metadata via EigenDA and EigenLayer core contracts (incl. ServiceManager components) and verify signatures and stake thresholds.
- **Version-Specific Verification**: Each certificate version has a corresponding verifier contract that validates the specific certificate format and cryptographic proofs

### Certificate Types and Verifiers
EigenDA V2 supports multiple certificate formats:

- **V2 Certificates**: Contain blob inclusion info, batch headers, and non-signer stakes with signatures. Verified through EigenDACertVerifierV2 contracts.
- **V3 Certificates**: Similar structure to V2 but with reordered fields for optimization. Verified through EigenDACertVerifierV3 contracts.

### Verification Process
1. **Certificate Construction**: The EigenDA client constructs certificates from BlobStatusReply data received from the disperser
2. **Version Detection**: The certificate version is determined from the commitment structure  
3. **Verifier Selection**: The appropriate DACert Verifier contract is selected based on the certificate version using the EigenDACertVerifierRouter
4. **Onchain Verification**: The verifier contract's checkDACert function validates the certificate against operator signatures and stake thresholds

### Secure Dispersal Flow
Based on the EigenDA integration spec:

1. EigenDA Client converts raw payload bytes into a blob
2. Client fetches the appropriate EigenDACertVerifier contract address using the router
3. Client submits blob request to disperser and polls for BlobStatusReply
4. Once confirmation thresholds are met, client constructs the DACert from the reply
5. Client calls the verifier's checkDACert function for onchain verification
6. Based on verification status, client either returns the certificate or initiates failover

### Router-Based Verifier Selection
EigenDA V2 uses the EigenDACertVerifierRouter to dynamically select the appropriate verifier contract:
- The router maps certificate versions to their corresponding verifier contracts
- This allows for seamless upgrades and support for multiple certificate formats
- The client queries the router using the latest block number to get the verifier for the reference block

This architecture provides improved throughput and eliminates single points of failure while maintaining the same security guarantees as V1.
