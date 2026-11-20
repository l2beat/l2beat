### Enforcement

The pool accepts a deposit from a Starknet address only with a [signature](https://github.com/starkware-libs/starknet-privacy/blob/fcc7c90f544ceb08621c32616bde29f1fdcbeb54/packages/privacy/src/privacy.cairo#L784-L803) of its screener key, at most 300 seconds old. A [screening service](https://github.com/starkware-libs/starknet-privacy/blob/f7fb72a9a7d0cb1a2ad447fec55c1207029ae093/elliptic-proxy/src/handler.ts#L185-L273) signs after checking the address with Elliptic. It refuses addresses [exposed](https://github.com/starkware-libs/starknet-privacy/blob/f7fb72a9a7d0cb1a2ad447fec55c1207029ae093/elliptic-proxy/src/scoring.ts#L40-L99) to illicit activity, sanctioned entities, obfuscation, the Bybit exploit or terrorism above set amounts. Its operator's own lists override Elliptic. Only provers with partner credentials get a signature. Five helper contracts are exempt, among them the CCTP bridge, so USDC bridged in from other chains enters unscreened. Transfers and withdrawals are not checked: a refused address can still register, receive from others and withdraw. The governance multisig can [replace](#upgrades-and-governance) the screener and auditor keys at once. The screening code and thresholds are public, the running build and its lists are not.

### Data access

The auditor key's use leaves no trace onchain. StarkWare [says](https://www.starknet.io/blog/compliance-layer-onchain-privacy-strk20/) that Financial Privacy Inc holds it in an enclave and reviews lawful requests. Each check names the depositing address to the prover, the screening service and Elliptic, before the deposit is sent.

### Proof of clean origin

The SDK has no proof for a single payment and none against a list.
