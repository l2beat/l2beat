# Agglayer interop plugin plan (agglayer.ts)

Goal
- Add a new interop plugin that indexes Agglayer shared-bridge deposits (BridgeEvent)
  and matches them with claims (ClaimEvent) across ethereum, katana, and forknet.
- Always produce an InteropMessage for any bridge flow (ETH, ERC-20, or message-only).
- For token transfers (ETH or ERC-20), additionally produce an InteropTransfer.
- No config plugin: everything needed is on-chain logs.

Scope
- Supported networks (hardcoded for now):
  - 0: ethereum
  - 20: katana
  - 22: forknet
- Supported directions: all pairs among the three above (including katana <-> forknet).
- Events from Agglayer shared bridge only (BridgeEvent + ClaimEvent).

Key contracts and addresses
- AgglayerBridge (shared bridge): 0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe
  - Same address on ethereum, katana, forknet (per discovery references).

Event signatures (from discovery + provided examples)
- BridgeEvent(
    uint8 leafType,
    uint32 originNetwork,
    address originAddress,
    uint32 destinationNetwork,
    address destinationAddress,
    uint256 amount,
    bytes metadata,
    uint32 depositCount
  )
- ClaimEvent(
    uint256 globalIndex,
    uint32 originNetwork,
    address originAddress,
    address destinationAddress,
    uint256 amount
  )
- Transfer(address indexed from, address indexed to, uint256 value)  // for dst token inference

Global index formula (AgglayerBridge.sol)
- GLOBAL_INDEX_MAINNET_FLAG = 1 << 64
- if originNetwork == 0 (Ethereum):
  globalIndex = GLOBAL_INDEX_MAINNET_FLAG + depositCount
- else:
  globalIndex = ((originNetwork - 1) << 32) + depositCount

Validated against example txs
1) ETH -> Katana (Ethereum tx 0xc5dc...):
   - BridgeEvent.depositCount = 236263 (0x39ae7), originNetwork = 0
   - Computed globalIndex = 2^64 + 236263 = 18446744073709787879
   - Katana ClaimEvent.globalIndex matches (tx 0xb832...).
2) vbUSDT -> Katana (Ethereum tx 0x21e1...):
   - BridgeEvent.depositCount = 236262 (0x39ae6), originNetwork = 0
   - Katana ClaimEvent.globalIndex matches (tx 0x2d92...).
   - ClaimEvent.originAddress = L1 vbUSDT; dst Transfer mint is on vbUSDT L2 token.

Data requests (getDataRequests)
- AgglayerBridge events on all supported chains:
  - BridgeEvent
  - ClaimEvent (includeTxEvents: [Transfer])

Network mapping
- Use defineNetworks('agglayer', [...]) with:
  - { networkId: 0, chain: 'ethereum', bridge: ChainSpecificAddress('eth:0x2a3d...') }
  - { networkId: 20, chain: 'katana',  bridge: ChainSpecificAddress('katana:0x2a3d...') }
  - { networkId: 22, chain: 'forknet', bridge: ChainSpecificAddress('forknet:0x2a3d...') }
- Helper functions:
  - getNetworkById(id) -> network
  - getNetworkByChain(chain) -> network

Event types (createInteropEventType)
- AgglayerBridgeEvent (direction: outgoing, ttl ~30d)
  args:
  - matchId: string (globalIndex as string)
  - globalIndex: bigint
  - originNetwork: number
  - destinationNetwork: number
  - originAddress: EthereumAddress
  - destinationAddress: EthereumAddress
  - amount: bigint
  - srcTokenAddress?: Address32 (originAddress or NATIVE)
  - metadata?: `0x${string}`
  - $dstChain: string
- AgglayerClaimEvent (direction: incoming, ttl ~30d)
  args:
  - matchId: string
  - globalIndex: bigint
  - originNetwork: number
  - originAddress: EthereumAddress
  - destinationAddress: EthereumAddress
  - amount: bigint
  - dstTokenAddress?: Address32 (from Transfer log if present, else NATIVE for originAddress=0)

Capture phase logic (agglayer.ts)
BridgeEvent (AgglayerBridge)
- Parse BridgeEvent on any supported chain.
- Validate:
  - originNetwork and destinationNetwork are in supported set.
  - input.chain matches originNetwork’s chain (sanity check).
- Compute globalIndex + matchId.
- Map $dstChain from destinationNetwork.
- Derive srcTokenAddress:
  - if originAddress == EthereumAddress.ZERO -> Address32.NATIVE
  - else Address32.from(originAddress)
- Emit AgglayerBridgeEvent.

ClaimEvent (AgglayerBridge)
- Parse ClaimEvent on any supported chain.
- Validate originNetwork is supported.
- Compute matchId = globalIndex.toString() (use event value directly).
- Infer dstTokenAddress:
  - Scan txLogs for Transfer(to == destinationAddress, value == amount).
  - If found, dstTokenAddress = Address32.from(log.address).
  - Else if originAddress == EthereumAddress.ZERO -> Address32.NATIVE.
- Emit AgglayerClaimEvent.

Matching logic (matchTypes = [AgglayerClaimEvent])
- Find BridgeEvent by matchId, and confirm $dstChain == claim.ctx.chain.
- Build results:
  - Always emit Result.Message('agglayer.Message', { app: 'shared-bridge', srcEvent: bridge, dstEvent: claim })
  - If leafType indicates asset transfer or amount > 0, also emit Result.Transfer('agglayer.Transfer', {
      srcEvent: bridge,
      srcTokenAddress: bridge.args.srcTokenAddress,
      srcAmount: bridge.args.amount,
      dstEvent: claim,
      dstTokenAddress: claim.args.dstTokenAddress,
      dstAmount: claim.args.amount,
      // minted/burned flags: leave undefined for now, or:
      // if originNetwork == 0: srcWasBurned=false, dstWasMinted=true
    })
- For message-only (non-asset) leaves, emit only Message.

Open questions / follow-ups
- Identify AgglayerBridge topic0 0x3e59... event (appears before ClaimEvent).
- Confirm leafType semantics (0 = asset, 1 = message).
- For L2-origin assets, decide burned/minted flags based on bridge docs.
- Find forknet example txs and add to examples.jsonc.

Implementation checklist (next session)
1) Add plugin file:
   - packages/backend/src/modules/interop/plugins/agglayer.ts
2) (Optional) Add agglayer.networks.ts for mapping constants.
3) Register plugin:
   - packages/backend/src/modules/interop/plugins/index.ts (eventPlugins list)
4) Add plugin name:
   - packages/config/src/types.ts (InteropPluginName union)
5) Add examples:
   - packages/backend/src/modules/interop/examples/examples.jsonc
     - ETH -> Katana: L1 tx 0xc5dc..., L2 tx 0xb832...
     - vbUSDT -> Katana: L1 tx 0x21e1..., L2 tx 0x2d92...
6) Test:
   - NODE_OPTIONS="--no-experimental-strip-types" pnpm interop:example agglayer --simple
   - Verify transfer + message outputs for the two example flows.
