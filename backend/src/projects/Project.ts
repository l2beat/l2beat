export interface Project {
  name: string
  bridges: {
    address: string
    sinceBlock: number
    tokens: string[]
  }[]
}
