export type BlipSexp =
  | string
  | number
  | boolean
  | ['not', BlipSexp]
  | ['=', ...BlipSexp[]]
  | ['!=', ...BlipSexp[]]
  | ['and', ...BlipSexp[]]
