import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ClingoFact } from './clingoparser'
import type { KnowledgeBase } from './KnowledgeBase'

interface AddressData {
  modelId: string
  shortChain: string
  address: string
  name?: string
  description?: string
  type: string
}

export class ModelIdRegistry {
  private readonly dataByAddress: Record<string, AddressData> = {}
  private readonly dataById: Record<string, AddressData> = {}
  constructor(public readonly knowledgeBase: KnowledgeBase) {
    this.buildMaps()
  }

  buildMaps() {
    const addressFacts = this.knowledgeBase.getFacts('address', [])
    addressFacts.forEach((fact) => {
      const modelId = String(fact.params[0])
      const shortChain = String(fact.params[1])
      const address = String(fact.params[2])
      const data: AddressData = {
        modelId,
        address,
        shortChain,
        type: 'unknown',
      }
      this.dataByAddress[`${shortChain}:${address}`] = data
      this.dataById[modelId] = data
    })
    const updateData = (fact: ClingoFact, field: keyof AddressData) => {
      const modelId = String(fact.params[0])
      const value = String(fact.params[1])
      const data = this.dataById[modelId]
      if (data === undefined) {
        throw new Error(`No address data found for modelId ${modelId}`)
      }
      data[field] = value
    }
    this.knowledgeBase
      .getFacts('addressName', [])
      .forEach((fact) => updateData(fact, 'name'))
    this.knowledgeBase
      .getFacts('addressType', [])
      .forEach((fact) => updateData(fact, 'type'))
    this.knowledgeBase
      .getFacts('addressDescription', [])
      .forEach((fact) => updateData(fact, 'description'))
  }

  getModelIdOrUndefined(chain: string, address: string): string | undefined {
    return this.dataByAddress[`${chain}:${address.toLowerCase()}`]?.modelId
  }

  getModelId(chain: string, address: string): string {
    const id = this.getModelIdOrUndefined(chain, address)
    if (id === undefined) {
      throw new Error(`No id found for ${chain}:${address}`)
    }
    return id
  }

  getAddressDataOrUndefined(modelId: string): AddressData | undefined {
    return this.dataById[modelId]
  }

  getAddressData(modelId: string): AddressData {
    const data = this.getAddressDataOrUndefined(modelId)
    if (data === undefined) {
      throw new Error(`No address data found for modelId ${modelId}`)
    }
    return data
  }

  idToChainSpecificAddress(modelId: string): ChainSpecificAddress {
    const data = this.getAddressData(modelId)
    return ChainSpecificAddress(data.address)
  }

  replaceIdsWithNames(s: string): string {
    return s.replace(
      /@@([a-zA-Z0-9_]+)/g,
      (_, id) => this.getAddressDataOrUndefined(id)?.name ?? id,
    )
  }
}
