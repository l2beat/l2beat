export type BasicType = 'uint' | 'boolean' | 'bytes32' | 'address'

export type ValueType = ScalarType | ArrayType | MappingType

export interface ScalarType {
  kind: 'scalar'
  type: BasicType
}

export interface ArrayType {
  kind: 'array'
  type: BasicType
}

export interface MappingType {
  kind: 'mapping'
  keyType: BasicType
  valueType: BasicType
}

export interface StorageProperty {
  kind: 'storage'
  name: string
  slot: string | number
  type: ValueType
}

export interface EventProperty<T> {
  kind: 'event'
  name: string
  eventAbi: string
  initialValue: T
  reducer: (previousValue: T, event: unknown) => T
}
