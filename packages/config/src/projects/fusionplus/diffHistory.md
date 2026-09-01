Generated with discovered.json: 0xbd9f7f5192e4c89ffaad0b65e710e3b121e84cf9

# Diff at Tue, 25 Aug 2026 08:51:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@afee435bc99a79b6a7bbb46fd9865fb0e8b74e89 block: 1786959128
- current timestamp: 1787647816

## Description

Whitelisted resolvers added.

## Watched changes

```diff
    contract ResolverAccessToken (eth:0xACCe550000159e70908C0499a1119D04e7039C28) [fusionplus/KycNFT] {
    +++ description: Resolver Access Token (RES) used by this Fusion+ deployment. A balance of one marks an address as an authorized resolver: after an order's configured allowed time the holder can fill it outside its time-dependent whitelist (paying a fee when enabled), and after the relevant escrow timelocks the holder can execute public withdrawals or source-chain cancellations to the predetermined recipient in exchange for the safety deposit.
+++ description: Latest owner of every token ID, reconstructed from Transfer events. Burned token IDs map to the zero address.
      values.tokenOwners.1200:
+        "eth:0xE66188dc4bD060ba6F8cfe9791F94FE4EbAc4713"
+++ description: Latest owner of every token ID, reconstructed from Transfer events. Burned token IDs map to the zero address.
      values.tokenOwners.1238:
+        "eth:0x23CaF227B33a6156876D22ad01D93D2D944ce160"
    }
```

Generated with discovered.json: 0xfe9f6b00471ad541f3fa46d1bf36a55a1e75198b

# Diff at Mon, 17 Aug 2026 09:33:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e15ee9ab50a72bce8c9055a32fc94661b3b947e2 block: 1786352475
- current timestamp: 1786959128

## Description

New resolver whitelisted.

## Watched changes

```diff
    contract ResolverAccessToken (eth:0xACCe550000159e70908C0499a1119D04e7039C28) [fusionplus/KycNFT] {
    +++ description: Resolver Access Token (RES) used by this Fusion+ deployment. A balance of one marks an address as an authorized resolver: after an order's configured allowed time the holder can fill it outside its time-dependent whitelist (paying a fee when enabled), and after the relevant escrow timelocks the holder can execute public withdrawals or source-chain cancellations to the predetermined recipient in exchange for the safety deposit.
+++ description: Latest owner of every token ID, reconstructed from Transfer events. Burned token IDs map to the zero address.
      values.tokenOwners.1170:
+        "eth:0xF6Ce0aa2FF888CFf754080B5384400B774fa72C8"
    }
```

Generated with discovered.json: 0x57206896665807dd00bc80e08456f034f48eecd2

# Diff at Mon, 10 Aug 2026 09:02:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@be83079eed365197a392b6bfd65fa6506007093c block: 1784623944
- current timestamp: 1786352475

## Description

Two new permissioned resolvers.

## Watched changes

```diff
    contract ResolverAccessToken (eth:0xACCe550000159e70908C0499a1119D04e7039C28) [fusionplus/KycNFT] {
    +++ description: Resolver Access Token (RES) used by this Fusion+ deployment. A balance of one marks an address as an authorized resolver: after an order's configured allowed time the holder can fill it outside its time-dependent whitelist (paying a fee when enabled), and after the relevant escrow timelocks the holder can execute public withdrawals or source-chain cancellations to the predetermined recipient in exchange for the safety deposit.
+++ description: Latest owner of every token ID, reconstructed from Transfer events. Burned token IDs map to the zero address.
      values.tokenOwners.44:
+        "eth:0x00000000000Ba9Cd9F5175108141A82B6c24d727"
+++ description: Latest owner of every token ID, reconstructed from Transfer events. Burned token IDs map to the zero address.
      values.tokenOwners.1157:
+        "eth:0x1cC561F5AE7e867C64129FFC942439707912F704"
    }
```

Generated with discovered.json: 0x873a3ff6636d5c6fc3723967a99b3c08750961ec

# Diff at Tue, 21 Jul 2026 08:55:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f20722ea086c21a6e3dedded355fc3e24528daf0 block: 1784020108
- current timestamp: 1784623944

## Description

Add new privileged resolver.

## Watched changes

```diff
    contract ResolverAccessToken (eth:0xACCe550000159e70908C0499a1119D04e7039C28) [fusionplus/KycNFT] {
    +++ description: Resolver Access Token (RES) used by this Fusion+ deployment. A balance of one marks an address as an authorized resolver: after an order's configured allowed time the holder can fill it outside its time-dependent whitelist (paying a fee when enabled), and after the relevant escrow timelocks the holder can execute public withdrawals or source-chain cancellations to the predetermined recipient in exchange for the safety deposit.
+++ description: Latest owner of every token ID, reconstructed from Transfer events. Burned token IDs map to the zero address.
      values.tokenOwners.1101:
+        "eth:0x9b1303EBf09BC51b7fac376c9E421E8daAe63B82"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1784020108 (main branch discovery), not current.

```diff
    contract ResolverAccessToken (eth:0xACCe550000159e70908C0499a1119D04e7039C28) [fusionplus/KycNFT] {
    +++ description: Resolver Access Token (RES) used by this Fusion+ deployment. A balance of one marks an address as an authorized resolver: after an order's configured allowed time the holder can fill it outside its time-dependent whitelist (paying a fee when enabled), and after the relevant escrow timelocks the holder can execute public withdrawals or source-chain cancellations to the predetermined recipient in exchange for the safety deposit.
      fieldMeta.tokenOwners.severity:
-        "HIGH"
    }
```

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
