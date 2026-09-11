CROPS is L2BEAT's review of a protocol along four crops: censorship resistance, open source, privacy and security. Each crop gets a sentiment (good, warning, bad or neutral) and a status saying how far the review went. A protocol is in the garden when no crop is bad. Separately, the set of reviewed protocols is attested onchain with the Ethereum Attestation Service.

Every response is a static file generated from the L2BEAT repository, so it is served from a CDN with no API key and no rate limit.

## Not found means not reviewed

`/v1/project/{id}.json` and `/v1/address/{chainId}/{address}.json` answer 404 with an empty body when L2BEAT has not reviewed the project or the address. Treat 404 as "not reviewed", not as an error.

## Address lookups

Address files are keyed by EIP-155 chain id and lowercase address, both in the path and in the `addresses` map of `/v1/addresses.json` (as `chainId:address`). Lowercase the address before you build the URL. A contract, a proxy implementation behind it, and a permission holder such as a governance multisig all resolve to the protocol. A shared contract lists every protocol that claims it, each once, with the name that protocol gives it.

{{ATTESTATION_NETWORK_SECTION}}

## Verifying the set onchain

1. Read the attestation from the EAS contract with the uid in `attestations.current`: `getAttestation(uid)`.
2. Check `revocationTime == 0`. When the set changes L2BEAT revokes the old attestation and issues the next revision, so a revoked attestation is a stale claim and must not be shown.
3. Check `attester` and `schema` against `attestations.attester` and `attestations.schemaUid`, so an attestation someone else made cannot be mistaken for L2BEAT's.
4. Decode `projectIds` - these are the protocols L2BEAT has reviewed, as of `reviewedAt`, at revision `revision`.
5. For the rating per crop, the reasoning and what was not looked at, read `/v1/project/{id}.json`.
