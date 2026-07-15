export interface SavedObject {
  id: string
  type: string
  attributes: Record<string, unknown>
  references: { id: string; type: string; name: string }[]
}

export class KibanaClient {
  constructor(
    private readonly url: string,
    private readonly apiKey: string,
  ) {}

  private async request(path: string): Promise<unknown> {
    const response = await fetch(`${this.url}${path}`, {
      headers: { Authorization: `ApiKey ${this.apiKey}` },
    })
    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Kibana ${path} returned ${response.status}: ${body}`)
    }
    return await response.json()
  }

  async getSavedObject(type: string, id: string): Promise<SavedObject> {
    return (await this.request(
      `/api/saved_objects/${type}/${encodeURIComponent(id)}`,
    )) as SavedObject
  }
}
