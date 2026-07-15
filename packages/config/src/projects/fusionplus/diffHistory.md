Generated with discovered.json: 0x23792b0abf8ed7ee59b7a17a80e3de4ee4965259

# Diff at Tue, 14 Jul 2026 10:49:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1784020108

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract FeeBank (eth:0x0AafA51a3F792e1fd2766c2E7cAb1E6710e94b3b) [fusionplus/FeeBank]
    +++ description: Custody contract for resolver fee-token deposits. Depositing increases the resolver's credit in the associated charger contract, while withdrawing reduces credit and returns only the still-available amount. The owner can collect credit already consumed as protocol fees and can rescue arbitrary assets held by the contract.
```

```diff
+   Status: CREATED
    contract EscrowDst (eth:0x9c3e06659f1c34F930cE97fCbce6e04ae88e535B) [fusionplus/EscrowDst]
    +++ description: Implementation for deterministic destination-chain escrow clones. Each clone holds the taker's destination token amount plus a native-token safety deposit. During the private withdrawal window only the taker can reveal the secret and release the tokens to the maker; during the public window an access-token holder can perform the same action. After cancellation starts, only the taker can recover the destination tokens. The caller executing a withdrawal or cancellation receives the safety deposit. After 8d, the taker can rescue any remaining token or native balance from the clone.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x9F8102b1bB05785BaD2874f2C7B1aaea4c6D976a) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract EscrowFactory (eth:0xa7bCb4EAc8964306F9e3764f67Db6A7af6DdF99A) [fusionplus/EscrowFactory]
    +++ description: Fusion+ factory and 1inch Limit Order Protocol extension. A source-chain order fill calls this contract through the configured Limit Order Protocol, validates the resolver against the order's time-dependent whitelist or access token, optionally charges the resolver fee, and deploys a deterministic EscrowSrc clone holding the maker's tokens. On the destination chain, anyone can fund and create the matching EscrowDst clone. Partial fills use Merkle proofs so each cumulative fill is bound to a different secret hash.
```

```diff
+   Status: CREATED
    contract ResolverAccessToken (eth:0xACCe550000159e70908C0499a1119D04e7039C28) [fusionplus/KycNFT]
    +++ description: Resolver Access Token (RES) used by this Fusion+ deployment. A balance of one marks an address as an authorized resolver: after an order's configured allowed time the holder can fill it outside its time-dependent whitelist (paying a fee when enabled), and after the relevant escrow timelocks the holder can execute public withdrawals or source-chain cancellations to the predetermined recipient in exchange for the safety deposit.
```

```diff
+   Status: CREATED
    contract EscrowSrc (eth:0xcD70bf33cFE59759851dB21c83ea47b6B83beF6A) [fusionplus/EscrowSrc]
    +++ description: Implementation for deterministic source-chain escrow clones. Each clone holds the maker's source token amount plus a resolver-funded native-token safety deposit. During the private withdrawal window only the swap's taker can reveal the secret and withdraw the tokens (optionally to another address); during the public window an access-token holder can do so only to the taker. After cancellation starts, the taker—or later an access-token holder—can return the tokens to the maker. The caller executing a withdrawal or cancellation receives the safety deposit. After 8d, the taker can rescue any remaining token or native balance from the clone.
```
