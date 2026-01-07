export interface Transaction {
  hash?: string
  from?: string
  to?: string
  data?: string | string[]
  type?: string
  value?: bigint
}
