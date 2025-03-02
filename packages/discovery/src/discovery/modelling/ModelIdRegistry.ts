import type { KnowledgeBase } from './KnowledgeBase'
import type { ClingoFact } from './factTypes'

interface AddressData {
  modelId: string
  chain: string
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
      const modelId = fact.params[0] as string
      const chain = fact.params[1] as string
      const address = fact.params[2] as string
      const data: AddressData = {
        modelId,
        address,
        chain,
        type: 'unknown',
      }
      this.dataByAddress[`${chain}:${address}`] = data
      this.dataById[modelId] = data
    })
    const updateData = (fact: ClingoFact, field: keyof AddressData) => {
      const modelId = fact.params[0] as string
      const value = fact.params[1] as string
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

  replaceIdsWithNames(s: string): string {
    return s.replace(
      /@@([a-zA-Z0-9_]+)/g,
      (_, id) => this.getAddressDataOrUndefined(id)?.name ?? id,
    )
  }
}
