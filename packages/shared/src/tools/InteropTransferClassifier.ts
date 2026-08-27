import type {
  InteropBridgeType,
  KnownInteropBridgeType,
} from '@l2beat/shared-pure'

/**
 * The src/dst split carries no meaning to matching — every qualifier accepts
 * either side — so callers with undirected data (token relations) may assign
 * the sides arbitrarily.
 */
export interface InteropPluginObservation {
  plugin: string
  bridgeType: KnownInteropBridgeType | undefined
  srcChain: string
  dstChain: string
  srcAbstractTokenId?: string
  dstAbstractTokenId?: string
}

export interface InteropTransferForClassification
  extends InteropPluginObservation {
  srcEventId: string | undefined
  dstEventId: string | undefined
  srcWasBurned: boolean | undefined
  dstWasMinted: boolean | undefined
  srcAbstractTokenId: string | undefined
  dstAbstractTokenId: string | undefined
}

export interface InteropTransferPluginMatcher {
  plugin: string
  bridgeType: KnownInteropBridgeType
  chain?: string
  abstractTokenId?: string
}

export interface ClassifiedTransfers<TTransfer> {
  lockAndMint: TTransfer[]
  burnAndMint: TTransfer[]
  nonMinting: TTransfer[]
  unknown: TTransfer[]
}

/**
 * The one matching path from plugin sightings to projects'
 * `interopConfig.plugins` — aggregation, transfer resolution, and minter
 * resolution all use it. See
 * docs/mdbook/specs/l2b_specs/interop_plugin_matching.md.
 */
export class InteropTransferClassifier {
  classifyTransfers<TTransfer extends InteropTransferForClassification>(
    transfers: TTransfer[],
    plugins: InteropTransferPluginMatcher[],
  ): ClassifiedTransfers<TTransfer> {
    const matcher = this.createMatcher(plugins)
    const filtered = transfers.filter(matcher)

    return this.groupByBridgeType(filtered)
  }

  filterTransfers<TTransfer extends InteropTransferForClassification>(
    transfers: TTransfer[],
    plugins: InteropTransferPluginMatcher[],
  ): TTransfer[] {
    const matcher = this.createMatcher(plugins)
    return transfers.filter(matcher)
  }

  /**
   * Unlike {@link createMatcher} there is no unknown-bridge-type leniency:
   * an observation's bridge type is authoritative.
   */
  createPluginMatcher<TObservation extends InteropPluginObservation>(
    plugins: InteropTransferPluginMatcher[],
  ): (observation: TObservation) => boolean {
    return this.createQualifiedMatcher<TObservation>(
      plugins,
      (plugin) => (observation) =>
        plugin.plugin === observation.plugin &&
        plugin.bridgeType === observation.bridgeType,
    )
  }

  createMatcher<TTransfer extends InteropTransferForClassification>(
    plugins: InteropTransferPluginMatcher[],
  ): (transfer: TTransfer) => boolean {
    return this.createQualifiedMatcher<TTransfer>(
      plugins,
      (plugin) => (transfer) => {
        const transferBridgeType =
          transfer.bridgeType ??
          InteropTransferClassifier.inferBridgeType(transfer)
        const isOneSidedWithUnknownBridgeType =
          InteropTransferClassifier.isOneSided(transfer) &&
          transferBridgeType === 'unknown'

        return (
          plugin.plugin === transfer.plugin &&
          (isOneSidedWithUnknownBridgeType ||
            plugin.bridgeType === transferBridgeType)
        )
      },
    )
  }

  groupByBridgeType<TTransfer extends InteropTransferForClassification>(
    records: TTransfer[],
  ): ClassifiedTransfers<TTransfer> {
    const lockAndMint: TTransfer[] = []
    const burnAndMint: TTransfer[] = []
    const nonMinting: TTransfer[] = []
    const unknown: TTransfer[] = []

    for (const record of records) {
      const bridgeType =
        record.bridgeType ?? InteropTransferClassifier.inferBridgeType(record)

      switch (bridgeType) {
        case 'lockAndMint':
          lockAndMint.push(record)
          break
        case 'burnAndMint':
          burnAndMint.push(record)
          break
        case 'nonMinting':
          nonMinting.push(record)
          break
        case 'unknown':
          unknown.push(record)
          break
      }
    }

    return { lockAndMint, burnAndMint, nonMinting, unknown }
  }

  /**
   * A new qualifier on {@link InteropTransferPluginMatcher} belongs here, so
   * every variant honors it. A qualifier that needs evidence only transfers
   * carry cannot be honored for observations — prefer splitting the plugin
   * (as axelar-its was) over reintroducing such a field.
   */
  private createQualifiedMatcher<TTarget extends InteropPluginObservation>(
    plugins: InteropTransferPluginMatcher[],
    identityCondition: (
      plugin: InteropTransferPluginMatcher,
    ) => (target: TTarget) => boolean,
  ): (target: TTarget) => boolean {
    const conditions = plugins.map((plugin) => {
      const pluginConditions = [identityCondition(plugin)]

      if (plugin.chain) {
        pluginConditions.push(
          (target) =>
            plugin.chain === target.srcChain ||
            plugin.chain === target.dstChain,
        )
      }

      if (plugin.abstractTokenId) {
        pluginConditions.push(
          (target) =>
            plugin.abstractTokenId === target.srcAbstractTokenId ||
            plugin.abstractTokenId === target.dstAbstractTokenId,
        )
      }

      return pluginConditions
    })

    return (target) =>
      conditions.some((pluginConditions) =>
        pluginConditions.every((condition) => condition(target)),
      )
  }

  static inferBridgeType(
    transfer: Pick<
      InteropTransferForClassification,
      'srcWasBurned' | 'dstWasMinted'
    >,
  ): InteropBridgeType {
    if (
      (transfer.srcWasBurned === false && transfer.dstWasMinted === true) ||
      (transfer.srcWasBurned === true && transfer.dstWasMinted === false)
    ) {
      return 'lockAndMint'
    }
    if (transfer.srcWasBurned === true && transfer.dstWasMinted === true) {
      return 'burnAndMint'
    }
    if (transfer.srcWasBurned === false && transfer.dstWasMinted === false) {
      return 'nonMinting'
    }
    return 'unknown'
  }

  /**
   * Which side of a `lockAndMint` transfer holds the locked (escrowed) token.
   * The other side holds the minted representation, so this one answer covers
   * the whole role assignment.
   *
   * `undefined` means the observed flags do not identify a side: either neither
   * was observed, or they contradict the `lockAndMint` classification (both
   * sides look locked, or both look supply-changing) — which a plugin-declared
   * bridge type can produce. Both cases are the same thing to a caller: no
   * usable evidence.
   */
  static inferLockedTransferSide(
    transfer: Pick<
      InteropTransferForClassification,
      'srcWasBurned' | 'dstWasMinted'
    >,
  ): 'src' | 'dst' | undefined {
    const srcIsLocked =
      transfer.srcWasBurned === false || transfer.dstWasMinted === true
    const dstIsLocked =
      transfer.srcWasBurned === true || transfer.dstWasMinted === false

    if (srcIsLocked === dstIsLocked) return undefined
    return srcIsLocked ? 'src' : 'dst'
  }

  static isOneSided(
    transfer: Pick<
      InteropTransferForClassification,
      'srcEventId' | 'dstEventId'
    >,
  ): boolean {
    const hasSrcEvent = transfer.srcEventId !== undefined
    const hasDstEvent = transfer.dstEventId !== undefined

    return hasSrcEvent !== hasDstEvent
  }
}
