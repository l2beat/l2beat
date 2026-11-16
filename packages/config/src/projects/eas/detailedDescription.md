An attestation is a record with an attester, an optional recipient, a schema and data. EAS stores it under a unique id. The attester is the address that sent the transaction. EAS checks no content, so an attestation is worth as much as its attester's word.

### Schemas

A schema sets the fields of its attestations, whether they can be revoked and, optionally, a resolver. Anyone can register one in the SchemaRegistry. Its id is the hash of these three parts, so a registered schema never changes. EAS stores the data as raw bytes and does not check it against the fields.

### Resolvers

A resolver is a contract that the schema's creator chooses. EAS calls it on every attestation and revocation under that schema and stops when it refuses. A resolver can limit who attests, charge ETH or block revocations. EAS forwards the ETH that the sender assigns to it, and the resolver's code decides what happens with it.

Anyone can register the same fields without a resolver. That is a separate schema with its own id.

### Revocation and expiry

Only the attester can revoke, and only when both the schema and the attestation allow it. A revoked attestation stays stored, with the time of its revocation.

An attester can set an expiry time. EAS stores it and does nothing when it passes. Its `isAttestationValid` function returns true for every attestation that exists, revoked and expired ones included.

### Delegated attestations

An attester can sign a request and let someone else submit it and pay the gas. The attestation names the signer as attester.

Each signature carries the attester's next counter value and works once. In v{{version}} it has no deadline. To void an unused one, the attester submits another signed request first. Contract accounts cannot sign such a request and have to attest directly.

### ETH

ETH sent with an attestation goes to the resolver, and EAS refunds the rest. One case is missing in v{{version}}: when the schema has no resolver, EAS keeps the ETH and no function can move it out. Later versions refund it.

### Offchain attestations

An offchain attestation is a signed message that is never sent to the chain. Made with the SDK, it exists only where its signer sends it. Every holder can check it and pass it on with the signature. Its time is the signer's own claim.

EAS can timestamp an offchain attestation's id, once, and lets an address record that it revoked one. Both show the id and the sender's address onchain. The SDK adds a random salt, so the id reveals nothing about the content.

The SDK's optional `verifyOnchain` check sends the content to the node it uses.

### Private data attestations

The SDK can hash each field with a random salt and attest only the combined hash, onchain or offchain. The holder then reveals chosen fields, and anyone can check them against the hash. A revealed field is shown in the clear. Attester, recipient and time of an onchain attestation stay public.

### Interfaces

The EAS team runs easscan.org, an explorer that also registers schemas and makes attestations. It serves a search API and stores the offchain attestations that users publish there.

The SDK and the command-line tool easctl call the contracts directly, through any Ethereum node. easctl's search commands use the easscan.org API.

### Versions and other chains

The Ethereum deployment dates from {{deployDate}} and is v{{version}}. Most other chains run newer versions, and all use other addresses. On OP Mainnet and Base, EAS is upgradeable through the chain's proxy admin contract. This page covers Ethereum.

### Use by ETHBEAT

ETHBEAT publishes the list of protocols it reviewed for CROPS as attestations in this deployment.
