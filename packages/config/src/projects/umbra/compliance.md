### Enforcement

The check [runs in the app's SDK](https://github.com/ScopeLift/umbra-protocol/blob/53ed4af5e575919680a4e70c1a090feafe365275/umbra-js/src/utils/utils.ts#L1100-L1190) when a wallet connects, pays, withdraws or scans. The app also hides payments from or to listed addresses. The immutable contracts check nothing. ScopeLift's relayer is closed and can refuse a token withdrawal. ScopeLift's list sits in the SDK's source, and the oracle is an onchain contract. Chainalysis alone decides what its oracle lists.

### Access to private data

Each oracle check sends the checked address to the app's RPC provider, for a payee before the payment exists.
