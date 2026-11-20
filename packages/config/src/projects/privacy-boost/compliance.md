### Enforcement

The contracts screen nothing. The operator screens offchain. Its [SDK](https://www.npmjs.com/package/@sunnyside-io/privacy-boost/v/1.3.3) marks each deposit as pending, legit or illicit before it becomes spendable. A transfer can also fail a compliance check. Its [terms](https://www.privacyboost.io/terms) name sanctions screening and geolocation controls. What is checked against which list is not published. Only the operator's relay settles deposits and only its enclave proves spends, so nothing inside the pool avoids the check. The enclave and the server are closed.

### Data access

An auditor can query the enclave's Audit API for any address's balance and history, without the user's consent. The admin multisig appoints auditors [without delay](#upgrades-and-governance). Nothing onchain ties a query to the access record the enclave is meant to write to the AuditGateway. The terms also let Sunnyside Labs use a viewing key for compliance and lawful requests.

### Proof of clean origin

The SDK has no viewing key for the user and no proof for a single payment.
