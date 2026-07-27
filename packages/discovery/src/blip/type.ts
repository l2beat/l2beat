type ShapeArg = string | [string, BlipSexp]
type ArrayOrT<T> = T | T[]

export interface BlipEnv {
  blockNumber?: number
  timestamp?: number
  chainName?: string
  address?: string
}

export const ENV_KEYS: readonly (keyof BlipEnv)[] = [
  'blockNumber',
  'timestamp',
  'chainName',
  'address',
]

export function isEnvKey(key: string): key is keyof BlipEnv {
  return (ENV_KEYS as readonly string[]).includes(key)
}

export type BlipSexp =
  | string
  | number
  | boolean
  | ['not', ...BlipSexp[]]
  | ['=', ...BlipSexp[]]
  | ['!=', ...BlipSexp[]]
  | ['<', ...BlipSexp[]]
  | ['>', ...BlipSexp[]]
  | ['and', ...BlipSexp[]]
  | ['+', ...BlipSexp[]]
  | ['-', BlipSexp, ...BlipSexp[]]
  | ['pipe', ...BlipSexp[]]
  | ['map', BlipSexp]
  | ['sort']
  | ['sort', BlipSexp]
  | ['pick', ...BlipSexp[]]
  | ['get', ...(string | number)[]]
  | ['set', ArrayOrT<string | number>, BlipSexp]
  | ['filter', BlipSexp]
  | ['find', BlipSexp]
  | ['env', string]
  | ['format', string]
  | ['if', BlipSexp, BlipSexp, BlipSexp]
  | ['delete', ...(string | number)[]]
  | ['shape', ...ShapeArg[]]
  | ['to_entries']
  | ['length']
  | ['map_values', BlipSexp]
  | ['map_keys', BlipSexp]
