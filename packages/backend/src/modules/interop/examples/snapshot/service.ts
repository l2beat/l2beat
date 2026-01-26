import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { gunzipSync, gzipSync } from 'zlib'
import { fromSafeJSON, sortKeys, toSafeJSON } from './json'

interface Options {
  rootDir: string
  noCompression: boolean
}

export interface ExampleManifestEntry {
  definitionHash: string
  sealedAt: string
}

export interface SnapshotsManifest {
  version: number
  examples: Record<string, ExampleManifestEntry>
}

export class SnapshotService {
  constructor(private readonly options: Options) {}

  async saveInputs(exampleName: string, inputs: ExampleInputs): Promise<void> {
    const path = this.getExampleInputsPath(exampleName)
    const content = await inputs.readAll()
    await this.save(path, toSafeJSON(content, this.options.noCompression))
  }

  async saveOutputs(exampleName: string, outputs: unknown): Promise<void> {
    const path = this.getExampleOutputsPath(exampleName)
    await this.save(path, toSafeJSON(outputs, this.options.noCompression))
  }

  async readInputs(exampleName: string): Promise<ExampleInputs> {
    const path = this.getExampleInputsPath(exampleName)
    const content = await this.read(path)
    const inputs = new ExampleInputs()
    inputs.writeAll(fromSafeJSON<Partial<RawExampleInputs>>(content))
    return inputs
  }

  async readOutputs(exampleName: string): Promise<unknown> {
    const path = this.getExampleOutputsPath(exampleName)
    const content = await this.read(path)
    return fromSafeJSON(content)
  }

  async updateManifest(
    exampleName: string,
    definitionHash: string,
  ): Promise<void> {
    const manifest = await this.readManifest()
    manifest.examples[exampleName] = {
      definitionHash,
      sealedAt: new Date().toISOString(),
    }
    await this.saveManifest(manifest)
  }

  readManifest(): SnapshotsManifest {
    const manifestPath = this.getManifestPath()
    try {
      const content = readFileSync(manifestPath, 'utf-8')
      return JSON.parse(content) as SnapshotsManifest
    } catch {
      return { version: 1, examples: {} }
    }
  }

  private async saveManifest(manifest: SnapshotsManifest): Promise<void> {
    const manifestPath = this.getManifestPath()
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2))
  }

  private getManifestPath(): string {
    return join(this.options.rootDir, 'manifest.json')
  }

  createEmptyExampleInputs(): ExampleInputs {
    return new ExampleInputs()
  }

  private getExampleInputsPath(exampleName: string): string {
    return join(
      this.options.rootDir,
      `${exampleName}-inputs.json${this.options.noCompression ? '' : '.gz'}`,
    )
  }

  private getExampleOutputsPath(exampleName: string): string {
    return join(
      this.options.rootDir,
      `${exampleName}-outputs.json${this.options.noCompression ? '' : '.gz'}`,
    )
  }

  private save(path: string, content: string): Promise<void> {
    return writeFile(
      path,
      this.options.noCompression ? content : gzipSync(content),
    )
  }

  private async read(path: string): Promise<string> {
    if (this.options.noCompression) {
      return readFile(path, 'utf-8')
    }
    const buffer = await readFile(path)
    return gunzipSync(buffer).toString('utf-8')
  }

  async readAvailableSnapshots(): Promise<string[]> {
    const files = await readdir(this.options.rootDir)
    const examplesWithInputs = new Set<string>()
    const examplesWithOutputs = new Set<string>()

    for (const file of files) {
      const inputMatch = file.match(/^(.+)-inputs\.json(\.gz)?$/)
      if (inputMatch) {
        examplesWithInputs.add(inputMatch[1])
        continue
      }

      const outputMatch = file.match(/^(.+)-outputs\.json(\.gz)?$/)
      if (outputMatch) {
        examplesWithOutputs.add(outputMatch[1])
      }
    }

    return [...examplesWithInputs].filter((name) =>
      examplesWithOutputs.has(name),
    )
  }
}
type InputSource = 'rpc' | 'config'

export type RawExampleInputs = Record<InputSource, Record<string, unknown>>

export class ExampleInputs {
  private content: RawExampleInputs = {
    rpc: {},
    config: {},
  }

  readRpc<T>(key: string): Promise<T | undefined> {
    return Promise.resolve(this.content.rpc[key] as T | undefined)
  }

  readAll(): Promise<Record<string, unknown>> {
    return Promise.resolve(this.content)
  }

  readSpace(source: InputSource): Record<string, unknown> {
    return this.content[source]
  }

  writeSpace(source: InputSource, content: Record<string, unknown>): void {
    this.content[source] = content
  }

  writeRpc<T>(key: string, value: T): Promise<void> {
    this.content.rpc[key] = value
    return Promise.resolve()
  }

  writeAll(
    content: Partial<RawExampleInputs> | null | undefined,
  ): Promise<void> {
    const safeContent = content ?? {}
    this.content = {
      rpc: safeContent.rpc ?? {},
      config: safeContent.config ?? {},
    }
    return Promise.resolve()
  }
}

export function buildSnapshotKey(params: string[]): string {
  return params.join('.')
}

export function hashExampleDefinition(definition: unknown): string {
  const normalized = JSON.stringify(sortKeys(definition))
  return createHash('sha256').update(normalized).digest('hex')
}
