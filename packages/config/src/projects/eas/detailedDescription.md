An attestation is a record with an attester, an optional recipient, a schema and data. EAS stores it under a unique id and checks no content, so it is worth as much as its attester's word. The attester is the address that sent the transaction, or one that signed a request for someone else to submit.

A schema sets the fields of its attestations, whether they can be revoked and, optionally, a resolver. Its id is the hash of these three parts, so a registered schema never changes. EAS does not check the data against these fields.

### Revocation and expiry

Only the attester can revoke, and only when both the schema and the attestation allow it. A revoked attestation stays stored, with the time of its revocation. EAS also stores an expiry time and does nothing when it passes. Its `isAttestationValid` function returns true for every attestation that exists, revoked and expired ones included.

### Resolvers

A resolver is a contract that the schema's creator chooses. EAS calls it on every attestation and revocation under that schema and stops when it refuses. A resolver can limit who attests, charge ETH or block revocations. Anyone can register the same fields without a resolver, as a separate schema with its own id.

ETH sent with an attestation goes to the resolver, and EAS refunds the rest. When the schema has no resolver, v{{version}} skips the refund, and no function can move the ETH out. In a batch, the last schema decides. Later versions refund it.

### Offchain attestations

An offchain attestation is a signed message never sent to the chain. Made with the SDK, it exists only where its signer sends it, and its time is the signer's own claim. EAS can timestamp its id, once. By default the SDK adds a random salt, so the id reveals nothing about the content. Ids made before SDK 1.4.0 have no salt. With the SDK's `verifyOnchain` option, the RPC provider receives the content for a test run.

A private data attestation holds a salted hash instead of its fields. Anyone can check a revealed field against the hash.

### Deployment and interfaces

The Ethereum deployment dates from {{deployDate}}. Most other chains run newer versions, all at other addresses. On OP Mainnet and Base, EAS is upgradeable through the chain's proxy admin contract.

The EAS team's explorer easscan.org also registers schemas and makes attestations, and stores the offchain attestations that users publish there. Search in the command-line tool easctl goes through its API.

ETHBEAT publishes the list of protocols it reviewed for CROPS as attestations in this deployment.
