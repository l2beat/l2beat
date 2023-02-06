export interface SimpleNode {
  id: string
  name: string
  discovered: boolean
  fields: {
    name: string
    connection?: string
  }[]
  data?: unknown
}
