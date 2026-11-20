### Enforcement

The app's SDK [refuses](https://github.com/ScopeLift/umbra-protocol/blob/53ed4af5e575919680a4e70c1a090feafe365275/umbra-js/src/utils/utils.ts#L1100-L1190) a connecting wallet, a payee and a withdrawal address that are on its own list or on Chainalysis's onchain sanctions oracle. The app also hides payments from or to listed addresses. The immutable contracts check nothing. ScopeLift's relayer is closed and can refuse a token withdrawal. The SDK's list is public in its source, Chainalysis alone decides what its oracle lists.

### Data access

Each oracle check sends the checked address to the app's RPC provider, for a payee before the payment exists.
