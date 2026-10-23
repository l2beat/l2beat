import type { ApiAddressEntry } from '../../../../../api/types'
import type { Field, Node } from '../State'
import { NODE_WIDTH } from './constants'

export function makeNode(
  entry: ApiAddressEntry,
  options: {
    isInitial: boolean
    hueShift: number
    fields: Field[]
    hiddenFields: string[]
  },
): Node {
  const [prefix, address] = entry.address.split(':') as [string, string]
  const isEoa = entry.type === 'EOA' || entry.type === 'EOAPermissioned'
  const fallback = `${isEoa ? 'EOA ' : ''}${prefix}:${address.slice(0, 6)}…${address.slice(-4)}`
  return {
    id: entry.address,
    isInitial: options.isInitial,
    isReachable: entry.isReachable,
    hasTemplate: 'template' in entry && entry.template !== undefined,
    name: entry.name ?? fallback,
    addressType: entry.type,
    address,
    box: { x: 0, y: 0, width: NODE_WIDTH, height: 0 },
    color: 0,
    hueShift: options.hueShift,
    data: null,
    fields: options.fields,
    hiddenFields: options.hiddenFields,
    compressedRows: [],
    opened: false,
    subnodes: [],
  }
}
