export type json =
  | string
  | number
  | boolean
  | null
  | json[]
  | { [key: string]: json }
