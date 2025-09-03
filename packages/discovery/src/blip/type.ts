type ShapeArg = string | [string, BlipSexp]
type ArrayOrT<T> = T | T[]

export type BlipSexp =
  | string
  | number
  | boolean
  | ['not', ...BlipSexp[]]
  | ['=', ...BlipSexp[]]
  | ['!=', ...BlipSexp[]]
  | ['and', ...BlipSexp[]]
  | ['pipe', ...BlipSexp[]]
  | ['map', BlipSexp]
  | ['pick', ...BlipSexp[]]
  | ['get', ...(string | number)[]]
  | ['set', ArrayOrT<string | number>, BlipSexp]
  | ['filter', BlipSexp]
  | ['find', BlipSexp]
  | ['format', string]
  | ['if', BlipSexp, BlipSexp, BlipSexp]
  | ['delete', ...(string | number)[]]
  | ['shape', ...ShapeArg[]]
  | ['to_entries']
  | ['length']
