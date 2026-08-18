import { assert } from '@l2beat/shared-pure'
import type { ContractValue } from '../output/types'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'
import { Ocr3OffchainConfig } from './Ocr3OffchainConfig'

type ContractObject = { [key: string]: ContractValue | undefined }

function isObject(value: ContractValue | undefined): value is ContractObject {
  return typeof value === 'object' && !Array.isArray(value)
}

function reorder(values: ContractValue[], indices: number[]): ContractValue[] {
  return indices.map((index) => values[index] as ContractValue)
}

// CCIPHome stores the onchain and offchain parts of an OCR3 oracle identity in
// parallel arrays. Normalize them as a unit so that a pure oracle reordering
// does not produce a diff without breaking their index-based association.
export const CCIPOcr3Config: BaseTypeCaster = {
  cast: function (_arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(isObject(incomingValue), 'Value must be a CCIP OCR3 config object')

    const encodedOffchainConfig = incomingValue.offchainConfig
    assert(
      typeof encodedOffchainConfig === 'string' &&
        encodedOffchainConfig.startsWith('0x'),
      'offchainConfig must be a hex string',
    )

    const offchainConfig = Ocr3OffchainConfig.cast({}, encodedOffchainConfig)
    const decodedConfig = { ...incomingValue, offchainConfig }

    const nodes = incomingValue.nodes
    if (!Array.isArray(nodes) || !isObject(offchainConfig)) {
      return decodedConfig
    }

    const offchainPublicKeys = offchainConfig.offchainPublicKeys
    const peerIds = offchainConfig.peerIds
    const sharedSecretEncryptions = offchainConfig.sharedSecretEncryptions
    if (
      !Array.isArray(offchainPublicKeys) ||
      !Array.isArray(peerIds) ||
      !isObject(sharedSecretEncryptions)
    ) {
      return decodedConfig
    }

    const encryptions = sharedSecretEncryptions.encryptions
    if (!Array.isArray(encryptions)) return decodedConfig

    if (
      offchainPublicKeys.length !== nodes.length ||
      peerIds.length !== nodes.length ||
      encryptions.length !== nodes.length
    ) {
      return decodedConfig
    }

    const indexedP2pIds: { index: number; p2pId: string }[] = []
    for (const [index, node] of nodes.entries()) {
      if (!isObject(node) || typeof node.p2pId !== 'string') {
        return decodedConfig
      }
      indexedP2pIds.push({ index, p2pId: node.p2pId })
    }

    const indices = indexedP2pIds
      .sort((a, b) => {
        if (a.p2pId < b.p2pId) return -1
        if (a.p2pId > b.p2pId) return 1
        return a.index - b.index
      })
      .map(({ index }) => index)

    return {
      ...decodedConfig,
      nodes: reorder(nodes, indices),
      offchainConfig: {
        ...offchainConfig,
        offchainPublicKeys: reorder(offchainPublicKeys, indices),
        peerIds: reorder(peerIds, indices),
        sharedSecretEncryptions: {
          ...sharedSecretEncryptions,
          encryptions: reorder(encryptions, indices),
        },
      },
    }
  },
}
