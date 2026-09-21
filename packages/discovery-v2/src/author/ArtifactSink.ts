/**
 * Where an authoring run leaves its trail.
 *
 * A model-authored plan is only reviewable with the prompt that produced it,
 * the raw responses and the findings of each round, so the loop writes each
 * of them as it goes rather than keeping them in memory until the end (a
 * killed run still leaves evidence). The sink is an interface so the loop's
 * tests read the trail from memory instead of a temporary directory.
 */
import fs from 'fs'
import path from 'path'

export interface ArtifactSink {
  write(name: string, content: string): void
}

export class FileArtifactSink implements ArtifactSink {
  constructor(readonly directory: string) {}

  write(name: string, content: string): void {
    fs.mkdirSync(this.directory, { recursive: true })
    fs.writeFileSync(path.join(this.directory, name), content)
  }
}

export class MemoryArtifactSink implements ArtifactSink {
  readonly files = new Map<string, string>()

  write(name: string, content: string): void {
    this.files.set(name, content)
  }
}
