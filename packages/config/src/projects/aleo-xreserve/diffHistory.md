Generated with discovered.json: 0xb20a99a9d1b83433837a1b00d9781706ef7bb902

# Diff at Mon, 16 Nov 2026 19:01:57 GMT:

- id: eb04616a
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1794855653

## Description

Initial discovery of Circle xReserve, its Gateway contracts and the depositor contract that holds the USDC backing USDCx on Aleo.

## Initial discovery

```diff
+   Status: CREATED
    contract GatewayMinter (eth:0x2222222d7164433c4C09B0b0D809a9b52C04C205) [tokens/circle/GatewayMinter]
    +++ description: Entrypoint or minter of USDC on this chain for the Gateway protocol.
```

```diff
+   Status: CREATED
    contract AleoDepositor (eth:0x36a8e347006e151F4A0E9559FEa239439611777a) [tokens/circle/RemoteDomainDepositor]
    +++ description: Depositor account of one remote domain in the GatewayWallet. It holds the USDC balance that backs the domain's stablecoin and approves Gateway burn intents through ERC-1271 when exactly `signatureThreshold` of its attesters sign.
```

```diff
+   Status: CREATED
    contract GatewayWallet (eth:0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE) [tokens/circle/GatewayWallet]
    +++ description: Exit point or burner of USDC on this chain for the Gateway protocol.
```

```diff
+   Status: CREATED
    contract xReserve (eth:0x8888888199b2Df864bf678259607d6D5EBb4e3Ce) [tokens/circle/xReserve]
    +++ description: Entry point for USDC-backed stablecoins on remote blockchains. It forwards each deposit to the GatewayWallet, credited to one depositor contract per remote domain, and pays out attested withdrawals through the GatewayMinter.
```
