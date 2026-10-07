import { expect } from 'earl'
import {
  pickByShape,
  resolveByShape,
  resolveConfig,
  resolveContract,
} from './resolveUtils'

interface Layer {
  a?: number
  b?: boolean
  c?: number
}
const SHAPE: Record<keyof Layer, unknown> = { a: null, b: null, c: null }

describe(resolveByShape.name, () => {
  it('fills missing keys from defaults in shape order', () => {
    const result = resolveByShape(SHAPE, { c: 3 } as Layer, { a: 1 })
    expect(Object.entries(result)).toEqual([
      ['a', 1],
      ['c', 3],
    ])
  })

  it('keeps explicit false and zero over defaults', () => {
    const result = resolveByShape(SHAPE, { a: 0, b: false } as Layer, {
      a: 1,
      b: true,
    })
    expect(result).toEqual({ a: 0, b: false })
  })
})

describe(pickByShape.name, () => {
  it('drops keys outside the shape', () => {
    const layer = { a: 1, d: 4 } as Layer
    expect(pickByShape(SHAPE, layer)).toEqual({ a: 1 })
  })
})

interface ContractLayer {
  name?: string
  fields?: Record<string, { x?: number }>
}
const CONTRACT_SHAPE: Record<keyof ContractLayer, unknown> = {
  name: null,
  fields: null,
}
const FIELD_SHAPE = { x: null }

describe(resolveContract.name, () => {
  it('keeps only field keys from the field shape', () => {
    const layer = { fields: { f: { x: 1, y: 2 } } } as ContractLayer
    const result = resolveContract(CONTRACT_SHAPE, FIELD_SHAPE, layer, {
      fields: {},
    })
    expect(result).toEqual({ fields: { f: { x: 1 } } })
  })
})

describe(resolveConfig.name, () => {
  interface ConfigLayer {
    name?: string
    overrides?: Record<string, ContractLayer>
  }
  const CONFIG_SHAPE: Record<keyof ConfigLayer, unknown> = {
    name: null,
    overrides: null,
  }
  const resolveName = (contract: ContractLayer) => contract.name ?? 'default'

  it('resolves every override', () => {
    const layer: ConfigLayer = { overrides: { x: {}, y: { name: 'y' } } }
    const result = resolveConfig(CONFIG_SHAPE, layer, {}, resolveName)
    expect(result).toEqual({ overrides: { x: 'default', y: 'y' } })
  })

  it('leaves out overrides when the layer has none', () => {
    const layer: ConfigLayer = { name: 'a' }
    const result = resolveConfig(CONFIG_SHAPE, layer, {}, resolveName)
    expect(Object.keys(result)).toEqual(['name'])
  })
})
