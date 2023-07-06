export interface ValueType extends String {
  _ValueTypeBrand: string
}

export function ValueType(value: string): ValueType {
  if (!TYPES.includes(value)) {
    throw new TypeError('Invalid ValueType')
  }
  return value as unknown as ValueType
}

const TYPES = [
  'TVL', // Total Value Locked
  'CBV', // Canonically Bridged Value
  'EBV', // Externally Bridged Value
  'NMV', // Natively Minted Value
]

ValueType.TVL = ValueType(TYPES[0])
ValueType.CBV = ValueType(TYPES[1])
ValueType.EBV = ValueType(TYPES[2])
ValueType.NMV = ValueType(TYPES[3])
