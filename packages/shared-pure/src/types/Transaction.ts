export interface Transaction {
  hash: 'UNSUPPORTED' | (string & {})
  from?: string
  to?: string
  data?: string | string[]
  type?: string
}
