export interface SignatureClient {
  getName(): string
  getSignature(selector: string): Promise<string>
  getSignatures(selectors: string[]): Promise<Record<string, string>>
}
