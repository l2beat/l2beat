# Canonical bridge

A holder of an asset on a chain asks who controls it and what mechanism and actor backs the balance. TVS, stages, the risk view, ossification and warnings each answer a part, together describing the full notion of 'canonical'.

## Backing

- **Canonical:** assets in an escrow that releases them only against the chain's own state validation, through the chain's messaging.
- **External:** assets whose release depends on another system's validation.
- **Native:** assets whose main ledger is the chain itself.

## Additional trust assumptions

The holder already trusts the core governance and the asset's issuer. A party beyond that which can upgrade, pause, censor, limit, steal or invest a canonical escrow or its counterpart on the chain is an additional trust assumption.

## The core

The core is the messaging bridge, the state validation, their governance and the canonical escrows without additional trust assumptions. Every score is assigned to the core: the Stage, the risk view, the [ossification perimeter](./ossification.md#choosing-the-critical-perimeter) and the red warnings.
