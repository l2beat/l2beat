export interface CodeClient {
  getCodeHash(address: string): Promise<string | undefined>
}
