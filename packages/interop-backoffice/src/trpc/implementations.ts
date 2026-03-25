type MemoryResponse = {
  rss: string
  heapTotal: string
  heapUsed: string
  external: string
  arrayBuffers: string
}

export type StatusImplementations = {
  memory(): Promise<MemoryResponse>
}

export type InteropBackofficeApiImplementations = {
  status: StatusImplementations
}
