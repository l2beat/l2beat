export interface SignatureClient {
  getSignature(selector: string): Promise<string>
  getSignatures(selectors: string[]): Promise<Record<string, string>>
}
