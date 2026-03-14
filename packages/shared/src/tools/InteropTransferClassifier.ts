import type {
  InteropBridgeType,
  KnownInteropBridgeType,
} from '@l2beat/shared-pure'

export interface InteropTransferForClassification {
  plugin: string
  bridgeType: KnownInteropBridgeType | undefined
  type: string
  srcChain: string
  dstChain: string
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
        return (
          plugin.plugin === transfer.plugin &&
          plugin.bridgeType === transferBridgeType
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
}
