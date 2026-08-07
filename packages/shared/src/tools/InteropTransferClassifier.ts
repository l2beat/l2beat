import {
  type InteropBridgeType,
  inferInteropBridgeType,
  type KnownInteropBridgeType,
} from '@l2beat/shared-pure'

export interface InteropTransferForClassification {
  plugin: string
  bridgeType: KnownInteropBridgeType | undefined
  type: string
  srcChain: string
  dstChain: string
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
  transferType?: string
}

export interface ClassifiedTransfers<TTransfer> {
  lockAndMint: TTransfer[]
  burnAndMint: TTransfer[]
  nonMinting: TTransfer[]
  unknown: TTransfer[]
}

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

  createMatcher<TTransfer extends InteropTransferForClassification>(
    plugins: InteropTransferPluginMatcher[],
  ): (transfer: TTransfer) => boolean {
    const conditions = this.buildMatchers<TTransfer>(plugins)
    return (transfer) =>
      conditions.some((pluginConditions) =>
        pluginConditions.every((condition) => condition(transfer)),
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

  private buildMatchers<TTransfer extends InteropTransferForClassification>(
    plugins: InteropTransferPluginMatcher[],
  ) {
    const conditions: ((transfer: TTransfer) => boolean)[][] = []

    for (const plugin of plugins) {
      const pluginConditions: ((transfer: TTransfer) => boolean)[] = []

      pluginConditions.push((transfer) => {
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
      })

      if (plugin.chain) {
        pluginConditions.push(
          (transfer) =>
            plugin.chain === transfer.srcChain ||
            plugin.chain === transfer.dstChain,
        )
      }

      if (plugin.abstractTokenId) {
        pluginConditions.push(
          (transfer) =>
            plugin.abstractTokenId === transfer.srcAbstractTokenId ||
            plugin.abstractTokenId === transfer.dstAbstractTokenId,
        )
      }

      if (plugin.transferType) {
        pluginConditions.push(
          (transfer) => plugin.transferType === transfer.type,
        )
      }

      conditions.push(pluginConditions)
    }

    return conditions
  }

  static inferBridgeType(
    transfer: Pick<
      InteropTransferForClassification,
      'srcWasBurned' | 'dstWasMinted'
    >,
  ): InteropBridgeType {
    return inferInteropBridgeType(transfer)
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
