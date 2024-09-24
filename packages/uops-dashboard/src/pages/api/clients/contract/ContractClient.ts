export interface ContractClient {
  getName(address: string): Promise<string>
}
