Generated with discovered.json: 0x02e9631ae81e19857a1a5b1e97ab4b442fd8b94a

# Diff at Fri, 14 Aug 2026 13:52:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1786715187

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract RelayDepository (base:0x4cD00E387622C35bDDB9b4c962C136462338BC31) [relay/RelayDepository]
    +++ description: Escrow entry point of the Relay settlement protocol: user deposits for crosschain intents are parked here, tagged only by an event that attributes them to an order id. The contract keeps no balance accounting and does not verify orders or fills - all accounting happens offchain and on the Hub contract on the Relay Chain. Funds leave the contract exclusively through execute(), which performs arbitrary external calls authorized by a single signature of the current allocator (replay-protected by nonce and expiration).
```

```diff
+   Status: CREATED
    contract RelayReceiver (base:0xa5F565650890fBA1824Ee0F21EbBbF660a179934) [relay/RelayReceiver]
    +++ description: Passthrough deposit contract of the legacy Relay flow: any native tokens sent to it are immediately forwarded to a solver address hardcoded at deployment, and the attached calldata is only emitted as an event that commits the payment to a Relay order id. The contract holds no funds and enforces nothing about the order - after the forward, the user's outcome depends entirely on the solver. ERC20 payments in this flow do not even touch this contract and are transferred to the solver directly.
```

```diff
+   Status: CREATED
    contract RelayRouterV3 (base:0xb92fe925DC43a0ECdE6c8b1a2709c170Ec4fFf4f) [relay/RelayRouterV3]
    +++ description: Stateless multicall router used to atomically execute the calls of a Relay quote (swaps, bridge deposits, transfers to the solver). It has no owner and no privileged roles, and it is not supposed to hold funds between transactions: anyone can sweep balances left in it via the public cleanup functions.
```

```diff
+   Status: CREATED
    contract RelayApprovalProxyV3 (base:0xCcC88a9d1B4ED6b0EABA998850414b24f1c315bE) [relay/RelayApprovalProxyV3]
    +++ description: ERC20 entry point of the Relay v3 flow: it pulls user tokens (via direct approvals or EIP-2612 / ERC-3009 / Permit2 signatures) and forwards them to the RelayRouterV3, where the calls of the Relay quote are executed atomically. Token pulls are only possible from msg.sender or with the token owner's signature, so user approvals to this contract cannot be spent by its owner.
```
